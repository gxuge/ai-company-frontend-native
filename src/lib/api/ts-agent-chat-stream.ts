export type AgentChatStepStatus = 'idle' | 'running' | 'done' | 'error';
export type AgentChatStepKind = 'llm' | 'tool';

export type AgentChatStep = {
  id: string;
  kind: AgentChatStepKind;
  name: string;
  title: string;
  status: AgentChatStepStatus;
  text: string;
  error?: string;
  promptCode?: string;
  toolName?: string;
  data?: Record<string, unknown>;
};

export type AgentChatStreamState = {
  active: boolean;
  agentStatus: AgentChatStepStatus;
  finalStatus: AgentChatStepStatus;
  agentName: string;
  sessionId?: string | number | null;
  agentSessionId?: string | number | null;
  runId?: string | null;
  finalText: string;
  finalPayload?: Record<string, unknown> | null;
  routeDecision?: string;
  targetSubAgent?: string;
  error?: string | null;
  steps: AgentChatStep[];
  currentStepId?: string | null;
};

export type AgentChatSsePayload = {
  event?: string;
  type?: string;
  name?: string;
  content?: string;
  status?: number | string | null;
  data?: unknown;
};

export const createInitialAgentChatStreamState = (): AgentChatStreamState => ({
  active: false,
  agentStatus: 'idle',
  finalStatus: 'idle',
  agentName: '',
  finalText: '',
  finalPayload: null,
  error: null,
  steps: [],
  currentStepId: null,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const text = value.trim();
  return text ? text : undefined;
};

const readIdentifier = (value: unknown): string | number | null => {
  if (typeof value === 'string') {
    const text = value.trim();
    return text || null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
};

const readRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }
  return value;
};

const readNestedString = (value: unknown, path: string[]): string | undefined => {
  let cursor: unknown = value;
  for (const key of path) {
    const record = readRecord(cursor);
    if (!record) {
      return undefined;
    }
    cursor = record[key];
  }
  return readString(cursor);
};

const readNestedIdentifier = (value: unknown, path: string[]): string | number | null => {
  let cursor: unknown = value;
  for (const key of path) {
    const record = readRecord(cursor);
    if (!record) {
      return null;
    }
    cursor = record[key];
  }
  return readIdentifier(cursor);
};

const readStatus = (value: unknown): AgentChatStepStatus | undefined => {
  if (typeof value === 'number') {
    if (value === 1) return 'done';
    if (value === 0) return 'error';
    if (value === 2) return 'running';
  }

  const normalized = readString(value)?.toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (['running', 'loading', 'pending', 'processing'].includes(normalized)) {
    return 'running';
  }
  if (['done', 'success', 'ok', 'complete', 'completed'].includes(normalized)) {
    return 'done';
  }
  if (['error', 'failed', 'fail', 'abort', 'aborted'].includes(normalized)) {
    return 'error';
  }
  return undefined;
};

const parsePayload = (dataText: string): AgentChatSsePayload | null => {
  const text = dataText.trim();
  if (!text) {
    return null;
  }
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!isRecord(parsed)) {
      return null;
    }
    return parsed as AgentChatSsePayload;
  }
  catch {
    return null;
  }
};

const getAgentName = (payload: AgentChatSsePayload) =>
  readString(payload.name)
  || readNestedString(payload.data, ['agentName'])
  || 'Agent';

const getNodeName = (payload: AgentChatSsePayload) =>
  readString(payload.name)
  || readNestedString(payload.data, ['nodeName'])
  || readNestedString(payload.data, ['toolName'])
  || 'Node';

const getPromptCode = (payload: AgentChatSsePayload) =>
  readNestedString(payload.data, ['promptCode']);

const getToolName = (payload: AgentChatSsePayload) =>
  readNestedString(payload.data, ['toolName'])
  || readString(payload.name);

const getPayloadObject = (payload: AgentChatSsePayload) => readRecord(payload.data);

const getPayloadText = (payload: AgentChatSsePayload) => readString(payload.content) || '';

const getPayloadStatus = (payload: AgentChatSsePayload, fallback: AgentChatStepStatus = 'done') => {
  const status = readStatus(payload.status);
  return status || fallback;
};

