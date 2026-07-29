import { iterateSseEvents } from '../stream';
import {
  createAsyncToolHistoryState,
  createImageToolHistoryState,
  createInitialAgentChatStreamState,
  hasVisibleAgentChatToolStep,
  reduceAgentChatStreamState,
} from '../ts-agent-chat-stream';

type StreamState = ReturnType<typeof createInitialAgentChatStreamState>;

function applyAgentEvent(
  state: StreamState,
  event: string,
  payload: Record<string, unknown>,
) {
  return reduceAgentChatStreamState(state, event, JSON.stringify(payload));
}

function startMainAgent() {
  const started = applyAgentEvent(
    createInitialAgentChatStreamState(),
    'agent.start',
    {
      content: '开始执行 ts_agent_chat',
      name: 'ts_agent_chat',
      status: 2,
      type: 'agent',
    },
  );
  return applyAgentEvent(started, 'llm.start', {
    content: '开始生成',
    name: 'ts_agent_deep_agents_main',
    status: 2,
    type: 'llm',
  });
}

describe('reduceAgentChatStreamState tool confirmation', () => {
  const confirmationPayload = {
    contentType: 'options',
    interactionId: 'interaction-1',
    question: '你对这版角色满意吗？',
    toolName: 'role_request_confirmation',
    options: [
      { label: '满意，继续', value: 'accept_and_continue' },
      { label: '重新生成', value: 'regenerate' },
    ],
    transferData: { roleName: '亚瑟' },
    data: {
      summary: '旧版确认摘要不应进入前端状态',
      transferData: { roleName: '亚瑟' },
    },
  };

  it('creates a prompt only from a complete confirmation tool.end event', () => {
    const state = reduceAgentChatStreamState(
      createInitialAgentChatStreamState(),
      'tool.end',
      JSON.stringify(confirmationPayload),
    );

    expect(state.optionPrompt).toEqual({
      toolName: 'role_request_confirmation',
      interactionId: 'interaction-1',
      question: '你对这版角色满意吗？',
      options: [
        { label: '满意，继续', optionValue: 'accept_and_continue' },
        { label: '重新生成', optionValue: 'regenerate' },
      ],
    });
    expect(JSON.stringify(state.optionPrompt)).not.toContain('summary');
    expect(JSON.stringify(state)).not.toContain('旧版确认摘要');
    expect(JSON.stringify(state)).not.toContain('transferData');
  });

  it.each([
    ['missing interaction id', { interactionId: undefined }],
    ['missing options', { options: [] }],
    ['ordinary tool content', { contentType: 'text' }],
  ])('does not create a prompt for %s', (_caseName, override) => {
    const state = reduceAgentChatStreamState(
      createInitialAgentChatStreamState(),
      'tool.end',
      JSON.stringify({ ...confirmationPayload, ...override }),
    );

    expect(state.optionPrompt).toBeNull();
  });

  it('ignores legacy confirm events', () => {
    const initial = createInitialAgentChatStreamState();
    const state = reduceAgentChatStreamState(
      initial,
      'confirm.start',
      JSON.stringify(confirmationPayload),
    );

    expect(state).toBe(initial);
  });

  it('does not expose confirmation tools as visible tool cards', () => {
    const state = reduceAgentChatStreamState(
      reduceAgentChatStreamState(
        createInitialAgentChatStreamState(),
        'tool.start',
        JSON.stringify({
          name: 'role_create_dialog',
          toolName: 'role_request_confirmation',
        }),
      ),
      'tool.end',
      JSON.stringify(confirmationPayload),
    );

    expect(hasVisibleAgentChatToolStep(state)).toBe(false);
  });

  it('keeps ordinary tools visible', () => {
    const state = reduceAgentChatStreamState(
      createInitialAgentChatStreamState(),
      'tool.start',
      JSON.stringify({
        name: 'role_image_generate',
        toolName: 'role_image_generate',
      }),
    );

    expect(hasVisibleAgentChatToolStep(state)).toBe(true);
  });
});

describe('reduceAgentChatStreamState async tool', () => {
  it('marks any tool as asynchronous only from async=true', () => {
    const state = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'tool.start',
      {
        async: true,
        eventId: 'event-1',
        name: 'custom_node',
        toolName: 'any_background_tool',
        status: 2,
      },
    );

    expect(state.steps[0]).toMatchObject({
      eventId: 'event-1',
      toolName: 'any_background_tool',
      asynchronous: true,
      status: 'running',
    });
  });

  it('keeps async tools visible regardless of their tool name', () => {
    const state = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'tool.start',
      {
        async: true,
        eventId: 'event-confirm-name',
        name: 'custom_node',
        toolName: 'custom_request_confirmation',
        status: 2,
      },
    );

    expect(hasVisibleAgentChatToolStep(state)).toBe(true);
  });

  it('updates the matching async tool by eventId', () => {
    const asyncStarted = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'tool.start',
      {
        async: true,
        eventId: 'event-async',
        name: 'shared_node',
        toolName: 'background_tool',
        status: 2,
      },
    );
    const ordinaryStarted = applyAgentEvent(asyncStarted, 'tool.start', {
      eventId: 'event-sync',
      name: 'shared_node',
      toolName: 'ordinary_tool',
      status: 2,
    });
    const completed = applyAgentEvent(ordinaryStarted, 'tool.end', {
      async: true,
      eventId: 'event-async',
      name: 'shared_node',
      toolName: 'background_tool',
      status: 1,
      content: 'result must not be rendered',
    });

    expect(completed.steps.find(step => step.eventId === 'event-async')).toMatchObject({
      asynchronous: true,
      status: 'done',
      text: '',
    });
    expect(completed.steps.find(step => step.eventId === 'event-sync')?.status).toBe('running');
  });
});

