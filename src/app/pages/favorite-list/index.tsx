import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import pageBackground from '@/assets/images/favorite-list/asset-00.png';
import actionStoryAlt from '@/assets/images/favorite-list/asset-01.png';
import participantA from '@/assets/images/favorite-list/asset-02.png';
import participantStripA from '@/assets/images/favorite-list/asset-03.png';
import participantB from '@/assets/images/favorite-list/asset-04.png';
import participantC from '@/assets/images/favorite-list/asset-05.png';
import participantD from '@/assets/images/favorite-list/asset-06.png';
import bookmarkStoryAlt from '@/assets/images/favorite-list/asset-07.png';
import storySpaceCover from '@/assets/images/favorite-list/asset-08.png';
import actionStory from '@/assets/images/favorite-list/asset-09.png';
import participantStripB from '@/assets/images/favorite-list/asset-10.png';
import participantE from '@/assets/images/favorite-list/asset-11.png';
import participantF from '@/assets/images/favorite-list/asset-13.png';
import participantG from '@/assets/images/favorite-list/asset-14.png';
import participantH from '@/assets/images/favorite-list/asset-15.png';
import bookmarkStory from '@/assets/images/favorite-list/asset-16.png';
import storyCafeCover from '@/assets/images/favorite-list/asset-17.png';
import actionChat from '@/assets/images/favorite-list/asset-18.png';
import authorLinxi from '@/assets/images/favorite-list/asset-20.png';
import bookmarkLinxi from '@/assets/images/favorite-list/asset-21.png';
import roleLinxiCover from '@/assets/images/favorite-list/asset-22.png';
import actionChatAlt from '@/assets/images/favorite-list/asset-23.png';
import authorLuchen from '@/assets/images/favorite-list/asset-25.png';
import bookmarkLuchen from '@/assets/images/favorite-list/asset-26.png';
import roleLuchenCover from '@/assets/images/favorite-list/asset-27.png';
import searchIcon from '@/assets/images/favorite-list/asset-28.png';
import activeUnderline from '@/assets/images/favorite-list/asset-29.png';

type FavoriteTab = 'role' | 'story';

type RoleFavorite = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  author: string;
  metric: string;
  cover: string;
  authorAvatar: string;
  bookmark: string;
  actionIcon: string;
};

type StoryFavorite = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  author: string;
  metric: string;
  cover: string;
  bookmark: string;
  actionIcon: string;
  participants: string[];
  participantStrip: string;
};

const DESIGN_WIDTH = 405;

const ROLE_FAVORITES: RoleFavorite[] = [
  {
    id: 'luchen',
    name: '陆沉',
    description: '外表冷峻的总裁，内心温柔专一。',
    tags: ['总裁', '成熟', '深情'],
    author: '作者：星海拾光',
    metric: '12.6k聊过',
    cover: roleLuchenCover,
    authorAvatar: authorLuchen,
    bookmark: bookmarkLuchen,
    actionIcon: actionChatAlt,
  },
  {
    id: 'linxi',
    name: '林汐',
    description: '温柔治愈的系姐姐，总能在你需要时出现。',
    tags: ['治愈', '温柔', '姐姐'],
    author: '作者：夏夜微凉',
    metric: '8.7k聊过',
    cover: roleLinxiCover,
    authorAvatar: authorLinxi,
    bookmark: bookmarkLinxi,
    actionIcon: actionChat,
  },
];

const STORY_FAVORITES: StoryFavorite[] = [
  {
    id: 'rain-cafe',
    name: '雨夜咖啡馆',
    description: '雨夜邂逅神秘的他，一杯咖啡揭开尘封的往事。',
    tags: ['都市', '悬疑', '治愈'],
    author: '等4人参与作者：星海拾光',
    metric: '第12章・60%',
    cover: storyCafeCover,
    bookmark: bookmarkStory,
    actionIcon: actionStory,
    participants: [participantE, participantF, participantG, participantH],
    participantStrip: participantStripB,
  },
  {
    id: 'space-era',
    name: '星海纪元',
    description: '人类踏上星际之旅，在未知宇宙中寻找新的家园。',
    tags: ['科幻', '冒险', '治愈'],
    author: '等5人参与作者：银河漫游者',
    metric: '第8章・25%',
    cover: storySpaceCover,
    bookmark: bookmarkStoryAlt,
    actionIcon: actionStoryAlt,
    participants: [participantA, participantB, participantC, participantD],
    participantStrip: participantStripA,
  },
];

