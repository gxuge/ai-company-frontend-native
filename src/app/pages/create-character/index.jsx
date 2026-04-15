import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { AiHeader } from '@/components/ai-company/ai-header';
import { AiLoginBtn } from '@/components/ai-company/ai-login-btn';
import { tsRoleApi, tsRoleImageApi } from '@/lib/api';

const asset = m => m?.default ?? m?.uri ?? m;
const imgGeminiGeneratedImageQ33L2Sq33L2Sq33L1 = asset(require('../../../assets/images/create-character/0c1b78aba3aba496b5e541b155d9d26bd13e2bfd.png'));
const imgImage = asset(require('../../../assets/images/create-character/aac0f5e5dcf1334496ad3e147104f67493728acd.png'));
const imgImage1 = asset(require('../../../assets/images/create-character/244b06b1832e393bae722ce260380771822cb841.png'));
const imgImage2 = asset(require('../../../assets/images/create-character/aa360f949995ff506ca968a83424f2e58b7f88fa.png'));
const imgImage3 = asset(require('../../../assets/images/create-character/81b66f15612058314874d559300372dd8b03a8df.png'));

const svgPaths = {
  p22801e00: 'M35.0805 5.53086H31.1521V1.81481C31.1521 0.777777 30.3298 0 29.2336 0C28.1373 0 27.315 0.777777 27.315 1.81481V5.53086H23.3866C22.2904 5.53086 21.4681 6.30864 21.4681 7.34568C21.4681 8.38271 22.2904 9.16048 23.3866 9.16048H27.315V12.8765C27.315 13.9136 28.1373 14.6913 29.2336 14.6913C30.3298 14.6913 31.1521 13.9136 31.1521 12.8765V9.16048H35.0805C36.1768 9.16048 36.999 8.38271 36.999 7.34568C36.999 6.30864 36.1768 5.53086 35.0805 5.53086ZM25.3052 12.8765V11.0617H23.3866C22.2904 11.0617 21.3769 10.6296 20.646 9.93825C19.9151 9.24689 19.4583 8.38271 19.4583 7.34568C19.4583 6.65432 19.6409 6.04937 20.0064 5.53086H3.9274C1.73482 5.53086 -0.000976562 7.17282 -0.000976562 9.16048V31.284C-0.000976562 33.3581 1.73482 35 3.9274 35H27.315C29.4164 35 31.1521 33.3581 31.1521 31.284V16.0741C30.6039 16.3333 29.9644 16.5926 29.2336 16.5926C27.041 16.5061 25.3052 14.8642 25.3052 12.8765ZM25.2138 31.284H5.84593C5.0237 31.284 4.56692 30.4197 5.0237 29.8148L8.9521 24.9753C9.31753 24.4567 10.1397 24.5432 10.5052 25.0618L13.6114 29.4691L18.7274 23.074C19.0928 22.5556 19.9151 22.5556 20.2804 23.074L26.0361 29.8148C26.4929 30.4197 26.0361 31.284 25.2138 31.284Z',
  p2f924600: 'M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z',
  p498d400: 'M23.6508 0C29.2431 0 33 3.92389 33 9.76259V23.2374C33 29.0761 29.2431 33 23.6491 33H9.3492C3.75688 33 0 29.0761 0 23.2374V9.76259C0 3.92389 3.75688 0 9.3492 0H23.6508ZM25.4704 17.4076C23.7017 16.3042 22.3361 17.8537 21.9678 18.3492C21.6127 18.8277 21.3074 19.3556 20.9856 19.8834C20.1991 21.1861 19.2981 22.6879 17.7385 23.5615C15.472 24.8164 13.7514 23.6602 12.5137 22.819C12.0491 22.5057 11.5978 22.2094 11.1481 22.0119C10.0398 21.5334 9.04262 22.0783 7.56261 23.9582C6.78611 24.9407 6.01624 25.9147 5.23641 26.8853C4.77018 27.4659 4.88134 28.3616 5.51018 28.7498C6.514 29.368 7.73849 29.7 9.12226 29.7H23.028C23.8128 29.7 24.5993 29.5927 25.3493 29.3475C27.0383 28.7958 28.379 27.5324 29.0791 25.8636C29.6698 24.4605 29.9569 22.7577 29.4043 21.341C29.2202 20.8711 28.9447 20.4334 28.5582 20.0486C27.5444 19.0423 26.597 18.1023 25.4704 17.4076ZM10.7231 6.6C8.44835 6.6 6.6 8.45085 6.6 10.725C6.6 12.9991 8.44835 14.85 10.7231 14.85C12.9962 14.85 14.8462 12.9991 14.8462 10.725C14.8462 8.45085 12.9962 6.6 10.7231 6.6Z',
  p6e49400: 'M32.5058 12.0484L34.025 8.65074L37.3313 7.13071C38.1356 6.86248 38.1356 5.78952 37.3313 5.43187L34.025 3.91183L32.5058 0.60354C32.1483 -0.20118 31.1654 -0.20118 30.8079 0.60354L29.2887 3.91183L25.8928 5.43187C25.1779 5.78952 25.1779 6.77306 25.8928 7.13071L29.2887 8.65074L30.8079 12.0484C31.0759 12.7638 32.1483 12.7638 32.5058 12.0484ZM17.314 14.9097L14.2757 8.20367C13.6502 6.68365 11.5055 6.68365 10.8799 8.20367L7.84158 14.9097L1.13938 17.9497C-0.379792 18.5756 -0.379792 20.7216 1.13938 21.3474L7.84158 24.3876L10.8799 31.0935C11.5055 32.6136 13.6502 32.6136 14.2757 31.0935L17.314 24.3876L24.0163 21.3474C25.5354 20.7216 25.5354 18.5756 24.0163 17.9497L17.314 14.9097ZM30.8079 27.2488L29.2887 30.6464L25.8928 32.1665C25.1779 32.4347 25.1779 33.5076 25.8928 33.8653L29.2887 35.3853L30.8079 38.6937C31.0759 39.4983 32.1483 39.4983 32.5058 38.6937L34.025 35.3853L37.3313 33.8653C38.1356 33.5076 38.1356 32.5241 37.3313 32.1665L34.025 30.6464L32.5058 27.2488C32.1483 26.5335 31.0759 26.5335 30.8079 27.2488Z',
};

