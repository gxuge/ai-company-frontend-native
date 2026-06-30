import { router } from 'expo-router';
import { motion } from 'motion/react';

import { useEffect, useState } from 'react';
import { Bot, Inbox } from 'lucide-react';
import Env from 'env';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';

const imgFes5 = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-page/ccea1aa2c0a290c2a877e1aa8cb2442ad7ddffc6.png'));
const imgN4Yr = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-page/1292df4b4fcdb338c5b00f0f75a95168864a6fba.png'));
const imgAddUser = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-page/add_user.svg'));
const imgArrowRight = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-page/arrow_right.svg'));
const imgBookScript = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/create-page/book_script.svg'));
// The Figma canvas is 682px wide (spacer divs confirm this)
const DESIGN_WIDTH = 682;

/* ────────────────────────────────────────────
   Header
──────────────────────────────────────────── */
function Frame1() {
  return (
    <div className="absolute top-0 left-[9.85px] h-[204px] w-[372px]">
      <div
        className="absolute top-[102px] left-[9.85px] flex h-[204px] w-[372px] -translate-y-1/2 flex-col justify-center text-[92.308px] leading-[101.538px] font-black tracking-[-2.3077px] text-white"
        style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
      >
        <p className="mb-0">开启你的</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute top-0 left-[195.85px] h-[204px] w-[372px]">
      <div
        className="absolute top-[102px] left-0 flex h-[204px] w-[372px] -translate-y-1/2 flex-col justify-center text-[92.308px] leading-[101.538px] font-black tracking-[-2.3077px]"
        style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
      >
        <p className="mb-0">&nbsp;</p>
        <p className="bg-linear-to-r from-brand-green to-white bg-clip-text text-transparent">
          创作之旅
        </p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative h-[204px] w-full shrink-0 shadow-[0px_7.692px_5.769px_0px_rgba(0,0,0,0.1),0px_19.231px_15.385px_0px_rgba(0,0,0,0.04)]">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative w-full shrink-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-l-[3.846px] border-solid border-brand-green/50"
      />
      <div className="relative flex w-full flex-col items-start pl-[11.538px]">
        <div
          className="relative flex h-[53.846px] w-[434.519px] shrink-0 flex-col justify-center text-[34.615px] leading-0 font-light tracking-[0.8654px] text-[rgba(255,255,255,0.5)]"
          style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
        >
          <p className="leading-[53.846px]">Advanced AI Creative Suite</p>
        </div>
      </div>
    </div>
  );
}

function HeaderContainer() {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-[23.077px]">
      <div
        className="absolute top-[-61.54px] left-[-30.77px] size-[153.846px] rounded-[9999px] bg-brand-green opacity-20 blur-[57.692px]"
      />
      <Heading />
      <VerticalBorder />
    </div>
  );
}

/* ────────────────────────────────────────────
   Card 1 �?新人�?──────────────────────────────────────────── */
function Card1Background() {
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-center overflow-hidden bg-charcoal-950">
      <div className="absolute inset-0 size-full">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={imgFes5}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-[rgba(5,5,5,0.8)] via-50% to-[rgba(5,5,5,0)]" />
    </div>
  );
}

