import os
import json
import logging
import re
import time

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s | %(message)s",
)

logger = logging.getLogger("BugMind")

from services.llm_manager import LLMManager
from database.session import SessionLocal
from services.llm_factory import build_llm_manager
from config import DEFAULT_PROVIDER, DEFAULT_MODEL

# Default LLM manager uses developer .env key, no user_id required.
default_llm_manager = LLMManager(
    provider=DEFAULT_PROVIDER,
    model=DEFAULT_MODEL,
)

# Tracks how many LLM requests have happened in this process lifetime.
# Dev-visibility counter only — not thread-safe, resets on restart.
_call_count = 0


def call_llm(
    prompt: str,
    user_id: int | None = None,
    _retry_on_quota: bool = True,
    _backoff_seconds: int = 15,
):
    """
    Sends a single request to the configured LLM provider.

    If user_id is provided, the user's stored AI settings (provider, model,
    and optionally their own API key) are loaded from the database via
    build_llm_manager(). Otherwise the server-level default is used.

    _retry_on_quota / _backoff_seconds: control a single automatic retry on
    rate-limit errors. These are internal params — callers just call
    call_llm(prompt) or call_llm(prompt, user_id=user_id).
    """
    global _call_count
    _call_count += 1

    logger.info(f"LLM request #{_call_count} | user_id={user_id}")

    try:
        if user_id:
            db = SessionLocal()
            try:
                manager = build_llm_manager(db, user_id)
            finally:
                db.close()
        else:
            manager = default_llm_manager

        response = manager.generate(prompt)

        if not response:
            return None

        return response

    except Exception as e:
        error_str = str(e).lower()

        # Handle rate limit / quota errors from any provider
        if any(kw in error_str for kw in ["rate limit", "quota", "429", "resource exhausted"]):
            if _retry_on_quota:
                logger.warning(
                    f"Rate/quota limit hit. Waiting {_backoff_seconds}s before one retry..."
                )
                time.sleep(_backoff_seconds)
                return call_llm(
                    prompt,
                    user_id=user_id,
                    _retry_on_quota=False,
                )
            logger.error("Quota exceeded (after backoff retry).")
            return None

        logger.error(f"LLM call failed: {e}")
        return None


def parse_json_response(response, prompt=None):
    if response is None:
        return {
            "success": False,
            "error": "No response returned from LLM."
        }

    if isinstance(response, dict):
        return response

    cleaned = response.strip()
    cleaned = cleaned.replace("```json", "")
    cleaned = cleaned.replace("```", "")
    cleaned = cleaned.strip()

    # Extract first JSON array/object
    match = re.search(r'(\{.*\}|\[.*\])', cleaned, re.DOTALL)
    if match:
        cleaned = match.group(1)

    try:
        return json.loads(cleaned)
    except Exception as e:
        logger.warning(f"JSON Parse Error: {e}")

        # Single self-healing retry — routed through call_llm() so it
        # shares the same quota/error handling as every other request.
        if prompt:
            logger.info("Attempting single self-healing retry...")
            retry_prompt = f"""
Original Prompt:
{prompt}

Your previous response failed JSON parsing with this error:
{str(e)}

Please correct the response and return ONLY valid JSON.
Do not wrap it in markdown. Do not include explanations.
"""
            retry_response = call_llm(retry_prompt)

            if retry_response:
                try:
                    retry_cleaned = retry_response.strip()
                    retry_cleaned = retry_cleaned.replace("```json", "").replace("```", "").strip()
                    retry_match = re.search(r'(\{.*\}|\[.*\])', retry_cleaned, re.DOTALL)
                    if retry_match:
                        retry_cleaned = retry_match.group(1)
                    return json.loads(retry_cleaned)
                except Exception as retry_err:
                    logger.error(f"JSON self-healing retry failed: {retry_err}")

        return {
            "success": False,
            "error": "Invalid JSON returned by AI.",
            "raw_response": response,
        }