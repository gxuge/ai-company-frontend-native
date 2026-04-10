import { defHttp } from './def-http';

export type TsChatSession = {
  id: number;
  userId?: string;
  storyId?: number;
  roleId?: number;
  sessionType?: string;
  sessionTitle?: string;
  coverUrl?: string;
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
  roleId?: number;
  status?: number;
};

export type TsChatMessage = {
  id: number;
  sessionId: number;
  senderType?: string;
  senderId?: string;
  roleId?: number;
  contentType?: string;
  contentText?: string;
  contentUrl?: string;
  extJson?: string;
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

export const tsChatApi = {
  async getSessionList(params: TsChatSessionQuery) {
    return defHttp.get<TsChatSessionPage>({
      url: '/sys/ts-chat-sessions',
      params,
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
};
