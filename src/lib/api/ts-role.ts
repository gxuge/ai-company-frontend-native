import { defHttp } from './def-http';

export type TsRoleDetail = {
  id: number;
  userId: string;
  roleName?: string;
  roleSubtitle?: string;
  avatarUrl?: string;
  coverUrl?: string;
  gender?: string;
  occupation?: string;
  introText?: string;
  personaText?: string;
  backgroundStory?: string;
  storyText?: string;
  dialoguePreview?: string;
  dialogueLength?: string;
  toneTendency?: string;
  interactionMode?: string;
  voiceName?: string;
  extJson?: string;
  isPublic?: number;
  basicAiGenerated?: number;
  advancedAiGenerated?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TsRoleAuthorPublic = {
  userId: string;
  displayName?: string;
  avatar?: string;
  verified?: number;
  bio?: string | null;
};

export type TsRolePage = {
  records?: TsRoleDetail[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsRoleQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  gender?: string;
  status?: number;
  isPublic?: number;
};

export type TsRoleGender = 'male' | 'female' | 'unknown' | 'random';

export type TsRoleSavePayload = {
  id?: number;
  roleName: string;
  roleSubtitle?: string;
  avatarUrl?: string;
  coverUrl?: string;
  gender?: Exclude<TsRoleGender, 'random'>;
  occupation?: string;
  introText?: string;
  personaText?: string;
  backgroundStory?: string;
  storyText?: string;
  dialoguePreview?: string;
  dialogueLength?: string;
  toneTendency?: string;
  interactionMode?: string;
  voiceName?: string;
  extJson?: string;
  isPublic?: number;
  basicAiGenerated?: number;
  advancedAiGenerated?: number;
  status?: number;
};

export type TsRoleOneClickSettingGeneratePayload = {
  roleId?: number;
  roleName?: string;
  gender?: TsRoleGender;
  occupation?: string;
  backgroundStory?: string;
  styleHint?: string;
  keywords?: string;
};

export type TsRoleOneClickSettingGenerateResult = {
  roleName?: string;
  gender?: string;
  occupation?: string;
  backgroundStory?: string;
  filledFields?: string[];
  keptFields?: string[];
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsRoleOneClickImagePayload = {
  roleId?: number;
  roleName?: string;
  gender?: TsRoleGender;
  occupation?: string;
  backgroundStory?: string;
  styleName?: string;
  aspectRatio?: string;
  referenceImageUrl?: string;
  asyncGenerate?: boolean;
};

export type TsRoleOneClickImageResult = {
  accepted?: boolean;
  generateStatus?: string;
  imageUrl?: string;
  imageAssetId?: number;
  generateRecordId?: number;
  imagePrompt?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsRoleImageGenerateRecordDetail = {
  id: number;
  roleId?: number;
  generateStatus?: string;
  applyStatus?: string;
  resultAssetId?: number;
  resultImageUrl?: string;
  failReason?: string;
  promptText?: string;
  styleName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TsRoleOneClickVoiceGeneratePayload = {
  roleId?: number;
  roleName?: string;
  gender?: TsRoleGender;
  occupation?: string;
  backgroundStory?: string;
  preferredVoiceName?: string;
  targetTone?: string;
  previewText?: string;
};

export type TsRoleOneClickVoiceGenerateResult = {
  voice?: {
    voiceName?: string;
    voiceGender?: string;
    voiceProfileId?: number;
    providerVoiceId?: string;
    previewText?: string;
    previewAudioUrl?: string;
    speed?: number;
    pitch?: number;
    volume?: number;
    selectionReason?: string;
    matchSource?: string;
    traceId?: string;
    schemaVersion?: string;
  };
  voiceProfileId?: number;
  voiceName?: string;
  providerVoiceId?: string;
  recommendation?: string;
  previewText?: string;
  previewAudioUrl?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  matchSource?: string;
  traceId?: string;
  schemaVersion?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsRoleGenerateRolePayload = {
  storySetting?: string;
  storyBackground?: string;
};

export type TsRoleGenerateRoleResult = {
  roleId?: number;
  settingResult?: TsRoleOneClickSettingGenerateResult;
  imageResult?: TsRoleOneClickImageResult;
  voiceResult?: TsRoleOneClickVoiceGenerateResult;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsRoleGenerateTextByTemplatePayload = {
  promptCode?: string;
  promptVersion?: string;
  variables?: Record<string, string | number | boolean | null | undefined>;
};

export type TsRoleGenerateTextByTemplateResult = {
  generatedText?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export const tsRoleApi = {
  async getRoleList(params: TsRoleQuery) {
    return defHttp.get<TsRolePage>({
      url: '/sys/ts-roles',
      params,
    });
  },

  async getRoleDetail(roleId: number) {
    return defHttp.get<TsRoleDetail>({
      url: '/sys/ts-roles/detail',
      params: { id: roleId },
    });
  },

  async getRoleAuthorPublic(roleId: number) {
    return defHttp.get<TsRoleAuthorPublic>(
      {
        url: '/sys/ts-roles/author-public',
        params: { roleId },
      },
      { withToken: false },
    );
  },

  async createRole(payload: TsRoleSavePayload) {
    return defHttp.post<TsRoleDetail>({
      url: '/sys/ts-roles',
      data: payload,
    });
  },

  async updateRole(payload: TsRoleSavePayload & { id: number }) {
    return defHttp.put<TsRoleDetail>({
      url: '/sys/ts-roles',
      data: payload,
    });
  },

  async generateRoleSetting(payload: TsRoleOneClickSettingGeneratePayload) {
    return defHttp.post<TsRoleOneClickSettingGenerateResult>({
      url: '/sys/ts-roles/one-click-setting',
      data: payload,
    });
  },

  async generateRoleImage(payload: TsRoleOneClickImagePayload) {
    return defHttp.post<TsRoleOneClickImageResult>({
      url: '/sys/ts-roles/one-click-image',
      data: payload,
      timeout: 60_000,
    });
  },

  async getImageGenerateRecordDetail(id: number) {
    return defHttp.get<TsRoleImageGenerateRecordDetail>({
      url: '/sys/ts-role-image-generate-records/detail',
      params: { id },
    });
  },

  async generateRoleVoice(payload: TsRoleOneClickVoiceGeneratePayload) {
    return defHttp.post<TsRoleOneClickVoiceGenerateResult>({
      url: '/sys/ts-roles/one-click-voice',
      data: payload,
      timeout: 60_000,
    });
  },

  async generateRole(payload: TsRoleGenerateRolePayload) {
    return defHttp.post<TsRoleGenerateRoleResult>({
      url: '/sys/ts-roles/generate-role',
      data: payload,
    });
  },

  async generateTextByTemplate(payload: TsRoleGenerateTextByTemplatePayload) {
    return defHttp.post<TsRoleGenerateTextByTemplateResult>({
      url: '/sys/ts-roles/generate-text-by-template',
      data: payload,
    });
  },
};
