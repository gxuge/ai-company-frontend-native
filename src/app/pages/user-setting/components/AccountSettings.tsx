import { useState } from "react";
import { AiFormInput } from "@/components/ai-company/ai-form-input";
import { AiSelectTab } from "@/components/ai-company/ai-select-tab";

const imgStatusSignal = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/status_signal.svg"));
const imgStatusWifi = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/status_wifi.svg"));
const imgStatusBattery = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/status_battery.svg"));
const imgAvatarEditButton = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/avatar_edit_button.svg"));
const imgCalendarIcon = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/calendar_icon.svg"));
const imgArrowRightGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/arrow_right_gray.svg"));
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
          <img src={imgStatusSignal} alt="" className="w-[16px] h-[12px] object-contain" />
          {/* WiFi */}
          <img src={imgStatusWifi} alt="" className="w-[18px] h-[13px] object-contain" />
          {/* Battery */}
          <img src={imgStatusBattery} alt="" className="w-[10px] h-[18px] object-contain" />
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
            <img src={imgAvatarEditButton} alt="" className="w-[32px] h-[32px] object-contain" />
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
            <AiFormInput
              value={nickname}
              onChangeText={setNickname}
              placeholder="输入昵称"
              placeholderTextColor="rgba(255,255,255,0.8)"
              customContainerClass="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 py-4 text-white text-[16px]"
            />
          </div>
        </div>

        {/* ID */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
            ID
          </label>
          <div className="relative">
            <AiFormInput
              value="user_OnPiJPVTUm"
              editable={false}
              customContainerClass="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 py-4 text-white text-[16px]"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            性别
          </label>
          <AiSelectTab
            options={genderOptions}
            value={gender}
            onChange={setGender}
            containerClassName="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] p-1"
            activeBgClassName="bg-[rgba(155,254,3,0.2)] rounded-[16px]"
            itemClassName="flex-1 py-4 items-center justify-center z-10"
          />
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
              <img src={imgCalendarIcon} alt="" className="w-[26px] h-[28px] object-contain" />
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
            <img src={imgArrowRightGray} alt="" className="ml-3 shrink-0 w-[10px] h-[16px] object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
