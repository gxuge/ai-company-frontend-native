import { useState } from "react";

const categories = ["推荐", "订阅", "点赞", "二次元", "都市", "古风", "科幻"];

export function CategoryTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full px-3 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 py-1">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActive(i)}
            className={`shrink-0 h-[36px] px-5 rounded-full text-[15px] transition-all ${
              i === active
                ? "bg-[rgba(155,254,3,0.9)] text-[#202020] border-[1.5px] border-transparent"
                : "bg-[rgba(155,254,3,0.2)] text-[rgba(155,254,3,0.9)] border-[1.5px] border-[rgba(155,254,3,0.9)]"
            }`}
            style={{ fontWeight: 700 }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
