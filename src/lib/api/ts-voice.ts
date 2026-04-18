import { defHttp } from './def-http';

export type TsVoiceTag = {
  id: number;
  tagName?: string;
  createdAt?: string;
};

export type TsVoiceProfile = {
  id: number;
  name?: string;
  providerVoiceId?: string;
  avatarUrl?: string;
  gender?: string;
  ageGroup?: string;
  status?: number;
  sortNo?: number;
  tagIds?: number[];
  tags?: TsVoiceTag[];
  createdAt?: string;
  updatedAt?: string;
};

export type TsVoiceProfilePage = {
  records?: TsVoiceProfile[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsVoiceProfileQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  gender?: string;
  ageGroup?: string;
  status?: number;
};

export type TsUserVoiceConfig = {
  id?: number;
  userId?: string;
  selectedVoiceProfileId?: number | null;
  selectedVoiceProfile?: TsVoiceProfile | null;
  pitchPercent?: number | null;
  speedRate?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TsUserVoiceConfigSavePayload = {
  selectedVoiceProfileId: number;
  pitchPercent?: number;
  speedRate?: number;
};

export type TsVoiceProfilePreviewPayload = {
  voiceProfileId?: number;
  voiceId?: string;
  previewText?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
};

export type TsVoiceProfilePreviewResult = {
  voiceProfileId?: number;
  voiceName?: string;
  providerVoiceId?: string;
  matchSource?: string;
  previewText?: string;
  previewAudioUrl?: string;
};

export const tsVoiceApi = {
  async getVoiceProfiles(params: TsVoiceProfileQuery) {
    return defHttp.get<TsVoiceProfilePage>({
      url: '/sys/ts-voice-profiles',
      params,
    });
  },

  async getCurrentVoiceConfig() {
    return defHttp.get<TsUserVoiceConfig>({
      url: '/sys/ts-user-voice-config/current',
    });
  },

  async getUserVoiceProfiles(params: TsVoiceProfileQuery) {
    return defHttp.get<TsVoiceProfilePage>({
      url: '/sys/ts-user-voice-profiles',
      params,
    });
  },

  async saveCurrentVoiceConfig(payload: TsUserVoiceConfigSavePayload) {
    return defHttp.put<TsUserVoiceConfig>({
      url: '/sys/ts-user-voice-config/current',
      data: payload,
    });
  },

  async previewVoiceProfile(payload: TsVoiceProfilePreviewPayload) {
    return defHttp.post<TsVoiceProfilePreviewResult>({
      url: '/sys/ts-voice-profiles/preview',
      data: payload,
    });
  },
};