const resolveStepIndex = (
  state: AgentChatStreamState,
  kind: AgentChatStepKind,
  name: string,
) => {
  if (state.currentStepId) {
    const currentIndex = state.steps.findIndex((item) => item.id === state.currentStepId);
    if (currentIndex >= 0 && state.steps[currentIndex]?.kind === kind) {
      return currentIndex;
    }
  }

  for (let index = state.steps.length - 1; index >= 0; index -= 1) {
    const step = state.steps[index];
    if (step.kind === kind && step.name === name) {
      return index;
    }
  }

  return -1;
};

const createStepId = (kind: AgentChatStepKind, name: string) =>
  `${kind}:${name}:${Date.now()}:${Math.random().toString(16).slice(2)}`;

const createStep = (
  kind: AgentChatStepKind,
  payload: AgentChatSsePayload,
): AgentChatStep => {
  const name = getNodeName(payload);
  return {
    id: createStepId(kind, name),
    kind,
    name,
    title: kind === 'llm' ? 'LLM' : 'Tool',
    status: 'running',
    text: getPayloadText(payload),
    promptCode: getPromptCode(payload),
    toolName: getToolName(payload),
    data: getPayloadObject(payload) || undefined,
  };
};

const replaceStep = (
  state: AgentChatStreamState,
  index: number,
  nextStep: AgentChatStep,
) => {
  const steps = state.steps.slice();
  steps[index] = nextStep;
  return steps;
};

const updateStep = (
  state: AgentChatStreamState,
  kind: AgentChatStepKind,
  payload: AgentChatSsePayload,
  updater: (step: AgentChatStep) => AgentChatStep,
) => {
  const name = getNodeName(payload);
  const index = resolveStepIndex(state, kind, name);
  if (index < 0) {
    const created = createStep(kind, payload);
    return {
      steps: [...state.steps, updater(created)],
      currentStepId: created.id,
    };
  }

  const current = state.steps[index];
  const nextStep = updater(current);
  return {
    steps: replaceStep(state, index, nextStep),
    currentStepId: nextStep.id,
  };
};

const appendStepText = (text: string, delta: string) => {
  if (!delta) {
    return text;
  }
  return `${text}${delta}`;
};

const mergeStepStatus = (
  currentStatus: AgentChatStepStatus,
  nextStatus: AgentChatStepStatus,
) => {
  if (currentStatus === 'error') {
    return 'error';
  }
  if (nextStatus === 'error') {
    return 'error';
  }
  return nextStatus;
};

const resolveFinalPayload = (payload: AgentChatSsePayload) => {
  const data = getPayloadObject(payload);
  if (!data) {
    return null;
  }

  const nestedPayload = readRecord(data.payload);
  return (nestedPayload || data) as Record<string, unknown>;
};

const buildStepSummary = (kind: AgentChatStepKind, payload: AgentChatSsePayload) => {
  const name = getNodeName(payload);
  if (kind === 'llm') {
    return payload.name ? `LLM · ${name}` : 'LLM';
  }
  const toolName = getToolName(payload);
  return toolName ? `Tool · ${toolName}` : 'Tool';
};

