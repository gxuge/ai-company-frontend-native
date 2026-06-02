import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Wand2 } from 'lucide-react';

export function ShimmerLine({ className }: { className?: string }) {
  const sv = useSharedValue(-400);

  useEffect(() => {
    sv.value = withRepeat(
      withTiming(400, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: sv.value }]
  }));

  return (
    <View className={`relative overflow-hidden bg-[#2a2a2a] rounded-[4px] ${className}`}>
      <Animated.View 
        style={[
          { width: 200, height: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.06)' },
          style
        ]} 
      />
    </View>
  );
}

interface AiFormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isGenerating?: boolean;
  containerClassName?: string;
  skeletonLines?: number;
  skeletonPaddingClassName?: string;
  showCount?: boolean;
  onOptimize?: () => void | Promise<void>;
  optimizeLoading?: boolean;
  optimizeDisabled?: boolean;
}

export function AiFormTextarea({
  isGenerating,
  containerClassName = "bg-black rounded-[15px] border-[1px] border-[#494949] overflow-hidden",
  className = "w-full min-h-[138px] p-[16px] bg-transparent border-0 outline-none resize-none text-white placeholder-[#6b7280]",
  skeletonLines = 5,
  skeletonPaddingClassName = "p-[16px]",
  showCount,
  onOptimize,
  optimizeLoading,
  optimizeDisabled = false,
  style,
  maxLength,
  value,
  ...props
}: AiFormTextareaProps) {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const showBottomSpace = (showCount && maxLength) || onOptimize;
  const optimizeInFlightRef = useRef(false);
  const isOptimizing = Boolean(optimizeLoading) || optimizeInFlightRef.current;

  const handleOptimize = async () => {
    if (!onOptimize || optimizeDisabled || isOptimizing || isGenerating) return;
    optimizeInFlightRef.current = true;
    try {
      await onOptimize();
    } finally {
      optimizeInFlightRef.current = false;
    }
  };

  return (
    <div className={`relative flex flex-col w-full ${containerClassName}`}>
      {/* Textarea area with skeleton overlay — skeleton does NOT cover the bottom bar */}
      <div className="relative flex-1">
        {(isGenerating || isOptimizing) && (
          <div className={`absolute inset-0 z-10 flex flex-col gap-[6px] overflow-hidden bg-black ${skeletonPaddingClassName}`}>
            {Array.from({ length: skeletonLines }).map((_, i) => (
               <ShimmerLine 
                 key={i} 
                 className="h-[14px] w-full bg-[#2a2a2a] rounded-[4px]" 
               />
            ))}
          </div>
        )}
        <textarea
          className={className}
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            ...style
          }}
          maxLength={maxLength}
          value={value}
          {...props}
        />
      </div>
      {/* Bottom bar: always visible, even while generating */}
      {showBottomSpace && (
        <div className="flex items-center justify-between px-[12px] pb-[8px] pt-[4px] shrink-0">
          <div className="flex-1 flex justify-start">
            {onOptimize && (
              <>
                <style>{`
                  @keyframes wand-draw {
                    0% { transform: translate(0, -1.5px); }
                    12.5% { transform: translate(1.1px, -1.1px); }
                    25% { transform: translate(1.5px, 0); }
                    37.5% { transform: translate(1.1px, 1.1px); }
                    50% { transform: translate(0, 1.5px); }
                    62.5% { transform: translate(-1.1px, 1.1px); }
                    75% { transform: translate(-1.5px, 0); }
                    87.5% { transform: translate(-1.1px, -1.1px); }
                    100% { transform: translate(0, -1.5px); }
                  }
                  .animate-wand-draw {
                    animation: wand-draw 0.8s linear infinite;
                    transform-origin: center;
                  }
                `}</style>
                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={optimizeDisabled || isOptimizing || isGenerating}
                  className="group flex items-center gap-[4px] rounded-full px-[8px] py-[4px] bg-transparent hover:bg-white/5 active:bg-white/10 disabled:opacity-50 transition-all duration-300"
                >
                  <Wand2 
                    size={12} 
                    color="#9bfe03" 
                    style={{ filter: 'drop-shadow(0 0 8px rgba(155,254,3,1))' }}
                    className={`opacity-90 group-hover:opacity-100 transition-opacity ${isOptimizing ? 'animate-wand-draw' : ''}`}
                  />
                  <span className="relative text-[12px] font-bold tracking-wide bg-linear-to-r from-[#9bfe03] to-[#4ade80] bg-clip-text text-transparent drop-shadow-sm after:absolute after:-bottom-[2px] after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-linear-to-r after:from-[#9bfe03] after:to-[#4ade80] after:transition-transform after:duration-300 group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                    {isOptimizing ? '润色中...' : '美化'}
                  </span>
                </button>
              </>
            )}
          </div>
          {showCount && maxLength && (
            <div className="text-[12px] text-[#6b7280] pointer-events-none pl-[12px] shrink-0">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
