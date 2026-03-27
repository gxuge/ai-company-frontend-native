import { useEffect, useState } from "react";
const svgPaths = {
p14236b80: "M13.125 21.9016C20.2419 21.9016 26.25 23.0726 26.25 27.5953C26.25 32.118 20.2034 33.25 13.125 33.25C6.00811 33.25 0 32.0772 0 27.5563C0 23.0336 6.04489 21.9016 13.125 21.9016ZM29.7482 8.75C30.6166 8.75 31.3214 9.46653 31.3214 10.3453V12.4038H33.4268C34.2934 12.4038 35 13.1203 35 13.9991C35 14.8779 34.2934 15.5944 33.4268 15.5944H31.3214V17.6547C31.3214 18.5335 30.6166 19.25 29.7482 19.25C28.8816 19.25 28.175 18.5335 28.175 17.6547V15.5944H26.0732C25.2048 15.5944 24.5 14.8779 24.5 13.9991C24.5 13.1203 25.2048 12.4038 26.0732 12.4038H28.175V10.3453C28.175 9.46653 28.8816 8.75 29.7482 8.75ZM13.125 0C17.9455 0 21.8096 3.9141 21.8096 8.79697C21.8096 13.6798 17.9455 17.5939 13.125 17.5939C8.3045 17.5939 4.44039 13.6798 4.44039 8.79697C4.44039 3.9141 8.3045 0 13.125 0Z",
p2bd2d700: "M12.36 27.9131L12.3439 27.9161L12.2404 27.9671L12.2112 27.9729L12.1908 27.9671L12.0873 27.9161C12.0717 27.9112 12.0601 27.9136 12.0523 27.9233L12.0464 27.9379L12.0216 28.5621L12.0289 28.5913L12.0435 28.6102L12.1952 28.7181L12.2171 28.724L12.2346 28.7181L12.3862 28.6102L12.4037 28.5869L12.4096 28.5621L12.3848 27.9394C12.3809 27.9238 12.3726 27.9151 12.36 27.9131ZM12.7464 27.7483L12.7275 27.7513L12.4577 27.8869L12.4431 27.9015L12.4387 27.9175L12.465 28.5446L12.4723 28.5621L12.4839 28.5723L12.7771 28.7079C12.7955 28.7128 12.8096 28.7089 12.8194 28.6963L12.8252 28.6758L12.7756 27.7804C12.7707 27.7629 12.761 27.7522 12.7464 27.7483ZM11.7037 27.7513C11.6973 27.7474 11.6896 27.7461 11.6823 27.7477C11.675 27.7494 11.6685 27.7538 11.6644 27.76L11.6556 27.7804L11.606 28.6758C11.607 28.6933 11.6153 28.705 11.6308 28.7108L11.6527 28.7079L11.9458 28.5723L11.9604 28.5606L11.9662 28.5446L11.991 27.9175L11.9866 27.9L11.9721 27.8854L11.7037 27.7513Z",
p2be67400: "M11.4952 14.5898L19.2287 22.3233C19.6391 22.7337 20.1957 22.9642 20.776 22.9642C21.3564 22.9642 21.9129 22.7337 22.3233 22.3233C22.7337 21.913 22.9642 21.3564 22.9642 20.776C22.9642 20.1957 22.7337 19.6391 22.3233 19.2288L14.5869 11.4952L22.3219 3.76167C22.525 3.55848 22.686 3.31727 22.7959 3.05183C22.9058 2.78638 22.9623 2.50189 22.9623 2.2146C22.9622 1.92731 22.9055 1.64284 22.7955 1.37744C22.6855 1.11205 22.5243 0.870918 22.3211 0.667821C22.1179 0.464723 21.8767 0.303637 21.6113 0.193758C21.3458 0.0838789 21.0613 0.0273597 20.7741 0.0274274C20.4868 0.0274951 20.2023 0.0841481 19.9369 0.194152C19.6715 0.304156 19.4304 0.465357 19.2273 0.66855L11.4952 8.40209L3.76165 0.66855C3.55996 0.459529 3.31866 0.292768 3.05183 0.178C2.785 0.0632309 2.49798 0.00275171 2.20753 9.17346e-05C1.91708 -0.00256824 1.62901 0.0526438 1.36012 0.162506C1.09123 0.272369 0.846919 0.434682 0.641433 0.639975C0.435947 0.845267 0.273404 1.08943 0.163288 1.35821C0.0531714 1.62699 -0.00231228 1.91502 7.38161e-05 2.20547C0.00245991 2.49592 0.0626677 2.783 0.177185 3.04993C0.291702 3.31687 0.458235 3.55833 0.667066 3.76022L8.40352 11.4952L0.668525 19.2302C0.459694 19.4321 0.293161 19.6736 0.178644 19.9405C0.0641267 20.2074 0.00391814 20.4945 0.00153204 20.785C-0.000854048 21.0754 0.0546296 21.3634 0.164746 21.6322C0.274862 21.901 0.437405 22.1452 0.642891 22.3505C0.848378 22.5557 1.09269 22.7181 1.36158 22.8279C1.63046 22.9378 1.91854 22.993 2.20899 22.9903C2.49944 22.9877 2.78646 22.9272 3.05329 22.8124C3.32012 22.6977 3.56142 22.5309 3.76311 22.3219L11.4952 14.5898Z",
p2d24f200: "M13.4885 4.56152L12.0775 5.97852L17.1205 10.9995H3.5415V12.9995H17.1195L12.0775 18.0215L13.4885 19.4385L20.9585 11.9995L13.4885 4.56152Z",
p35d77a00: "M28.8462 0L20.8834 8.03786V25.6911L28.8462 18.4796V0ZM0 8.03786V31.5505C0 31.7508 0.0876402 31.9261 0.262921 32.0763C0.438201 32.2266 0.626002 32.3017 0.826322 32.3017C0.926482 32.3017 1.0016 32.2892 1.05168 32.2641C1.10176 32.2391 1.15184 32.2266 1.20192 32.2266C2.30369 31.7258 3.55569 31.3126 4.95793 30.9871C6.36018 30.6616 7.66226 30.4988 8.86418 30.4988C10.4167 30.4988 11.9817 30.6741 13.5592 31.0246C15.1367 31.3752 16.5014 32.0012 17.6532 32.9026V8.03786C16.5014 7.13642 15.1367 6.51042 13.5592 6.15986C11.9817 5.80929 10.4167 5.63401 8.86418 5.63401C7.26162 5.63401 5.68409 5.80929 4.13161 6.15986C2.57913 6.51042 1.20192 7.13642 0 8.03786ZM35.3065 29.6725V8.03786C34.8057 7.6873 34.2924 7.38682 33.7665 7.13642C33.2407 6.88602 32.6773 6.66066 32.0763 6.46034V28.095C31.1749 27.7945 30.2609 27.5816 29.3344 27.4564C28.408 27.3312 27.4439 27.2686 26.4423 27.2686C25.5409 27.2686 24.5518 27.3688 23.4751 27.5691C22.3983 27.7694 21.3341 28.0574 20.2825 28.433C19.2308 28.8086 18.3544 29.2218 17.6532 29.6725V32.9026C18.3544 32.4519 19.2308 32.0388 20.2825 31.6632C21.3341 31.2876 22.3983 30.9996 23.4751 30.7993C24.5518 30.599 25.5409 30.4988 26.4423 30.4988C27.7945 30.4988 29.1216 30.624 30.4237 30.8744C31.7258 31.1248 32.9527 31.5505 34.1046 32.1514C34.2047 32.2015 34.3299 32.2266 34.4802 32.2266C34.6805 32.2266 34.8683 32.1389 35.0436 31.9636C35.2189 31.7884 35.3065 31.6006 35.3065 31.4002V29.6725Z",
};
const imgFes5 = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/ccea1aa2c0a290c2a877e1aa8cb2442ad7ddffc6.png"));
const imgN4Yr = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-page/1292df4b4fcdb338c5b00f0f75a95168864a6fba.png"));
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
   Card 1 — 新人物
