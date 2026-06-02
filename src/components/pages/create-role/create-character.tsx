import type { Gender } from './basic-info';
import type { TsRoleSavePayload } from '@/lib/api';
import type { TsVoiceProfilePreviewPayload, TsVoiceProfilePreviewResult } from '@/lib/api/ts-voice';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, TextInput } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiHeader } from '@/components/ai-company/ai-header';
import { AiSwitch } from '@/components/ai-company/ai-switch';
import { AiTopTabs } from '@/components/ai-company/ai-top-tabs';
import { tsRoleApi, tsRoleTagApi, tsVoiceApi } from '@/lib/api';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { BasicInfoSection } from './basic-info';

const imgSparkle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-role/sparkle.svg'));
const imgPlusGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-role/plus_gray.svg'));
const imgChevronRightGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-role/chevron_right_green.svg'));

const fontBase = 'font-[\'Noto_Sans_SC\',sans-serif]';
const DEFAULT_VOICE_PREVIEW_TEXT = '你好呀，很高兴认识你。';

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
}: {
  activeTab: 'basic' | 'advanced';
  onTabChange: (tab: 'basic' | 'advanced') => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-black px-4 py-3">
      <AiHeader title="创建角色" className="mb-4" />
      <AiTopTabs
        tabs={[
          { id: 'basic', label: '基础信息' },
          { id: 'advanced', label: '高级设定' },
        ]}
        activeTab={activeTab}
        onTabChange={onTabChange}
        containerClassName="bg-black rounded-full border-[1px] border-[#494949] p-[5px] h-[48px]"
        activeBgClassName="bg-[rgba(155,254,3,0.9)] shadow-[0px_0px_15px_0px_rgba(155,254,3,0.5)] rounded-full"
        activeTextClassName="text-[#3b3f34] font-bold"
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
  return (
    <section className="flex flex-col gap-3">
      <h2 className={`text-base text-white ${fontBase} px-1 font-bold tracking-wide`}>
        公开状态
      </h2>
      <div className="flex items-center justify-between rounded-2xl border border-[#494949] bg-black p-5">
        <div>
          <p className={`text-sm text-white ${fontBase} font-medium`}>是否公开角色</p>
          <p className={`text-xs text-[#6b7280] ${fontBase} mt-1`}>公开后其他用户可以与该角色对话</p>
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
          ? 'border border-black bg-[rgba(155,254,3,0.2)] text-[rgba(155,254,3,0.9)]'
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
        <h2 className={`text-base text-white ${fontBase} font-bold tracking-wide`}>角色标签</h2>
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
            <span className={`text-sm text-[#9ca3af] ${fontBase} font-medium`}>自定义</span>
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
            <h3 className={`mb-4 text-center text-lg font-bold text-white ${fontBase}`}>添加自定义标签</h3>
            <TextInput
              placeholder="请输入标签名称 (最多10个字符)"
              placeholderTextColor="#6b7280"
              maxLength={10}
              value={customTag}
              onChangeText={setCustomTag}
              className={`w-full rounded-xl border border-[#494949] bg-black px-4 py-3 text-sm text-white focus:border-[rgba(155,254,3,0.5)] ${fontBase}`}
              autoFocus
              style={[{ outlineStyle: 'none' } as any]}
            />
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className={`rounded-full border border-[#494949] bg-transparent px-6 py-2 text-sm font-medium text-[#9ca3af] ${fontBase}`}
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className={`rounded-full bg-[rgba(155,254,3,0.9)] px-6 py-2 text-sm font-bold text-[#3b3f34] ${fontBase}`}
              >
                确认
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
          ? 'border border-[rgba(155,254,3,0.9)] bg-[rgba(155,254,3,0.2)] text-[rgba(155,254,3,0.9)]'
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
  const [toneModalVisible, setToneModalVisible] = useState(false);
  const TONE_OPTIONS = ['默认', '轻声细语', '惜字如金', '喋喋不休', '慵懒随意', '咬文嚼字', '干练果断', '粗犷豪放'];

  return (
    <section className="flex flex-col gap-3">
      <h2 className={`text-base text-white ${fontBase} px-1 font-bold tracking-wide`}>
        对话风格设定
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[#494949] bg-black">
        <div className="p-5">
          <div className="mb-4 flex items-center">
            <div className="mr-3 h-5 w-[2.5px] rounded-full bg-[rgba(155,254,3,0.9)]" />
            <span className={`text-sm text-white ${fontBase} font-bold tracking-wide`}>对话风格预览</span>
          </div>
          <AiFormTextarea
            containerClassName="bg-[#111] rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            className={`w-full min-h-[96px] bg-transparent border-0 outline-none resize-none p-[16px] text-[#d1d5db] placeholder-[#6b7280] text-sm ${fontBase} leading-relaxed`}
            placeholder="哼，别以为你这样说我就会高兴。不过既然你这么诚恳，我就勉为其难帮你一次。"
            value={previewText}
            onChange={e => onPreviewTextChange(e.target.value)}
          />
        </div>

        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>对话长度</span>
          <div className="flex gap-2">
            <OptionButton
              label="默认"
              selected={dialogLength === '默认'}
              onClick={() => onDialogLengthChange('默认')}
            />
            <OptionButton
              label="简短"
              selected={dialogLength === '简短'}
              onClick={() => onDialogLengthChange('简短')}
            />
            <OptionButton
              label="详细"
              selected={dialogLength === '详细'}
              onClick={() => onDialogLengthChange('详细')}
            />
          </div>
        </div>

        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        <div 
          className="flex items-center justify-between px-5 py-4 cursor-pointer active:opacity-70"
          onClick={() => setToneModalVisible(true)}
        >
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>语气倾向</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs text-[rgba(155,254,3,0.9)] ${fontBase}`}>{toneTendency}</span>
            <img src={imgChevronRightGreen} alt="" className="h-[10px] w-[6px] object-contain" />
          </div>
        </div>

        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>互动性</span>
          <div className="flex gap-2">
            <OptionButton
              label="默认"
              selected={interactivity === '默认'}
              onClick={() => onInteractivityChange('默认')}
            />
            <OptionButton
              label="主动引导"
              selected={interactivity === '主动引导'}
              onClick={() => onInteractivityChange('主动引导')}
            />
            <OptionButton
              label="被动回应"
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
            <h3 className={`mb-4 text-center text-lg font-bold text-white ${fontBase}`}>选择语气倾向</h3>
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
                      ? 'border border-[rgba(155,254,3,0.9)] bg-[rgba(155,254,3,0.2)] text-[rgba(155,254,3,0.9)]'
                      : 'border border-[#4b5563] text-[#9ca3af]'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
            <button
              onClick={() => setToneModalVisible(false)}
              className={`mt-6 w-full rounded-full border border-[#494949] bg-transparent py-3 text-center text-sm font-medium text-[#9ca3af] ${fontBase}`}
            >
              取消
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
  return (
    <div className="sticky bottom-0 z-10 bg-linear-to-t from-black via-black/95 to-transparent px-4 pt-6 pb-5">
      <button
        onClick={onSave}
        disabled={saving}
        className={`w-full rounded-full bg-[rgba(155,254,3,0.9)] py-4 text-lg text-[#3b3f34] ${fontBase} font-bold tracking-wider ${saving ? 'opacity-60' : ''}`}
      >
        {saving ? '保存中...' : '完成并保存'}
      </button>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export function CreateCharacter() {
  const [generateModalVisible, setGenerateModalVisible] = useState(false);

  const isFocused = useIsFocused();
  const params = useLocalSearchParams<{ selectedImageUrl?: string }>();
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [roleId, setRoleId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('random');
  const [job, setJob] = useState('');
  const [background, setBackground] = useState('');
  const [voiceName, setVoiceName] = useState('');
  const [voiceProfileId, setVoiceProfileId] = useState<number | null>(null);
  const [providerVoiceId, setProviderVoiceId] = useState('');
  const [voicePreviewText, setVoicePreviewText] = useState(DEFAULT_VOICE_PREVIEW_TEXT);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [voicePreviewAudioUrl, setVoicePreviewAudioUrl] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);

  useEffect(() => {
    if (params.selectedImageUrl) {
      setAvatarUrl(params.selectedImageUrl);
    }
  }, [params.selectedImageUrl]);

  useEffect(() => {
    if (!isFocused) {
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
  }, [isFocused]);

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
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingVoice, setGeneratingVoice] = useState(false);
  const [voiceListenPhase, setVoiceListenPhase] = useState<'idle' | 'loading' | 'playing'>('idle');
  const imagePollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imagePollingInFlightRef = useRef(false);
  const imagePollingRecordIdRef = useRef<number | null>(null);

  const stopImagePolling = () => {
    if (imagePollingTimerRef.current) {
      clearInterval(imagePollingTimerRef.current);
      imagePollingTimerRef.current = null;
    }
    imagePollingInFlightRef.current = false;
    imagePollingRecordIdRef.current = null;
  };

  useEffect(() => () => {
    stopImagePolling();
  }, []);

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

  const extJson = (() => {
    const payload: Record<string, unknown> = {
      tags: selectedTags,
    };
    if (voicePreviewAudioUrl) {
      payload.voicePreviewAudioUrl = voicePreviewAudioUrl;
    }
    if (avatarUrl) {
      payload.generatedAvatarUrl = avatarUrl;
    }
    return JSON.stringify(payload);
  })();

  const buildSavePayload = (): TsRoleSavePayload => ({
    roleName: name.trim(),
    gender: normalizeGenderForSave(gender),
    occupation: job.trim() || undefined,
    backgroundStory: background.trim() || undefined,
    avatarUrl: avatarUrl || undefined,
    voiceName: voiceName || undefined,
    isPublic: isPublic ? 1 : 0,
    dialogueLength: dialogLength === '默认' ? (null as any) : dialogLength,
    toneTendency: toneTendency === '默认' ? (null as any) : toneTendency,
    interactionMode: interactivity === '默认' ? (null as any) : interactivity,
    dialoguePreview: dialoguePreview.trim() || undefined,
    extJson,
    basicAiGenerated: basicAiGenerated ? 1 : 0,
    advancedAiGenerated: advancedAiGenerated ? 1 : 0,
    status: 1,
  });

  const ensureRoleDraft = async () => {
    if (roleId) {
      return roleId;
    }
    const roleName = name.trim();
    const draftRoleName = roleName || `未命名角色-${Date.now()}`;
    const created = await tsRoleApi.createRole({
      ...buildSavePayload(),
      roleName: draftRoleName,
    });
    if (!created?.id) {
      throw new Error('创建角色草稿失败，请稍后重试。');
    }
    setRoleId(created.id);
    return created.id;
  };

    const handleGenerateSetting = () => {
    if (generatingSetting || saving) return;
    const isEmpty = !name.trim() && !job.trim() && !background.trim() && gender === 'random';
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
            keywords: selectedTags.join(','),
          })
        : await tsRoleApi.generateRoleSetting({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            keywords: selectedTags.join(','),
          });
      const roleName = result?.roleName ?? result?.role_name;
      const generatedGender = result?.gender;
      const occupation = result?.occupation;
      const backgroundStory = result?.backgroundStory ?? result?.background_story;

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
      setBasicAiGenerated(true);
      showMessage(generateMode === 'full' ? '角色设定已全量生成。' : '角色设定已生成补全。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '生成设定失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
    }
  };

  const handleOptimizeBackground = async () => {
    if (optimizingBackground || generatingSetting || saving) {
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
        keywords: selectedTags.join(','),
        templateMode: 'background_optimize',
      });
      const backgroundStory = result?.backgroundStory ?? result?.background_story;
      if (typeof backgroundStory === 'string' && backgroundStory.trim()) {
        setBackground(backgroundStory);
        setBasicAiGenerated(true);
        showMessage('背景设定已美化。');
        return;
      }
      showMessage('美化完成，但未返回背景内容。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '背景美化失败，请稍后重试。'));
    }
    finally {
      setOptimizingBackground(false);
    }
  };

  const handleGenerateImage = async () => {
    if (generatingImage || saving) {
      return;
    }
    setGeneratingImage(true);
    try {
      const draftRoleId = await ensureRoleDraft();
      const result = await tsRoleApi.generateRoleImage({
        roleId: draftRoleId,
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
        asyncGenerate: true,
      });

      if (result?.generateRecordId) {
        const recordId = result.generateRecordId;
        stopImagePolling();
        imagePollingRecordIdRef.current = recordId;
        showMessage('形象生成任务已提交，后台生成中。');

        const pollImageResult = async () => {
          if (imagePollingInFlightRef.current || imagePollingRecordIdRef.current !== recordId) {
            return;
          }
          imagePollingInFlightRef.current = true;
          try {
            const detail = await tsRoleApi.getImageGenerateRecordDetail(recordId);
            const status = (detail?.generateStatus || '').toLowerCase();
            if (status === 'success') {
              if (!detail?.resultImageUrl) {
                stopImagePolling();
                setGeneratingImage(false);
                showMessage('形象生成完成，但未返回图片地址。');
                return;
              }
              setAvatarUrl(detail.resultImageUrl);
              setAdvancedAiGenerated(true);
              stopImagePolling();
              setGeneratingImage(false);
              showMessage('角色形象生成成功。');
              return;
            }
            if (status === 'failed') {
              stopImagePolling();
              setGeneratingImage(false);
              showMessage(detail?.failReason || '形象生成失败，请稍后重试。');
            }
          }
          catch (error) {
            console.error('Polling individual error', error);
          }
          finally {
            imagePollingInFlightRef.current = false;
          }
        };

        await pollImageResult();
        if (imagePollingRecordIdRef.current === recordId && !imagePollingTimerRef.current) {
          imagePollingTimerRef.current = setInterval(() => {
            void pollImageResult();
          }, 10000);
        }
        return;
      }

      if (!result?.imageUrl) {
        throw new Error('形象生成成功，但未返回图片地址。');
      }
      setAvatarUrl(result.imageUrl);
      setAdvancedAiGenerated(true);
      setGeneratingImage(false);
      showMessage('角色形象生成成功。');
    }
    catch (error) {
      stopImagePolling();
      setGeneratingImage(false);
      showMessage(extractErrorMessage(error, '形象生成失败，请稍后重试。'));
    }
    finally {
      // Fallback to ensure generatingImage is reset if not handled by success/fail paths
      // Note: If polling is active, we don't reset here.
      if (!imagePollingRecordIdRef.current) {
        setGeneratingImage(false);
      }
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
          previewText: resolvedPreviewText || DEFAULT_VOICE_PREVIEW_TEXT,
          speed: roundVoiceParam(resolvedSpeed, 2),
          pitch: roundVoiceParam(resolvedPitch, 2),
          volume: roundVoiceParam(resolvedVolume, 2),
        };
        void fetchAndCacheVoicePreview(previewPayload).catch((error) => {
          console.warn('warmup voice preview failed', error);
        });
      }
      setAdvancedAiGenerated(true);
      showMessage('角色声音生成成功。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '声音生成失败，请稍后重试。'));
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
            showMessage('已获取试听音频，当前环境暂不支持直接播放。');
          }
        }
        catch (error) {
          showMessage(extractErrorMessage(error, '试听播放失败，请稍后重试。'));
        }
        return;
      }
      showMessage('请先点击一键生成声音，再进行试听。');
      return;
    }

    setVoiceListenPhase('loading');
    try {
      const previewPayload: TsVoiceProfilePreviewPayload = {
        voiceProfileId: previewProfileId,
        voiceId: previewProviderVoiceId,
        previewText: voicePreviewText || DEFAULT_VOICE_PREVIEW_TEXT,
        speed: roundVoiceParam(voiceSpeed, 2),
        pitch: roundVoiceParam(voicePitch, 2),
        volume: roundVoiceParam(voiceVolume, 2),
      };
      const preview = await fetchAndCacheVoicePreview(previewPayload);

      const audioUrl = preview?.previewAudioUrl || voicePreviewAudioUrl;
      if (!audioUrl) {
        showMessage('试听生成成功，但未返回音频地址。');
        return;
      }
      setVoicePreviewAudioUrl(audioUrl);
      setVoiceListenPhase('playing');
      const played = await playPreviewAudio(audioUrl);
      if (!played) {
        showMessage('试听生成成功，当前环境暂不支持直接播放。');
      }
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '试听生成失败，请稍后重试。'));
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
      showMessage('请先填写角色名字。');
      setActiveTab('basic');
      return;
    }
    if (gender === 'random') {
      showMessage('请先确认角色性别，不能保存为随机。');
      setActiveTab('basic');
      return;
    }
    if (!background.trim()) {
      showMessage('请先生成或填写角色设定。');
      setActiveTab('basic');
      return;
    }
    if (!avatarUrl.trim()) {
      showMessage('请先生成或上传角色形象。');
      setActiveTab('basic');
      return;
    }
    const hasVoice = !!voiceName.trim()
      || (typeof voiceProfileId === 'number' && Number.isFinite(voiceProfileId))
      || !!providerVoiceId.trim();
    if (!hasVoice) {
      showMessage('请先生成或选择角色声音。');
      setActiveTab('basic');
      return;
    }
    setSaving(true);
    try {
      const payload = buildSavePayload();
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
      showMessage('角色保存成功。');
      router.navigate('/pages/create-page');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '保存失败，请稍后重试。'));
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex size-full max-w-[480px] flex-col bg-black">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 112 }}>
        <div className="flex flex-col gap-8 px-4 pt-5">
          {activeTab === 'advanced'
            ? (
                <>
                  <PublicStatusSection isPublic={isPublic} onPublicChange={setIsPublic} />
                  <TagsSection
                    tagOptions={tagOptions}
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                    onSmartRecommend={handleSmartRecommendTags}
                    onAddCustomTag={handleAddCustomTag}
                  />
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
                    voiceName={voiceName}
                    voiceProfileId={voiceProfileId}
                    providerVoiceId={providerVoiceId}
                    avatarUrl={avatarUrl}
                    onNameChange={setName}
                    onGenderChange={setGender}
                    onJobChange={setJob}
                    onBackgroundChange={setBackground}
                    onGenerateSetting={handleGenerateSetting}
                    onOptimizeBackground={handleOptimizeBackground}
                    onGenerateImage={handleGenerateImage}
                    onGenerateVoice={handleGenerateVoice}
                    onPreviewVoice={handlePreviewVoice}
                    onSelectFromGallery={() => {
                      router.push('/pages/my-gallery?from=create-role');
                    }}
                    generatingSetting={generatingSetting}
                    optimizingBackground={optimizingBackground}
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
            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 一键生成</h3>
            <div className="text-[14px] leading-relaxed text-[#a1a1aa] flex flex-col gap-2">
              <p>检测到您已填写了部分设定。您希望 AI 如何为您生成？</p>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(155,254,3,0.9)] mt-1">•</span>
                <p><span className="text-white font-medium">接着生成：</span>基于您当前的灵感，继续润色和扩写。</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[#ff4d4f] mt-1">•</span>
                <p><span className="text-white font-medium">全量覆盖：</span>清空所有输入，重新随机生成完整角色。</p>
              </div>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(155,254,3,0.9)] bg-transparent py-3 text-center text-base font-bold text-[rgba(155,254,3,0.9)] active:bg-white/5"
                onClick={() => {
                  setGenerateModalVisible(false);
                  executeGenerateSetting('single');
                }}
              >
                接着生成
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-[#ff4d4f] py-3 text-center text-base font-bold text-white active:opacity-80"
                onClick={() => {
                  setGenerateModalVisible(false);
                  executeGenerateSetting('full');
                }}
              >
                全量覆盖
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

      <SaveButton onSave={handleSave} saving={saving} />
    </div>
  );
}
