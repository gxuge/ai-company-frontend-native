const svgPaths = {
  p3a12d900: "",
  p86f2c00: "",
  p2fe93000: "",
  p1bdc1500: "",
  p303d4200: "",
  p17144680: "",
  p1fc50b00: "",
  p191b6f80: "",
  pe511420: "",
  p35d19300: "",
  p205c8f00: "",
  p18d9b280: "",
};


export function SearchBar() {
  return (
    <div className="w-full px-3">
      <div className="bg-[#202020] h-[40px] rounded-full relative border border-white/80">
        <div className="flex items-center gap-1.5 px-4 h-full">
          <div className="relative shrink-0 w-[20px] h-[20px]">
            <svg
              className="block size-full"
              fill="none"
              viewBox="0 0 26.9571 26.9571"
            >
              <path
                d={svgPaths.p3a12d900}
                stroke="#909090"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.31"
              />
            </svg>
            <svg
              className="block absolute bottom-0 right-0 w-[8px] h-[8px]"
              fill="none"
              viewBox="0 0 9.01136 9.01136"
            >
              <path
                d={svgPaths.p86f2c00}
                stroke="#909090"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.31"
              />
            </svg>
          </div>
          <span className="text-[#909090] text-[13px]">搜索形象</span>
        </div>
      </div>
    </div>
  );
}
