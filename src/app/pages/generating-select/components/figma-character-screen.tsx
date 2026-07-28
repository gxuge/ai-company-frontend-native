import {
  ChevronUp,
  Download,
  LoaderCircle,
  Pencil,
} from 'lucide-react';
import { useRef, useState } from 'react';

const resolveAsset = (module: any) => module?.default ?? module?.uri ?? module;
const fallbackImage = resolveAsset(require('@/assets/images/generating-select/b20cf81ced9f6ca4c57ee03532ac0c4f2f6408ef.png'));
const addImageIcon = resolveAsset(require('@/assets/images/generating-select/d7c543af9a5ae14dd578336d153ad1d83603de12.png'));

const MAX_IMAGE_COUNT = 12;

const ANIMATION_STYLES = `
  @keyframes generating-select-rise {
    0%, 100% { transform: translateY(8px); opacity: 0.35; }
    50% { transform: translateY(-8px); opacity: 1; }
  }
  @keyframes generating-select-shimmer {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(120%); }
  }
  @keyframes generating-select-image-in {
    from { opacity: 0; transform: scale(1.035); }
    to { opacity: 1; transform: scale(1); }
  }
`;

export type GeneratedImageCandidate = {
  id: string;
  imageUrl?: string;
  status: 'loading' | 'success' | 'failed';
};

type FigmaCharacterScreenProps = {
  description: string;
  styleName: string;
  imageUrl?: string;
  candidates: GeneratedImageCandidate[];
  selectedCandidateId: string;
  isSelectedImageLoading: boolean;
  isGenerating: boolean;
  errorMessage?: string;
  onEdit: () => void;
  onSelectCandidate: (candidateId: string) => void;
  onAddImages: () => void;
  onDownload: () => void;
  onComplete: () => void;
};

type PreviewSectionProps = Pick<
  FigmaCharacterScreenProps,
  'imageUrl' | 'isSelectedImageLoading'
>;

