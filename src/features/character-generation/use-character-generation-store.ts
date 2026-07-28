import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';

export type CharacterGenerationDraft = {
  promptText: string;
  styleName: string;
  referenceImageUrl?: string;
};

type CharacterGenerationState = {
  draft: CharacterGenerationDraft | null;
  setDraft: (draft: CharacterGenerationDraft) => void;
  clearDraft: () => void;
};

const _useCharacterGenerationStore = create<CharacterGenerationState>(set => ({
  draft: null,
  setDraft: draft => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));

export const useCharacterGenerationStore = createSelectors(_useCharacterGenerationStore);
