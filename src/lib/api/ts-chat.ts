import type { TsImageResourceCollection } from './ts-image';
import { defHttp } from './def-http';

export type TsChatSession = {
  id: number;
  userId?: string;
  storyId?: number;
  targetRoleId?: number;
  roleId?: number;
  imageResources?: TsImageResourceCollection;
  sessionType?: string;
  isSystemSession?: boolean;
  sessionTitle?: string;
  roleAvatarUrl?: string;
  coverUrl?: string;
  sessionStatus?: number;
  lastMessageId?: number;
  lastMessageAt?: string;
  unreadCount?: number;
  extJson?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsChatSessionPage = {
  records?: TsChatSession[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsChatSessionQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  sessionType?: string;
  storyId?: number;
  targetRoleId?: number;
  /** @deprecated use targetRoleId */
  roleId?: number;
  status?: number;
};

export type TsChatMessage = {
  id: number;
  sessionId: number;
  senderType?: string;
  senderId?: number;
  senderName?: string;
  roleId?: number;
  messageType?: string;
  contentType?: string;
  contentText?: string;
  contentJson?: string;
  extJson?: string;
  generateStatus?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsChatMessagePage = {
  records?: TsChatMessage[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsChatMessageQuery = {
  sessionId?: number;
  pageNo?: number;
  pageSize?: number;
  senderType?: string;
  contentType?: string;
  status?: number;
};

export type TsChatAiReplyPayload = {
  sessionId: number;
  userContent: string;
  historyCount?: number;
  voiceProfileId?: number;
  voiceId?: string;
  generateVoice?: boolean;
  speed?: number;
  pitch?: number;
  volume?: number;
};

export type TsChatAiReplyResult = {
  sessionId?: number;
  userMessageId?: number;
  assistantMessageId?: number;
  attachmentId?: number;
  voiceProfileId?: number;
  voiceId?: string;
  contentText?: string;
  audioUrl?: string;
  audioCacheKey?: string;
  audioFileSize?: number;
  durationSec?: number;
  mimeType?: string;
  createdAt?: string;
};

export type TsChatTemplateReplyPayload = {
  sessionId: number;
  userInput: string;
  activeRoleId?: number;
  historyCount?: number;
  lastAssistantMessageId?: number;
};

export type TsChatTemplateReplyResult = {
  sessionId?: number;
  activeRoleId?: number;
  userMessageId?: number;
  assistantMessageId?: number;
  activeRoleName?: string;
  contentText?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
  createdAt?: string;
};

export type TsChatMessageTtsPayload = {
  sessionId: number;
  messageId: number;
  voiceProfileId?: number;
  voiceId?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
};

export type TsChatMessageTtsResult = {
  sessionId?: number;
  messageId?: number;
  voiceProfileId?: number;
  voiceId?: string;
  ttsText?: string;
  audioUrl?: string;
  audioCacheKey?: string;
  audioFileSize?: number;
  durationSec?: number;
  mimeType?: string;
  createdAt?: string;
};

export type TsChatReplySuggestionsPayload = {
  sessionId: number;
  historyCount?: number;
  userDraft?: string;
  lastAssistantMessageId?: number;
};

export type TsChatReplySuggestionsResult = {
  sessionId?: number;
  suggestions?: string[];
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export const tsChatApi = {
  async getSessionList(params: TsChatSessionQuery) {
    const normalizedParams: TsChatSessionQuery = {
      ...params,
      targetRoleId: params?.targetRoleId ?? params?.roleId,
    };
    return defHttp.get<TsChatSessionPage>({
      url: '/sys/ts-chat-sessions',
      params: normalizedParams,
    });
  },

  async getSessionDetail(sessionId: number) {
    return defHttp.get<TsChatSession>({
      url: '/sys/ts-chat-sessions/detail',
      params: { id: sessionId },
    });
  },

  async getMessageList(params: TsChatMessageQuery) {
    return defHttp.get<TsChatMessagePage>({
      url: '/sys/ts-chat-messages',
      params,
    });
  },

  async getMessageDetail(messageId: number) {
    return defHttp.get<TsChatMessage>({
      url: '/sys/ts-chat-messages/detail',
      params: { id: messageId },
    });
  },

  async createSession(payload: {
    storyId?: number;
    targetRoleId?: number;
    /** @deprecated use targetRoleId */
    roleId?: number;
    sessionType?: string;
    sessionTitle?: string;
  }) {
    const normalizedPayload = {
      ...payload,
      targetRoleId: payload?.targetRoleId ?? payload?.roleId,
    };
    return defHttp.post<TsChatSession>({
      url: '/sys/ts-chat-sessions',
      data: normalizedPayload,
    });
  },

  async createAiReply(payload: TsChatAiReplyPayload) {
    return defHttp.post<TsChatAiReplyResult>({
      url: '/sys/ts-chat-sessions/ai-reply',
      data: payload,
    });
  },

  async createTemplateAiReply(payload: TsChatTemplateReplyPayload) {
    return defHttp.post<TsChatTemplateReplyResult>({
      url: '/sys/ts-chat-sessions/ai-reply-template',
      data: payload,
    });
  },

  async createMessageTts(payload: TsChatMessageTtsPayload) {
    return defHttp.post<TsChatMessageTtsResult>({
      url: '/sys/ts-chat-sessions/message-tts',
      data: payload,
    });
  },

  async createReplySuggestions(payload: TsChatReplySuggestionsPayload) {
    return defHttp.post<TsChatReplySuggestionsResult>({
      url: '/sys/ts-chat-sessions/reply-suggestions',
      data: payload,
    });
  },
};
