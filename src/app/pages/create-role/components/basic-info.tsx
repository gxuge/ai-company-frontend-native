import { router } from 'expo-router';
import { AiFormInput } from '@/components/ai-company/ai-form-input';
import { AiFormTextarea } from '@/components/ai-company/ai-form-textarea';
import { AiGenerateBtn } from '@/components/ai-company/ai-generate-btn';
import { AiSelectTab } from '@/components/ai-company/ai-select-tab';

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
  onNameChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
  onJobChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  onGenerateSetting?: () => void;
  onGenerateImage?: () => void;
  onGenerateVoice?: () => void;
  generatingSetting?: boolean;
  generatingImage?: boolean;
  generatingVoice?: boolean;
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
  onNameChange,
  onGenderChange,
  onJobChange,
  onBackgroundChange,
  onGenerateSetting,
  onGenerateImage,
  onGenerateVoice,
  generatingSetting = false,
  generatingImage = false,
  generatingVoice = false,
}: BasicInfoSectionProps) {
  const isAnyGenerating = generatingSetting || generatingImage || generatingVoice;

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
              text={generatingImage ? '生成中...' : '一键生成'}
              onClick={() => {
                if (!isAnyGenerating) {
                  onGenerateImage?.();
                }
              }}
              className={isAnyGenerating ? 'opacity-60' : ''}
            />
          </div>

          <div className="my-2 flex w-full justify-center">
            <button
              onClick={() => router.push('/pages/create-character')}
              className="flex h-[184px] w-[135px] flex-col items-center justify-center rounded-[15px] border-2 border-dashed border-[rgba(155,254,3,0.5)] bg-black active:opacity-80"
            >
              <div className="mb-[12px] flex size-[34px] items-center justify-center rounded-full border border-[rgba(155,254,3,0.3)]">
                <img src={imgAddImage} alt="" className="size-[17px] object-contain" />
              </div>
              <span className="text-[13.5px] font-medium text-[#a1a1aa]">点击添加形象</span>
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
            text={generatingSetting ? '生成中...' : '一键生成'}
            onClick={() => {
              if (!isAnyGenerating) {
                onGenerateSetting?.();
              }
            }}
            className={isAnyGenerating ? 'opacity-60' : ''}
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

      <section className="mb-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm tracking-wide text-white">角色声音</h2>
          <AiGenerateBtn
            text={generatingVoice ? '生成中...' : '一键生成'}
            onClick={() => {
              if (!isAnyGenerating) {
                onGenerateVoice?.();
              }
            }}
            className={isAnyGenerating ? 'opacity-60' : ''}
          />
        </div>

        <button className="flex w-full items-center justify-between rounded-xl border border-[#494949] bg-black p-3">
          <span className="text-xs text-[#9ca3af]">选择角色声音</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[rgba(155,254,3,0.9)]">{voiceName || '未选择'}</span>
            <div className="flex size-8 items-center justify-center rounded-full bg-[rgba(155,254,3,0.2)]">
              <img src={imgPlay} alt="" className="size-[18px] object-contain" />
            </div>
            <img src={imgChevronRight} alt="" className="h-[16px] w-[10px] object-contain" />
          </div>
        </button>
      </section>
    </div>
  );
}
