import type { AxiosResponse } from 'axios';
import { defHttp } from './def-http';

export type TsImageType = 'user_avatar'
  | 'character_image'
  | 'character_avatar'
  | 'story_scene';

export type TsImageDownloadPayload = {
  sourceImageUrl: string;
  fileName?: string;
};

export type TsImageResource = {
  imageType?: TsImageType | string;
  url?: string;
  sourceField?: string;
  variant?: string;
  privacy?: string;
  userId?: string;
  characterId?: number;
  storyId?: number;
  sceneId?: number;
  sourceImageId?: number;
};

type TsImageResourceOwner = {
  imageResources?: TsImageResource[] | null;
};

function normalizeUrl(value?: string | null) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

export function getTsImageResources(source?: TsImageResourceOwner | TsImageResource[] | null) {
  const resources = Array.isArray(source)
    ? source
    : Array.isArray(source?.imageResources)
      ? source.imageResources
      : [];

  return resources.filter((item): item is TsImageResource => Boolean(normalizeUrl(item?.url)));
}

export function pickTsImageResource(
  source: TsImageResourceOwner | TsImageResource[] | null | undefined,
  ...imageTypes: TsImageType[]
) {
  const resources = getTsImageResources(source);
  for (const imageType of imageTypes) {
    const match = resources.find(item => item.imageType === imageType);
    if (match) {
      return match;
    }
  }
  return resources[0];
}

export function pickTsImageUrl(
  source: TsImageResourceOwner | TsImageResource[] | null | undefined,
  ...imageTypes: TsImageType[]
) {
  const resource = pickTsImageResource(source, ...imageTypes);
  return normalizeUrl(resource?.url) || undefined;
}

export const tsImageApi = {
  async downloadImage(payload: TsImageDownloadPayload) {
    return defHttp.post<AxiosResponse<Blob>>({
      url: '/sys/ts-images/download',
      data: payload,
      responseType: 'blob',
      timeout: 60_000,
    }, {
      isReturnNativeResponse: true,
      isTransformResponse: false,
    });
  },
};
