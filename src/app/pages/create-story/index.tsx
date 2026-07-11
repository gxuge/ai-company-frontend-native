import type {
  TsStoryChapter,
  TsStoryFullGenerateResult,
  TsStoryOneClickOutlineChapter,
  TsStorySavePayload,
} from '../../../lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, Modal } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { HelpCircle } from 'lucide-react';
import { AiFormInput } from '../../../components/ai-company/ai-form-input';
import { AiFormTextarea } from '../../../components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '../../../components/ai-company/ai-generate-btn';
import { AiHeader } from '../../../components/ai-company/ai-header';
import { AiLoginBtn } from '../../../components/ai-company/ai-login-btn';
import { AiTopTabs } from '../../../components/ai-company/ai-top-tabs';
import { AiSelectTab } from '../../../components/ai-company/ai-select-tab';
import { AiSwitch } from '../../../components/ai-company/ai-switch';
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
type GenerateConfirmTarget = 'all' | 'setting' | 'scene' | 'outline';

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

function resolveGenerateErrorMessage(error: unknown, fallback: string) {
  const message = extractErrorMessage(error, fallback);
  if (
    message.includes('故事模板配置不完整')
    || message.includes('解析故事模板配置失败')
    || message.includes('未配置 jeecg.airag.prompt-chat.app-id')
    || message.includes('未找到AI应用配置')
    || message.includes('未配置故事模板信息')
  ) {
    return `故事生成配置未完成：${message}`;
  }
  return message;
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

function PublicStatusSection({
  isPublic,
  onPublicChange,
}: {
  isPublic: boolean;
  onPublicChange: (value: boolean) => void;
}) {
  return (
    <section className="flex flex-col gap-[12px] px-[16px] pt-[16px]">
      <h2 className="text-[16px] font-bold tracking-wide text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        公开状态
      </h2>
      <div className="flex items-center justify-between rounded-2xl border border-[#494949] bg-black p-5">
        <div>
          <p className="text-[14px] font-medium text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>是否公开故事</p>
          <p className="mt-1 text-[12px] text-[#6b7280]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>公开后其他用户可以体验该故事</p>
        </div>
        <AiSwitch checked={isPublic} onCheckedChange={onPublicChange} checkedColorClassName="bg-brand-green/90" />
      </div>
    </section>
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
  onHelpClick,
  rightExtra,
}: {
  title: string;
  required?: boolean;
  optional?: boolean;
  showGenerate?: boolean;
  large?: boolean;
  generateLoading?: boolean;
  generateDisabled?: boolean;
  onGenerate?: () => void;
  onHelpClick?: () => void;
  rightExtra?: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between pl-[4px]">
      <div className="flex items-center gap-[2px]">
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
            className="ml-[2px] text-[rgba(var(--color-brand-green-rgb),0.9)]"
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
        {onHelpClick && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onHelpClick();
            }}
            className="flex items-center justify-center p-1 active:opacity-70 ml-1"
          >
            <HelpCircle size={14} color="#9ca3af" />
          </button>
        )}
        {rightExtra && (
          <div className="ml-3">
            {rightExtra}
          </div>
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
  onOptimize,
  generateLoading,
  optimizeLoading,
  onHelpClick,
}: {
  text: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onOptimize: () => void;
  generateLoading: boolean;
  optimizeLoading: boolean;
  onHelpClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader
        title="故事设定"
        required
        onGenerate={onGenerate}
        generateLoading={generateLoading}
        onHelpClick={onHelpClick}
      />
      <AiFormTextarea
        placeholder="例：写下故事背景、世界规则、用户身份和主要目标。比如：午夜后的城市会出现异常街区，用户需要探索规则、收集线索，逐步揭开隐藏真相。"
        isGenerating={generateLoading}
        value={text}
        onChange={e => onChange(e.target.value)}
        showCount={true}
        maxLength={500}
        optimizeLoading={optimizeLoading}
        optimizeDisabled={!text.trim()}
        onOptimize={onOptimize}
      />
    </div>
  );
}

