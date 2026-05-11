import * as React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export interface AiSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  containerClassName?: string;
  baseColor?: string;
}

export function AiSkeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
  containerClassName = '',
  baseColor = 'rgba(255, 255, 255, 0.1)',
}: AiSkeletonProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      className={containerClassName}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}
