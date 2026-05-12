import type React from 'react';
import type { TsStoryChapter } from '@/lib/api';

export type StoryDetailModalProps = {
  onClose?: () => void;
  storyTitle?: string;
  storySetting?: string;
  storyBackground?: string;
  chapters?: TsStoryChapter[];
  loading?: boolean;
  loadError?: string | null;
};

declare const StoryDetailModal: React.FC<StoryDetailModalProps>;

export default StoryDetailModal;
