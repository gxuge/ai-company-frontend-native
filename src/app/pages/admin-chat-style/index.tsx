import { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "@/assets/images/admin-chat-style/svg-stdnzgn42m";
import imgImage from "@/assets/images/admin-chat-style/ecb7a353c6950598ee6e686ed5e5d05068e56c7f.png";
import imgImage1 from "@/assets/images/admin-chat-style/a5ca4172116f94768b6109da1c02910fc74f649b.png";

// Feature Cards at bottom
function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative shrink-0 w-[22%] aspect-square bg-gradient-to-br from-[#2d2520] to-[#1a1612] rounded-[20px] md:rounded-[24px] cursor-pointer overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-[20px] md:rounded-[24px] p-[1px] bg-gradient-to-br from-amber-400/40 via-orange-400/40 to-rose-400/40">
        <div className="size-full rounded-[19px] md:rounded-[23px] bg-gradient-to-br from-[#2d2520] to-[#1a1612]" />
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-rose-500/20 rounded-[20px] md:rounded-[24px]"
        />
      )}

      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center scale-75 md:scale-100">
        {icon}
      </div>

      {/* Label */}
      <div className="absolute bottom-[15%] right-0 translate-x-[120%] md:translate-x-[110%] translate-y-1/2">
        <div className="flex flex-col font-['Alibaba_PuHuiTi_3.0:55_Regular_L3','Noto_Sans_JP:Regular',sans-serif] text-[18px] md:text-[23.529px] text-white/90">
          <p className="leading-tight whitespace-nowrap">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// AI Creation Button
function AIButton() {
  return (
    <motion.div
      className="bg-gradient-to-r from-amber-600 to-orange-600 h-[60px] md:h-[75px] px-[20px] md:px-[28px] py-[7px] rounded-[15px] cursor-pointer overflow-hidden relative group flex-1 max-w-[180px]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <div className="relative flex gap-[5px] items-center justify-center h-full">
        {/* AI Icon */}
        <div className="size-[28px] md:size-[35px] flex items-center justify-center">
          <svg className="size-full" fill="none" viewBox="0 0 35 35">
            <path d={svgPaths.p1ad98500} fill="white" transform="scale(1.2)" />
          </svg>
        </div>

        <div className="flex flex-col font-['Alibaba_PuHuiTi_3.0:55_Regular_L3','Noto_Sans:Regular',sans-serif] text-[22px] md:text-[26px] text-white">
          <p className="leading-tight">AI创作</p>
        </div>
      </div>
    </motion.div>
  );
}

