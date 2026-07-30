import type { Gender } from './basic-info';
import type { TsDraftContent, TsRoleSavePayload } from '@/lib/api';
import type { TsVoiceProfilePreviewPayload, TsVoiceProfilePreviewResult } from '@/lib/api/ts-voice';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, ScrollView, TextInput } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { AiDraftExitDialog } from '@/components/ai-company/ai-draft-exit-dialog';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiHeader } from '@/components/ai-company/ai-header';
import { AiSwitch } from '@/components/ai-company/ai-switch';
import { AiTopTabs } from '@/components/ai-company/ai-top-tabs';
import { tsDraftApi, tsRoleApi, tsRoleImageApi, tsRoleTagApi, tsVoiceApi } from '@/lib/api';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { BasicInfoSection } from './basic-info';

const imgSparkle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-role/sparkle.svg'));
const imgPlusGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-role/plus_gray.svg'));
const imgChevronRightGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-role/chevron_right_green.svg'));

const fontBase = 'font-[\'Noto_Sans_SC\',sans-serif]';
const VOICE_PREVIEW_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const VOICE_PREVIEW_CACHE_KEY_PREFIX = 'create-role:voice-preview:';
const CREATE_ROLE_SELECTED_VOICE_KEY = 'create-role:selected-voice-v1';

type VoicePreviewCacheEntry = {
  expireAt: number;
  preview: TsVoiceProfilePreviewResult;
};
type SettingGenerateMode = 'single' | 'full';
type CreateRoleSelectedVoicePayload = {
  voiceProfileId: number;
  voiceName?: string;
  providerVoiceId?: string;
};