/* —— CharacterList Section —— */
function CharacterListSection({
  roles = [],
  onAddRole,
  onRemoveRole,
  onHelpClick,
  onUserClick,
}: {
  roles?: any[];
  onAddRole: () => void;
  onRemoveRole?: (role: any) => void;
  onHelpClick?: () => void;
  onUserClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title="角色列表" required showGenerate={false} onHelpClick={onHelpClick} />
      <div className="rounded-[16px] border border-[#494949] bg-black px-[21px] py-[20px]">
        <div className="flex flex-wrap items-start gap-[24px]">
          <button onClick={onUserClick} type="button" className="flex shrink-0 flex-col items-center active:opacity-70 transition-opacity">
            <div className="relative">
              <div className="flex size-[61px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[#111] shadow-[0px_10px_15px_-3px_black,0px_4px_6px_-4px_black]">
                <img src={imgUserDefault} alt="" className="h-[34px] w-[27px] object-contain" />
              </div>
              <div className="absolute -right-[2px] -bottom-[2px] flex size-[24px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-black">
                <img src={imgUserEdit} alt="" className="size-[13px] object-contain" />
              </div>
            </div>
            <span className="mt-[12px] text-[#9ca3af] text-[12px] font-medium tracking-[0.3px]">用户</span>
          </button>
          
          {roles.map((role, idx) => (
            <div key={`${role.id}-${idx}`} className="relative flex shrink-0 flex-col items-center">
              <div className="size-[61px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[#111] overflow-hidden">
                <img src={role.avatar || imgUserDefault} alt="" className="w-full h-full object-cover" />
              </div>
              {onRemoveRole && (
                <button
                  onClick={() => onRemoveRole(role)}
                  className="absolute -top-[2px] right-[4px] flex size-[18px] items-center justify-center rounded-full bg-[#333] border border-[#666] text-white active:bg-[#ff4d4f]"
                >
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Line x1="18" y1="6" x2="6" y2="18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    <Line x1="6" y1="6" x2="18" y2="18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </Svg>
                </button>
              )}
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

/* —— Scene Image Section —— */
function SceneImageSection({
  imageUrl,
  onAddImage,
  generating,
  onHelpClick,
}: {
  imageUrl?: string;
  onAddImage: () => void;
  generating?: boolean;
  onHelpClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title="场景图片" showGenerate={false} onHelpClick={onHelpClick} />
      <div className="my-2 flex w-full justify-center">
        <button
          onClick={generating ? undefined : onAddImage}
          className="relative flex h-[184px] w-[135px] flex-col items-center justify-center overflow-hidden rounded-[15px] border-2 border-dashed border-[rgba(var(--color-brand-green-rgb), 0.5)] bg-black active:opacity-80 disabled:opacity-50"
          disabled={generating}
        >
          {generating ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[13.5px] font-medium text-[#a1a1aa]">获取中...</span>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <>
              <div className="mb-[12px] flex size-[34px] items-center justify-center rounded-full border border-[rgba(var(--color-brand-green-rgb), 0.3)]">
                <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                  <Line x1="12" y1="5" x2="12" y2="19" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                  <Line x1="5" y1="12" x2="19" y2="12" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                </Svg>
              </div>
              <span className="text-[13.5px] font-medium text-[#a1a1aa]">点击添加图片</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* —— Location Section —— */
function LocationSection({
  text,
  onChange,
  onGenerate,
  onOptimize,
  generateLoading,
  optimizeLoading,
  onHelpClick,
}: {
  text: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onOptimize: () => void;
  generateLoading: boolean;
  optimizeLoading: boolean;
  onHelpClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader
        title="场景设定"
        required
        showGenerate
        onGenerate={onGenerate}
        generateLoading={generateLoading}
        onHelpClick={onHelpClick}
      />
      <AiFormTextarea
        placeholder="例：写下当前场景的时间、地点、氛围和可互动线索。比如：凌晨的旧车站空无一人，站牌显示不存在的班次，长椅上放着一张旧车票。"
        isGenerating={generateLoading}
        value={text}
        onChange={e => onChange(e.target.value)}
        showCount={true}
        maxLength={500}
        optimizeLoading={optimizeLoading}
        optimizeDisabled={!text.trim()}
        onOptimize={onOptimize}
      />
    </div>
  );
}

/* —— Glow Dot —— */
function GlowDot() {
  return (
    <div className="size-[6px] shrink-0 rounded-full bg-white shadow-[0px_0px_4px_0px_var(--color-brand-green)]" />
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
              textShadow: '0px 0px 8px rgba(var(--color-brand-green-rgb), 0.5)',
            }}
          >
            {chapter.chapterTitle || `第${index + 1}章`}
          </span>
        </div>

        <div className="border-l-2 border-[rgba(var(--color-brand-green-rgb),0.9)] pl-[14px]">
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

        <div className="h-px w-full bg-linear-to-r from-transparent via-[rgba(var(--color-brand-green-rgb), 0.3)] to-transparent" />

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
                className="text-white underline decoration-[rgba(var(--color-brand-green-rgb), 0.3)]"
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
            showCount={true}
            maxLength={200}
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
            showCount={true}
            maxLength={500}
          />
        </div>

        <div className="relative flex items-center justify-between pr-[3px] pl-[12px]">
          <div className="absolute top-1/2 left-0 h-[16px] w-[2px] -translate-y-1/2 rounded-full bg-[rgba(var(--color-brand-green-rgb), 0.3)]" />
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
  onModeChange,
  outlineText,
  onOutlineChange,
  chapters,
  onChapterChange,
  onAddChapter,
  onGenerate,
  onOptimize,
  generateLoading,
  optimizeLoading,
  onHelpClick,
}: {
  activeTab: StoryMode;
  onModeChange: (mode: StoryMode) => void;
  outlineText: string;
  onOutlineChange: (value: string) => void;
  chapters: ChapterForm[];
  onChapterChange: (index: number, chapter: ChapterForm) => void;
  onAddChapter: () => void;
  onGenerate: () => void;
  onOptimize: () => void;
  generateLoading: boolean;
  optimizeLoading: boolean;
  onHelpClick?: () => void;
}) {
  const renderModeSelect = () => (
    <AiSelectTab
      options={[
        { label: '普通剧情', value: 'normal' },
        { label: '章节剧情', value: 'chapter' },
      ]}
      value={activeTab}
      onChange={v => onModeChange(v as StoryMode)}
      containerClassName="bg-black border border-[#494949] rounded-[8px] p-[4px] h-[46px] w-full mb-[4px]"
      activeBgClassName="bg-brand-green/10 border border-[rgba(var(--color-brand-green-rgb),0.9)] rounded-[6px]"
      activeTextClassName="text-[rgba(var(--color-brand-green-rgb),0.9)] font-bold text-[15px]"
      inactiveTextClassName="text-[#9ca3af] font-medium text-[15px]"
      itemClassName="flex-1 items-center justify-center z-10"
    />
  );

  if (activeTab === 'normal') {
    return (
      <div className="flex flex-col gap-[12px]">
        <SectionHeader
          title="剧情大纲"
          large
          onGenerate={onGenerate}
          generateLoading={generateLoading}
          onHelpClick={onHelpClick}
        />
        {renderModeSelect()}
        <AiFormTextarea
          placeholder="输入剧情大纲..."
          isGenerating={generateLoading}
          value={outlineText}
          onChange={e => onOutlineChange(e.target.value)}
          showCount={true}
          maxLength={1000}
          optimizeLoading={optimizeLoading}
          optimizeDisabled={!outlineText.trim()}
          onOptimize={onOptimize}
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
        onHelpClick={onHelpClick}
      />
      {renderModeSelect()}
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
        className="mt-[4px] flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-[16px] border border-dashed border-[rgba(var(--color-brand-green-rgb), 0.5)] bg-transparent py-[18px]"
      >
        <img src={imgAddChapterGreen} alt="" className="size-[20px] shrink-0 object-contain" />
        <span
          className="text-[rgba(var(--color-brand-green-rgb),0.9)]"
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
        <button
          onClick={onNext}
          disabled={loading}
          className={`w-full rounded-full border-2 border-solid border-brand-green bg-transparent py-[15px] text-[18px] text-brand-green font-['Noto_Sans_SC',sans-serif] font-bold tracking-[1.4px] active:bg-brand-green/10 ${loading ? 'opacity-60' : ''}`}
        >
          {loading ? '保存中...' : '下一步'}
        </button>
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
  const [activeTopTab, setActiveTopTab] = useState<'basic' | 'advanced'>('basic');
  const [isPublic, setIsPublic] = useState(true);
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
  const [optimizingSetting, setOptimizingSetting] = useState(false);
  const [optimizingScene, setOptimizingScene] = useState(false);
  const [optimizingOutline, setOptimizingOutline] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const [tooltipType, setTooltipType] = useState<'none' | 'story' | 'role' | 'sceneImage' | 'scene' | 'outline'>('none');
  const [generateModalTarget, setGenerateModalTarget] = useState<'setting' | 'scene' | 'outline' | null>(null);
  const [confirmGenerateTarget, setConfirmGenerateTarget] = useState<GenerateConfirmTarget | null>(null);
  const [userRoleModalVisible, setUserRoleModalVisible] = useState(false);
  const [userRoleName, setUserRoleName] = useState('');
  const [userRoleSetting, setUserRoleSetting] = useState('');
  const [sceneImageUrl, setSceneImageUrl] = useState('');
  const [generatingSceneImage, setGeneratingSceneImage] = useState(false);

  const hasOverwritableContent = useMemo(() => {
    const commonHasValue = [
      storyTitle,
      storyIntro,
      storySettingText,
      storyBackground,
      sceneSettingText,
    ].some(item => item.trim().length > 0);

    if (commonHasValue) {
      return true;
    }

    if (activeTab === 'normal') {
      return outlineText.trim().length > 0;
    }

    return false;
  }, [activeTab, outlineText, sceneSettingText, storyBackground, storyIntro, storySettingText, storyTitle]);

  const hasCurrentOverwritableContent = useMemo(() => ({
    setting: [storyTitle, storyIntro, storySettingText, storyBackground].some(item => item.trim().length > 0),
    scene: sceneSettingText.trim().length > 0,
    outline: activeTab === 'normal'
      ? outlineText.trim().length > 0
      : chapters.some(chapter => chapter.openingContent.trim().length > 0 || chapter.missionTarget.trim().length > 0),
  }), [activeTab, chapters, outlineText, sceneSettingText, storyBackground, storyIntro, storySettingText, storyTitle]);
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
        setStorySettingText(story?.siteSetting || '');
        setStoryBackground(story?.storyBackground || '');
        setSceneSettingText(story?.sceneNameSnapshot || '');
        setActiveTab(normalizeStoryMode(story?.storyMode));
        setOutlineText(story?.plotOutline || '');

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

  const extractStorySettingValue = (result?: TsStoryFullGenerateResult) =>
    (result?.storySetting || '').trim();
  const extractSiteSettingValue = (result?: TsStoryFullGenerateResult) =>
    (result?.siteSetting || '').trim();
  const extractPlotOutlineValue = (result?: TsStoryFullGenerateResult) =>
    (result?.plotOutline || '').trim();
  const extractOutlineChapters = (result?: TsStoryFullGenerateResult) =>
    [];

  const buildOnlyCurrentExtraRequirements = (target: 'setting' | 'scene' | 'outline') => {
    const targetLabelMap = {
      setting: 'story_setting',
      scene: 'site_setting',
      outline: 'plot_outline',
    } as const;
    return [
      `当前为仅当前生成，请重点生成字段：${targetLabelMap[target]}`,
      '请尽量保留我已输入内容的意图与风格。',
      `已输入故事设定：${storySettingText.trim() || 'null'}`,
      `已输入场景设定：${sceneSettingText.trim() || 'null'}`,
      `已输入剧情大纲：${outlineText.trim() || 'null'}`,
      `角色列表：${selectedRoles.map(role => role?.name).filter(Boolean).join(', ') || 'null'}`,
    ].join('\n');
  };

  const buildFullGenerateExtraRequirements = () => [
    '当前为全量生成，请补全并优化故事核心字段。',
    '请尽量保留我已输入内容的意图与风格。',
    `已输入故事设定：${storySettingText.trim() || 'null'}`,
    `已输入场景设定：${sceneSettingText.trim() || 'null'}`,
    `已输入剧情大纲：${outlineText.trim() || 'null'}`,
    `角色列表：${selectedRoles.map(role => role?.name).filter(Boolean).join(', ') || 'null'}`,
  ].join('\n');

  const handleGenerateSetting = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setGeneratingSetting(true);
    try {
      const result = await tsStoryApi.generateStoryFull({
        storyId: storyId || undefined,
        storyMode: activeTab,
        extraRequirements: buildOnlyCurrentExtraRequirements('setting'),
      });
      const nextStorySetting = extractStorySettingValue(result);
      if (!nextStorySetting) {
        throw new Error('未生成有效故事设定，请稍后重试。');
      }
      setStorySettingText(nextStorySetting);
      setIsAiStorySetting(true);
      showMessage('故事设定已生成并回填。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '故事设定生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
    }
  };

  const handleGenerateScene = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setGeneratingScene(true);
    try {
      const result = await tsStoryApi.generateStoryFull({
        storyId: storyId || undefined,
        storyMode: activeTab,
        extraRequirements: buildOnlyCurrentExtraRequirements('scene'),
      });
      const nextSiteSetting = extractSiteSettingValue(result);
      if (!nextSiteSetting) {
        throw new Error('未生成有效场景设定，请稍后重试。');
      }
      setSceneSettingText(nextSiteSetting);
      showMessage('场景设定已生成并回填。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '场景设定生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingScene(false);
    }
  };

  const handleGenerateOutline = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setGeneratingOutline(true);
    try {
      const result = await tsStoryApi.generateStoryFull({
        storyId: storyId || undefined,
        storyMode: activeTab,
        extraRequirements: buildOnlyCurrentExtraRequirements('outline'),
      });
      const outlineChapters = extractOutlineChapters(result);
      const nextPlotOutline = extractPlotOutlineValue(result)
        || (outlineChapters.length ? buildOutlineTextFromChapters(outlineChapters) : '');

      if (activeTab === 'normal') {
        if (!nextPlotOutline) {
          throw new Error('未生成有效剧情大纲，请稍后重试。');
        }
        setOutlineText(nextPlotOutline);
      }
      else {
        if (!outlineChapters.length) {
          throw new Error('章节剧情未生成有效章节大纲，请稍后重试。');
        }
        setChapters(outlineChapters.map(mapChapterFromOutline));
      }
      setIsAiOutline(true);
      showMessage('剧情大纲生成成功。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '剧情大纲生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingOutline(false);
    }
  };

  const handleOptimizeStorySetting = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setOptimizingSetting(true);
    try {
      const result = await tsStoryApi.generateStorySetting({
        siteSetting: storySettingText.trim() || undefined,
        sceneSetting: sceneSettingText.trim() || undefined,
        plotOutline: outlineText.trim() || undefined,
        templateMode: 'setting_optimize',
      });
      const nextStorySetting = (result?.storySetting || '').trim();
      if (!nextStorySetting) {
        throw new Error('未优化出有效故事设定，请稍后重试。');
      }
      setStorySettingText(nextStorySetting);
      setIsAiStorySetting(result?.generated !== false);
      showMessage('故事设定已优化。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '故事设定优化失败，请稍后重试。'));
    }
    finally {
      setOptimizingSetting(false);
    }
  };

  const handleOptimizeSceneSetting = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setOptimizingScene(true);
    try {
      const result = await tsStoryApi.generateStoryScene({
        siteSetting: storySettingText.trim() || undefined,
        sceneSetting: sceneSettingText.trim() || undefined,
        plotOutline: outlineText.trim() || undefined,
        templateMode: 'site_setting_optimize',
      });
      const nextSceneSetting = (result?.sceneSummary || result?.sceneNameSnapshot || '').trim();
      if (!nextSceneSetting) {
        throw new Error('未优化出有效场景设定，请稍后重试。');
      }
      setSceneSettingText(nextSceneSetting);
      showMessage('场景设定已优化。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '场景设定优化失败，请稍后重试。'));
    }
    finally {
      setOptimizingScene(false);
    }
  };

  const handleOptimizePlotOutline = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setOptimizingOutline(true);
    try {
      const result = await tsStoryApi.generateStoryOutline({
        storySetting: storySettingText.trim() || undefined,
        sceneSetting: sceneSettingText.trim() || undefined,
        plotOutline: outlineText.trim() || undefined,
        templateMode: 'plot_outline_optimize',
      });
      const nextPlotOutline = (result?.plotOutline || '').trim();
      if (!nextPlotOutline) {
        throw new Error('未优化出有效剧情大纲，请稍后重试。');
      }
      setOutlineText(nextPlotOutline);
      setIsAiOutline(true);
      showMessage('剧情大纲已优化。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '剧情大纲优化失败，请稍后重试。'));
    }
    finally {
      setOptimizingOutline(false);
    }
  };

  const handleGenerateAll = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
      return;
    }
    setGenerateModalTarget(null);
    setGeneratingSetting(true);
    setGeneratingScene(true);
    setGeneratingOutline(true);
    try {
      const result = await tsStoryApi.generateStoryFullPreset({
        storyId: storyId || undefined,
        storyMode: activeTab,
        extraRequirements: buildFullGenerateExtraRequirements(),
      });

      const nextStorySetting = extractStorySettingValue(result);
      const nextSiteSetting = extractSiteSettingValue(result);
      const outlineChapters = extractOutlineChapters(result);
      const nextPlotOutline = extractPlotOutlineValue(result)
        || (outlineChapters.length ? buildOutlineTextFromChapters(outlineChapters) : '');

      if (nextStorySetting) {
        setStorySettingText(nextStorySetting);
      }
      if (nextSiteSetting) {
        setSceneSettingText(nextSiteSetting);
      }
      if (activeTab === 'normal') {
        if (nextPlotOutline) {
          setOutlineText(nextPlotOutline);
          setIsAiOutline(true);
        }
      }
      else if (outlineChapters.length) {
        setChapters(outlineChapters.map(mapChapterFromOutline));
        setIsAiOutline(true);
      }

      setIsAiStorySetting(!!nextStorySetting);
      showMessage('已为您生成所有可用的设定内容。');
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, '全量生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
      setGeneratingScene(false);
      setGeneratingOutline(false);
    }
  };

  const runGenerateByTarget = (target: GenerateConfirmTarget | 'setting' | 'scene' | 'outline') => {
    if (target === 'all') {
      void handleGenerateAll();
      return;
    }
    if (target === 'setting') {
      void handleGenerateSetting();
      return;
    }
    if (target === 'scene') {
      void handleGenerateScene();
      return;
    }
    void handleGenerateOutline();
  };

  const triggerGenerateForCurrent = (target: 'setting' | 'scene' | 'outline') => {
    if (hasCurrentOverwritableContent[target]) {
      setConfirmGenerateTarget(target);
      return;
    }
    runGenerateByTarget(target);
  };

  const triggerGenerateAll = () => {
    if (hasOverwritableContent) {
      setConfirmGenerateTarget('all');
      return;
    }
    runGenerateByTarget('all');
  };


  const handleSaveAndNext = async () => {
    if (saving || loadingDetail || generatingSetting || generatingScene || generatingOutline || optimizingSetting || optimizingScene || optimizingOutline) {
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
        isPublic: isPublic ? 1 : 0,
        isAiStorySetting: isAiStorySetting ? 1 : 0,
        isAiOutline: isAiOutline ? 1 : 0,
        plotOutline: activeTab === 'normal' ? (outlineText.trim() || undefined) : undefined,
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
        <div className="sticky top-[65px] z-40 bg-black px-[16px] pb-[10px] border-b border-white/10">
          <AiTopTabs
            tabs={[
              { id: 'basic', label: '基础信息' },
              { id: 'advanced', label: '高级设定' },
            ]}
            activeTab={activeTopTab}
            onTabChange={setActiveTopTab}
            containerClassName="bg-black rounded-full border-[1px] border-[#494949] p-[5px] h-[48px]"
            activeBgClassName="bg-brand-green/10 border border-brand-green/90 rounded-full"
            activeTextClassName="text-[rgba(var(--color-brand-green-rgb),0.9)] font-bold"
            inactiveTextClassName="text-[#9ca3af]"
          />
        </div>
        <ScrollView className="flex-1">
          <div className="flex flex-col gap-[32px] px-[16px] pt-[10px] pb-[8px]">
            {activeTopTab === 'basic' ? (
              <>
                <StorySettingsSection
                  text={storySettingText}
                  onChange={setStorySettingText}
                  onGenerate={() => setGenerateModalTarget('setting')}
                  onOptimize={() => void handleOptimizeStorySetting()}
                  generateLoading={generatingSetting}
                  optimizeLoading={optimizingSetting}
                  onHelpClick={() => setTooltipType('story')}
                />
                <CharacterListSection
                  roles={selectedRoles}
                  onAddRole={() => router.push('/pages/select-role?from=create-story')}
                  onRemoveRole={(role) => setSelectedRoles(prev => prev.filter(r => r.id !== role.id))}
                  onHelpClick={() => setTooltipType('role')}
                  onUserClick={() => setUserRoleModalVisible(true)}
                />
                <SceneImageSection
                  imageUrl={sceneImageUrl}
                  generating={generatingSceneImage}
                  onHelpClick={() => setTooltipType('sceneImage')}
                  onAddImage={async () => {
                    setGeneratingSceneImage(true);
                    try {
                      // 待对接接口：调用另外一个接口获取场景图片
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      Alert.alert('提示', '场景图片生成接口待定，当前为模拟成功！');
                      setSceneImageUrl('https://picsum.photos/400/600');
                    } catch (e) {
                      Alert.alert('提示', '生成失败，请重试');
                    } finally {
                      setGeneratingSceneImage(false);
                    }
                  }}
                />
                <LocationSection
                  text={sceneSettingText}
                  onChange={setSceneSettingText}
                  onGenerate={() => setGenerateModalTarget('scene')}
                  onOptimize={() => void handleOptimizeSceneSetting()}
                  generateLoading={generatingScene}
                  optimizeLoading={optimizingScene}
                  onHelpClick={() => setTooltipType('scene')}
                />
                <PlotOutlineSection
                  activeTab={activeTab}
                  onModeChange={setActiveTab}
                  outlineText={outlineText}
                  onOutlineChange={setOutlineText}
                  chapters={chapters}
                  onChapterChange={(index, chapter) => {
                    setChapters(prev => prev.map((item, current) => (current === index ? chapter : item)));
                  }}
                  onAddChapter={() => {
                    setChapters(prev => [...prev, createDefaultChapter(prev.length + 1)]);
                  }}
                  onGenerate={() => setGenerateModalTarget('outline')}
                  onOptimize={() => void handleOptimizePlotOutline()}
                  generateLoading={generatingOutline}
                  optimizeLoading={optimizingOutline}
                  onHelpClick={() => setTooltipType('outline')}
                />
              </>
            ) : (
              <PublicStatusSection isPublic={isPublic} onPublicChange={setIsPublic} />
            )}
            <div className="h-[20px] shrink-0" />
          </div>
        </ScrollView>
        <BottomButton loading={saving || loadingDetail} onNext={handleSaveAndNext} />
      </div>


      <Modal
        visible={generateModalTarget !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGenerateModalTarget(null)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setGenerateModalTarget(null)}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 一键生成</h3>
            <div className="text-[14px] leading-relaxed text-[#a1a1aa] flex flex-col gap-2">
              <p>您希望 AI 如何为您扩写？</p>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(var(--color-brand-green-rgb),0.9)] mt-1">•</span>
                <p><span className="text-white font-medium">仅当前：</span>只针对您刚点击的模块进行扩写。</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(var(--color-brand-green-rgb),0.9)] mt-1">•</span>
                <p><span className="text-white font-medium">全生成：</span>依次为您自动补全故事、场景和大纲。</p>
              </div>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(var(--color-brand-green-rgb),0.9)] bg-transparent py-3 text-center text-base font-bold text-[rgba(var(--color-brand-green-rgb),0.9)] active:bg-white/5"
                onClick={() => {
                  const target = generateModalTarget;
                  setGenerateModalTarget(null);
                  if (target) {
                    triggerGenerateForCurrent(target);
                  }
                }}
              >
                仅当前
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(var(--color-brand-green-rgb),0.9)] bg-brand-green/10 py-3 text-center text-base font-bold text-[rgba(var(--color-brand-green-rgb),0.9)] active:bg-brand-green/20"
                onClick={() => {
                  setGenerateModalTarget(null);
                  triggerGenerateAll();
                }}
              >
                全生成
              </button>
            </div>
            <button
              onClick={() => setGenerateModalTarget(null)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={confirmGenerateTarget !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmGenerateTarget(null)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setConfirmGenerateTarget(null)}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">{confirmGenerateTarget === 'all' ? '⚠️ 覆盖警告' : '⚠️ 覆盖提醒'}</h3>
            <p className="text-[14px] leading-relaxed text-[#a1a1aa]">
              {confirmGenerateTarget === 'all'
                ? (
                    <>
                      选择全生成将由 AI 重新生成并<span className="text-[#ff4d4f] font-medium">覆盖</span>当前除“角色”以外的所有已有内容（包括故事设定、场景设定、剧情大纲）。
                      <br /><br />
                      是否继续？
                    </>
                  )
                : confirmGenerateTarget === 'setting'
                  ? (
                      <>
                        选择仅当前后，AI 将重新生成“故事设定”，并可能<span className="text-[#ff4d4f] font-medium">覆盖</span>你已填写的标题、简介、设定与背景内容。
                        <br /><br />
                        是否继续？
                      </>
                    )
                  : confirmGenerateTarget === 'scene'
                    ? (
                        <>
                          选择仅当前后，AI 将重新生成“场景设定”，并可能<span className="text-[#ff4d4f] font-medium">覆盖</span>你当前已填写的场景内容。
                          <br /><br />
                          是否继续？
                        </>
                      )
                    : (
                        <>
                          选择仅当前后，AI 将重新生成“剧情大纲”，并可能<span className="text-[#ff4d4f] font-medium">覆盖</span>你当前已填写的大纲内容。
                          <br /><br />
                          是否继续？
                        </>
                      )}
            </p>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[#333] bg-transparent py-3 text-center text-base font-bold text-white active:bg-white/5"
                onClick={() => setConfirmGenerateTarget(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-[#ff4d4f] py-3 text-center text-base font-bold text-white active:opacity-80"
                onClick={() => {
                  const target = confirmGenerateTarget;
                  setConfirmGenerateTarget(null);
                  if (target) {
                    runGenerateByTarget(target);
                  }
                }}
              >
                {confirmGenerateTarget === 'all' ? '确认覆盖并生成' : '确认并生成'}
              </button>
            </div>
            <button
              onClick={() => setConfirmGenerateTarget(null)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={userRoleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUserRoleModalVisible(false)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setUserRoleModalVisible(false)}
        >
          <div 
            className="relative w-[90%] max-w-[360px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">用户角色设定</h3>
            
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white">角色名称 <span className="text-xs text-[#a1a1aa]">(选填)</span></span>
              <AiFormInput
                value={userRoleName}
                onChangeText={setUserRoleName}
                placeholder="请输入您的角色名称"
                customContainerClass="bg-black rounded-lg border border-[#494949] h-[44px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-white">角色设定 <span className="text-xs text-[#a1a1aa]">(选填)</span></span>
              <AiFormTextarea
                value={userRoleSetting}
                onChangeText={setUserRoleSetting}
                placeholder="例如性格、外貌特征等"
                minHeight={80}
                customContainerClass="bg-black rounded-lg border border-[#494949]"
              />
            </div>

            <div className="mt-4 flex w-full">
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(var(--color-brand-green-rgb),0.9)] bg-brand-green/10 py-3 text-center text-base font-bold text-[rgba(var(--color-brand-green-rgb),0.9)] active:bg-brand-green/20"
                onClick={() => setUserRoleModalVisible(false)}
              >
                确定
              </button>
            </div>

            <button
              onClick={() => setUserRoleModalVisible(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={tooltipType !== 'none'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTooltipType('none')}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setTooltipType('none')}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTooltipType('none')}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>
            <div className="mb-4 flex justify-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(var(--color-brand-green-rgb), 0.15)]">
                <HelpCircle size={24} color="rgba(var(--color-brand-green-rgb), 0.9)" />
              </div>
            </div>
            {tooltipType === 'story' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">故事设定提示</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  用简短的语言描述您想要创建的故事的主题、世界观或起因。AI 将根据您的设定，为您生成更丰满的<span className="text-[rgba(var(--color-brand-green-rgb),0.9)] font-medium">剧情大纲</span>和<span className="text-[rgba(var(--color-brand-green-rgb),0.9)] font-medium">章节细节</span>。
                </p>
              </>
            )}
            {tooltipType === 'role' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">角色列表提示</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  选择或创建将要参与到故事中的角色。您（用户）将默认作为主角参与互动，添加的其他角色将作为 NPC 与您发生<span className="text-[rgba(var(--color-brand-green-rgb),0.9)] font-medium">剧情纠葛</span>。
                </p>
              </>
            )}
            {tooltipType === 'sceneImage' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">场景图片提示</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  图片生成会依赖下方的<span className="text-[rgba(var(--color-brand-green-rgb),0.9)] font-medium">场景设定</span>字段，点击添加图片将调用独立接口获取场景图片。
                </p>
              </>
            )}
            {tooltipType === 'scene' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">场景设定提示</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  设定故事发生的具体地点或环境氛围（例如：<span className="text-white font-medium">赛博朋克都市、古典仙侠客栈</span>）。明确的场景有助于 AI 描绘更生动的画面和氛围。
                </p>
              </>
            )}
            {tooltipType === 'outline' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">剧情大纲提示</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  剧情大纲规划了故事的整体发展脉络。您可以手动编写，也可以点击<span className="text-[rgba(var(--color-brand-green-rgb),0.9)] font-medium">一键生成</span>让 AI 根据已有设定为您自动扩写精彩的故事剧情。
                </p>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
