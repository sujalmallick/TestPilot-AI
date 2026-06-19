import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
import logging
from google.api_core.exceptions import (
    ResourceExhausted,
    InvalidArgument,
    GoogleAPIError
)
load_dotenv()
print("KEY:", os.getenv("GEMINI_API_KEY")[:15])

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s | %(message)s"
)

logger = logging.getLogger("TestPilot")

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Create Gemini model instance
model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def call_llm(prompt: str):
    logger.info("Sending request to Gemini")

    try:
        response = model.generate_content(prompt)
        return response.text

    except ResourceExhausted:
        return {
            "success": False,
            "error": "Gemini API quota exceeded."
        }

    except InvalidArgument as e:
        return {
            "success": False,
            "error": str(e)
        }

    except GoogleAPIError as e:
        return {
            "success": False,
            "error": str(e)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    logger.info("Sending request to Gemini")
    try:

        response = model.generate_content(prompt)

        return response.text

    except ResourceExhausted:

      logger.error("Gemini API quota exceeded.")
      return None

def parse_json_response(response):

    if response is None:

        return {
            "success": False,
            "error": "Gemini API quota exceeded."
        }

    try:

        cleaned = (
            response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned)

    except Exception:

        return {
            "success": False,
            "error": "Invalid JSON returned by Gemini.",
            "raw_response": response
        }