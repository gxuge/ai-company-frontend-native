import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const fontBase = "font-['Noto_Sans_SC',sans-serif]";

export interface AiSelectOption<T extends string | number> {
  label: string;
  value: T;
}

export interface AiSelectTabProps<T extends string | number> {
  options: AiSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  containerClassName?: string;
  activeBgClassName?: string;
  activeTextClassName?: string;
  inactiveTextClassName?: string;
  itemClassName?: string;
  disabled?: boolean;
}

export function AiSelectTab<T extends string | number>({
  options,
  value,
  onChange,
  containerClassName = "bg-[#0c0c0c] border border-[rgba(255,255,255,0.3)] rounded-lg p-1",
  activeBgClassName = "bg-brand-green/20 rounded-[5px]",
  activeTextClassName = "text-brand-green font-medium",
  inactiveTextClassName = "text-[#9ca3af]",
  itemClassName = "flex-1 py-1.5 items-center justify-center z-10",
  disabled = false,
}: AiSelectTabProps<T>) {
  const activeIndex = Math.max(0, options.findIndex(o => o.value === value));
  const optionCount = options.length;
  
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(`${(activeIndex / optionCount) * 100}%`, { duration: 200 }),
    };
  });

  return (
    <View className={`${containerClassName} ${disabled ? 'opacity-50' : ''}`}>
      <View className="flex-row relative flex-1">
        <Animated.View
          className={`absolute top-0 bottom-0 ${activeBgClassName}`}
          style={[{ width: `${100 / optionCount}%` }, animatedBackgroundStyle]}
        />
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <Pressable
              key={String(option.value)}
              onPress={() => {
                if (!disabled) {
                  onChange(option.value);
                }
              }}
              disabled={disabled}
              className={itemClassName}
            >
              <Text
                className={`text-[15px] ${fontBase} transition-colors tracking-wide ${
                  isActive ? activeTextClassName : inactiveTextClassName
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
