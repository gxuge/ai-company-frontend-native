import { defHttp } from './def-http';

export type TsRoleOneClickImageGeneratePayload = {
  roleId?: number;
  roleName?: string;
  gender?: 'male' | 'female' | 'unknown' | 'random';
  occupation?: string;
  backgroundStory?: string;
  styleName?: string;
  aspectRatio?: string;
  referenceImageUrl?: string;
};

export type TsRoleOneClickImageGenerateResult = {
  imageUrl?: string;
  imageAssetId?: number;
  generateRecordId?: number;
  imagePrompt?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsUserImageAsset = {
  id: number;
  userId?: string;
  fileName?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  sourceType?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsUserImageAssetPage = {
  records?: TsUserImageAsset[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsUserImageAssetQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  sourceType?: string;
  status?: number;
};

export type TsRoleImageProfile = {
  id: number;
  profileName?: string;
  ownerUserId?: string;
  promptText?: string;
  styleName?: string;
  selectedImageAssetId?: number;
  selectedImageUrl?: string;
  sourceType?: string;
  isPublic?: number;
  status?: number;
  extJson?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TsRoleImageProfileSavePayload = {
  profileName?: string;
  promptText?: string;
  styleName?: string;
  selectedImageAssetId?: number;
  selectedImageUrl?: string;
  sourceType?: string;
  isPublic?: number;
  status?: number;
  extJson?: string;
};

export const tsRoleImageApi = {
  async generateRoleImage(payload: TsRoleOneClickImageGeneratePayload) {
    return defHttp.post<TsRoleOneClickImageGenerateResult>({
      url: '/sys/ts-roles/one-click-image',
      data: payload,
    });
  },

  async getUserImageAssets(params: TsUserImageAssetQuery) {
    return defHttp.get<TsUserImageAssetPage>({
      url: '/sys/ts-user-image-assets',
      params,
    });
  },

  async createRoleImageProfile(payload: TsRoleImageProfileSavePayload) {
    return defHttp.post<TsRoleImageProfile>({
      url: '/sys/ts-role-image-profiles',
      data: payload,
    });
  },
};
