import type { TsStoryChapter, TsStoryOneClickOutlineChapter, TsStorySavePayload } from '../../../lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import { AiFormTextarea } from '../../../components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '../../../components/ai-company/ai-generate-btn';
import { AiHeader } from '../../../components/ai-company/ai-header';
import { AiLoginBtn } from '../../../components/ai-company/ai-login-btn';
import { AiTopTabs } from '../../../components/ai-company/ai-top-tabs';
import {
  tsStoryApi,

} from '../../../lib/api';

const imgChevronRightGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/chevron_right_gray.svg'));
const imgChevronRightWhite = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/chevron_right_white.svg'));
const imgChevronRightDarkGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/chevron_right_darkgray.svg'));
const imgUserDefault = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/user_default.svg'));
const imgUserEdit = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/user_edit.svg'));
const imgAddRoleGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/add_role_gray.svg'));
const imgAddChapterGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/add_chapter_green.svg'));

type StoryMode = 'normal' | 'chapter';

type ChapterForm = {
  id?: number;
  chapterNo: number;
  chapterTitle: string;
  chapterDesc: string;
  openingContent: string;
  openingRoleId?: number;
  missionTarget: string;
  forbiddenRoleIds: number[];
};

function showMessage(message: string) {
  if (Platform.OS === 'web') {
    Alert.alert('提示', message);
    return;
  }
  Alert.alert('提示', message);
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function parsePositiveInt(value?: string | string[]): number | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const parsed = parsePositiveInt(item);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  }
  if (!value) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function normalizeStoryMode(mode?: string | null): StoryMode {
  return mode === 'normal' ? 'normal' : 'chapter';
}

function buildFallbackTitle(storySetting: string, outlineText: string) {
  const source = (storySetting || outlineText || '').trim();
  if (source) {
    return source.slice(0, 20);
  }
  return `未命名故事-${Date.now()}`;
}

function createDefaultChapter(chapterNo: number): ChapterForm {
  return {
    chapterNo,
    chapterTitle: `第${chapterNo}章`,
    chapterDesc: '描述主要情节，包括用户在故事中和其他角色的互动',
    openingContent: '',
    missionTarget: '',
    forbiddenRoleIds: [],
  };
}

function mapChapterFromApi(chapter: TsStoryChapter, index: number): ChapterForm {
  return {
    id: chapter.id,
    chapterNo: chapter.chapterNo || index + 1,
    chapterTitle: chapter.chapterTitle || `第${chapter.chapterNo || index + 1}章`,
    chapterDesc: chapter.chapterDesc || '描述主要情节，包括用户在故事中和其他角色的互动',
    openingContent: chapter.openingContent || '',
    openingRoleId: chapter.openingRoleId || undefined,
    missionTarget: chapter.missionTarget || '',
    forbiddenRoleIds: chapter.forbiddenRoleIds || [],
  };
}

function mapChapterFromOutline(chapter: TsStoryOneClickOutlineChapter, index: number): ChapterForm {
  const chapterNo = chapter.chapterNo || index + 1;
  return {
    chapterNo,
    chapterTitle: chapter.chapterTitle || `第${chapterNo}章`,
    chapterDesc: chapter.chapterDesc || '描述主要情节，包括用户在故事中和其他角色的互动',
    openingContent: chapter.openingContent || '',
    missionTarget: chapter.missionTarget || '',
    forbiddenRoleIds: [],
  };
}

function buildOutlineTextFromChapters(chapters: TsStoryOneClickOutlineChapter[]) {
  return chapters.map((chapter, index) => {
    const no = chapter.chapterNo || index + 1;
    const title = chapter.chapterTitle || `第${no}章`;
    const desc = chapter.chapterDesc || '';
    const mission = chapter.missionTarget || '';
    return `${title}\n${desc}${mission ? `\n任务目标：${mission}` : ''}`;
  }).join('\n\n');
}

/* —— Reusable: Chevron Right Icon —— */
function ChevronRight({ color = '#9CA3AF' }: { color?: string }) {
  const src
    = color === 'white'
      ? imgChevronRightWhite
      : color === '#6B7280'
        ? imgChevronRightDarkGray
        : imgChevronRightGray;
  return (
    <img src={src} alt="" className="h-[10px] w-[6px] shrink-0 object-contain" />
  );
}

/* —— Header —— */
function Header() {
  return (
    <AiHeader
      title="创建原创故事"
      className="sticky top-0 z-50 h-[65px] shrink-0 bg-background px-[20px]"
    />
  );
}

