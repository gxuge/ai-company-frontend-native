import { defHttp } from './def-http';

export type TsRoleTag = {
  id: number;
  tagName?: string;
  status?: number;
  sortNo?: number;
};

export const tsRoleTagApi = {
  async getRoleTags() {
    return defHttp.get<TsRoleTag[]>({
      url: '/sys/ts-role-tags',
    });
  },
};
