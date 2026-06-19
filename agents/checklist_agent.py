from utils import call_llm, parse_json_response
from utils import logger


def generate_checklist_agent(
    workflow: str,
    modules: dict,
    critical_workflows: list,
    high_risk_areas: list
):

    prompt = f"""
You are a Senior QA Engineer.

Application Workflow:
{workflow}

Confirmed Modules:
{modules.get("confirmed_modules", [])}

Critical Workflows:
{critical_workflows}

High Risk Areas:
{high_risk_areas}

Generate an exploratory testing checklist.

Return ONLY valid JSON.

Format:

[
  {{
    "module": "Authentication",
    "items": [
      {{
        "id": "AUTH-001",
        "text": "Verify login with valid credentials",
        "confidence": "confirmed"
      }},
      {{
        "id": "AUTH-002",
        "text": "Verify login with invalid password",
        "confidence": "confirmed"
      }},
      {{
        "id": "AUTH-003",
        "text": "Verify SQL injection attempt",
        "confidence": "assumed"
      }}
    ]
  }}
]

Rules:

- One object per module.
- Each module should contain 3–8 checklist items.
- Every item must have:
    id
    text
    confidence
- confidence must be either:
    confirmed
    assumed
- Return ONLY JSON.
- No markdown.
- No explanations.
"""

    logger.info("Running Checklist Agent")

    response = call_llm(prompt)
    if isinstance(response, dict):
     return response

    return parse_json_response(response)
    