/* —— Tab Toggle —— */
function TabToggle({
  activeTab,
  onChange,
}: {
  activeTab: StoryMode;
  onChange: (tab: StoryMode) => void;
}) {
  const tabs = [
    { id: 'normal', label: '普通剧情' },
    { id: 'chapter', label: '章节剧情' },
  ];

  return (
    <AiTopTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={tab => onChange(normalizeStoryMode(tab))}
      containerClassName="bg-black rounded-full border-[1px] border-[#494949] p-[5px] h-[48px]"
      activeBgClassName="bg-[rgba(155,254,3,0.9)] shadow-[0px_0px_15px_0px_rgba(155,254,3,0.5)] rounded-full"
      activeTextClassName="text-[#3b3f34] font-bold"
      inactiveTextClassName="text-[#9ca3af]"
    />
  );
}

function SectionHeader({
  title,
  required,
  optional,
  showGenerate = true,
  large = false,
  generateLoading = false,
  generateDisabled = false,
  onGenerate,
}: {
  title: string;
  required?: boolean;
  optional?: boolean;
  showGenerate?: boolean;
  large?: boolean;
  generateLoading?: boolean;
  generateDisabled?: boolean;
  onGenerate?: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between pl-[4px]">
      <div className="flex items-baseline gap-[2px]">
        <span
          className="text-white"
          style={{
            fontFamily: '\'Noto Sans SC\', sans-serif',
            fontSize: large ? '20px' : '16px',
            fontWeight: 700,
            letterSpacing: '0.4px',
          }}
        >
          {title}
        </span>
        {required && (
          <span
            className="ml-[2px] text-[rgba(155,254,3,0.9)]"
            style={{
              fontFamily: '\'Noto Sans SC\', sans-serif',
              fontSize: large ? '20px' : '16px',
              fontWeight: 700,
            }}
          >
            *
          </span>
        )}
        {optional && (
          <span
            className="ml-[2px] text-[#4b5563]"
            style={{
              fontFamily: '\'Noto Sans SC\', sans-serif',
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            (选填)
          </span>
        )}
      </div>
      {showGenerate && (
        <AiGenerateBtn 
          onClick={onGenerate} 
          loading={generateLoading} 
          disabled={generateDisabled}
        />
      )}
    </div>
  );
}

/* —— Story Settings Section —— */
function StorySettingsSection({
  text,
  onChange,
  onGenerate,
  generateLoading,
}: {
  text: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  generateLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader
        title="故事设定"
        required
        onGenerate={onGenerate}
        generateLoading={generateLoading}
      />
      <AiFormTextarea
        placeholder="输入故事整体想法和背景设定，可辅助生成剧情。"
        isGenerating={generateLoading}
        value={text}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/* —— CharacterList Section —— */
function CharacterListSection({
  roles = [],
  onAddRole,
}: {
  roles?: any[];
  onAddRole: () => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title="角色列表" required showGenerate={false} />
      <div className="rounded-[16px] border border-[#494949] bg-black px-[21px] py-[20px]">
        <div className="flex flex-wrap items-start gap-[24px]">
          <div className="flex shrink-0 flex-col items-center">
            <div className="relative">
              <div className="flex size-[61px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[#111] shadow-[0px_10px_15px_-3px_black,0px_4px_6px_-4px_black]">
                <img src={imgUserDefault} alt="" className="h-[34px] w-[27px] object-contain" />
              </div>
              <div className="absolute -right-[2px] -bottom-[2px] flex size-[24px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-black">
                <img src={imgUserEdit} alt="" className="size-[13px] object-contain" />
              </div>
            </div>
            <span className="mt-[12px] text-[#9ca3af] text-[12px] font-medium tracking-[0.3px]">用户</span>
          </div>
          
          {roles.map((role, idx) => (
            <div key={`${role.id}-${idx}`} className="flex shrink-0 flex-col items-center">
              <div className="size-[61px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[#111] overflow-hidden">
                <img src={role.avatar || imgUserDefault} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="mt-[12px] text-white text-[12px] font-medium truncate w-[60px] text-center">{role.name}</span>
            </div>
          ))}

          <div className="flex shrink-0 flex-col items-center">
            <button
              onClick={onAddRole}
              className="flex size-[61px] cursor-pointer items-center justify-center rounded-full border border-dashed border-neutral-500 bg-transparent p-0"
            >
              <img src={imgAddRoleGray} alt="" className="h-[23px] w-[22px] object-contain" />
            </button>
            <span className="mt-[12px] text-[#4b5563] text-[12px]">添加</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* —— Location Section —— */
function LocationSection({
  text,
  onChange,
  onGenerate,
  generateLoading,
}: {
  text: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  generateLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader
        title="场所设定"
        required
        showGenerate
        onGenerate={onGenerate}
        generateLoading={generateLoading}
      />
      <AiFormTextarea
        placeholder="输入场所设定，生成人物所在场所"
        isGenerating={generateLoading}
        value={text}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/* —— Glow Dot —— */
function GlowDot() {
  return (
    <div className="size-[6px] shrink-0 rounded-full bg-white shadow-[0px_0px_4px_0px_#9bfe03]" />
  );
}

/* —— Chapter Card —— */
// eslint-disable-next-line max-lines-per-function
function ChapterCard({
  chapter,
  index,
  isGenerating,
  onChange,
}: {
  chapter: ChapterForm;
  index: number;
  isGenerating?: boolean;
  onChange: (next: ChapterForm) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#494949] bg-black">
      <div className="flex flex-col gap-[15px] p-[20px]">
        <div className="flex flex-col gap-[8px]">
          <span
            className="text-[#fffdfd]"
            style={{
              fontFamily: '\'Noto Sans SC\', sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.9px',
              textShadow: '0px 0px 8px rgba(155,254,3,0.5)',
            }}
          >
            {chapter.chapterTitle || `第${index + 1}章`}
          </span>
        </div>

        <div className="border-l-2 border-[rgba(155,254,3,0.9)] pl-[14px]">
          <p
            className="m-0 text-[#9ca3af]"
            style={{
              fontFamily: '\'Noto Sans SC\', sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '20px',
            }}
          >
            {chapter.chapterDesc || '描述主要情节，包括用户在故事中和其他角色的互动'}
          </p>
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-[rgba(155,254,3,0.3)] to-transparent" />

        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between px-[4px]">
            <div className="flex items-center gap-[8px]">
              <GlowDot />
              <span
                className="text-white"
                style={{
                  fontFamily: '\'Noto Sans SC\', sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase' as const,
                }}
              >
                开场白
              </span>
            </div>
            <button className="flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0">
              <span
                className="text-white underline decoration-[rgba(155,254,3,0.3)]"
                style={{
                  fontFamily: '\'Noto Sans SC\', sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  textDecorationSkipInk: 'none',
                }}
              >
                选择角色
              </span>
              <ChevronRight color="white" />
            </button>
          </div>
          <AiFormTextarea
            skeletonLines={3}
            isGenerating={isGenerating}
            skeletonPaddingClassName="p-[13px]"
            containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            className="min-h-[96px] w-full resize-none border-0 bg-transparent p-[13px] text-white placeholder-[#4b5563] outline-none"
            placeholder=">> 输入开场白内容，开启本故事..."
            value={chapter.openingContent}
            onChange={e => onChange({ ...chapter, openingContent: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-[8px] pt-[8px]">
          <div className="flex items-center gap-[8px] px-[4px]">
            <GlowDot />
            <span
              className="text-white"
              style={{
                fontFamily: '\'Noto Sans SC\', sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.6px',
                textTransform: 'uppercase' as const,
              }}
            >
              任务目标
            </span>
          </div>
          <AiFormTextarea
            skeletonLines={3}
            isGenerating={isGenerating}
            skeletonPaddingClassName="p-[13px]"
            containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            className="min-h-[96px] w-full resize-none border-0 bg-transparent p-[13px] text-white placeholder-[#4b5563] outline-none"
            placeholder=">> 请输入任务目标..."
            value={chapter.missionTarget}
            onChange={e => onChange({ ...chapter, missionTarget: e.target.value })}
          />
        </div>

        <div className="relative flex items-center justify-between pr-[3px] pl-[12px]">
          <div className="absolute top-1/2 left-0 h-[16px] w-[2px] -translate-y-1/2 rounded-full bg-[rgba(155,254,3,0.3)]" />
          <span
            className="text-[#6b7280]"
            style={{
              fontFamily: '\'Noto Sans SC\', sans-serif',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            禁止出场角色
          </span>
          <button className="flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0">
            <span
              className="text-[#6b7280]"
              style={{
                fontFamily: '\'Noto Sans SC\', sans-serif',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              选择角色
            </span>
            <ChevronRight color="#6B7280" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* —— Plot Outline Section —— */
function PlotOutlineSection({
  activeTab,
  outlineText,
  onOutlineChange,
  chapters,
  onChapterChange,
  onAddChapter,
  onGenerate,
  generateLoading,
}: {
  activeTab: StoryMode;
  outlineText: string;
  onOutlineChange: (value: string) => void;
  chapters: ChapterForm[];
  onChapterChange: (index: number, chapter: ChapterForm) => void;
  onAddChapter: () => void;
  onGenerate: () => void;
  generateLoading: boolean;
}) {
  if (activeTab === 'normal') {
    return (
      <div className="flex flex-col gap-[12px]">
        <SectionHeader
          title="剧情大纲"
          large
          onGenerate={onGenerate}
          generateLoading={generateLoading}
        />
        <AiFormTextarea
          placeholder="输入剧情大纲..."
          isGenerating={generateLoading}
          value={outlineText}
          onChange={e => onOutlineChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <SectionHeader
        title="剧情大纲"
        large
        onGenerate={onGenerate}
        generateLoading={generateLoading}
      />
      {chapters.map((chapter, index) => (
        <ChapterCard
          key={`${chapter.id || 'new'}-${index}`}
          chapter={chapter}
          index={index}
          isGenerating={generateLoading}
          onChange={next => onChapterChange(index, next)}
        />
      ))}
      <button
        onClick={onAddChapter}
        className="mt-[4px] flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-[16px] border border-dashed border-[rgba(155,254,3,0.5)] bg-transparent py-[18px]"
      >
        <img src={imgAddChapterGreen} alt="" className="size-[20px] shrink-0 object-contain" />
        <span
          className="text-[rgba(155,254,3,0.9)]"
          style={{
            fontFamily: '\'Noto Sans SC\', sans-serif',
            fontSize: '14px',
            fontWeight: 400,
          }}
        >
          添加下一章
        </span>
      </button>
    </div>
  );
}

/* —— Bottom Button —— */
function BottomButton({
  loading,
  onNext,
}: {
  loading: boolean;
  onNext: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-50 shrink-0">
      <div className="bg-linear-to-t from-black via-[rgba(0,0,0,0.95)] to-transparent px-[16px] pt-[36px] pb-[20px]">
        <AiLoginBtn
          label={loading ? '保存中...' : '下一步'}
          customWidth="w-full"
          customHeight="h-[56px]"
          radius="rounded-full"
          textClassName="text-[18px] font-bold tracking-[1.4px] text-[#3b3f34]"
          onPress={onNext}
          disabled={loading}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function App() {
  const params = useLocalSearchParams<{ 
    storyId?: string | string[]; 
    id?: string | string[];
    selectedRoleId?: string;
    selectedRoleName?: string;
    selectedRoleAvatar?: any;
  }>();
  const routeStoryId = useMemo(
    () => parsePositiveInt(params.storyId) ?? parsePositiveInt(params.id),
    [params.id, params.storyId],
  );

  const [activeTab, setActiveTab] = useState<StoryMode>('normal');
  const [storyId, setStoryId] = useState<number | null>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyIntro, setStoryIntro] = useState('');
  const [storySettingText, setStorySettingText] = useState('');
  const [storyBackground, setStoryBackground] = useState('');
  const [sceneSettingText, setSceneSettingText] = useState('');
  const [outlineText, setOutlineText] = useState('');
  const [chapters, setChapters] = useState<ChapterForm[]>([createDefaultChapter(1)]);

  const [isAiStorySetting, setIsAiStorySetting] = useState(false);
  const [isAiOutline, setIsAiOutline] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingSetting, setGeneratingSetting] = useState(false);
  const [generatingScene, setGeneratingScene] = useState(false);
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);

  const isOutlineEnabled = useMemo(() => {
    return (
      storySettingText.trim().length > 0 &&
      selectedRoles.length > 0 &&
      sceneSettingText.trim().length > 0
    );
  }, [storySettingText, selectedRoles, sceneSettingText]);

  useEffect(() => {
    if (params.selectedRoleId) {
      const roleId = Number(params.selectedRoleId);
      setSelectedRoles(prev => {
        if (prev.find(r => r.id === roleId)) return prev;
        return [...prev, { 
          id: roleId, 
          name: params.selectedRoleName || '未知角色', 
          avatar: params.selectedRoleAvatar 
        }];
      });
    }
  }, [params.selectedRoleId, params.selectedRoleName, params.selectedRoleAvatar]);

  useEffect(() => {
    if (!routeStoryId) {
      return;
    }
    let cancelled = false;
    const loadStory = async () => {
      setLoadingDetail(true);
      try {
        const [story, chapterPage] = await Promise.all([
          tsStoryApi.getStoryDetail(routeStoryId),
          tsStoryApi.getStoryChapterList({ pageNo: 1, pageSize: 100, storyId: routeStoryId }),
        ]);
        if (cancelled) {
          return;
        }
        setStoryId(story?.id || routeStoryId);
        setStoryTitle(story?.title || '');
        setStoryIntro(story?.storyIntro || '');
        setStorySettingText(story?.storySetting || '');
        setStoryBackground(story?.storyBackground || '');
        setSceneSettingText(story?.sceneNameSnapshot || '');
        setActiveTab(normalizeStoryMode(story?.storyMode));
        setOutlineText(story?.remark || '');

        const chapterRecords = [...(chapterPage?.records || [])].sort((a, b) => {
          const aNo = a.chapterNo || 0;
          const bNo = b.chapterNo || 0;
          return aNo - bNo;
        });
        if (chapterRecords.length) {
          setChapters(chapterRecords.map(mapChapterFromApi));
        }
        else {
          setChapters([createDefaultChapter(1)]);
        }
      }
      catch (error) {
        if (!cancelled) {
          showMessage(extractErrorMessage(error, '加载故事详情失败，请稍后重试。'));
        }
      }
      finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    };
    void loadStory();
    return () => {
      cancelled = true;
    };
  }, [routeStoryId]);

  const handleGenerateSetting = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline) {
      return;
    }
    setGeneratingSetting(true);
    try {
      const result = await tsStoryApi.generateStorySetting({
        storyId: storyId || undefined,
        title: storyTitle || undefined,
        storyMode: activeTab,
        storyIntro: storyIntro || undefined,
        storySetting: storySettingText || undefined,
        storyBackground: storyBackground || undefined,
        ideaInput: storySettingText || undefined,
      });
      if (result?.title) {
        setStoryTitle(result.title);
      }
      if (result?.storyIntro) {
        setStoryIntro(result.storyIntro);
      }
      if (result?.storySetting) {
        setStorySettingText(result.storySetting);
      }
      if (result?.storyBackground) {
        setStoryBackground(result.storyBackground);
      }
      if (result?.storyMode) {
        setActiveTab(normalizeStoryMode(result.storyMode));
      }
      setIsAiStorySetting(result?.generated !== false);
      if (result?.generated === false) {
        showMessage(result?.fallbackReason || '故事设定生成失败，当前为兜底内容，请重试。');
      }
      else {
        showMessage('故事设定已生成并回填。');
      }
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '故事设定生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
    }
  };

  const handleGenerateScene = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline) {
      return;
    }
    setGeneratingScene(true);
    try {
      const result = await tsStoryApi.generateStoryScene({
        title: storyTitle || undefined,
        storyMode: activeTab,
        storySetting: storySettingText || undefined,
        storyBackground: storyBackground || undefined,
        sceneSetting: sceneSettingText || undefined,
      });
      const sceneText = (result?.sceneSummary || result?.sceneNameSnapshot || '').trim();
      if (sceneText) {
        setSceneSettingText(sceneText);
      }
      if (result?.generated === false) {
        showMessage(result?.fallbackReason || '场景设定生成失败，当前为兜底内容，请重试。');
      }
      else {
        showMessage('场景设定已生成并回填。');
      }
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '场景设定生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingScene(false);
    }
  };

  const handleGenerateOutline = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline) {
      return;
    }
    setGeneratingOutline(true);
    try {
      const result = await tsStoryApi.generateStoryOutline({
        storyId: storyId || undefined,
        title: storyTitle || undefined,
        storyMode: activeTab,
        storySetting: storySettingText || undefined,
        sceneSetting: sceneSettingText || undefined,
        storyBackground: storyBackground || undefined,
        chapterCount: activeTab === 'chapter' ? Math.max(chapters.length, 1) : 3,
        roleNames: [],
        extraRequirements: activeTab === 'normal' ? (outlineText.trim() || undefined) : undefined,
      });

      const generatedChapters = result?.chapters || [];
      if (!generatedChapters.length) {
        throw new Error('未生成有效剧情大纲，请稍后重试。');
      }
      if (activeTab === 'normal') {
        setOutlineText(buildOutlineTextFromChapters(generatedChapters));
      }
      else {
        setChapters(generatedChapters.map(mapChapterFromOutline));
      }
      setIsAiOutline(true);
      showMessage('剧情大纲生成成功。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '剧情大纲生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingOutline(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (saving || loadingDetail || generatingSetting || generatingScene || generatingOutline) {
      return;
    }
    setSaving(true);
    try {
      const finalTitle = storyTitle.trim() || buildFallbackTitle(storySettingText, outlineText);
      const payload: TsStorySavePayload = {
        title: finalTitle,
        storyIntro: storyIntro.trim() || undefined,
        storyMode: activeTab,
        storySetting: storySettingText.trim() || undefined,
        storyBackground: storyBackground.trim() || undefined,
        sceneNameSnapshot: sceneSettingText.trim() || undefined,
        status: 1,
        isPublic: 1,
        isAiStorySetting: isAiStorySetting ? 1 : 0,
        isAiOutline: isAiOutline ? 1 : 0,
        remark: activeTab === 'normal' ? (outlineText.trim() || undefined) : undefined,
      };

      const saved = storyId
        ? await tsStoryApi.updateStory({ ...payload, id: storyId })
        : await tsStoryApi.createStory(payload);
      const currentStoryId = saved?.id;
      if (!currentStoryId) {
        throw new Error('故事保存失败，请稍后重试。');
      }

      setStoryId(currentStoryId);
      setStoryTitle(saved?.title || finalTitle);

      if (activeTab === 'chapter') {
        const nextChapters = [...chapters];
        for (let index = 0; index < nextChapters.length; index += 1) {
          const chapter = nextChapters[index];
          const chapterNo = index + 1;
          const chapterPayload = {
            storyId: currentStoryId,
            chapterNo,
            chapterTitle: (chapter.chapterTitle || `第${chapterNo}章`).trim(),
            chapterDesc: chapter.chapterDesc.trim() || undefined,
            openingContent: chapter.openingContent.trim() || undefined,
            openingRoleId: chapter.openingRoleId,
            missionTarget: chapter.missionTarget.trim() || undefined,
            status: 1,
            isAiGenerated: isAiOutline ? 1 : 0,
            sortNo: chapterNo,
            forbiddenRoleIds: chapter.forbiddenRoleIds,
          };
          const savedChapter = chapter.id
            ? await tsStoryApi.updateStoryChapter({ ...chapterPayload, id: chapter.id })
            : await tsStoryApi.createStoryChapter(chapterPayload);
          if (savedChapter?.id) {
            nextChapters[index] = {
              ...chapter,
              id: savedChapter.id,
              chapterNo: savedChapter.chapterNo || chapterNo,
              chapterTitle: savedChapter.chapterTitle || chapterPayload.chapterTitle,
            };
          }
        }
        setChapters(nextChapters);
      }

      showMessage('故事保存成功。');
      router.push({
        pathname: '/pages/conversation-detail',
        params: { storyId: String(currentStoryId) },
      });
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '故事保存失败，请稍后重试。'));
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-full justify-center bg-background">
      <div className="flex min-h-full w-full max-w-[420px] flex-col bg-black">
        <Header />
        <ScrollView className="flex-1">
          <div className="flex flex-col gap-[32px] px-[16px] pt-[10px] pb-[8px]">
            <TabToggle activeTab={activeTab} onChange={setActiveTab} />
            <StorySettingsSection
              text={storySettingText}
              onChange={setStorySettingText}
              onGenerate={handleGenerateSetting}
              generateLoading={generatingSetting}
            />
            <CharacterListSection
              roles={selectedRoles}
              onAddRole={() => router.push('/pages/select-role?from=create-story')}
            />
            <LocationSection
              text={sceneSettingText}
              onChange={setSceneSettingText}
              onGenerate={handleGenerateScene}
              generateLoading={generatingScene}
            />
            <PlotOutlineSection
              activeTab={activeTab}
              outlineText={outlineText}
              onOutlineChange={setOutlineText}
              chapters={chapters}
              onChapterChange={(index, chapter) => {
                setChapters(prev => prev.map((item, current) => (current === index ? chapter : item)));
              }}
              onAddChapter={() => {
                setChapters(prev => [...prev, createDefaultChapter(prev.length + 1)]);
              }}
              onGenerate={handleGenerateOutline}
              generateLoading={generatingOutline}
              generateDisabled={!isOutlineEnabled}
            />
            <div className="h-[20px] shrink-0" />
          </div>
        </ScrollView>
        <BottomButton loading={saving || loadingDetail} onNext={handleSaveAndNext} />
      </div>
    </div>
  );
}
