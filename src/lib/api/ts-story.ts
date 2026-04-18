import { defHttp } from './def-http';

export type TsStoryRoleBinding = {
  roleId?: number;
  roleType?: string;
  sortNo?: number;
  isRequired?: number;
  joinSource?: string;
};

export type TsStorySavePayload = {
  id?: number;
  title: string;
  storyIntro?: string;
  storyMode?: string;
  storySetting?: string;
  storyBackground?: string;
  coverUrl?: string;
  sceneId?: number;
  sceneNameSnapshot?: string;
  status?: number;
  isPublic?: number;
  isAiStorySetting?: number;
  isAiCharacter?: number;
  isAiOutline?: number;
  remark?: string;
  roleBindings?: TsStoryRoleBinding[];
};

export type TsStory = {
  id: number;
  storyCode?: string;
  userId?: string;
  title?: string;
  storyIntro?: string;
  storyMode?: string;
  storySetting?: string;
  storyBackground?: string;
  coverUrl?: string;
  sceneId?: number;
  sceneNameSnapshot?: string;
  status?: number;
  isPublic?: number;
  isAiStorySetting?: number;
  isAiCharacter?: number;
  isAiOutline?: number;
  remark?: string;
  createdBy?: string;
  createdName?: string;
  updatedBy?: string;
  updatedName?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: number;
  followerCount?: number;
  dialogueCount?: number;
  roleBindings?: TsStoryRoleBinding[];
};

export type TsStoryPage = {
  records?: TsStory[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsStoryPublic = {
  id: number;
  title?: string;
  storyIntro?: string;
  storyMode?: string;
  coverUrl?: string;
  followerCount?: number;
  dialogueCount?: number;
  authorName?: string;
  authorAvatar?: string;
  updatedAt?: string;
};

export type TsStoryPublicPage = {
  records?: TsStoryPublic[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsStoryQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
  isPublic?: number;
  storyMode?: string;
};

export type TsStoryPublicQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  storyMode?: string;
};

export type TsStoryChapter = {
  id: number;
  storyId?: number;
  chapterNo?: number;
  chapterTitle?: string;
  chapterDesc?: string;
  openingContent?: string;
  openingRoleId?: number;
  missionTarget?: string;
  status?: number;
  isAiGenerated?: number;
  sortNo?: number;
  createdAt?: string;
  updatedAt?: string;
  forbiddenRoleIds?: number[];
};

export type TsStoryChapterPage = {
  records?: TsStoryChapter[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
};

export type TsStoryChapterQuery = {
  pageNo?: number;
  pageSize?: number;
  storyId: number;
  keyword?: string;
  status?: number;
};

export type TsStoryChapterSavePayload = {
  id?: number;
  storyId: number;
  chapterNo?: number;
  chapterTitle?: string;
  chapterDesc?: string;
  openingContent?: string;
  openingRoleId?: number;
  missionTarget?: string;
  status?: number;
  isAiGenerated?: number;
  sortNo?: number;
  forbiddenRoleIds?: number[];
};

export type TsStoryOneClickSettingGeneratePayload = {
  storyId?: number;
  title?: string;
  storyMode?: string;
  storyIntro?: string;
  storySetting?: string;
  storyBackground?: string;
  ideaInput?: string;
  styleHint?: string;
};

export type TsStoryOneClickSettingGenerateResult = {
  title?: string;
  storyIntro?: string;
  storyMode?: string;
  storySetting?: string;
  storyBackground?: string;
  generated?: boolean;
  fallbackReason?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsStoryOneClickSceneGeneratePayload = {
  title?: string;
  storyMode?: string;
  storySetting?: string;
  storyBackground?: string;
  sceneSetting?: string;
  styleHint?: string;
};

export type TsStoryOneClickSceneGenerateResult = {
  sceneNameSnapshot?: string;
  sceneSummary?: string;
  sceneElements?: string[];
  generated?: boolean;
  fallbackReason?: string;
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export type TsStoryOneClickOutlineChapter = {
  chapterNo?: number;
  chapterTitle?: string;
  chapterDesc?: string;
  openingContent?: string;
  openingRoleName?: string;
  missionTarget?: string;
  forbiddenRoleNames?: string[];
};

export type TsStoryOneClickOutlineGeneratePayload = {
  storyId?: number;
  title?: string;
  storyMode?: string;
  storySetting?: string;
  sceneSetting?: string;
  storyBackground?: string;
  chapterCount?: number;
  roleNames?: string[];
  extraRequirements?: string;
};

export type TsStoryOneClickOutlineGenerateResult = {
  chapters?: TsStoryOneClickOutlineChapter[];
  promptCode?: string;
  promptVersion?: string;
  renderedPrompt?: string;
  snapshotKey?: string;
};

export const tsStoryApi = {
  async getStoryList(params: TsStoryQuery) {
    return defHttp.get<TsStoryPage>({
      url: '/sys/ts-stories',
      params,
    });
  },

  async getStoryDetail(storyId: number) {
    return defHttp.get<TsStory>({
      url: '/sys/ts-stories/detail',
      params: { id: storyId },
    });
  },

  async createStory(payload: TsStorySavePayload) {
    return defHttp.post<TsStory>({
      url: '/sys/ts-stories',
      data: payload,
    });
  },

  async updateStory(payload: TsStorySavePayload & { id: number }) {
    return defHttp.put<TsStory>({
      url: '/sys/ts-stories',
      data: payload,
    });
  },

  async generateStorySetting(payload: TsStoryOneClickSettingGeneratePayload) {
    return defHttp.post<TsStoryOneClickSettingGenerateResult>({
      url: '/sys/ts-stories/story-setting-generate',
      data: payload,
      timeout: 60_000,
    });
  },

  async generateStoryScene(payload: TsStoryOneClickSceneGeneratePayload) {
    return defHttp.post<TsStoryOneClickSceneGenerateResult>({
      url: '/sys/ts-stories/story--scene-generate',
      data: payload,
      timeout: 60_000,
    });
  },

  async generateStoryOutline(payload: TsStoryOneClickOutlineGeneratePayload) {
    return defHttp.post<TsStoryOneClickOutlineGenerateResult>({
      url: '/sys/ts-stories/story--outline-generate',
      data: payload,
      timeout: 60_000,
    });
  },

  async getPublicStoryList(params: TsStoryPublicQuery) {
    return defHttp.get<TsStoryPublicPage>({
      url: '/sys/ts-stories/public',
      params,
      withToken: false,
    });
  },

  async getStoryChapterList(params: TsStoryChapterQuery) {
    return defHttp.get<TsStoryChapterPage>({
      url: '/sys/ts-story-chapters',
      params,
    });
  },

  async createStoryChapter(payload: TsStoryChapterSavePayload) {
    return defHttp.post<TsStoryChapter>({
      url: '/sys/ts-story-chapters',
      data: payload,
    });
  },

  async updateStoryChapter(payload: TsStoryChapterSavePayload & { id: number }) {
    return defHttp.put<TsStoryChapter>({
      url: '/sys/ts-story-chapters',
      data: payload,
    });
  },
};
