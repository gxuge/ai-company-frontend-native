import { useState } from "react";
import { AiHeader } from "../../../components/ai-company/ai-header";
import { AiSearch } from "../../../components/ai-company/ai-search";
const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/bfc3c41d1a6b570e1b0987aedf706c872d00b6d5.png"));
const imgSearchIcon = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/search_icon.svg"));
const imgSelectedCheck = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/selected_check.svg"));
const imgFabAddRole = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/fab_add_role.svg"));
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
      <div className="w-full max-w-[750px] pt-[50px] px-4 shrink-0 pb-4">
        <AiHeader title="选择角色" />
      </div>

      {/* Search */}
      <div className="w-full max-w-[750px] px-4 py-2 shrink-0">
        <AiSearch
          value={search}
          onChangeText={setSearch}
        />
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
                <img src={imgSelectedCheck} alt="" className="shrink-0 w-[28px] h-[28px] object-contain" />
              )}
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 bg-black border border-black rounded-full w-16 h-16 flex items-center justify-center shadow-[2px_2px_50px_0px_rgba(152,252,3,0.5)]">
        <img src={imgFabAddRole} alt="" className="w-[36px] h-[36px] object-contain" />
      </button>
    </div>
  );
}