import { useState } from 'react'

import imgAbyss from '@/assets/images/story-list/d857cd25fd2cd95c30b3e77aaf6b25a75c49267c.png'
import imgAcademy from '@/assets/images/story-list/212159a5a4eedd903dd835db3cf84edac8a39da2.png'
import imgStore from '@/assets/images/story-list/9ceebf4cbd412d98dc6340e2ce29a96ef2752fbb.png'
import imgTrain from '@/assets/images/story-list/1e3fc443fd6e0883bf862cc9b98f7583bfc8df00.png'
import imgInn from '@/assets/images/story-list/10aebd501d968dc0c93dd10cc7f042c2434035ea.png'
import imgCity from '@/assets/images/story-list/ae57479fe8abea67f0f163ee2d20ec61b9656d8e.png'
import imgHero from '@/assets/images/story-list/9ab83bc8ae040315567ef458f6b8ca0c556e08b3.png'
import imgReadingThumb from '@/assets/images/story-list/5913b6607124859a4b21e36c5163b32eda3229ae.png'

import {
  DiscoveryCategoryRail,
  DiscoveryListHeader,
  DiscoveryListLayout,
  DiscoveryListSearch,
  DiscoverySectionHeader,
  type DiscoveryCategory,
} from '@/components/pages/content-list/discovery-list-shell'

import {
  ArrowRightIcon,
  BookIcon,
  BookmarkIcon,
  FlameIcon,
  SparkIcon,
} from './icons'

/** Pointer-capable devices only — keeps hover styles off touch screens, where
 *  `:hover` sticks after a tap. */
const hoverable = '[@media(hover:hover)]:hover'

const CATEGORIES: DiscoveryCategory[] = [
  { label: '热门剧情', glyph: '🔥' },
  { label: '恋爱互动', glyph: '💗' },
  { label: '治愈陪伴', glyph: '✿' },
  { label: '冒险探索', glyph: '🧭' },
  { label: '悬疑推理', glyph: '🔍' },
  { label: '未来幻想', glyph: '🪐' },
]

type Story = {
  id: string
  title: string
  cover: string
  lines: [string, string]
  tags: string[]
  plays: string
  chapter: string
  dot: string
}

const STORIES: Story[] = [
  {
    id: 'abyss',
    title: '深海遗迹',
    cover: imgAbyss,
    lines: ['沉没千年的文明，藏着不该被', '唤醒的秘密。'],
    tags: ['冒险', '多结局', 'AI互动'],
    plays: '12.5k体验',
    chapter: '第12章',
    dot: '#7fe0d0',
  },
  {
    id: 'academy',
    title: '魔法学院',
    cover: imgAcademy,
    lines: ['你收到一封来自魔法学院的', '入学邀请函。'],
    tags: ['奇幻', '成长', '多结局'],
    plays: '9.8k体验',
    chapter: '第18章',
    dot: '#b6ff3d',
  },
  {
    id: 'store',
    title: '深夜便利店',
    cover: imgStore,
    lines: ['每个深夜光顾便利店的人，', '都带着不为人知的故事。'],
    tags: ['治愈', '日常', 'AI互动'],
    plays: '8.7k体验',
    chapter: '第9章',
    dot: '#8fdc01',
  },
  {
    id: 'train',
    title: '迷雾列车',
    cover: imgTrain,
    lines: ['这趟列车，开往终点，', '却没有人知道回程的路线。'],
    tags: ['悬疑', '推理', '多结局'],
    plays: '7.6k体验',
    chapter: '第14章',
    dot: '#c9d1d6',
  },
  {
    id: 'inn',
    title: '纸月旅馆',
    cover: imgInn,
    lines: ['旅馆的客人，白天是路人，', '夜里却是另一个身份。'],
    tags: ['悬疑', '都市', 'AI互动'],
    plays: '6.3k体验',
    chapter: '第11章',
    dot: '#8fdc01',
  },
  {
    id: 'city',
    title: '逆光之城',
    cover: imgCity,
    lines: ['在这座由算法统治的城市，', '寻找属于你的自由。'],
    tags: ['科幻', '冒险', '多结局'],
    plays: '10.2k体验',
    chapter: '第15章',
    dot: '#8fdc01',
  },
]

