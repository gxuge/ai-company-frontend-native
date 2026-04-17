import { router } from 'expo-router';
import { useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { AiFormInput } from '@/components/ai-company/ai-form-input';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '@/components/ai-company/ai-generate-btn';
import { AiSelectTab } from '@/components/ai-company/ai-select-tab';
import { SoundGenerating } from './sound-generating';

const imgPlay = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../../assets/images/create-role/play.svg'));
const imgChevronRight = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../../assets/images/create-role/chevron_right.svg'));
const imgAddImage = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../../assets/images/create-role/add-image.svg'));

export type Gender = 'male' | 'female' | 'random';

type BasicInfoSectionProps = {
  name: string;
  gender: Gender;
  job: string;
  background: string;
  voiceName: string;
  avatarUrl?: string;
  onNameChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
  onJobChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  onGenerateSetting?: () => void;
  onGenerateImage?: () => void;
  onGenerateVoice?: () => void;
  onPreviewVoice?: () => void;
  generatingSetting?: boolean;
  generatingImage?: boolean;
  generatingVoice?: boolean;
  previewingVoice?: boolean;
};

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div className="flex items-center border-l-2 border-[rgba(155,254,3,0.9)] pl-2">
      <span className="text-xs text-white">
        {text}
        {' '}
        {required && <span className="text-[rgba(155,254,3,0.9)]">*</span>}
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
  voiceName,
  avatarUrl = '',
  onNameChange,
  onGenderChange,
  onJobChange,
  onBackgroundChange,
  onGenerateSetting,
  onGenerateImage,
  onGenerateVoice,
  onPreviewVoice,
  generatingSetting = false,
  generatingImage = false,
  generatingVoice = false,
  previewingVoice = false,
}: BasicInfoSectionProps) {
  const isAnyGenerating = generatingSetting || generatingImage || generatingVoice;
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="space-y-4">
        <div className="mb-2 flex w-full flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm tracking-wide text-white">
              角色形象
              {' '}
              <span className="text-[rgba(155,254,3,0.9)]">*</span>
            </h2>
            <AiGenerateBtn
              loading={generatingImage}
              onClick={() => {
                if (!isAnyGenerating) {
                  onGenerateImage?.();
                }
              }}
            />
          </div>

          <div className="my-2 flex w-full justify-center">
            <button
              onClick={() => {
                if (avatarUrl) {
                  setIsAvatarPreviewOpen(true);
                  return;
                }
                router.push('/pages/create-character');
              }}
              className="relative flex h-[184px] w-[135px] flex-col items-center justify-center overflow-hidden rounded-[15px] border-2 border-dashed border-[rgba(155,254,3,0.5)] bg-black active:opacity-80"
            >
              {avatarUrl
                ? (
                    <img src={avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )
                : (
                    <>
                      <div className="mb-[12px] flex size-[34px] items-center justify-center rounded-full border border-[rgba(155,254,3,0.3)]">
                        <img src={imgAddImage} alt="" className="size-[17px] object-contain" />
                      </div>
                      <span className="text-[13.5px] font-medium text-[#a1a1aa]">点击添加形象</span>
                    </>
                  )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm tracking-wide text-white">
            角色设定
            {' '}
            <span className="text-[rgba(155,254,3,0.9)]">*</span>
          </h2>
          <AiGenerateBtn
            loading={generatingSetting}
            onClick={() => {
              if (!isAnyGenerating) {
                onGenerateSetting?.();
              }
            }}
          />
        </div>

        <div className="space-y-4 rounded-xl border border-[#494949] bg-black p-4">
          <div className="space-y-2">
            <FieldLabel text="角色名字" required />
            <AiFormInput
              placeholder="输入角色名字"
              value={name}
              onChangeText={onNameChange}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel text="性别" />
            <AiFormInput customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden h-[44px]">
              <AiSelectTab
                options={[
                  { label: '男生', value: 'male' },
                  { label: '女生', value: 'female' },
                  { label: '随机', value: 'random' },
                ]}
                value={gender}
                onChange={value => onGenderChange(value as Gender)}
                containerClassName="w-full p-[4px] h-full"
              />
            </AiFormInput>
          </div>

          <div className="space-y-2">
            <FieldLabel text="职业" />
            <AiFormInput
              placeholder="输入角色职业"
              value={job}
              onChangeText={onJobChange}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            />
          </div>

          <div className="space-y-4 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <FieldLabel text="角色背景设定" required={false} />
            <AiFormTextarea
              placeholder="输入角色背景故事，可辅助生成人设和剧情。"
              value={background}
              className="min-h-[139px] w-full resize-none bg-transparent p-[16px] text-[13.5px] text-white placeholder-[#6b7280] outline-none"
              containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
              onChange={e => onBackgroundChange(e.target.value)}
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

            <div className="overflow-hidden rounded-[24px] border border-white/10 shadow-[0_0_50px_-12px_rgba(155,254,3,0.3)]">
              <img src={avatarUrl} alt="" className="h-[460px] w-full object-cover" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full bg-[rgba(155,254,3,0.9)] text-sm font-bold text-black active:opacity-90"
                onClick={() => {
                  setIsAvatarPreviewOpen(false);
                  router.push('/pages/select-role');
                }}
              >
                更换形象
              </button>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full bg-white/5 text-sm font-medium text-white/60 active:bg-white/10"
                onClick={() => setIsAvatarPreviewOpen(false)}
              >
                返回
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm tracking-wide text-white">角色声音</h2>
          <AiGenerateBtn
            loading={generatingVoice}
            onClick={() => {
              if (!isAnyGenerating) {
                onGenerateVoice?.();
              }
            }}
          />
        </div>

        <div className="relative w-full">
          <button
            onClick={() => router.push('/pages/sound-edit')}
            disabled={generatingVoice}
            className={`flex h-[44px] w-full items-center justify-between rounded-[6px] border border-[#494949] bg-black px-4 active:opacity-80 ${generatingVoice ? 'opacity-0' : ''}`}
          >
            <span className="text-[14px] text-[#9ca3af]">选择角色声音</span>
            <div className="flex items-center gap-2">
              {voiceName
                ? (
                    <>
                      <span className="text-[14px] text-[rgba(155,254,3,0.9)]">{voiceName}</span>
                      <button
                        type="button"
                        disabled={generatingVoice || previewingVoice}
                        className={`flex size-8 items-center justify-center rounded-full bg-[rgba(155,254,3,0.2)] ${generatingVoice || previewingVoice ? 'opacity-60' : ''}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!generatingVoice && !previewingVoice) {
                            onPreviewVoice?.();
                          }
                        }}
                      >
                        <img
                          src={imgPlay}
                          alt=""
                          className={`size-[12px] translate-x-[1px] object-contain ${previewingVoice ? 'animate-pulse' : ''}`}
                        />
                      </button>
                    </>
                  )
                : null}
              <img src={imgChevronRight} alt="" className="h-[16px] w-[10px] object-contain opacity-40" />
            </div>
          </button>

          {generatingVoice && (
            <div className="absolute inset-0 z-10 flex flex-col justify-center rounded-[6px] overflow-hidden">
              <SoundGenerating mini />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