describe('async tool history and late completion', () => {
  it('restores async tool markers from message history', () => {
    const historyState = createAsyncToolHistoryState({
      id: 'history-event',
      type: 'tool',
      name: 'background_tool',
      nodeName: 'role_create_dialog',
      content: '完整结果不展示',
      status: 1,
      data: {
        async: true,
        output: { roleId: 1 },
      },
    });

    expect(historyState?.active).toBe(false);
    expect(historyState?.finalStatus).toBe('done');
    expect(historyState?.steps[0]).toMatchObject({
      eventId: 'history-event',
      asynchronous: true,
      status: 'done',
      text: '',
    });
    expect(JSON.stringify(historyState)).not.toContain('roleId');
  });

  it('does not reactivate a completed agent state when the async tool finishes later', () => {
    const started = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'tool.start',
      {
        async: true,
        eventId: 'event-late',
        name: 'background_node',
        toolName: 'background_tool',
        status: 2,
      },
    );
    const agentCompleted = applyAgentEvent(started, 'agent.end', {
      name: 'ts_agent_chat',
      status: 1,
      content: '执行完成',
    });
    const toolCompleted = applyAgentEvent(agentCompleted, 'tool.end', {
      async: true,
      eventId: 'event-late',
      name: 'background_node',
      toolName: 'background_tool',
      status: 1,
    });

    expect(toolCompleted.active).toBe(false);
    expect(toolCompleted.finalStatus).toBe('done');
    expect(toolCompleted.steps.find(step => step.eventId === 'event-late')?.status).toBe('done');
  });

  it('ignores history tools without a strict async=true marker', () => {
    expect(createAsyncToolHistoryState({
      id: 'sync-history-event',
      type: 'tool',
      name: 'ordinary_tool',
      status: 1,
      data: {
        async: 'true',
      },
    })).toBeNull();
  });
});

describe('image tool realtime and history', () => {
  it('parses raw SSE image tool events into the realtime state', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(
          'event: tool.start\n'
          + 'data: {"eventId":"image-sse-event","name":"role_create_image","toolName":"role_generate_role_image","status":2}\n\n'
          + 'event: tool.end\n',
        ));
        controller.enqueue(encoder.encode(
          'data: {"eventId":"image-sse-event","name":"role_create_image","toolName":"role_generate_role_image","status":1,'
          + '"contentType":"image","resourceType":"role_image","imageUrl":"https://example.com/sse-role.png",'
          + '"promptCode":"role_image_generate","promptVersion":"v1"}\n\n',
        ));
        controller.close();
      },
    });
    let state = createInitialAgentChatStreamState();

    for await (const event of iterateSseEvents(stream)) {
      state = reduceAgentChatStreamState(state, event.event, event.data);
    }

    expect(state.steps).toHaveLength(1);
    expect(state.steps[0]).toMatchObject({
      eventId: 'image-sse-event',
      toolName: 'role_generate_role_image',
      contentType: 'image',
      resourceType: 'role_image',
      imageUrl: 'https://example.com/sse-role.png',
      promptCode: 'role_image_generate',
      promptVersion: 'v1',
      status: 'done',
      text: '',
    });
  });

  it.each([
    ['role_image', 'role_generate_role_image'],
    ['story_scene_image', 'story_generate_scene_image'],
  ])('reads flat image fields for %s', (resourceType, toolName) => {
    const started = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'tool.start',
      {
        eventId: `${resourceType}-event`,
        name: 'image_node',
        toolName,
        status: 2,
      },
    );
    const completed = applyAgentEvent(started, 'tool.end', {
      eventId: `${resourceType}-event`,
      name: 'image_node',
      toolName,
      status: 1,
      contentType: 'image',
      resourceType,
      imageUrl: 'https://example.com/generated.png',
      promptCode: `${resourceType}_prompt`,
      promptVersion: 'v1',
    });

    expect(completed.steps[0]).toMatchObject({
      contentType: 'image',
      resourceType,
      imageUrl: 'https://example.com/generated.png',
      promptCode: `${resourceType}_prompt`,
      promptVersion: 'v1',
      status: 'done',
      text: '',
    });
  });

  it('restores flat image fields from history output', () => {
    const historyState = createImageToolHistoryState({
      id: 'image-history-event',
      type: 'tool',
      name: 'role_generate_role_image',
      nodeName: 'role_create_image',
      content: '已生成角色形象',
      status: 1,
      data: {
        output: {
          summary: '已生成角色形象',
          contentType: 'image',
          resourceType: 'role_image',
          imageUrl: 'https://example.com/role.png',
          promptCode: 'role_image_generate',
          promptVersion: 'v1',
        },
      },
    });

    expect(historyState?.steps[0]).toMatchObject({
      contentType: 'image',
      resourceType: 'role_image',
      imageUrl: 'https://example.com/role.png',
      promptCode: 'role_image_generate',
      promptVersion: 'v1',
      status: 'done',
    });
    expect(JSON.stringify(historyState)).not.toContain('"result"');
  });
});

