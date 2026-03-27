import { useState } from "react";
const svgPaths = {
p16d49b00: "M13.7136 48.3672L13.4718 47.713C12.5601 45.2452 10.6174 43.2997 8.15335 42.3867L7.5 42.1445L8.15335 41.9025C10.6174 40.9892 12.5601 39.0437 13.4718 36.5762L13.7136 35.9217L13.9555 36.5762C14.8672 39.0437 16.8098 40.9892 19.2739 41.9025L19.9274 42.1445L19.2739 42.3867C16.8098 43.2997 14.8672 45.2452 13.9555 47.713L13.7136 48.3672Z",
p1f44080: "M36.6668 18.4668V20.0002C36.6647 23.5942 35.5009 27.0913 33.349 29.9699C31.197 32.8485 28.1722 34.9543 24.7257 35.9734C21.2792 36.9924 17.5955 36.87 14.2242 35.6245C10.8529 34.379 7.97453 32.077 6.01837 29.062C4.06221 26.0469 3.13309 22.4803 3.36956 18.894C3.60604 15.3078 4.99545 11.8941 7.33057 9.16197C9.66569 6.42988 12.8214 4.52582 16.3271 3.73376C19.8328 2.9417 23.5005 3.30408 26.7834 4.76685",
p21126af0: "M41.21 12.8919C44.743 13.6285 47.3893 16.7641 47.377 20.5128C47.365 23.8301 45.2738 26.6556 42.3368 27.7533",
p2527ce0: "M43.5342 36.4307C50.404 37.8409 52.5 42.8134 52.5 46.6299",
p2f924600: "M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z",
p31f24c72: "M34.5258 19.1279C34.5258 24.9096 29.8393 29.5961 24.0576 29.5961C18.2783 29.5961 13.5919 24.9096 13.5919 19.1279C13.5919 13.3462 18.2783 8.65974 24.0576 8.65974C29.8393 8.65974 34.5258 13.3462 34.5258 19.1279Z",
p378d8e80: "M40.4432 49.22C40.4432 44.6488 37.3647 39.1585 28.8894 37.6528",
p3a12d900: "M13.4785 25.8018C20.2845 25.8018 25.8018 20.2845 25.8018 13.4785C25.8018 6.6726 20.2845 1.1553 13.4785 1.1553C6.6726 1.1553 1.1553 6.6726 1.1553 13.4785C1.1553 20.2845 6.6726 25.8018 13.4785 25.8018Z",
p3b4c5d00: "M36.6667 6.66626L20 23.3496L15 18.3496",
p86f2c00: "M7.85606 7.85606L1.1553 1.1553",
pd76cc00: "M26.4268 51.3404C26.0158 49.9886 24.9596 48.9306 23.6099 48.5191C24.9596 48.1079 26.0158 47.0499 26.4268 45.6981C26.8375 47.0499 27.8938 48.1079 29.2435 48.5191C27.8938 48.9306 26.8375 49.9886 26.4268 51.3404Z",
};
const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/bfc3c41d1a6b570e1b0987aedf706c872d00b6d5.png"));
const characters = [
  { id: 1, name: "赛博朋克黑客" },
  { id: 2, name: "赛博朋克黑客" },
  { id: 3, name: "赛博朋克黑客" },
  { id: 4, name: "赛博朋克黑客" },
];

export default function App() {
  const [selectedId, setSelectedId] = useState(4);
  const [search, setSearch] = useState("");

  const filtered = characters.filter((c) => c.name.includes(search));

  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center relative font-['Noto_Sans_SC',sans-serif]">
      {/* Header */}
      <div className="w-full max-w-[750px] h-[60px] flex items-center relative px-4 shrink-0">
        <button className="backdrop-blur-md bg-[#232322] rounded-full w-10 h-10 flex items-center justify-center">
          <svg width="18" height="17" viewBox="0 0 35 33.6" fill="none">
            <path clipRule="evenodd" d={svgPaths.p2f924600} fill="white" fillRule="evenodd" />
          </svg>
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white text-lg font-bold">选择角色</span>
        </div>
      </div>

      {/* Search */}
      <div className="w-full max-w-[750px] px-4 py-2 shrink-0">
        <div className="bg-[#202020] rounded-full h-12 flex items-center px-4 gap-2 border border-white/20">
          <svg width="20" height="20" viewBox="0 0 37 37" fill="none" className="shrink-0">
            <path d={svgPaths.p3a12d900} stroke="#909090" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
            <path d="M23.8017 23.8017L26.9571 26.9571" stroke="#909090" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
          </svg>
          <input
            className="bg-transparent text-white text-sm outline-none w-full placeholder-[#909090]"
            placeholder="搜索角色"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Character List */}
      <div className="w-full max-w-[750px] px-4 pt-2 pb-32 flex flex-col gap-4">
        {filtered.map((char) => {
          const isSelected = char.id === selectedId;
          return (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-colors ${
                isSelected
                  ? "bg-[#202020] border border-[#e9fac8]"
                  : "bg-[#161616] border border-transparent"
              }`}
            >
              <img
                src={imgImage}
                alt=""
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <span className="text-white text-base flex-1 text-left">{char.name}</span>
              {isSelected && (
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="shrink-0">
                  <path d={svgPaths.p1f44080} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.75" />
                  <path d={svgPaths.p3b4c5d00} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.75" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 bg-black border border-black rounded-full w-16 h-16 flex items-center justify-center shadow-[2px_2px_50px_0px_rgba(152,252,3,0.5)]">
        <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
          <path d={svgPaths.p378d8e80} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="3.43" />
          <path clipRule="evenodd" d={svgPaths.p31f24c72} fillRule="evenodd" stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="3.43" />
          <path d={svgPaths.p2527ce0} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="3.43" />
          <path d={svgPaths.p21126af0} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="3.43" />
          <path d={svgPaths.p16d49b00} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="3.43" />
          <path d={svgPaths.pd76cc00} stroke="#9BFE03" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="3.43" />
        </svg>
      </button>
    </div>
  );
}