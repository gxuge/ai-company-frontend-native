import { iterateSseEvents } from '../stream';
import {
  createAgentChatHistoryState,
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

describe('structured agent errors', () => {
  it('preserves structured errors for realtime and history tool events', () => {
    const realtime = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'tool.error',
      {
        async: false,
        content: 'Tool execution failed',
        errorCode: 'AGENT.TOOL.COMMON.EXECUTION_FAILED',
        errorCategory: 'TOOL',
        retryable: true,
        errorArgs: {
          toolName: 'role_generate_complete',
        },
        eventId: 'tool-error-event',
        toolName: 'role_generate_complete',
      },
    );

    expect(realtime).toMatchObject({
      errorCode: 'AGENT.TOOL.COMMON.EXECUTION_FAILED',
      errorCategory: 'TOOL',
      retryable: true,
      errorArgs: {
        toolName: 'role_generate_complete',
      },
    });
    expect(realtime.steps[0]).toMatchObject({
      errorCode: 'AGENT.TOOL.COMMON.EXECUTION_FAILED',
      errorCategory: 'TOOL',
      retryable: true,
    });

    const history = createAsyncToolHistoryState({
      id: 'history-error-event',
      type: 'tool',
      name: 'story_generate_complete',
      status: 0,
      content: 'Story generation failed',
      data: {
        async: true,
        errorCode: 'AGENT.TOOL.STORY_GENERATION.EXECUTION_FAILED',
        errorCategory: 'TOOL',
        retryable: true,
        errorArgs: {
          stage: 'scene_image',
        },
      },
    });

    expect(history?.steps[0]).toMatchObject({
      errorCode: 'AGENT.TOOL.STORY_GENERATION.EXECUTION_FAILED',
      errorCategory: 'TOOL',
      retryable: true,
      errorArgs: {
        stage: 'scene_image',
      },
    });
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

  it('keeps image classification when tool.error reports an error content type', () => {
    let state = applyAgentEvent(createInitialAgentChatStreamState(), 'tool.start', {
      content: 'Calling role_generate_role_image',
      contentType: 'image',
      name: 'role_create_image',
      status: 2,
      toolName: 'role_generate_role_image',
      type: 'tool',
    });
    state = applyAgentEvent(state, 'tool.error', {
      content: 'Image generation failed',
      contentType: 'error',
      name: 'role_create_image',
      status: 0,
      toolName: 'role_generate_role_image',
      type: 'tool',
    });

    expect(state.steps.at(-1)).toMatchObject({
      contentType: 'image',
      status: 'error',
      toolName: 'role_generate_role_image',
    });
  });
});

describe('assistant history timeline', () => {
  it('restores LLM text and tools in their persisted order', () => {
    const historyState = createAgentChatHistoryState([
      {
        id: 'llm-1',
        type: 'llm',
        name: 'deepseek-v4-flash',
        nodeName: 'role_create_image',
        content: '我先帮你整理形象设定。',
        status: 1,
        data: {
          input: { promptCode: 'role_image_generate' },
          output: { content: '我先帮你整理形象设定。' },
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        name: 'role_generate_role_image',
        nodeName: 'role_create_image',
        content: '图片生成失败',
        status: 0,
        data: {
          input: { arguments: {} },
          output: null,
          error: { code: 'IMAGE_FAILED', message: '图片生成失败' },
          metrics: {},
        },
      },
      {
        id: 'llm-2',
        type: 'llm',
        name: 'deepseek-v4-flash',
        nodeName: 'role_create_image',
        content: '刚才出了点状况，我再试一次。',
        status: 1,
        data: {
          output: { content: '刚才出了点状况，我再试一次。' },
        },
      },
      {
        id: 'tool-2',
        type: 'tool',
        name: 'role_generate_role_image',
        nodeName: 'role_create_image',
        content: '图片生成完成',
        status: 1,
        data: {
          input: { arguments: {} },
          output: {
            contentType: 'image',
            resourceType: 'role_image',
            imageUrl: 'https://example.com/role.png',
          },
          error: null,
          metrics: {},
        },
      },
    ]);

    expect(historyState?.steps.map(step => [step.kind, step.text, step.status])).toEqual([
      ['llm', '我先帮你整理形象设定。', 'done'],
      ['tool', '图片生成失败', 'error'],
      ['llm', '刚才出了点状况，我再试一次。', 'done'],
      ['tool', '', 'done'],
    ]);
    expect(historyState?.steps[3]).toMatchObject({
      eventId: 'tool-2',
      contentType: 'image',
      imageUrl: 'https://example.com/role.png',
    });
    expect(historyState?.finalStatus).toBe('done');
  });
});

describe('reduceAgentChatStreamState tool-wrapped LLM text', () => {
  it('does not duplicate streamed text when llm.end contains the aggregated buffer', () => {
    let state = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'subagent.start',
      {
        content: '开始执行 role_image_task_agent',
        name: 'role_image_task_agent',
        status: 2,
        type: 'subagent',
      },
    );
    state = applyAgentEvent(state, 'llm.start', {
      content: '开始生成',
      name: 'role_create_image',
      status: 2,
      type: 'llm',
    });
    state = reduceAgentChatStreamState(state, 'llm.delta', '先补全角色形象。');
    state = applyAgentEvent(state, 'tool.start', {
      eventId: 'image-failed',
      name: 'role_create_image',
      toolName: 'role_generate_role_image',
      status: 2,
    });
    state = applyAgentEvent(state, 'tool.error', {
      eventId: 'image-failed',
      name: 'role_create_image',
      toolName: 'role_generate_role_image',
      status: 0,
    });
    state = reduceAgentChatStreamState(state, 'llm.delta', '图片生成失败，我再重试一次。');
    state = applyAgentEvent(state, 'tool.start', {
      eventId: 'image-success',
      name: 'role_create_image',
      toolName: 'role_generate_role_image',
      status: 2,
    });
    state = applyAgentEvent(state, 'tool.end', {
      eventId: 'image-success',
      name: 'role_create_image',
      toolName: 'role_generate_role_image',
      status: 1,
      contentType: 'image',
      resourceType: 'role_image',
      imageUrl: 'https://example.com/role.png',
    });
    state = applyAgentEvent(state, 'llm.end', {
      content: '先补全角色形象。图片生成失败，我再重试一次。',
      name: 'role_create_image',
      status: 1,
      type: 'llm',
    });

    expect(state.steps.filter(step => step.kind === 'llm').map(step => step.text)).toEqual([
      '先补全角色形象。',
      '图片生成失败，我再重试一次。',
    ]);
    expect(state.steps.find(step => step.eventId === 'image-success')).toMatchObject({
      status: 'done',
      contentType: 'image',
      imageUrl: 'https://example.com/role.png',
    });
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

describe('reduceAgentChatStreamState interruption', () => {
  it('captures run identity from agent.start and preserves partial LLM text', () => {
    const started = applyAgentEvent(
      createInitialAgentChatStreamState(),
      'agent.start',
      {
        content: '开始执行',
        name: 'ts_agent_chat',
        status: 2,
        data: {
          runId: 'run-interrupted-1',
          sessionId: 101,
        },
      },
    );
    const llmStarted = applyAgentEvent(started, 'llm.start', {
      content: '开始生成',
      name: 'role_create_dialog',
      status: 2,
    });
    const partial = reduceAgentChatStreamState(
      llmStarted,
      'llm.delta',
      '这是已经生成的部分内容。',
    );
    const llmStopped = applyAgentEvent(partial, 'llm.end', {
      content: '这是已经生成的部分内容。',
      name: 'role_create_dialog',
      status: 3,
    });
    const stopped = applyAgentEvent(llmStopped, 'agent.end', {
      content: '用户停止',
      name: 'ts_agent_chat',
      status: 3,
    });

    expect(started.runId).toBe('run-interrupted-1');
    expect(started.sessionId).toBe(101);
    expect(stopped.active).toBe(false);
    expect(stopped.finalStatus).toBe('interrupted');
    expect(stopped.steps.find(step => step.kind === 'llm')?.status).toBe('interrupted');
    expect(stopped.finalText).toBe('这是已经生成的部分内容。');
  });

  it('does not mark an already completed tool as interrupted', () => {
    const started = startMainAgent();
    const toolStarted = applyAgentEvent(started, 'tool.start', {
      name: 'completed_tool',
      toolName: 'completed_tool',
      status: 2,
    });
    const toolCompleted = applyAgentEvent(toolStarted, 'tool.end', {
      name: 'completed_tool',
      toolName: 'completed_tool',
      status: 1,
      content: '工具已完成',
    });
    const stopped = applyAgentEvent(toolCompleted, 'agent.end', {
      name: 'ts_agent_chat',
      status: 3,
      content: '用户停止',
    });

    expect(stopped.finalStatus).toBe('interrupted');
    expect(stopped.steps.find(step => step.toolName === 'completed_tool')?.status).toBe('done');
  });

  it('keeps history interrupted when an async tool completes later', () => {
    const restored = createAgentChatHistoryState([
      {
        id: 'llm-interrupted',
        type: 'llm',
        name: 'role_create_dialog',
        nodeName: 'role_create_dialog',
        content: '部分生成内容',
        status: 3,
      },
      {
        id: 'async-tool-completed',
        type: 'tool',
        name: 'role_image',
        nodeName: 'role_image',
        content: '',
        status: 1,
        data: {
          async: true,
          output: {
            contentType: 'image',
            imageUrl: 'https://example.com/role.png',
          },
        },
      },
    ]);

    expect(restored?.finalStatus).toBe('interrupted');
    expect(restored?.steps.find(step => step.eventId === 'async-tool-completed')?.status).toBe('done');
  });
});