function PreviewSection({
  imageUrl,
  isSelectedImageLoading,
}: PreviewSectionProps) {
  return (
    <section className="absolute inset-0 overflow-hidden">
      <img
        key={imageUrl || 'fallback'}
        src={imageUrl || fallbackImage}
        alt="生成的角色形象"
        className="size-full object-cover"
        style={{
          animation: imageUrl ? 'generating-select-image-in 520ms ease-out both' : undefined,
          filter: imageUrl ? 'none' : 'brightness(0.38) saturate(0.65)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-[#0f0f10]" />
      {isSelectedImageLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/48 backdrop-blur-[2px]">
          <LoaderCircle className="animate-spin text-[#c4a664]" size={58} strokeWidth={1.8} />
          <span className="text-[24px] tracking-[2px] text-[#d5c8b0]">正在生成形象...</span>
          <div
            className="absolute inset-y-0 w-[32%] rotate-12 bg-linear-to-r from-transparent via-white/10 to-transparent"
            style={{ animation: 'generating-select-shimmer 1.8s linear infinite' }}
          />
        </div>
      )}
    </section>
  );
}

type DescriptionEditorProps = Pick<
  FigmaCharacterScreenProps,
  'description' | 'errorMessage' | 'onEdit'
>;

function DescriptionEditor({
  description,
  errorMessage,
  onEdit,
}: DescriptionEditorProps) {
  return (
    <div className="absolute top-[282px] right-[54px] left-[54px]">
      <div className="mb-[18px] flex items-center justify-between">
        <h2 className="text-[23px] font-normal text-[#9c8d7d]">图片描述</h2>
        <button
          type="button"
          aria-label="返回编辑图片描述"
          className="flex size-[44px] items-center justify-center rounded-full text-[#9c8d7d] transition-colors hover:bg-white/5 active:bg-white/10"
          onClick={onEdit}
        >
          <Pencil size={25} />
        </button>
      </div>
      <p
        className="min-h-[108px] text-[23px] leading-[36px] text-[#938575]"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflow: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        {description || '暂无图片描述'}
      </p>
      {errorMessage && (
        <p className="mt-2 truncate text-[19px] text-[#d88181]" title={errorMessage}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

type CandidateImagesProps = Pick<
  FigmaCharacterScreenProps,
  'candidates' | 'selectedCandidateId' | 'isGenerating' | 'onSelectCandidate'
> & {
  onAddImages: () => void;
};

function CandidateImages({
  candidates,
  selectedCandidateId,
  isGenerating,
  onSelectCandidate,
  onAddImages,
}: CandidateImagesProps) {
  return (
    <div
      className="absolute top-[112px] right-[54px] left-[54px] flex justify-start gap-[18px] overflow-x-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      {candidates.map((candidate, index) => (
        <button
          key={candidate.id}
          type="button"
          aria-label={`选择第${index + 1}张形象`}
          onClick={() => onSelectCandidate(candidate.id)}
          className={`h-[144px] w-[104px] shrink-0 overflow-hidden rounded-[18px] border-2 bg-[#242220] transition-transform active:scale-95 ${
            candidate.id === selectedCandidateId ? 'border-[#b28d4b]' : 'border-white/15'
          }`}
        >
          {candidate.status === 'success' && candidate.imageUrl && (
            <img
              src={candidate.imageUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
          {candidate.status === 'loading' && (
            <span className="flex size-full items-center justify-center bg-white/5">
              <LoaderCircle className="animate-spin text-[#c4a664]" size={34} strokeWidth={1.8} />
            </span>
          )}
          {candidate.status === 'failed' && (
            <span className="flex size-full items-center justify-center px-2 text-[16px] text-[#d88181]">
              生成失败
            </span>
          )}
        </button>
      ))}
      {candidates.length < MAX_IMAGE_COUNT && (
        <button
          type="button"
          aria-label="生成四张新的候选形象"
          onClick={onAddImages}
          disabled={isGenerating}
          className="flex h-[144px] w-[104px] shrink-0 items-center justify-center transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src={addImageIcon}
            alt=""
            className="size-[72px] object-contain"
          />
        </button>
      )}
    </div>
  );
}

type ControlPanelProps = FigmaCharacterScreenProps & {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

type DrawerHandleProps = Pick<ControlPanelProps, 'isExpanded' | 'onExpandedChange'>;

function DrawerHandle({
  isExpanded,
  onExpandedChange,
}: DrawerHandleProps) {
  const pointerStartYRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  const finishSwipe = (clientY: number) => {
    if (pointerStartYRef.current === null) {
      return;
    }
    const distance = pointerStartYRef.current - clientY;
    pointerStartYRef.current = null;
    if (Math.abs(distance) < 30) {
      return;
    }
    suppressClickRef.current = true;
    onExpandedChange(distance > 0);
  };

  return (
    <button
      type="button"
      aria-label={isExpanded ? '收起操作' : '展开操作'}
      className="absolute inset-x-0 top-0 z-20 flex h-[38px] touch-none items-center justify-center text-[#8c8884]"
      onPointerDown={(event) => {
        pointerStartYRef.current = event.clientY;
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerUp={event => finishSwipe(event.clientY)}
      onPointerCancel={() => {
        pointerStartYRef.current = null;
      }}
      onClick={() => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        onExpandedChange(!isExpanded);
      }}
      onWheel={(event) => {
        if (event.deltaY > 8) {
          onExpandedChange(true);
        }
        else if (event.deltaY < -8) {
          onExpandedChange(false);
        }
      }}
    >
      <span className="h-[7px] w-[58px] rounded-full bg-[#3d3b39]" />
    </button>
  );
}

function ControlPanel({
  description,
  styleName,
  imageUrl,
  candidates,
  selectedCandidateId,
  isGenerating,
  errorMessage,
  onEdit,
  onSelectCandidate,
  onAddImages,
  onDownload,
  onComplete,
  isExpanded,
  onExpandedChange,
}: ControlPanelProps) {
  return (
    <section
      className="absolute right-[13px] bottom-0 z-10 h-[569px] w-[779px] overflow-hidden rounded-t-[35px] border border-b-0 border-[#292827] bg-[#131214]/98 shadow-[0_-16px_48px_rgba(0,0,0,0.34)]"
      style={{
        transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 38px))',
        transition: 'transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <DrawerHandle
        isExpanded={isExpanded}
        onExpandedChange={onExpandedChange}
      />
      {isExpanded && (
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-[62px] text-center text-[25px] font-bold text-white">
            {styleName}
          </div>
          <CandidateImages
            candidates={candidates}
            selectedCandidateId={selectedCandidateId}
            isGenerating={isGenerating}
            onSelectCandidate={onSelectCandidate}
            onAddImages={onAddImages}
          />
          <DescriptionEditor
            description={description}
            errorMessage={errorMessage}
            onEdit={onEdit}
          />
          <div className="absolute right-[38px] bottom-[18px] left-[38px] flex h-[88px] gap-[18px]">
            <button
              type="button"
              onClick={onDownload}
              disabled={!imageUrl}
              className="flex w-[196px] items-center justify-center gap-3 rounded-[18px] bg-[#1f1f1e] text-[22px] text-[#aaa6a2] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Download size={26} />
              下载图片
            </button>
            <button
              type="button"
              onClick={onComplete}
              disabled={isGenerating || !imageUrl}
              className="flex flex-1 items-center justify-center rounded-[22px] border border-[#967943] bg-[#b28d4b] text-[28px] font-bold text-[#372b16] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

type ExpandPromptProps = Pick<ControlPanelProps, 'isExpanded' | 'onExpandedChange'>;

function ExpandPrompt({
  isExpanded,
  onExpandedChange,
}: ExpandPromptProps) {
  if (isExpanded) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="展开更多操作"
      onClick={() => onExpandedChange(true)}
      className="absolute inset-x-0 bottom-[62px] z-10 flex flex-col items-center gap-2 text-[#aaa6a2]"
    >
      <span className="flex flex-col" style={{ animation: 'generating-select-rise 1.45s ease-in-out infinite' }}>
        <ChevronUp size={28} strokeWidth={1.8} />
        <ChevronUp className="-mt-4" size={28} strokeWidth={1.8} />
      </span>
      <span className="text-[19px]">上滑查看更多操作</span>
    </button>
  );
}

export default function FigmaCharacterScreen(props: FigmaCharacterScreenProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="relative size-full overflow-hidden bg-[#0f0f10] text-white">
      <style>
        {ANIMATION_STYLES}
      </style>
      <PreviewSection
        imageUrl={props.imageUrl}
        isSelectedImageLoading={props.isSelectedImageLoading}
      />
      <ExpandPrompt
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
      />
      <ControlPanel
        {...props}
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
      />
    </div>
  );
}
