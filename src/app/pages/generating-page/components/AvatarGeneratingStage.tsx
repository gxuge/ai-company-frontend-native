import { motion } from "motion/react";
// @ts-expect-error
import { Image, Sparkles } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";
import { useEffect, useState } from "react";
// @ts-expect-error
import { View, Image } from 'react-native';

const statusMessages = [
  "匹配外观风格中",
  "细化五官特征中",
  "渲染服装与配色中",
  "完善最终形象中",
];

export function AvatarGeneratingStage() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % statusMessages.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 3;
      });
    }, 200);

    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 30);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <View className="relative flex flex-col items-center justify-between h-full px-5 py-8">
      <FloatingParticles count={35} />

      <View className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-sm relative z-10">
        <motion.div
          className="relative w-56 h-56"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--ai-blue)] via-[var(--ai-purple)] to-[var(--ai-cyan)] blur-3xl opacity-40"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <View className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[var(--ai-blue)]/20 via-[var(--ai-purple)]/20 to-[var(--ai-cyan)]/20 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
            <View className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
              {[...Array(64)].map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-sm bg-gradient-to-br from-[var(--ai-purple)]/40 to-[var(--ai-blue)]/40"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: (i % 8) * 0.05 + Math.floor(i / 8) * 0.08,
                    duration: 0.3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              ))}
            </View>

            <motion.div
              className="absolute"
              animate={{
                scale: [0.95, 1.05, 0.95],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image className="w-20 h-20 text-white/90 relative z-10" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              className="absolute top-3 right-3"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-5 h-5 text-[var(--ai-cyan)]" />
            </motion.div>
          </View>
        </motion.div>

        <View className="flex flex-col items-center gap-3 text-center px-4">
          <motion.h1
            className="text-white"
            style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.3 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            正在生成形象
          </motion.h1>
          <motion.p
            className="text-white/60 max-w-xs"
            style={{ fontSize: 15, lineHeight: 1.5 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            正在生成角色外观、服装细节与整体气质
          </motion.p>
        </View>

        <View className="w-full space-y-6">
          <View className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--ai-blue)] via-[var(--ai-purple)] to-[var(--ai-cyan)] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </View>

          <motion.div
            className="flex items-center justify-center gap-2 text-white/70 min-h-[24px]"
            style={{ fontSize: 14 }}
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[var(--ai-cyan)]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            {statusMessages[currentMessage]}
          </motion.div>
        </View>

        <motion.div
          className="relative w-full aspect-[3/4] max-w-[240px] rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <View className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

          <motion.div
            className="absolute inset-x-0 h-20 bg-gradient-to-b from-[var(--ai-cyan)]/50 via-[var(--ai-blue)]/30 to-transparent"
            style={{ top: `${scanLine}%` }}
            animate={{
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />

          <View className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </View>

          <View className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent" />

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </View>

      <motion.p
        className="text-white/50 text-center max-w-xs relative z-10 px-4"
        style={{ fontSize: 13, lineHeight: 1.5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        即将完成，请稍候片刻
      </motion.p>
    </View>
  );
}
