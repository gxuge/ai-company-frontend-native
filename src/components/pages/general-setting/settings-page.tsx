import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiHeader } from '@/components/ai-company/ai-header';
import { signOut } from '@/features/auth/use-auth-store';
import { useSelectedLanguage } from '@/lib/i18n';

const imgLanguageCyan = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/language_cyan.svg"));
const imgFeedbackBlue = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/feedback_blue.svg"));
const imgAboutPurple = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/about_purple.svg"));
const imgAccountGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/account_green.svg"));
const imgVerifiedOrange = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/verified_orange.svg"));
const imgPrivacyPink = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/privacy_pink.svg"));
const imgLogoutRed = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/logout_red.svg"));
const imgMenuArrowGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/general-setting/menu_arrow_gray.svg"));

// Icon component with glow effect
function GlowIcon({
  iconSource,
  bgColor,
}: {
  iconSource: string;
  bgColor: string;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 40,
        height: 40,
        backgroundColor: bgColor,
      }}
    >
      <img src={iconSource} alt="" className="w-[20px] h-[20px] object-contain" />
    </div>
  );
}

// Menu item row
function MenuItem({
  icon,
  label,
  rightText,
  showArrow = true,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  rightText?: string;
  showArrow?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex items-center w-full px-4 py-3.5 gap-3 active:bg-white/5 transition-colors">
      {icon}
      <span className="flex-1 text-left text-gray-100 font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 15 }}>
        {label}
      </span>
      {rightText && (
        <span className="text-gray-500 font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 14 }}>
          {rightText}
        </span>
      )}
      {showArrow && (
        <img src={imgMenuArrowGray} alt="" className="w-[6px] h-[10px] object-contain opacity-0" />
      )}
    </button>
  );
}

// Glass card section
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl">
      <div className="bg-[rgba(30,35,40,0.6)] rounded-2xl border border-white/10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.3)]">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/10 mx-4" />;
}

const LANGUAGE_NAMES: Record<string, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'zh-TW': '繁體中文',
  'ja': '日本語',
};

export function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { language } = useSelectedLanguage();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    signOut();
    router.replace('/pages/verification-code-login');
  };

  return (
    <div className="relative min-h-full bg-black font-['Noto_Sans_SC',sans-serif] overflow-auto">
      {/* Background gradient blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 450,
            left: -40,
            top: -180,
            background: "rgba(88,28,135,0.1)",
            filter: "blur(45px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 450,
            right: -40,
            bottom: -90,
            background: "rgba(30,58,138,0.1)",
            filter: "blur(55px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 270,
            left: "20%",
            top: "40%",
            background: "rgba(54,83,20,0.1)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="px-5" style={{ paddingTop: 12, paddingBottom: 12 }}>
          <AiHeader title={t('settings.general.title')} />
        </div>

        {/* Sections */}
        <div className="px-5 pt-3 pb-6 flex flex-col gap-5">
          {/* Section 1: Language, Feedback & About */}
          <SectionCard>
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgLanguageCyan}
                  bgColor="rgba(6,182,212,0.1)"
                />
              }
              label={t('settings.general.language')}
              rightText={LANGUAGE_NAMES[language] || '简体中文'}
              onClick={() => router.push('/pages/language-setting')}
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgFeedbackBlue}
                  bgColor="rgba(59,130,246,0.1)"
                />
              }
              label={t('settings.general.feedback')}
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgAboutPurple}
                  bgColor="rgba(168,85,247,0.1)"
                />
              }
              label={t('settings.general.about')}
            />
          </SectionCard>

          {/* Section 2: Account Settings */}
          <SectionCard>
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgAccountGreen}
                  bgColor="rgba(16,185,129,0.1)"
                />
              }
              label={t('settings.general.account')}
              onClick={() => router.push('/pages/user-setting')}
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgVerifiedOrange}
                  bgColor="rgba(249,115,22,0.1)"
                />
              }
              label={t('settings.general.verification')}
              rightText={t('settings.general.verified')}
              showArrow={false}
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgPrivacyPink}
                  bgColor="rgba(236,72,153,0.1)"
                />
              }
              label={t('settings.general.privacy')}
            />
          </SectionCard>

          {/* Section 3: Logout */}
          <SectionCard>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-4 gap-2 active:bg-white/5 transition-colors"
            >
              <img src={imgLogoutRed} alt="" className="w-[16px] h-[17px] object-contain" />
              <span className="text-[#f87171] font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 15 }}>
                {t('settings.general.logout')}
              </span>
            </button>
          </SectionCard>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 pt-12 pb-8 opacity-60">
          <span
            className="text-gray-500 tracking-wide font-['Inter','Noto_Sans_SC',sans-serif]"
            style={{ fontSize: 12 }}
          >
            {t('settings.general.version', { version: '1.0.0' })}
          </span>
          <span
            className="text-gray-600 font-['Noto_Sans_SC',sans-serif]"
            style={{ fontSize: 10 }}
          >
            {t('settings.general.appName')}
          </span>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
        >
          {/* Overlay Background */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={() => setShowLogoutConfirm(false)} 
          />
          
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] bg-gradient-to-b from-[#262B32] to-[#1A1F24] border border-white/10 p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col items-center"
            style={{ animation: 'fadeScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Icon Wrapper with glow */}
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#2D282A] to-[#1A1819] border border-red-500/20 flex items-center justify-center shadow-inner">
                <img src={imgLogoutRed} alt="" className="w-6 h-6 object-contain opacity-90" />
              </div>
            </div>
            
            <h3 className="text-[18px] font-semibold text-white mb-2 font-['Noto_Sans_SC',sans-serif] tracking-wide">
              {t('settings.general.logoutDialog.title')}
            </h3>
            <p className="text-[#9CA3AF] text-[14px] mb-8 text-center font-['Noto_Sans_SC',sans-serif] leading-relaxed">
              {t('settings.general.logoutDialog.message')}
            </p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-[#2A2F36] border border-white/5 text-white/80 text-[15px] font-medium hover:bg-[#323840] active:bg-[#2A2F36] transition-all font-['Noto_Sans_SC',sans-serif]"
              >
                {t('settings.general.logoutDialog.cancel')}
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500/80 to-red-600/80 text-white text-[15px] font-medium hover:from-red-500 hover:to-red-600 active:opacity-80 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] font-['Noto_Sans_SC',sans-serif]"
              >
                {t('settings.general.logoutDialog.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
