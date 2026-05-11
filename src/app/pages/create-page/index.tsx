import { useEffect, useState } from "react";
import { motion } from "motion/react";
const imgFes5 = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/ccea1aa2c0a290c2a877e1aa8cb2442ad7ddffc6.png"));
const imgN4Yr = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/1292df4b4fcdb338c5b00f0f75a95168864a6fba.png"));
const imgAddUser = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/add_user.svg"));
const imgArrowRight = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/arrow_right.svg"));
const imgBookScript = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/book_script.svg"));
// The Figma canvas is 682px wide (spacer divs confirm this)
const DESIGN_WIDTH = 682;

/* ────────────────────────────────────────────
   Header
──────────────────────────────────────────── */
function Frame1() {
  return (
    <div className="absolute h-[204px] left-[9.85px] top-0 w-[372px]">
      <div
        className="-translate-y-1/2 absolute flex flex-col font-black h-[204px] justify-center leading-[101.538px] left-[9.85px] text-[92.308px] text-white top-[102px] tracking-[-2.3077px] w-[372px]"
        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
      >
        <p className="mb-0">开启你的</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[204px] left-[195.85px] top-0 w-[372px]">
      <div
        className="-translate-y-1/2 absolute flex flex-col font-black h-[204px] justify-center leading-[101.538px] left-0 text-[92.308px] top-[102px] tracking-[-2.3077px] w-[372px]"
        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
      >
        <p className="mb-0">&nbsp;</p>
        <p className="bg-clip-text bg-gradient-to-r from-[#9bfe03] text-transparent to-white">
          创作之旅
        </p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[204px] relative shadow-[0px_7.692px_5.769px_0px_rgba(0,0,0,0.1),0px_19.231px_15.385px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative shrink-0 w-full">
      <div
        aria-hidden="true"
        className="absolute border-[rgba(155,254,3,0.5)] border-l-[3.846px] border-solid inset-0 pointer-events-none"
      />
      <div className="flex flex-col items-start pl-[11.538px] relative w-full">
        <div
          className="flex flex-col font-light h-[53.846px] justify-center leading-[0] relative shrink-0 text-[34.615px] text-[rgba(255,255,255,0.5)] tracking-[0.8654px] w-[434.519px]"
          style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
        >
          <p className="leading-[53.846px]">Advanced AI Creative Suite</p>
        </div>
      </div>
    </div>
  );
}

function HeaderContainer() {
  return (
    <div className="flex flex-col gap-[23.077px] items-start relative shrink-0 w-full">
      <div
        className="absolute bg-[#9bfe03] blur-[57.692px] left-[-30.77px] opacity-20 rounded-[9999px] size-[153.846px] top-[-61.54px]"
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
    <div className="absolute bg-[#121212] flex flex-col inset-0 items-start justify-center overflow-hidden">
      <div className="absolute inset-0 size-full">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgFes5}
        />
      </div>
      <div className="absolute bg-gradient-to-r from-[#050505] inset-0 to-[rgba(5,5,5,0)] via-[50%] via-[rgba(5,5,5,0.8)]" />
    </div>
  );
}

function Card1Content() {
  return (
    <div className="h-[236px] max-w-[457.692px] relative shrink-0 w-[393.058px]">
      {/* Top: icon + title */}
      <div className="absolute flex flex-col items-start left-0 pb-[15.385px] right-0 top-0">
        <div className="flex gap-[23.077px] items-center relative shrink-0 w-full">
          {/* Icon tile */}
          <div className="bg-[#1a1a24] relative rounded-[23.077px] shrink-0 size-[76.923px]">
            <div
              aria-hidden="true"
              className="absolute border-[#374151] border-[1.923px] border-solid inset-0 pointer-events-none rounded-[23.077px]"
            />
            <div className="absolute left-[21.77px] overflow-clip size-[42px] top-[16px]">
              <div className="absolute inset-[10.42%_8.33%]">
                <img src={imgAddUser} alt="" className="absolute block size-full object-contain" />
              </div>
            </div>
          </div>
          {/* Title */}
          <div
            className="flex flex-col h-[53.846px] justify-center leading-[0] relative shrink-0 text-[38.462px] text-white w-[190.442px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[53.846px]">新形象</p>
          </div>
        </div>
      </div>

      {/* Middle: description */}
      <div className="-translate-y-1/2 absolute flex flex-col items-start left-[-2.23px] right-[2.23px] top-1/2 mt-[24.78px]">
        <div
          className="flex flex-col h-[111.538px] justify-center leading-[40px] relative shrink-0 text-[#94a3b8] text-[27px] w-[367px]"
          style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}
        >
          <p className="mb-0">给世界添个新面孔</p>
          <p>写下人物特质, 开始塑造吧</p>
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="absolute flex flex-col items-start left-0 pt-0 right-0 top-[204px]">
        <div className="flex items-center gap-1 relative shrink-0 w-full">
          <div
            className="flex flex-col h-[39px] justify-center leading-[0] relative shrink-0 text-[#9bfe03] text-[28px] w-[117px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[28px]">开始创建</p>
          </div>
          <div className="h-[24px] relative shrink-0 w-[25px]">
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
      className="relative rounded-[46.154px] shrink-0 w-full cursor-pointer"
      onClick={() => router.push("/pages/create-role")}
    >
      <div className="flex flex-col items-start overflow-clip p-[1.923px] relative rounded-[inherit] w-full">
        <div className="min-h-[269.231px] relative shrink-0 w-full">
          <div
            aria-hidden="true"
            className="absolute border-2 border-[#9bfe03] border-solid inset-0 pointer-events-none"
          />
          <div className="flex flex-row items-center min-h-[inherit] size-full">
            <div className="flex items-center min-h-[inherit] p-[46.154px] relative w-full">
              <Card1Background />
              <Card1Content />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#9bfe03] border-[1.923px] border-solid inset-0 pointer-events-none rounded-[46.154px]"
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   Card 2 �?新剧�?──────────────────────────────────────────── */
function Card2Background() {
  return (
    <div className="absolute bg-[#121212] flex flex-col inset-0 items-start justify-center overflow-hidden">
      <div className="absolute inset-0 size-full">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgN4Yr}
        />
      </div>
      <div className="absolute bg-gradient-to-r from-[#050505] inset-0 to-[rgba(5,5,5,0)] via-[50%] via-[rgba(5,5,5,0.8)]" />
    </div>
  );
}