function includesKeyword(values: string[], query: string) {
  if (!query) {
    return true;
  }
  return values.some(value => value.toLocaleLowerCase().includes(query));
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-[8px] flex gap-[5px]">
      {tags.map(tag => (
        <span
          key={tag}
          className="rounded-[5px] bg-[#0c1a2f] px-[7px] py-[4px] text-[10px] leading-none text-[#3461a1]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function RoleCard({
  item,
  onRemove,
}: {
  item: RoleFavorite;
  onRemove: () => void;
}) {
  return (
    <article className="relative flex h-[103px] overflow-hidden rounded-[13px] border border-[#0c1727] bg-[#050f1d] px-[9px] py-[8px]">
      <img
        src={item.cover}
        alt={item.name}
        className="h-[86px] w-[78px] shrink-0 rounded-[8px] object-cover"
      />

      <div className="min-w-0 flex-1 pl-[12px]">
        <h3 className="text-[16px] leading-[20px] font-bold text-[#b0b5be]">{item.name}</h3>
        <p className="mt-[4px] truncate pr-[30px] text-[10.5px] leading-[15px] text-[#7e838e]">
          {item.description}
        </p>
        <Tags tags={item.tags} />

        <div className="mt-[11px] flex items-center text-[10px] text-[#717680]">
          <img
            src={item.authorAvatar}
            alt=""
            className="mr-[5px] size-[14px] rounded-full object-cover"
          />
          <span>{item.author}</span>
          <span className="mr-[119px] ml-auto flex items-center gap-[4px] whitespace-nowrap">
            <span className="text-[13px] leading-none">🔥</span>
            {item.metric}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label={`取消收藏${item.name}`}
        onClick={onRemove}
        className="absolute top-[9px] right-[9px] grid size-[24px] place-items-center transition-transform active:scale-90"
      >
        <img src={item.bookmark} alt="" className="h-[18px] w-[14px] object-contain" />
      </button>

      <button
        type="button"
        onClick={() => router.push('/pages/chat')}
        className="absolute right-[10px] bottom-[8px] flex h-[30px] items-center gap-[6px] rounded-[15px] border border-[#123877] bg-[#0d2956] px-[10px] text-[11px] text-[#4d7dc9] transition-transform active:scale-[0.97]"
      >
        <img src={item.actionIcon} alt="" className="size-[15px] object-contain" />
        继续聊天
      </button>
    </article>
  );
}

function ParticipantStack({
  participants,
  strip,
}: {
  participants: string[];
  strip: string;
}) {
  return (
    <span className="relative flex h-[19px] w-[57px] shrink-0 items-center">
      <img
        src={strip}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-contain opacity-40"
      />
      {participants.map((participant, index) => (
        <img
          key={participant}
          src={participant}
          alt=""
          className="relative size-[17px] rounded-full border border-[#07101d] object-cover"
          style={{ marginLeft: index === 0 ? 0 : -4 }}
        />
      ))}
    </span>
  );
}

function StoryCard({
  item,
  onRemove,
}: {
  item: StoryFavorite;
  onRemove: () => void;
}) {
  return (
    <article className="relative flex h-[98px] overflow-hidden rounded-[13px] border border-[#0c1727] bg-[#050f1d] px-[9px] py-[8px]">
      <img
        src={item.cover}
        alt={item.name}
        className="h-[82px] w-[77px] shrink-0 rounded-[7px] object-cover"
      />

      <div className="min-w-0 flex-1 pl-[12px]">
        <h3 className="text-[16px] leading-[20px] font-bold text-[#a2a7b0]">{item.name}</h3>
        <p className="mt-[3px] truncate pr-[30px] text-[10.5px] leading-[15px] text-[#777c87]">
          {item.description}
        </p>
        <Tags tags={item.tags} />

        <div className="mt-[9px] flex items-center gap-[5px] text-[10px] text-[#6c717d]">
          <ParticipantStack participants={item.participants} strip={item.participantStrip} />
          <span className="truncate">{item.author}</span>
        </div>
        <p className="mt-[2px] text-[10px] leading-none text-[#616773]">{item.metric}</p>
      </div>

      <button
        type="button"
        aria-label={`取消收藏${item.name}`}
        onClick={onRemove}
        className="absolute top-[8px] right-[9px] grid size-[24px] place-items-center transition-transform active:scale-90"
      >
        <img src={item.bookmark} alt="" className="h-[18px] w-[14px] object-contain" />
      </button>

      <button
        type="button"
        onClick={() => router.push('/pages/story-detail')}
        className="absolute right-[10px] bottom-[9px] flex h-[30px] items-center gap-[6px] rounded-[15px] border border-[#123877] bg-[#0d2956] px-[10px] text-[11px] text-[#4674bd] transition-transform active:scale-[0.97]"
      >
        <img src={item.actionIcon} alt="" className="h-[15px] w-[16px] object-contain" />
        继续故事
      </button>
    </article>
  );
}

function EmptySection({ text }: { text: string }) {
  return (
    <div className="rounded-[13px] border border-[#0c1727] bg-[#050f1d] px-[16px] py-[24px] text-center text-[11px] text-[#5c626e]">
      {text}
    </div>
  );
}

function useFavoriteStage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window === 'undefined' ? DESIGN_WIDTH : Math.min(window.innerWidth, 520),
  );
  const [contentHeight, setContentHeight] = useState(540);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? 720 : window.innerHeight,
  );

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerWidth(entry.contentRect.width || DESIGN_WIDTH);
        }
        if (entry.target === content) {
          setContentHeight(entry.contentRect.height || 540);
        }
      }
    });
    const updateViewportHeight = () => setViewportHeight(window.visualViewport?.height ?? window.innerHeight);

    resizeObserver.observe(container);
    resizeObserver.observe(content);
    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  const scale = containerWidth / DESIGN_WIDTH;
  const stageHeight = Math.max(contentHeight, viewportHeight / scale);

  return { containerRef, contentRef, scale, stageHeight };
}

