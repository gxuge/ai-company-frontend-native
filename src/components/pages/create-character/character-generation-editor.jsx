import { useEffect, useRef, useState } from 'react';

import { brandGreenRgba } from '@/components/ui/brand';
import { tsRoleApi, userApi } from '@/lib/api';

const asset = module => module?.default ?? module?.uri ?? module;
const defaultBackground = asset(require('../../../assets/images/create-character/0c1b78aba3aba496b5e541b155d9d26bd13e2bfd.png'));
const generalStyleImage = asset(require('../../../assets/images/create-character/aac0f5e5dcf1334496ad3e147104f67493728acd.png'));
const animeStyleImage = asset(require('../../../assets/images/create-character/244b06b1832e393bae722ce260380771822cb841.png'));
const realisticStyleImage = asset(require('../../../assets/images/create-character/aa360f949995ff506ca968a83424f2e58b7f88fa.png'));
const semiRealisticStyleImage = asset(require('../../../assets/images/create-character/81b66f15612058314874d559300372dd8b03a8df.png'));

const SVG_PATHS = {
  addImage: 'M35.0805 5.53086H31.1521V1.81481C31.1521 0.777777 30.3298 0 29.2336 0C28.1373 0 27.315 0.777777 27.315 1.81481V5.53086H23.3866C22.2904 5.53086 21.4681 6.30864 21.4681 7.34568C21.4681 8.38271 22.2904 9.16048 23.3866 9.16048H27.315V12.8765C27.315 13.9136 28.1373 14.6913 29.2336 14.6913C30.3298 14.6913 31.1521 13.9136 31.1521 12.8765V9.16048H35.0805C36.1768 9.16048 36.999 8.38271 36.999 7.34568C36.999 6.30864 36.1768 5.53086 35.0805 5.53086ZM25.3052 12.8765V11.0617H23.3866C22.2904 11.0617 21.3769 10.6296 20.646 9.93825C19.9151 9.24689 19.4583 8.38271 19.4583 7.34568C19.4583 6.65432 19.6409 6.04937 20.0064 5.53086H3.9274C1.73482 5.53086 -0.000976562 7.17282 -0.000976562 9.16048V31.284C-0.000976562 33.3581 1.73482 35 3.9274 35H27.315C29.4164 35 31.1521 33.3581 31.1521 31.284V16.0741C30.6039 16.3333 29.9644 16.5926 29.2336 16.5926C27.041 16.5061 25.3052 14.8642 25.3052 12.8765ZM25.2138 31.284H5.84593C5.0237 31.284 4.56692 30.4197 5.0237 29.8148L8.9521 24.9753C9.31753 24.4567 10.1397 24.5432 10.5052 25.0618L13.6114 29.4691L18.7274 23.074C19.0928 22.5556 19.9151 22.5556 20.2804 23.074L26.0361 29.8148C26.4929 30.4197 26.0361 31.284 25.2138 31.284Z',
  optimize: 'M32.5058 12.0484L34.025 8.65074L37.3313 7.13071C38.1356 6.86248 38.1356 5.78952 37.3313 5.43187L34.025 3.91183L32.5058 0.60354C32.1483 -0.20118 31.1654 -0.20118 30.8079 0.60354L29.2887 3.91183L25.8928 5.43187C25.1779 5.78952 25.1779 6.77306 25.8928 7.13071L29.2887 8.65074L30.8079 12.0484C31.0759 12.7638 32.1483 12.7638 32.5058 12.0484ZM17.314 14.9097L14.2757 8.20367C13.6502 6.68365 11.5055 6.68365 10.8799 8.20367L7.84158 14.9097L1.13938 17.9497C-0.379792 18.5756 -0.379792 20.7216 1.13938 21.3474L7.84158 24.3876L10.8799 31.0935C11.5055 32.6136 13.6502 32.6136 14.2757 31.0935L17.314 24.3876L24.0163 21.3474C25.5354 20.7216 25.5354 18.5756 24.0163 17.9497L17.314 14.9097ZM30.8079 27.2488L29.2887 30.6464L25.8928 32.1665C25.1779 32.4347 25.1779 33.5076 25.8928 33.8653L29.2887 35.3853L30.8079 38.6937C31.0759 39.4983 32.1483 39.4983 32.5058 38.6937L34.025 35.3853L37.3313 33.8653C38.1356 33.5076 38.1356 32.5241 37.3313 32.1665L34.025 30.6464L32.5058 27.2488C32.1483 26.5335 31.0759 26.5335 30.8079 27.2488Z',
};

