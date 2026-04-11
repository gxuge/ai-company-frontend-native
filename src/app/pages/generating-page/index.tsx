import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { StoryGeneratingStage } from "./components/StoryGeneratingStage";
import { CharacterGeneratingStage } from "./components/CharacterGeneratingStage";
import { AvatarGeneratingStage } from "./components/AvatarGeneratingStage";
import { ProgressSteps } from "./components/ProgressSteps";

const stages = [
  { id: "story", label: "故事", component: StoryGeneratingStage },
  { id: "character", label: "人物", component: CharacterGeneratingStage },
  { id: "avatar", label: "形象", component: AvatarGeneratingStage },
];

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return 0;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const CurrentStageComponent = stages[currentStage].component;

  return (
    <div className="relative size-full min-h-screen overflow-hidden bg-gradient-to-br from-[var(--ai-bg-start)] to-[var(--ai-bg-end)] dark">
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-20 safe-area-top">
        <button
          className="w-11 h-11 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center active:bg-white/20 transition-colors touch-manipulation"
          aria-label="返回"
        >
          <ChevronLeft className="w-6 h-6 text-white/70" />
        </button>
        <span className="text-xs text-white/30 font-normal">AI 生成中</span>
      </div>

      <div className="absolute top-20 left-0 right-0 z-20">
        <ProgressSteps steps={stages} currentStep={currentStage} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          className="size-full pt-36"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <CurrentStageComponent />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20 pb-safe safe-area-bottom">
        {stages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStage(index)}
            className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentStage
                ? "w-8 bg-white/80"
                : "w-1.5 bg-white/20 active:bg-white/50"
            }`}
            aria-label={`切换到${stages[index].label}`}
          />
        ))}
      </div>
    </div>
  );
}