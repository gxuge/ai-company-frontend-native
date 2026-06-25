import { defHttp } from './def-http';

export type TsAgentChatSession = {
  id: number;
  sessionNo?: string;
  appId?: string;
  agentCode?: string;
  userId?: string;
  sessionTitle?: string;
  sessionSummary?: string;
  sessionStatus?: string;
  memoryJson?: string;
  lastMessageId?: number;
  lastMessageAt?: string;
  messageCount?: number;
  turnCount?: number;
  isDeleted?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsAgentChatSessionPage = {
  records?: TsAgentChatSession[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsAgentChatSessionQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  agentCode?: string;
  sessionStatus?: string;
};

export type TsAgentChatSessionSavePayload = {
  appId: string;
  agentCode: string;
  sessionTitle?: string;
  sessionSummary?: string;
  memoryJson?: string;
};

export type TsAgentChatMessage = {
  id: number;
  sessionId?: number;
  messageNo?: number;
  roleType?: string;
  content?: string;
  contentRaw?: string;
  contentFormat?: string;
  messageStatus?: string;
  parentMessageId?: number;
  runId?: string;
  promptCode?: string;
  modelId?: string;
  tokenUsageJson?: string;
  extJson?: string;
  isDeleted?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsAgentChatMessagePage = {
  records?: TsAgentChatMessage[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsAgentChatMessageQuery = {
  sessionId: number;
  pageNo?: number;
  pageSize?: number;
  roleType?: string;
  messageStatus?: string;
  keyword?: string;
};

export type TsAgentChatReplyPayload = {
  sessionId: number;
  userInput: string;
  historyCount?: number;
};

export type TsAgentChatReplyResult = {
  sessionId?: number;
  userMessageId?: number;
  assistantMessageId?: number;
  contentText?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  createdAt?: string;
};

export const tsAgentChatApi = {
  async getSessionList(params: TsAgentChatSessionQuery) {
    return defHttp.get<TsAgentChatSessionPage>({
      url: '/sys/ts-agent-chat-sessions',
      params,
    });
  },

  async getSessionDetail(id: number) {
    return defHttp.get<TsAgentChatSession>({
      url: '/sys/ts-agent-chat-sessions/detail',
      params: { id },
    });
  },

  async createSession(payload: TsAgentChatSessionSavePayload) {
    return defHttp.post<TsAgentChatSession>({
      url: '/sys/ts-agent-chat-sessions',
      data: payload,
    });
  },

  async deleteSession(id: number) {
    return defHttp.delete({
      url: '/sys/ts-agent-chat-sessions',
      params: { id },
    });
  },

  async getMessageList(params: TsAgentChatMessageQuery) {
    return defHttp.get<TsAgentChatMessagePage>({
      url: '/sys/ts-agent-chat-messages',
      params,
    });
  },

  async getMessageDetail(id: number) {
    return defHttp.get<TsAgentChatMessage>({
      url: '/sys/ts-agent-chat-messages/detail',
      params: { id },
    });
  },

  async createAiReply(payload: TsAgentChatReplyPayload) {
    return defHttp.post<TsAgentChatReplyResult>({
      url: '/sys/ts-agent-chat-sessions/ai-reply',
      data: payload,
    });
  },
};
