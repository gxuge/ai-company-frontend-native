import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const fontBase = "font-['Noto_Sans_SC',sans-serif]";

export interface AiTopTabItem<T extends string> {
  id: T;
  label: string;
}

export interface AiTopTabsProps<T extends string> {
  tabs: AiTopTabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  containerClassName?: string;
  activeBgClassName?: string;
  activeTextClassName?: string;
  inactiveTextClassName?: string;
}

export function AiTopTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  containerClassName = "bg-black rounded-full border border-[rgba(155,254,3,0.3)] p-1",
  activeBgClassName = "bg-[rgba(155,254,3,0.9)] rounded-full",
  activeTextClassName = "text-[#3b3f34] font-bold",
  inactiveTextClassName = "text-[#9ca3af]",
}: AiTopTabsProps<T>) {
  const activeIndex = Math.max(0, tabs.findIndex(t => t.id === activeTab));
  const tabCount = tabs.length;
  
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(`${(activeIndex / tabCount) * 100}%`, { duration: 200 }),
    };
  });

  return (
    <View className={containerClassName}>
      <View className="flex-row relative flex-1">
        <Animated.View
          className={`absolute top-0 bottom-0 ${activeBgClassName}`}
          style={[{ width: `${100 / tabCount}%` }, animatedBackgroundStyle]}
        />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              className="flex-1 py-1.5 items-center justify-center z-10"
            >
              <Text
                className={`text-sm ${fontBase} transition-colors ${
                  isActive ? activeTextClassName : inactiveTextClassName
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
