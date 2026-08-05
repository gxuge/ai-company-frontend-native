import type { TsAgentChatMessageEvent } from './ts-agent-chat';
import i18n from 'i18next';

export type AgentChatStepStatus = 'idle' | 'running' | 'done' | 'error' | 'interrupted';
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
  promptVersion?: string;
  toolName?: string;
  contentType?: string;
  resourceType?: string;
  imageUrl?: string;
  eventId?: string;
  taskId?: string;
  asynchronous?: boolean;
  errorCode?: string;
  errorCategory?: string;
  retryable?: boolean;
  errorArgs?: Record<string, unknown>;
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
  errorCode?: string | null;
  errorCategory?: string | null;
  retryable?: boolean | null;
  errorArgs?: Record<string, unknown> | null;
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
  if (step.asynchronous) {
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
  resourceType?: string;
  imageUrl?: string;
  promptCode?: string;
  promptVersion?: string;
  interactionId?: string;
  question?: string;
  options?: unknown;
  async?: boolean;
  eventId?: string;
  taskId?: string;
  error?: unknown;
  errorCode?: string;
  errorCategory?: string;
  retryable?: boolean;
  errorArgs?: Record<string, unknown>;
  sessionId?: string | number | null;
  runId?: string | null;
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
  errorCode: null,
  errorCategory: null,
  retryable: null,
  errorArgs: null,
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

const readBoolean = (value: unknown): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined;

const translateRuntimeText = (key: string, fallback: string) =>
  i18n.isInitialized && i18n.exists(key) ? i18n.t(key) : fallback;

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
    if (value === 3) return 'interrupted';
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
  if (['interrupted', 'stopped', 'user_stop'].includes(normalized)) {
    return 'interrupted';
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

function getToolEventId(payload: AgentChatSsePayload) {
  return readString(payload.eventId)
    || readNestedString(payload.data, ['eventId']);
}

function getToolTaskId(payload: AgentChatSsePayload) {
  return readString(payload.taskId)
    || readNestedString(payload.data, ['taskId']);
}

function getPayloadErrorMetadata(payload: AgentChatSsePayload) {
  const errorRecord = readRecord(payload.error);
  const dataRecord = readRecord(payload.data);
  const nestedErrorRecord = readRecord(dataRecord?.error);
  return {
    errorCode: readString(payload.errorCode)
      || readString(dataRecord?.errorCode)
      || readString(errorRecord?.errorCode)
      || readString(nestedErrorRecord?.errorCode),
    errorCategory: readString(payload.errorCategory)
      || readString(dataRecord?.errorCategory)
      || readString(errorRecord?.errorCategory)
      || readString(nestedErrorRecord?.errorCategory),
    retryable: readBoolean(payload.retryable)
      ?? readBoolean(dataRecord?.retryable)
      ?? readBoolean(errorRecord?.retryable)
      ?? readBoolean(nestedErrorRecord?.retryable),
    errorArgs: readRecord(payload.errorArgs)
      || readRecord(dataRecord?.errorArgs)
      || readRecord(errorRecord?.errorArgs)
      || readRecord(nestedErrorRecord?.errorArgs),
  };
}

function isAsyncToolPayload(payload: AgentChatSsePayload) {
  return payload.async === true
    || readRecord(payload.data)?.async === true;
}

function isImageToolPayload(payload: AgentChatSsePayload) {
  return readString(payload.contentType)?.toLowerCase() === 'image';
}

function getToolMediaFields(payload: AgentChatSsePayload) {
  return {
    contentType: readString(payload.contentType),
    resourceType: readString(payload.resourceType),
    imageUrl: readString(payload.imageUrl),
    promptCode: readString(payload.promptCode),
    promptVersion: readString(payload.promptVersion),
  };
}

function mergeToolContentType(current?: string, incoming?: string) {
  return current?.toLowerCase() === 'image' ? current : incoming || current;
}

function getToolStepData(
  payload: AgentChatSsePayload,
  data: Record<string, unknown> | undefined,
) {
  if (!isAsyncToolPayload(payload)) {
    return data;
  }
  return {
    async: true,
    eventId: getToolEventId(payload),
    taskId: getToolTaskId(payload),
    ...getPayloadErrorMetadata(payload),
  };
}

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
  || readString(payload.error)
  || readNestedString(payload.error, ['errorMessage'])
  || readNestedString(payload.error, ['message'])
  || readNestedString(payload.data, ['summary'])
  || readNestedString(payload.data, ['handoffReason'])
  || readNestedString(payload.data, ['error'])
  || readNestedString(payload.data, ['error', 'errorMessage'])
  || readNestedString(payload.data, ['error', 'message'])
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
    question: readString(payload.question)
      || getPayloadText(payload)
      || translateRuntimeText('adminChat.confirm.selectNext', 'Please choose the next action.'),
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
  eventId?: string,
) => {
  if (kind === 'tool' && eventId) {
    const eventIndex = state.steps.findIndex(
      item => item.kind === 'tool' && item.eventId === eventId,
    );
    if (eventIndex >= 0) {
      return eventIndex;
    }
  }

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
  const asynchronous = kind === 'tool' && isAsyncToolPayload(payload);
  const mediaFields = kind === 'tool' ? getToolMediaFields(payload) : {};
  const errorMetadata = getPayloadErrorMetadata(payload);
  const data = getPayloadObject(payload) || undefined;
  return {
    id: createStepId(kind, name),
    kind,
    name,
    title: toolName || name,
    status: 'running',
    text: getPayloadText(payload),
    agentType: getAgentType(payload),
    promptCode: getPromptCode(payload),
    ...mediaFields,
    toolName,
    eventId: kind === 'tool' ? getToolEventId(payload) : undefined,
    taskId: kind === 'tool' ? getToolTaskId(payload) : undefined,
    asynchronous,
    ...errorMetadata,
    data: kind === 'tool' ? getToolStepData(payload, data) : data,
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
  const index = resolveStepIndex(
    state,
    kind,
    name,
    kind === 'tool' ? getToolEventId(payload) : undefined,
  );
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
  if (currentStatus === 'done' && nextStatus === 'interrupted') {
    return 'done';
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
  return toolName
    || name
    || translateRuntimeText('adminChat.thinking.toolCall', 'Tool call');
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
      sessionId: readIdentifier(payload.sessionId)
        ?? readNestedIdentifier(data, ['sessionId']),
      agentSessionId: readNestedIdentifier(data, ['agentSessionId']),
      runId: readString(payload.runId)
        ?? readNestedString(data, ['runId']),
      finalText: '',
      pendingMainText: '',
      finalPayload: null,
      error: null,
      errorCode: null,
      errorCategory: null,
      retryable: null,
      errorArgs: null,
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
    const errorMetadata = getPayloadErrorMetadata(payload);
    const next = updateStep(previous, 'agent', payload, (step) => ({
      ...step,
      title: step.title || buildStepSummary('agent', payload),
      status: 'error',
      text: step.text || message,
      error: message,
      ...errorMetadata,
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
      ...errorMetadata,
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
        const latestLlmStep = [...previous.steps].reverse().find(item => item.kind === 'llm');
        const stepName = latestLlmStep?.name || 'LLM';
        const nextStep: AgentChatStep = {
          id: createStepId('llm', stepName),
          kind: 'llm',
          name: stepName,
          title: latestLlmStep?.title || stepName,
          status: 'running',
          text: delta,
          promptCode: latestLlmStep?.promptCode,
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
      const errorMetadata = getPayloadErrorMetadata(payload);
      const next = updateStep(previous, 'llm', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('llm', payload),
        status: 'error',
        text: step.text || message,
        error: message,
        ...errorMetadata,
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
        ...errorMetadata,
      };
    }

    case 'llm.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const content = getPayloadText(payload);
      const next = updateStep(previous, 'llm', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('llm', payload),
        status: mergeStepStatus(step.status, nextStatus),
        text: step.text || content,
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
      nextStep.data = getToolStepData(payload, data);

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
      const asynchronous = isAsyncToolPayload(payload);
      const mediaFields = getToolMediaFields(payload);
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: mergeStepStatus(step.status, 'running'),
        text: asynchronous || step.asynchronous ? '' : appendStepText(step.text, delta),
        toolName: step.toolName || getToolName(payload),
        eventId: step.eventId || getToolEventId(payload),
        taskId: step.taskId || getToolTaskId(payload),
        asynchronous: step.asynchronous || asynchronous,
        contentType: mergeToolContentType(step.contentType, mediaFields.contentType),
        resourceType: mediaFields.resourceType || step.resourceType,
        imageUrl: mediaFields.imageUrl || step.imageUrl,
        promptCode: mediaFields.promptCode || step.promptCode,
        promptVersion: mediaFields.promptVersion || step.promptVersion,
        data: asynchronous ? getToolStepData(payload, data) : data || step.data,
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
      const errorMetadata = getPayloadErrorMetadata(payload);
      const payloadAsynchronous = isAsyncToolPayload(payload);
      const mediaFields = getToolMediaFields(payload);
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: 'error',
        text: payloadAsynchronous || step.asynchronous ? '' : step.text || message,
        error: message,
        ...errorMetadata,
        toolName: step.toolName || getToolName(payload),
        eventId: step.eventId || getToolEventId(payload),
        taskId: step.taskId || getToolTaskId(payload),
        asynchronous: step.asynchronous || payloadAsynchronous,
        contentType: mergeToolContentType(step.contentType, mediaFields.contentType),
        resourceType: mediaFields.resourceType || step.resourceType,
        imageUrl: mediaFields.imageUrl || step.imageUrl,
        promptCode: mediaFields.promptCode || step.promptCode,
        promptVersion: mediaFields.promptVersion || step.promptVersion,
        data: payloadAsynchronous ? getToolStepData(payload, data) : data || step.data,
      }));
      const updatedStep = next.steps.find(step => step.id === next.currentStepId);
      const asynchronous = payloadAsynchronous || updatedStep?.asynchronous === true;
      const completedAfterRun = asynchronous && !previous.active;

      return {
        ...previous,
        active: completedAfterRun ? previous.active : true,
        agentStatus: completedAfterRun
          ? previous.agentStatus
          : previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: completedAfterRun ? previous.finalStatus : 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        error: asynchronous ? previous.error : message,
        errorCode: asynchronous ? previous.errorCode : errorMetadata.errorCode,
        errorCategory: asynchronous ? previous.errorCategory : errorMetadata.errorCategory,
        retryable: asynchronous ? previous.retryable : errorMetadata.retryable,
        errorArgs: asynchronous ? previous.errorArgs : errorMetadata.errorArgs,
      };
    }

    case 'tool.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const payloadAsynchronous = isAsyncToolPayload(payload);
      const payloadImage = isImageToolPayload(payload);
      const mediaFields = getToolMediaFields(payload);
      const optionPrompt = payloadAsynchronous ? null : getOptionPrompt(payload);
      const content = optionPrompt || payloadAsynchronous || payloadImage ? '' : getPayloadText(payload);
      const next = updateStep(previous, 'tool', payload, (step) => ({
        ...step,
        title: step.title || buildStepSummary('tool', payload),
        status: mergeStepStatus(step.status, nextStatus),
        text: optionPrompt || payloadAsynchronous || payloadImage || step.asynchronous ? '' : content || step.text,
        toolName: step.toolName || getToolName(payload),
        eventId: step.eventId || getToolEventId(payload),
        taskId: step.taskId || getToolTaskId(payload),
        asynchronous: step.asynchronous || payloadAsynchronous,
        contentType: mergeToolContentType(step.contentType, mediaFields.contentType),
        resourceType: mediaFields.resourceType || step.resourceType,
        imageUrl: mediaFields.imageUrl || step.imageUrl,
        promptCode: mediaFields.promptCode || step.promptCode,
        promptVersion: mediaFields.promptVersion || step.promptVersion,
        data: payloadAsynchronous ? getToolStepData(payload, data) : data || step.data,
      }));
      const updatedStep = next.steps.find(step => step.id === next.currentStepId);
      const asynchronous = payloadAsynchronous || updatedStep?.asynchronous === true;
      const completedAfterRun = asynchronous && !previous.active;

      return {
        ...previous,
        active: completedAfterRun ? previous.active : true,
        agentStatus: completedAfterRun
          ? previous.agentStatus
          : previous.agentStatus === 'idle' ? 'running' : previous.agentStatus,
        finalStatus: completedAfterRun ? previous.finalStatus : 'running',
        agentName: previous.agentName || agentName,
        currentStepId: next.currentStepId,
        steps: next.steps,
        optionPrompt: optionPrompt || previous.optionPrompt,
        error: previous.error,
      };
    }

    case 'agent.end': {
      const nextStatus = getPayloadStatus(payload, 'done');
      const errorMetadata = getPayloadErrorMetadata(payload);
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
        errorCode: nextStatus === 'error' ? errorMetadata.errorCode || previous.errorCode : previous.errorCode,
        errorCategory: nextStatus === 'error'
          ? errorMetadata.errorCategory || previous.errorCategory
          : previous.errorCategory,
        retryable: nextStatus === 'error' ? errorMetadata.retryable ?? previous.retryable : previous.retryable,
        errorArgs: nextStatus === 'error' ? errorMetadata.errorArgs || previous.errorArgs : previous.errorArgs,
      };
    }

    case 'run.error': {
      const message = getPayloadText(payload) || readNestedString(data, ['errorMessage']) || 'Agent run failed';
      const errorMetadata = getPayloadErrorMetadata(payload);
      return {
        ...previous,
        active: false,
        agentStatus: 'error',
        finalStatus: 'error',
        agentName: previous.agentName || agentName,
        agentType: previous.agentType || getAgentType(payload),
        error: message,
        ...errorMetadata,
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

export function createAsyncToolHistoryState(
  event: TsAgentChatMessageEvent,
): AgentChatStreamState | null {
  if (event.type !== 'tool' || event.data?.async !== true) {
    return null;
  }

  const payload = {
    async: true,
    eventId: event.id,
    name: event.nodeName || event.name || 'Tool',
    toolName: event.name,
    taskId: readString(event.data.taskId),
    status: event.status,
    content: event.content,
    data: event.data,
  };
  const started = reduceAgentChatStreamState(
    createInitialAgentChatStreamState(),
    'tool.start',
    JSON.stringify(payload),
  );

  if (event.status === 2 || event.status == null) {
    return started;
  }

  const completed = reduceAgentChatStreamState(
    started,
    event.status === 0 ? 'tool.error' : 'tool.end',
    JSON.stringify(payload),
  );
  return {
    ...completed,
    active: false,
    agentStatus: readStatus(event.status) || 'done',
    finalStatus: readStatus(event.status) || 'done',
  };
}

function createToolHistoryPayload(event: TsAgentChatMessageEvent) {
  const output = readRecord(event.data?.output);
  return {
    async: event.data?.async === true,
    eventId: event.id,
    name: event.nodeName || event.name || 'Tool',
    toolName: event.name,
    taskId: readString(event.data?.taskId),
    status: event.status,
    content: event.content,
    data: event.data,
    contentType: readString(output?.contentType),
    resourceType: readString(output?.resourceType),
    imageUrl: readString(output?.imageUrl),
    promptCode: readString(output?.promptCode),
    promptVersion: readString(output?.promptVersion),
  };
}

/**
 * 将助手消息下的完整 LLM/Tool 事件还原成与实时 SSE 一致的时间线。
 */
export function createAgentChatHistoryState(
  events: TsAgentChatMessageEvent[] | undefined,
): AgentChatStreamState | null {
  const source = Array.isArray(events) ? events : [];
  const timelineEvents = source.filter((event) => {
    const type = readString(event.type)?.toLowerCase();
    return type === 'llm' || type === 'tool';
  });
  let state = createInitialAgentChatStreamState();
  let hasTimelineEvent = false;

  timelineEvents.forEach((event) => {
    const type = readString(event.type)?.toLowerCase();
    if (type === 'llm') {
      hasTimelineEvent = true;
      const payload = {
        eventId: event.id,
        name: event.nodeName || event.name || 'LLM',
        status: event.status,
        content: event.content,
        data: event.data,
        promptCode: readString(readRecord(event.data?.input)?.promptCode),
      };
      state = reduceAgentChatStreamState(state, 'llm.start', JSON.stringify(payload));
      state = reduceAgentChatStreamState(
        state,
        event.status === 0 ? 'llm.error' : 'llm.end',
        JSON.stringify(payload),
      );
      return;
    }

    if (type !== 'tool') {
      return;
    }
    hasTimelineEvent = true;
    const payload = createToolHistoryPayload(event);
    state = reduceAgentChatStreamState(state, 'tool.start', JSON.stringify(payload));
    if (event.status === 2 || event.status == null) {
      return;
    }
    state = reduceAgentChatStreamState(
      state,
      event.status === 0 ? 'tool.error' : 'tool.end',
      JSON.stringify(payload),
    );
  });

  if (!hasTimelineEvent) {
    return null;
  }
  const active = timelineEvents.some(event => event.status === 2 || event.status == null);
  const interrupted = timelineEvents.some(event => event.status === 3);
  const lastEvent = timelineEvents[timelineEvents.length - 1];
  const finalStatus = active
    ? 'running'
    : interrupted
      ? 'interrupted'
      : readStatus(lastEvent?.status) || 'done';
  return {
    ...state,
    active,
    agentStatus: finalStatus,
    finalStatus,
  };
}

export function createImageToolHistoryState(
  event: TsAgentChatMessageEvent,
): AgentChatStreamState | null {
  if (event.type !== 'tool') {
    return null;
  }
  const output = readRecord(event.data?.output);
  if (readString(output?.contentType)?.toLowerCase() !== 'image') {
    return null;
  }

  const payload = createToolHistoryPayload(event);
  const started = reduceAgentChatStreamState(
    createInitialAgentChatStreamState(),
    'tool.start',
    JSON.stringify(payload),
  );
  const completed = reduceAgentChatStreamState(
    started,
    event.status === 0 ? 'tool.error' : 'tool.end',
    JSON.stringify(payload),
  );
  return {
    ...completed,
    active: false,
    agentStatus: readStatus(event.status) || 'done',
    finalStatus: readStatus(event.status) || 'done',
  };
}
