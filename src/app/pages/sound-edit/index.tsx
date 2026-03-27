import { useState } from "react";
const svgPaths = {
p14077700: "M41.25 7.49954L22.5 26.2683L16.875 20.6433",
p16039340: "M7.80243 3.43601L12.5964 7.19401",
p21d7c000: "M2.91667 15.4167L0 12.5L12.5 0L25 12.5L22.0833 15.4167L12.5 5.83333L2.91667 15.4167Z",
p24fdfcc0: "M41.2501 20.7752V22.5002C41.2478 26.5435 39.9386 30.4777 37.5176 33.7161C35.0967 36.9545 31.6938 39.3236 27.8164 40.47C23.939 41.6164 19.795 41.4788 16.0022 40.0775C12.2095 38.6763 8.97134 36.0866 6.77067 32.6947C4.56999 29.3028 3.52472 25.2903 3.79076 21.2558C4.05679 17.2213 5.61988 13.3808 8.24689 10.3072C10.8739 7.23361 14.4241 5.09155 18.368 4.20048C22.3119 3.30941 26.4381 3.71709 30.1314 5.3627",
p28b12a80: "M6.73077 8.30128L0 1.57051L1.57051 0L6.73077 5.16026L11.891 0L13.4615 1.57051L6.73077 8.30128Z",
p3b9fb400: "M9.35473 1.45561C10.0917 0.516612 11.2827 0.565612 12.2227 1.30261L13.6127 2.39261C14.5527 3.12961 14.8857 4.27261 14.1487 5.21361L5.85973 15.7886C5.58273 16.1426 5.15973 16.3516 4.70973 16.3566L1.51273 16.3976L0.788731 13.2826C0.686731 12.8456 0.788731 12.3856 1.06573 12.0306L9.35473 1.45561Z",
p3d838f80: "M20.625 41.5C30.9803 41.5 39.375 33.1053 39.375 22.75C39.375 12.3947 30.9803 4 20.625 4C10.2697 4 1.875 12.3947 1.875 22.75C1.875 33.1053 10.2697 41.5 20.625 41.5Z",
p3e0e0c80: "M17.6001 9.86751L17.5072 9.8112C16.4542 9.17072 15.528 8.60625 14.7341 8.3219C14.2964 8.1537 13.8285 8.07843 13.3602 8.1009C12.8672 8.13853 12.396 8.31958 12.0046 8.62173C11.1896 9.23266 10.8377 10.1322 10.6448 11.1274C10.4576 12.0916 10.3858 13.3472 10.2971 14.876L10.2929 14.9548C10.2394 15.8698 10.2056 16.7749 10.2056 17.5956C10.2056 18.4162 10.2394 19.3227 10.2929 20.2377L10.2971 20.3151C10.3858 21.8439 10.4576 23.0995 10.6448 24.0623C10.8377 25.059 11.1896 25.957 12.0046 26.5694C12.4072 26.872 12.8591 27.0522 13.3602 27.0902C13.8416 27.1254 14.3033 27.024 14.7341 26.8692C15.528 26.5849 16.4542 26.0204 17.5072 25.3813L17.6001 25.325C18.1997 24.959 18.7881 24.5832 19.3132 24.213C19.9562 23.7555 20.583 23.2757 21.1924 22.7743L21.2628 22.7166C22.3382 21.8396 23.2504 21.095 23.881 20.363C24.568 19.5606 24.986 18.6992 24.986 17.5956C24.986 16.4919 24.568 15.6291 23.8796 14.8281C23.2504 14.0961 22.3382 13.3501 21.2642 12.4745L21.1938 12.4168C20.5547 11.8959 19.9128 11.3976 19.3132 10.9782C18.754 10.5895 18.1827 10.2187 17.6001 9.8661",
p7935e80: "M36.9942 21.8445C36.9977 21.0837 36.878 18.2132 36.7867 17.3923C35.7345 7.9706 28.0876 1.13254 18.6052 1.13254C8.72854 1.13254 0.726167 8.74298 0.183271 18.8341C0.171709 19.0544 0.0907713 20.6171 0.08499 21.5473L0.0820994 22.0647C0.0346931 22.2786 0.0057869 22.4995 0.0057869 22.7272V32.7959C0.0057869 34.4898 1.38346 35.8674 3.07736 35.8674H6.19519C7.8891 35.8674 9.26731 34.4898 9.26731 32.7959V22.7278C9.26731 21.0339 7.88848 19.6562 6.19516 19.6562H3.07617C2.86761 19.6563 2.65958 19.6774 2.45527 19.7193C2.47261 19.3441 2.48822 19.0475 2.49227 18.9585C2.96868 10.1137 9.97667 3.44507 18.6052 3.44507C26.8897 3.44507 33.5688 9.41942 34.488 17.6496C34.5273 17.993 34.577 18.866 34.617 19.7424C34.3915 19.6904 34.1614 19.6562 33.922 19.6562H30.8406C29.1467 19.6562 27.769 21.0339 27.769 22.7278V32.7606C27.769 34.455 29.1467 35.8321 30.8406 35.8321H33.922C35.6159 35.8321 36.9942 34.4545 36.9942 32.7606V22.7278C36.9942 22.5394 36.9711 22.3561 36.9375 22.178C36.9711 22.0716 36.993 21.9606 36.9942 21.8444V21.8445ZM3.07621 21.9687H6.19404C6.61318 21.9687 6.95366 22.3087 6.95366 22.7278V32.7964C6.95366 33.2162 6.61256 33.5555 6.194 33.5555H3.07617C2.65703 33.5555 2.31709 33.2155 2.31709 32.7964V22.7278C2.31825 22.3087 2.65819 21.9687 3.07621 21.9687ZM34.6817 32.76C34.6817 33.1792 34.3406 33.5191 33.9221 33.5191H30.8407C30.4216 33.5191 30.0816 33.1792 30.0816 32.76V22.7278C30.0816 22.3087 30.4216 21.9688 30.8407 21.9688H33.9221C34.3412 21.9688 34.6817 22.3087 34.6817 22.7278V32.76Z",
};

