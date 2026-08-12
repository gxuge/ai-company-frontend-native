import { useEffect, useRef, useState } from 'react';

import icRole from '@/assets/images/diy-agent/0fe5fbb0d1f83753d5b71f422bf0c625b38a967e.png';
import welcomeSparkles from '@/assets/images/diy-agent/3ef18fbc133dd2ffd82b31b5cf5a85186318f750.png';
import icHouse from '@/assets/images/diy-agent/5f52d8dbd154826771d981e1a62654e8f73ec66a.png';
import icAdd from '@/assets/images/diy-agent/08d5dddf78c200617ee004ba5a6b926381e576bd.png';
import icCamera from '@/assets/images/diy-agent/9fd80334acabef815f53e0cc1cf77391f1849ded.png';
import topDivider from '@/assets/images/diy-agent/36a6a0a35ec65a978e30e838d4ac3b0f3eebbd33.png';
import icPerson from '@/assets/images/diy-agent/61cd93e93fd5ad20d729457ea3b87ba097c6d26e.png';
import icMenu from '@/assets/images/diy-agent/67c79ba99f779a801852f2a92dbaade567d1aef9.png';
import icPlot from '@/assets/images/diy-agent/75bb8f1a557f4d6ff450a9e2c01f99ecb21bac38.png';
import heroSparkle from '@/assets/images/diy-agent/75d508de301704d5880097aa89acb4be0882fb37.png';
import icDots from '@/assets/images/diy-agent/099e33464ffd2983e9a4fce91cabb9405a56b429.png';
import welcomeFrame from '@/assets/images/diy-agent/613e9795be882f23f53f89c5122a0eaa9ee1fd03.png';
import inputBackground from '@/assets/images/diy-agent/791ffb9fc6dd9c1c35350d6d5d58cce923833398.png';
import heroCharacter from '@/assets/images/diy-agent/5575bd6b84da54becfba3fd6f9f7f8434ce53848.png';
import icPen from '@/assets/images/diy-agent/5626c7d3f61489f37eae1735ecc3985d3e65c05d.png';
import icWand from '@/assets/images/diy-agent/13068c91ed41693803c5cf9fdab960eaf3606efe.png';
import icBook from '@/assets/images/diy-agent/c7aad562d6b66ad64ab98a30b5472dfc687f5319.png';
import icImage from '@/assets/images/diy-agent/c7feb7ec42efe0dc3e1a90044fa344d17b832904.png';
import icWelcome from '@/assets/images/diy-agent/d05d304244aa1e7ef96a069e45898f868a918a48.png';
import quickSparkle from '@/assets/images/diy-agent/d6c69af95709148c42f81575cdc435781f6dd6f3.png';
import icMic from '@/assets/images/diy-agent/d21aed5289cbd25c036c0a2eada62581ea39e01e.png';
import heroScene from '@/assets/images/diy-agent/db3d5c16d2ca4a13595a16b57dbb6287ce0a68b6.png';
import icPlus from '@/assets/images/diy-agent/f2f89ab4a1f05a3b668e4675dad9b84eecbd6599.png';

import { DiyAgentChatTimeline } from './components/chat/diy-agent-chat-timeline';

const quickActions = [
  { icon: icPerson, title: '创建角色', desc: '打造专属角色设定' },
  { icon: icBook, title: '创建故事', desc: '开启你的故事世界' },
  { icon: icWand, title: '创建角色形象', desc: '生成角色形象与风格' },
  { icon: icImage, title: '创建故事背景', desc: '生成故事场景背景' },
];

const chips = [
  { icon: icRole, label: '捏个角色' },
  { icon: icPlot, label: '开启剧情' },
  { icon: icPen, label: '画个模样' },
  { icon: icHouse, label: '搭个场景' },
];

const DESIGN_WIDTH = 405;
const DESIGN_HEIGHT = 720;
const BOTTOM_CONTROLS_HEIGHT = 85.5;
const heroHeadingStyle = {
  color: '#bce8f9',
  fontFamily: 'var(--font-cjk)',
  fontWeight: 600,
  WebkitTextStroke: '0.2px #e7f9ff',
  textShadow: `
    -0.6px -0.6px 0 #07151e,
    0.6px -0.6px 0 #07151e,
    -0.6px 0.6px 0 #07151e,
    0.6px 0.6px 0 #07151e,
    0 1px 0 #5ba9c8,
    0 2px 0 #24576f,
    0 0 3px rgba(35, 190, 244, 0.62)
  `,
} as const;

