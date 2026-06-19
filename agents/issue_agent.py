import json
from utils import logger
from utils import call_llm, parse_json_response


def analyze_issue_agent(
    workflow,
    observation,
    expected_result,
    actual_result,
    failed_test_case
):

    prompt = f"""
You are a Senior QA Engineer.

Application Workflow:
{workflow}

Observation:
{observation}

Expected Result:
{expected_result}

Actual Result:
{actual_result}

Failed Test Case:
{failed_test_case}

Task:

If failed_test_case is TRUE, return EXACTLY:

{{
    "reportType": "Bug",
    "title": "",
    "bugType": "",
    "severity": "",
    "priority": ""
}}

If failed_test_case is FALSE, return EXACTLY:

{{
    "reportType": "Observation",
    "observationType": "",
    "severity": "",
    "suggestedAction": ""
}}

Rules:

- Return ONLY valid JSON.
- Use the field names EXACTLY as shown above.
- Do NOT use snake_case.
- No markdown.
- No explanations.
"""

    logger.info("Running Issue Analysis Agent")

    response = call_llm(prompt)

    if isinstance(response, dict):
        return response

    return parse_json_response(response)