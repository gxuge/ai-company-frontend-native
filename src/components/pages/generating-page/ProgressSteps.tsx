import { motion } from "motion/react";

interface Step {
  id: string;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className={`relative flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-500 touch-manipulation ${
                index === currentStep
                  ? "border-[var(--ai-purple)] bg-[var(--ai-purple)]/20"
                  : index < currentStep
                  ? "border-[var(--ai-purple)]/60 bg-[var(--ai-purple)]/10"
                  : "border-white/20 bg-white/5"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {index === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[var(--ai-purple)]"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
              <span
                className={`z-10 ${
                  index <= currentStep ? "text-white" : "text-white/40"
                }`}
                style={{ fontSize: '15px', fontWeight: 500 }}
              >
                {index + 1}
              </span>
            </motion.div>
            <span
              className={`transition-colors duration-300 ${
                index === currentStep
                  ? "text-white"
                  : index < currentStep
                  ? "text-white/60"
                  : "text-white/30"
              }`}
              style={{ fontSize: '12px' }}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden -mb-8">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--ai-purple)] to-[var(--ai-blue)]"
                initial={{ width: "0%" }}
                animate={{ width: index < currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
