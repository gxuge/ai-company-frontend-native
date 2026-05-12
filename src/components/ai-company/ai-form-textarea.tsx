import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

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
}

export function AiFormTextarea({
  isGenerating,
  containerClassName = "bg-black rounded-[15px] border-[1px] border-[#494949] overflow-hidden",
  className = "w-full min-h-[138px] p-[16px] bg-transparent border-0 outline-none resize-none text-white placeholder-[#6b7280]",
  skeletonLines = 5,
  skeletonPaddingClassName = "p-[16px]",
  style,
  ...props
}: AiFormTextareaProps) {
  return (
    <View className={`relative w-full ${containerClassName}`}>
      {isGenerating && (
        <View className={`absolute inset-0 z-10 w-full h-full flex flex-col gap-[6px] overflow-hidden bg-black ${skeletonPaddingClassName}`}>
          {Array.from({ length: skeletonLines }).map((_, i) => (
             <ShimmerLine 
               key={i} 
               className="h-[14px] w-full bg-[#2a2a2a] rounded-[4px]" 
             />
          ))}
        </View>
      )}
      <textarea
        className={className}
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 20,
          ...style
        }}
        {...props}
      />
    </View>
  );
}