function FavoriteContent({
  activeTab,
  onQueryChange,
  onRemoveRole,
  onRemoveStory,
  onTabChange,
  query,
  roleSectionRef,
  storySectionRef,
  visibleRoles,
  visibleStories,
}: {
  activeTab: FavoriteTab;
  onQueryChange: (value: string) => void;
  onRemoveRole: (id: string) => void;
  onRemoveStory: (id: string) => void;
  onTabChange: (tab: FavoriteTab) => void;
  query: string;
  roleSectionRef: React.RefObject<HTMLElement | null>;
  storySectionRef: React.RefObject<HTMLElement | null>;
  visibleRoles: RoleFavorite[];
  visibleStories: StoryFavorite[];
}) {
  return (
    <div className="relative">
      <nav className="flex h-[28px] items-start gap-[24px]" aria-label="收藏分类">
        {([
          ['role', '角色'],
          ['story', '故事'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`relative h-[28px] px-[3px] text-[14px] leading-[18px] transition-colors ${
              activeTab === tab ? 'font-bold text-[#2d6dc8]' : 'text-[#6a6e79]'
            }`}
          >
            {label}
            {activeTab === tab
              ? (
                  <img
                    src={activeUnderline}
                    alt=""
                    aria-hidden
                    className="absolute bottom-0 left-1/2 h-[2.5px] w-[28px] -translate-x-1/2"
                  />
                )
              : null}
          </button>
        ))}
      </nav>

      <label className="mt-[9px] flex h-[28px] items-center rounded-[14px] border border-[#131c2c] bg-[#07101d] px-[10px]">
        <img src={searchIcon} alt="" className="mr-[8px] size-[14px] object-contain" />
        <input
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          placeholder="搜索已收藏的角色或故事"
          className="min-w-0 flex-1 bg-transparent text-[11px] text-[#a7abb3] outline-none placeholder:text-[#5c626e]"
        />
      </label>

      <section ref={roleSectionRef} className="scroll-mt-[8px] pt-[11px]">
        <h2 className="mb-[7px] text-[15px] leading-[19px] font-bold text-[#9ca1aa]">
          收藏角色
        </h2>
        <div className="flex flex-col gap-[6px]">
          {visibleRoles.length > 0
            ? visibleRoles.map(item => (
                <RoleCard
                  key={item.id}
                  item={item}
                  onRemove={() => onRemoveRole(item.id)}
                />
              ))
            : <EmptySection text="暂无匹配的收藏角色" />}
        </div>
      </section>

      <section ref={storySectionRef} className="scroll-mt-[8px] pt-[11px]">
        <h2 className="mb-[7px] text-[15px] leading-[19px] font-bold text-[#9498a1]">
          收藏故事
        </h2>
        <div className="flex flex-col gap-[6px]">
          {visibleStories.length > 0
            ? visibleStories.map(item => (
                <StoryCard
                  key={item.id}
                  item={item}
                  onRemove={() => onRemoveStory(item.id)}
                />
              ))
            : <EmptySection text="暂无匹配的收藏故事" />}
        </div>
      </section>
    </div>
  );
}

