// Mock data shaped exactly like the FastAPI/LangGraph backend's expected
// responses. Swap the functions in src/api/TestPilotApi.js for real fetch
// calls once the backend endpoints are live — every component below already
// consumes data in this shape, so nothing in the UI needs to change.

export const sampleWorkflowText = 'Login → Dashboard → Messages'

export const sampleObservedStepsText = [
  '1. Open App',
  '2. Tap Login',
  '3. Enter Email',
  '4. Enter Password',
  '5. Tap Sign In',
].join('\n')

export function buildMockAnalysis() {
  return {
    confirmedModules: ['Login', 'Dashboard', 'Messages'],
    assumedModules: ['Push notifications', 'Session timeout', 'Offline mode'],
    criticalWorkflows: ['Sign in', 'Send message'],
    highRiskAreas: ['Password reset', 'Token refresh', 'Message delivery retry'],
    checklist: [
      {
        module: 'Login',
        items: [
          { id: 'chk-1', text: 'Verify login succeeds with a valid email and password', confidence: 'confirmed' },
          { id: 'chk-2', text: 'Verify an invalid password shows a clear error message', confidence: 'confirmed' },
          { id: 'chk-3', text: 'Verify the session persists after an app restart', confidence: 'assumed' },
        ],
      },
      {
        module: 'Dashboard',
        items: [
          { id: 'chk-4', text: 'Verify the dashboard loads within 2 seconds of login', confidence: 'confirmed' },
          { id: 'chk-5', text: 'Verify the unread message badge updates in real time', confidence: 'assumed' },
        ],
      },
      {
        module: 'Messages',
        items: [
          { id: 'chk-6', text: 'Verify a sent message appears in the thread immediately', confidence: 'confirmed' },
          { id: 'chk-7', text: 'Verify behavior when the network drops mid-send', confidence: 'assumed' },
        ],
      },
    ],
    testCases: [
      { id: 'TC-001', description: 'Login with valid credentials', module: 'Login', priority: 'high', status: 'pending' },
      { id: 'TC-002', description: 'Login with an incorrect password shows an error', module: 'Login', priority: 'medium', status: 'pending' },
      { id: 'TC-003', description: 'Dashboard loads confirmed modules after login', module: 'Dashboard', priority: 'high', status: 'pending' },
      { id: 'TC-004', description: 'Unread badge reflects an incoming message count', module: 'Dashboard', priority: 'medium', status: 'pending' },
      { id: 'TC-005', description: 'Send a text message and confirm delivery', module: 'Messages', priority: 'high', status: 'pending' },
      { id: 'TC-006', description: 'Message thread persists after an app restart', module: 'Messages', priority: 'low', status: 'pending' },
    ],
  }
}

export function buildMockIssueResult(mode) {
  if (mode === 'exploratory') {
    return {
      observationType: 'Usability',
      severity: 'medium',
      nextAction: 'Confirm with design whether this is intended, then file as a UX issue if not.',
    }
  }
  return {
    bugType: 'Functional',
    severity: 'high',
    priority: 'P2',
    title: 'Message fails to send when network reconnects mid-retry',
  }
}
