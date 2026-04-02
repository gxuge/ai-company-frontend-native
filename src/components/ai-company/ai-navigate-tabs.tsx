import React, { useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

export interface AiNavigateTabOption<T> {
  label: string;
  value: T;
}

export interface AiNavigateTabsProps<T> {
  options: AiNavigateTabOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  containerClassName?: string;
  activeTextClassName?: string;
  inactiveTextClassName?: string;
  indicatorClassName?: string;
}

interface TabLayout {
  x: number;
  width: number;
}

export function AiNavigateTabs<T extends string | number>({
  options,
  activeValue,
  onChange,
  containerClassName = "flex-row items-center gap-[30px]",
  activeTextClassName = "text-[rgba(155,254,3,0.9)] text-[20px] font-bold pb-2",
  inactiveTextClassName = "text-[#e7e7e7] text-[20px] pb-2",
  indicatorClassName = "absolute bottom-0 h-1 bg-[rgba(155,254,3,0.9)] rounded-[2px]",
}: AiNavigateTabsProps<T>) {
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});

  const handleLayout = (value: T, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [String(value)]: { x, width } }));
  };

  const activeLayout = layouts[String(activeValue)];

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    if (!activeLayout) {
      return { opacity: 0 };
    }
    return {
      opacity: withTiming(1, { duration: 200 }),
      left: withTiming(activeLayout.x, { duration: 250, easing: Easing.out(Easing.cubic) }),
      width: withTiming(activeLayout.width, { duration: 250, easing: Easing.out(Easing.cubic) }),
    };
  }, [activeLayout]);

  return (
    <View className="relative self-start">
      <View className={containerClassName}>
        {options.map((option) => (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            onLayout={(e) => handleLayout(option.value, e)}
            className="items-center relative"
          >
            {/* Hidden spacer forces container to the maximum width (bold) to prevent layout shifts */}
            <Text className={activeTextClassName} style={{ opacity: 0 }} accessibilityElementsHidden>
              {option.label}
            </Text>
            <Text
              style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center' }}
              className={
                activeValue === option.value
                  ? activeTextClassName
                  : inactiveTextClassName
              }
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View className={indicatorClassName} style={animatedIndicatorStyle} />
    </View>
  );
}
