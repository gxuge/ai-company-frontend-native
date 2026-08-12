import { useEffect, useRef, useState } from 'react';

import activeTab from '@/assets/images/history-list/active-tab.png';
import authorGuChengzhou from '@/assets/images/history-list/author-gu-chengzhou.png';
import authorLinXi from '@/assets/images/history-list/author-lin-xi.png';
import authorLuChen from '@/assets/images/history-list/author-lu-chen.png';
import authorShenYan from '@/assets/images/history-list/author-shen-yan.png';
import authorSuWan from '@/assets/images/history-list/author-su-wan.png';
import clearHistory from '@/assets/images/history-list/clear-history.png';
import continueGuChengzhou from '@/assets/images/history-list/continue-gu-chengzhou.png';
import continueLinXi from '@/assets/images/history-list/continue-lin-xi.png';
import continueLuChen from '@/assets/images/history-list/continue-lu-chen.png';
import continueShenYan from '@/assets/images/history-list/continue-shen-yan.png';
import continueSuWan from '@/assets/images/history-list/continue-su-wan.png';
import deleteGuChengzhou from '@/assets/images/history-list/delete-gu-chengzhou.png';
import deleteLinXi from '@/assets/images/history-list/delete-lin-xi.png';
import deleteLuChen from '@/assets/images/history-list/delete-lu-chen.png';
import deleteShenYan from '@/assets/images/history-list/delete-shen-yan.png';
import deleteSuWan from '@/assets/images/history-list/delete-su-wan.png';
import roleGuChengzhou from '@/assets/images/history-list/role-gu-chengzhou.png';
import roleLinXi from '@/assets/images/history-list/role-lin-xi.png';
import roleLuChen from '@/assets/images/history-list/role-lu-chen.png';
import roleShenYan from '@/assets/images/history-list/role-shen-yan.png';
import roleSuWan from '@/assets/images/history-list/role-su-wan.png';
import searchIcon from '@/assets/images/history-list/search.png';

const DESIGN_WIDTH = 405;
const DESIGN_HEIGHT = 719.5;

type HistoryCardData = {
  name: string;
  description: string;
  tags: string[];
  meta: string;
  time?: string;
  top: number;
  left: number;
  width: number;
  height: number;
  imageTop: number;
  imageHeight: number;
  imageLeft: number;
  imageWidth: number;
  contentLeft: number;
  titleTop: number;
  descriptionTop: number;
  tagsTop: number;
  avatarTop: number;
  metaTop: number;
  timeLeft?: number;
  actionLeft: number;
  actionTop: number;
  actionWidth: number;
  actionHeight: number;
  deleteLeft: number;
  deleteTop: number;
  roleImage: string;
  authorImage: string;
  continueIcon: string;
  deleteIcon: string;
  titleBold?: boolean;
};

