import { motion } from "motion/react";
import { User, Sparkles } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";
import { useEffect, useState } from "react";
import { View, Image } from 'react-native';

const imgCharacterRings = ((m: any) => m?.default ?? m?.uri ?? m)(require("@/assets/images/generating-page/character-rings.svg"));

const statusMessages = [
  "生成人物基础信息中",
  "补充性格标签中",
  "细化说话方式中",
  "校准情感氛围中",
];

const personalityTags = [
  "温柔",
  "理性",
  "幽默",
  "神秘",
  "热情",
  "沉稳",
];

export function CharacterGeneratingStage() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleTags, setVisibleTags] = useState<number[]>([]);

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

    const tagInterval = setInterval(() => {
      setVisibleTags((prev) => {
        if (prev.length < personalityTags.length) {
          return [...prev, prev.length];
        }
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(tagInterval);
    };
  }, []);

  return (
    <View className="relative flex flex-col items-center justify-between h-full px-5 py-8">
      <FloatingParticles count={30} />

      <View className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-sm relative z-10">
        <motion.div
          className="relative w-48 h-48"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--ai-purple)] to-[var(--ai-blue)] blur-3xl opacity-35"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <View className="relative w-full h-full rounded-full flex items-center justify-center">
            <Image source={imgCharacterRings} className="w-full h-full" alt="" />

            <motion.div
              className="absolute"
              animate={{
                scale: [0.9, 1.1, 0.9],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <User className="w-16 h-16 text-white/90" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              className="absolute top-8 right-8"
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
            正在生成人物
          </motion.h1>
          <motion.p
            className="text-white/60 max-w-xs"
            style={{ fontSize: 15, lineHeight: 1.5 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            正在塑造角色性格、身份设定与互动风格
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
              className="w-2 h-2 rounded-full bg-[var(--ai-purple)]"
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
          className="w-full rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <View className="flex items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 animate-pulse" />
            <View className="flex-1 space-y-2">
              <View className="w-24 h-3 bg-white/10 rounded-full animate-pulse" />
              <View className="w-32 h-2 bg-white/10 rounded-full animate-pulse" />
            </View>
          </View>

          <View className="flex flex-wrap gap-2">
            {personalityTags.map((tag, index) => (
              <motion.div
                key={tag}
                className="px-3 py-2 rounded-full bg-gradient-to-r from-[var(--ai-purple)]/20 to-[var(--ai-blue)]/20 border border-white/10 text-white/80"
                style={{ fontSize: 13 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: visibleTags.includes(index) ? 1 : 0,
                  scale: visibleTags.includes(index) ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              >
                {tag}
              </motion.div>
            ))}
          </View>

          <View className="space-y-2 pt-2">
            <View className="w-full h-2 bg-white/10 rounded-full animate-pulse" />
            <View className="w-5/6 h-2 bg-white/10 rounded-full animate-pulse" />
            <View className="w-4/6 h-2 bg-white/10 rounded-full animate-pulse" />
          </View>
        </motion.div>
      </View>

      <motion.p
        className="text-white/50 text-center max-w-xs relative z-10 px-4"
        style={{ fontSize: 13, lineHeight: 1.5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        一个更贴近你设定的角色正在形成
      </motion.p>
    </View>
  );
}