──────────────────────────────────────────── */
function Card1Background() {
  return (
    <div className="absolute bg-[#121212] flex flex-col inset-0 items-start justify-center">
      <div className="aspect-[2752/1536] relative shrink-0 w-full">
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
    <div className="h-[272.596px] max-w-[457.692px] relative shrink-0 w-[393.058px]">
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
                <svg
                  className="absolute block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 35 33.25"
                >
                  <path d={svgPaths.p14236b80} fill="#9BFE03" />
                </svg>
              </div>
            </div>
          </div>
          {/* Title */}
          <div
            className="flex flex-col h-[53.846px] justify-center leading-[0] relative shrink-0 text-[38.462px] text-white w-[190.442px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[53.846px]">新人物</p>
          </div>
        </div>
      </div>

      {/* Middle: description */}
      <div className="-translate-y-1/2 absolute flex flex-col items-start left-[-2.23px] right-[2.23px] top-[calc(50%+24.78px)]">
        <div
          className="flex flex-col h-[111.538px] justify-center leading-[40px] relative shrink-0 text-[#94a3b8] text-[27px] w-[367px]"
          style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}
        >
          <p className="mb-0">给世界添个新面孔</p>
          <p>写下人物特质, 开始塑造吧</p>
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="absolute flex flex-col items-start left-0 pt-[30.769px] right-0 top-[203.37px]">
        <div className="flex items-center relative shrink-0 w-full">
          <div className="flex items-center justify-between pl-[7.692px] relative shrink-0 w-[148px]">
            <div
              className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#9bfe03] text-[28px] whitespace-nowrap"
              style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
            >
              <p className="leading-[28px]">开始创建</p>
            </div>
            <div className="h-[24px] relative shrink-0 w-[25px]">
              <svg
                className="absolute block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 25 24"
              >
                <path
                  clipRule="evenodd"
                  d={svgPaths.p2d24f200}
                  fill="#9BFE03"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="relative rounded-[46.154px] shrink-0 w-full">
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
   Card 2 — 新剧情
──────────────────────────────────────────── */
function Card2Background() {
  return (
    <div className="absolute bg-[#121212] flex flex-col inset-0 items-start justify-center">
      <div className="aspect-[2752/1536] relative shrink-0 w-full">
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
    <div className="h-[272.596px] max-w-[457.692px] relative shrink-0 w-[393.058px]">
      {/* Top: icon + title */}
      <div className="absolute flex flex-col items-start left-0 pb-[15.385px] right-0 top-0">
        <div className="flex gap-[23.077px] items-center relative shrink-0 w-full">
          {/* Icon tile */}
          <div className="bg-[#1a1a24] relative rounded-[23.077px] shrink-0 size-[76.923px]">
            <div
              aria-hidden="true"
              className="absolute border-[#374151] border-[1.923px] border-solid inset-0 pointer-events-none rounded-[23.077px]"
            />
            <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[32.903px] left-[calc(50%+2px)] top-[calc(50%-3px)] w-[35.306px]">
              <svg
                className="absolute block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 35.3065 32.9026"
              >
                <path d={svgPaths.p35d77a00} fill="#9BFE03" />
              </svg>
            </div>
          </div>
          {/* Title */}
          <div
            className="flex flex-col h-[53.846px] justify-center leading-[0] relative shrink-0 text-[38.462px] text-white w-[190.442px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[53.846px]">新剧情</p>
          </div>
        </div>
      </div>

      {/* Middle: description */}
      <div className="-translate-y-1/2 absolute flex flex-col items-start left-[-0.23px] right-[0.23px] top-[calc(50%+22.41px)]">
        <div
          className="flex flex-col h-[111.538px] justify-center leading-[40px] relative shrink-0 text-[#94a3b8] text-[27px] w-[367px]"
          style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400 }}
        >
          <p className="mb-0">编织有趣的互动叙事</p>
          <p>开启全新篇章</p>
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="absolute flex flex-col items-start left-0 pt-[30.769px] right-0 top-[203.37px]">
        <div className="flex items-center relative shrink-0 w-full">
          <div
            className="flex flex-col h-[39px] justify-center leading-[0] relative shrink-0 text-[#9bfe03] text-[28px] w-[117px]"
            style={{ fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 700 }}
          >
            <p className="leading-[28px]">开始创作</p>
          </div>
          <div className="h-[24px] relative shrink-0 w-[25px]">
            <svg
              className="absolute block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 25 24"
            >
              <path
                clipRule="evenodd"
                d={svgPaths.p2d24f200}
                fill="#9BFE03"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="relative rounded-[46.154px] shrink-0 w-full">
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
              <div className="-translate-y-1/2 absolute bg-[rgba(155,254,3,0.05)] blur-[38.462px] right-[-30.77px] rounded-[9999px] size-[184.615px] top-[calc(50%+0.01px)]" />
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
          <Card1 />
          {/* 43px spacer */}
          <div className="h-[43px] shrink-0 w-[682px]" />
          <Card2 />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Close button
──────────────────────────────────────────── */
function CloseButton() {
  return (
    <div className="absolute backdrop-blur-[11.538px] bg-[rgba(255,255,255,0.1)] flex items-center justify-center left-[46.15px] rounded-[9999px] size-[76.923px] top-[46.15px]">
      {/* Icon container sized to match original: 35px */}
      <div className="overflow-clip relative shrink-0 size-[35px]">
        <div className="absolute inset-[17.16%_17.23%_0.78%_17.16%]">
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 22.9642 28.724"
          >
            <path
              clipRule="evenodd"
              d={svgPaths.p2bd2d700}
              fill="white"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d={svgPaths.p2be67400}
              fill="white"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Root — handles proportional scaling
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
        {/* Body — matches original Figma root structure */}
        <div className="bg-[#0d0d11] flex flex-col items-start relative">
          <Main />
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
