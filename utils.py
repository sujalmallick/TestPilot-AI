import os
import json
import logging

from dotenv import load_dotenv

import google.generativeai as genai

from google.api_core.exceptions import (
    ResourceExhausted,
    InvalidArgument,
    GoogleAPIError,
)

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s | %(message)s",
)

logger = logging.getLogger("BugMind")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("GEMINI_API_KEY not found.")

logger.info(f"Gemini Key Loaded: {api_key[:12]}...")

genai.configure(api_key=api_key)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash"
)


def call_llm(prompt: str):

    logger.info("Sending request to Gemini")

    try:

        response = model.generate_content(prompt)

        if not response.text:
            return None

        return response.text

    except ResourceExhausted:

        logger.error("Gemini quota exceeded.")

        return None

    except InvalidArgument as e:

        logger.error(e)

        return None

    except GoogleAPIError as e:

        logger.error(e)

        return None

    except Exception as e:

        logger.error(e)

        return None
import json
import re

def parse_json_response(response):

    if response is None:
        return {
            "success": False,
            "error": "No response returned from LLM."
        }

    if isinstance(response, dict):
        return response

    try:

        cleaned = response.strip()

        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

        # Extract first JSON array/object
        match = re.search(r'(\{.*\}|\[.*\])', cleaned, re.DOTALL)

        if match:
            cleaned = match.group(1)

        return json.loads(cleaned)

    except Exception as e:

        logger.error(f"JSON Parse Error: {e}")

        return {
            "success": False,
            "error": "Invalid JSON returned by AI.",
            "raw_response": response,
        }

    if response is None:
        return {
            "success": False,
            "error": "Gemini returned nothing.",
        }

    if isinstance(response, dict):
        return response

    cleaned = (
        response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    print("\n" + "=" * 100)
    print("CLEANED RESPONSE")
    print("=" * 100)
    print(cleaned)
    print("=" * 100 + "\n")

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError as e:

        logger.exception("JSON Parsing Failed")

        print("\n")
        print("=" * 100)
        print("JSON ERROR")
        print(e)
        print("=" * 100)
        print("\n")

        return {
            "success": False,
            "error": f"JSON Parse Error: {str(e)}",
            "raw_response": cleaned,
        }