export type AgentChatStepStatus = 'idle' | 'running' | 'done' | 'error';
export type AgentChatStepKind = 'agent' | 'llm' | 'tool';

export type AgentChatStep = {
  id: string;
  kind: AgentChatStepKind;
  name: string;
  title: string;
  status: AgentChatStepStatus;
  text: string;
  agentType?: string;
  error?: string;
  promptCode?: string;
  toolName?: string;
  data?: Record<string, unknown>;
};

export type AgentChatOption = {
  label: string;
  optionValue: string;
};

export type AgentChatOptionPrompt = {
  toolName?: string;
  interactionId: string;
  question: string;
  options: AgentChatOption[];
};

export type AgentChatStreamState = {
  active: boolean;
  agentStatus: AgentChatStepStatus;
  finalStatus: AgentChatStepStatus;
  agentName: string;
  agentType?: string;
  currentAgentScope: 'main' | 'subagent';
  sessionId?: string | number | null;
  agentSessionId?: string | number | null;
  runId?: string | null;
  finalText: string;
  pendingMainText: string;
  finalPayload?: Record<string, unknown> | null;
  optionPrompt: AgentChatOptionPrompt | null;
  error?: string | null;
  steps: AgentChatStep[];
  currentStepId?: string | null;
};

const CONFIRMATION_TOOL_SUFFIX = '_request_confirmation';

export function isAgentChatConfirmationToolStep(
  step: AgentChatStep,
  state?: AgentChatStreamState | null,
) {
  if (step.kind !== 'tool') {
    return false;
  }
  const toolName = (step.toolName || step.name || '').trim().toLowerCase();
  if (!toolName) {
    return false;
  }
  const promptToolName = state?.optionPrompt?.toolName?.trim().toLowerCase();
  return toolName === promptToolName || toolName.endsWith(CONFIRMATION_TOOL_SUFFIX);
}

export function hasVisibleAgentChatToolStep(state?: AgentChatStreamState | null) {
  return Boolean(state?.steps.some(
    step => step.kind === 'tool' && !isAgentChatConfirmationToolStep(step, state),
  ));
}

export type AgentChatSsePayload = {
  event?: string;
  type?: string;
  name?: string;
  content?: string;
  status?: number | string | null;
  toolName?: string;
  contentType?: string;
  interactionId?: string;
  question?: string;
  options?: unknown;
  data?: unknown;
};

export const createInitialAgentChatStreamState = (): AgentChatStreamState => ({
  active: false,
  agentStatus: 'idle',
  finalStatus: 'idle',
  agentName: '',
  agentType: '',
  currentAgentScope: 'main',
  finalText: '',
  pendingMainText: '',
  finalPayload: null,
  optionPrompt: null,
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

function readOptionList(value: unknown): AgentChatOption[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      const text = readString(item);
      if (text) {
        return {
          label: text,
          optionValue: text,
        };
      }
      const record = readRecord(item);
      if (!record) {
        return null;
      }
      const label = readString(record.label)
        || readString(record.text)
        || readString(record.name);
      const optionValue = readString(record.optionValue)
        || readString(record.value)
        || readString(record.action)
        || label;
      if (!label || !optionValue) {
        return null;
      }
      return {
        label,
        optionValue,
      };
    })
    .filter((item): item is AgentChatOption => item !== null);
}

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
  || readNestedString(payload.data, ['subAgentName'])
  || 'Agent';

const getAgentType = (payload: AgentChatSsePayload) =>
  readNestedString(payload.data, ['agentType'])
  || readNestedString(payload.data, ['mode'])
  || readString(payload.type)
  || undefined;

const getNodeName = (payload: AgentChatSsePayload) =>
  readString(payload.name)
  || readNestedString(payload.data, ['agentName'])
  || readNestedString(payload.data, ['subAgentName'])
  || readNestedString(payload.data, ['nodeName'])
  || readNestedString(payload.data, ['toolName'])
  || 'Node';

const getPromptCode = (payload: AgentChatSsePayload) =>
  readNestedString(payload.data, ['promptCode']);

const getToolName = (payload: AgentChatSsePayload) =>
  readString(payload.toolName)
  || readNestedString(payload.data, ['toolName'])
  || readString(payload.name);

function getPayloadObject(payload: AgentChatSsePayload) {
  const data = readRecord(payload.data);
  if (!data) {
    return data;
  }
  const sanitized = { ...data };
  delete sanitized.transferData;
  delete sanitized.summary;
  return sanitized;
}

