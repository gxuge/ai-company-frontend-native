import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AiFormInput } from "@/components/ai-company/ai-form-input";
import { AiSelectTab } from "@/components/ai-company/ai-select-tab";
import { userApi } from "@/lib/api";

const imgStatusSignal = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/status_signal.svg"));
const imgStatusWifi = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/status_wifi.svg"));
const imgStatusBattery = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/status_battery.svg"));
const imgAvatarEditButton = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/avatar_edit_button.svg"));
const imgCalendarIcon = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/calendar_icon.svg"));
const imgArrowRightGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/arrow_right_gray.svg"));
const imgProfilePicture = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/user-setting/8c30de68507153a8488aba9e71939af795be62f6.png"));
type Gender = "male" | "female" | "secret";
const FALLBACK_USER_ID = "user_OnPiJPVTUm";

function mapSexToGender(sex?: number | string): Gender {
  const numeric = typeof sex === "number" ? sex : Number(sex);
  if (numeric === 1) {
    return "male";
  }
  if (numeric === 2) {
    return "female";
  }
  return "secret";
}

function mapGenderToSex(gender: Gender) {
  if (gender === "male") {
    return 1;
  }
  if (gender === "female") {
    return 2;
  }
  return 0;
}

function toBirthdayInput(value?: string) {
  if (!value) {
    return "";
  }
  const normalized = value.trim().slice(0, 10);
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return "";
  }
  return `${match[2]}/${match[3]}/${match[1]}`;
}

function toBackendBirthday(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  const match = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return undefined;
  }
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (!Number.isInteger(year) || year < 1900 || year > 9999) {
    return undefined;
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return undefined;
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return undefined;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AccountSettings() {
  const [userId, setUserId] = useState("");
  const [userCode, setUserCode] = useState(FALLBACK_USER_ID);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [birthday, setBirthday] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "male", label: "男生" },
    { value: "female", label: "女生" },
    { value: "secret", label: "保密" },
  ];

  const tags = ["都市", "职场", "情感陪伴"];

  useEffect(() => {
    let alive = true;

    const loadUserSetting = async () => {
      setIsLoading(true);
      try {
        const data = await userApi.getUserSettingData();
        if (!alive) {
          return;
        }
        setUserId(data.id || "");
        setUserCode(data.id || data.username || FALLBACK_USER_ID);
        setNickname(data.realname || "");
        setGender(mapSexToGender(data.sex));
        setBirthday(toBirthdayInput(data.birthday));
      }
      catch (error) {
        console.warn("load user setting failed", error);
      }
      finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };

    void loadUserSetting();
    return () => {
      alive = false;
    };
  }, []);

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/pages/general-setting");
  };

  const handleSave = async () => {
    if (isSaving || isLoading) {
      return;
    }
    if (!userId) {
      console.warn("save user setting skipped: empty user id");
      return;
    }

    const parsedBirthday = toBackendBirthday(birthday);
    if (birthday.trim() && !parsedBirthday) {
      console.warn("save user setting skipped: invalid birthday format, expected mm/dd/yyyy");
      return;
    }

    setIsSaving(true);
    try {
      await userApi.updateUserSetting({
        id: userId,
        realname: nickname.trim(),
        sex: mapGenderToSex(gender),
        birthday: parsedBirthday,
      });
      console.log("user setting saved");
    }
    catch (error) {
      console.warn("save user setting failed", error);
    }
    finally {
      setIsSaving(false);
    }
  };

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
        <button onClick={handleCancel} className="text-[16px] text-white/90 active:opacity-60 transition-opacity" style={{ fontFamily: "sans-serif" }}>
          取消
        </button>
        <span className="text-[18px] tracking-[0.5px]" style={{ fontFamily: "sans-serif", fontWeight: 500 }}>
          账号设置
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="text-[16px] text-[rgba(155,254,3,0.9)] active:opacity-60 transition-opacity disabled:opacity-50"
          style={{ fontFamily: "sans-serif" }}
        >
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
              editable={!isSaving}
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
              value={userCode}
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
            onChange={(value) => {
              if (isSaving) {
                return;
              }
              setGender(value);
            }}
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
              disabled={isSaving}
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





