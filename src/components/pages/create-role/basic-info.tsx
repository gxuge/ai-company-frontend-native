import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, HelpCircle } from 'lucide-react';
import Svg, { Line } from 'react-native-svg';
import { showMessage } from 'react-native-flash-message';
import { Modal } from 'react-native';
import { AiFormInput } from '@/components/ai-company/ai-form-input';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '@/components/ai-company/ai-generate-btn';
import { AiSelectTab } from '@/components/ai-company/ai-select-tab';
import { SoundGenerating } from './sound-generating';
import { CharacterGenerating } from './character-generating';

const imgPlay = ((m: any) => m?.default ?? m?.uri ?? m)(require('@/assets/images/create-role/play.svg'));
const imgChevronRight = ((m: any) => m?.default ?? m?.uri ?? m)(require('@/assets/images/create-role/chevron_right.svg'));
const imgAddImage = ((m: any) => m?.default ?? m?.uri ?? m)(require('@/assets/images/create-role/add-image.svg'));
const imgWaveGreenTiny = ((m: any) => m?.default ?? m?.uri ?? m)(require('@/assets/images/wave-icon/wave-green-tiny.gif'));

export type Gender = 'male' | 'female' | 'random';

type BasicInfoSectionProps = {
  name: string;
  gender: Gender;
  job: string;
  background: string;
  greeting: string;
  voiceName: string;
  voiceProfileId?: number | null;
  providerVoiceId?: string;
  avatarUrl?: string;
  onNameChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
  onJobChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  onGreetingChange: (value: string) => void;
  onGenerateSetting?: () => void;
  onOptimizeBackground?: () => void | Promise<void>;
  onOptimizeGreeting?: () => void | Promise<void>;
  onGenerateImage?: () => void;
  onGenerateVoice?: () => void;
  onPreviewVoice?: () => void;
  generatingSetting?: boolean;
  optimizingBackground?: boolean;
  optimizingGreeting?: boolean;
  generatingImage?: boolean;
  generatingVoice?: boolean;
  previewingVoice?: boolean;
  voiceListenPhase?: 'idle' | 'loading' | 'playing';
  onSelectFromGallery?: () => void;
};

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div className="flex items-center border-l-2 border-[rgba(var(--color-brand-green-rgb),0.9)] pl-2">
      <span className="text-xs text-white">
        {text}
        {' '}
        {required && <span className="text-[rgba(var(--color-brand-green-rgb),0.9)]">*</span>}
      </span>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export function BasicInfoSection({
  name,
  gender,
  job,
  background,
  greeting,
  voiceName,
  voiceProfileId,
  providerVoiceId = '',
  avatarUrl = '',
  onNameChange,
  onGenderChange,
  onJobChange,
  onBackgroundChange,
  onGreetingChange,
  onGenerateSetting,
  onOptimizeBackground,
  onOptimizeGreeting,
  onGenerateImage,
  onGenerateVoice,
  onPreviewVoice,
  onSelectFromGallery,
  generatingSetting = false,
  optimizingBackground = false,
  optimizingGreeting = false,
  generatingImage = false,
  generatingVoice = false,
  previewingVoice = false,
  voiceListenPhase = 'idle',
}: BasicInfoSectionProps) {
  const { t } = useTranslation();
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const [tooltipType, setTooltipType] = useState<'none' | 'image' | 'setting' | 'voice'>('none');
  const [generateConfirmType, setGenerateConfirmType] = useState<'none' | 'image' | 'voice'>('none');

  const handleGenerateImageClick = () => {
    if (generatingImage) return;

    let missingCount = 0;
    if (gender === 'random') missingCount++;
    if (!job.trim()) missingCount++;
    if (!background.trim()) missingCount++;

    if (missingCount >= 2) {
      setGenerateConfirmType('image');
    } else {
      onGenerateImage?.();
    }
  };

  const handleGenerateVoiceClick = () => {
    if (generatingVoice) return;

    let missingCount = 0;
    if (gender === 'random') missingCount++;
    if (!job.trim()) missingCount++;
    if (!background.trim()) missingCount++;

    if (missingCount >= 2) {
      setGenerateConfirmType('voice');
    } else {
      onGenerateVoice?.();
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="space-y-4">
        <div className="mb-2 flex w-full flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <h2 className="text-sm tracking-wide text-white">
                {t('createRole.basic.image')}
                {' '}
                <span className="text-[rgba(var(--color-brand-green-rgb),0.9)]">*</span>
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTooltipType('image');
                }}
                className="flex items-center justify-center p-1 active:opacity-70"
              >
                <HelpCircle size={14} color="#9ca3af" />
              </button>
            </div>
            {/* <AiGenerateBtn
              loading={generatingImage}
              onClick={handleGenerateImageClick}
            /> */}
          </div>

          <div className="my-2 flex w-full justify-center">
            <button
              onClick={() => {
                if (generatingImage) return;
                if (avatarUrl) {
                  setIsAvatarPreviewOpen(true);
                  return;
                }
                onSelectFromGallery?.();
              }}
              className="relative flex h-[184px] w-[135px] flex-col items-center justify-center overflow-hidden rounded-[15px] border-2 border-dashed border-[rgba(var(--color-brand-green-rgb), 0.5)] bg-black active:opacity-80"
            >
              {generatingImage ? (
                <CharacterGenerating mini />
              ) : avatarUrl ? (
                <img src={avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <div className="mb-[12px] flex size-[34px] items-center justify-center rounded-full border border-[rgba(var(--color-brand-green-rgb), 0.3)]">
                    <img src={imgAddImage} alt="" className="size-[17px] object-contain" />
                  </div>
                  <span className="text-[13.5px] font-medium text-[#a1a1aa]">{t('createRole.basic.addImage')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <h2 className="text-sm tracking-wide text-white">
              {t('createRole.basic.setting')}
              {' '}
              <span className="text-[rgba(var(--color-brand-green-rgb),0.9)]">*</span>
            </h2>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTooltipType('setting');
              }}
              className="flex items-center justify-center p-1 active:opacity-70"
            >
              <HelpCircle size={14} color="#9ca3af" />
            </button>
          </div>
          <AiGenerateBtn
            loading={generatingSetting}
            onClick={() => {
              if (!generatingSetting) {
                onGenerateSetting?.();
              }
            }}
          />
        </div>

        <div className="space-y-4 rounded-xl border border-[#494949] bg-black p-4">
          <div className="space-y-2">
            <FieldLabel text={t('createRole.basic.name')} required />
            <AiFormInput
              placeholder={t('createRole.basic.namePlaceholder')}
              value={name}
              onChangeText={onNameChange}
              isGenerating={generatingSetting}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel text={t('createRole.basic.gender')} />
            <AiFormInput 
              isGenerating={generatingSetting}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden h-[44px]"
            >
              <AiSelectTab
                options={[
                  { label: t('createRole.basic.male'), value: 'male' },
                  { label: t('createRole.basic.female'), value: 'female' },
                  { label: t('createRole.basic.random'), value: 'random' },
                ]}
                value={gender}
                onChange={value => onGenderChange(value as Gender)}
                containerClassName="w-full p-[4px] h-full"
              />
            </AiFormInput>
          </div>

          <div className="space-y-2">
            <FieldLabel text={t('createRole.basic.occupation')} />
            <AiFormInput
              placeholder={t('createRole.basic.occupationPlaceholder')}
              value={job}
              onChangeText={onJobChange}
              isGenerating={generatingSetting}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel text={t('createRole.basic.background')} required={false} />
            <AiFormTextarea
              placeholder={t('createRole.basic.backgroundPlaceholder')}
              value={background}
              isGenerating={generatingSetting}
              className="min-h-[139px] w-full resize-none bg-transparent p-[16px] text-[13.5px] text-white placeholder-[#6b7280] outline-none"
              containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
              onChange={e => onBackgroundChange(e.target.value)}
              showCount={true}
              maxLength={1000}
              optimizeLoading={optimizingBackground}
              optimizeDisabled={!background.trim()}
              onOptimize={() => {
                if (typeof onOptimizeBackground === 'function') {
                  return onOptimizeBackground();
                }
                showMessage({ message: t('createRole.basic.optimizeComingSoon'), type: 'info' });
                return Promise.resolve();
              }}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel text={t('createRole.basic.greeting')} required={false} />
            <AiFormTextarea
              placeholder={t('createRole.basic.greetingPlaceholder')}
              value={greeting}
              isGenerating={generatingSetting}
              className="min-h-[96px] w-full resize-none bg-transparent p-[16px] text-[13.5px] text-white placeholder-[#6b7280] outline-none"
              containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
              onChange={e => onGreetingChange(e.target.value)}
              showCount={true}
              maxLength={300}
              optimizeLoading={optimizingGreeting}
              optimizeDisabled={!greeting.trim()}
              onOptimize={() => {
                if (typeof onOptimizeGreeting === 'function') {
                  return onOptimizeGreeting();
                }
                showMessage({ message: t('createRole.basic.optimizeComingSoon'), type: 'info' });
                return Promise.resolve();
              }}
            />
          </div>

        </div>
      </section>

      {isAvatarPreviewOpen && avatarUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setIsAvatarPreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-[360px] animate-in zoom-in-95 fill-mode-both duration-300"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAvatarPreviewOpen(false)}
              className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:bg-white/20"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>

            <div className="overflow-hidden rounded-[24px] border border-white/10 shadow-[0_0_50px_-12px_rgba(var(--color-brand-green-rgb), 0.3)]">
              <img src={avatarUrl} alt="" className="h-[460px] w-full object-cover" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full border border-[rgba(var(--color-brand-green-rgb),0.9)] bg-brand-green/10 text-sm font-bold text-[rgba(var(--color-brand-green-rgb),0.9)] active:bg-brand-green/20"
                onClick={() => {
                  setIsAvatarPreviewOpen(false);
                  onSelectFromGallery?.();
                }}
              >
                {t('createRole.basic.changeImage')}
              </button>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full bg-white/5 text-sm font-medium text-white/60 active:bg-white/10"
                onClick={() => setIsAvatarPreviewOpen(false)}
              >
                {t('createRole.basic.back')}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <h2 className="text-sm tracking-wide text-white">{t('createRole.basic.voice')}</h2>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTooltipType('voice');
              }}
              className="flex items-center justify-center p-1 active:opacity-70"
            >
              <HelpCircle size={14} color="#9ca3af" />
            </button>
          </div>
          {/* <AiGenerateBtn
            loading={generatingVoice}
            onClick={handleGenerateVoiceClick}
          /> */}
        </div>

        <div className="relative w-full">
          <div
            onClick={() => {
              if (!generatingVoice) {
                const params: Record<string, string> = {};
                if (typeof voiceProfileId === 'number' && Number.isFinite(voiceProfileId)) {
                  params.voiceProfileId = String(voiceProfileId);
                }
                const trimmedProviderVoiceId = providerVoiceId.trim();
                if (trimmedProviderVoiceId) {
                  params.providerVoiceId = trimmedProviderVoiceId;
                }
                const trimmedVoiceName = voiceName.trim();
                if (trimmedVoiceName) {
                  params.voiceName = trimmedVoiceName;
                }
                router.push({
                  pathname: '/pages/sound-edit',
                  params,
                });
              }
            }}
            role="button"
            tabIndex={0}
            className={`flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[6px] border border-[#494949] bg-black px-4 active:opacity-80 ${generatingVoice ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <span className="text-[14px] text-[#6b7280]">{t('createRole.basic.selectVoice')}</span>
            <div className="flex items-center gap-2">
              {voiceName
                ? (
                    <>
                      <span className="text-[14px] text-[rgba(var(--color-brand-green-rgb),0.9)]">{voiceName}</span>
                      <button
                        type="button"
                        disabled={generatingVoice || voiceListenPhase !== 'idle'}
                        className={`flex size-8 items-center justify-center rounded-full bg-[rgba(var(--color-brand-green-rgb), 0.2)] ${generatingVoice || voiceListenPhase !== 'idle' ? 'opacity-60' : ''}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!generatingVoice && voiceListenPhase === 'idle') {
                            onPreviewVoice?.();
                          }
                        }}
                      >
                        {voiceListenPhase === 'loading' ? (
                          <Loader2 className="size-[18px] animate-spin text-[var(--color-brand-green)]" />
                        ) : voiceListenPhase === 'playing' ? (
                          <img src={imgWaveGreenTiny} alt="" className="size-[18px] object-contain" />
                        ) : (
                          <img src={imgPlay} alt="" className="size-[18px] translate-x-[1px] object-contain" />
                        )}
                      </button>
                    </>
                  )
                : null}
              <img src={imgChevronRight} alt="" className="h-[16px] w-[10px] object-contain opacity-40" />
            </div>
          </div>

          {generatingVoice && (
            <div className="absolute inset-0 z-10 flex flex-col justify-center rounded-[6px] overflow-hidden">
              <SoundGenerating mini />
            </div>
          )}
        </div>
      </section>

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
            {tooltipType === 'image' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createRole.basic.help.imageTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createRole.basic.help.imageDescription')}
                </p>
              </>
            )}
            {tooltipType === 'setting' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createRole.basic.help.settingTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createRole.basic.help.settingDescription')}
                </p>
              </>
            )}
            {tooltipType === 'voice' && (
              <>
                <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createRole.basic.help.voiceTitle')}</h3>
                <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
                  {t('createRole.basic.help.voiceDescription')}
                </p>
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        visible={generateConfirmType !== 'none'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGenerateConfirmType('none')}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setGenerateConfirmType('none')}
        >
          <div 
            className="w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-center text-lg font-bold tracking-wide text-white">{t('createRole.basic.confirm.title')}</h3>
            <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
              {t('createRole.basic.confirm.description', {
                target: generateConfirmType === 'image'
                  ? t('createRole.basic.confirm.image')
                  : t('createRole.basic.confirm.voice'),
              })}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="w-1/2 rounded-full border border-[#494949] bg-transparent py-3 text-[14px] font-medium text-[#9ca3af] active:opacity-70"
                onClick={() => setGenerateConfirmType('none')}
              >
                {t('createRole.basic.confirm.improve')}
              </button>
              <button
                type="button"
                className="w-1/2 rounded-full border border-[rgba(var(--color-brand-green-rgb),0.9)] bg-brand-green/10 py-3 text-[14px] font-bold text-[rgba(var(--color-brand-green-rgb),0.9)] active:bg-brand-green/20"
                onClick={() => {
                  const type = generateConfirmType;
                  setGenerateConfirmType('none');
                  if (type === 'image') onGenerateImage?.();
                  if (type === 'voice') onGenerateVoice?.();
                }}
              >
                {t('createRole.basic.confirm.continue')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