const STYLE_OPTIONS = [
  { image: generalStyleImage, label: '通用', value: '通用' },
  { image: animeStyleImage, label: '动漫插画', value: '动漫插画' },
  { image: realisticStyleImage, label: '写实摄影', value: '写实摄影' },
  { image: semiRealisticStyleImage, label: '半写实风', value: '半写实风' },
  { image: generalStyleImage, label: '国风古韵', value: '国风古韵' },
  { image: generalStyleImage, label: '赛博科幻', value: '赛博科幻' },
  { image: generalStyleImage, label: '奇幻史诗', value: '奇幻史诗' },
  { image: animeStyleImage, label: '像素复古', value: '像素复古' },
  { image: generalStyleImage, label: '卡通萌系', value: '卡通萌系' },
  { image: semiRealisticStyleImage, label: '厚涂原画', value: '厚涂原画' },
  { image: generalStyleImage, label: '水彩绘本', value: '水彩绘本' },
  { image: generalStyleImage, label: '日系轻漫', value: '日系轻漫' },
  { image: generalStyleImage, label: '暗黑哥特', value: '暗黑哥特' },
  { image: generalStyleImage, label: '蒸汽朋克', value: '蒸汽朋克' },
  { image: generalStyleImage, label: '梦幻超现实', value: '梦幻超现实' },
];

function extractErrorMessage(error, fallback) {
  return error && typeof error === 'object' && 'message' in error && error.message
    ? String(error.message)
    : fallback;
}

