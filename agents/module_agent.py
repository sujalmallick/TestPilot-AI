import json
from utils import logger
from utils import call_llm, parse_json_response


def identify_modules_agent(workflow: str):

    prompt = f"""
You are a Senior QA Architect.

Analyze this workflow:

{workflow}

Tasks:

1. Identify modules based ONLY on the workflow.
2. Categorize them as:

   * confirmed_modules: directly supported by the workflow
   * assumed_modules: likely but unconfirmed
   * unknown_areas: cannot be inferred
3. Identify critical user journeys.
4. Identify high-risk areas requiring extensive testing.
5. Avoid unsupported assumptions. If information is insufficient, acknowledge it.

Return ONLY valid JSON:

{{
"confirmed_modules": [],
"assumed_modules": [],
"unknown_areas": [],
"critical_workflows": [],
"high_risk_areas": []
}}

Rules:

* No markdown.
* No explanations outside JSON.
* Prefer accuracy over completeness.
"""

    
    logger.info("Running Module Agent")
    response = call_llm(prompt)
    return parse_json_response(response)