function TopBar() {
  return (
    <header className="absolute top-0 left-0 h-[74px] w-[405px]">
      <button
        type="button"
        aria-label="菜单"
        className="absolute top-[34px] left-[7px] grid size-[36px] place-items-center rounded-full transition-transform active:scale-90"
      >
        <img src={icMenu} alt="" className="h-[13.5px] w-[14px] object-contain" />
      </button>

      <div className="absolute top-[37px] left-[301.5px] h-[30px] w-[81.5px]">
        <div className="absolute top-[2.5px] left-[2.5px] h-[25.5px] w-[77.5px] rounded-[11.5px] border border-[#686a72] bg-[#020202]" />
        <button
          type="button"
          aria-label="新建"
          className="absolute top-0 left-[15px] grid size-[30px] place-items-center transition-transform active:scale-90"
        >
          <img src={icAdd} alt="" className="size-[14px] object-contain" />
        </button>
        <img
          alt=""
          aria-hidden
          src={topDivider}
          className="absolute top-[8px] left-[40.5px] h-[14.5px] w-[0.5px] object-cover opacity-80"
        />
        <button
          type="button"
          aria-label="更多"
          className="absolute top-0 right-[8px] grid size-[30px] place-items-center transition-transform active:scale-90"
        >
          <img src={icDots} alt="" className="h-[3.5px] w-[14.5px] object-contain" />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="absolute top-[74px] left-0 h-[228px] w-[405px]">
      <img
        src={heroScene}
        alt="创作助手与你的作品"
        className="pointer-events-none absolute top-[-0.5px] left-[6.5px] h-[221px] w-[388px] object-fill"
        draggable={false}
      />
      <img
        src={heroCharacter}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-[140.5px] left-[21px] h-[68px] w-[76px] object-fill"
      />
      <h1
        className="pointer-events-none absolute top-[21px] left-[17px] m-0 text-[26px] leading-[31.5px]"
        style={heroHeadingStyle}
      >
        你好,
      </h1>
      <p
        className="pointer-events-none absolute top-[51.5px] left-[20px] m-0 text-[26px] leading-[32px] whitespace-nowrap"
        style={heroHeadingStyle}
      >
        一起创造点什么
      </p>
      <img
        src={heroSparkle}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-[94.5px] left-[17.5px] h-[12px] w-[11.5px] object-fill"
      />
      <p className="pointer-events-none absolute top-[92.5px] left-[34.5px] text-[11.5px] leading-[15.5px] text-[#d0d1d3]">
        从一个想法开始，我陪你慢慢实现
      </p>
    </section>
  );
}

function WelcomePanel() {
  return (
    <section className="absolute top-[304px] left-0 h-[308px] w-[405px]">
      <img
        src={welcomeFrame}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-[9.5px] h-[308px] w-[384px] object-fill brightness-[2.2]"
      />

      <img
        src={icWelcome}
        alt=""
        className="absolute top-[16.5px] left-[35.5px] h-[41.5px] w-[61.5px] object-fill"
      />
      <h2 className="absolute top-[26px] left-[106.5px] text-[20.5px] leading-[26px] font-bold whitespace-nowrap text-[#45b3c7]">
        欢迎来到你的创作空间！
      </h2>
      <img
        src={welcomeSparkles}
        alt=""
        aria-hidden
        className="absolute top-[30.5px] left-[335.5px] h-[23.5px] w-[25px] object-fill"
      />

      <p className="absolute top-[70.5px] left-[33.5px] text-[11px] leading-[16.9px] text-[#d0d0d3]">
        我可以帮你创建角色、故事、
        <br />
        角色形象和故事背景，陪你一起打造
        <br />
        独一无二的世界与角色。
      </p>
      <p className="absolute top-[131.5px] left-[33.5px] text-[10.5px] leading-[14.5px] text-[#c6c7ca]">
        点击下方功能即可开始创作吧~
      </p>

      <div className="absolute top-[158.5px] left-[27px] h-[0.5px] w-[349px] bg-[#9b9da5]" />

      <img
        src={quickSparkle}
        alt=""
        aria-hidden
        className="absolute top-[168px] left-[32px] h-[11px] w-[10.5px] object-fill"
      />
      <span className="absolute top-[166.5px] left-[48px] text-[10.5px] leading-[12.5px] text-[#d0d1d3]">
        快速创作
      </span>

      {quickActions.map((action, index) => {
        const isRight = index % 2 === 1;
        const isBottom = index >= 2;
        const left = isRight ? 206.5 : 29;
        const top = isBottom ? 238 : 185.5;

        return (
          <button
            key={action.title}
            type="button"
            className="absolute h-[46.5px] w-[168px] rounded-[14px] border border-[#aeb1b9] bg-[#060608] text-left transition-transform active:scale-[0.98]"
            style={{ left, top }}
          >
            <img
              src={action.icon}
              alt=""
              className="absolute top-[6.5px] left-[8px] size-[33px] object-fill"
            />
            <span className="absolute top-[11px] left-[49.5px] block w-[105px] truncate text-[10px] leading-[13.5px] text-[#ededee]">
              {action.title}
            </span>
            <span className="absolute top-[27px] left-[49.5px] block w-[108px] truncate text-[8.5px] leading-[12.5px] text-[#bcbec2]">
              {action.desc}
            </span>
          </button>
        );
      })}
    </section>
  );
}