function Card2Content() {
  return (
    <div className="h-[236px] max-w-[457.692px] relative shrink-0 w-[393.058px]">
      {/* Top: icon + title */}
      <div className="absolute flex flex-col items-start left-0 pb-[15.385px] right-0 top-0">
        <div className="flex gap-[23.077px] items-center relative shrink-0 w-full">
          {/* Icon tile */}
          <div className="bg-[#1a1a24] relative rounded-[23.077px] shrink-0 size-[76.923px]">
            <div
              aria-hidden="true"
              className="absolute border-[#374151] border-[1.923px] border-solid inset-0 pointer-events-none rounded-[23.077px]"
            />
            <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[32.903px] left-1/2 ml-[2px] top-1/2 -mt-[3px] w-[35.306px]">
              <img src={imgBookScript} alt="" className="absolute block size-full object-contain" />
            </div>
          </div>
          {/* Title */}
          <div
            className="flex flex-col h-[53.846px] justify-center leading-[0] relative shrink-0 text-[38.462px] text-white w-[190.442px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[53.846px]">新剧本</p>
          </div>
        </div>
      </div>

      {/* Middle: description */}
      <div className="-translate-y-1/2 absolute flex flex-col items-start left-[-0.23px] right-[0.23px] top-1/2 mt-[22.41px]">
        <div
          className="flex flex-col h-[111.538px] justify-center leading-[40px] relative shrink-0 text-[#94a3b8] text-[27px] w-[367px]"
          style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}
        >
          <p className="mb-0">打造引人入胜的互动叙事</p>
          <p>开启全新篇章</p>
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="absolute flex flex-col items-start left-0 pt-0 right-0 top-[204px]">
        <div className="flex items-center gap-1 relative shrink-0 w-full">
          <div
            className="flex flex-col h-[39px] justify-center leading-[0] relative shrink-0 text-[#9bfe03] text-[28px] w-[117px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[28px]">开始创作</p>
          </div>
          <div className="h-[24px] relative shrink-0 w-[25px]">
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
      className="relative rounded-[46.154px] shrink-0 w-full cursor-pointer"
      onClick={() => router.push("/pages/create-story")}
    >
      <div className="flex flex-col items-start overflow-clip p-[1.923px] relative rounded-[inherit] w-full">
        <div className="min-h-[269.231px] relative shrink-0 w-full">
          <div
            aria-hidden="true"
            className="absolute border-2 border-[#9bfe03] border-solid inset-0 pointer-events-none"
          />
          <div className="flex flex-row items-center min-h-[inherit] size-full">
            <div className="flex items-center min-h-[inherit] p-[46.154px] relative w-full">
              <Card2Background />
              <Card2Content />
              <div className="-translate-y-1/2 absolute bg-[rgba(155,254,3,0.05)] blur-[38.462px] right-[-30.77px] rounded-[9999px] size-[184.615px] top-1/2 mt-[0.01px]" />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#9bfe03] border-[1.923px] border-solid inset-0 pointer-events-none rounded-[46.154px]"
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   Main content block
──────────────────────────────────────────── */
function Main() {
  return (
    <div className="bg-[#0d0d11] relative shrink-0 w-full">
      <div className="flex flex-col justify-center overflow-clip size-full">
        <div className="flex flex-col items-start justify-center px-[46.154px] py-[180px] relative w-full">
          <HeaderContainer />
          {/* 23px spacer */}
          <div className="h-[23px] shrink-0 w-[682px]" />

          {/* Card1 �?淡入 + 上移，延�?0.1s */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.15 }}
          >
            <Card1 />
          </motion.div>

          {/* 43px spacer */}
          <div className="h-[43px] shrink-0 w-[682px]" />

          {/* Card2 �?淡入 + 上移，延�?0.25s（错开产生层叠感） */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
          >
            <Card2 />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { AiCloseBtn } from "@/components/ai-company/ai-close-btn";
import { router } from "expo-router";

const imgClose = require("../../../assets/images/quick-login/svg/p62a9900.svg");

/* ────────────────────────────────────────────
   Close button
──────────────────────────────────────────── */
function CloseButton() {
  return (
    <div className="absolute left-[46.15px] top-[46.15px] z-10">
      <AiCloseBtn
        iconSource={imgClose}
        customWidth="w-[77px]"
        customHeight="h-[77px]"
        iconWidth={35}
        iconHeight={35}
        onPress={() => router.canGoBack() ? router.back() : router.navigate("../")}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   Root �?handles proportional scaling
──────────────────────────────────────────── */
export default function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(window.innerWidth / DESIGN_WIDTH);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    // Outer shell: full viewport, clips horizontal overflow
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",
        background: "#0d0d11",
      }}
    >
      {/* Inner design canvas at native 682px, then scaled with zoom */}
      <div
        style={{
          width: DESIGN_WIDTH,
          zoom: scale,
        }}
      >
        {/* Body �?matches original Figma root structure */}
        <div className="bg-[#0d0d11] flex flex-col items-start relative">
          <Main />
          <CloseButton />
        </div>
      </div>
    </div>
  );
}