// Suggested Question Button
function SuggestedButton({ text }: { text: string }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#352d28] to-[#2a2118] h-[70px] md:h-[80px] rounded-[15px] w-full cursor-pointer relative overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-[15px] p-[1px] bg-gradient-to-r from-amber-400/0 via-orange-400/0 to-rose-400/0 group-hover:from-amber-400/60 group-hover:via-orange-400/60 group-hover:to-rose-400/60 transition-all duration-300">
        <div className="size-full rounded-[14px] bg-gradient-to-br from-[#352d28] to-[#2a2118]" />
      </div>

      <div className="absolute inset-0 flex items-center px-[20px] md:px-[24px]">
        <div className="flex flex-col font-['Alibaba_PuHuiTi_3.0:55_Regular_L3','Noto_Sans_SC:Regular',sans-serif] text-[20px] md:text-[24.812px] text-white/80 group-hover:text-white transition-colors">
          <p className="leading-[normal]">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative size-full bg-gradient-to-br from-[#1a1410] via-[#221a14] to-[#1a1410] overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />

      {/* Main content container */}
      <div className="relative h-full w-full max-w-[750px] mx-auto flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none bg-black/40 backdrop-blur-xl h-[120px] md:h-[170px] border-b border-white/5"
        >
          <div className="h-full flex items-center justify-between px-[20px] md:px-[38px]">
            {/* Left icon */}
            <div className="h-[16px] md:h-[19px] w-[32px] md:w-[38px]">
              <img alt="" className="object-cover size-full" src={imgImage} />
            </div>

            {/* Center title */}
            <div className="flex flex-col gap-[6px] md:gap-[8px] items-center">
              <div className="flex items-center gap-[6px] md:gap-[8px]">
                <div className="font-['Microsoft_YaHei:Regular',sans-serif] text-[22px] md:text-[28px] text-white">
                  系统小探
                </div>
                <div className="h-[18px] md:h-[21px] w-[8px] md:w-[10px]">
                  <img alt="" className="object-cover size-full" src={imgImage1} />
                </div>
              </div>
              <div className="font-['Microsoft_YaHei:Regular',sans-serif] text-[15px] md:text-[19px] text-[#9a8b7a]">
                内容由AI生成
              </div>
            </div>

            {/* Right icon - menu */}
            <div className="size-[44px] md:size-[56px] flex items-center justify-center cursor-pointer group">
              <svg className="size-[80%]" fill="none" viewBox="0 0 49 37">
                <g className="stroke-white/60 group-hover:stroke-amber-400 transition-colors">
                  <path d={svgPaths.p104f6100} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
                  <path d={svgPaths.p320ddf80} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
                  <path d={svgPaths.p32073300} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
                </g>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Chat area with suggestions */}
        <div className="flex-1 overflow-y-auto px-[16px] md:px-[26px] py-[24px] md:py-[40px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* "Start new topic" text */}
            <div className="flex justify-center mb-[20px] md:mb-[30px]">
              <div className="font-['Microsoft_YaHei:Regular',sans-serif] text-[18px] md:text-[22.556px] text-[#7a6b5a]">
                聊聊新话题
              </div>
            </div>

            {/* Suggested questions */}
            <div className="flex flex-col gap-[16px] md:gap-[25px] mb-[30px] md:mb-[40px]">
              <SuggestedButton text="如何快速清空当前对话记录？" />
              <SuggestedButton text="如何快速清空当前对话记录？" />
              <SuggestedButton text="如何快速清空当前对话记录？" />
            </div>

            {/* AI Creation buttons */}
            <div className="flex gap-[12px] md:gap-[15px] justify-center mb-[30px] md:mb-[40px]">
              <AIButton />
              <AIButton />
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <div className="flex-none pb-[20px] md:pb-[30px] px-[16px] md:px-[20px] safe-area-bottom">
          {/* Input box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-gradient-to-br from-[#2d2520]/80 to-[#1a1612]/80 backdrop-blur-xl h-[80px] md:h-[100px] rounded-[24px] md:rounded-[30px] mb-[20px] md:mb-[30px] overflow-hidden"
          >
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-[24px] md:rounded-[30px] p-[2px] bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-rose-400/20">
              <div className="size-full rounded-[22px] md:rounded-[28px] bg-gradient-to-br from-[#2d2520]/95 to-[#1a1612]/95 backdrop-blur-xl" />
            </div>

            <div className="relative h-full flex items-center justify-between px-[16px] md:px-[25px]">
              {/* Voice icon and input */}
              <div className="flex items-center gap-[12px] md:gap-[20px] flex-1">
                <div className="size-[40px] md:size-[50px] cursor-pointer group flex-shrink-0">
                  <svg className="size-full" fill="none" viewBox="0 0 50 50">
                    <g className="stroke-white/60 group-hover:stroke-amber-400 transition-colors">
                      <path d={svgPaths.p1d182000} strokeLinejoin="round" strokeWidth="4.17" />
                      <path d={svgPaths.p1a121b80} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.17" />
                    </g>
                    <path d={svgPaths.p3f782180} fill="white" fillOpacity="0.6" className="group-hover:fill-amber-400 transition-colors" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="发消息或按住说话..."
                  className="flex-1 bg-transparent outline-none font-['Alibaba_PuHuiTi_3.0:55_Regular_L3','Noto_Sans_SC:Regular',sans-serif] text-[20px] md:text-[30px] text-white placeholder:text-[#5a4a3a]"
                />
              </div>

              {/* Send button */}
              <div className="size-[38px] md:size-[47px] cursor-pointer group flex-shrink-0">
                <svg className="size-full" fill="none" viewBox="0 0 47 48">
                  <g className="fill-white/60 stroke-white/60 group-hover:fill-amber-400 group-hover:stroke-amber-400 transition-colors">
                    <path d={svgPaths.p16246900} />
                    <path d={svgPaths.pd31ba70} />
                    <path d={svgPaths.pddf3000} />
                  </g>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between gap-[2%]"
          >
            <FeatureCard
              label="相机"
              icon={
                <svg className="size-[45px]" fill="none" viewBox="0 0 45 45">
                  <path d={svgPaths.p2c2b5a71} fill="white" fillOpacity="0.9" />
                </svg>
              }
            />

            <FeatureCard
              label="图片"
              icon={
                <svg className="size-[42px]" fill="none" viewBox="0 0 42 42">
                  <path d={svgPaths.p3fc05300} fill="white" fillOpacity="0.9" />
                </svg>
              }
            />

            <FeatureCard
              label="文件"
              icon={
                <svg className="size-[45px]" fill="none" viewBox="0 0 39 39">
                  <path d={svgPaths.p3efb1e80} className="stroke-white/90" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" fillRule="evenodd" clipRule="evenodd" />
                  <path d="M10.3742 24.306H28.362" className="stroke-white/90" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              }
            />

            <FeatureCard
              label="通话"
              icon={
                <svg className="size-[48px]" fill="none" viewBox="0 0 48 48">
                  <path d={svgPaths.p10927680} fill="white" fillOpacity="0.9" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              }
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
