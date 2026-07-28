import type { GeneratedImageCandidate } from './components/figma-character-screen';

import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AiHeader } from '@/components/ai-company/ai-header';
import { useCharacterGenerationStore } from '@/features/character-generation/use-character-generation-store';
import { tsRoleImageApi } from '@/lib/api';

import FigmaCharacterScreen from './components/figma-character-screen';

const DESIGN_WIDTH = 810;
const DESIGN_HEIGHT = 1439;
const IMAGE_BATCH_SIZE = 4;
const MAX_IMAGE_COUNT = 12;

function GeneratingSelectHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30">
      <AiHeader
        title="形象生成"
        className="h-16 bg-black/70 px-4 backdrop-blur-md"
        onBack={onBack}
      />
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
    : '形象生成失败，请稍后重试';
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
      throw new Error('图片下载失败');
    }
    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `形象-${Date.now()}.png`;
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
      throw new Error('生成失败：未返回图片地址');
    }
    return imageUrl;
  }, [referenceImageUrl, styleName]);

  const generateBatch = useCallback(async (description: string, count: number) => {
    const normalizedDescription = description.trim();
    if (!normalizedDescription || count <= 0 || generationInProgressRef.current) {
      if (!normalizedDescription) {
        setErrorMessage('图片描述不能为空');
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
    isGenerating,
    errorMessage,
    generateInitialImages,
    generateMoreImages,
    selectCandidate,
  };
}

export default function GeneratingSelectPage() {
  const draft = useCharacterGenerationStore.use.draft();
  const clearDraft = useCharacterGenerationStore.use.clearDraft();
  const containerRef = useRef<HTMLDivElement>(null);
  const generationStartedRef = useRef(false);
  const [scale, setScale] = useState(1);
  const description = draft?.promptText.trim() || '';
  const styleName = draft?.styleName.trim() || '通用';
  const referenceImageUrl = draft?.referenceImageUrl?.trim() || undefined;
  const {
    candidates,
    selectedCandidateId,
    selectedImageUrl,
    isSelectedImageLoading,
    isGenerating,
    errorMessage,
    generateInitialImages,
    generateMoreImages,
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

  const handleComplete = () => {
    clearDraft();
    router.replace('/pages/my-gallery');
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
          styleName={styleName}
          imageUrl={selectedImageUrl}
          candidates={candidates}
          selectedCandidateId={selectedCandidateId}
          isSelectedImageLoading={isSelectedImageLoading}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          onEdit={() => router.back()}
          onSelectCandidate={selectCandidate}
          onAddImages={() => generateMoreImages(description)}
          onDownload={() => downloadImage(selectedImageUrl)}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
