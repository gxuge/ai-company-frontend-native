import type { Gender } from './basic-info';
import type { TsRoleSavePayload } from '@/lib/api';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { AiHeader } from '@/components/ai-company/ai-header';
import { AiSwitch } from '@/components/ai-company/ai-switch';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiTopTabs } from '@/components/ai-company/ai-top-tabs';
import { tsRoleApi } from '@/lib/api';
import { BasicInfoSection } from './basic-info';

const imgSparkle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../../assets/images/create-role/sparkle.svg'));
const imgPlusGray = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../../assets/images/create-role/plus_gray.svg'));
const imgChevronRightGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../../assets/images/create-role/chevron_right_green.svg'));

const fontBase = 'font-[\'Noto_Sans_SC\',sans-serif]';
const allTags = ['傲娇', '温柔', '极客', '高冷', '毒舌', '腹黑'];

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

function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: 'basic' | 'advanced';
  onTabChange: (tab: 'basic' | 'advanced') => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-[rgba(0,0,0,0.9)] px-4 py-3 backdrop-blur-md">
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
  selectedTags,
  onToggleTag,
}: {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className={`text-base text-white ${fontBase} font-bold tracking-wide`}>角色标签</h2>
        <button className="flex items-center gap-1.5 rounded-full border border-[rgba(155,254,3,0.2)] px-3 py-1.5 shadow-[0px_0px_6px_0px_rgba(155,254,3,0.2),0px_0px_12px_0px_rgba(155,254,3,0.1)]">
          <img src={imgSparkle} alt="" className="size-[14px] shrink-0 object-contain" />
          <span className={`text-sm text-[rgba(155,254,3,0.9)] ${fontBase} font-medium`}>
            智能推荐
          </span>
        </button>
      </div>
      <div className="rounded-2xl border border-[#494949] bg-black p-5">
        <div className="flex flex-wrap gap-3">
          {allTags.map(tag => (
            <TagChip
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onToggle={() => onToggleTag(tag)}
            />
          ))}
          <button className="flex items-center gap-1 rounded-full border border-dashed border-neutral-500 px-4 py-2">
            <img src={imgPlusGray} alt="" className="size-[16px] object-contain" />
            <span className={`text-sm text-[#9ca3af] ${fontBase} font-medium`}>自定义</span>
          </button>
        </div>
      </div>
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
  onDialogLengthChange,
  onInteractivityChange,
}: {
  dialogLength: string;
  interactivity: string;
  toneTendency: string;
  onDialogLengthChange: (value: string) => void;
  onInteractivityChange: (value: string) => void;
}) {
  const [previewText, setPreviewText] = useState('哼，别以为你这样说我就会高兴。不过既然你这么诚恳，我就勉为其难帮你一次。');

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
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
          />
        </div>

        <div className="mx-5 h-px bg-[rgba(155,254,3,0.2)]" />

        <div className="flex items-center justify-between px-5 py-4">
          <span className={`text-sm text-[#d1d5db] ${fontBase} font-medium`}>对话长度</span>
          <div className="flex gap-2">
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

        <div className="flex items-center justify-between px-5 py-4">
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
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('advanced');
  const [roleId, setRoleId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [job, setJob] = useState('');
  const [background, setBackground] = useState('');
  const [voiceName, setVoiceName] = useState('温柔男声');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [voicePreviewAudioUrl, setVoicePreviewAudioUrl] = useState('');

  const [isPublic, setIsPublic] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(['傲娇', '极客']);
  const [dialogLength, setDialogLength] = useState<string>('详细');
  const [interactivity, setInteractivity] = useState<string>('主动引导');
  const [toneTendency] = useState<string>('幽默傲娇');

  const [basicAiGenerated, setBasicAiGenerated] = useState(false);
  const [advancedAiGenerated, setAdvancedAiGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingSetting, setGeneratingSetting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingVoice, setGeneratingVoice] = useState(false);

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
    dialogueLength: dialogLength,
    toneTendency,
    interactionMode: interactivity,
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
    if (!roleName) {
      throw new Error('请先填写角色名字，再执行形象或声音生成。');
    }
    const created = await tsRoleApi.createRole(buildSavePayload());
    if (!created?.id) {
      throw new Error('创建角色草稿失败，请稍后重试。');
    }
    setRoleId(created.id);
    return created.id;
  };

  const handleGenerateSetting = async () => {
    if (generatingSetting || generatingImage || generatingVoice || saving) {
      return;
    }
    setGeneratingSetting(true);
    try {
      const result = await tsRoleApi.generateRoleSetting({
        roleId: roleId || undefined,
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
        keywords: selectedTags.join(','),
      });
      if (result?.roleName) {
        setName(result.roleName);
      }
      if (result?.gender === 'male' || result?.gender === 'female') {
        setGender(result.gender);
      }
      if (result?.occupation) {
        setJob(result.occupation);
      }
      if (result?.backgroundStory) {
        setBackground(result.backgroundStory);
      }
      setBasicAiGenerated(true);
      showMessage('角色设定已生成并回填。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '设定生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
    }
  };

  const handleGenerateImage = async () => {
    if (generatingSetting || generatingImage || generatingVoice || saving) {
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
      });
      if (!result?.imageUrl) {
        throw new Error('形象生成成功，但未返回图片地址。');
      }
      setAvatarUrl(result.imageUrl);
      setAdvancedAiGenerated(true);
      showMessage('角色形象生成成功。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '形象生成失败，请稍后重试。'));
    }
    finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (generatingSetting || generatingImage || generatingVoice || saving) {
      return;
    }
    setGeneratingVoice(true);
    try {
      const draftRoleId = await ensureRoleDraft();
      const result = await tsRoleApi.generateRoleVoice({
        roleId: draftRoleId,
        roleName: name.trim() || undefined,
        gender,
        occupation: job.trim() || undefined,
        backgroundStory: background.trim() || undefined,
        preferredVoiceName: voiceName || undefined,
        targetTone: toneTendency,
      });
      if (result?.voiceName) {
        setVoiceName(result.voiceName);
      }
      if (result?.previewAudioUrl) {
        setVoicePreviewAudioUrl(result.previewAudioUrl);
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

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
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
                  <TagsSection selectedTags={selectedTags} onToggleTag={handleToggleTag} />
                  <DialogueStyleSection
                    dialogLength={dialogLength}
                    interactivity={interactivity}
                    toneTendency={toneTendency}
                    onDialogLengthChange={setDialogLength}
                    onInteractivityChange={setInteractivity}
                  />
                </>
              )
            : (
                <BasicInfoSection
                  name={name}
                  gender={gender}
                  job={job}
                  background={background}
                  voiceName={voiceName}
                  onNameChange={setName}
                  onGenderChange={setGender}
                  onJobChange={setJob}
                  onBackgroundChange={setBackground}
                  onGenerateSetting={handleGenerateSetting}
                  onGenerateImage={handleGenerateImage}
                  onGenerateVoice={handleGenerateVoice}
                  generatingSetting={generatingSetting}
                  generatingImage={generatingImage}
                  generatingVoice={generatingVoice}
                />
              )}
        </div>
      </ScrollView>
      <SaveButton onSave={handleSave} saving={saving} />
    </div>
  );
}
