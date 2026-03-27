import { SearchBar } from "./components/SearchBar";
import { CategoryTabs } from "./components/CategoryTabs";
import { ImageCard } from "./components/ImageCard";
import { BottomNav } from "./components/BottomNav";

const cards = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  username: "@每个ai为..",
  author: "kerwin壳壳",
  views: "76.4万",
}));

export default function App() {
  return (
    <div className="bg-black min-h-screen max-w-[430px] mx-auto flex flex-col pb-[72px]">
      {/* Status bar spacer */}
      <div className="h-[env(safe-area-inset-top,20px)] bg-black shrink-0" />

      {/* Search bar */}
      <div className="py-2 shrink-0">
        <SearchBar />
      </div>

      {/* Category tabs */}
      <div className="py-1.5 shrink-0">
        <CategoryTabs />
      </div>

      {/* Image grid */}
      <div className="flex-1 overflow-y-auto px-3 pt-1">
        <div className="grid grid-cols-2 gap-2">
          {cards.map((card) => (
            <ImageCard
              key={card.id}
              username={card.username}
              author={card.author}
              views={card.views}
            />
          ))}
        </div>
        {/* Bottom padding for scroll */}
        <div className="h-4" />
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
