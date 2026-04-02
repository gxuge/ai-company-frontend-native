const imgSearchIcon = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/browse-images-list/search_icon.svg"));


export function SearchBar() {
  return (
    <div className="w-full px-3">
      <div className="bg-[#202020] h-[40px] rounded-full relative border border-white/80">
        <div className="flex items-center gap-1.5 px-4 h-full">
          <div className="relative shrink-0 w-[20px] h-[20px]">
            <img src={imgSearchIcon} alt="" className="block size-full object-contain" />
          </div>
          <span className="text-[#909090] text-[13px]">搜索形象</span>
        </div>
      </div>
    </div>
  );
}
