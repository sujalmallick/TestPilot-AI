import json

from utils import call_gemini,parse_json_response


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

If failed_test_case is TRUE, return:

{{
    "report_type": "Bug",
    "title": "",
    "bug_type": "",
    "severity": "",
    "priority": ""
}}

If failed_test_case is FALSE, return:

{{
    "report_type": "Observation",
    "observation_type": "",
    "severity": "",
    "suggested_action": ""
}}

Return ONLY valid JSON.
No markdown.
No explanations.
"""

    response = call_gemini(prompt)
    return parse_json_response(response)
