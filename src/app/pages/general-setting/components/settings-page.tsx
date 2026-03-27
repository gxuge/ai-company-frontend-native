const svgPaths = {
p1a6ba880: "M34.9751 11.5385H14.1629C12.6981 11.5385 11.5385 12.6981 11.5385 14.1018V37.5385L16.7263 32.3507H34.9751C36.3788 32.3507 37.5385 31.191 37.5385 29.7263V14.1018C37.5385 12.6981 36.3788 11.5385 34.9751 11.5385ZM25.8202 27.1629H23.2568V24.5385H25.8202V27.1629ZM25.8202 20.6324C25.8202 21.3648 25.2709 21.914 24.5385 21.914C23.8061 21.914 23.2568 21.3648 23.2568 20.6324V18.0079C23.2568 17.3366 23.8061 16.7263 24.5385 16.7263C25.2709 16.7263 25.8202 17.3366 25.8202 18.0079V20.6324Z",
p21cc2a00: "M30.7724 21.2483H29.4215V18.4648C29.4215 14.6456 26.3338 11.5385 22.5385 11.5385C18.7431 11.5385 15.6554 14.6456 15.6554 18.4648V21.2483H14.3045C12.825 21.2483 11.5385 22.4782 11.5385 23.967V37.8197C11.5385 39.3086 12.825 40.5385 14.3045 40.5385H30.7724C32.2519 40.5385 33.5385 39.3086 33.5385 37.8197V23.967C33.5385 22.4782 32.2519 21.2483 30.7724 21.2483V21.2483M22.5385 33.6769C21.0589 33.6769 19.7724 32.3822 19.7724 30.8934C19.7724 29.4045 21.0589 28.1099 22.5385 28.1099C24.018 28.1099 25.3045 29.4045 25.3045 30.8934C25.3045 32.3822 24.018 33.6769 22.5385 33.6769V33.6769M18.4215 21.2483V18.4648C18.4215 16.1992 20.287 14.3219 22.5385 14.3219C24.7899 14.3219 26.6554 16.1992 26.6554 18.4648V21.2483H18.4215V21.2483",
p2459a300: "M14.7078 14.7859H24.1423C24.953 14.7859 25.6901 14.0306 25.6901 13.1244C25.6901 12.2937 24.953 11.5385 24.1423 11.5385H14.7078C12.9389 11.5385 11.5385 12.9734 11.5385 14.7859V37.2911C11.5385 39.1036 12.9389 40.5385 14.7078 40.5385H24.1423C24.953 40.5385 25.6901 39.7833 25.6901 38.9525C25.6901 38.0463 24.953 37.2911 24.1423 37.2911H14.7078V14.7859ZM39.3258 25.5098L34.9034 20.9786C34.3875 20.4499 33.5767 20.8275 33.5767 21.5072V24.4525H22.5207C21.7099 24.4525 20.9729 25.1322 20.9729 26.0385C20.9729 26.9447 21.7099 27.6244 22.5207 27.6244H33.5767V30.5697C33.5767 31.2494 34.3875 31.627 34.9034 31.0984L39.2521 26.5671C39.6206 26.265 39.6206 25.8119 39.3258 25.5098Z",
p29724ac0: "M0.210938 0.210938C-0.0703125 0.492188 -0.0703125 0.984375 0.210938 1.26562L3.12891 4.18359L0.210938 7.10156C-0.0703125 7.38281 -0.0703125 7.875 0.210938 8.15625C0.527344 8.4375 0.984375 8.4375 1.26562 8.15625L4.71094 4.71094C5.02734 4.42969 5.02734 3.9375 4.71094 3.65625L1.26562 0.210938C0.984375 -0.0703125 0.527344 -0.0703125 0.210938 0.210938V0.210938",
p2ec56d80: "M22.9317 11.78L13.1661 16.0312C12.1895 16.4821 11.5385 17.5127 11.5385 18.5433V25.0489C11.5385 32.6496 16.877 39.7993 24.0385 41.5385C31.1999 39.7993 36.5385 32.6496 36.5385 25.0489V18.5433C36.5385 17.5127 35.8874 16.4821 34.9109 16.0312L25.1452 11.78C24.4291 11.4579 23.6478 11.4579 22.9317 11.78V11.78M20.2624 32.3275L16.6817 28.7204C16.1609 28.2051 16.1609 27.3678 16.6817 26.7881C17.2025 26.2728 18.114 26.2728 18.6348 26.7881L21.239 29.3645L29.4421 21.313C29.9629 20.7977 30.8744 20.7977 31.3952 21.313C31.9161 21.8283 31.9161 22.7301 31.3952 23.2454L22.2155 32.3275C21.6947 32.8428 20.8484 32.8428 20.2624 32.3275V32.3275",
p2f924600: "M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z",
p3f6dfc80: "M22.9978 25.3622C22.6881 25.3622 22.3784 25.2905 22.0687 25.2905C18.9096 25.2905 15.8744 26.3649 13.3348 28.0839C12.2198 28.8718 11.5385 30.3759 11.5385 31.9517V34.4586C11.5385 35.3181 12.0959 36.0343 12.8393 36.0343H23.7411C22.6881 34.3153 22.0687 32.1666 22.0687 29.8746C22.0687 28.2988 22.4403 26.723 22.9978 25.3622ZM16.8036 17.6982C16.8036 14.3319 19.1574 11.5385 22.0687 11.5385C24.98 11.5385 27.3957 14.3319 27.3957 17.6982C27.3957 21.0646 24.98 23.7864 22.0687 23.7864C19.1574 23.7864 16.8036 21.0646 16.8036 17.6982ZM36.3154 29.8746C36.3154 29.588 36.2535 29.2299 36.1916 28.9434L37.3065 27.7974C37.5543 27.5825 37.6162 27.1528 37.4304 26.8663L36.6871 25.2905C36.5013 25.004 36.1916 24.8608 35.8819 24.9324L34.5191 25.5054C34.0855 25.0757 33.59 24.7892 33.0944 24.5743L32.7847 22.8553C32.7228 22.5688 32.475 22.2823 32.1034 22.2823H30.5548C30.2451 22.2823 29.9973 22.5688 29.9354 22.8553L29.6257 24.5743C29.1301 24.7892 28.6346 25.0757 28.201 25.5054L26.7763 24.9324C26.5285 24.8608 26.1569 25.004 26.033 25.2905L25.2277 26.8663C25.1039 27.1528 25.1658 27.5825 25.3516 27.7974L26.4666 28.9434C26.4666 29.2299 26.4047 29.588 26.4047 29.8746C26.4047 30.2327 26.4666 30.5192 26.4666 30.8773L25.3516 31.9517C25.1658 32.2382 25.1039 32.5963 25.2277 32.9544L26.033 34.5302C26.1569 34.8167 26.5285 34.9599 26.7763 34.8167L28.201 34.3153C28.6346 34.6734 29.1301 35.0316 29.6257 35.2465L29.9354 36.8938C29.9973 37.252 30.2451 37.5385 30.5548 37.5385H32.1034C32.475 37.5385 32.7228 37.252 32.7847 36.8938L33.0944 35.2465C33.59 35.0316 34.0855 34.6734 34.5191 34.3153L35.8819 34.8167C36.1916 34.9599 36.5013 34.8167 36.6871 34.5302L37.4304 32.9544C37.6162 32.5963 37.5543 32.2382 37.3065 31.9517L36.1916 30.8773C36.2535 30.5192 36.3154 30.2327 36.3154 29.8746ZM31.3601 32.9544C29.8734 32.9544 28.6965 31.5936 28.6965 29.8746C28.6965 28.2272 29.8734 26.8663 31.3601 26.8663C32.7847 26.8663 33.9616 28.2272 33.9616 29.8746C33.9616 31.5936 32.7847 32.9544 31.3601 32.9544Z",
p6253480: "M24.5385 11.5385C17.3366 11.5385 11.5385 17.3366 11.5385 24.5385C11.5385 31.7403 17.3366 37.5385 24.5385 37.5385C31.7403 37.5385 37.5385 31.7403 37.5385 24.5385C37.5385 17.3366 31.7403 11.5385 24.5385 11.5385V11.5385M24.5385 31.069C23.8061 31.069 23.2568 30.4586 23.2568 29.7263V24.5385C23.2568 23.8061 23.8061 23.2568 24.5385 23.2568C25.2709 23.2568 25.8202 23.8061 25.8202 24.5385V29.7263C25.8202 30.4586 25.2709 31.069 24.5385 31.069V31.069M25.8202 20.6324H23.2568V18.0079H25.8202V20.6324V20.6324",
};