function ShortcutChips() {
  const positions = [
    { left: 11.5, width: 84 },
    { left: 103.5, width: 87.5 },
    { left: 202.5, width: 88 },
    { left: 303, width: 87.5 },
  ];

  return (
    <nav className="relative h-[34.5px] w-[405px]" aria-label="快捷创作">
      {chips.map((chip, index) => (
        <button
          key={chip.label}
          type="button"
          className="absolute top-[1.5px] flex h-[31.5px] items-center justify-center gap-[4px] text-[10px] leading-[13px] text-[#e2e2e4] transition-transform active:scale-95"
          style={{ left: positions[index].left, width: positions[index].width }}
        >
          <span className="absolute inset-x-[1.5px] top-[2px] h-[27.5px] rounded-[13px] border border-[#aeb1b9] bg-[#030303]" />
          <img src={chip.icon} alt="" className="relative h-[18px] w-[16px] shrink-0 object-contain" />
          <span className="relative whitespace-nowrap">{chip.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Composer({
  message,
  onMessageChange,
  onSubmit,
}: {
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <footer className="relative h-[45px] w-[405px]">
      <div className="absolute top-0 left-[9.5px] h-[41.5px] w-[331px]">
        <img
          src={inputBackground}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-fill brightness-[2.3]"
        />
        <button
          type="button"
          aria-label="语音"
          className="absolute top-[3px] left-[4px] grid h-[38px] w-[37px] place-items-center transition-transform active:scale-90"
        >
          <img src={icMic} alt="" className="h-[38px] w-[37px] object-fill" />
        </button>
        <input
          value={message}
          onChange={event => onMessageChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="对话内容已开启隐私保护"
          className="absolute top-[10px] left-[60.5px] h-[21px] w-[190px] min-w-0 bg-transparent text-[10.5px] leading-[14.5px] text-white outline-none placeholder:text-[#b5b7bc]"
        />
        <button
          type="button"
          aria-label="发送"
          onClick={onSubmit}
          className="absolute top-[8px] left-[296px] grid size-[25px] place-items-center transition-transform active:scale-90"
        >
          <img src={icPlus} alt="" className="h-[19.5px] w-[19px] object-fill" />
        </button>
      </div>

      <button
        type="button"
        aria-label="拍照"
        className="absolute top-[3px] left-[347.5px] grid h-[38px] w-[42px] place-items-center transition-transform active:scale-90"
      >
        <img src={icCamera} alt="" className="h-[38px] w-[42px] object-fill" />
      </button>
    </footer>
  );
}

export default function App() {
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');
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
  const designHeight = submittedMessage ? 852 : DESIGN_HEIGHT;
  const handleSubmit = () => {
    const nextMessage = message.trim();
    if (!nextMessage) {
      return;
    }

    setSubmittedMessage(nextMessage);
    setMessage('');
  };

  return (
    <div className="h-dvh w-full overflow-x-hidden overflow-y-auto bg-black text-neutral-200">
      <div ref={containerRef} className="mx-auto w-full max-w-[520px]">
        <div className="relative w-full" style={{ height: designHeight * scale }}>
          <div
            className="absolute top-0 left-0 w-[405px] bg-black"
            style={{
              height: designHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <TopBar />
            {submittedMessage
              ? <DiyAgentChatTimeline userMessage={submittedMessage} />
              : (
                  <>
                    <Hero />
                    <WelcomePanel />
                  </>
                )}
          </div>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-50 bg-black">
        <div className="mx-auto w-full max-w-[520px]">
          <div className="relative w-full" style={{ height: BOTTOM_CONTROLS_HEIGHT * scale }}>
            <div
              className="absolute top-0 left-0 h-[85.5px] w-[405px] bg-black"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <ShortcutChips />
              <div className="absolute top-[40.5px] left-0">
                <Composer
                  message={message}
                  onMessageChange={setMessage}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
