import { useState } from "react";
import EditSoundText from "./components/edit-sound-text";
const imgPlay = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/sound-edit/play.svg"));
const imgCheckCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/sound-edit/check_circle.svg"));
const imgCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/sound-edit/circle.svg"));
const imgEdit = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/sound-edit/edit.svg"));
const imgChevronDown = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/sound-edit/chevron_down.svg"));
const imgListenHeadphone = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/sound-edit/listen_headphone.svg"));

const voices = [
  { id: 1, name: "李明", tags: ["新闻", "旁白"], gender: "男", age: "少年" },
  { id: 2, name: "李明", tags: ["新闻", "旁白"], gender: "男", age: "少年" },
  { id: 3, name: "李明", tags: ["新闻", "旁白"], gender: "男", age: "少年" },
];

function Slider({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative w-full h-[16px] flex items-center">
      {/* Track */}
      <div className="absolute inset-x-0 h-[3px] bg-[#333] rounded-full pointer-events-none z-0" />
      {/* Track dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => {
          const p = i * 20;
          return (
            <div 
              key={i} 
              className="absolute w-[3px] h-[5px] rounded-full bg-[#555] top-1/2 -translate-y-1/2" 
              style={{ left: `calc(${p}% - ${p * 0.14}px + 5.5px)` }} 
            />
          );
        })}
      </div>
      {/* Thumb */}
      <div
        className="absolute size-[14px] rounded-full bg-[rgba(155,254,3,0.9)] border-[2px] border-[#0a0a0a] shadow-[0_0_8px_rgba(155,254,3,0.4)] pointer-events-none z-10 top-1/2 -translate-y-1/2"
        style={{ left: `calc(${pct}% - ${pct * 0.14}px)` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0"
      />
    </div>
  );
}

function VoiceCard({ voice, selected, onSelect }: { voice: typeof voices[0]; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`bg-[#161616] rounded-[15px] w-full p-[12px] flex items-center justify-between cursor-pointer ${selected ? "border border-[#e9fac8] shadow-[0_0_10px_rgba(155,254,3,0.05)]" : ""}`}
    >
      <div className="flex items-center gap-[12px]">
        {/* Avatar */}
        <div className="relative size-[48px] rounded-full shrink-0" style={{ backgroundImage: "linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)" }}>
          <div className="flex items-center justify-center size-full rounded-full border border-[rgba(255,255,255,0.1)] text-[20px]">
            🧑‍💼
          </div>
          {selected && (
            <div className="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.4)] backdrop-blur-[1px] flex items-center justify-center">
              <img src={imgPlay} alt="" className="w-[18px] h-[18px] object-contain" />
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-white text-[14px]" style={{ fontWeight: 700 }}>{voice.name}</span>
          <div className="flex gap-[4px]">
            {voice.tags.map((tag) => (
              <span key={tag} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-[5px] px-[7px] py-[3px] text-[#9ca3af] text-[10px]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Check icon */}
      {selected ? (
        <img src={imgCheckCircle} alt="" className="w-[23px] h-[23px] object-contain" />
      ) : (
        <img src={imgCircle} alt="" className="w-[23px] h-[23px] object-contain" />
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
  const [isEditSoundTextOpen, setIsEditSoundTextOpen] = useState(false);

  const genders = ["全部", "男", "女"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['Noto_Sans_SC',sans-serif] flex justify-center">
      <div className="w-full max-w-[390px] py-[8px] flex flex-col gap-0 items-stretch">
        {/* Top Card */}
        <div className="mx-[13px] bg-[#161616] rounded-[21px] border border-[#4c4c4c] shadow-[0_0_20px_rgba(155,254,3,0.05)] px-[16px] py-[16px] flex flex-col gap-[12px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-[4px]">
            <div className="flex items-center gap-[8px]">
              <div className="size-[28px] rounded-full flex items-center justify-center text-[12px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)" }}>
                <span className="border border-[rgba(255,255,255,0.1)] rounded-full size-full flex items-center justify-center">🧑‍💼</span>
              </div>
              <span className="text-white text-[18px] tracking-[-0.45px]" style={{ fontWeight: 700 }}>李明</span>
            </div>
            <button
              onClick={() => setIsEditSoundTextOpen(true)}
              className="flex items-center gap-[8px] border border-[rgba(155,254,3,0.9)] rounded-[8px] px-[13px] h-[32px] bg-[#161616] shrink-0"
            >
              <img src={imgEdit} alt="" className="w-[12px] h-[12px] object-contain" />
              <span className="text-[rgba(155,254,3,0.8)] text-[12px]">读文编辑</span>
            </button>
          </div>

          {/* Parameters */}
          <div className="flex items-center justify-between py-[4px]">
            <span className="text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase" style={{ fontWeight: 700 }}>参数调整</span>
            <button className="border border-[rgba(155,254,3,0.9)] rounded-[5px] px-[9px] py-[3px] text-[rgba(155,254,3,0.9)] text-[10px]">重置</button>
          </div>

          {/* Sliders */}
          <div className="flex gap-[32px] pt-[8px] pb-[16px]">
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="flex justify-between items-end">
                <span className="text-[#9ca3af] text-[11px]" style={{ fontWeight: 500 }}>音调</span>
                <span className="text-[rgba(155,254,3,0.9)] text-[12px] font-mono" style={{ fontWeight: 700 }}>{pitch > 0 ? "+" : ""}{pitch}%</span>
              </div>
              <Slider value={pitch} onChange={setPitch} min={-50} max={50} step={5} />
            </div>
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="flex justify-between items-end">
                <span className="text-[#9ca3af] text-[11px]" style={{ fontWeight: 500 }}>语速</span>
                <span className="text-[rgba(155,254,3,0.9)] text-[12px] font-mono" style={{ fontWeight: 700 }}>{speed.toFixed(1)}x</span>
              </div>
              <Slider value={speed} onChange={setSpeed} min={0.5} max={2.0} step={0.1} />
            </div>
          </div>

          {/* Listen Button */}
          <div className="flex flex-col items-center justify-center">
            <button className="w-full border-2 border-[rgba(155,254,3,0.9)] rounded-[16px] h-[45px] flex items-center justify-center gap-[10px]">
              <img src={imgListenHeadphone} alt="" className="w-[19px] h-[19px] object-contain" />
              <span className="text-[rgba(155,254,3,0.9)] text-[16px]" style={{ fontWeight: 700 }}>试听音色</span>
            </button>
          </div>
        </div>

        {/* Voice Library */}
        <div className="mx-[13px] flex flex-col gap-[16px] pt-[20px] pb-[96px]">
          <h2 className="text-[#9ca3af] text-[14px] tracking-[0.7px] uppercase pl-[4px]" style={{ fontWeight: 700 }}>推荐音色库</h2>

          {/* Filters */}
          <div className="flex items-center justify-between px-[4px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[#6b7280] text-[12px] pr-[4px]" style={{ fontWeight: 700 }}>性别</span>
              <div className="relative bg-[#222] rounded-[8px] border border-[rgba(255,255,255,0.05)] p-[3.5px] h-[31px] w-[150px] flex">
                <div
                  className="absolute top-[3.5px] bottom-[3.5px] w-[calc((100%-7px)/3)] bg-[rgba(155,254,3,0.2)] rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(${genders.indexOf(genderFilter) * 100}%)` }}
                />
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`flex-1 relative z-10 flex items-center justify-center rounded-[5px] text-[11px] h-full transition-colors duration-300 ${genderFilter === g ? "text-[#9bfe03]" : "text-[#9ca3af]"}`}
                    style={{ fontWeight: 500 }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-[#6b7280] text-[12px]" style={{ fontWeight: 700 }}>年龄</span>
              <div className="relative">
                <button
                  onClick={() => setAgeOpen(!ageOpen)}
                  className="bg-[#161616] border border-[rgba(155,254,3,0.2)] rounded-[8px] px-[12px] h-[31px] w-[66px] flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.1)] transition-colors hover:border-[rgba(155,254,3,0.4)] relative z-30"
                >
                  <span className="text-[#9bfe03] text-[11px]" style={{ fontWeight: 500 }}>{age}</span>
                  <img src={imgChevronDown} alt="" className={`w-[7px] h-[5px] object-contain transition-transform duration-200 ${ageOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* Dropdown Menu */}
                {ageOpen && (
                  <div className="absolute top-[calc(100%+6px)] right-0 w-[66px] bg-[#222] rounded-[8px] border border-[rgba(255,255,255,0.06)] py-[4px] shadow-lg z-40 overflow-hidden flex flex-col">
                    {["少年", "青年", "中年", "老年"].map((a) => (
                      <button 
                        key={a} 
                        onClick={() => { setAge(a); setAgeOpen(false); }} 
                        className={`block w-full px-[12px] py-[6px] text-center text-[11px] transition-colors ${age === a ? "text-[#9bfe03] bg-[rgba(155,254,3,0.08)]" : "text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice List */}
          <div className="flex flex-col gap-[16px]">
            {voices.map((voice, i) => (
              <VoiceCard key={voice.id + "-" + i} voice={voice} selected={selectedVoice === i} onSelect={() => setSelectedVoice(i)} />
            ))}
          </div>
        </div>
      </div>
      {isEditSoundTextOpen && <EditSoundText />}
    </div>
  );
}
