import type { DiscoveryCategory } from '@/components/pages/content-list/discovery-list-shell';
import { Star } from 'lucide-react';

import { useState } from 'react';
import imgLuchen from '@/assets/images/role-list/1bf54af6a1db075a9433e8c0be5c948deff75ba7.png';
import imgGuyanFire from '@/assets/images/role-list/5d888c39cbdbf6518504b3abc4c2fd8769828f56.png';
import imgHeroStar from '@/assets/images/role-list/0007de5e2050911ecb864c2d7379f8171db6b9d6.png';
import imgLilithFire from '@/assets/images/role-list/8c7c0b9ffbdb3320889a92302cace99cfc4993a1.png';
import imgHeroArrow from '@/assets/images/role-list/9a47394a8f35b2a96acacfea0f49246af4476128.png';

import imgChipAnime from '@/assets/images/role-list/9ca5384c5e4ca17440c360b7c3564ad74a699669.png';
import imgLinxi from '@/assets/images/role-list/9f1fec243ad53de418b817fd8e14deaa65309d3f.png';
import imgLinxiFire from '@/assets/images/role-list/15cf54fca652906145e165b767edbfbefbab91bf.png';

import imgChipNew from '@/assets/images/role-list/35a00ce113c91d3c5eeedf66f54a2704d14e862f.png';
import imgLuchenFire from '@/assets/images/role-list/51c46b0d30a073641c44d063f56f212e6487fb0b.png';
import imgChipHeal from '@/assets/images/role-list/093a472d35ac7b6f66c15becda6303a45dc2e8e5.png';

import imgChipLove from '@/assets/images/role-list/7297e9c09836306bbbf7d2c2237a0f003aca3a51.png';

import imgYe from '@/assets/images/role-list/a78a22bafd2ffc855da5526289ce388b642f42d1.png';
import imgLilith from '@/assets/images/role-list/af96fd444750be2269db4e22b9458be334bc6e11.png';
import imgGuyan from '@/assets/images/role-list/b7350a4ed27e611b4aa7a950d486adc1457f85e6.png';

import imgHero from '@/assets/images/role-list/c5e6f71b16c8e492e873744e2262232643859833.png';
import imgYeFire from '@/assets/images/role-list/c874d1efd7641e3d7d361c548d568919901f66db.png';

import imgChipCity from '@/assets/images/role-list/d1c70019b25c49420773d26aa8432972bf1da02d.png';
import imgTaoFire from '@/assets/images/role-list/e46c26fc842aba090f1e90e5485e7608153ada76.png';
import imgChipPopular from '@/assets/images/role-list/e547ecfbc83a428933b066f51a7b315e6e9d48a0.png';

import imgTao from '@/assets/images/role-list/fbdd60cdff9a241d8521e0fa99190901d09fc545.png';

import {

  DiscoveryCategoryRail,
  DiscoveryListHeader,
  DiscoveryListLayout,
  DiscoveryListSearch,
  DiscoverySectionHeader,
} from '@/components/pages/content-list/discovery-list-shell';

const CATEGORIES: DiscoveryCategory[] = [
  { label: '热门', glyph: '🔥' },
  { label: '新品', icon: imgChipNew },
  { label: '高人气', icon: imgChipPopular },
  { label: '恋爱', icon: imgChipLove },
  { label: '治愈', icon: imgChipHeal },
  { label: '二次元', icon: imgChipAnime },
  { label: '都市', icon: imgChipCity },
];

type Character = {
  name: string;
  title: string;
  tags: [string, string];
  heat: string;
  image: string;
  fire: string;
};

const CHARACTERS: Character[] = [
  {
    name: '陆沉',
    title: '傲娇学长',
    tags: ['校园', '傲娇'],
    heat: '12.5k',
    image: imgLuchen,
    fire: imgLuchenFire,
  },
  {
    name: '林夕',
    title: '温柔治愈姐姐',
    tags: ['治愈', '温柔'],
    heat: '9.8k',
    image: imgLinxi,
    fire: imgLinxiFire,
  },
  {
    name: '顾言',
    title: '霸道总裁',
    tags: ['都市', '高冷'],
    heat: '15.2k',
    image: imgGuyan,
    fire: imgGuyanFire,
  },
  {
    name: '小桃酱',
    title: '元气偶像',
    tags: ['二次元', '可爱'],
    heat: '8.7k',
    image: imgTao,
    fire: imgTaoFire,
  },
  {
    name: '叶无尘',
    title: '仙侠剑修',
    tags: ['仙侠', '沉稳'],
    heat: '6.2k',
    image: imgYe,
    fire: imgYeFire,
  },
  {
    name: '莉莉丝',
    title: '神秘占卜师',
    tags: ['奇幻', '神秘'],
    heat: '7.1k',
    image: imgLilith,
    fire: imgLilithFire,
  },
];