const historyCards: HistoryCardData[] = [
  {
    name: '陆沉',
    description: '外表冷峻的总裁，内心温柔专一。',
    tags: ['总裁', '成熟', '深情'],
    meta: '作者：星海拾光·2小时前浏览',
    top: 111,
    left: 13,
    width: 378,
    height: 110,
    imageTop: 118.5,
    imageHeight: 94.5,
    imageLeft: 22.5,
    imageWidth: 85,
    contentLeft: 119.5,
    titleTop: 121.5,
    descriptionTop: 142,
    tagsTop: 161.5,
    avatarTop: 193,
    metaTop: 195.5,
    actionLeft: 305,
    actionTop: 190.5,
    actionWidth: 74.5,
    actionHeight: 21,
    deleteLeft: 369.5,
    deleteTop: 122.5,
    roleImage: roleLuChen,
    authorImage: authorLuChen,
    continueIcon: continueLuChen,
    deleteIcon: deleteLuChen,
  },
  {
    name: '林汐',
    description: '温柔治愈的系姐姐，总能在你需要时出现。',
    tags: ['治愈', '温柔', '姐姐'],
    meta: '作者：夏夜微凉·1小时前浏览',
    top: 230,
    left: 13,
    width: 378.5,
    height: 111.5,
    imageTop: 239,
    imageHeight: 93.5,
    imageLeft: 22.5,
    imageWidth: 85,
    contentLeft: 118.5,
    titleTop: 243,
    descriptionTop: 263.5,
    tagsTop: 283,
    avatarTop: 313.5,
    metaTop: 316,
    actionLeft: 305,
    actionTop: 311.5,
    actionWidth: 74.5,
    actionHeight: 20.5,
    deleteLeft: 369.5,
    deleteTop: 243.5,
    roleImage: roleLinXi,
    authorImage: authorLinXi,
    continueIcon: continueLinXi,
    deleteIcon: deleteLinXi,
    titleBold: true,
  },
  {
    name: '沈砚',
    description: '清冷孤傲的天才画家，画笔下藏着无人懂的情绪。',
    tags: ['艺术家', '天才', '清冷'],
    meta: '作者：星海拾光·昨天20:16',
    top: 376,
    left: 12.5,
    width: 378.5,
    height: 107,
    imageTop: 383,
    imageHeight: 92.5,
    imageLeft: 22.5,
    imageWidth: 85,
    contentLeft: 118.5,
    titleTop: 386,
    descriptionTop: 407,
    tagsTop: 426,
    avatarTop: 456,
    metaTop: 458,
    actionLeft: 304.5,
    actionTop: 453,
    actionWidth: 75.5,
    actionHeight: 21.5,
    deleteLeft: 369.5,
    deleteTop: 388,
    roleImage: roleShenYan,
    authorImage: authorShenYan,
    continueIcon: continueShenYan,
    deleteIcon: deleteShenYan,
  },
  {
    name: '顾承洲',
    description: '理性自持的律师，法庭之外也有温柔的一面。',
    tags: ['律师', '理性', '可靠'],
    meta: '作者：夏夜微凉',
    time: '3天前18:42',
    top: 515,
    left: 13,
    width: 378,
    height: 98,
    imageTop: 522,
    imageHeight: 84.5,
    imageLeft: 22,
    imageWidth: 85.5,
    contentLeft: 119,
    titleTop: 524.5,
    descriptionTop: 543.5,
    tagsTop: 562.5,
    avatarTop: 589,
    metaTop: 591,
    timeLeft: 213,
    actionLeft: 305,
    actionTop: 586,
    actionWidth: 74.5,
    actionHeight: 20.5,
    deleteLeft: 369.5,
    deleteTop: 525.5,
    roleImage: roleGuChengzhou,
    authorImage: authorGuChengzhou,
    continueIcon: continueGuChengzhou,
    deleteIcon: deleteGuChengzhou,
  },
  {
    name: '苏晚',
    description: '独立聪慧的记者，追寻真相是她的信念。',
    tags: ['记者', '独立', '坚韧'],
    meta: '作者：星海拾光',
    time: '5天前10:23',
    top: 620,
    left: 13,
    width: 379,
    height: 96.5,
    imageTop: 626,
    imageHeight: 83.5,
    imageLeft: 21,
    imageWidth: 85,
    contentLeft: 118.5,
    titleTop: 628.5,
    descriptionTop: 648,
    tagsTop: 667,
    avatarTop: 691.5,
    metaTop: 694,
    timeLeft: 213,
    actionLeft: 304.5,
    actionTop: 689,
    actionWidth: 75.5,
    actionHeight: 20.5,
    deleteLeft: 369.5,
    deleteTop: 630,
    roleImage: roleSuWan,
    authorImage: authorSuWan,
    continueIcon: continueSuWan,
    deleteIcon: deleteSuWan,
  },
];

function HeaderTabs() {
  return (
    <header className="absolute top-0 left-0 h-[35px] w-[405px]">
      <span className="absolute top-[15px] left-[15.5px] text-[13px] leading-[15.5px] font-bold text-[#2971c3]">
        角色
      </span>
      <img
        src={activeTab}
        alt=""
        className="absolute top-[35px] left-[13.5px] h-[2px] w-[30.5px] object-fill"
      />
      <span className="absolute top-[15.5px] left-[66.5px] text-[12.5px] leading-[14px] text-[#999697]">
        故事
      </span>
    </header>
  );
}

function SearchBar() {
  return (
    <section className="absolute top-[47px] left-[13.5px] h-[30px] w-[378.5px] rounded-[12.5px] border border-[#11171f] bg-[#060b12]">
      <img
        src={searchIcon}
        alt=""
        className="absolute top-[8.5px] left-[11.5px] h-[12.5px] w-[12px] object-contain"
      />
      <span className="absolute top-[7px] left-[32.5px] text-[10px] leading-[14px] text-[#747579]">
        搜索浏览过的角色或故事
      </span>
    </section>
  );
}

function SectionLabel({ text, top }: { text: string; top: number }) {
  return (
    <span
      className="absolute left-[12.5px] text-[12.5px] leading-[15px] text-[#bfbfc0]"
      style={{ top }}
    >
      {text}
    </span>
  );
}