function StoryCard({
  story,
  saved,
  onToggleSave,
}: {
  story: Story
  saved: boolean
  onToggleSave: () => void
}) {
  return (
    <article
      className={`group overflow-hidden rounded-[14px] border border-[#161616] bg-surface transition-colors ${hoverable}:border-[#2a2f22]`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={story.cover}
          alt={story.title}
          loading="lazy"
          decoding="async"
          className={`size-full object-cover object-top transition-transform duration-500 ${hoverable}:scale-[1.04]`}
        />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface to-transparent" />
        <button
          type="button"
          aria-label={saved ? '取消收藏' : '收藏'}
          aria-pressed={saved}
          onClick={onToggleSave}
          className="absolute top-1 right-1 grid size-11 place-items-center rounded-full transition-transform active:scale-90"
        >
          <span className="grid size-8 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
            <BookmarkIcon
              filled={saved}
              className={`size-[16px] transition-colors duration-150 ${
                saved ? 'text-[#97ed08]' : 'text-white/75'
              }`}
            />
          </span>
        </button>
      </div>

      <div className="px-[10px] pt-[9px] pb-[9px]">
        <h3 className="flex items-center gap-[5px] text-[13px] leading-tight font-bold text-[#c4c4c4]">
          {story.title}
          <span
            className="size-[6px] shrink-0 rounded-full"
            style={{ backgroundColor: story.dot, boxShadow: `0 0 8px ${story.dot}` }}
          />
        </h3>

        <p className="mt-[4px] text-[9px] leading-[13px] text-[#6d6d6d]">
          {story.lines[0]}
          {story.lines[1]}
        </p>

        <div className="mt-[7px] flex flex-wrap gap-[5px]">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] border border-[#0e0e0e] bg-[#171717] px-[6px] py-[2px] text-[7px] leading-[1.5] text-[#787878]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-[7px] border-t border-[#141414] pt-[6px]">
          <div className="flex items-center justify-between text-[9px] text-[#6d6d6d]">
            <span className="flex items-center gap-[4px]">
              <FlameIcon className="size-[12px] text-[#ff7a2f]" />
              {story.plays}
            </span>
            <span className="flex items-center gap-[4px]">
              <BookIcon className="size-[12px] text-[#8a8a8a]" />
              {story.chapter}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function StoryHome() {
  const [category, setCategory] = useState('热门剧情')
  const [nav, setNav] = useState('广场')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  return (
    <DiscoveryListLayout activeNav={nav} onNavChange={setNav}>
      <DiscoveryListHeader activeTab="故事" />
      <DiscoveryListSearch
        value={query}
        onChange={setQuery}
        placeholder="搜索故事、世界观、关键词..."
      />
      <DiscoveryCategoryRail
        activeCategory={category}
        categories={CATEGORIES}
        onCategoryChange={setCategory}
      />

      {/* Story poster */}
      <section className="mt-[14px] px-[16px]">
        <div className="relative aspect-[769/244] overflow-hidden rounded-[16px] border border-[#141414]">
          <img
            src={imgHero}
            alt="最后的星港"
            fetchPriority="high"
            className="absolute inset-0 size-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-[16px]">
            <span className="flex items-center gap-[5px] text-[9px] text-[#9b9c9e]">
              <SparkIcon className="size-[11px] text-[#97ed08]" />
              今日精选
            </span>
            <h2 className="mt-[7px] flex items-center gap-[6px] text-[18px] leading-none font-bold text-[#e6e6e7]">
              最后的星港
              <span className="size-[7px] rounded-full bg-[#97ed08] shadow-[0_0_9px_rgba(151,237,8,0.75)]" />
            </h2>
            <p className="mt-[6px] max-w-[20em] text-[9px] text-[#8b8c8f]">
              末日之后，人类最后的城市仍在发光
            </p>
            <button
              type="button"
              className={`mt-[8px] flex w-fit items-center gap-[6px] rounded-[8px] border border-[#5b8c06] bg-[#91dd03] px-[12px] py-[5px] text-[10px] text-[#345301] transition-transform active:scale-95 ${hoverable}:scale-[1.03]`}
            >
              开始体验
              <ArrowRightIcon className="size-[11px]" strokeWidth={2.2} />
            </button>
          </div>
          <span className="absolute right-[8px] bottom-[7px] rounded-[6px] border border-[#0e0e10] bg-black/70 px-[7px] py-[3px] font-['Inter'] text-[8px] text-[#a0a0a1]">
            1/5
          </span>
        </div>
      </section>

      {/* Hot stories */}
      <section className="mt-[18px] px-[16px]">
        <DiscoverySectionHeader title="热门故事" />
        <div className="mt-[11px] grid grid-cols-1 gap-[11px] min-[380px]:grid-cols-2">
          {STORIES.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              saved={Boolean(saved[story.id])}
              onToggleSave={() =>
                setSaved((prev) => ({ ...prev, [story.id]: !prev[story.id] }))
              }
            />
          ))}
        </div>
      </section>

      {/* Continue reading */}
      <section className="mt-[18px] px-[16px]">
        <DiscoverySectionHeader title="继续阅读" action="查看全部" />
        <div className="mt-[11px] rounded-[12px] border border-[#161616] bg-surface p-3">
          <div className="flex items-stretch gap-3">
            <img
              src={imgReadingThumb}
              alt="最后的星港"
              loading="lazy"
              className="h-[72px] w-[110px] shrink-0 rounded-[8px] object-cover"
            />

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              <h3 className="truncate text-[14px] text-[#c3c4c4]">最后的星港</h3>
              <p className="truncate text-[11px] text-[#6b6b6b]">继续阅读：第7章希望之光</p>
              <div className="flex items-center gap-3">
                <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#151515]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5f9c00] to-[#a8f42a] shadow-[0_0_10px_rgba(143,220,1,0.5)]"
                    style={{ width: '63%' }}
                  />
                </div>
                <span className="shrink-0 font-['Inter'] text-[11px] text-[#8b8b8b]">63%</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-[10px] border border-[#7cbe03] bg-lime py-[8px] text-[12px] text-[#365700] transition-transform active:scale-[0.98]"
          >
            继续阅读
          </button>
        </div>
      </section>
    </DiscoveryListLayout>
  )
}
