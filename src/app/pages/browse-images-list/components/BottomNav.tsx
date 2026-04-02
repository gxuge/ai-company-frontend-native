import { useState } from "react";
const imgBottomNavHome = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/bottom-nav-home.svg"));
const imgBottomNavSearch = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/bottom-nav-search.svg"));
const imgBottomNavCreate = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/bottom-nav-create.svg"));
const imgBottomNavCreateBadge = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/bottom-nav-create-badge.svg"));
const imgBottomNavChat = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/bottom-nav-chat.svg"));
const imgBottomNavProfile = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/bottom-nav-profile.svg"));

export function BottomNav() {
  const [active, setActive] = useState(0);

  const iconOpacity = (i: number) => (i === active ? 1 : 0.5);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-black z-50">
      <div className="max-w-[430px] mx-auto flex items-center justify-around h-[56px] px-2">
        {/* Home */}
        <button onClick={() => setActive(0)} className="flex flex-col items-center justify-center w-12 h-12">
          <img src={imgBottomNavHome} alt="" className="w-[24px] h-[24px] object-contain" style={{ opacity: iconOpacity(0) }} />
        </button>

        {/* Search */}
        <button onClick={() => setActive(1)} className="flex flex-col items-center justify-center w-12 h-12">
          <img src={imgBottomNavSearch} alt="" className="w-[24px] h-[24px] object-contain" style={{ opacity: iconOpacity(1) }} />
        </button>

        {/* Create (center, larger) */}
        <button onClick={() => setActive(2)} className="flex flex-col items-center justify-center w-14 h-14 -mt-2">
          <img src={imgBottomNavCreate} alt="" className="w-[30px] h-[30px] object-contain" style={{ opacity: iconOpacity(2) }} />
          <img src={imgBottomNavCreateBadge} alt="" className="absolute mt-6 w-[14px] h-[14px] object-contain" style={{ opacity: iconOpacity(2) }} />
        </button>

        {/* Chat */}
        <button onClick={() => setActive(3)} className="flex flex-col items-center justify-center w-12 h-12">
          <img src={imgBottomNavChat} alt="" className="w-[24px] h-[24px] object-contain" style={{ opacity: iconOpacity(3) }} />
        </button>

        {/* Profile */}
        <button onClick={() => setActive(4)} className="flex flex-col items-center justify-center w-12 h-12">
          <img src={imgBottomNavProfile} alt="" className="w-[24px] h-[24px] object-contain" style={{ opacity: iconOpacity(4) }} />
        </button>
      </div>
      {/* Safe area bottom */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-black" />
    </div>
  );
}