function CharacterCard({
  character,
  onToggleSave,
  saved,
}: {
  character: Character;
  onToggleSave: () => void;
  saved: boolean;
}) {
  return (
    <article
      className="relative aspect-3/2 w-full overflow-hidden rounded-[14px] text-left"
    >
      <img
        alt={character.name}
        src={character.image}
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        aria-label={saved ? '取消收藏' : '收藏'}
        aria-pressed={saved}
        onClick={onToggleSave}
        className="absolute top-1 right-1 grid size-11 place-items-center rounded-full transition-transform active:scale-90"
      >
        <span className="grid size-7 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
          <Star
            aria-hidden
            strokeWidth={1.8}
            className={`size-[13px] transition-colors duration-150 ${
              saved ? 'fill-current text-[#f2c14e]' : 'text-white/75'
            }`}
          />
        </span>
      </button>
      <div className="absolute inset-x-0 bottom-0 px-[10px] pt-8 pb-[9px]">
        <p className="flex items-center gap-[5px] text-[13px] leading-tight font-bold text-[#d7d3d2]">
          {character.name}
        </p>
        <p className="mt-[3px] text-[9px] leading-tight text-[#8d8c8b]">{character.title}</p>
        <div className="mt-[7px] flex items-center gap-[5px]">
          {character.tags.map(tag => (
            <span
              key={tag}
              className="rounded-[4px] bg-[#212122]/85 px-[6px] py-[2px] text-[7px] leading-normal text-[#7f7f7e]"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-[3px]">
            <img alt="" src={character.fire} className="h-[9px] w-[8px]" />
            <span className="font-num text-[9px] font-bold text-[#a0a0a0]">{character.heat}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState('热门');
  const [activeNav, setActiveNav] = useState('广场');
  const [query, setQuery] = useState('');
  const [savedCharacters, setSavedCharacters] = useState<Record<string, boolean>>({});

  return (
    <DiscoveryListLayout activeNav={activeNav} onNavChange={setActiveNav}>
      <DiscoveryListHeader activeTab="角色" navigationStyle="segmented" />
      <DiscoveryListSearch
        value={query}
        onChange={setQuery}
        placeholder="搜索角色、故事、关键词..."
      />
      <DiscoveryCategoryRail
        activeCategory={activeCategory}
        categories={CATEGORIES}
        onCategoryChange={setActiveCategory}
      />

      {/* Today's recommendation */}
      <section className="mt-[14px] px-[16px]">
        <div className="relative aspect-772/267 w-full overflow-hidden rounded-[16px]">
          <img
            alt="深夜陪伴 · 温柔治愈"
            src={imgHero}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-[16px]">
            <div className="flex items-center gap-[5px]">
              <img alt="" src={imgHeroStar} className="size-[9px]" />
              <span className="text-[9px] leading-none text-[#68696b]">今日推荐</span>
            </div>
            <h2 className="mt-[9px] text-[18px] leading-none font-bold text-[#b1b2b1]">
              深夜陪伴
              {' '}
              <span className="text-[#b1b2b1]">·温柔治愈</span>
            </h2>
            <p className="mt-[8px] text-[10px] leading-none text-[#717275]">
              总有一个声音，陪你度过每个夜晚
            </p>
            <button
              type="button"
              className="mt-[13px] flex w-fit items-center gap-[8px] rounded-[9px] bg-[#8ddf0a] px-[14px] py-[7px]"
            >
              <span className="text-[11px] leading-none text-[#2b4702]">立即体验</span>
              <img alt="" src={imgHeroArrow} className="h-[8px] w-[5px]" />
            </button>
          </div>
          <span className="absolute right-[8px] bottom-[7px] rounded-[6px] border border-[#0e0e10] bg-black/70 px-[7px] py-[3px] font-['Inter'] text-[8px] text-[#a0a0a1]">
            1/5
          </span>
        </div>
      </section>

      {/* Hot characters */}
      <section className="mt-[18px] px-[16px]">
        <DiscoverySectionHeader title="热门角色" />
        <div className="mt-[11px] grid grid-cols-2 gap-[11px]">
          {CHARACTERS.map(character => (
            <CharacterCard
              key={character.name}
              character={character}
              saved={Boolean(savedCharacters[character.name])}
              onToggleSave={() => {
                setSavedCharacters(prev => ({
                  ...prev,
                  [character.name]: !prev[character.name],
                }));
              }}
            />
          ))}
        </div>
      </section>
    </DiscoveryListLayout>
  );
}