function parsePositiveInt(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
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

function readDraftNumber(content: TsDraftContent, key: string, fallback: number) {
  const value = content[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function showMessage(message: string) {
  if (!message) {
    return;
  }
  const maybeAlert = (globalThis as { alert?: (msg?: string) => void }).alert;
  if (typeof maybeAlert === 'function') {
    maybeAlert(message);
    return;
  }
  console.warn(message);
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error && (error as { message?: string }).message) {
    return String((error as { message?: string }).message);
  }
  return fallback;
}

function normalizeGenderForSave(gender: Gender): 'male' | 'female' | 'unknown' {
  if (gender === 'male' || gender === 'female') {
    return gender;
  }
  return 'unknown';
}

function roundVoiceParam(value: number, digits = 1) {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}

function buildVoicePreviewCacheKey(payload: TsVoiceProfilePreviewPayload) {
  const voiceProfileId = payload.voiceProfileId ?? '';
  const voiceId = payload.voiceId ?? '';
  const previewText = payload.previewText ?? '';
  const speed = payload.speed == null ? '' : roundVoiceParam(payload.speed, 2);
  const pitch = payload.pitch == null ? '' : roundVoiceParam(payload.pitch, 2);
  const volume = payload.volume == null ? '' : roundVoiceParam(payload.volume, 2);
  return `${VOICE_PREVIEW_CACHE_KEY_PREFIX}${voiceProfileId}|${voiceId}|${speed}|${pitch}|${volume}|${previewText}`;
}

function getCachedVoicePreview(payload: TsVoiceProfilePreviewPayload): TsVoiceProfilePreviewResult | null {
  const key = buildVoicePreviewCacheKey(payload);
  const cache = getItem<VoicePreviewCacheEntry>(key);
  if (!cache || !cache.expireAt || !cache.preview) {
    return null;
  }
  if (cache.expireAt <= Date.now()) {
    return null;
  }
  return cache.preview;
}

function setCachedVoicePreview(payload: TsVoiceProfilePreviewPayload, preview: TsVoiceProfilePreviewResult) {
  const key = buildVoicePreviewCacheKey(payload);
  const cache: VoicePreviewCacheEntry = {
    expireAt: Date.now() + VOICE_PREVIEW_CACHE_TTL_MS,
    preview,
  };
  void setItem(key, cache);
}
function Header({
  activeTab,
  onTabChange,
  onBack,
}: {
  activeTab: 'basic' | 'advanced';
  onTabChange: (tab: 'basic' | 'advanced') => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-black px-4 py-3">
      <AiHeader title={t('createRole.title')} className="mb-4" onBack={onBack} />
      <AiTopTabs
        tabs={[
          { id: 'basic', label: t('createRole.tabs.basic') },
          { id: 'advanced', label: t('createRole.tabs.advanced') },
        ]}
        activeTab={activeTab}
        onTabChange={onTabChange}
        containerClassName="bg-black rounded-full border-[1px] border-[#494949] p-[5px] h-[48px]"
        activeBgClassName="bg-brand-green/10 border border-brand-green/90 rounded-full"
        activeTextClassName="text-[rgba(var(--color-brand-green-rgb),0.9)] font-bold"
        inactiveTextClassName="text-[#9ca3af]"
      />
    </div>
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
    <section className="flex flex-col gap-3">
      <h2 className={`text-base text-white ${fontBase} px-1 font-bold tracking-wide`}>
        {t('createRole.publicStatus.title')}
      </h2>
      <div className="flex items-center justify-between rounded-2xl border border-[#494949] bg-black p-5">
        <div>
          <p className={`text-sm text-white ${fontBase} font-medium`}>{t('createRole.publicStatus.label')}</p>
          <p className={`text-xs text-[#6b7280] ${fontBase} mt-1`}>{t('createRole.publicStatus.description')}</p>
        </div>
        <AiSwitch checked={isPublic} onCheckedChange={onPublicChange} checkedColorClassName="bg-[#a3e635]" />
      </div>
    </section>
  );
}

function TagChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-full px-4 py-2 text-sm ${fontBase} font-medium transition-colors ${
        selected
          ? 'border border-black bg-brand-green/20 text-brand-green/90'
          : 'border border-[#4b5563] text-[#9ca3af]'
      }`}
    >
      {label}
    </button>
  );
}

function TagsSection({
  tagOptions,
  selectedTags,
  onToggleTag,
  onAddCustomTag,
}: {
  tagOptions: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onAddCustomTag: (tag: string) => void;
}) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const handleConfirm = () => {
    const trimmed = customTag.trim();
    if (trimmed) {
      onAddCustomTag(trimmed);
    }
    setCustomTag('');
    setModalVisible(false);
  };

  const handleCancel = () => {
    setCustomTag('');
    setModalVisible(false);
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className={`text-base text-white ${fontBase} font-bold tracking-wide`}>{t('createRole.tags.title')}</h2>
      </div>
      <div className="rounded-2xl border border-[#494949] bg-black p-5">
        <div className="flex flex-wrap gap-3">
          {tagOptions.map(tag => (
            <TagChip
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onToggle={() => onToggleTag(tag)}
            />
          ))}
          <button 
            onClick={() => setModalVisible(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-neutral-500 px-4 py-2"
          >
            <img src={imgPlusGray} alt="" className="size-[16px] object-contain" />
            <span className={`text-sm text-[#9ca3af] ${fontBase} font-medium`}>{t('createRole.tags.custom')}</span>
          </button>
        </div>
      </div>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <div className="flex h-full w-full items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-[320px] rounded-2xl border border-[#494949] bg-[#111] p-5 shadow-xl">
            <h3 className={`mb-4 text-center text-lg font-bold text-white ${fontBase}`}>{t('createRole.tags.addTitle')}</h3>
            <TextInput
              placeholder={t('createRole.tags.placeholder')}
              placeholderTextColor="#6b7280"
              maxLength={10}
              value={customTag}
              onChangeText={setCustomTag}
              className={`w-full rounded-xl border border-[#494949] bg-black px-4 py-3 text-sm text-white focus:border-brand-green/50 ${fontBase}`}
              autoFocus
              style={[{ outlineStyle: 'none' } as any]}
            />
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className={`rounded-full border border-[#494949] bg-transparent px-6 py-2 text-sm font-medium text-[#9ca3af] ${fontBase}`}
              >
                {t('createRole.actions.cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className={`rounded-full border-2 border-solid border-brand-green bg-transparent px-6 py-2 text-sm font-bold text-brand-green active:bg-brand-green/10 ${fontBase}`}
              >
                {t('createRole.actions.confirm')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3.5 py-1 text-xs ${fontBase} transition-colors ${
        selected
          ? 'border border-brand-green/90 bg-brand-green/20 text-brand-green/90'
          : 'border border-[#4b5563] text-[#9ca3af]'
      }`}
    >
      {label}
    </button>
  );
}

function DialogueStyleSection({
  dialogLength,
  interactivity,
  toneTendency,
  previewText,
  onDialogLengthChange,
  onInteractivityChange,
  onToneTendencyChange,
  onPreviewTextChange,
}: {
  dialogLength: string;
  interactivity: string;
  toneTendency: string;
  previewText: string;
  onDialogLengthChange: (value: string) => void;
  onInteractivityChange: (value: string) => void;
  onToneTendencyChange: (value: string) => void;
  onPreviewTextChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [toneModalVisible, setToneModalVisible] = useState(false);
  const TONE_OPTIONS = ['默认', '轻声细语', '惜字如金', '喋喋不休', '慵懒随意', '咬文嚼字', '干练果断', '粗犷豪放'];
  const optionLabelMap: Record<string, string> = {
    默认: 'default',
    简短: 'short',
    详细: 'detailed',
    主动引导: 'active',
    被动回应: 'passive',
    轻声细语: 'gentle',
    惜字如金: 'concise',
    喋喋不休: 'talkative',
    慵懒随意: 'casual',
    咬文嚼字: 'literary',
    干练果断: 'decisive',
    粗犷豪放: 'bold',
  };
  const getOptionLabel = (value: string) => {
    const key = optionLabelMap[value];
    return key ? t(`createRole.dialogStyle.values.${key}` as any) : value;
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className={`text-base text-white ${fontBase} px-1 font-bold tracking-wide`}>
        {t('createRole.dialogStyle.title')}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[#494949] bg-black">
        <div className="p-5">
          <div className="mb-4 flex items-center">
            <div className="mr-3 h-5 w-[2.5px] rounded-full bg-brand-green/90" />
            <span className={`text-sm text-white ${fontBase} font-bold tracking-wide`}>{t('createRole.dialogStyle.preview')}</span>
          </div>
          <AiFormTextarea
            containerClassName="bg-[#111] rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            className={`w-full min-h-[96px] bg-transparent border-0 outline-none resize-none p-[16px] text-[#d1d5db] placeholder-[#6b7280] text-sm ${fontBase} leading-relaxed`}
            placeholder={t('createRole.dialogStyle.previewPlaceholder')}
            value={previewText}
            onChange={e => onPreviewTextChange(e.target.value)}
          />
        </div>

        <div className="mx-5 h-px bg-brand-green/20" />

        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>{t('createRole.dialogStyle.length')}</span>
          <div className="flex gap-2">
            <OptionButton
              label={getOptionLabel('默认')}
              selected={dialogLength === '默认'}
              onClick={() => onDialogLengthChange('默认')}
            />
            <OptionButton
              label={getOptionLabel('简短')}
              selected={dialogLength === '简短'}
              onClick={() => onDialogLengthChange('简短')}
            />
            <OptionButton
              label={getOptionLabel('详细')}
              selected={dialogLength === '详细'}
              onClick={() => onDialogLengthChange('详细')}
            />
          </div>
        </div>

        <div className="mx-5 h-px bg-brand-green/20" />

        <div 
          className="flex items-center justify-between px-5 py-4 cursor-pointer active:opacity-70"
          onClick={() => setToneModalVisible(true)}
        >
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>{t('createRole.dialogStyle.tone')}</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs text-brand-green/90 ${fontBase}`}>{getOptionLabel(toneTendency)}</span>
            <img src={imgChevronRightGreen} alt="" className="h-[10px] w-[6px] object-contain" />
          </div>
        </div>

        <div className="mx-5 h-px bg-brand-green/20" />

        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>{t('createRole.dialogStyle.interactivity')}</span>
          <div className="flex gap-2">
            <OptionButton
              label={getOptionLabel('默认')}
              selected={interactivity === '默认'}
              onClick={() => onInteractivityChange('默认')}
            />
            <OptionButton
              label={getOptionLabel('主动引导')}
              selected={interactivity === '主动引导'}
              onClick={() => onInteractivityChange('主动引导')}
            />
            <OptionButton
              label={getOptionLabel('被动回应')}
              selected={interactivity === '被动回应'}
              onClick={() => onInteractivityChange('被动回应')}
            />
          </div>
        </div>
      </div>

      <Modal
        visible={toneModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setToneModalVisible(false)}
      >
        <div className="flex h-full w-full items-end justify-center bg-black/60 sm:items-center">
          <div className="w-full max-w-[480px] rounded-t-2xl sm:rounded-2xl border border-[#494949] bg-[#111] p-5 shadow-xl">
            <h3 className={`mb-4 text-center text-lg font-bold text-white ${fontBase}`}>{t('createRole.dialogStyle.selectTone')}</h3>
            <div className="flex flex-wrap gap-3">
              {TONE_OPTIONS.map(tone => (
                <button
                  key={tone}
                  onClick={() => {
                    onToneTendencyChange(tone);
                    setToneModalVisible(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    toneTendency === tone
                      ? 'border border-brand-green/90 bg-brand-green/20 text-brand-green/90'
                      : 'border border-[#4b5563] text-[#9ca3af]'
                  }`}
                >
                  {getOptionLabel(tone)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setToneModalVisible(false)}
              className={`mt-6 w-full rounded-full border border-[#494949] bg-transparent py-3 text-center text-sm font-medium text-[#9ca3af] ${fontBase}`}
            >
              {t('createRole.actions.cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

function SaveButton({
  onSave,
  saving,
}: {
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-0 z-10 bg-linear-to-t from-black via-black/95 to-transparent px-4 pt-6 pb-5">
      <button
        onClick={onSave}
        disabled={saving}
        className={`w-full rounded-full border-2 border-solid border-brand-green bg-transparent py-4 text-lg text-brand-green ${fontBase} font-bold tracking-wider active:bg-brand-green/10 ${saving ? 'opacity-60' : ''}`}
      >
        {saving ? t('createRole.actions.saving') : t('createRole.actions.save')}
      </button>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export function CreateCharacter() {
  const { t } = useTranslation();
  const [generateModalVisible, setGenerateModalVisible] = useState(false);

  const isFocused = useIsFocused();
  const params = useLocalSearchParams<{ selectedImageUrl?: string; draftId?: string | string[] }>();
  const routeDraftId = parsePositiveInt(params.draftId);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [roleId, setRoleId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('random');
  const [job, setJob] = useState('');
  const [background, setBackground] = useState('');
  const [greeting, setGreeting] = useState('');
  const [voiceName, setVoiceName] = useState('');
  const [voiceProfileId, setVoiceProfileId] = useState<number | null>(null);
  const [providerVoiceId, setProviderVoiceId] = useState('');
  const [voicePreviewText, setVoicePreviewText] = useState(() => t('createRole.defaultVoicePreview'));
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarNeedsImport, setAvatarNeedsImport] = useState(false);
  const [voicePreviewAudioUrl, setVoicePreviewAudioUrl] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);

  useEffect(() => {
    if (params.selectedImageUrl) {
      setAvatarUrl(params.selectedImageUrl);
      setAvatarNeedsImport(false);
    }
  }, [params.selectedImageUrl]);

  useEffect(() => {
    if (!isFocused || routeDraftId) {
      return;
    }
    let alive = true;

    const syncSelectedVoiceFromConfig = async () => {
      const localSelectedVoice = getItem<CreateRoleSelectedVoicePayload>(CREATE_ROLE_SELECTED_VOICE_KEY);
      if (localSelectedVoice && typeof localSelectedVoice.voiceProfileId === 'number' && Number.isFinite(localSelectedVoice.voiceProfileId)) {
        if (!alive) {
          return;
        }
        setVoiceProfileId(localSelectedVoice.voiceProfileId);
        setVoiceName(localSelectedVoice.voiceName?.trim() || '');
        setProviderVoiceId(localSelectedVoice.providerVoiceId?.trim() || '');
        void removeItem(CREATE_ROLE_SELECTED_VOICE_KEY);
        return;
      }

      try {
        const config = await tsVoiceApi.getCurrentVoiceConfig();
        if (!alive) {
          return;
        }
        const selectedVoice = config.selectedVoiceProfile;
        const selectedId = typeof config.selectedVoiceProfileId === 'number' && Number.isFinite(config.selectedVoiceProfileId)
          ? config.selectedVoiceProfileId
          : (typeof selectedVoice?.id === 'number' && Number.isFinite(selectedVoice.id) ? selectedVoice.id : null);

        if (selectedId !== null) {
          setVoiceProfileId(selectedId);
        }
        if (selectedVoice?.providerVoiceId != null) {
          setProviderVoiceId(selectedVoice.providerVoiceId);
        }
        if (selectedVoice?.name?.trim()) {
          setVoiceName(selectedVoice.name.trim());
        }
      }
      catch (error) {
        console.warn('sync selected voice from config failed', error);
      }
    };

    void syncSelectedVoiceFromConfig();
    return () => {
      alive = false;
    };
  }, [isFocused, routeDraftId]);

  const [isPublic, setIsPublic] = useState(true);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dialogLength, setDialogLength] = useState<string>('默认');
  const [interactivity, setInteractivity] = useState<string>('默认');
  const [toneTendency, setToneTendency] = useState<string>('默认');
  const [dialoguePreview, setDialoguePreview] = useState('');

  const [basicAiGenerated, setBasicAiGenerated] = useState(false);
  const [advancedAiGenerated, setAdvancedAiGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingSetting, setGeneratingSetting] = useState(false);
  const [optimizingBackground, setOptimizingBackground] = useState(false);
  const [optimizingGreeting, setOptimizingGreeting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingVoice, setGeneratingVoice] = useState(false);
  const [voiceListenPhase, setVoiceListenPhase] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const hasEffectiveContent = useMemo(() => (
    [name, job, background, greeting, dialoguePreview].some(value => value.trim().length > 0)
    || gender !== 'random'
    || avatarUrl.trim().length > 0
    || voiceName.trim().length > 0
    || providerVoiceId.trim().length > 0
    || voiceProfileId !== null
    || dialogLength !== '默认'
    || interactivity !== '默认'
    || toneTendency !== '默认'
    || !isPublic
  ), [
    avatarUrl,
    background,
    dialogLength,
    dialoguePreview,
    gender,
    greeting,
    interactivity,
    isPublic,
    job,
    name,
    providerVoiceId,
    toneTendency,
    voiceName,
    voiceProfileId,
  ]);

  useEffect(() => {
    if (!routeDraftId) {
      return;
    }
    let cancelled = false;
    const loadDraft = async () => {
      try {
        const draft = await tsDraftApi.getDraftDetail(routeDraftId);
        if (cancelled) {
          return;
        }
        const content = draft?.content || {};
        const draftGender = readDraftString(content, ['gender']);
        setRoleId(draft?.sourceId || null);
        setActiveTab(readDraftString(content, ['activeTab']) === 'advanced' ? 'advanced' : 'basic');
        setName(readDraftString(content, ['name', 'roleName']));
        setGender(
          draftGender === 'male' || draftGender === 'female' || draftGender === 'unknown'
            ? draftGender
            : 'random',
        );
        setJob(readDraftString(content, ['job', 'occupation']));
        setBackground(readDraftString(content, ['background', 'backgroundStory']));
        setGreeting(readDraftString(content, ['greeting']));
        setVoiceName(readDraftString(content, ['voiceName']));
        setVoiceProfileId(parsePositiveInt(String(content.voiceProfileId ?? '')));
        setProviderVoiceId(readDraftString(content, ['providerVoiceId']));
        setVoicePreviewText(readDraftString(content, ['voicePreviewText']) || t('createRole.defaultVoicePreview'));
        setAvatarUrl(readDraftString(content, ['avatarUrl', 'generatedAvatarUrl']));
        setAvatarNeedsImport(content.avatarNeedsImport === true);
        setVoicePreviewAudioUrl(readDraftString(content, ['voicePreviewAudioUrl']));
        setVoiceSpeed(readDraftNumber(content, 'voiceSpeed', 1));
        setVoicePitch(readDraftNumber(content, 'voicePitch', 0));
        setVoiceVolume(readDraftNumber(content, 'voiceVolume', 1));
        setIsPublic(content.isPublic !== false && content.isPublic !== 0);
        setSelectedTags(
          Array.isArray(content.selectedTags)
            ? content.selectedTags.filter((tag): tag is string => typeof tag === 'string')
            : [],
        );
        setDialogLength(readDraftString(content, ['dialogLength']) || '默认');
        setInteractivity(readDraftString(content, ['interactivity', 'interactionMode']) || '默认');
        setToneTendency(readDraftString(content, ['toneTendency']) || '默认');
        setDialoguePreview(readDraftString(content, ['dialoguePreview']));
        setBasicAiGenerated(content.basicAiGenerated === true || content.basicAiGenerated === 1);
        setAdvancedAiGenerated(content.advancedAiGenerated === true || content.advancedAiGenerated === 1);
      }
      catch (error) {
        if (!cancelled) {
          showMessage(extractErrorMessage(error, t('createRole.messages.draftLoadFailed')));
        }
      }
    };
    void loadDraft();
    return () => {
      cancelled = true;
    };
  }, [routeDraftId, t]);

  useEffect(() => {
    let alive = true;

    const loadRoleTags = async () => {
      try {
        const list = await tsRoleTagApi.getRoleTags();
        if (!alive) {
          return;
        }
        const names = (list || [])
          .map(item => item?.tagName?.trim())
          .filter((item): item is string => Boolean(item));
        const uniqueNames = Array.from(new Set(names));
        setTagOptions(uniqueNames);
        setSelectedTags(prev => prev.filter(tag => uniqueNames.includes(tag)));
      }
      catch (error) {
        if (!alive) {
          return;
        }
        console.warn('load role tags failed', error);
        setTagOptions([]);
        setSelectedTags([]);
      }
    };

    void loadRoleTags();

    return () => {
      alive = false;
    };
  }, []);

  const buildSavePayload = (resolvedAvatarUrl = avatarUrl): TsRoleSavePayload => {
    const extPayload: Record<string, unknown> = {
      tags: selectedTags,
    };
    if (voicePreviewAudioUrl) {
      extPayload.voicePreviewAudioUrl = voicePreviewAudioUrl;
    }
    if (resolvedAvatarUrl) {
      extPayload.generatedAvatarUrl = resolvedAvatarUrl;
    }
    return {
      roleName: name.trim(),
      gender: normalizeGenderForSave(gender),
      occupation: job.trim() || undefined,
      backgroundStory: background.trim() || undefined,
      greeting: greeting.trim() || undefined,
      avatarUrl: resolvedAvatarUrl || undefined,
      voiceName: voiceName || undefined,
      isPublic: isPublic ? 1 : 0,
      dialogueLength: dialogLength === '默认' ? (null as any) : dialogLength,
      toneTendency: toneTendency === '默认' ? (null as any) : toneTendency,
      interactionMode: interactivity === '默认' ? (null as any) : interactivity,
      dialoguePreview: dialoguePreview.trim() || undefined,
      extJson: JSON.stringify(extPayload),
      basicAiGenerated: basicAiGenerated ? 1 : 0,
      advancedAiGenerated: advancedAiGenerated ? 1 : 0,
      status: 1,
    };
  };

  const handleGenerateSetting = () => {
    if (generatingSetting || saving) return;
    const isEmpty = !name.trim() && !job.trim() && !background.trim() && !greeting.trim() && gender === 'random';
    if (isEmpty) {
      executeGenerateSetting('full');
    } else {
      setGenerateModalVisible(true);
    }
  };

  const executeGenerateSetting = async (generateMode: 'single' | 'full') => {
    setGeneratingSetting(true);
    try {
      const result = generateMode === 'full'
        ? await tsRoleApi.generateRoleSettingPreset({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            greeting: greeting.trim() || undefined,
            keywords: selectedTags.join(','),
          })
        : await tsRoleApi.generateRoleSetting({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            greeting: greeting.trim() || undefined,
            keywords: selectedTags.join(','),
          });
      const roleName = result?.roleName ?? result?.role_name;
      const generatedGender = result?.gender;
      const occupation = result?.occupation;
      const backgroundStory = result?.backgroundStory ?? result?.background_story;
      const greetingText = result?.greeting ?? result?.greeting_text;

      if (typeof roleName === 'string' && roleName.trim()) {
        setName(roleName);
      }
      if (generatedGender === 'male' || generatedGender === 'female' || generatedGender === 'unknown') {
        setGender(generatedGender);
      }
      if (typeof occupation === 'string' && occupation.trim()) {
        setJob(occupation);
      }
      if (typeof backgroundStory === 'string' && backgroundStory.trim()) {
        setBackground(backgroundStory);
      }
      if (typeof greetingText === 'string' && greetingText.trim()) {
        setGreeting(greetingText);
      }
      setBasicAiGenerated(true);
      showMessage(generateMode === 'full'
        ? t('createRole.messages.settingGeneratedFull')
        : t('createRole.messages.settingGenerated'));
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.settingGenerateFailed')));
    }
    finally {
      setGeneratingSetting(false);
    }
  };

  const handleOptimizeBackground = async () => {
    if (optimizingBackground || optimizingGreeting || generatingSetting || saving) {
      return;
    }
    setOptimizingBackground(true);
    try {
      const result = await tsRoleApi.generateRoleSetting({
        roleId: roleId || undefined,
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
        greeting: greeting.trim() || undefined,
        keywords: selectedTags.join(','),
        templateMode: 'background_optimize',
      });
      const backgroundStory = result?.backgroundStory ?? result?.background_story;
      if (typeof backgroundStory === 'string' && backgroundStory.trim()) {
        setBackground(backgroundStory.trim());
        setBasicAiGenerated(true);
        showMessage(t('createRole.messages.backgroundOptimized'));
        return;
      }
      throw new Error(t('createRole.messages.backgroundEmpty'));
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.backgroundOptimizeFailed')));
    }
    finally {
      setOptimizingBackground(false);
    }
  };

  const handleOptimizeGreeting = async () => {
    if (optimizingBackground || optimizingGreeting || generatingSetting || saving) {
      return;
    }
    setOptimizingGreeting(true);
    try {
      const result = await tsRoleApi.generateRoleSetting({
        roleId: roleId || undefined,
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
        greeting: greeting.trim() || undefined,
        keywords: selectedTags.join(','),
        templateMode: 'greeting_optimize',
      });
      const optimizedGreeting = result?.greeting ?? result?.greeting_text;
      if (typeof optimizedGreeting === 'string' && optimizedGreeting.trim()) {
        setGreeting(optimizedGreeting.trim());
        setBasicAiGenerated(true);
        showMessage(t('createRole.messages.greetingOptimized'));
        return;
      }
      throw new Error(t('createRole.messages.greetingEmpty'));
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.greetingOptimizeFailed')));
    }
    finally {
      setOptimizingGreeting(false);
    }
  };

  const handleGenerateImage = async () => {
    if (generatingImage || saving) {
      return;
    }
    setGeneratingImage(true);
    try {
      const result = await tsRoleApi.generateRoleImage({
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
      });

      if (!result?.imageUrl) {
        throw new Error(t('createRole.messages.imageUrlMissing'));
      }
      setAvatarUrl(result.imageUrl);
      setAvatarNeedsImport(true);
      setAdvancedAiGenerated(true);
      showMessage(t('createRole.messages.imageGenerated'));
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.imageGenerateFailed')));
    }
    finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (generatingVoice || saving) {
      return;
    }
    setGeneratingVoice(true);
    try {
      const result = await tsRoleApi.generateRoleVoice({
        roleId: roleId || undefined,
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
        preferredVoiceName: voiceName || undefined,
        targetTone: toneTendency,
      });
      const voice = result?.voice;
      const resolvedVoiceName = voice?.voiceName || result?.voiceName;
      const resolvedVoiceProfileId = voice?.voiceProfileId ?? result?.voiceProfileId;
      const resolvedProviderVoiceId = voice?.providerVoiceId || result?.providerVoiceId;
      const resolvedPreviewText = voice?.previewText || result?.previewText;
      const resolvedPreviewAudioUrl = voice?.previewAudioUrl || result?.previewAudioUrl;
      const resolvedSpeed = voice?.speed ?? result?.speed ?? 1.0;
      const resolvedPitch = voice?.pitch ?? result?.pitch ?? 0;
      const resolvedVolume = voice?.volume ?? result?.volume ?? 1.0;
      if (resolvedVoiceName) {
        setVoiceName(resolvedVoiceName);
      }
      if (typeof resolvedVoiceProfileId === 'number' && Number.isFinite(resolvedVoiceProfileId)) {
        setVoiceProfileId(resolvedVoiceProfileId);
      }
      if (resolvedProviderVoiceId) {
        setProviderVoiceId(resolvedProviderVoiceId);
      }
      if (resolvedPreviewText) {
        setVoicePreviewText(resolvedPreviewText);
      }
      setVoiceSpeed(roundVoiceParam(resolvedSpeed, 2));
      setVoicePitch(roundVoiceParam(resolvedPitch, 2));
      setVoiceVolume(roundVoiceParam(resolvedVolume, 2));
      if (resolvedPreviewAudioUrl) {
        setVoicePreviewAudioUrl(resolvedPreviewAudioUrl);
      }

      if ((typeof resolvedVoiceProfileId === 'number' && Number.isFinite(resolvedVoiceProfileId)) || resolvedProviderVoiceId) {
        const previewPayload: TsVoiceProfilePreviewPayload = {
          voiceProfileId: typeof resolvedVoiceProfileId === 'number' && Number.isFinite(resolvedVoiceProfileId)
            ? resolvedVoiceProfileId
            : undefined,
          voiceId: resolvedProviderVoiceId || undefined,
          previewText: resolvedPreviewText || t('createRole.defaultVoicePreview'),
          speed: roundVoiceParam(resolvedSpeed, 2),
          pitch: roundVoiceParam(resolvedPitch, 2),
          volume: roundVoiceParam(resolvedVolume, 2),
        };
        void fetchAndCacheVoicePreview(previewPayload).catch((error) => {
          console.warn('warmup voice preview failed', error);
        });
      }
      setAdvancedAiGenerated(true);
      showMessage(t('createRole.messages.voiceGenerated'));
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.voiceGenerateFailed')));
    }
    finally {
      setGeneratingVoice(false);
    }
  };

  const playPreviewAudio = async (audioUrl: string) => {
    const AudioCtor = (globalThis as { Audio?: new (src?: string) => { play: () => Promise<void> } }).Audio;
    if (!AudioCtor) {
      return false;
    }
    const audio = new AudioCtor(audioUrl);
    await audio.play();
    return true;
  };

  const applyPreviewResult = (preview: TsVoiceProfilePreviewResult) => {
    if (typeof preview?.voiceProfileId === 'number' && Number.isFinite(preview.voiceProfileId)) {
      setVoiceProfileId(preview.voiceProfileId);
    }
    if (preview?.providerVoiceId) {
      setProviderVoiceId(preview.providerVoiceId);
    }
    if (preview?.previewText) {
      setVoicePreviewText(preview.previewText);
    }
    if (preview?.previewAudioUrl) {
      setVoicePreviewAudioUrl(preview.previewAudioUrl);
    }
  };

  const fetchAndCacheVoicePreview = async (payload: TsVoiceProfilePreviewPayload) => {
    const cached = getCachedVoicePreview(payload);
    if (cached) {
      applyPreviewResult(cached);
      return cached;
    }
    const preview = await tsVoiceApi.previewVoiceProfile(payload);
    setCachedVoicePreview(payload, preview);
    applyPreviewResult(preview);
    return preview;
  };

  const handlePreviewVoice = async () => {
    if (saving || generatingSetting || generatingImage || generatingVoice || voiceListenPhase !== 'idle') {
      return;
    }
    const previewProfileId = voiceProfileId || undefined;
    const previewProviderVoiceId = providerVoiceId.trim() || undefined;
    if (!previewProfileId && !previewProviderVoiceId) {
      if (voicePreviewAudioUrl) {
        try {
          const played = await playPreviewAudio(voicePreviewAudioUrl);
          if (!played) {
            showMessage(t('createRole.messages.previewUnsupported'));
          }
        }
        catch (error) {
          showMessage(extractErrorMessage(error, t('createRole.messages.previewPlayFailed')));
        }
        return;
      }
      showMessage(t('createRole.messages.generateVoiceFirst'));
      return;
    }

    setVoiceListenPhase('loading');
    try {
      const previewPayload: TsVoiceProfilePreviewPayload = {
        voiceProfileId: previewProfileId,
        voiceId: previewProviderVoiceId,
        previewText: voicePreviewText || t('createRole.defaultVoicePreview'),
        speed: roundVoiceParam(voiceSpeed, 2),
        pitch: roundVoiceParam(voicePitch, 2),
        volume: roundVoiceParam(voiceVolume, 2),
      };
      const preview = await fetchAndCacheVoicePreview(previewPayload);

      const audioUrl = preview?.previewAudioUrl || voicePreviewAudioUrl;
      if (!audioUrl) {
        showMessage(t('createRole.messages.previewUrlMissing'));
        return;
      }
      setVoicePreviewAudioUrl(audioUrl);
      setVoiceListenPhase('playing');
      const played = await playPreviewAudio(audioUrl);
      if (!played) {
        showMessage(t('createRole.messages.previewGeneratedUnsupported'));
      }
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.previewGenerateFailed')));
    }
    finally {
      setVoiceListenPhase('idle');
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handleSmartRecommendTags = () => {
    const next = [...tagOptions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, tagOptions.length));
    setSelectedTags(next);
  };

  const handleAddCustomTag = (tag: string) => {
    if (!tagOptions.includes(tag)) {
      setTagOptions(prev => [...prev, tag]);
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSave = async () => {
    if (saving || generatingSetting || generatingImage || generatingVoice) {
      return;
    }
    if (!name.trim()) {
      showMessage(t('createRole.messages.nameRequired'));
      setActiveTab('basic');
      return;
    }
    if (gender === 'random') {
      showMessage(t('createRole.messages.genderRequired'));
      setActiveTab('basic');
      return;
    }
    if (!background.trim()) {
      showMessage(t('createRole.messages.settingRequired'));
      setActiveTab('basic');
      return;
    }
    if (!avatarUrl.trim()) {
      showMessage(t('createRole.messages.imageRequired'));
      setActiveTab('basic');
      return;
    }
    const hasVoice = !!voiceName.trim()
      || (typeof voiceProfileId === 'number' && Number.isFinite(voiceProfileId))
      || !!providerVoiceId.trim();
    if (!hasVoice) {
      showMessage(t('createRole.messages.voiceRequired'));
      setActiveTab('basic');
      return;
    }
    setSaving(true);
    try {
      let persistedAvatarUrl = avatarUrl.trim();
      if (avatarNeedsImport) {
        const asset = await tsRoleImageApi.importGeneratedImage({
          sourceImageUrl: persistedAvatarUrl,
          sourceType: 'ai_generate',
        });
        if (!asset?.fileUrl?.trim()) {
          throw new Error(t('createRole.messages.imageSaveFailed'));
        }
        persistedAvatarUrl = asset.fileUrl.trim();
        setAvatarUrl(persistedAvatarUrl);
        setAvatarNeedsImport(false);
      }
      const payload = buildSavePayload(persistedAvatarUrl);
      const result = roleId
        ? await tsRoleApi.updateRole({ ...payload, id: roleId })
        : await tsRoleApi.createRole(payload);

      if (result?.id) {
        setRoleId(result.id);
      }
      if (result?.avatarUrl) {
        setAvatarUrl(result.avatarUrl);
      }
      if (result?.voiceName) {
        setVoiceName(result.voiceName);
      }
      showMessage(t('createRole.messages.saved'));
      router.navigate('/pages/create-page');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.saveFailed')));
    }
    finally {
      setSaving(false);
    }
  };

  const leaveCreateRole = () => {
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
    leaveCreateRole();
  };

  const handleSaveDraftAndExit = async () => {
    if (savingDraft) {
      return;
    }
    setSavingDraft(true);
    try {
      const payload = {
        draftType: 'role' as const,
        draftName: name.trim() || t('createRole.untitledDraft'),
        sourceId: roleId || undefined,
        content: {
          activeTab,
          name,
          gender,
          job,
          background,
          greeting,
          voiceName,
          voiceProfileId,
          providerVoiceId,
          voicePreviewText,
          avatarUrl,
          avatarNeedsImport,
          voicePreviewAudioUrl,
          voiceSpeed,
          voicePitch,
          voiceVolume,
          isPublic,
          selectedTags,
          dialogLength,
          interactivity,
          toneTendency,
          dialoguePreview,
          basicAiGenerated,
          advancedAiGenerated,
        },
      };
      if (routeDraftId) {
        await tsDraftApi.updateDraft({ ...payload, id: routeDraftId });
      }
      else {
        await tsDraftApi.createDraft(payload);
      }
      setExitDialogVisible(false);
      leaveCreateRole();
    }
    catch (error) {
      showMessage(extractErrorMessage(error, t('createRole.messages.draftSaveFailed')));
    }
    finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="mx-auto flex size-full max-w-[480px] flex-col bg-black">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onBack={handleBack} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 112 }}>
        <div className="flex flex-col gap-8 px-4 pt-5">
          {activeTab === 'advanced'
            ? (
                <>
                  <PublicStatusSection isPublic={isPublic} onPublicChange={setIsPublic} />
                  {/* <TagsSection
                    tagOptions={tagOptions}
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                    onSmartRecommend={handleSmartRecommendTags}
                    onAddCustomTag={handleAddCustomTag}
                  /> */}
                  <DialogueStyleSection
                    dialogLength={dialogLength}
                    interactivity={interactivity}
                    toneTendency={toneTendency}
                    previewText={dialoguePreview}
                    onDialogLengthChange={setDialogLength}
                    onInteractivityChange={setInteractivity}
                    onToneTendencyChange={setToneTendency}
                    onPreviewTextChange={setDialoguePreview}
                  />
                </>
              )
            : (
                <div className="relative">
                  <BasicInfoSection
                    name={name}
                    gender={gender}
                    job={job}
                    background={background}
                    greeting={greeting}
                    voiceName={voiceName}
                    voiceProfileId={voiceProfileId}
                    providerVoiceId={providerVoiceId}
                    avatarUrl={avatarUrl}
                    onNameChange={setName}
                    onGenderChange={setGender}
                    onJobChange={setJob}
                    onBackgroundChange={setBackground}
                    onGreetingChange={setGreeting}
                    onGenerateSetting={handleGenerateSetting}
                    onOptimizeBackground={handleOptimizeBackground}
                    onOptimizeGreeting={handleOptimizeGreeting}
                    onGenerateImage={handleGenerateImage}
                    onGenerateVoice={handleGenerateVoice}
                    onPreviewVoice={handlePreviewVoice}
                    onSelectFromGallery={() => {
                      router.push('/pages/my-gallery?from=create-role');
                    }}
                    generatingSetting={generatingSetting}
                    optimizingBackground={optimizingBackground}
                    optimizingGreeting={optimizingGreeting}
                    generatingImage={generatingImage}
                    generatingVoice={generatingVoice}
                    previewingVoice={voiceListenPhase !== 'idle'}
                    voiceListenPhase={voiceListenPhase}
                  />

                </div>
              )}
        </div>
      </ScrollView>
      
      <Modal
        visible={generateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGenerateModalVisible(false)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setGenerateModalVisible(false)}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">{t('createRole.generateModal.title')}</h3>
            <div className="text-[14px] leading-relaxed text-[#a1a1aa] flex flex-col gap-2">
              <p>{t('createRole.generateModal.description')}</p>
              <div className="flex items-start gap-1">
                <span className="text-brand-green/90 mt-1">•</span>
                <p>
                  <span className="text-white font-medium">
                    {t('createRole.generateModal.continueTitle')}
                  </span>
                  {t('createRole.generateModal.continueDescription')}
                </p>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[#ff4d4f] mt-1">•</span>
                <p>
                  <span className="text-white font-medium">
                    {t('createRole.generateModal.overwriteTitle')}
                  </span>
                  {t('createRole.generateModal.overwriteDescription')}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-brand-green/90 bg-transparent py-3 text-center text-base font-bold text-brand-green/90 active:bg-white/5"
                onClick={() => {
                  setGenerateModalVisible(false);
                  executeGenerateSetting('single');
                }}
              >
                {t('createRole.generateModal.continue')}
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-[#ff4d4f] py-3 text-center text-base font-bold text-white active:opacity-80"
                onClick={() => {
                  setGenerateModalVisible(false);
                  executeGenerateSetting('full');
                }}
              >
                {t('createRole.generateModal.overwrite')}
              </button>
            </div>
            <button
              onClick={() => setGenerateModalVisible(false)}
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

      <AiDraftExitDialog
        visible={exitDialogVisible}
        saving={savingDraft}
        onContinue={() => setExitDialogVisible(false)}
        onDiscard={() => {
          setExitDialogVisible(false);
          leaveCreateRole();
        }}
        onSaveAndExit={() => void handleSaveDraftAndExit()}
      />

      <SaveButton onSave={handleSave} saving={saving} />
    </div>
  );
}