const STYLE_OPTIONS = [
  { image: imgImage, label: '通用', value: '通用' },
  { image: imgImage1, label: '像素艺术', value: '像素艺术' },
  { image: imgImage2, label: '漫画', value: '漫画' },
  { image: imgImage3, label: '厚涂', value: '厚涂' },
];

const PROFILE_NAME_MAX_LENGTH = 24;

function showMessage(message) {
  if (!message) return;
  console.warn(message);
}

function extractErrorMessage(error, fallback) {
  if (error && typeof error === 'object' && 'message' in error && error.message) {
    return String(error.message);
  }
  return fallback;
}

/** 图片预览弹层 */
function ImagePreviewModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <img
        src={src}
        alt="预览"
        style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }}
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          cursor: 'pointer',
          color: '#fff',
          fontSize: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </button>
    </div>
  );
}

/** 顶部"我的图库"按钮 */
function MyGalleryButton() {
  return (
    <div className="mb-4 flex justify-end px-4">
      <button
        onClick={() => router.push('/pages/my-gallery')}
        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#b2b2b2] bg-[rgba(22,22,30,0.6)] px-4 py-2 backdrop-blur-sm transition-transform active:scale-95"
      >
        <svg className="size-5" fill="none" viewBox="0 0 33 33">
          <path d={svgPaths.p498d400} fill="#6B7280" />
        </svg>
        <span className="font-['Inter',sans-serif] text-sm font-medium whitespace-nowrap text-white">
          我的图库
        </span>
      </button>
    </div>
  );
}

