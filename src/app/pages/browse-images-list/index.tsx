import { useEffect, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type {
  TsRoleImageProfile,
  TsRoleImageProfilePublic,
  TsStory,
  TsStoryPublic,
} from '@/lib/api';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import { tsRoleImageApi, tsStoryApi } from '@/lib/api';
import { SearchBar } from './components/SearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { StoryGrid } from './components/StoryGrid';
import type { StoryGridItem } from './components/StoryGrid';
import { ImageCard } from './components/ImageCard';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';
import { AiEmpty } from '@/components/ai-company/ai-empty';
import { AiSkeleton } from '@/components/ai-company/ai-skeleton';

type TabValue = 'story' | 'character';

type CharacterCardItem = {
  id: string;
  username: string;
  author: string;
  views: string;
  imageUrl?: string;
  authorAvatarUrl?: string;
};

type PageState<T> = {
  items: T[];
  pageNo: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
};

const PAGE_SIZE = 24;

const FALLBACK_CHARACTER_CARDS: CharacterCardItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `fallback-${index}`,
  username: '@user',
  author: '--',
  views: '--',
}));

const TAB_OPTIONS = [
  { label: '故事', value: 'story' as TabValue },
  { label: '角色', value: 'character' as TabValue },
];

function buildInitialState<T>(): PageState<T> {
  return {
    items: [],
    pageNo: 1,
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: null,
  };
}

