import { defHttp } from './def-http';

export type TsDraftType = 'role' | 'story';

export type TsDraftContent = Record<string, unknown>;

export type TsDraftRecord = {
  id: number;
  draftType: TsDraftType;
  draftName: string;
  sourceId?: number;
  content: TsDraftContent;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsDraftPage = {
  records?: TsDraftRecord[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsDraftQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  draftType?: TsDraftType;
  sourceId?: number;
};

export type TsDraftSavePayload = {
  id?: number;
  draftType: TsDraftType;
  draftName: string;
  sourceId?: number;
  content: TsDraftContent;
};

export const tsDraftApi = {
  async getDraftList(params: TsDraftQuery) {
    return defHttp.get<TsDraftPage>({
      url: '/sys/ts-drafts',
      params,
    });
  },

  async getDraftDetail(id: number) {
    return defHttp.get<TsDraftRecord>({
      url: '/sys/ts-drafts/detail',
      params: { id },
    });
  },

  async createDraft(payload: TsDraftSavePayload) {
    return defHttp.post<TsDraftRecord>({
      url: '/sys/ts-drafts',
      data: payload,
    });
  },

  async updateDraft(payload: TsDraftSavePayload & { id: number }) {
    return defHttp.put<TsDraftRecord>({
      url: '/sys/ts-drafts',
      data: payload,
    });
  },

  async deleteDraft(id: number) {
    return defHttp.delete<void>({
      url: '/sys/ts-drafts',
      params: { id },
    });
  },
};
