import type { GeneratedImageCandidate } from './components/figma-character-screen';
import type { CharacterGenerationDraft } from '@/features/character-generation/use-character-generation-store';

import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AiHeader } from '@/components/ai-company/ai-header';
import { CharacterGenerationEditor } from '@/components/pages/create-character/character-generation-editor';
import { useCharacterGenerationStore } from '@/features/character-generation/use-character-generation-store';
import { tsRoleImageApi } from '@/lib/api';
import { translate } from '@/lib/i18n/utils';

import FigmaCharacterScreen from './components/figma-character-screen';

const DESIGN_WIDTH = 810;
const DESIGN_HEIGHT = 1439;
const IMAGE_BATCH_SIZE = 4;
const MAX_IMAGE_COUNT = 12;

function GeneratingSelectHeader({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-x-0 top-0 z-30">
      <AiHeader
        title={t('generatingSelect.title')}
        className="h-16 bg-black/70 px-4 backdrop-blur-md"
        onBack={onBack}
      />
    </div>
  );
}

function CharacterEditorSheet({
  draft,
  isGenerating,
  onClose,
  onApply,
}: {
  draft: CharacterGenerationDraft;
  isGenerating: boolean;
  onClose: () => void;
  onApply: (nextDraft: CharacterGenerationDraft) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="absolute inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92%] w-full overflow-y-auto rounded-t-[28px] border-t border-white/15 bg-black pt-3 shadow-[0_-20px_60px_rgba(0,0,0,0.55)]"
        style={{ animation: 'character-editor-sheet-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both' }}
        onClick={event => event.stopPropagation()}
      >
        <style>
          {`
            @keyframes character-editor-sheet-in {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}
        </style>
        <div className="sticky top-0 z-10 mb-4 bg-black/95 px-4 pb-3 backdrop-blur-md">
          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/25" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t('generatingSelect.edit')}</h2>
            <button
              type="button"
              aria-label={t('generatingSelect.closeEdit')}
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xl text-white"
            >
              ×
            </button>
          </div>
        </div>
        <CharacterGenerationEditor
          initialDraft={draft}
          submitLabel={t('generatingSelect.apply')}
          submittingLabel={t('generatingSelect.applying')}
          disabled={isGenerating}
          onSubmit={onApply}
        />
      </div>
    </div>
  );
}

type GeneratedImagesOptions = {
  styleName: string;
  referenceImageUrl?: string;
};

function getGenerationErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : translate('generatingSelect.errors.generate');
}

let candidateSequence = 0;

function createLoadingCandidates(count: number): GeneratedImageCandidate[] {
  return Array.from({ length: count }, () => ({
    id: `candidate-${Date.now()}-${candidateSequence++}`,
    status: 'loading',
  }));
}

async function downloadImage(imageUrl: string) {
  if (!imageUrl) {
    return;
  }
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(translate('generatingSelect.errors.download'));
    }
    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = translate('generatingSelect.downloadName', { timestamp: Date.now() });
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
  catch {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }
}

// The hook keeps one generation batch's state transitions together.
// eslint-disable-next-line max-lines-per-function
function useGeneratedImages({
  styleName,
  referenceImageUrl,
}: GeneratedImagesOptions) {
  const [candidates, setCandidates] = useState<GeneratedImageCandidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const generationInProgressRef = useRef(false);
  const selectedCandidateIdRef = useRef('');

  const requestImage = useCallback(async (description: string) => {
    const result = await tsRoleImageApi.generateRoleImage({
      backgroundStory: description,
      styleName,
      referenceImageUrl,
    });
    const imageUrl = result?.imageUrl?.trim();
    if (!imageUrl) {
      throw new Error(translate('generatingSelect.errors.missingUrl'));
    }
    return imageUrl;
  }, [referenceImageUrl, styleName]);

  const generateBatch = useCallback(async (description: string, count: number) => {
    const normalizedDescription = description.trim();
    if (!normalizedDescription || count <= 0 || generationInProgressRef.current) {
      if (!normalizedDescription) {
        setErrorMessage(translate('generatingSelect.errors.emptyDescription'));
      }
      return;
    }
    const loadingCandidates = createLoadingCandidates(count);
    setCandidates(current => [...current, ...loadingCandidates]);
    if (!selectedCandidateIdRef.current && loadingCandidates[0]) {
      selectedCandidateIdRef.current = loadingCandidates[0].id;
      setSelectedCandidateId(loadingCandidates[0].id);
    }
    generationInProgressRef.current = true;
    setIsGenerating(true);
    setErrorMessage('');
    const results = await Promise.allSettled(loadingCandidates.map(async (candidate) => {
      try {
        const imageUrl = await requestImage(normalizedDescription);
        setCandidates(current => current.map(item => (
          item.id === candidate.id
            ? { ...item, imageUrl, status: 'success' }
            : item
        )));
        return imageUrl;
      }
      catch (error) {
        setCandidates(current => current.map(item => (
          item.id === candidate.id
            ? { ...item, status: 'failed' }
            : item
        )));
        throw error;
      }
    }));
    const successfulCount = results.filter(result => result.status === 'fulfilled').length;
    if (!successfulCount) {
      const firstFailure = results.find(result => result.status === 'rejected');
      setErrorMessage(getGenerationErrorMessage(firstFailure?.reason));
    }
    generationInProgressRef.current = false;
    setIsGenerating(false);
  }, [requestImage]);

  const generateInitialImages = useCallback(async (description: string) => {
    await generateBatch(description, IMAGE_BATCH_SIZE);
  }, [generateBatch]);

  const remainingCount = MAX_IMAGE_COUNT - candidates.length;

  const generateMoreImages = useCallback(async (description: string) => {
    await generateBatch(
      description,
      Math.min(IMAGE_BATCH_SIZE, remainingCount),
    );
  }, [generateBatch, remainingCount]);

  const restartImages = useCallback(async (description: string) => {
    if (generationInProgressRef.current) {
      return;
    }
    setCandidates([]);
    setSelectedCandidateId('');
    selectedCandidateIdRef.current = '';
    setErrorMessage('');
    await generateBatch(description, IMAGE_BATCH_SIZE);
  }, [generateBatch]);

  const selectCandidate = useCallback((candidateId: string) => {
    selectedCandidateIdRef.current = candidateId;
    setSelectedCandidateId(candidateId);
  }, []);

  const selectedCandidate = candidates.find(candidate => candidate.id === selectedCandidateId);
  const selectedImageUrl = selectedCandidate?.status === 'success'
    ? selectedCandidate.imageUrl || ''
    : '';

  return {
    candidates,
    selectedCandidateId,
    selectedImageUrl,
    isSelectedImageLoading: selectedCandidate?.status === 'loading',
    isSelectedImageFailed: selectedCandidate?.status === 'failed',
    isGenerating,
    errorMessage,
    generateInitialImages,
    generateMoreImages,
    restartImages,
    selectCandidate,
  };
}

// The page coordinates scaling, generation, selection, and editor-sheet state.
// eslint-disable-next-line max-lines-per-function
export default function GeneratingSelectPage() {
  const { t } = useTranslation();
  const draft = useCharacterGenerationStore.use.draft();
  const setDraft = useCharacterGenerationStore.use.setDraft();
  const clearDraft = useCharacterGenerationStore.use.clearDraft();
  const containerRef = useRef<HTMLDivElement>(null);
  const generationStartedRef = useRef(false);
  const pendingRestartRef = useRef(false);
  const [scale, setScale] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const description = draft?.promptText.trim() || '';
  const styleName = draft?.styleName.trim() || '通用';
  const styleKeyMap: Record<string, string> = {
    通用: 'general',
    动漫插画: 'anime',
    写实摄影: 'realistic',
    半写实风: 'semiRealistic',
    国风古韵: 'chinese',
    赛博科幻: 'cyber',
    奇幻史诗: 'fantasy',
    像素复古: 'pixel',
    卡通萌系: 'cute',
    厚涂原画: 'painted',
    水彩绘本: 'watercolor',
    日系轻漫: 'manga',
    暗黑哥特: 'gothic',
    蒸汽朋克: 'steampunk',
    梦幻超现实: 'surreal',
  };
  const localizedStyleName = styleKeyMap[styleName]
    ? t(`createCharacter.styles.${styleKeyMap[styleName]}` as any)
    : styleName;
  const referenceImageUrl = draft?.referenceImageUrl?.trim() || undefined;
  const {
    candidates,
    selectedCandidateId,
    selectedImageUrl,
    isSelectedImageLoading,
    isSelectedImageFailed,
    isGenerating,
    errorMessage,
    generateInitialImages,
    generateMoreImages,
    restartImages,
    selectCandidate,
  } = useGeneratedImages({ styleName, referenceImageUrl });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateScale = () => {
      const { clientWidth, clientHeight } = element;
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setScale(Math.min(clientWidth / DESIGN_WIDTH, clientHeight / DESIGN_HEIGHT));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (generationStartedRef.current) {
      return;
    }
    generationStartedRef.current = true;

    if (!draft) {
      router.replace('/pages/create-character');
      return;
    }
    void generateInitialImages(draft.promptText);
  }, [draft, generateInitialImages]);

  useEffect(() => {
    if (!pendingRestartRef.current || !draft) {
      return;
    }
    pendingRestartRef.current = false;
    void restartImages(draft.promptText);
  }, [draft, restartImages]);

  const handleComplete = async () => {
    if (!selectedImageUrl || isSaving) {
      return;
    }
    setIsSaving(true);
    setSaveErrorMessage('');
    try {
      await tsRoleImageApi.importGeneratedImage({
        sourceImageUrl: selectedImageUrl,
        sourceType: 'ai_generate',
      });
      clearDraft();
      router.replace('/pages/my-gallery');
    }
    catch (error) {
      setSaveErrorMessage(getGenerationErrorMessage(error));
    }
    finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex size-full items-center justify-center overflow-hidden bg-[#0f0f10]"
    >
      <GeneratingSelectHeader onBack={() => router.back()} />
      <div
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
      >
        <FigmaCharacterScreen
          description={description}
          styleName={localizedStyleName}
          imageUrl={selectedImageUrl}
          candidates={candidates}
          selectedCandidateId={selectedCandidateId}
          isSelectedImageLoading={isSelectedImageLoading}
          isSelectedImageFailed={isSelectedImageFailed}
          isGenerating={isGenerating || isSaving}
          isEditorOpen={isEditorOpen}
          errorMessage={saveErrorMessage || errorMessage}
          onEdit={() => setIsEditorOpen(true)}
          onSelectCandidate={selectCandidate}
          onAddImages={() => generateMoreImages(description)}
          onDownload={() => downloadImage(selectedImageUrl)}
          onComplete={() => void handleComplete()}
        />
      </div>
      {isEditorOpen && draft && (
        <CharacterEditorSheet
          draft={draft}
          isGenerating={isGenerating}
          onClose={() => setIsEditorOpen(false)}
          onApply={(nextDraft) => {
            pendingRestartRef.current = true;
            setDraft(nextDraft);
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
}