export default function FavoriteListPage() {
  const roleSectionRef = useRef<HTMLElement | null>(null);
  const storySectionRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<FavoriteTab>('role');
  const [query, setQuery] = useState('');
  const [removedRoles, setRemovedRoles] = useState<Set<string>>(() => new Set());
  const [removedStories, setRemovedStories] = useState<Set<string>>(() => new Set());
  const { containerRef, contentRef, scale, stageHeight } = useFavoriteStage();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleRoles = useMemo(
    () =>
      ROLE_FAVORITES.filter(
        item =>
          !removedRoles.has(item.id)
          && includesKeyword(
            [item.name, item.description, item.author, ...item.tags].map(value =>
              value.toLocaleLowerCase(),
            ),
            normalizedQuery,
          ),
      ),
    [normalizedQuery, removedRoles],
  );
  const visibleStories = useMemo(
    () =>
      STORY_FAVORITES.filter(
        item =>
          !removedStories.has(item.id)
          && includesKeyword(
            [item.name, item.description, item.author, ...item.tags].map(value =>
              value.toLocaleLowerCase(),
            ),
            normalizedQuery,
          ),
      ),
    [normalizedQuery, removedStories],
  );

  const handleTabChange = (tab: FavoriteTab) => {
    setActiveTab(tab);
    const target = tab === 'role' ? roleSectionRef.current : storySectionRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="h-dvh w-full overflow-x-hidden overflow-y-auto bg-[#020a15] text-white">
      <div ref={containerRef} className="mx-auto w-full max-w-[520px]">
        <div className="relative w-full" style={{ height: stageHeight * scale }}>
          <div
            ref={contentRef}
            className="absolute top-0 left-0 min-h-[540px] w-[405px] overflow-hidden bg-[#020a15] px-[15px] pt-[12px] pb-[18px] font-cjk"
            style={{
              minHeight: stageHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <img
              src={pageBackground}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-[540px] w-[405px] object-cover"
            />
            <FavoriteContent
              activeTab={activeTab}
              query={query}
              visibleRoles={visibleRoles}
              visibleStories={visibleStories}
              roleSectionRef={roleSectionRef}
              storySectionRef={storySectionRef}
              onQueryChange={setQuery}
              onTabChange={handleTabChange}
              onRemoveRole={id => setRemovedRoles(previous => new Set(previous).add(id))}
              onRemoveStory={id => setRemovedStories(previous => new Set(previous).add(id))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