function EditorDialog({
  title,
  message,
  confirmLabel = '我知道了',
  cancelLabel,
  danger = false,
  onConfirm,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[320px] flex-col gap-5 rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        onClick={event => event.stopPropagation()}
      >
        <h3 className="text-center text-lg font-bold tracking-wide text-white">{title}</h3>
        <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">{message}</p>
        <div className="mt-4 flex gap-3">
          {cancelLabel && (
            <button
              type="button"
              className="flex-1 rounded-full border border-[#494949] bg-transparent py-3 text-base font-bold text-[#9ca3af] active:bg-white/5"
              onClick={onClose}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={`flex-1 rounded-full border-2 bg-transparent py-3 text-base font-bold ${
              danger
                ? 'border-[#ff4d4f] text-[#ff4d4f] active:bg-[#ff4d4f]/10'
                : 'border-brand-green text-brand-green active:bg-brand-green/10'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImagePreviewModal({ src, onClose }) {
  if (!src) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <img
        src={src}
        alt="参考图预览"
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
        onClick={event => event.stopPropagation()}
      />
      <button
        type="button"
        aria-label="关闭预览"
        onClick={onClose}
        className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full bg-white/15 text-xl text-white"
      >
        ×
      </button>
    </div>
  );
}

// Keeping the input and reference-image controls together avoids splitting their focus state.
// eslint-disable-next-line max-lines-per-function
function InputCard({
  value,
  onChange,
  referenceImageUrl,
  onPickReference,
  onPreviewReference,
  onDeleteReference,
  onOptimize,
  optimizing,
  disabled,
}) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const showHint = !focused && value.trim() === '';

  return (
    <div className="mx-4 overflow-hidden rounded-3xl border border-[#b2b2b2] bg-[#16161e]">
      <div className="relative flex min-h-[320px] flex-col">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={defaultBackground}
        />
        <div className="absolute inset-0 bg-[rgba(22,22,30,0.88)]" />
        <div className="relative z-10 flex flex-1 flex-col gap-4 p-6">
          <div className="h-2" />
          {showHint
            ? (
                <button
                  type="button"
                  className="flex flex-1 flex-col items-center justify-center gap-2"
                  onClick={() => {
                    setFocused(true);
                    window.setTimeout(() => textareaRef.current?.focus(), 0);
                  }}
                >
                  <span className="text-center text-xl font-bold text-[#e7e7e7]">输入你想要的形象</span>
                  <span className="px-2 text-center text-sm/relaxed text-white/60">
                    如性别、外貌、性格、身材、衣着以及其他特征
                  </span>
                </button>
              )
            : (
                <textarea
                  ref={textareaRef}
                  className="min-h-[160px] flex-1 resize-none border-none bg-transparent text-sm/relaxed text-white/85 outline-none placeholder:text-white/30"
                  placeholder="描述你想要的形象..."
                  value={value}
                  disabled={disabled}
                  onChange={event => onChange(event.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    if (!value.trim()) {
                      setFocused(false);
                    }
                  }}
                />
              )}
          <div className="flex items-center justify-center gap-5 pt-1 pb-2">
            <button
              type="button"
              onClick={onPickReference}
              disabled={disabled}
              className="flex w-30 items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/45 bg-[#16161e]/60 px-5 py-3 backdrop-blur-sm active:scale-95 disabled:opacity-50"
            >
              {referenceImageUrl
                ? (
                    <span className="relative">
                      <img
                        src={referenceImageUrl}
                        alt="参考图"
                        className="size-[22px] rounded-sm object-cover"
                        onClick={(event) => {
                          event.stopPropagation();
                          onPreviewReference();
                        }}
                      />
                      <span
                        className="absolute -top-1.5 -right-1.5 flex size-3.5 items-center justify-center rounded-full border border-white/20 bg-black/80"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteReference();
                        }}
                      >
                        ×
                      </span>
                    </span>
                  )
                : (
                    <svg className="size-5 shrink-0" fill="none" viewBox="0 0 37 35">
                      <path d={SVG_PATHS.addImage} fill="#6B7280" />
                    </svg>
                  )}
              <span className="text-sm font-medium whitespace-nowrap text-white">参考图</span>
            </button>
            <button
              type="button"
              onClick={onOptimize}
              disabled={disabled || optimizing}
              className={`flex w-30 items-center justify-center gap-2 rounded-xl border bg-transparent px-5 py-3 active:scale-95 disabled:cursor-not-allowed ${
                optimizing ? 'border-transparent' : 'border-brand-green'
              }`}
              style={{ animation: optimizing ? 'editor-pulse-glow 2s ease-in-out infinite' : 'none' }}
            >
              <svg className="size-5 shrink-0 text-brand-green" fill="none" viewBox="0 0 38 40">
                <path d={SVG_PATHS.optimize} fill="currentColor" />
              </svg>
              <span className="text-sm font-bold whitespace-nowrap text-brand-green">
                {optimizing ? '润色中...' : 'AI 润色'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StyleSelector({ selectedStyle, onSelectStyle, disabled }) {
  return (
    <div className="mx-4 rounded-3xl border border-[#b2b2b2] bg-[#1d1d1d] p-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#b3b3b3]">风格</h3>
        <span className="rounded-lg border border-[#b2b2b2] bg-[#b2b2b2]/20 px-3 py-1 text-xs font-medium text-[#b3b3b3]">
          更多
        </span>
      </div>
      <div
        className="flex gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {STYLE_OPTIONS.map(style => (
          <button
            key={style.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelectStyle(style.value)}
            className={`flex min-w-[72px] shrink-0 flex-col items-center gap-2 active:scale-95 disabled:cursor-not-allowed ${
              selectedStyle === style.value ? '' : 'opacity-60'
            }`}
          >
            <span className={`size-[72px] overflow-hidden rounded-2xl ${
              selectedStyle === style.value ? 'border-2 border-white' : 'border border-white/10'
            }`}
            >
              <img src={style.image} alt={style.label} className="size-full object-cover" />
            </span>
            <span className={`text-xs whitespace-nowrap ${
              selectedStyle === style.value ? 'font-bold text-white' : 'font-medium text-white/80'
            }`}
            >
              {style.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// The reusable editor owns the complete validation, upload, optimize, and dialog workflow.
// eslint-disable-next-line max-lines-per-function
export function CharacterGenerationEditor({
  initialDraft,
  submitLabel = '创建形象',
  submittingLabel = '创建中...',
  disabled = false,
  onSubmit,
}) {
  const [promptText, setPromptText] = useState(() => initialDraft?.promptText || '');
  const [selectedStyle, setSelectedStyle] = useState(
    () => initialDraft?.styleName || STYLE_OPTIONS[0]?.value || '',
  );
  const [referenceImageUrl, setReferenceImageUrl] = useState(
    () => initialDraft?.referenceImageUrl || '',
  );
  const [referenceImageServerUrl, setReferenceImageServerUrl] = useState(
    () => initialDraft?.referenceImageUrl || '',
  );
  const [referenceImageFile, setReferenceImageFile] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => () => {
    if (referenceImageFile && referenceImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(referenceImageUrl);
    }
  }, [referenceImageFile, referenceImageUrl]);

  const executeOptimize = async () => {
    setDialog(null);
    setOptimizing(true);
    try {
      const result = await tsRoleApi.optimizeImagePrompt({ promptText: promptText.trim() });
      const optimizedPrompt = result?.visualPrompt?.trim();
      if (!optimizedPrompt) {
        throw new Error('AI 未返回可用的提示词');
      }
      setPromptText(optimizedPrompt);
    }
    catch (error) {
      setDialog({
        title: 'AI 润色失败',
        message: extractErrorMessage(error, 'AI 生成失败，请重试'),
      });
    }
    finally {
      setOptimizing(false);
    }
  };

  const handleSubmit = async () => {
    const normalizedPrompt = promptText.trim();
    if (!referenceImageUrl && normalizedPrompt.length < 15) {
      setDialog({ title: '提示', message: '请上传参考图或输入至少 15 个字符。' });
      return;
    }
    setSubmitting(true);
    try {
      let uploadedReferenceImageUrl = referenceImageServerUrl || undefined;
      if (!uploadedReferenceImageUrl && referenceImageFile) {
        uploadedReferenceImageUrl = await userApi.uploadFile(referenceImageFile, 'reference');
        if (!uploadedReferenceImageUrl) {
          throw new Error('参考图上传失败');
        }
        setReferenceImageServerUrl(uploadedReferenceImageUrl);
      }
      await onSubmit({
        promptText: normalizedPrompt,
        styleName: selectedStyle,
        referenceImageUrl: uploadedReferenceImageUrl,
      });
    }
    catch (error) {
      setDialog({
        title: '操作失败',
        message: extractErrorMessage(error, '创建形象失败，请重试'),
      });
    }
    finally {
      setSubmitting(false);
    }
  };

  const controlsDisabled = disabled || submitting;

  return (
    <div className="w-full">
      <style>
        {`
          @keyframes editor-pulse-glow {
            0%, 100% {
              box-shadow: 0 0 5px ${brandGreenRgba(0.2)};
              border-color: ${brandGreenRgba(0.2)};
            }
            50% {
              box-shadow: 0 0 12px 2px ${brandGreenRgba(0.4)};
              border-color: ${brandGreenRgba(0.5)};
            }
          }
        `}
      </style>
      <InputCard
        value={promptText}
        onChange={setPromptText}
        referenceImageUrl={referenceImageUrl}
        onPickReference={() => fileInputRef.current?.click()}
        onPreviewReference={() => setPreviewSrc(referenceImageUrl)}
        onDeleteReference={() => setDialog({
          title: '删除参考图',
          message: '确定要删除当前的参考图吗？',
          confirmLabel: '删除',
          cancelLabel: '取消',
          danger: true,
          action: () => {
            setReferenceImageFile(null);
            setReferenceImageServerUrl('');
            setReferenceImageUrl('');
          },
        })}
        onOptimize={() => {
          if (!promptText.trim()) {
            setDialog({ title: '提示', message: '请先填写内容，以便 AI 更好地为您润色提示词。' });
            return;
          }
          setDialog({
            title: 'AI 润色',
            message: 'AI 将根据您当前的内容优化提示词，是否继续？',
            confirmLabel: '继续',
            cancelLabel: '取消',
            action: executeOptimize,
          });
        }}
        optimizing={optimizing}
        disabled={controlsDisabled}
      />
      <div className="my-4">
        <StyleSelector
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
          disabled={controlsDisabled}
        />
      </div>
      <div className="px-4 pb-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={controlsDisabled}
          className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-brand-green bg-transparent text-base font-bold tracking-widest text-brand-green active:bg-brand-green/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          if (referenceImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(referenceImageUrl);
          }
          setReferenceImageFile(file);
          setReferenceImageServerUrl('');
          setReferenceImageUrl(URL.createObjectURL(file));
          event.target.value = '';
        }}
      />
      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc('')} />
      {dialog && (
        <EditorDialog
          title={dialog.title}
          message={dialog.message}
          confirmLabel={dialog.confirmLabel}
          cancelLabel={dialog.cancelLabel}
          danger={dialog.danger}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            const action = dialog.action;
            setDialog(null);
            action?.();
          }}
        />
      )}
    </div>
  );
}
