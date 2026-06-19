from utils import call_llm, parse_json_response
from utils import logger
from constants import TEST_CASE_STATUSES

def generate_test_cases_agent(
    workflow,
    modules,
    critical_workflows,
    high_risk_areas,
    observed_steps
):

    if observed_steps:

        formatted_steps = "\n".join(
            f"{i + 1}. {step}"
            for i, step in enumerate(observed_steps)
        )

        steps_section = f"""
Observed User Steps:
{formatted_steps}

Base the execution steps on these observed steps whenever applicable.
"""

    else:

        steps_section = """
No observed steps were provided.

Assume reasonable execution steps wherever necessary.
"""

    prompt = f"""
You are a Senior QA Engineer.

Application Workflow:
{workflow}

Confirmed Modules:
{", ".join(modules.get("confirmed_modules", []))}

Critical Workflows:
{", ".join(critical_workflows)}

High Risk Areas:
{", ".join(high_risk_areas)}

{steps_section}

Generate execution-ready manual test cases.

Return ONLY valid JSON.

Format:

[
  {{
    "module": "Authentication",
    "category": "Functional",
    "description": "Verify login with valid credentials",
    "objective": "Verify successful login",
    "preconditions": "User account exists",
    "steps": [
      "Open App",
      "Tap Login",
      "Enter valid email",
      "Enter valid password",
      "Tap Login"
    ],
    "inputData": "Valid Email, Valid Password",
    "expectedResult": "User is redirected to the dashboard",
    "priority": "High"
  }}
]

Rules:

- Cover ALL confirmed modules.
- Include Functional, Negative and Edge Case scenarios.
- Prioritize critical workflows.
- Include high-risk scenarios.
- Keep execution steps concise.
- Use observed steps whenever available.
- Priority must be one of:
  High
  Medium
  Low
- Category must be one of:
  Functional
  Negative
  Edge Case
  Security
  Regression
- Return ONLY valid JSON.
- No markdown.
- No explanations.
"""

    logger.info("Running Test Case Agent")

    response = call_llm(prompt)

    test_cases = parse_json_response(response)

    if isinstance(test_cases, list):

        for index, test_case in enumerate(test_cases, start=1):

            test_case["id"] = f"TC-{index:03d}"

            test_case["status"] = TEST_CASE_STATUSES["NOT_EXECUTED"]

    return test_cases