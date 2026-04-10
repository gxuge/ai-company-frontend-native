import { defHttp } from './def-http';

export type TsStoryRoleBinding = {
  roleId?: number;
  roleType?: string;
  sortNo?: number;
  isRequired?: number;
  joinSource?: string;
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

export type TsStoryQuery = {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
  isPublic?: number;
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

  async getStoryChapterList(params: TsStoryChapterQuery) {
    return defHttp.get<TsStoryChapterPage>({
      url: '/sys/ts-story-chapters',
      params,
    });
  },
};