/** 主输入卡�?*/
function InputCard({
  value,
  onChange,
  onPickRefImage,
  referenceImageUrl,
  onPreviewRefImage,
  onGenerate,
  generating = false,
  backgroundImage,
}) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const showHint = !focused && value.trim() === '';

  const handleHintClick = () => {
    setFocused(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <div className="mx-4 overflow-hidden rounded-3xl border border-[#b2b2b2] bg-[#16161e]">
      <div className="relative flex flex-col" style={{ minHeight: '320px' }}>
        <div className="absolute inset-0 z-0">
          <img
            alt=""
            className="size-full object-cover object-center"
            src={backgroundImage || imgGeminiGeneratedImageQ33L2Sq33L2Sq33L1}
          />
          <div className="absolute inset-0 bg-[rgba(22,22,30,0.88)]" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col gap-4 p-6">
          <div className="h-2" />

          {showHint
            ? (
                <div
                  className="flex flex-1 cursor-text flex-col items-center justify-center gap-2"
                  onClick={handleHintClick}
                >
                  <h2 className="text-center font-['Noto_Sans_SC',sans-serif] text-xl font-bold text-[#e7e7e7]">
                    输入你想要的形象
                  </h2>
                  <p className="px-2 text-center font-['Noto_Sans_SC',sans-serif] text-sm leading-relaxed text-[rgba(231,231,231,0.6)]">
                    如性别、外貌、性格、身材、衣着以及其他特征
                  </p>
                </div>
              )
            : (
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    className="size-full min-h-[160px] resize-none border-none bg-transparent font-['Noto_Sans_SC',sans-serif] text-sm leading-relaxed text-[rgba(231,231,231,0.85)] placeholder-[rgba(231,231,231,0.3)] outline-none"
                    placeholder="描述你想要的形象..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      if (value.trim() === '') setFocused(false);
                    }}
                  />
                </div>
              )}

          <div className="flex items-center justify-center gap-5 pt-1 pb-2">
            {/* 参考图按钮：已选图片则显示缩略图，可点击预览；未选则显示图标 */}
            <button
              onClick={referenceImageUrl ? onPreviewRefImage : onPickRefImage}
              className="flex w-30 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.45)] bg-[rgba(22,22,30,0.6)] px-5 py-3 backdrop-blur-sm transition-transform active:scale-95 overflow-hidden"
              title={referenceImageUrl ? '点击预览参考图' : '选择参考图'}
            >
              {referenceImageUrl
                ? (
                    <img
                      src={referenceImageUrl}
                      alt="参考图"
                      style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )
                : (
                    <svg className="size-5 shrink-0" fill="none" viewBox="0 0 37 35">
                      <g clipPath="url(#clip0_1_153)">
                        <path d={svgPaths.p22801e00} fill="#6B7280" />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_153">
                          <rect fill="white" height="35" width="37" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
              <span className="font-['Inter',sans-serif] text-sm font-medium whitespace-nowrap text-white">
                参考图
              </span>
            </button>

            <button
              onClick={onGenerate}
              disabled={generating}
              className="flex w-30 items-center justify-center gap-2 rounded-xl border border-[rgba(155,254,3,0.9)] bg-[rgba(22,22,30,0.6)] px-5 py-3 shadow-[0px_0px_15px_0px_rgba(155,254,3,0.2)] transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 38 40">
                <path d={svgPaths.p6e49400} fill="rgba(155,254,3,0.9)" fillOpacity="0.9" />
              </svg>
              <span className="font-['Inter',sans-serif] text-sm font-bold whitespace-nowrap text-[rgba(155,254,3,0.9)]">
                {generating ? '生成�?..' : 'AI 生成'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StyleCard({ image, label, selected = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 flex-col items-center gap-2 ${!selected ? 'opacity-60' : ''} transition-all active:scale-95`}
      style={{ minWidth: '72px' }}
    >
      <div className={`size-[72px] overflow-hidden rounded-2xl ${selected ? 'border-2 border-white' : 'border border-[rgba(255,255,255,0.1)]'}`}>
        <img
          src={image}
          alt={label}
          className="size-full object-cover"
          draggable={false}
        />
      </div>
      <p className={`font-['Noto_Sans_SC',sans-serif] ${selected ? 'font-bold' : 'font-medium'} text-xs ${selected ? 'text-white' : 'text-[rgba(255,255,255,0.8)]'} whitespace-nowrap`}>
        {label}
      </p>
    </button>
  );
}

function StyleSelector({ selectedStyle, onSelectStyle }) {
  return (
    <div className="mx-4 rounded-3xl border-1 border-[#b2b2b2] bg-[#1d1d1d] p-5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-['Noto_Sans_SC',sans-serif] text-base font-bold text-[#b3b3b3]">
          风格
        </h3>
        <button className="rounded-lg border border-[#b2b2b2] bg-[rgba(178,178,178,0.2)] px-3 py-1 transition-transform active:scale-95">
          <span className="font-['Noto_Sans_SC',sans-serif] text-xs font-medium tracking-wide text-[#b3b3b3]">
            更多
          </span>
        </button>
      </div>

      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
      </style>
      {/* eslint-disable better-tailwindcss/no-unknown-classes */}
      <div
        className="hide-scrollbar flex gap-4 overflow-x-auto pb-1"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {STYLE_OPTIONS.map(style => (
          <StyleCard
            key={style.value}
            image={style.image}
            label={style.label}
            selected={selectedStyle === style.value}
            onClick={() => onSelectStyle(style.value)}
          />
        ))}
      </div>
      {/* eslint-enable better-tailwindcss/no-unknown-classes */}
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
function Container() {
  const [promptText, setPromptText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0]?.value || '');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const fileInputRef = useRef(null);

  /** 调起文件系统选单张图�?*/
  const handlePickRefImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setReferenceImageUrl(objectUrl);
    // reset file input so same file can be selected again
    e.target.value = '';
  };

  const handleGenerate = async () => {
    const promptTextTrimmed = promptText.trim();
    if (!promptTextTrimmed && !referenceImageUrl) {
      showMessage('Please enter description or select a reference image');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await tsRoleApi.generateTextByTemplate({
        promptCode: 'role_ai_generate_text',
        promptVersion: 'v1',
        variables: {
          idea_input: promptTextTrimmed || null,
          style_hint: selectedStyle || null,
          keywords: selectedStyle || null,
          reference_image_url: referenceImageUrl || null,
          role_name: null,
          gender: null,
          occupation: null,
          background_story: null,
        },
      });
      const generatedText = generated?.generatedText?.trim();
      if (!generatedText) {
        throw new Error('AI did not return usable text');
      }
      setPromptText(generatedText);
    }
    catch (error) {
      showMessage(extractErrorMessage(error, 'AI generation failed, please retry'));
    }
    finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = async () => {
    const promptTextTrimmed = promptText.trim();
    if (!referenceImageUrl && promptTextTrimmed.length < 15) {
      showMessage('Please upload a reference image or enter at least 15 characters');
      return;
    }

    setIsCreating(true);
    try {
      const generated = await tsRoleImageApi.generateRoleImage({
        backgroundStory: promptTextTrimmed || undefined,
        styleName: selectedStyle || undefined,
        referenceImageUrl: referenceImageUrl || undefined,
      });

      const imageUrl = generated?.imageUrl?.trim();
      if (!imageUrl) {
        throw new Error('Create failed: image URL not returned');
      }
      setGeneratedImageUrl(imageUrl);

      const extJson = JSON.stringify({
        promptCode: generated.promptCode,
        promptVersion: generated.promptVersion,
        snapshotKey: generated.snapshotKey,
        generateRecordId: generated.generateRecordId,
        imagePrompt: generated.imagePrompt,
      });

      await tsRoleImageApi.createRoleImageProfile({
        profileName: (promptTextTrimmed || 'new-profile').slice(0, PROFILE_NAME_MAX_LENGTH),
        promptText: promptTextTrimmed || generated.imagePrompt || '',
        styleName: selectedStyle || undefined,
        selectedImageAssetId: generated.imageAssetId,
        selectedImageUrl: imageUrl,
        sourceType: 'ai_generate',
        isPublic: 1,
        status: 1,
        extJson,
      });
      showMessage('Create character success');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, 'Create character failed, please retry'));
    }
    finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-black">
      <AiHeader title="创建形象" className="h-16 bg-black px-4" />
      <MyGalleryButton />
      <InputCard
        value={promptText}
        onChange={setPromptText}
        onPickRefImage={handlePickRefImage}
        referenceImageUrl={referenceImageUrl}
        onPreviewRefImage={() => setPreviewSrc(referenceImageUrl)}
        onGenerate={handleGenerate}
        generating={isGenerating}
        backgroundImage={generatedImageUrl}
      />
      <div className="mt-4 mb-4">
        <StyleSelector
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
        />
      </div>

      {/* 创建形象按钮 */}
      <div className="px-4 pb-8">
        <AiLoginBtn
          label="创建形象"
          onPress={handleCreate}
          disabled={isCreating}
          customWidth="w-full"
          customHeight="h-14"
          radius="rounded-2xl"
          textClassName="text-base font-bold text-black"
        />
      </div>

      {/* 隐藏的文件选择�?*/}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* 图片预览弹层 */}
      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc('')} />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Container />
    </div>
  );
}
