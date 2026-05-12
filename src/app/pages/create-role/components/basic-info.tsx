import { router } from 'expo-router';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Svg, { Line } from 'react-native-svg';
import { AiFormInput } from '@/components/ai-company/ai-form-input';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '@/components/ai-company/ai-generate-btn';
import { AiSelectTab } from '@/components/ai-company/ai-select-tab';
import { SoundGenerating } from './sound-generating';
import { CharacterGenerating } from './character-generating';
import { View, Text, Image, Pressable } from 'react-native';

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
  voiceName: string;
  voiceProfileId?: number | null;
  providerVoiceId?: string;
  voiceSpeed?: number;
  voicePitch?: number;
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
  voiceListenPhase?: 'idle' | 'loading' | 'playing';
  onSelectFromGallery?: () => void;
};

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <View className="flex items-center border-l-2 border-[rgba(155,254,3,0.9)] pl-2">
      <Text className="text-xs text-white">
        {text}
        {' '}
        {required && <Text className="text-[rgba(155,254,3,0.9)]">*</Text>}
      </Text>
    </View>
  );
}

// eslint-disable-next-line max-lines-per-function
export function BasicInfoSection({
  name,
  gender,
  job,
  background,
  voiceName,
  voiceProfileId = null,
  providerVoiceId = '',
  voiceSpeed,
  voicePitch,
  avatarUrl = '',
  onNameChange,
  onGenderChange,
  onJobChange,
  onBackgroundChange,
  onGenerateSetting,
  onGenerateImage,
  onGenerateVoice,
  onPreviewVoice,
  onSelectFromGallery,
  generatingSetting = false,
  generatingImage = false,
  generatingVoice = false,
  previewingVoice = false,
  voiceListenPhase = 'idle',
}: BasicInfoSectionProps) {
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);

  return (
    <View className="flex w-full flex-col gap-8">
      <section className="space-y-4">
        <View className="mb-2 flex w-full flex-col gap-3">
          <View className="flex items-center justify-between px-1">
            <h2 className="text-sm tracking-wide text-white">
              角色形象
              {' '}
              <Text className="text-[rgba(155,254,3,0.9)]">*</Text>
            </h2>
            <AiGenerateBtn
              loading={generatingImage}
              // @ts-expect-error
              onPress={() => {
                if (!generatingImage) {
                  onGenerateImage?.();
                }
              }}
            />
          </View>

          <View className="my-2 flex w-full justify-center">
            <Pressable
              onPress={() => {
                if (generatingImage) return;
                if (avatarUrl) {
                  setIsAvatarPreviewOpen(true);
                  return;
                }
                onSelectFromGallery?.();
              }}
              className="relative flex h-[184px] w-[135px] flex-col items-center justify-center overflow-hidden rounded-[15px] border-2 border-dashed border-[rgba(155,254,3,0.5)] bg-black active:opacity-80"
            >
              {generatingImage ? (
                <CharacterGenerating mini />
              ) : avatarUrl ? (
                // @ts-expect-error
                <Image source={avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <View className="mb-[12px] flex size-[34px] items-center justify-center rounded-full border border-[rgba(155,254,3,0.3)]">
                    <Image source={imgAddImage} alt="" className="size-[17px] object-contain" />
                  </View>
                  <Text className="text-[13.5px] font-medium text-[#a1a1aa]">点击添加形象</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        <View className="flex items-center justify-between px-1">
          <h2 className="text-sm tracking-wide text-white">
            角色设定
            {' '}
            <Text className="text-[rgba(155,254,3,0.9)]">*</Text>
          </h2>
          <AiGenerateBtn
            loading={generatingSetting}
            // @ts-expect-error
            onPress={() => {
              if (!generatingSetting) {
                onGenerateSetting?.();
              }
            }}
          />
        </View>

        <View className="space-y-4 rounded-xl border border-[#494949] bg-black p-4">
          <View className="space-y-2">
            <FieldLabel text="角色名字" required />
            <AiFormInput
              placeholder="输入角色名字"
              value={name}
              onChangeText={onNameChange}
              isGenerating={generatingSetting}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            />
          </View>

          <View className="space-y-2">
            <FieldLabel text="性别" />
            <AiFormInput 
              isGenerating={generatingSetting}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden h-[44px]"
            >
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
          </View>

          <View className="space-y-2">
            <FieldLabel text="职业" />
            <AiFormInput
              placeholder="输入角色职业"
              value={job}
              onChangeText={onJobChange}
              isGenerating={generatingSetting}
              customContainerClass="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
            />
          </View>

          <View className="space-y-4 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <FieldLabel text="角色背景设定" required={false} />
            <AiFormTextarea
              placeholder="输入角色背景故事，可辅助生成人设和剧情。"
              value={background}
              isGenerating={generatingSetting}
              className="min-h-[139px] w-full resize-none bg-transparent p-[16px] text-[13.5px] text-white placeholder-[#6b7280] outline-none"
              containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
              onChange={e => onBackgroundChange(e.target.value)}
            />
          </View>
        </View>
      </section>

      {isAvatarPreviewOpen && avatarUrl && (
        <View
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-xl animate-in fade-in duration-300"
          // @ts-expect-error
          onPress={() => setIsAvatarPreviewOpen(false)}
        >
          <View
            className="relative w-full max-w-[360px] animate-in zoom-in-95 fill-mode-both duration-300"
            // @ts-expect-error
            onPress={e => e.stopPropagation()}
          >
            <Pressable
              onPress={() => setIsAvatarPreviewOpen(false)}
              className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:bg-white/20"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </Pressable>

            <View className="overflow-hidden rounded-[24px] border border-white/10 shadow-[0_0_50px_-12px_rgba(155,254,3,0.3)]">
              <Image source={typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl} alt="" className="h-[460px] w-full object-cover" />
            </View>

            <View className="mt-6 flex flex-col gap-3">
              <Pressable
                // @ts-expect-error
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full bg-[rgba(155,254,3,0.9)] text-sm font-bold text-black active:opacity-90"
                onPress={() => {
                  setIsAvatarPreviewOpen(false);
                  onSelectFromGallery?.();
                }}
              >
                更换形象
              </Pressable>
              <Pressable
                // @ts-expect-error
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full bg-white/5 text-sm font-medium text-white/60 active:bg-white/10"
                onPress={() => setIsAvatarPreviewOpen(false)}
              >
                返回
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <section className="mb-6 space-y-3">
        <View className="flex items-center justify-between px-1">
          <h2 className="text-sm tracking-wide text-white">角色声音</h2>
          <AiGenerateBtn
            loading={generatingVoice}
            // @ts-expect-error
            onPress={() => {
              if (!generatingVoice) {
                onGenerateVoice?.();
              }
            }}
          />
        </View>

        <View className="relative w-full">
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/pages/sound-edit',
                params: {
                  from: 'create-role',
                  voiceProfileId: voiceProfileId ? String(voiceProfileId) : '',
                  voiceId: providerVoiceId || '',
                  voiceName: voiceName || '',
                  speed: typeof voiceSpeed === 'number' ? String(voiceSpeed) : '',
                  pitch: typeof voicePitch === 'number' ? String(voicePitch) : '',
                },
              })}
            disabled={generatingVoice}
            className={`flex h-[44px] w-full items-center justify-between rounded-[6px] border border-[#494949] bg-black px-4 active:opacity-80 ${generatingVoice ? 'opacity-0' : ''}`}
          >
            <Text className="text-[14px] text-[#9ca3af]">选择角色声音</Text>
            <View className="flex items-center gap-2">
              {voiceName
                ? (
                    <>
                      <Text className="text-[14px] text-[rgba(155,254,3,0.9)]">{voiceName}</Text>
                      <Pressable
                        // @ts-expect-error
                        type="button"
                        disabled={generatingVoice || voiceListenPhase !== 'idle'}
                        className={`flex size-8 items-center justify-center rounded-full bg-[rgba(155,254,3,0.2)] ${generatingVoice || voiceListenPhase !== 'idle' ? 'opacity-60' : ''}`}
                        onPress={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!generatingVoice && voiceListenPhase === 'idle') {
                            onPreviewVoice?.();
                          }
                        }}
                      >
                        {voiceListenPhase === 'loading' ? (
                          <Loader2 className="size-[18px] animate-spin text-[#9BFE03]" />
                        ) : voiceListenPhase === 'playing' ? (
                          <Image source={imgWaveGreenTiny} alt="" className="size-[18px] object-contain" />
                        ) : (
                          <Image source={imgPlay} alt="" className="size-[18px] translate-x-[1px] object-contain" />
                        )}
                      </Pressable>
                    </>
                  )
                : null}
              <Image source={imgChevronRight} alt="" className="h-[16px] w-[10px] object-contain opacity-40" />
            </View>
          </Pressable>

          {generatingVoice && (
            <View className="absolute inset-0 z-10 flex flex-col justify-center rounded-[6px] overflow-hidden">
              <SoundGenerating mini />
            </View>
          )}
        </View>
      </section>
    </View>
  );
}
