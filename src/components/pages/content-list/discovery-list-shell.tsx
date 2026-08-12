import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import imgNavMessageDot from '@/assets/images/role-list/5e4898131631d711eab062c49e699bc2bbfdb16c.png';
import imgNavCreate from '@/assets/images/role-list/7a144175cd74b1e5c98afc16acbdb627a27a6d07.png';
import imgUnderlineTab from '@/assets/images/role-list/58abbf3052285eaeb869a9b5afa2599a22b82d94.png';
import imgNavMessage from '@/assets/images/role-list/213f7fe65e6fe3800e3e03f45e2db877e0fd7f93.png';
import imgTrophy from '@/assets/images/role-list/550b876dd1dd1a26d8f3a30d9a738bf38b2e0aa6.png';
import imgUnderlineDiscover from '@/assets/images/role-list/768f9100b89d63af96858aecc0db9e04b91e03cc.png';
import imgSectionChevron from '@/assets/images/role-list/971d178a93a2599d10bc9e5d2c7c53a62f60c191.png';
import imgMic from '@/assets/images/role-list/3492e14a5d8e14da8be80c33115a8b9b01502e98.png';
import imgPageBg from '@/assets/images/role-list/42320e6405aae4efcc9dda85faa4d4e0f87292b9.png';
import imgSparkle from '@/assets/images/role-list/a4b722007dbb26001a3b3b3ea68080b4e2547ab7.png';
import imgNavMine from '@/assets/images/role-list/a05b699755bd7e4747ae5d8c5751ff4e3d464758.png';
import imgSectionBar from '@/assets/images/role-list/ad57819d0bd1a146a137fa83686788a0a0aa6e0a.png';
import imgSearchIcon from '@/assets/images/role-list/b51ebca1ccd97e0f067e8ecad70800094eeb1c12.png';
import imgHomeIndicator from '@/assets/images/role-list/b96371fc99b930e4544341f14a910899ff7caff2.png';
import imgNavBg from '@/assets/images/role-list/da318ffe864d8fee819d4feb5cc04c360b9f855e.png';
import imgNavPlaza from '@/assets/images/role-list/e8722061359d4c67ef70f479247e98894f0ac763.png';
import imgNavHome from '@/assets/images/role-list/fb069b64e3efbce9b675c95ddca2c2805526c9d5.png';

export type DiscoveryCategory = {
  label: string;
  icon?: string;
  glyph?: string;
};

type DiscoveryTab = '角色' | '故事';

const DISCOVERY_TAB_PATHS: Record<DiscoveryTab, '/pages/role-list' | '/pages/story-list'> = {
  角色: '/pages/role-list',
  故事: '/pages/story-list',
};

const NAV_ITEMS = [
  { label: '首页', icon: imgNavHome },
  { label: '广场', icon: imgNavPlaza },
  { label: '创建', icon: imgNavCreate },
  { label: '消息', icon: imgNavMessage, dot: imgNavMessageDot },
  { label: '我的', icon: imgNavMine },
];

const DESIGN_WIDTH = 405;
const BOTTOM_NAV_HEIGHT = 58;

