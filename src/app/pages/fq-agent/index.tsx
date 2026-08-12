import { useEffect, useRef, useState } from 'react';

import arrowHistory from '@/assets/images/fq-agent/arrow-history.png';
import arrowImageHelp from '@/assets/images/fq-agent/arrow-image-help.png';
import arrowRole from '@/assets/images/fq-agent/arrow-role.png';
import assistantMascot from '@/assets/images/fq-agent/assistant-mascot.png';
import cameraIcon from '@/assets/images/fq-agent/camera.png';
import composerAdd from '@/assets/images/fq-agent/composer-add.png';
import menuIcon from '@/assets/images/fq-agent/menu.png';
import moreIcon from '@/assets/images/fq-agent/more.png';
import newSessionIcon from '@/assets/images/fq-agent/new-session.png';
import questionHistory from '@/assets/images/fq-agent/question-history.png';
import questionImage from '@/assets/images/fq-agent/question-image.png';
import questionRole from '@/assets/images/fq-agent/question-role.png';
import suggestionsIcon from '@/assets/images/fq-agent/suggestions.png';
import topDivider from '@/assets/images/fq-agent/top-divider.png';
import voiceIcon from '@/assets/images/fq-agent/voice.png';

const DESIGN_WIDTH = 405;
const DESIGN_HEIGHT = 719.5;
const FOOTER_TOP = 643.5;

const suggestions = [
  {
    text: '如何创建角色',
    icon: questionRole,
    arrow: arrowRole,
  },
  {
    text: '图片生成失败怎么办',
    icon: questionImage,
    arrow: arrowImageHelp,
  },
  {
    text: '如何查看聊天记录',
    icon: questionHistory,
    arrow: arrowHistory,
  },
];

function Header() {
  return (
    <header className="absolute top-0 left-0 h-[73px] w-[405px]">
      <img
        src={menuIcon}
        alt=""
        className="absolute top-[44px] left-[17.5px] h-[13.5px] w-[14px] object-contain"
      />

      <div className="absolute top-[38.5px] left-[304.5px] h-[25.5px] w-[77.5px] rounded-[11.5px] border-[0.5px] border-[#42464c] bg-[#010101]" />
      <img
        src={newSessionIcon}
        alt=""
        className="absolute top-[44px] left-[317.5px] size-[14px] object-contain"
      />
      <img
        src={topDivider}
        alt=""
        className="absolute top-[43.5px] left-[342.5px] h-[15px] w-px object-cover"
      />
      <img
        src={moreIcon}
        alt=""
        className="absolute top-[49.5px] left-[354.5px] h-[3.5px] w-[15px] object-contain"
      />
    </header>
  );
}

function Hero() {
  return (
    <section className="absolute top-[93.5px] left-0 h-[133px] w-[405px]">
      <img
        src={assistantMascot}
        alt="智能客服直直"
        className="absolute top-[2.5px] left-[9px] h-[129px] w-[156px] object-contain"
      />
      <h1 className="absolute top-[41.5px] left-[167.5px] m-0 text-[16px] leading-[24px] font-bold whitespace-nowrap text-[#20afc4]">
        Hi，我是专属智能客服，直直
      </h1>
      <p className="absolute top-[71px] left-[168px] m-0 text-[12.5px] leading-[18.5px] whitespace-nowrap text-[#9f9f9f]">
        遇到问题，请尽管问我～
      </p>
    </section>
  );
}

function WelcomeCard() {
  return (
    <section className="absolute top-[230.5px] left-[12px] h-[327.5px] w-[379px] rounded-[16.5px] border-[0.5px] border-[#4e5157] bg-black">
      <h2 className="absolute top-[23px] left-[24px] m-0 text-[19.5px] leading-[24px] font-bold text-[#22b8cf]">
        欢迎咨询
      </h2>
      <p className="absolute top-[61.5px] left-[22px] m-0 text-[12px] leading-[19px] text-[#9b9b9c]">
        我可以帮你解答角色创建、故事创作、图片生成
        <br />
        会员订阅及账号使用等问题。直接告诉我你遇到的
        <br />
        情况，我会尽力帮你解决~
      </p>

      <div className="absolute top-[138.5px] left-[15.5px] h-[0.5px] w-[348px] bg-[#2d2e33]" />

      <img
        src={suggestionsIcon}
        alt=""
        className="absolute top-[155.5px] left-[19px] size-[16px] object-contain"
      />
      <span className="absolute top-[154.5px] left-[42px] text-[13px] leading-[16.5px] text-[#a4a5a5]">
        猜你想问
      </span>
      <img
        src={arrowHistory}
        alt=""
        className="absolute top-[157px] right-[24.5px] h-[12px] w-[7.5px] object-contain"
      />

      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.text}
          className="absolute left-[16.5px] h-[39px] w-[348px] rounded-[17px] border-[0.5px] border-[#3f4146] bg-black"
          style={{ top: 183.5 + index * 45 }}
        >
          <img
            src={suggestion.icon}
            alt=""
            className="absolute top-[10px] left-[16.5px] h-[18.5px] w-[17.5px] object-contain"
          />
          <span className="absolute top-[10px] left-[44.5px] text-[13px] leading-[18.5px] whitespace-nowrap text-[#a1a1a1]">
            {suggestion.text}
          </span>
          <img
            src={suggestion.arrow}
            alt=""
            className="absolute top-[14px] right-[17px] h-[10.5px] w-[6.5px] object-contain"
          />
        </div>
      ))}
    </section>
  );
}

function Composer() {
  return (
    <footer className="relative h-[76px] w-[405px] bg-black">
      <img
        src={voiceIcon}
        alt=""
        className="absolute top-[5.5px] left-[11.5px] h-[40px] w-[39.5px] object-contain"
      />

      <div className="absolute top-[5.5px] left-[41.5px] h-[40px] w-[299.5px] rounded-r-[20px] border-[0.5px] border-[#46474c] bg-[#040405]" />
      <span className="absolute top-[17px] left-[69px] flex h-[18px] items-center text-[11.5px] leading-[normal] text-[#414142]">
        请输入你的问题
      </span>
      <img
        src={composerAdd}
        alt=""
        className="absolute top-[14.5px] left-[309.5px] h-[20.5px] w-[20px] object-contain"
      />

      <img
        src={cameraIcon}
        alt=""
        className="absolute top-[5.5px] left-[347.5px] h-[40.5px] w-[43.5px] object-contain"
      />
    </footer>
  );
}

export default function FQAgentScreen() {
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
    <div className="h-dvh w-full overflow-x-hidden overflow-y-auto bg-black font-cjk text-neutral-200">
      <div ref={containerRef} className="mx-auto w-full max-w-[520px]">
        <div className="relative w-full" style={{ height: DESIGN_HEIGHT * scale }}>
          <main
            className="absolute top-0 left-0 h-[719.5px] w-[405px] bg-black"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <Header />
            <Hero />
            <WelcomeCard />
          </main>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 bg-black">
        <div className="mx-auto w-full max-w-[520px]">
          <div className="relative w-full" style={{ height: (DESIGN_HEIGHT - FOOTER_TOP) * scale }}>
            <div
              className="absolute top-0 left-0 h-[76px] w-[405px] bg-black"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <Composer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
