import type {
  TsDraftContent,
  TsStoryChapter,
  TsStoryFullGenerateResult,
  TsStoryOneClickOutlineChapter,
  TsStorySavePayload,
} from '../../../lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, DeviceEventEmitter, Modal, Platform, ScrollView } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { HelpCircle } from 'lucide-react';
import { AiDraftExitDialog } from '../../../components/ai-company/ai-draft-exit-dialog';
import { AiFormInput } from '../../../components/ai-company/ai-form-input';
import { AiFormTextarea } from '../../../components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '../../../components/ai-company/ai-generate-btn';
import { AiHeader } from '../../../components/ai-company/ai-header';
import { AiLoginBtn } from '../../../components/ai-company/ai-login-btn';
import { AiTopTabs } from '../../../components/ai-company/ai-top-tabs';
import { AiSelectTab } from '../../../components/ai-company/ai-select-tab';
import { AiSwitch } from '../../../components/ai-company/ai-switch';
import {
  pickTsImageUrl,
  tsDraftApi,
  tsStoryApi,
} from '../../../lib/api';
import { translate } from '../../../lib/i18n/utils';

const imgChevronRightGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/chevron_right_gray.svg'));
const imgChevronRightWhite = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/chevron_right_white.svg'));
const imgChevronRightDarkGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/chevron_right_darkgray.svg'));
const imgUserDefault = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/user_default.svg'));
const imgUserEdit = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/user_edit.svg'));
const imgAddRoleGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/add_role_gray.svg'));
const imgAddChapterGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-story/add_chapter_green.svg'));

type StoryMode = 'normal' | 'chapter';
type GenerateConfirmTarget = 'all' | 'setting' | 'scene' | 'outline';

type StoryRoleItem = {
  id: number;
  name: string;
  avatar?: any;
};

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
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(message);
    return;
  }
  Alert.alert(translate('createStory.messages.alertTitle'), message);
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
    return translate('createStory.messages.configIncomplete', { message });
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

function readDraftString(content: TsDraftContent, keys: string[]) {
  for (const key of keys) {
    const value = content[key];
    if (typeof value === 'string') {
      return value;
    }
  }
  return '';
}

function readDraftStoryRoles(content: TsDraftContent): StoryRoleItem[] {
  if (!Array.isArray(content.selectedRoles)) {
    return [];
  }
  return content.selectedRoles.flatMap((value) => {
    if (!value || typeof value !== 'object') {
      return [];
    }
    const role = value as Record<string, unknown>;
    const id = Number(role.id);
    if (!Number.isInteger(id) || id <= 0) {
      return [];
    }
    return [{
      id,
      name: typeof role.name === 'string' && role.name.trim()
        ? role.name
        : translate('createStory.roles.fallback', { id }),
      avatar: typeof role.avatar === 'string' ? role.avatar : role.avatarUrl,
    }];
  });
}

function readDraftChapters(content: TsDraftContent): ChapterForm[] {
  if (!Array.isArray(content.chapters)) {
    return [];
  }
  return content.chapters.flatMap((value, index) => {
    if (!value || typeof value !== 'object') {
      return [];
    }
    const chapter = value as Record<string, unknown>;
    const chapterNo = Number(chapter.chapterNo);
    return [{
      id: parsePositiveInt(String(chapter.id ?? '')) || undefined,
      chapterNo: Number.isInteger(chapterNo) && chapterNo > 0 ? chapterNo : index + 1,
      chapterTitle: typeof chapter.chapterTitle === 'string' ? chapter.chapterTitle : '',
      chapterDesc: typeof chapter.chapterDesc === 'string' ? chapter.chapterDesc : '',
      openingContent: typeof chapter.openingContent === 'string' ? chapter.openingContent : '',
      openingRoleId: parsePositiveInt(String(chapter.openingRoleId ?? '')) || undefined,
      missionTarget: typeof chapter.missionTarget === 'string' ? chapter.missionTarget : '',
      forbiddenRoleIds: Array.isArray(chapter.forbiddenRoleIds)
        ? chapter.forbiddenRoleIds.filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0)
        : [],
    }];
  });
}

function buildFallbackTitle(storySetting: string, outlineText: string) {
  const source = (storySetting || outlineText || '').trim();
  if (source) {
    return source.slice(0, 20);
  }
  return translate('createStory.untitledStory', { timestamp: Date.now() });
}