function DiscoveryBottomNav({
  activeNav,
  onNavChange,
}: {
  activeNav: string;
  onNavChange: (nav: string) => void;
}) {
  return (
    <nav className="relative h-[58px] w-[405px]">
      <img
        alt=""
        src={imgNavBg}
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <div className="relative flex h-full items-start justify-around px-[6px] pt-[6px]">
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavChange(item.label)}
              className="relative flex w-[56px] flex-col items-center gap-[2px]"
            >
              <span className="relative flex h-[21px] items-center justify-center">
                <img alt="" src={item.icon} className="h-[21px] w-auto" />
                {item.dot && (
                  <img
                    alt=""
                    src={item.dot}
                    className="absolute -top-px -right-[3px] size-[8px]"
                  />
                )}
              </span>
              <span
                className={`text-[9px] leading-none ${
                  active ? 'text-[#558c0b]' : 'text-[#595959]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <img
        alt=""
        src={imgHomeIndicator}
        className="pointer-events-none absolute bottom-[3px] left-1/2 h-[4px] w-[141px] -translate-x-1/2"
      />
    </nav>
  );
}

export function DiscoveryListLayout({
  activeNav,
  children,
  onNavChange,
}: {
  activeNav: string;
  children: ReactNode;
  onNavChange: (nav: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window === 'undefined' ? DESIGN_WIDTH : Math.min(window.innerWidth, 520),
  );
  const [contentHeight, setContentHeight] = useState(720);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerWidth(entry.contentRect.width || DESIGN_WIDTH);
        }
        if (entry.target === content) {
          setContentHeight(entry.contentRect.height || 720);
        }
      }
    });

    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const scale = containerWidth / DESIGN_WIDTH;

  return (
    <div className="h-dvh w-full overflow-x-hidden overflow-y-auto bg-black text-white">
      <div ref={containerRef} className="mx-auto w-full max-w-[520px]">
        <div className="relative w-full" style={{ height: contentHeight * scale }}>
          <div
            ref={contentRef}
            className="absolute top-0 left-0 w-[405px] bg-black pb-[92px]"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <img
              alt=""
              src={imgPageBg}
              className="pointer-events-none absolute inset-x-0 top-0 h-[660px] w-[405px] object-cover opacity-90"
            />
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 bg-black">
        <div className="mx-auto w-full max-w-[520px]">
          <div className="relative w-full" style={{ height: BOTTOM_NAV_HEIGHT * scale }}>
            <div
              className="absolute top-0 left-0 h-[58px] w-[405px]"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <DiscoveryBottomNav activeNav={activeNav} onNavChange={onNavChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverySegmentedHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: DiscoveryTab;
  onTabChange: (tab: DiscoveryTab) => void;
}) {
  return (
    <header className="px-[16px] pt-[14px]">
      <div className="flex items-end">
        <div className="relative">
          <span className="text-[20px] leading-none font-bold text-[#a0cd27]">发现</span>
          <img
            alt=""
            src={imgSparkle}
            className="pointer-events-none absolute -top-[8px] -right-[10px] h-[11px] w-[9px]"
          />
          <img
            alt=""
            src={imgUnderlineDiscover}
            className="pointer-events-none absolute -bottom-[7px] left-[3px] h-[4px] w-[23px]"
          />
        </div>

        <button
          type="button"
          className="ml-auto flex items-center gap-[6px] rounded-[11px] border border-[#1e1d1d] bg-[#090909] px-[12px] py-[7px]"
        >
          <img alt="" src={imgTrophy} className="size-[12px]" />
          <span className="text-[11px] leading-none text-[#6ba70c]">排行榜</span>
        </button>
      </div>

      <nav className="mt-[14px] flex items-center rounded-[16px] border-2 border-[#121419] bg-[#111218] p-[3px]">
        {(['角色', '故事'] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`relative flex-1 rounded-[16px] py-[10px] text-[15px] leading-none transition-colors ${
                active ? 'bg-[#16181f] font-bold text-[#bbbbbd]' : 'text-[#838384]'
              }`}
            >
              {tab}
              {active && (
                <img
                  alt=""
                  src={imgUnderlineTab}
                  className="pointer-events-none absolute bottom-[3px] left-1/2 h-[3px] w-[18px] -translate-x-1/2"
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

export function DiscoveryListHeader({
  activeTab,
  navigationStyle = 'inline',
}: {
  activeTab: DiscoveryTab;
  navigationStyle?: 'inline' | 'segmented';
}) {
  const handleTabChange = (tab: DiscoveryTab) => {
    if (tab !== activeTab) {
      router.replace(DISCOVERY_TAB_PATHS[tab]);
    }
  };

  if (navigationStyle === 'segmented') {
    return <DiscoverySegmentedHeader activeTab={activeTab} onTabChange={handleTabChange} />;
  }

  return (
    <header className="flex items-end gap-[18px] px-[16px] pt-[14px]">
      <div className="relative">
        <span className="text-[20px] leading-none font-bold text-[#a0cd27]">发现</span>
        <img
          alt=""
          src={imgSparkle}
          className="pointer-events-none absolute -top-[8px] -right-[10px] h-[11px] w-[9px]"
        />
        <img
          alt=""
          src={imgUnderlineDiscover}
          className="pointer-events-none absolute -bottom-[7px] left-[3px] h-[4px] w-[23px]"
        />
      </div>

      {(['角色', '故事'] as const).map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => handleTabChange(tab)}
          className="relative pb-[2px]"
        >
          <span
            className={
              activeTab === tab
                ? 'text-[14px] leading-none text-[#c7c7c7]'
                : 'text-[13px] leading-none font-bold text-[#8a8a8a]'
            }
          >
            {tab}
          </span>
          {activeTab === tab && (
            <img
              alt=""
              src={imgUnderlineTab}
              className="pointer-events-none absolute -bottom-[6px] left-1/2 h-[3px] w-[18px] -translate-x-1/2"
            />
          )}
        </button>
      ))}

      <button
        type="button"
        className="ml-auto flex items-center gap-[6px] rounded-[11px] border border-[#1e1d1d] bg-[#090909] px-[12px] py-[7px]"
      >
        <img alt="" src={imgTrophy} className="size-[12px]" />
        <span className="text-[11px] leading-none text-[#6ba70c]">排行榜</span>
      </button>
    </header>
  );
}

export function DiscoveryListSearch({
  onChange,
  placeholder,
  value,
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="mt-[18px] px-[16px]">
      <div className="flex items-center gap-[9px] rounded-[18px] border border-[#171817] bg-[#0d0d0d] py-[5px] pr-[5px] pl-[13px]">
        <img alt="" src={imgSearchIcon} className="size-[13px] shrink-0" />
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[11px] text-[#c9c9c9] outline-none placeholder:text-[#636363]"
        />
        <img alt="语音输入" src={imgMic} className="size-[28px] shrink-0" />
      </div>
    </div>
  );
}

export function DiscoveryCategoryRail({
  activeCategory,
  categories,
  onCategoryChange,
}: {
  activeCategory: string;
  categories: DiscoveryCategory[];
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="mt-[14px] flex gap-[9px] overflow-x-auto px-[16px] pb-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const active = activeCategory === category.label;
        return (
          <button
            key={category.label}
            type="button"
            onClick={() => onCategoryChange(category.label)}
            className={`flex shrink-0 items-center gap-[5px] rounded-full border px-[12px] py-[6px] transition-[border-color,background-color,color,transform] duration-150 ease-out active:scale-90 ${
              active
                ? 'border-[#97ed08] bg-[#030204] ring-1 ring-[#97ed08] ring-inset'
                : 'border-[#302e30] bg-[#030204] active:bg-[#141414]'
            }`}
          >
            {category.glyph
              ? (
                  <span className="text-[12px] leading-none">{category.glyph}</span>
                )
              : (
                  <img alt="" src={category.icon} className="size-[12px]" />
                )}
            <span
              className={`text-[11px] leading-none whitespace-nowrap ${
                active ? 'text-[#97ed08]' : 'text-[#949494]'
              }`}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function DiscoverySectionHeader({
  action = '查看更多',
  title,
}: {
  action?: string;
  title: string;
}) {
  return (
    <div className="flex items-center">
      <img alt="" src={imgSectionBar} className="mr-[7px] h-[12px] w-[3px]" />
      <h3 className="text-[12px] leading-none font-bold text-[#a7a7a7]">{title}</h3>
      <button type="button" className="ml-auto flex items-center gap-[5px]">
        <span className="text-[9px] leading-none text-[#595959]">{action}</span>
        <img alt="" src={imgSectionChevron} className="h-[8px] w-[5px]" />
      </button>
    </div>
  );
}
