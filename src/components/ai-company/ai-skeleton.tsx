import * as React from 'react';
import { ViewStyle, StyleProp, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export interface AiSkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
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

  const baseStyle: ViewStyle = {
    width: width as DimensionValue,
    height: height as DimensionValue,
    borderRadius,
    backgroundColor: baseColor,
  };

  return (
    <Animated.View
      className={containerClassName}
      style={[
        baseStyle,
        style,
        animatedStyle,
      ]}
    />
  );
}
