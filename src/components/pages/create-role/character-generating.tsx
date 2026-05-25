import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image, Sparkles } from "lucide-react";

const statusMessages = [
  "匹配外观风格中",
  "细化五官特征中",
  "渲染服装与配色中",
  "完善最终形象中",
];

// Mini Particle logic for the image box
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 1 + Math.random() * 2,
  }));
};

export function CharacterGenerating({ mini = false }: { mini?: boolean }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [particles] = useState(() => generateParticles(12));

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % statusMessages.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99;
        return prev + Math.random() * 4;
      });
    }, 500);

    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 2.5));
    }, 40);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="relative size-full overflow-hidden bg-black/95">
      {/* 1. Glow Background Layers */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute -top-1/4 -left-1/4 size-full rounded-full bg-[var(--ai-blue)] blur-[40px] opacity-30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
           className="absolute -bottom-1/4 -right-1/4 size-full rounded-full bg-[var(--ai-purple)] blur-[40px] opacity-30"
           animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
           transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* 2. Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20 blur-[1px]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
          />
        ))}
      </div>

      {/* 3. Central AI Scanning Container */}
      <div className="relative z-20 flex size-full flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-2">
        
        {/* The Grid Box (Mini AvatarGeneratingStage Grid) */}
        <motion.div 
          className="relative aspect-square w-24 rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Matrix Squares */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0.5 p-1 opacity-20">
             {[...Array(16)].map((_, i) => (
               <motion.div
                 key={i}
                 className="rounded-[2px] bg-gradient-to-br from-[var(--ai-blue)] to-[var(--ai-cyan)]"
                 animate={{ opacity: [0.1, 0.8, 0.1] }}
                 transition={{ delay: (i % 4) * 0.1 + Math.floor(i / 4) * 0.15, duration: 1.5, repeat: Infinity }}
               />
             ))}
          </div>

          {/* Scaning Line */}
          <motion.div
             className="absolute inset-x-0 h-10 bg-gradient-to-b from-[var(--ai-cyan)]/60 via-[var(--ai-blue)]/20 to-transparent z-30"
             style={{ top: `${scanLine}%` }}
          />

          {/* Central Icons */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
             <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
             >
                <Image className="size-10 text-white/90" strokeWidth={1.5} />
             </motion.div>
          </div>

          <motion.div
             className="absolute top-2 right-2 z-30"
             animate={{ rotate: 360 }}
             transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="size-3 text-[var(--ai-cyan)]" />
          </motion.div>
        </motion.div>

        {/* 4. Text & Progress Info */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <Text className="font-['Noto_Sans_SC'] text-[13px] font-bold text-white tracking-wider">
            生成形象中
          </Text>
          
          <div className="h-4 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-1.5"
              >
                <div className="size-1 rounded-full bg-[var(--ai-cyan)] shadow-[0_0_8px_var(--ai-cyan)]" />
                <Text className="font-['Noto_Sans_SC'] text-[10px] text-white/40">
                  {statusMessages[currentMessage]}
                </Text>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar Container */}
          <div className="mt-2 w-24">
             <div className="relative h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--ai-blue)] to-[var(--ai-cyan)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.floor(progress)}%` }}
                  transition={{ duration: 0.3 }}
                />
             </div>
             <Text className="mt-1 text-center font-mono text-[9px] text-white/20">
                {Math.floor(progress)}%
             </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Text shim if Native-web mapping isn't perfect
function Text({ children, className, style }: any) {
  return <span className={className} style={style}>{children}</span>;
}
