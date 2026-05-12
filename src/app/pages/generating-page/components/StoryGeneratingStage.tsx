import { motion } from "motion/react";
import { BookOpen, Sparkles } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";
import { useEffect, useState } from "react";
import { View } from 'react-native';

const statusMessages = [
  "分析你的偏好中",
  "构建故事背景中",
  "编织情节线索中",
  "优化开场节奏中",
];

export function StoryGeneratingStage() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

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

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <View className="relative flex flex-col items-center justify-between h-full px-5 py-8">
      <FloatingParticles count={25} />

      <View className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-sm relative z-10">
        <motion.div
          className="relative w-64 h-48"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--ai-purple)] to-[var(--ai-blue)] blur-3xl opacity-30"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <View className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[var(--ai-purple)]/20 to-[var(--ai-blue)]/20 backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-center gap-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="flex gap-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="h-1.5 rounded-full bg-gradient-to-r from-[var(--ai-purple)] to-[var(--ai-blue)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${20 + Math.random() * 60}px` }}
                    transition={{
                      delay: i * 0.15 + j * 0.08,
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                ))}
              </motion.div>
            ))}
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
            正在生成故事
          </motion.h1>
          <motion.p
            className="text-white/60 max-w-xs"
            style={{ fontSize: 15, lineHeight: 1.5 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            正在整理世界观、人物关系与情节走向
          </motion.p>
        </View>

        <View className="w-full space-y-6">
          <View className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--ai-purple)] via-[var(--ai-blue)] to-[var(--ai-cyan)] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 bg-white/30 blur-md"
              style={{ width: `${Math.min(progress, 100)}%` }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
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

        <View className="grid grid-cols-1 gap-3 w-full mt-4">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              className="h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <View className="w-full h-full p-3 flex flex-col gap-2">
                <View className="w-3/4 h-2 bg-white/10 rounded-full animate-pulse" />
                <View className="w-full h-2 bg-white/10 rounded-full animate-pulse" />
                <View className="w-1/2 h-2 bg-white/10 rounded-full animate-pulse" />
              </View>
            </motion.div>
          ))}
        </View>
      </View>

      <motion.p
        className="text-white/50 text-center max-w-xs relative z-10 px-4"
        style={{ fontSize: 13, lineHeight: 1.5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        我们正在为你组合更连贯、更有代入感的剧情
      </motion.p>
    </View>
  );
}
