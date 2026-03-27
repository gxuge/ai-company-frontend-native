import { useState } from "react";
const svgPaths = {
p2bd2d700: "M12.36 27.9131L12.3439 27.9161L12.2404 27.9671L12.2112 27.9729L12.1908 27.9671L12.0873 27.9161C12.0717 27.9112 12.0601 27.9136 12.0523 27.9233L12.0464 27.9379L12.0216 28.5621L12.0289 28.5913L12.0435 28.6102L12.1952 28.7181L12.2171 28.724L12.2346 28.7181L12.3862 28.6102L12.4037 28.5869L12.4096 28.5621L12.3848 27.9394C12.3809 27.9238 12.3726 27.9151 12.36 27.9131ZM12.7464 27.7483L12.7275 27.7513L12.4577 27.8869L12.4431 27.9015L12.4387 27.9175L12.465 28.5446L12.4723 28.5621L12.4839 28.5723L12.7771 28.7079C12.7955 28.7128 12.8096 28.7089 12.8194 28.6963L12.8252 28.6758L12.7756 27.7804C12.7707 27.7629 12.761 27.7522 12.7464 27.7483ZM11.7037 27.7513C11.6973 27.7474 11.6896 27.7461 11.6823 27.7477C11.675 27.7494 11.6685 27.7538 11.6644 27.76L11.6556 27.7804L11.606 28.6758C11.607 28.6933 11.6153 28.705 11.6308 28.7108L11.6527 28.7079L11.9458 28.5723L11.9604 28.5606L11.9662 28.5446L11.991 27.9175L11.9866 27.9L11.9721 27.8854L11.7037 27.7513Z",
p2be67400: "M11.4952 14.5898L19.2287 22.3233C19.6391 22.7337 20.1957 22.9642 20.776 22.9642C21.3564 22.9642 21.9129 22.7337 22.3233 22.3233C22.7337 21.913 22.9642 21.3564 22.9642 20.776C22.9642 20.1957 22.7337 19.6391 22.3233 19.2288L14.5869 11.4952L22.3219 3.76167C22.525 3.55848 22.686 3.31727 22.7959 3.05183C22.9058 2.78638 22.9623 2.50189 22.9623 2.2146C22.9622 1.92731 22.9055 1.64284 22.7955 1.37744C22.6855 1.11205 22.5243 0.870918 22.3211 0.667821C22.1179 0.464723 21.8767 0.303637 21.6113 0.193758C21.3458 0.0838789 21.0613 0.0273597 20.7741 0.0274274C20.4868 0.0274951 20.2023 0.0841481 19.9369 0.194152C19.6715 0.304156 19.4304 0.465357 19.2273 0.66855L11.4952 8.40209L3.76165 0.66855C3.55996 0.459529 3.31866 0.292768 3.05183 0.178C2.785 0.0632309 2.49798 0.00275171 2.20753 9.17346e-05C1.91708 -0.00256824 1.62901 0.0526438 1.36012 0.162506C1.09123 0.272369 0.846919 0.434682 0.641433 0.639975C0.435947 0.845267 0.273404 1.08943 0.163288 1.35821C0.0531714 1.62699 -0.00231228 1.91502 7.38161e-05 2.20547C0.00245991 2.49592 0.0626677 2.783 0.177185 3.04993C0.291702 3.31687 0.458235 3.55833 0.667066 3.76022L8.40352 11.4952L0.668525 19.2302C0.459694 19.4321 0.293161 19.6736 0.178644 19.9405C0.0641267 20.2074 0.00391814 20.4945 0.00153204 20.785C-0.000854048 21.0754 0.0546296 21.3634 0.164746 21.6322C0.274862 21.901 0.437405 22.1452 0.642891 22.3505C0.848378 22.5557 1.09269 22.7181 1.36158 22.8279C1.63046 22.9378 1.91854 22.993 2.20899 22.9903C2.49944 22.9877 2.78646 22.9272 3.05329 22.8124C3.32012 22.6977 3.56142 22.5309 3.76311 22.3219L11.4952 14.5898Z",
};

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute left-[24px] top-[24px] z-30 flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-[12px] cursor-pointer"
    >
      <svg
        width="12"
        height="15"
        viewBox="0 0 22.9642 28.724"
        fill="none"
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
    </button>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center overflow-hidden rounded-tr-[15px] rounded-br-[15px]">
      <div className="w-[3px] self-stretch bg-[rgba(155,254,3,0.9)] shrink-0" />
      <div className="py-[6px] px-4">
        <span
          className="font-['Noto_Sans_SC',sans-serif] text-white text-[15px] tracking-[0.4px]"
          style={{ fontWeight: 700 }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

function HighlightedName({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-white border-b border-[rgba(155,254,3,0.5)] pb-[1px]"
      style={{
        textShadow: "0px 0px 8px rgba(155,254,3,0.6)",
      }}
    >
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-[1px] rounded-full bg-white/5 border border-white/10 text-[#e5e5e5] text-[13px] mx-[2px] align-baseline">
      {children}
    </span>
  );
}

function BoldWhite({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-white" style={{ fontWeight: 500 }}>
      {children}
    </span>
  );
}

function StoryContent() {
  return (
    <div className="flex flex-col gap-7 pb-6">
      {/* Section 1 */}
      <div className="flex flex-col gap-3">
        <SectionHeading title="核心冲突" />
        <div className="font-['Noto_Sans_SC',sans-serif] text-[#d1d5db] text-[14px] leading-[1.75] px-4">
          这是一个<BoldWhite>架空的古代王朝</BoldWhite>背景。在这个世界中，
          <HighlightedName>姬氏皇族</HighlightedName>
          统治着广袤的 <Badge>中原大地</Badge>{" "}
          ，然而权力的中心并非表面那样平静，暗流涌动，各方势力犬牙交错。
        </div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-col gap-3">
        <SectionHeading title="核心冲突" />
        <div className="font-['Noto_Sans_SC',sans-serif] text-[#d1d5db] text-[14px] leading-[1.75] px-4">
          你本是 <Badge>邻国</Badge> 为了
          <BoldWhite>求和</BoldWhite>
          而送来的质子，名为"进献"，实为人质。你的身份卑微且敏感，在这个繁华却冷漠的中如履薄冰。你需要在这复杂的
          <BoldWhite>宫廷斗争</BoldWhite>
          中，利用你的智慧和那一点点微不足道的"美色"，寻找活下去的机会。
        </div>
      </div>

      {/* Section 3 */}
      <div className="flex flex-col gap-3">
        <SectionHeading title="第一章：起步" />
        <div className="font-['Noto_Sans_SC',sans-serif] text-[#d1d5db] text-[14px] leading-[1.75] px-4">
          <HighlightedName>姬茗枫</HighlightedName>，当今
          <HighlightedName>四皇子</HighlightedName>
          ，外表温润如玉，实则城府极深。他在宫中势力盘根错节，是你目前不得不依附的生存稻草。
          <BoldWhite>昨夜宴会</BoldWhite>上，你无意中听到了一桩不该听的秘密，此刻正被软禁于{" "}
          <Badge>偏殿</Badge> 之中。
        </div>
      </div>
    </div>
  );
}

export default function StoryDialog() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="size-full flex items-center justify-center bg-[#0a0a0a]">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-[rgba(155,254,3,0.9)] text-black rounded-full font-['Noto_Sans_SC',sans-serif] cursor-pointer text-[14px]"
          style={{ fontWeight: 500 }}
        >
          查看故事详情
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-[4px]"
        onClick={() => setIsOpen(false)}
      />

      {/* Close Button */}
      <CloseButton onClose={() => setIsOpen(false)} />

      {/* Dialog Card */}
      <div className="relative z-10 w-full max-w-[420px] max-h-[calc(100vh-32px)] flex flex-col bg-[#161616] rounded-[16px] border border-[#424242] overflow-hidden">
        {/* Header */}
        <div className="relative shrink-0 px-5 pt-8 pb-3 z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-[#161616] to-transparent pointer-events-none" />
          <p
            className="relative z-10 font-['Noto_Sans_SC',sans-serif] text-white text-[20px] tracking-[0.5px]"
            style={{ fontWeight: 700 }}
          >
            故事详情
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 min-h-0 relative overscroll-contain">
          <StoryContent />
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-[60px] sm:bottom-[56px] left-0 right-0 h-[50px] bg-gradient-to-t from-[#161616] to-transparent pointer-events-none z-10" />

        {/* Bottom area */}
        <div className="shrink-0 h-[60px] sm:h-[56px] bg-[#161616] border-t border-white/5" />
      </div>
    </div>
  );
}