const voices = [
  { id: 1, name: "李明", tags: ["新闻", "旁白"], gender: "男", age: "少年" },
  { id: 2, name: "李明", tags: ["新闻", "旁白"], gender: "男", age: "少年" },
  { id: 3, name: "李明", tags: ["新闻", "旁白"], gender: "男", age: "少年" },
];

function Slider({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative w-full h-[30px] flex items-center">
      {/* Track dots */}
      <div className="absolute inset-x-3 flex justify-between items-center">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="size-1 rounded-full bg-[#555]" />
        ))}
      </div>
      {/* Track */}
      <div className="absolute inset-x-0 h-1 bg-[#333] rounded-full" />
      {/* Thumb */}
      <div
        className="absolute size-[22px] rounded-full bg-[rgba(155,254,3,0.9)] border-[3px] border-[#0a0a0a] shadow-[0_0_12px_rgba(155,254,3,0.4)]"
        style={{ left: `calc(${pct}% - 11px)` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

function VoiceCard({ voice, selected, onSelect }: { voice: typeof voices[0]; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`bg-[#161616] rounded-[20px] w-full p-5 flex items-center justify-between cursor-pointer ${selected ? "border border-[#e9fac8] shadow-[0_0_16px_rgba(155,254,3,0.05)]" : ""}`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative size-16 rounded-full shrink-0" style={{ backgroundImage: "linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)" }}>
          <div className="flex items-center justify-center size-full rounded-full border border-[rgba(255,255,255,0.1)] text-[28px]">
            🧑‍💼
          </div>
          {selected && (
            <div className="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.4)] backdrop-blur-[1px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
                <path d={svgPaths.p3e0e0c80} fill="rgba(155,254,3,0.9)" />
              </svg>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex flex-col gap-2">
          <span className="text-white font-['Noto_Sans_SC',sans-serif] text-[18px]" style={{ fontWeight: 700 }}>{voice.name}</span>
          <div className="flex gap-1.5">
            {voice.tags.map((tag) => (
              <span key={tag} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg px-2.5 py-0.5 text-[#9ca3af] text-[13px] font-['Noto_Sans_SC',sans-serif]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Check icon */}
      {selected ? (
        <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
          <path d={svgPaths.p24fdfcc0} stroke="rgba(155,254,3,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.75" />
          <path d={svgPaths.p14077700} stroke="rgba(155,254,3,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.75" />
        </svg>
      ) : (
        <svg width="36" height="36" viewBox="0 0 45 45" fill="none">
          <path d={svgPaths.p3d838f80} stroke="#435B1F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.75" />
        </svg>
      )}
    </div>
  );
}

export default function App() {
  const [pitch, setPitch] = useState(20);
  const [speed, setSpeed] = useState(1.2);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [genderFilter, setGenderFilter] = useState("全部");
  const [ageOpen, setAgeOpen] = useState(false);
  const [age, setAge] = useState("少年");

  const genders = ["全部", "男", "女"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['Noto_Sans_SC',sans-serif] flex justify-center">
      <div className="w-full max-w-[420px] px-4 py-4 flex flex-col gap-5">
        {/* Top Card */}
        <div className="bg-[#161616] rounded-[24px] border border-[#4c4c4c] shadow-[0_0_24px_rgba(155,254,3,0.05)] p-5 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full flex items-center justify-center text-[20px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)" }}>
                <span className="border border-[rgba(255,255,255,0.1)] rounded-full size-full flex items-center justify-center">🧑‍💼</span>
              </div>
              <span className="text-white text-[22px]" style={{ fontWeight: 700 }}>李明</span>
            </div>
            <button className="flex items-center gap-2 border border-[rgba(155,254,3,0.9)] rounded-[10px] px-3.5 h-[38px] bg-[#161616]">
              <svg width="14" height="14" viewBox="0 0 17.3264 17.148" fill="none">
                <path d="M10.1994 16.398H16.5764" stroke="rgba(155,254,3,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.4" />
                <path d={svgPaths.p3b9fb400} fillRule="evenodd" clipRule="evenodd" stroke="rgba(155,254,3,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p16039340} stroke="rgba(155,254,3,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.4" />
              </svg>
              <span className="text-[rgba(155,254,3,0.8)] text-[13px]">读文编辑</span>
            </button>
          </div>

          {/* Parameters */}
          <div className="flex items-center justify-between">
            <span className="text-[#9ca3af] text-[15px] tracking-wide" style={{ fontWeight: 700 }}>参数调整</span>
            <button className="border border-[rgba(155,254,3,0.9)] rounded-[8px] px-3 h-[28px] text-[rgba(155,254,3,0.9)] text-[12px]">重置</button>
          </div>

          {/* Sliders */}
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[#9ca3af] text-[14px]" style={{ fontWeight: 500 }}>音调</span>
                <span className="text-[rgba(155,254,3,0.9)] text-[15px] font-mono" style={{ fontWeight: 700 }}>+{pitch}%</span>
              </div>
              <Slider value={pitch} onChange={setPitch} min={-50} max={50} step={1} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[#9ca3af] text-[14px]" style={{ fontWeight: 500 }}>语速</span>
                <span className="text-[rgba(155,254,3,0.9)] text-[15px] font-mono" style={{ fontWeight: 700 }}>{speed.toFixed(1)}x</span>
              </div>
              <Slider value={speed} onChange={setSpeed} min={0.5} max={2.0} step={0.1} />
            </div>
          </div>

          {/* Listen Button */}
          <button className="w-full border-2 border-[rgba(155,254,3,0.9)] rounded-[18px] h-[48px] flex items-center justify-center gap-2.5 mt-2">
            <svg width="22" height="22" viewBox="0 0 37 37" fill="none">
              <path d={svgPaths.p7935e80} fill="rgba(155,254,3,0.9)" />
            </svg>
            <span className="text-[rgba(155,254,3,0.9)] text-[16px]" style={{ fontWeight: 700 }}>试听音色</span>
          </button>
        </div>

        {/* Voice Library */}
        <div className="flex flex-col gap-5">
          <h2 className="text-[#9ca3af] text-[18px] tracking-wide pl-1" style={{ fontWeight: 700 }}>推荐音色库</h2>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#6b7280] text-[15px]" style={{ fontWeight: 700 }}>性别</span>
              <div className="bg-[#222] rounded-[10px] border border-[rgba(255,255,255,0.05)] flex p-1 h-[38px]">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-3.5 rounded-[8px] text-[13px] h-full ${genderFilter === g ? "bg-[rgba(155,254,3,0.2)] text-[#9bfe03]" : "text-[#9ca3af]"}`}
                    style={{ fontWeight: 500 }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 relative">
              <span className="text-[#6b7280] text-[15px]" style={{ fontWeight: 700 }}>年龄</span>
              <button
                onClick={() => setAgeOpen(!ageOpen)}
                className="bg-[#161616] border border-[rgba(155,254,3,0.2)] rounded-[10px] px-3.5 h-[38px] flex items-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
              >
                <span className="text-[#9bfe03] text-[14px]" style={{ fontWeight: 500 }}>{age}</span>
                <svg width="10" height="7" viewBox="0 0 13.4615 8.30128" fill="none">
                  <path d={svgPaths.p28b12a80} fill="#9BFE03" />
                </svg>
              </button>
              {ageOpen && (
                <div className="absolute top-full right-0 mt-1 bg-[#222] rounded-xl border border-[rgba(255,255,255,0.1)] py-1 z-10">
                  {["少年", "青年", "中年", "老年"].map((a) => (
                    <button key={a} onClick={() => { setAge(a); setAgeOpen(false); }} className={`block w-full px-6 py-1.5 text-left text-[14px] ${age === a ? "text-[#9bfe03]" : "text-[#9ca3af]"} hover:bg-[rgba(155,254,3,0.1)]`}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Voice List */}
          <div className="flex flex-col gap-5">
            {voices.map((voice, i) => (
              <VoiceCard key={voice.id + "-" + i} voice={voice} selected={selectedVoice === i} onSelect={() => setSelectedVoice(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}