function createDefaultChapter(chapterNo: number): ChapterForm {
  return {
    chapterNo,
    chapterTitle: translate('createStory.outline.chapterTitle', { number: chapterNo }),
    chapterDesc: '',
    openingContent: '',
    missionTarget: '',
    forbiddenRoleIds: [],
  };
}

function mapChapterFromApi(chapter: TsStoryChapter, index: number): ChapterForm {
  return {
    id: chapter.id,
    chapterNo: chapter.chapterNo || index + 1,
    chapterTitle: chapter.chapterTitle || translate('createStory.outline.chapterTitle', { number: chapter.chapterNo || index + 1 }),
    chapterDesc: chapter.chapterDesc || translate('createStory.outline.chapterDescription'),
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
    chapterTitle: chapter.chapterTitle || translate('createStory.outline.chapterTitle', { number: chapterNo }),
    chapterDesc: chapter.chapterDesc || translate('createStory.outline.chapterDescription'),
    openingContent: chapter.openingContent || '',
    missionTarget: chapter.missionTarget || '',
    forbiddenRoleIds: [],
  };
}

function buildOutlineTextFromChapters(chapters: TsStoryOneClickOutlineChapter[]) {
  return chapters.map((chapter, index) => {
    const no = chapter.chapterNo || index + 1;
    const title = chapter.chapterTitle || translate('createStory.outline.chapterTitle', { number: no });
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
function Header({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();

  return (
    <AiHeader
      title={t('createStory.title')}
      className="sticky top-0 z-50 h-[65px] shrink-0 bg-background px-[20px]"
      onBack={onBack}
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
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-[12px] px-[16px] pt-[16px]">
      <h2 className="text-[16px] font-bold tracking-wide text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {t('createStory.publicStatus.title')}
      </h2>
      <div className="flex items-center justify-between rounded-2xl border border-[#494949] bg-black p-5">
        <div>
          <p className="text-[14px] font-medium text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>{t('createStory.publicStatus.label')}</p>
          <p className="mt-1 text-[12px] text-[#6b7280]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>{t('createStory.publicStatus.description')}</p>
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
  const { t } = useTranslation();

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
            {t('createStory.optional')}
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader
        title={t('createStory.storySetting.title')}
        required
        onGenerate={onGenerate}
        generateLoading={generateLoading}
        onHelpClick={onHelpClick}
      />
      <AiFormTextarea
        placeholder={t('createStory.storySetting.placeholder')}
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title={t('createStory.roles.title')} required showGenerate={false} onHelpClick={onHelpClick} />
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
            <span className="mt-[12px] text-[#9ca3af] text-[12px] font-medium tracking-[0.3px]">{t('createStory.roles.user')}</span>
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
            <span className="mt-[12px] text-[#4b5563] text-[12px]">{t('createStory.roles.add')}</span>
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title={t('createStory.sceneImage.title')} showGenerate={false} onHelpClick={onHelpClick} />
      <div className="my-2 flex w-full justify-center">
        <button
          onClick={generating ? undefined : onAddImage}
          className="relative flex h-[184px] w-[135px] flex-col items-center justify-center overflow-hidden rounded-[15px] border-2 border-dashed border-[rgba(var(--color-brand-green-rgb), 0.5)] bg-black active:opacity-80 disabled:opacity-50"
          disabled={generating}
        >
          {generating ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[13.5px] font-medium text-[#a1a1aa]">{t('createStory.sceneImage.loading')}</span>
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
              <span className="text-[13.5px] font-medium text-[#a1a1aa]">{t('createStory.sceneImage.add')}</span>
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader
        title={t('createStory.sceneSetting.title')}
        required
        showGenerate
        onGenerate={onGenerate}
        generateLoading={generateLoading}
        onHelpClick={onHelpClick}
      />
      <AiFormTextarea
        placeholder={t('createStory.sceneSetting.placeholder')}
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
  openingRoleName,
  onSelectOpeningRole,
  onChange,
}: {
  chapter: ChapterForm;
  index: number;
  isGenerating?: boolean;
  openingRoleName?: string;
  onSelectOpeningRole: () => void;
  onChange: (next: ChapterForm) => void;
}) {
  const { t } = useTranslation();

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
            {chapter.chapterTitle || t('createStory.outline.chapterTitle', { number: index + 1 })}
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
            {chapter.chapterDesc || t('createStory.outline.chapterDescription')}
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
                {t('createStory.outline.opening')}
              </span>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSelectOpeningRole();
              }}
              className="flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0"
            >
              <span
                className="text-white underline decoration-[rgba(var(--color-brand-green-rgb), 0.3)]"
                style={{
                  fontFamily: '\'Noto Sans SC\', sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  textDecorationSkipInk: 'none',
                }}
              >
                {openingRoleName || t('createStory.outline.selectRole')}
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
            placeholder={t('createStory.outline.openingPlaceholder')}
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
              {t('createStory.outline.mission')}
            </span>
          </div>
          <AiFormTextarea
            skeletonLines={3}
            isGenerating={isGenerating}
            skeletonPaddingClassName="p-[13px]"
            containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            className="min-h-[96px] w-full resize-none border-0 bg-transparent p-[13px] text-white placeholder-[#4b5563] outline-none"
            placeholder={t('createStory.outline.missionPlaceholder')}
            value={chapter.missionTarget}
            onChange={e => onChange({ ...chapter, missionTarget: e.target.value })}
            showCount={true}
            maxLength={500}
          />
        </div>

        {/* <div className="relative flex items-center justify-between pr-[3px] pl-[12px]">
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
        </div> */}
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
  roles,
  onChapterChange,
  onSelectOpeningRole,
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
  roles: StoryRoleItem[];
  onChapterChange: (index: number, chapter: ChapterForm) => void;
  onSelectOpeningRole: (index: number) => void;
  onAddChapter: () => void;
  onGenerate: () => void;
  onOptimize: () => void;
  generateLoading: boolean;
  optimizeLoading: boolean;
  onHelpClick?: () => void;
}) {
  const { t } = useTranslation();

  const renderModeSelect = () => (
    <AiSelectTab
      options={[
        { label: t('createStory.outline.normal'), value: 'normal' },
        { label: t('createStory.outline.chapter'), value: 'chapter' },
      ]}
      value={activeTab}
      onChange={v => onModeChange(v as StoryMode)}
      disabled={generateLoading}
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
          title={t('createStory.outline.title')}
          large
          onGenerate={onGenerate}
          generateLoading={generateLoading}
          onHelpClick={onHelpClick}
        />
        {renderModeSelect()}
        <AiFormTextarea
          placeholder={t('createStory.outline.placeholder')}
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
        title={t('createStory.outline.title')}
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
          openingRoleName={roles.find(role => role.id === chapter.openingRoleId)?.name}
          onSelectOpeningRole={() => onSelectOpeningRole(index)}
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
          {t('createStory.outline.addChapter')}
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
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-0 z-50 shrink-0">
      <div className="bg-linear-to-t from-black via-[rgba(0,0,0,0.95)] to-transparent px-[16px] pt-[36px] pb-[20px]">
        <button
          onClick={onNext}
          disabled={loading}
          className={`w-full rounded-full border-2 border-solid border-brand-green bg-transparent py-[15px] text-[18px] text-brand-green font-['Noto_Sans_SC',sans-serif] font-bold tracking-[1.4px] active:bg-brand-green/10 ${loading ? 'opacity-60' : ''}`}
        >
          {loading ? t('createStory.actions.saving') : t('createStory.actions.next')}
        </button>
      </div>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function App() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ 
    storyId?: string | string[]; 
    id?: string | string[];
    draftId?: string | string[];
    selectedRoleId?: string;
    selectedRoleName?: string;
    selectedRoleAvatar?: any;
  }>();
  const routeStoryId = useMemo(
    () => parsePositiveInt(params.storyId) ?? parsePositiveInt(params.id),
    [params.id, params.storyId],
  );
  const routeDraftId = useMemo(() => parsePositiveInt(params.draftId), [params.draftId]);

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
  const [selectedRoles, setSelectedRoles] = useState<StoryRoleItem[]>([]);
  const [tooltipType, setTooltipType] = useState<'none' | 'story' | 'role' | 'sceneImage' | 'scene' | 'outline'>('none');
  const [generateModalTarget, setGenerateModalTarget] = useState<'setting' | 'scene' | 'outline' | null>(null);
  const [confirmGenerateTarget, setConfirmGenerateTarget] = useState<GenerateConfirmTarget | null>(null);
  const [userRoleModalVisible, setUserRoleModalVisible] = useState(false);
  const [userRoleName, setUserRoleName] = useState('');
  const [userRoleSetting, setUserRoleSetting] = useState('');
  const [sceneImageUrl, setSceneImageUrl] = useState('');
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    if (!routeDraftId) {
      return;
    }
    let cancelled = false;
    const loadDraft = async () => {
      setLoadingDetail(true);
      try {
        const draft = await tsDraftApi.getDraftDetail(routeDraftId);
        if (cancelled) {
          return;
        }
        const content = draft?.content || {};
        const draftChapters = readDraftChapters(content);
        setStoryId(draft?.sourceId || null);
        setActiveTab(normalizeStoryMode(readDraftString(content, ['activeTab', 'storyMode'])));
        setActiveTopTab(readDraftString(content, ['activeTopTab']) === 'advanced' ? 'advanced' : 'basic');
        setIsPublic(content.isPublic !== false && content.isPublic !== 0);
        setStoryTitle(readDraftString(content, ['storyTitle', 'title']));
        setStoryIntro(readDraftString(content, ['storyIntro']));
        setStorySettingText(readDraftString(content, ['storySettingText', 'storySetting', 'siteSetting']));
        setStoryBackground(readDraftString(content, ['storyBackground']));
        setSceneSettingText(readDraftString(content, ['sceneSettingText', 'sceneNameSnapshot']));
        setOutlineText(readDraftString(content, ['outlineText', 'plotOutline']));
        setChapters(draftChapters.length ? draftChapters : [createDefaultChapter(1)]);
        setSelectedRoles(readDraftStoryRoles(content));
        setUserRoleName(readDraftString(content, ['userRoleName']));
        setUserRoleSetting(readDraftString(content, ['userRoleSetting']));
        setSceneImageUrl(readDraftString(content, ['sceneImageUrl']));
        setIsAiStorySetting(content.isAiStorySetting === true || content.isAiStorySetting === 1);
        setIsAiOutline(content.isAiOutline === true || content.isAiOutline === 1);
      }
      catch (error) {
        if (!cancelled) {
          showMessage(extractErrorMessage(error, t('createStory.messages.draftLoadFailed')));
        }
      }
      finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    };
    void loadDraft();
    return () => {
      cancelled = true;
    };
  }, [routeDraftId, t]);

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

  const hasEffectiveContent = useMemo(() => (
    [
      storyTitle,
      storyIntro,
      storySettingText,
      storyBackground,
      sceneSettingText,
      outlineText,
      userRoleName,
      userRoleSetting,
    ].some(value => value.trim().length > 0)
    || sceneImageUrl.trim().length > 0
    || selectedRoles.length > 0
    || !isPublic
    || chapters.some(chapter => (
      chapter.chapterDesc.trim().length > 0
      || chapter.openingContent.trim().length > 0
      || chapter.openingRoleId != null
      || chapter.missionTarget.trim().length > 0
      || chapter.forbiddenRoleIds.length > 0
    ))
  ), [
    chapters,
    isPublic,
    outlineText,
    sceneImageUrl,
    sceneSettingText,
    selectedRoles,
    storyBackground,
    storyIntro,
    storySettingText,
    storyTitle,
    userRoleName,
    userRoleSetting,
  ]);
  useEffect(() => {
    if (params.selectedRoleId) {
      const roleId = Number(params.selectedRoleId);
      setSelectedRoles(prev => {
        if (prev.find(r => r.id === roleId)) return prev;
        return [...prev, { 
          id: roleId, 
          name: params.selectedRoleName || t('createStory.roles.unknown'),
          avatar: params.selectedRoleAvatar 
        }];
      });
    }
  }, [params.selectedRoleId, params.selectedRoleName, params.selectedRoleAvatar, t]);

  useEffect(() => {
    const roleSelectedSubscription = DeviceEventEmitter.addListener('roleSelected', (role: StoryRoleItem) => {
      const roleId = Number(role?.id);
      if (!Number.isFinite(roleId) || roleId <= 0) {
        return;
      }
      setSelectedRoles((prev) => {
        if (prev.some(item => item.id === roleId)) {
          return prev;
        }
        return [
          ...prev,
          {
            id: roleId,
            name: typeof role.name === 'string' && role.name.trim()
              ? role.name.trim()
              : t('createStory.roles.fallback', { id: roleId }),
            avatar: role.avatar,
          },
        ];
      });
    });
    const openingRoleSubscription = DeviceEventEmitter.addListener(
      'storyChapterOpeningRoleSelected',
      (payload: StoryRoleItem & { chapterIndex?: number | null }) => {
        const roleId = Number(payload?.id);
        const chapterIndex = payload?.chapterIndex;
        if (
          !Number.isFinite(roleId)
          || roleId <= 0
          || typeof chapterIndex !== 'number'
          || !Number.isInteger(chapterIndex)
          || chapterIndex < 0
        ) {
          return;
        }
        setChapters(prev => prev.map((chapter, index) => (
          index === chapterIndex ? { ...chapter, openingRoleId: roleId } : chapter
        )));
      },
    );
    const sceneImageSubscription = DeviceEventEmitter.addListener(
      'storySceneImageSelected',
      (payload: { imageUrl?: string }) => {
        const imageUrl = typeof payload?.imageUrl === 'string' ? payload.imageUrl.trim() : '';
        if (imageUrl) {
          setSceneImageUrl(imageUrl);
        }
      },
    );
    return () => {
      roleSelectedSubscription.remove();
      openingRoleSubscription.remove();
      sceneImageSubscription.remove();
    };
  }, [t]);

  const handleSelectOpeningRole = (chapterIndex: number) => {
    if (!selectedRoles.length) {
      showMessage(t('createStory.roles.addFirst'));
      return;
    }
    const chapter = chapters[chapterIndex];
    if (!chapter) {
      return;
    }
    router.push({
      pathname: '/pages/select-role',
      params: {
        from: 'create-story',
        mode: 'chapter-opening',
        chapterIndex: String(chapterIndex),
        candidateRoleIds: selectedRoles.map(role => role.id).join(','),
        selectedRoleId: chapter.openingRoleId ? String(chapter.openingRoleId) : '',
      },
    });
  };

  const handleRemoveSelectedRole = (role: StoryRoleItem) => {
    setSelectedRoles(prev => prev.filter(item => item.id !== role.id));
    setChapters(prev => prev.map(chapter => (
      chapter.openingRoleId === role.id
        ? { ...chapter, openingRoleId: undefined }
        : chapter
    )));
  };

  useEffect(() => {
    if (!routeStoryId || routeDraftId) {
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
        setSceneImageUrl(
          (typeof story?.sceneImageUrl === 'string' && story.sceneImageUrl.trim())
            ? story.sceneImageUrl.trim()
            : (pickTsImageUrl(story, 'story_scene') || ''),
        );
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
          showMessage(extractErrorMessage(error, t('createStory.messages.detailLoadFailed')));
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
  }, [routeDraftId, routeStoryId, t]);

  const extractStorySettingValue = (result?: TsStoryFullGenerateResult) =>
    (result?.storySetting || '').trim();
  const extractSiteSettingValue = (result?: TsStoryFullGenerateResult) =>
    (result?.siteSetting || '').trim();
  const extractPlotOutlineValue = (result?: TsStoryFullGenerateResult) =>
    (result?.plotOutline || '').trim();
  const extractOutlineChapters = (
    result?: TsStoryFullGenerateResult | { chapters?: TsStoryOneClickOutlineChapter[] },
  ) => {
    if (!result || !('chapters' in result)) {
      return [];
    }
    return Array.isArray(result.chapters) ? result.chapters : [];
  };

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
        throw new Error(t('createStory.messages.settingEmpty'));
      }
      setStorySettingText(nextStorySetting);
      setIsAiStorySetting(true);
      showMessage(t('createStory.messages.settingGenerated'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.settingGenerateFailed')));
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
        throw new Error(t('createStory.messages.sceneEmpty'));
      }
      setSceneSettingText(nextSiteSetting);
      showMessage(t('createStory.messages.sceneGenerated'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.sceneGenerateFailed')));
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
      const result = await tsStoryApi.generateStoryOutline({
        storyId: storyId || undefined,
        title: storyTitle.trim() || undefined,
        storyMode: activeTab,
        storySetting: storySettingText.trim() || undefined,
        sceneSetting: sceneSettingText.trim() || undefined,
        storyIntro: storyIntro.trim() || undefined,
        plotOutline: outlineText.trim() || undefined,
        extraRequirements: buildOnlyCurrentExtraRequirements('outline'),
      });
      const outlineChapters = extractOutlineChapters(result);
      const nextPlotOutline = extractPlotOutlineValue(result)
        || (outlineChapters.length ? buildOutlineTextFromChapters(outlineChapters) : '');

      if (activeTab === 'normal') {
        if (!nextPlotOutline) {
          throw new Error(t('createStory.messages.outlineEmpty'));
        }
        setOutlineText(nextPlotOutline);
      }
      else {
        if (!outlineChapters.length) {
          throw new Error(t('createStory.messages.chapterOutlineEmpty'));
        }
        setChapters(outlineChapters.map(mapChapterFromOutline));
      }
      setIsAiOutline(true);
      showMessage(t('createStory.messages.outlineGenerated'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.outlineGenerateFailed')));
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
        throw new Error(t('createStory.messages.settingOptimizeEmpty'));
      }
      setStorySettingText(nextStorySetting);
      setIsAiStorySetting(result?.generated !== false);
      showMessage(t('createStory.messages.settingOptimized'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.settingOptimizeFailed')));
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
        throw new Error(t('createStory.messages.sceneOptimizeEmpty'));
      }
      setSceneSettingText(nextSceneSetting);
      showMessage(t('createStory.messages.sceneOptimized'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.sceneOptimizeFailed')));
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
        throw new Error(t('createStory.messages.outlineOptimizeEmpty'));
      }
      setOutlineText(nextPlotOutline);
      setIsAiOutline(true);
      showMessage(t('createStory.messages.outlineOptimized'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.outlineOptimizeFailed')));
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
      showMessage(t('createStory.messages.allGenerated'));
    }
    catch (error) {
      showMessage(resolveGenerateErrorMessage(error, t('createStory.messages.allGenerateFailed')));
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
        sceneImageUrl: sceneImageUrl.trim() || undefined,
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
        throw new Error(t('createStory.messages.saveFailed'));
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
            chapterTitle: (chapter.chapterTitle || t('createStory.outline.chapterTitle', { number: chapterNo })).trim(),
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

      showMessage(t('createStory.messages.saved'));
      router.push({
        pathname: '/pages/conversation-detail',
        params: { storyId: String(currentStoryId) },
      });
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createStory.messages.saveFailed')));
    }
    finally {
      setSaving(false);
    }
  };

  const leaveCreateStory = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/pages/create-page');
  };

  const handleBack = () => {
    if (saving || savingDraft) {
      return;
    }
    if (hasEffectiveContent) {
      setExitDialogVisible(true);
      return;
    }
    leaveCreateStory();
  };

  const handleSaveDraftAndExit = async () => {
    if (savingDraft) {
      return;
    }
    setSavingDraft(true);
    try {
      const payload = {
        draftType: 'story' as const,
        draftName: storyTitle.trim() || t('createStory.untitledDraft'),
        sourceId: storyId || undefined,
        content: {
          activeTab,
          activeTopTab,
          isPublic,
          storyTitle,
          storyIntro,
          storySettingText,
          storyBackground,
          sceneSettingText,
          outlineText,
          chapters,
          selectedRoles,
          userRoleName,
          userRoleSetting,
          sceneImageUrl,
          isAiStorySetting,
          isAiOutline,
        },
      };
      if (routeDraftId) {
        await tsDraftApi.updateDraft({ ...payload, id: routeDraftId });
      }
      else {
        await tsDraftApi.createDraft(payload);
      }
      setExitDialogVisible(false);
      leaveCreateStory();
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createStory.messages.draftSaveFailed')));
    }
    finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="flex min-h-full justify-center bg-background">
      <div className="flex min-h-full w-full max-w-[420px] flex-col bg-black">
        <Header onBack={handleBack} />
        <div className="sticky top-[65px] z-40 bg-black px-[16px] pb-[10px] border-b border-white/10">
          <AiTopTabs
            tabs={[
              { id: 'basic', label: t('createStory.tabs.basic') },
              { id: 'advanced', label: t('createStory.tabs.advanced') },
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
                  onRemoveRole={handleRemoveSelectedRole}
                  onHelpClick={() => setTooltipType('role')}
                  onUserClick={() => setUserRoleModalVisible(true)}
                />
                <SceneImageSection
                  imageUrl={sceneImageUrl}
                  onHelpClick={() => setTooltipType('sceneImage')}
                  onAddImage={() => router.push('/pages/my-gallery?from=create-story')}
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
                  roles={selectedRoles}
                  onChapterChange={(index, chapter) => {
                    setChapters(prev => prev.map((item, current) => (current === index ? chapter : item)));
                  }}
                  onSelectOpeningRole={handleSelectOpeningRole}
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

      <AiDraftExitDialog
        visible={exitDialogVisible}
        saving={savingDraft}
        onContinue={() => setExitDialogVisible(false)}
        onDiscard={() => {
          setExitDialogVisible(false);
          leaveCreateStory();
        }}
        onSaveAndExit={() => void handleSaveDraftAndExit()}
      />


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
            <h3 className="text-center text-lg font-bold tracking-wide text-white">{t('createStory.generateModal.title')}</h3>
            <div className="text-[14px] leading-relaxed text-[#a1a1aa] flex flex-col gap-2">
              <p>{t('createStory.generateModal.description')}</p>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(var(--color-brand-green-rgb),0.9)] mt-1">•</span>
                <p>
                  <span className="text-white font-medium">
                    {t('createStory.generateModal.currentTitle')}
                  </span>
                  {t('createStory.generateModal.currentDescription')}
                </p>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(var(--color-brand-green-rgb),0.9)] mt-1">•</span>
                <p>
                  <span className="text-white font-medium">
                    {t('createStory.generateModal.allTitle')}
                  </span>
                  {t('createStory.generateModal.allDescription')}
                </p>
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
                {t('createStory.generateModal.current')}
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(var(--color-brand-green-rgb),0.9)] bg-brand-green/10 py-3 text-center text-base font-bold text-[rgba(var(--color-brand-green-rgb),0.9)] active:bg-brand-green/20"
                onClick={() => {
                  setGenerateModalTarget(null);
                  triggerGenerateAll();
                }}
              >
                {t('createStory.generateModal.all')}
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
            <h3 className="text-center text-lg font-bold tracking-wide text-white">
              {confirmGenerateTarget === 'all'
                ? t('createStory.overwrite.warningTitle')
                : t('createStory.overwrite.noticeTitle')}
            </h3>
            <p className="text-[14px] leading-relaxed text-[#a1a1aa]">
              {confirmGenerateTarget === 'all'
                ? t('createStory.overwrite.all')
                : confirmGenerateTarget === 'setting'
                  ? t('createStory.overwrite.setting')
                  : confirmGenerateTarget === 'scene'
                    ? t('createStory.overwrite.scene')
                    : t('createStory.overwrite.outline')}
              <br />
              <br />
              {t('createStory.overwrite.continue')}
            </p>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[#333] bg-transparent py-3 text-center text-base font-bold text-white active:bg-white/5"
                onClick={() => setConfirmGenerateTarget(null)}
              >
                {t('createStory.actions.cancel')}
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
                {confirmGenerateTarget === 'all'
                  ? t('createStory.overwrite.confirmAll')
                  : t('createStory.overwrite.confirm')}
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
            <h3 className="text-center text-lg font-bold tracking-wide text-white">{t('createStory.userRole.title')}</h3>
            
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white">
                {t('createStory.userRole.name')}
                {' '}
                <span className="text-xs text-[#a1a1aa]">
                  {t('createStory.optional')}
                </span>
              </span>
              <AiFormInput
                value={userRoleName}
                onChangeText={setUserRoleName}
                placeholder={t('createStory.userRole.namePlaceholder')}
                customContainerClass="bg-black rounded-lg border border-[#494949] h-[44px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-white">
                {t('createStory.userRole.setting')}
                {' '}
                <span className="text-xs text-[#a1a1aa]">
                  {t('createStory.optional')}
                </span>
              </span>
              <AiFormTextarea
                value={userRoleSetting}
                onChangeText={setUserRoleSetting}
                placeholder={t('createStory.userRole.settingPlaceholder')}
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
                {t('createStory.actions.confirm')}
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
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createStory.help.storyTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createStory.help.storyDescription')}
                </p>
              </>
            )}
            {tooltipType === 'role' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createStory.help.roleTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createStory.help.roleDescription')}
                </p>
              </>
            )}
            {tooltipType === 'sceneImage' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createStory.help.sceneImageTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createStory.help.sceneImageDescription')}
                </p>
              </>
            )}
            {tooltipType === 'scene' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createStory.help.sceneTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createStory.help.sceneDescription')}
                </p>
              </>
            )}
            {tooltipType === 'outline' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createStory.help.outlineTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createStory.help.outlineDescription')}
                </p>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