function Card1Content() {
  return (
    <div className="relative h-[236px] w-[393.058px] max-w-[457.692px] shrink-0">
      {/* Top: icon + title */}
      <div className="absolute top-0 right-0 left-0 flex flex-col items-start pb-[15.385px]">
        <div className="relative flex w-full shrink-0 items-center gap-[23.077px]">
          {/* Icon tile */}
          <div className="relative size-[76.923px] shrink-0 rounded-[23.077px] bg-[#1a1a24]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[23.077px] border-[1.923px] border-solid border-[#374151]"
            />
            <div className="absolute top-[16px] left-[21.77px] size-[42px] overflow-clip">
              <div className="absolute inset-[10.42%_8.33%]">
                <img src={imgAddUser} alt="" className="absolute block size-full object-contain" />
              </div>
            </div>
          </div>
          {/* Title */}
          <div
            className="relative flex h-[53.846px] w-[190.442px] shrink-0 flex-col justify-center text-[38.462px] leading-0 text-white"
            style={{ fontFamily: '\'Noto Sans SC\', sans-serif', fontWeight: 700 }}
          >
            <p className="leading-[53.846px]">新角色</p>
          </div>
        </div>
      </div>

      {/* Middle: description */}
      <div className="absolute top-1/2 right-[2.23px] left-[-2.23px] mt-[24.78px] flex -translate-y-1/2 flex-col items-start">
        <div
          className="relative flex h-[111.538px] w-[367px] shrink-0 flex-col justify-center text-[27px] leading-[40px] text-[#94a3b8]"
          style={{ fontFamily: '\'Noto Sans SC\', sans-serif', fontWeight: 400 }}
        >
          <p className="mb-0">给世界添个新面孔</p>
          <p>写下人物特质, 开始塑造吧</p>
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="absolute top-[204px] right-0 left-0 flex flex-col items-start pt-0">
        <div className="relative flex w-full shrink-0 items-center gap-1">
          <div
            className="relative flex h-[39px] w-[117px] shrink-0 flex-col justify-center text-[28px] leading-0 text-brand-green"
            style={{ fontFamily: '\'Noto Sans SC\', sans-serif', fontWeight: 700 }}
          >
            <p className="leading-[28px]">开始创建</p>
          </div>
          <div className="relative h-[24px] w-[25px] shrink-0">
            <img src={imgArrowRight} alt="" className="absolute block size-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div
      className="relative w-full shrink-0 cursor-pointer rounded-[46.154px]"
      onClick={() => router.push('/pages/create-role')}
    >
      <div className="relative flex w-full flex-col items-start overflow-clip rounded-[inherit] p-[1.923px]">
        <div className="relative min-h-[269.231px] w-full shrink-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-2 border-solid border-brand-green"
          />
          <div className="flex size-full min-h-[inherit] flex-row items-center">
            <div className="relative flex min-h-[inherit] w-full items-center p-[46.154px]">
              <Card1Background />
              <Card1Content />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[46.154px] border-[1.923px] border-solid border-brand-green"
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   Card 2 �?新剧�?──────────────────────────────────────────── */
function Card2Background() {
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-center overflow-hidden bg-charcoal-950">
      <div className="absolute inset-0 size-full">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={imgN4Yr}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-[rgba(5,5,5,0.8)] via-50% to-[rgba(5,5,5,0)]" />
    </div>
  );
}

function Card2Content() {
  return (
    <div className="relative h-[236px] w-[393.058px] max-w-[457.692px] shrink-0">
      {/* Top: icon + title */}
      <div className="absolute top-0 right-0 left-0 flex flex-col items-start pb-[15.385px]">
        <div className="relative flex w-full shrink-0 items-center gap-[23.077px]">
          {/* Icon tile */}
          <div className="relative size-[76.923px] shrink-0 rounded-[23.077px] bg-[#1a1a24]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[23.077px] border-[1.923px] border-solid border-[#374151]"
            />
            <div className="absolute top-1/2 left-1/2 -mt-[3px] ml-[2px] h-[32.903px] w-[35.306px] -translate-1/2">
              <img src={imgBookScript} alt="" className="absolute block size-full object-contain" />
            </div>
          </div>
          {/* Title */}
          <div
            className="relative flex h-[53.846px] w-[190.442px] shrink-0 flex-col justify-center text-[38.462px] leading-0 text-white"
            style={{ fontFamily: '\'Noto Sans SC\', sans-serif', fontWeight: 700 }}
          >
            <p className="leading-[53.846px]">新剧本</p>
          </div>
        </div>
      </div>

      {/* Middle: description */}
      <div className="absolute top-1/2 right-[0.23px] left-[-0.23px] mt-[22.41px] flex -translate-y-1/2 flex-col items-start">
        <div
          className="relative flex h-[111.538px] w-[367px] shrink-0 flex-col justify-center text-[27px] leading-[40px] text-[#94a3b8]"
          style={{ fontFamily: '\'Noto Sans SC\', sans-serif', fontWeight: 400 }}
        >
          <p className="mb-0">打造引人入胜的互动叙事</p>
          <p>开启全新篇章</p>
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="absolute top-[204px] right-0 left-0 flex flex-col items-start pt-0">
        <div className="relative flex w-full shrink-0 items-center gap-1">
          <div
            className="relative flex h-[39px] w-[117px] shrink-0 flex-col justify-center text-[28px] leading-0 text-brand-green"
            style={{ fontFamily: '\'Noto Sans SC\', sans-serif', fontWeight: 700 }}
          >
            <p className="leading-[28px]">开始创作</p>
          </div>
          <div className="relative h-[24px] w-[25px] shrink-0">
            <img src={imgArrowRight} alt="" className="absolute block size-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div
      className="relative w-full shrink-0 cursor-pointer rounded-[46.154px]"
      onClick={() => router.push('/pages/create-story')}
    >
      <div className="relative flex w-full flex-col items-start overflow-clip rounded-[inherit] p-[1.923px]">
        <div className="relative min-h-[269.231px] w-full shrink-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-2 border-solid border-brand-green"
          />
          <div className="flex size-full min-h-[inherit] flex-row items-center">
            <div className="relative flex min-h-[inherit] w-full items-center p-[46.154px]">
              <Card2Background />
              <Card2Content />
              <div className="absolute top-1/2 right-[-30.77px] mt-[0.01px] size-[184.615px] -translate-y-1/2 rounded-[9999px] bg-brand-green/5 blur-[38.462px]" />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[46.154px] border-[1.923px] border-solid border-brand-green"
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   Main content block
──────────────────────────────────────────── */
function Main() {
  return (
    <div className="relative w-full shrink-0 bg-[#0d0d11]">
      <div className="flex size-full flex-col justify-center overflow-clip">
        <div className="relative flex w-full flex-col items-start justify-center px-[46.154px] py-[180px]">
          <HeaderContainer />
          {/* 23px spacer */}
          <div className="h-[23px] w-[682px] shrink-0" />

          {/* Card1 �?淡入 + 上移，延�?0.1s */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 22, delay: 0.15 }}
          >
            <Card1 />
          </motion.div>

          {/* 43px spacer */}
          <div className="h-[43px] w-[682px] shrink-0" />

          {/* Card2 �?淡入 + 上移，延�?0.25s（错开产生层叠感） */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
          >
            <Card2 />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const imgClose = require('../../../assets/images/quick-login/svg/p62a9900.svg');

/* ────────────────────────────────────────────
   Close button
──────────────────────────────────────────── */
function CloseButton() {
  return (
    <div className="absolute top-[46.15px] left-[46.15px] z-10">
      <AiCloseBtn
        iconSource={imgClose}
        customWidth="w-[77px]"
        customHeight="h-[77px]"
        iconWidth={35}
        iconHeight={35}
        onPress={() => router.canGoBack() ? router.back() : router.navigate('../')}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   Draft Box Button
──────────────────────────────────────────── */
function DraftBoxButton() {
  return (
    <div className="absolute top-[46.15px] right-[46.15px] z-10">
      <button
        type="button"
        onClick={() => router.push('/pages/draft')}
        className="flex h-[77px] items-center gap-[12px] rounded-[38.5px] border-[2px] border-solid border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-[24px] backdrop-blur-[10px] active:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
      >
        <Inbox size={32} color="#9ca3af" />
        <span
          className="text-[26px] font-bold text-white tracking-[1px]"
          style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
        >
          草稿箱
        </span>
        <span className="flex h-[36px] min-w-[36px] items-center justify-center rounded-full bg-brand-green px-[10px] text-[20px] font-bold text-black">
          0
        </span>
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────
   AI Assistant Button
──────────────────────────────────────────── */
function AiAssistantButton() {
  const appId = Env.EXPO_PUBLIC_AIRAG_PROMPT_CHAT_APP_ID?.trim() || '';
  const agentCode = Env.EXPO_PUBLIC_TS_AGENT_CHAT_AGENT_CODE?.trim() || 'admin_chat';

  return (
    <div className="absolute bottom-[46.15px] right-[46.15px] z-10">
      <button
        type="button"
        onClick={() => router.push({
          pathname: '/pages/admin-chat',
          params: {
            ...(appId ? { appId } : {}),
            ...(agentCode ? { agentCode } : {}),
          },
        })}
        className="flex h-[77px] items-center gap-[12px] rounded-[38.5px] border-[2px] border-solid border-brand-green bg-brand-green/10 px-[24px] backdrop-blur-[10px] active:bg-brand-green/20 transition-colors cursor-pointer shadow-[0_0_15px_rgba(155,254,3,0.3)]"
      >
        <Bot size={32} color='var(--color-brand-green)' />
        <span
          className="text-[26px] font-bold text-brand-green tracking-[1px]"
          style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
        >
          AI 助手
        </span>
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────
   Root ?handles proportional scaling
──────────────────────────────────────────── */
export default function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(window.innerWidth / DESIGN_WIDTH);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    // Outer shell: full viewport, clips horizontal overflow
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        background: '#0d0d11',
      }}
    >
      {/* Inner design canvas at native 682px, then scaled with zoom */}
      <div
        style={{
          width: DESIGN_WIDTH,
          zoom: scale,
        }}
      >
        {/* Body ?matches original Figma root structure */}
        <div className="relative flex flex-col items-start bg-[#0d0d11]">
          <Main />
          <CloseButton />
          <DraftBoxButton />
          <AiAssistantButton />
        </div>
      </div>
    </div>
  );
}
