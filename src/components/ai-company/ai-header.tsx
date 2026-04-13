import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const fontBase = "font-['Noto_Sans_SC',sans-serif]";

interface AiHeaderProps {
  title: string;
  className?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export function AiHeader({ title, className = '', onBack, rightElement }: AiHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('../'); // Fallback if no history
    }
  };

  return (
    <View className={`flex-row items-center justify-between relative ${className}`}>
      <Pressable 
        onPress={handleBack}
        className="w-10 h-10 rounded-full bg-[#232322] items-center justify-center z-10"
      >
        <Svg width="18" height="17" viewBox="0 0 35 33.6" fill="none">
          <Path
            clipRule="evenodd"
            d="M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z"
            fill="white"
            fillRule="evenodd"
          />
        </Svg>
      </Pressable>
      <View pointerEvents="none" className="absolute inset-0 items-center justify-center z-0">
        <Text className={`text-white text-lg ${fontBase} font-bold`}>
          {title}
        </Text>
      </View>
      {/* Right slot: custom element or symmetry spacer */}
      {rightElement ?? <View className="w-10 h-10 shrink-0" />}
    </View>
  );
}