describe('reduceAgentChatStreamState agent handoff', () => {
  it('keeps main agent text pending until agent.end confirms a normal response', () => {
    const afterLlm = applyAgentEvent(startMainAgent(), 'llm.end', {
      content: '这是主 Agent 的正式回复。',
      name: 'ts_agent_deep_agents_main',
      status: 1,
      type: 'llm',
    });

    expect(afterLlm.finalText).toBe('');
    expect(afterLlm.pendingMainText).toBe('这是主 Agent 的正式回复。');

    const completed = applyAgentEvent(afterLlm, 'agent.end', {
      content: '执行完成',
      name: 'ts_agent_chat',
      status: 1,
      type: 'agent',
      data: {
        status: 'SUCCESS',
      },
    });

    expect(completed.finalText).toBe('这是主 Agent 的正式回复。');
    expect(completed.pendingMainText).toBe('');
  });

  it('discards the main agent text when agent.end reports HANDOFF', () => {
    const afterLlm = applyAgentEvent(startMainAgent(), 'llm.end', {
      content: '好的，我先把这个任务交给角色创建子 Agent。',
      name: 'ts_agent_deep_agents_main',
      status: 1,
      type: 'llm',
    });
    const handedOff = applyAgentEvent(afterLlm, 'agent.end', {
      content: '已交还主Agent重新派活',
      name: 'ts_agent_chat',
      status: 1,
      type: 'agent',
      data: {
        agentName: 'ts_agent_chat',
        status: 'HANDOFF',
      },
    });

    expect(handedOff.finalText).toBe('');
    expect(handedOff.pendingMainText).toBe('');
    expect(handedOff.steps.find(step => step.kind === 'llm')?.text).toBe('');
  });

  it('shows subagent output directly without adding a transition message', () => {
    const afterLlm = applyAgentEvent(startMainAgent(), 'llm.end', {
      content: '好的，我先把这个任务交给角色创建子 Agent。',
      name: 'ts_agent_deep_agents_main',
      status: 1,
      type: 'llm',
    });
    const handedOff = applyAgentEvent(afterLlm, 'agent.end', {
      content: '已交还主Agent重新派活',
      name: 'ts_agent_chat',
      status: 1,
      type: 'agent',
      data: {
        status: 'HANDOFF',
      },
    });
    const subagentStarted = applyAgentEvent(handedOff, 'subagent.start', {
      content: '开始执行 role_task_agent',
      name: 'role_task_agent',
      status: 2,
      type: 'subagent',
    });
    const subagentLlmStarted = applyAgentEvent(subagentStarted, 'llm.start', {
      content: '开始生成',
      name: 'role_create_dialog',
      status: 2,
      type: 'llm',
    });
    const subagentDelta = reduceAgentChatStreamState(
      subagentLlmStarted,
      'llm.delta',
      '我们先来确定角色的基本设定。',
    );

    expect(subagentStarted.finalText).toBe('');
    expect(subagentDelta.finalText).toBe('我们先来确定角色的基本设定。');
  });
});

describe('reduceAgentChatStreamState legacy handoff compatibility', () => {
  it('discards a transition message when agent.end omits HANDOFF data', () => {
    const afterLlm = applyAgentEvent(startMainAgent(), 'llm.end', {
      content: '（已为您启动角色创建流程）',
      name: 'ts_agent_deep_agents_main',
      status: 1,
      type: 'llm',
    });
    const handedOff = applyAgentEvent(afterLlm, 'agent.end', {
      content: '已交还主Agent重新派活',
      name: 'ts_agent_chat',
      status: 1,
      type: 'agent',
    });
    const subagentStarted = applyAgentEvent(handedOff, 'subagent.start', {
      content: '开始执行 role_task_agent',
      name: 'role_task_agent',
      status: 2,
      type: 'subagent',
    });

    expect(handedOff.finalText).toBe('');
    expect(handedOff.pendingMainText).toBe('');
    expect(subagentStarted.finalText).toBe('');
    expect(subagentStarted.pendingMainText).toBe('');
    expect(subagentStarted.steps.find(step => step.kind === 'llm')?.text).toBe('');
  });
});
