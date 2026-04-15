import { useState } from "react"
import { Search, UserPlus, Check, Inbox } from "lucide-react"
import { AiHeader } from "../../../components/ai-company/ai-header";
import AiBottomTabs from "../../../components/ai-company/ai-bottom-tabs";
import { router } from 'expo-router';

const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/bfc3c41d1a6b570e1b0987aedf706c872d00b6d5.png"))
const imgFabAddRole = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/select-role/fab_add_role.svg"));

export default function App() {
  const [selectedId, setSelectedId] = useState(4)
  const [search, setSearch] = useState("")

  const items = [
    { id: 1, name: "赛博朋克黑客", avatar: imgImage },
    { id: 2, name: "未来战士", avatar: imgImage },
    { id: 3, name: "数字游侠", avatar: imgImage },
    { id: 4, name: "閲忓瓙宸ョ▼甯?", avatar: imgImage },
  ]

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative size-full bg-black overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#9BFE03 1px, transparent 1px), linear-gradient(90deg, #9BFE03 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center size-full max-w-[750px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="w-full pt-[50px] pb-4">
          <AiHeader title="选择角色" />
        </div>

        {/* Search bar */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索角色"
              className="w-full h-[56px] sm:h-[68px] bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-full pl-[56px] sm:pl-[72px] pr-6 sm:pr-8 text-white text-[18px] sm:text-[24px] placeholder-[#707070] outline-none border-2 border-white/10 transition-all duration-300"
            />
            <div className="absolute left-[20px] sm:left-[28px] top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#707070] group-focus-within:text-[#9BFE03] transition-colors duration-300" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Character list */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 pb-[120px] sm:pb-[180px] overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const selected = selectedId === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group w-full rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] active:scale-[0.98] ${
                    selected
                      ? "bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-[#9BFE03] shadow-[0_0_30px_rgba(155,254,3,0.35)]"
                      : "bg-gradient-to-br from-[#222] to-[#1a1a1a] border-2 border-white/5 hover:border-[#9BFE03]/40 hover:shadow-[0_0_20px_rgba(155,254,3,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="size-12 rounded-full shrink-0 ring-2 ring-white/10 group-hover:ring-[#9BFE03]/50 transition-all duration-300 overflow-hidden">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex-1 text-left">
                      <p className="text-base font-medium transition-colors duration-300 text-white group-hover:text-[#9BFE03]/90">
                        {item.name}
                      </p>
                    </div>

                    {/* Check icon */}
                    <div
                      className={`size-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        selected
                          ? "bg-[#9BFE03] scale-100"
                          : "bg-white/5 scale-0 group-hover:scale-100"
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${
                          selected ? "text-black" : "text-[#9BFE03]"
                        }`}
                        strokeWidth={3.5}
                      />
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center text-[#707070] py-[60px] gap-4">
              <Inbox className="w-16 h-16 opacity-50" strokeWidth={1} />
              <div className="text-[20px] sm:text-[24px]">
                暂无数据
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating action button */}
      <style>{`
        @keyframes breathing {
          0% { transform: scale(1); box-shadow: 2px 2px 20px 0px rgba(152,252,3,0.3); }
          50% { transform: scale(1.05); box-shadow: 2px 2px 50px 0px rgba(152,252,3,0.6); }
          100% { transform: scale(1); box-shadow: 2px 2px 20px 0px rgba(152,252,3,0.3); }
        }
        .animate-breathing {
          animation: breathing 2.5s infinite ease-in-out;
        }
      `}</style>
      <button 
        className="animate-breathing fixed bottom-[100px] right-6 bg-black border border-black rounded-full w-16 h-16 flex items-center justify-center z-[60]"
        onClick={() => router.push('/pages/create-character')}
      >
        <img src={imgFabAddRole} alt="" className="w-[36px] h-[36px] object-contain" />
      </button>
      
      {/* Bottom Tabs */}
      <div className="fixed bottom-0 left-0 right-0 z-[70]">
        <AiBottomTabs activeTab="home" />
      </div>
    </div>
  )
}