const getPayloadText = (payload: AgentChatSsePayload) =>
  readString(payload.content)
  || readNestedString(payload.data, ['summary'])
  || readNestedString(payload.data, ['handoffReason'])
  || readNestedString(payload.data, ['error'])
  || readNestedString(payload.data, ['result'])
  || '';

function getOptionPrompt(payload: AgentChatSsePayload): AgentChatOptionPrompt | null {
  if (readString(payload.contentType)?.toLowerCase() !== 'options') {
    return null;
  }
  const interactionId = readString(payload.interactionId);
  const options = readOptionList(payload.options);
  if (!interactionId || options.length === 0) {
    return null;
  }
  return {
    toolName: getToolName(payload),
    interactionId,
    question: readString(payload.question) || getPayloadText(payload) || '请选择下一步操作。',
    options,
  };
}

const getPayloadStatus = (payload: AgentChatSsePayload, fallback: AgentChatStepStatus = 'done') => {
  const status = readStatus(payload.status);
  return status || fallback;
};

function isHandoffPayload(payload: AgentChatSsePayload) {
  const status = readString(payload.status)?.toUpperCase()
    || readNestedString(payload.data, ['status'])?.toUpperCase();
  const action = readNestedString(payload.data, ['action'])?.toUpperCase();
  const content = getPayloadText(payload);
  return status === 'HANDOFF'
    || action === 'HANDOFF_TO_AGENT'
    || content === '已交还主Agent重新派活';
}

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
  const toolName = kind === 'tool' ? getToolName(payload) : undefined;
  return {
    id: createStepId(kind, name),
    kind,
    name,
    title: toolName || name,
    status: 'running',
    text: getPayloadText(payload),
    agentType: getAgentType(payload),
    promptCode: getPromptCode(payload),
    toolName,
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
  if (kind === 'agent') {
    return name;
  }
  if (kind === 'llm') {
    return name;
  }
  const toolName = getToolName(payload);
  return toolName || name || '工具调用';
};

