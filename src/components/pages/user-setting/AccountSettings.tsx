import Env from 'env';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiDateInput } from '@/components/ai-company/ai-date-input';
import { AiFormInput } from '@/components/ai-company/ai-form-input';
import { AiSelectTab } from '@/components/ai-company/ai-select-tab';
import { userApi } from '@/lib/api';

const imgAvatarEditButton = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/user-setting/avatar_edit_button.svg"));
const imgCalendarIcon = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/user-setting/calendar_icon.svg"));
const imgArrowRightGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/user-setting/arrow_right_gray.svg"));
const imgProfilePicture = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/user-setting/8c30de68507153a8488aba9e71939af795be62f6.png"));
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

function joinBaseUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export default function AccountSettings() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState("");
  const [userCode, setUserCode] = useState(FALLBACK_USER_ID);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [birthday, setBirthday] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: t('settings.account.genderOptions.male') },
    { value: 'female', label: t('settings.account.genderOptions.female') },
    { value: 'secret', label: t('settings.account.genderOptions.secret') },
  ];

  const tags = [
    t('settings.account.preferenceTags.urban'),
    t('settings.account.preferenceTags.workplace'),
    t('settings.account.preferenceTags.companionship'),
  ];

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
        if (data.avatar) {
          setAvatarUrl(data.avatar);
        }
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
        avatar: avatarUrl || undefined,
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

  const handleTriggerUpload = () => {
    if (isUploading || isSaving) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const serverPath = await userApi.uploadFile(file);
      if (serverPath) {
        setAvatarUrl(serverPath);
      }
    } catch (error) {
      console.warn("avatar upload failed", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen w-full flex flex-col text-white max-w-[480px] mx-auto relative overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[5vw] pt-2 pb-5">
        <button onClick={handleCancel} className="text-[16px] text-white/90 active:opacity-60 transition-opacity" style={{ fontFamily: "sans-serif" }}>
          {t('settings.account.cancel')}
        </button>
        <span className="text-[18px] tracking-[0.5px]" style={{ fontFamily: "sans-serif", fontWeight: 500 }}>
          {t('settings.account.title')}
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="text-[16px] text-brand-green/90 active:opacity-60 transition-opacity disabled:opacity-50"
          style={{ fontFamily: "sans-serif" }}
        >
          {t('settings.account.save')}
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center pt-4 pb-8">
        <div className="relative cursor-pointer group" onClick={handleTriggerUpload}>
          <div
            className="w-[120px] h-[120px] rounded-full border-[2.5px] border-brand-green/90 overflow-hidden p-[7px] relative"
            style={{ boxShadow: "0 0 20px rgba(var(--color-brand-green-rgb),0.3)" }}
          >
            {isUploading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-full">
                <div className="w-5 h-5 border-2 border-brand-green/90 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : joinBaseUrl(Env.EXPO_PUBLIC_API_URL, `/sys/common/static/${avatarUrl}`)) : imgProfilePicture}
              alt={t('settings.account.avatarAlt')}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Edit Button */}
          <div className="absolute -bottom-1 -right-1 w-[32px] h-[32px] group-hover:scale-110 transition-transform">
            <img src={imgAvatarEditButton} alt="" className="w-[32px] h-[32px] object-contain" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-[32px] px-[6vw] pb-10">
        {/* Nickname */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            {t('settings.account.nickname')}
          </label>
          <div className="relative">
            <AiFormInput
              value={nickname}
              onChangeText={setNickname}
              editable={!isSaving}
              placeholder={t('settings.account.nicknamePlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.4)"
              className="w-full h-[56px] px-5 bg-transparent border-0 outline-none text-white text-[16px]"
              customContainerClass="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px]"
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
              className="w-full h-[56px] px-5 bg-transparent border-0 outline-none text-white text-[16px]"
              customContainerClass="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] opacity-60"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            {t('settings.account.gender')}
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
            activeBgClassName="bg-brand-green/20 rounded-[16px]"
            itemClassName="flex-1 py-4 items-center justify-center z-10"
          />
        </div>

        {/* Birthday */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            {t('settings.account.birthday')}
          </label>
          <AiDateInput
            value={birthday}
            onChangeText={setBirthday}
            editable={!isSaving}
            placeholder="mm/dd/yyyy"
            iconSource={imgCalendarIcon}
          />
        </div>

        {/* Content Preferences */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9ca3af] text-[13px] tracking-[1px] uppercase pl-1">
            {t('settings.account.preferences')}
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

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}