export const reduceAgentChatStreamState = (
  previous: AgentChatStreamState,
  eventName: string,
  dataText: string,
): AgentChatStreamState => {
  const payload = parsePayload(dataText);
  if (!payload) {
    return previous;
  }

  const agentName = getAgentName(payload);
  const data = getPayloadObject(payload);

  switch ((eventName || '').trim()) {
    case 'agent.start': {
      return {
        ...createInitialAgentChatStreamState(),
        active: true,
        agentStatus: 'running',
        finalStatus: 'running',
        agentName,
        sessionId: readNestedIdentifier(data, ['sessionId']),
        agentSessionId: readNestedIdentifier(data, ['agentSessionId']),
        runId: readString(data?.runId),
        finalText: '',
        finalPayload: null,
        error: null,
      };
    }

    case 'llm.start': {
      const nextStep = createStep('llm', payload);
      nextStep.title = buildStepSummary('llm', payload);
      nextStep.status = 'running';
      nextStep.text = '';
      nextStep.data = data || undefined;

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        sessionId: previous.sessionId ?? readNestedIdentifier(data, ['sessionId']),
        agentSessionId: previous.agentSessionId ?? readNestedIdentifier(data, ['agentSessionId']),
        runId: previous.runId ?? readString(data?.runId),
        currentStepId: nextStep.id,
        steps: [...previous.steps, nextStep],
        finalText: previous.finalText,
        error: null,
      };
    }

    case 'llm.delta': {
      const delta = getPayloadText(payload);
      const next = updateStep(previous, 'llm', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('llm', payload),
        status: mergeStepStatus(step.status, 'running'),
        text: appendStepText(step.text, delta),
        promptCode: step.promptCode || getPromptCode(payload),
        data: data || step.data,
      }));

      const currentIndex = previous.steps.findIndex((item) => item.id === next.currentStepId);
      const currentStep = currentIndex >= 0 ? next.steps[currentIndex] : next.steps[next.steps.length - 1];

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        finalText: currentStep?.text || previous.finalText,
        error: previous.error,
      };
    }

    case 'llm.error': {
      const message = getPayloadText(payload) || readNestedString(data, ['errorMessage']) || 'LLM step failed';
      const next = updateStep(previous, 'llm', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('llm', payload),
        status: 'error',
        text: step.text || message,
        error: message,
        promptCode: step.promptCode || getPromptCode(payload),
        data: data || step.data,
      }));

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: previous.finalStatus === 'idle' ? 'running' : previous.finalStatus,
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        error: previous.error,
      };
    }

    case 'llm.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const content = getPayloadText(payload);
      const next = updateStep(previous, 'llm', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('llm', payload),
        status: mergeStepStatus(step.status, nextStatus),
        text: content || step.text,
        promptCode: step.promptCode || getPromptCode(payload),
        data: data || step.data,
      }));

      const currentIndex = previous.steps.findIndex((item) => item.id === next.currentStepId);
      const currentStep = currentIndex >= 0 ? next.steps[currentIndex] : next.steps[next.steps.length - 1];

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        finalText: currentStep?.text || previous.finalText,
        error: previous.error,
      };
    }

    case 'tool.start': {
      const nextStep = createStep('tool', payload);
      nextStep.title = buildStepSummary('tool', payload);
      nextStep.status = 'running';
      nextStep.text = '';
      nextStep.toolName = getToolName(payload);
      nextStep.data = data || undefined;

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        currentStepId: nextStep.id,
        steps: [...previous.steps, nextStep],
        error: null,
      };
    }

    case 'tool.delta': {
      const delta = getPayloadText(payload);
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: mergeStepStatus(step.status, 'running'),
        text: appendStepText(step.text, delta),
        toolName: step.toolName || getToolName(payload),
        data: data || step.data,
      }));

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        error: previous.error,
      };
    }

    case 'tool.error': {
      const message = getPayloadText(payload) || readNestedString(data, ['errorMessage']) || 'Tool step failed';
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: 'error',
        text: step.text || message,
        error: message,
        toolName: step.toolName || getToolName(payload),
        data: data || step.data,
      }));

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        error: previous.error,
      };
    }

    case 'tool.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const content = getPayloadText(payload);
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: mergeStepStatus(step.status, nextStatus),
        text: content || step.text,
        toolName: step.toolName || getToolName(payload),
        data: data || step.data,
      }));

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        error: previous.error,
      };
    }

    case 'agent.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const finalPayload = resolveFinalPayload(payload);
      const routeDecision = readNestedString(data, ['routeDecision'])
        || readNestedString(finalPayload, ['routeDecision'])
        || readNestedString(data, ['payload', 'routeDecision']);
      const targetSubAgent = readNestedString(data, ['targetSubAgent'])
        || readNestedString(finalPayload, ['targetSubAgent'])
        || readNestedString(data, ['payload', 'targetSubAgent']);
      const content = getPayloadText(payload);

      return {
        ...previous,
        active: false,
        agentStatus: nextStatus,
        finalStatus: nextStatus,
        agentName: previous.agentName || agentName,
        finalText: content || previous.finalText,
        finalPayload,
        routeDecision,
        targetSubAgent,
        currentStepId: previous.currentStepId,
        error: previous.error,
      };
    }

    case 'run.error': {
      const message = getPayloadText(payload) || readNestedString(data, ['errorMessage']) || 'Agent run failed';
      return {
        ...previous,
        active: false,
        agentStatus: 'error',
        finalStatus: 'error',
        agentName: previous.agentName || agentName,
        error: message,
      };
    }

    case 'run.end': {
      return {
        ...previous,
        active: false,
        agentStatus: previous.agentStatus === 'idle' ? 'done' : previous.agentStatus,
        finalStatus: previous.finalStatus === 'idle' ? 'done' : previous.finalStatus,
        agentName: previous.agentName || agentName,
      };
    }

    default:
      return previous;
  }
};
