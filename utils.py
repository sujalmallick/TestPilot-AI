import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Create Gemini model instance
model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def call_gemini(prompt: str):

    try:

        response = model.generate_content(prompt)

        return response.text

    except ResourceExhausted:

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