export const reduceAgentChatStreamState = (
  previous: AgentChatStreamState,
  eventName: string,
  dataText: string,
): AgentChatStreamState => {
  const normalizedEvent = (eventName || '').trim();
  const trimmedDataText = dataText.trim();
  const payload = parsePayload(dataText)
    || ((normalizedEvent === 'llm.delta' || normalizedEvent === 'llm.error') && trimmedDataText
      ? ({ content: trimmedDataText } as AgentChatSsePayload)
      : null);
  if (!payload) {
    return previous;
  }

  const agentName = getAgentName(payload);
  const data = getPayloadObject(payload);

  if (normalizedEvent === 'agent.start') {
    const nextStep = createStep('agent', payload);
    nextStep.title = buildStepSummary('agent', payload);
    nextStep.status = 'running';
    nextStep.text = getPayloadText(payload);
    nextStep.agentType = getAgentType(payload) || 'agent';

    return {
      ...createInitialAgentChatStreamState(),
      active: true,
      agentStatus: 'running',
      finalStatus: 'running',
      agentName,
      agentType: nextStep.agentType,
      currentAgentScope: 'main',
      finalText: '',
      pendingMainText: '',
      finalPayload: null,
      error: null,
      steps: [nextStep],
      currentStepId: nextStep.id,
    };
  }

  if (normalizedEvent === 'subagent.start') {
    const agentType = getAgentType(payload) || 'subagent';
    const nextStep = createStep('agent', payload);
    nextStep.title = buildStepSummary('agent', payload);
    nextStep.status = 'running';
    nextStep.text = getPayloadText(payload);
    nextStep.agentType = agentType;
    const steps = previous.currentAgentScope === 'main'
      ? previous.steps.map(step => step.kind === 'llm'
          ? { ...step, text: '' }
          : step)
      : previous.steps;

    return {
      ...previous,
      active: true,
      agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
      finalStatus: 'running',
      agentName: previous.agentName || agentName,
      agentType: previous.agentType || agentType,
      currentAgentScope: 'subagent',
      finalText: '',
      pendingMainText: '',
      currentStepId: nextStep.id,
      steps: [...steps, nextStep],
      error: null,
    };
  }

  if (normalizedEvent === 'subagent.error') {
    const message = getPayloadText(payload) || readNestedString(data, ['error']) || 'SubAgent step failed';
    const next = updateStep(previous, 'agent', payload, (step) => ({
      ...step,
      title: step.title || buildStepSummary('agent', payload),
      status: 'error',
      text: step.text || message,
      error: message,
      agentType: step.agentType || getAgentType(payload) || 'subagent',
      data: data || step.data,
    }));

    return {
      ...previous,
      active: true,
      agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
      finalStatus: 'running',
      agentName: previous.agentName || agentName,
      agentType: previous.agentType || getAgentType(payload) || 'subagent',
      currentStepId: next.currentStepId,
      steps: next.steps,
      error: message,
    };
  }

  if (normalizedEvent === 'subagent.end') {
    const nextStatus = getPayloadStatus(payload, 'done');
    const content = getPayloadText(payload);
    const next = updateStep(previous, 'agent', payload, (step) => ({
      ...step,
      title: step.title || buildStepSummary('agent', payload),
      status: mergeStepStatus(step.status, nextStatus),
      text: content || step.text,
      agentType: step.agentType || getAgentType(payload) || 'subagent',
      data: data || step.data,
    }));

    return {
      ...previous,
      active: true,
      agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
      finalStatus: 'running',
      agentName: previous.agentName || agentName,
      agentType: previous.agentType || getAgentType(payload) || 'subagent',
      currentStepId: next.currentStepId,
      steps: next.steps,
      finalText: previous.finalText,
      error: previous.error,
    };
  }

  switch (normalizedEvent) {
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
        agentType: previous.agentType || getAgentType(payload),
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
      const delta = dataText.trim();
      if (!delta) {
        return previous;
      }

      const currentIndex = previous.currentStepId
        ? previous.steps.findIndex((item) => item.id === previous.currentStepId)
        : -1;
      const stepIndex = currentIndex >= 0 && previous.steps[currentIndex]?.kind === 'llm'
        ? currentIndex
        : previous.steps[previous.steps.length - 1]?.kind === 'llm'
          ? previous.steps.length - 1
          : -1;

      if (stepIndex < 0) {
        const nextStep: AgentChatStep = {
          id: createStepId('llm', 'LLM'),
          kind: 'llm',
          name: 'LLM',
          title: 'LLM',
          status: 'running',
          text: delta,
        };
        return {
          ...previous,
          active: true,
          agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
          finalStatus: 'running',
          steps: [...previous.steps, nextStep],
          currentStepId: nextStep.id,
          finalText: previous.currentAgentScope === 'subagent'
            ? nextStep.text
            : previous.finalText,
          pendingMainText: previous.currentAgentScope === 'main'
            ? nextStep.text
            : previous.pendingMainText,
        };
      }

      const currentStep = previous.steps[stepIndex];
      const nextStep: AgentChatStep = {
        ...currentStep,
        status: mergeStepStatus(currentStep.status, 'running'),
        text: appendStepText(currentStep.text, delta),
      };
      const nextSteps = replaceStep(previous, stepIndex, nextStep);

      return {
        ...previous,
        active: true,
        agentStatus: previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: 'running',
        steps: nextSteps,
        currentStepId: nextStep.id,
        finalText: previous.currentAgentScope === 'subagent'
          ? nextStep.text || previous.finalText
          : previous.finalText,
        pendingMainText: previous.currentAgentScope === 'main'
          ? nextStep.text || previous.pendingMainText
          : previous.pendingMainText,
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
        error: message,
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
        finalText: previous.currentAgentScope === 'subagent'
          ? currentStep?.text || previous.finalText
          : previous.finalText,
        pendingMainText: previous.currentAgentScope === 'main'
          ? currentStep?.text || previous.pendingMainText
          : previous.pendingMainText,
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
        error: message,
      };
    }

    case 'tool.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const optionPrompt = getOptionPrompt(payload);
      const content = optionPrompt ? '' : getPayloadText(payload);
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: mergeStepStatus(step.status, nextStatus),
        text: optionPrompt ? '' : content || step.text,
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
        optionPrompt: optionPrompt || previous.optionPrompt,
        error: previous.error,
      };
    }

    case 'agent.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const finalPayload = resolveFinalPayload(payload);
      const content = getPayloadText(payload);
      const handoff = isHandoffPayload(payload);
      const steps = handoff
        ? previous.steps.map(step => (
            step.kind === 'llm' && step.id === previous.currentStepId
              ? { ...step, text: '' }
              : step
          ))
        : previous.steps;

      return {
        ...previous,
        active: false,
        agentStatus: nextStatus,
        finalStatus: nextStatus,
        agentName: previous.agentName || agentName,
        agentType: previous.agentType || getAgentType(payload),
        finalText: handoff
          ? previous.finalText
          : previous.pendingMainText || previous.finalText,
        pendingMainText: '',
        finalPayload,
        currentStepId: previous.currentStepId,
        steps,
        error: nextStatus === 'error' ? (content || previous.error) : previous.error,
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
        agentType: previous.agentType || getAgentType(payload),
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
