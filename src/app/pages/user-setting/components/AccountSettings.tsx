import { useState } from "react";
const svgPaths = {
p1171ef00: "M38.4615 7.72236H36.4784V3.84615H32.6923V7.72236H13.4014V3.84615H9.61538V7.72236H7.63221C5.55889 7.72236 3.84615 9.4351 3.84615 11.5986V42.3377C3.84615 44.4111 5.55889 46.2139 7.63221 46.2139H38.4615C40.5349 46.2139 42.2476 44.4111 42.2476 42.3377V11.5986C42.2476 9.4351 40.5349 7.72236 38.4615 7.72236ZM38.4615 42.3377H7.63221V21.1538H38.4615V42.3377ZM38.4615 17.3678H7.63221V11.5986H38.4615V17.3678Z",
p18d82ef0: "M25.8714 20.1923L26.9231 21.244L16.7218 31.3927H15.7227V30.3936L25.8714 20.1923ZM29.9204 13.4615C29.6049 13.4615 29.3419 13.5667 29.1316 13.777L27.0808 15.8278L31.2876 20.0346L33.3383 17.9838C33.759 17.5631 33.759 16.8269 33.3383 16.4062L30.7091 13.777C30.4988 13.5667 30.1833 13.4615 29.9204 13.4615ZM25.8714 17.0373L13.4615 29.4471V33.6538H17.6683L30.0781 21.244L25.8714 17.0373Z",
p22b8e280: "M8 0H10V10.6875H8V0V0M0 6.6875H2V10.6875H0V6.6875V6.6875M4 3.34375H6V10.6875H4V3.34375V3.34375",
p2e5b2000: "M0 3.02344L1.34375 4.36719C4.65625 1.05469 10.0312 1.05469 13.3438 4.36719L14.6875 3.02344C10.625 -1.00781 4.0625 -1.00781 0 3.02344V3.02344M5.34375 8.36719L7.34375 10.3672L9.34375 8.36719C8.25 7.24219 6.4375 7.24219 5.34375 8.36719V8.36719M2.6875 5.67969L4 7.02344C5.84375 5.17969 8.84375 5.17969 10.6875 7.02344L12 5.67969C9.4375 3.11719 5.25 3.11719 2.6875 5.67969V5.67969",
p3101d7c0: "M5.78125 1.3125H4.6875V0H2V1.3125H0.90625C0.40625 1.3125 0 1.71875 0 2.21875V12.4375C0 12.9375 0.40625 13.3125 0.90625 13.3125H5.78125C6.28125 13.3125 6.6875 12.9375 6.6875 12.4375V2.21875C6.6875 1.71875 6.28125 1.3125 5.78125 1.3125V1.3125",
p34a6cac0: "M13.9883 2.3292H5.52096C2.58427 2.3292 0.75 3.96513 0.75 6.97222V16.0219C0.75 19.0762 2.58427 20.75 5.52096 20.75H13.979C16.925 20.75 18.75 19.1046 18.75 16.0975V6.97222C18.7592 3.96513 16.9342 2.3292 13.9883 2.3292Z",
p35944600: "M1.17188 0L0 1.17188L3.82812 5L0 8.82812L1.17188 10L6.17188 5L1.17188 0V0",
};
const imgProfilePicture = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/8c30de68507153a8488aba9e71939af795be62f6.png"));
type Gender = "male" | "female" | "secret";