function toDisplayCount(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return '--';
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}w`;
  }
  return String(value);
}

function normalizeText(value: unknown, fallback: string) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return fallback;
}

function resolveStoryModeByCategory(index: number) {
  const map: Record<number, string> = {
    3: '2D',
    4: 'Urban',
    5: 'Ancient',
    6: 'Sci-Fi',
  };
  return map[index];
}

function resolveStyleByCategory(index: number) {
  const map: Record<number, string> = {
    3: '2D',
    4: 'Urban',
    5: 'Ancient',
    6: 'Sci-Fi',
  };
  return map[index];
}

function isNearBottom(nativeEvent: NativeScrollEvent) {
  const paddingToBottom = 160;
  return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y
    >= nativeEvent.contentSize.height - paddingToBottom;
}

function computeHasMore(params: {
  pageNo: number;
  pageSize: number;
  total?: number;
  pages?: number;
  mergedLength: number;
  latestBatchLength: number;
}) {
  const {
    pageNo,
    pageSize,
    total,
    pages,
    mergedLength,
    latestBatchLength,
  } = params;

  if (typeof pages === 'number' && Number.isFinite(pages) && pages > 0) {
    return pageNo < pages;
  }
  if (typeof total === 'number' && Number.isFinite(total) && total >= 0) {
    return mergedLength < total;
  }
  return latestBatchLength >= pageSize;
}

export default function BrowseImagesList() {
  const [activeTab, setActiveTab] = useState<TabValue>('story');
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [storyState, setStoryState] = useState<PageState<StoryGridItem>>(buildInitialState);
  const [characterState, setCharacterState] = useState<PageState<CharacterCardItem>>(buildInitialState);

  const requestSeqRef = useRef(0);

  const fetchStories = async (pageNo: number, append: boolean, seq: number) => {
    setStoryState(prev => ({
      ...prev,
      error: null,
      loading: append ? prev.loading : true,
      loadingMore: append,
    }));

    const params = {
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: searchKeyword || undefined,
      storyMode: resolveStoryModeByCategory(activeCategory),
    };

    try {
      let pageData: {
        records?: (TsStoryPublic | TsStory)[];
        total?: number;
        pages?: number;
      } | null = null;

      try {
        pageData = await tsStoryApi.getPublicStoryList(params);
      }
      catch {
        pageData = await tsStoryApi.getStoryList({
          ...params,
          isPublic: 1,
        });
      }

      if (seq !== requestSeqRef.current) {
        return;
      }

      const records = pageData?.records || [];
      const mapped = records.map((item) => {
        const id = Number(item.id);
        return {
          id: Number.isFinite(id) ? `story-${id}` : `story-${Math.random()}`,
          imageUrl: typeof item.coverUrl === 'string' ? item.coverUrl : undefined,
        };
      });

      setStoryState((prev) => {
        const merged = append ? [...prev.items, ...mapped] : mapped;
        return {
          ...prev,
          items: merged,
          pageNo,
          hasMore: computeHasMore({
            pageNo,
            pageSize: PAGE_SIZE,
            total: pageData?.total,
            pages: pageData?.pages,
            mergedLength: merged.length,
            latestBatchLength: mapped.length,
          }),
          loading: false,
          loadingMore: false,
          error: null,
        };
      });
    }
    catch (error) {
      if (seq !== requestSeqRef.current) {
        return;
      }
      const message = error instanceof Error ? error.message : '故事列表加载失败';
      setStoryState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
        error: message,
      }));
    }
  };

  const fetchCharacters = async (pageNo: number, append: boolean, seq: number) => {
    setCharacterState(prev => ({
      ...prev,
      error: null,
      loading: append ? prev.loading : true,
      loadingMore: append,
    }));

    const params = {
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: searchKeyword || undefined,
      styleName: resolveStyleByCategory(activeCategory),
    };

    try {
      let pageData: {
        records?: (TsRoleImageProfilePublic | TsRoleImageProfile)[];
        total?: number;
        pages?: number;
      } | null = null;

      try {
        pageData = await tsRoleImageApi.getPublicRoleImageProfileList(params);
      }
      catch {
        pageData = await tsRoleImageApi.getRoleImageProfileList({
          ...params,
          isPublic: 1,
        });
      }

      if (seq !== requestSeqRef.current) {
        return;
      }

      const records = pageData?.records || [];
      const mapped = records.map((item, index) => {
        const rawId = Number(item.id);
        const id = Number.isFinite(rawId) ? String(rawId) : `${pageNo}-${index}`;
        const author = normalizeText(
          (item as TsRoleImageProfilePublic).authorName ?? (item as TsRoleImageProfile).ownerUserId,
          '--',
        );
        const viewsSource = (item as TsStoryPublic).followerCount ?? (item as TsStoryPublic).dialogueCount;

        return {
          id: `character-${id}`,
          username: normalizeText(item.profileName, '@user'),
          author,
          views: toDisplayCount(viewsSource),
          imageUrl: typeof item.selectedImageUrl === 'string' ? item.selectedImageUrl : undefined,
          authorAvatarUrl: (item as TsRoleImageProfilePublic).authorAvatar,
        };
      });

      setCharacterState((prev) => {
        const merged = append ? [...prev.items, ...mapped] : mapped;
        return {
          ...prev,
          items: merged,
          pageNo,
          hasMore: computeHasMore({
            pageNo,
            pageSize: PAGE_SIZE,
            total: pageData?.total,
            pages: pageData?.pages,
            mergedLength: merged.length,
            latestBatchLength: mapped.length,
          }),
          loading: false,
          loadingMore: false,
          error: null,
        };
      });
    }
    catch (error) {
      if (seq !== requestSeqRef.current) {
        return;
      }
      const message = error instanceof Error ? error.message : '角色列表加载失败';
      setCharacterState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
        error: message,
      }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const seq = requestSeqRef.current + 1;
    requestSeqRef.current = seq;

    if (activeTab === 'story') {
      void fetchStories(1, false, seq);
      return;
    }
    void fetchCharacters(1, false, seq);
  }, [activeTab, activeCategory, searchKeyword]);

  const currentState = activeTab === 'story' ? storyState : characterState;

  const loadMore = () => {
    if (currentState.loading || currentState.loadingMore || !currentState.hasMore) {
      return;
    }

    const nextPage = currentState.pageNo + 1;
    const seq = requestSeqRef.current;

    if (activeTab === 'story') {
      void fetchStories(nextPage, true, seq);
      return;
    }
    void fetchCharacters(nextPage, true, seq);
  };

  const characterCards = useMemo(() => {
    if (characterState.items.length > 0) {
      return characterState.items;
    }
    if (characterState.error) {
      return FALLBACK_CHARACTER_CARDS;
    }
    return [];
  }, [characterState.error, characterState.items]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isNearBottom(event.nativeEvent)) {
      loadMore();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaView style={{ backgroundColor: '#000' }} />

      <View style={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 12 }}>
        <AiNavigateTabs
          options={TAB_OPTIONS}
          activeValue={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <SearchBar
        placeholder={activeTab === 'story' ? '搜索故事' : '搜索角色'}
        value={searchInput}
        onChangeText={setSearchInput}
        onSubmitEditing={() => setSearchKeyword(searchInput.trim())}
      />

      <View style={{ paddingVertical: 6 }}>
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={160}
        contentContainerStyle={{ 
          padding: 12, 
          paddingBottom: 90,
          flexGrow: 1 // Important for centering when empty
        }}
      >
        {currentState.error ? (
          <Text style={{ color: '#fca5a5', fontSize: 12, marginBottom: 8 }}>{currentState.error}</Text>
        ) : null}

        {activeTab === 'story' ? (
          <>
            {currentState.loading && currentState.items.length === 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={`story-skeleton-${i}`} style={{ width: '31.5%', aspectRatio: 208 / 292 }}>
                    <AiSkeleton width="100%" height="100%" borderRadius={16} />
                  </View>
                ))}
              </View>
            ) : (
              <StoryGrid items={storyState.items} />
            )}
            {!storyState.loading && !storyState.error && storyState.items.length === 0 ? (
              <AiEmpty
                title="No stories yet"
                description="Try searching with a different keyword"
                style={{ marginTop: 60 }}
              />
            ) : null}
          </>
        ) : (
          <>
            {currentState.loading && currentState.items.length === 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={`char-skeleton-${i}`} style={{ width: '47.4%', marginBottom: 18, aspectRatio: 3 / 4 }}>
                    <AiSkeleton width="100%" height="100%" borderRadius={12} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {characterCards.map((card) => (
                <View key={card.id} style={{ width: '47.4%', marginBottom: 18 }}>
                  <ImageCard
                    imageUrl={card.imageUrl}
                    username={card.username}
                    author={card.author}
                    views={card.views}
                    authorAvatarUrl={card.authorAvatarUrl}
                  />
                </View>
              ))}
            </View>
            )}
            {!characterState.loading && !characterState.error && characterState.items.length === 0 ? (
              <AiEmpty
                title="No characters yet"
                description="Try searching with a different keyword"
                style={{ marginTop: 60 }}
              />
            ) : null}
          </>
        )}

        {currentState.loadingMore ? (
          <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>加载更多...</Text>
        ) : null}
      </ScrollView>

      <div className="fixed bottom-0 left-0 right-0 z-[1000]">
        <AiBottomTabs activeTab="search" />
      </div>
    </View>
  );
}