// Icon component with glow effect
function GlowIcon({
  svgPath,
  color,
  glowColor,
  bgColor,
  viewBox = "0 0 49 49",
}: {
  svgPath: string;
  color: string;
  glowColor: string;
  bgColor: string;
  viewBox?: string;
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
      <svg width="20" height="20" viewBox="10 10 30 30" fill="none">
        <defs>
          <filter id={`glow-${color}`} colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <path d={svgPath} fill={color} />
      </svg>
    </div>
  );
}

// Menu item row
function MenuItem({
  icon,
  label,
  rightText,
  showArrow = true,
}: {
  icon: React.ReactNode;
  label: string;
  rightText?: string;
  showArrow?: boolean;
}) {
  return (
    <button className="flex items-center w-full px-4 py-3.5 gap-3 active:bg-white/5 transition-colors">
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
        <svg width="6" height="10" viewBox="0 0 5 9" fill="none" opacity={0}>
          <path d={svgPaths.p29724ac0} fill="#4B5563" />
        </svg>
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

export function SettingsPage() {
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
        <div className="flex items-center px-5 pt-3 pb-3 bg-[#0a0a0a]">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#232322] backdrop-blur-sm shrink-0">
            <svg width="18" height="17" viewBox="0 0 35 34" fill="none">
              <path
                d={svgPaths.p2f924600}
                fill="white"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <span className="text-white font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 18 }}>
              创建原创故事
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Sections */}
        <div className="px-5 pt-3 pb-6 flex flex-col gap-5">
          {/* Section 1: Feedback & About */}
          <SectionCard>
            <MenuItem
              icon={
                <GlowIcon
                  svgPath={svgPaths.p1a6ba880}
                  color="#60A5FA"
                  glowColor="rgba(96,165,250,0.4)"
                  bgColor="rgba(59,130,246,0.1)"
                />
              }
              label="意见与反馈"
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  svgPath={svgPaths.p6253480}
                  color="#C084FC"
                  glowColor="rgba(192,132,252,0.4)"
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
                  svgPath={svgPaths.p3f6dfc80}
                  color="#34D399"
                  glowColor="rgba(52,211,153,0.4)"
                  bgColor="rgba(16,185,129,0.1)"
                />
              }
              label="账号设置"
            />
            <Divider />
            <MenuItem
              icon={
                <GlowIcon
                  svgPath={svgPaths.p2ec56d80}
                  color="#FB923C"
                  glowColor="rgba(251,146,60,0.4)"
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
                  svgPath={svgPaths.p21cc2a00}
                  color="#F472B6"
                  glowColor="rgba(244,114,182,0.4)"
                  bgColor="rgba(236,72,153,0.1)"
                />
              }
              label="隐私设置"
            />
          </SectionCard>

          {/* Section 3: Logout */}
          <SectionCard>
            <button className="flex items-center justify-center w-full px-4 py-4 gap-2 active:bg-white/5 transition-colors">
              <svg width="16" height="17" viewBox="10 10 30 32" fill="none">
                <path d={svgPaths.p2459a300} fill="#F87171" />
              </svg>
              <span className="text-[#f87171] font-['Noto_Sans_SC',sans-serif]" style={{ fontSize: 15 }}>
                退出登录
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
            应用版本 1.0.0
          </span>
          <span
            className="text-gray-600 font-['Noto_Sans_SC',sans-serif]"
            style={{ fontSize: 10 }}
          >
            探拾AI伴侣
          </span>
        </div>
      </div>
    </div>
  );
}
