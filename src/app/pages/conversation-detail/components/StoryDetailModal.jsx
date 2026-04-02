import svgPaths from "../../../../assets/images/story-detail/svg-m13tfs0op9";

/* ── Inline helpers ── */

function GlowText({ children }) {
  return (
    <span
      className="inline text-white font-['Noto_Sans_SC',sans-serif]"
      style={{
        borderBottom: "2px solid rgba(155,254,3,0.5)",
        textShadow: "0px 0px 10px rgba(155,254,3,0.6)",
      }}
    >
      {children}
    </span>
  );
}

function TagPill({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-full align-baseline font-['Noto_Sans_SC',sans-serif] px-[8px] md:px-[13px] py-[1px] md:py-[2px] mx-[1px] md:mx-[2px] text-[14px] md:text-[25.6px]"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1.5px solid rgba(255,255,255,0.1)",
        color: "#e5e5e5",
        lineHeight: "1.6",
      }}
    >
      {children}
    </span>
  );
}

function BoldWhite({ children }) {
  return <span className="text-white font-medium font-['Noto_Sans_SC',sans-serif]">{children}</span>;
}

function SectionHeading({ title }) {
  return (
    <div className="flex items-center rounded-tr-[15px] md:rounded-tr-[30px] rounded-br-[15px] md:rounded-br-[30px] overflow-hidden py-[6px] md:py-[11px]">
      <div
        className="shrink-0 self-stretch w-[3px] md:w-[4px]"
        style={{ background: "rgba(155,254,3,0.9)" }}
      />
      <span 
        className="pl-3 md:pl-5 text-white font-bold font-['Noto_Sans_SC',sans-serif] text-[18px] md:text-[30px] leading-[26px] md:leading-[44px]"
      >
        {title}
      </span>
    </div>
  );
}

/* ── Close button icon ── */
function CloseIcon() {
  return (
    <svg width="23" height="29" viewBox="0 0 23 29" fill="none">
      <path d={svgPaths.p2be67400} fill="white" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

/* ── Modal ── */

export default function StoryDetailModal({ onClose = () => {} }) {
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-[30px]">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute z-[60] flex items-center justify-center top-4 left-4 md:top-[46px] md:left-[46px] w-12 h-12 md:w-[60px] md:h-[60px]"
        style={{
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "none",
        }}
      >
        <CloseIcon />
      </button>

      {/* Card */}
      <div
        className="relative z-[55] flex flex-col overflow-hidden w-full max-w-[654px] h-full"
        style={{
          maxHeight: "90vh",
          background: "#161616",
          borderRadius: "20px",
          border: "2px solid #424242",
        }}
      >
        {/* Top gradient overlay */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: "80px",
            background: "linear-gradient(to bottom, #161616 0%, rgba(22,22,22,0) 100%)",
          }}
        />

        {/* Title Section */}
        <div className="absolute top-0 left-0 right-0 z-20 px-5 md:px-[46px] pt-6 md:pt-[46px]">
          <h2
            className="text-white font-bold font-['Noto_Sans_SC',sans-serif] text-[24px] md:text-[38px] leading-[34px] md:leading-[54px]"
          >
            故事详情
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto relative pb-8">
          {/* Content wrapper */}
          <div className="px-5 md:px-[30px] pt-[100px] md:pt-[148px]">
            {/* Sections */}
            <div className="flex flex-col gap-8 md:gap-[46px]">
              {/* Section 1 - 核心冲突 */}
              <div className="flex flex-col gap-4 md:gap-[23px]">
                <SectionHeading title="核心冲突" />
                <div
                  className="text-[#d1d5db] font-['Noto_Sans_SC',sans-serif] text-[15px] md:text-[27px] leading-[26px] md:leading-[44px]"
                >
                  这是一个<BoldWhite>架空的古代王朝</BoldWhite>背景。在这个世界中，<GlowText>姬氏皇族</GlowText>统治着广袤的<TagPill>中原大地</TagPill>，然而权力的中心并非表面那样平静，暗流涌动，各方势力犬牙交错。
                </div>
              </div>

              {/* Section 2 - 核心冲突 */}
              <div className="flex flex-col gap-4 md:gap-[23px]">
                <SectionHeading title="核心冲突" />
                <div
                  className="text-[#d1d5db] font-['Noto_Sans_SC',sans-serif] text-[15px] md:text-[27px] leading-[26px] md:leading-[44px]"
                >
                  你本是 <TagPill>邻国</TagPill> 为了<BoldWhite>求和</BoldWhite>而送来的质子，名为"进献"，实为人质。你的身份卑微且敏感，在这个繁华却冷漠的皇宫中如履薄冰。你需要在这复杂的<BoldWhite>宫廷斗争</BoldWhite>中，利用你的智慧和那一点点微不足道的"美色"，寻找活下去的机会。
                </div>
              </div>

              {/* Section 3 - 第一章：起步 */}
              <div className="flex flex-col gap-4 md:gap-[23px]">
                <SectionHeading title="第一章：起步" />
                <div
                  className="text-[#d1d5db] font-['Noto_Sans_SC',sans-serif] text-[15px] md:text-[27px] leading-[26px] md:leading-[44px]"
                >
                  <GlowText>姬茗枫</GlowText>，当今<GlowText>四皇子</GlowText>，外表温润如玉，实则城府极深。他在宫中势力盘根错节，是你目前不得不依附的生存稻草。<BoldWhite>昨夜宴会</BoldWhite>上，你无意中听到了一桩不该听的秘密，此刻正被软禁于 <TagPill>偏殿</TagPill> 之中。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
          style={{
            height: "80px",
            background: "linear-gradient(to top, #161616 0%, rgba(22,22,22,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}