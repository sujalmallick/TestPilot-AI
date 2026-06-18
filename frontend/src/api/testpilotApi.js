import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export async function analyzeWorkflow(payload) {

    if (!payload.workflow.trim()) {

        throw new Error(
            "Describe the workflow first."
        );

    }

    const response = await api.post(
        "/analyze-workflow",
        {
            workflow: payload.workflow,
            observed_steps:
                payload.observedSteps
                    .split("\n")
                    .filter(step => step.trim() !== "")
        }
    );

    return response.data;

}

export async function classifyIssue(payload) {

    const response = await api.post(
        "/analyze-issue",
        {
            workflow: payload.workflow,
            observation: payload.observation,
            expected_result: payload.expected,
            actual_result: payload.actual,
            failed_test_case:
                payload.mode === "failed"
        }
    );

    return response.data;

}