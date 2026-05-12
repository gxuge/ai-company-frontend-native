import { AiHeader } from '@/components/ai-company/ai-header';
import { useRouter } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';
const imgFeedbackBlue = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/feedback_blue.svg"));
const imgAboutPurple = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/about_purple.svg"));
const imgAccountGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/account_green.svg"));
const imgVerifiedOrange = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/verified_orange.svg"));
const imgPrivacyPink = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/privacy_pink.svg"));
const imgLogoutRed = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/logout_red.svg"));
const imgMenuArrowGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../../assets/images/general-setting/menu_arrow_gray.svg"));

// Icon component with glow effect
function GlowIcon({
  iconSource,
  bgColor,
}: {
  iconSource: any;
  bgColor: string;
}) {
  return (
    <View
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 40,
        height: 40,
        backgroundColor: bgColor,
      }}
    >
      // @ts-expect-error
      <Image source={iconSource} alt="" className="w-[20px] h-[20px] object-contain" />
    </View>
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
    <Pressable onPress={onClick} className="flex items-center w-full px-4 py-3.5 gap-3 active:bg-white/5 transition-colors">
      {icon}
      <Text className="flex-1 text-left text-gray-100 font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 15 }}>
        {label}
      </Text>
      {rightText && (
        <Text className="text-gray-500 font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 14 }}>
          {rightText}
        </Text>
      )}
      {showArrow && (
        <Image source={imgMenuArrowGray} alt="" className="w-[6px] h-[10px] object-contain opacity-0" />
      )}
    </Pressable>
  );
}

// Glass card section
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="relative rounded-2xl overflow-hidden backdrop-blur-xl">
      <View className="bg-[rgba(30,35,40,0.6)] rounded-2xl border border-white/10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.3)]">
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-white/10 mx-4" />;
}

export function SettingsPage() {
  const router = useRouter();

  return (
    <View className="relative min-h-full bg-black font-['Noto_Sans_SC',sans-serif] overflow-auto">
      {/* Background gradient blurs */}
      <View className="fixed inset-0 pointer-events-none overflow-hidden">
        <View
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 450,
            left: -40,
            top: -180,
            // @ts-expect-error
            background: "rgba(88,28,135,0.1)",
            filter: "blur(45px)",
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 450,
            right: -40,
            bottom: -90,
            // @ts-expect-error
            background: "rgba(30,58,138,0.1)",
            filter: "blur(55px)",
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 270,
            left: "20%",
            top: "40%",
            // @ts-expect-error
            background: "rgba(54,83,20,0.1)",
            filter: "blur(50px)",
          }}
        />
      </View>

      {/* Content */}
      <View className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <View className="px-5" style={{ paddingTop: 12, paddingBottom: 12 }}>
          <AiHeader title="通用设置" />
        </View>

        {/* Sections */}
        <View className="px-5 pt-3 pb-6 flex flex-col gap-5">
          {/* Section 1: Feedback & About */}
          <SectionCard>
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgFeedbackBlue}
                  bgColor="rgba(59,130,246,0.1)"
                />
              }
              label="意见与反馈"
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgAboutPurple}
                  bgColor="rgba(168,85,247,0.1)"
                />
              }
              label="关于探拾"
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
              label="账号设置"
              // @ts-expect-error
              onPress={() => router.push('/pages/user-setting')}
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  iconSource={imgVerifiedOrange}
                  bgColor="rgba(249,115,22,0.1)"
                />
              }
              label="实名认证"
              rightText="已认证"
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
              label="隐私设置"
            />
          </SectionCard>

          {/* Section 3: Logout */}
          <SectionCard>
            <Pressable className="flex items-center justify-center w-full px-4 py-4 gap-2 active:bg-white/5 transition-colors">
              <Image source={imgLogoutRed} alt="" className="w-[16px] h-[17px] object-contain" />
              <Text className="text-[#f87171] font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 15 }}>
                退出登录
              </Text>
            </Pressable>
          </SectionCard>
        </View>

        {/* Footer */}
        <View className="flex flex-col items-center gap-2 pt-12 pb-8 opacity-60">
          <Text
            className="text-gray-500 tracking-wide font-['Inter','Noto_Sans_SC',sans-serif]"
            style={{ fontSize: 12 }}
          >
            应用版本 1.0.0
          </Text>
          <Text
            className="text-gray-600 font-['Noto_Sans_SC',sans-serif]"
            style={{ fontSize: 10 }}
          >
            探拾AI伴侣
          </Text>
        </View>
      </View>
    </View>
  );
}