function HistoryCard({ card }: { card: HistoryCardData }) {
  return (
    <article
      className="absolute rounded-[9px] border-[0.5px] border-[#151d29] bg-[#060b12]"
      style={{ top: card.top, left: card.left, width: card.width, height: card.height }}
    >
      <img
        src={card.roleImage}
        alt={card.name}
        className="absolute rounded-[6px] object-cover"
        style={{
          top: card.imageTop - card.top,
          left: card.imageLeft - card.left,
          width: card.imageWidth,
          height: card.imageHeight,
        }}
      />

      <span
        className={`absolute text-[13px] leading-[15px] text-[#b8b8ba] ${card.titleBold ? 'font-bold' : ''}`}
        style={{ top: card.titleTop - card.top, left: card.contentLeft - card.left }}
      >
        {card.name}
      </span>
      <span
        className="absolute text-[8.5px] leading-[12.5px] whitespace-nowrap text-[#898b8e]"
        style={{ top: card.descriptionTop - card.top, left: card.contentLeft - card.left }}
      >
        {card.description}
      </span>

      <div
        className="absolute flex h-[17px] items-center gap-[4px]"
        style={{ top: card.tagsTop - card.top, left: card.contentLeft - card.left }}
      >
        {card.tags.map(tag => (
          <span
            key={tag}
            className="flex h-[17px] items-center justify-center rounded-[5.5px] bg-[#061225] px-[6px] text-[8px] leading-none text-[#396899]"
          >
            {tag}
          </span>
        ))}
      </div>

      <img
        src={card.authorImage}
        alt=""
        className="absolute size-[16px] rounded-full object-cover"
        style={{ top: card.avatarTop - card.top, left: 117.5 - card.left }}
      />
      <span
        className="absolute text-[8px] leading-[12px] whitespace-nowrap text-[#7f8082]"
        style={{ top: card.metaTop - card.top, left: 136 - card.left }}
      >
        {card.meta}
      </span>
      {card.time && (
        <span
          className="absolute text-[8px] leading-[12px] whitespace-nowrap text-[#7f8082]"
          style={{ top: card.metaTop - card.top, left: (card.timeLeft ?? 213) - card.left }}
        >
          {card.time}
        </span>
      )}

      <div
        className="absolute rounded-[10.5px] bg-[#0a2a61]"
        style={{
          top: card.actionTop - card.top,
          left: card.actionLeft - card.left,
          width: card.actionWidth,
          height: card.actionHeight,
        }}
      >
        <img
          src={card.continueIcon}
          alt=""
          className="absolute top-[5.5px] left-[9.5px] size-[11px] object-contain"
        />
        <span className="absolute top-[5px] left-[27px] text-[9.5px] leading-[12px] whitespace-nowrap text-[#929fba]">
          继续聊天
        </span>
      </div>

      <img
        src={card.deleteIcon}
        alt=""
        className="absolute h-[12.5px] w-[10.5px] object-contain"
        style={{ top: card.deleteTop - card.top, left: card.deleteLeft - card.left }}
      />
    </article>
  );
}

function TodayHeader() {
  return (
    <>
      <SectionLabel text="今天" top={90.5} />
      <img
        src={clearHistory}
        alt=""
        className="absolute top-[88.5px] right-[57px] h-[10.5px] w-[9px] object-contain"
      />
      <span className="absolute top-[88px] right-[10px] text-[9px] leading-[13px] text-[#8c8d8e]">
        清空历史
      </span>
    </>
  );
}

export default function HistoryListScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window === 'undefined' ? DESIGN_WIDTH : Math.min(window.innerWidth, 520),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry?.contentRect.width || DESIGN_WIDTH);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const scale = containerWidth / DESIGN_WIDTH;

  return (
    <div className="min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[#020408] font-cjk text-neutral-200">
      <div ref={containerRef} className="mx-auto w-full max-w-[520px]">
        <div className="relative w-full" style={{ height: DESIGN_HEIGHT * scale }}>
          <main
            className="absolute top-0 left-0 h-[719.5px] w-[405px] overflow-hidden bg-[#020408]"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <HeaderTabs />
            <SearchBar />
            <TodayHeader />
            <SectionLabel text="昨天" top={355} />
            <SectionLabel text="更早" top={494.5} />
            {historyCards.map(card => <HistoryCard key={card.name} card={card} />)}
          </main>
        </div>
      </div>
    </div>
  );
}
