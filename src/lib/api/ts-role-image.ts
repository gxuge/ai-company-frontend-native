import type { TsImageResource } from './ts-image';
import { defHttp } from './def-http';

export type TsRoleOneClickImageGeneratePayload = {
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
  promptCode?: string;
  promptVersion?: string;
};

export type TsUserImageAssetImportPayload = {
  sourceImageUrl: string;
  fileName?: string;
  sourceType?: string;
  sourceKey?: string;
};

export type TsRoleGenerateImageByPromptPayload = {
  promptText: string;
  styleName?: string;
  referenceImageUrl?: string;
};

export type TsRoleGenerateImageByPromptResult = {
  promptUsed?: string;
  styleUsed?: string;
  referenceImageUrl?: string;
  originalImageUrls?: string[];
  imageUrls?: string[];
  imageUrl?: string;
  snapshotKey?: string;
};

export type TsUserImageAsset = {
  id: number;
  userId?: string;
  fileName?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  sourceType?: string;
  alreadySaved?: boolean;
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
  imageResources?: TsImageResource[];
  selectedImageAssetId?: number;
  selectedImageUrl?: string;
  sourceType?: string;
  isPublic?: number;
  status?: number;
  extJson?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TsRoleImageProfilePage = {
  records?: TsRoleImageProfile[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsRoleImageProfileQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  profileName?: string;
  styleName?: string;
  sourceType?: string;
  isPublic?: number;
  status?: number;
};

export type TsRoleImageProfilePublic = {
  id: number;
  profileName?: string;
  styleName?: string;
  imageResources?: TsImageResource[];
  selectedImageUrl?: string;
  sourceType?: string;
  promptText?: string;
  authorName?: string;
  authorAvatar?: string;
  updatedAt?: string;
};

export type TsRoleImageProfilePublicPage = {
  records?: TsRoleImageProfilePublic[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsRoleImageProfilePublicQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  styleName?: string;
  sourceType?: string;
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
      url: '/sys/ai-images/generate',
      data: payload,
      timeout: 60_000,
    });
  },

  async importGeneratedImage(payload: TsUserImageAssetImportPayload) {
    return defHttp.post<TsUserImageAsset>({
      url: '/sys/ts-user-image-assets/import',
      data: payload,
      timeout: 60_000,
    });
  },

  async generateImageByPrompt(payload: TsRoleGenerateImageByPromptPayload) {
    return defHttp.post<TsRoleGenerateImageByPromptResult>({
      url: '/sys/ts-roles/generate-image-by-prompt',
      data: payload,
      timeout: 60_000,
    });
  },

  async getUserImageAssets(params: TsUserImageAssetQuery) {
    return defHttp.get<TsUserImageAssetPage>({
      url: '/sys/ts-user-image-assets',
      params,
    });
  },

  async deleteUserImageAsset(id: number) {
    return defHttp.delete<void>({
      url: '/sys/ts-user-image-assets',
      params: { id },
    });
  },

  async createRoleImageProfile(payload: TsRoleImageProfileSavePayload) {
    return defHttp.post<TsRoleImageProfile>({
      url: '/sys/ts-role-image-profiles',
      data: payload,
    });
  },

  async getRoleImageProfileList(params: TsRoleImageProfileQuery) {
    return defHttp.get<TsRoleImageProfilePage>({
      url: '/sys/ts-role-image-profiles',
      params,
    });
  },

  async getPublicRoleImageProfileList(params: TsRoleImageProfilePublicQuery) {
    return defHttp.get<TsRoleImageProfilePublicPage>({
      url: '/sys/ts-role-image-profiles/public',
      params,
      withToken: false,
    });
  },
};