export default function AccountSettings() {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [birthday, setBirthday] = useState("");

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "male", label: "男生" },
    { value: "female", label: "女生" },
    { value: "secret", label: "保密" },
  ];

  const tags = ["都市", "职场", "情感陪伴"];

  return (
    <div className="bg-[#0a0a0a] min-h-screen w-full flex flex-col text-white max-w-[480px] mx-auto relative overflow-x-hidden">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-[6vw] pt-3 pb-1 w-full">
        <span className="text-[15px] tracking-tight" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>12:25</span>
        <div className="flex items-center gap-[5px]">
          {/* Signal */}
          <svg width="16" height="12" viewBox="0 0 19.2308 20.5529" fill="none">
            <path d={svgPaths.p22b8e280} fill="white" transform="scale(0.95)" />
          </svg>
          {/* WiFi */}
          <svg width="18" height="13" viewBox="0 0 28.2452 19.9369" fill="none">
            <path d={svgPaths.p2e5b2000} fill="white" />
          </svg>
          {/* Battery */}
          <svg width="10" height="18" viewBox="0 0 12.8606 25.601" fill="none">
            <path d={svgPaths.p3101d7c0} fill="white" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-[5vw] pt-2 pb-5">
        <button className="text-[16px] text-white/90 active:opacity-60 transition-opacity" style={{ fontFamily: "sans-serif" }}>
          取消
        </button>
        <span className="text-[18px] tracking-[0.5px]" style={{ fontFamily: "sans-serif", fontWeight: 500 }}>
          账号设置
        </span>
        <button className="text-[16px] text-[rgba(155,254,3,0.9)] active:opacity-60 transition-opacity" style={{ fontFamily: "sans-serif" }}>
          保存
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center pt-4 pb-8">
        <div className="relative">
          <div
            className="w-[120px] h-[120px] rounded-full border-[2.5px] border-[rgba(155,254,3,0.9)] overflow-hidden p-[7px]"
            style={{ boxShadow: "0 0 20px rgba(155,254,3,0.3)" }}
          >
            <img
              src={imgProfilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Edit Button */}
          <div className="absolute -bottom-1 -right-1 w-[32px] h-[32px]">
            <svg width="32" height="32" viewBox="0 0 47.1154 47.1154" fill="none">
              <rect fill="#27272A" height="45.1923" rx="22.5962" width="45.1923" x="0.961538" y="0.961538" />
              <rect height="45.1923" rx="22.5962" stroke="#3F3F46" strokeWidth="1.92308" width="45.1923" x="0.961538" y="0.961538" />
              <path d={svgPaths.p18d82ef0} fill="#9BFE03" fillOpacity="0.9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-[32px] px-[6vw] pb-10">
        {/* Nickname */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            昵称
          </label>
          <div className="relative">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="输入昵称"
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 py-4 text-white text-[16px] placeholder-white/80 outline-none focus:border-[rgba(155,254,3,0.5)] transition-colors"
            />
          </div>
        </div>

        {/* ID */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
            ID
          </label>
          <div className="relative">
            <div className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 py-4 text-white text-[16px]">
              user_OnPiJPVTUm
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            性别
          </label>
          <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.3)] rounded-[20px] p-2 flex">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setGender(option.value)}
                className={`flex-1 py-3 rounded-[12px] text-[15px] text-center transition-all ${
                  gender === option.value
                    ? "bg-[rgba(155,254,3,0.2)] text-[#9bfe03]"
                    : "text-[#9ca3af]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Birthday */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            生日
          </label>
          <div className="relative">
            <input
              type="text"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 py-4 text-white text-[16px] placeholder-white/80 outline-none focus:border-[rgba(155,254,3,0.5)] transition-colors pr-16"
            />
            {/* Calendar Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <svg width="26" height="28" viewBox="0 0 46.0938 50.0601" fill="none">
                <g filter="url(#filter_cal)">
                  <path d={svgPaths.p1171ef00} fill="#9BFE03" fillOpacity="0.9" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="50.0601" id="filter_cal" width="46.0938" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1.92308" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.607843 0 0 0 0 0.996078 0 0 0 0 0.0117647 0 0 0 0.5 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1" />
                    <feBlend in="SourceGraphic" in2="effect1" mode="normal" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Content Preferences */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            内容偏好
          </label>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[15px] px-3 py-1 text-[#d1d5db] text-[13px]"
                >
                  {tag}
                </span>
              ))}
              <span className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[15px] px-2.5 py-1 text-white text-[13px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                +2
              </span>
            </div>
            {/* Arrow */}
            <svg width="10" height="16" viewBox="0 0 28 31" fill="none" className="ml-3 shrink-0">
              <g clipPath="url(#clip_arrow)">
                <path d={svgPaths.p35944600} fill="#6B7280" transform="scale(3.5)" />
              </g>
              <defs>
                <clipPath id="clip_arrow">
                  <rect fill="white" height="31" width="28" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
