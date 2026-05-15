import * as React from 'react';
import { Image, Pressable, type ImageSourcePropType } from 'react-native';
import { tv } from 'tailwind-variants';

const aiCloseBtnBgVariants = tv({
  base: 'items-center justify-center overflow-hidden',
  variants: {
    themeStyle: {
      default: 'bg-white/10 active:bg-white/20',
    },
  },
  defaultVariants: {
    themeStyle: 'default',
  },
});

export interface AiCloseBtnProps extends React.ComponentProps<typeof Pressable> {
  iconSource: ImageSourcePropType;
  customWidth?: string;
  customHeight?: string;
  radius?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconTintColor?: string;
}

export function AiCloseBtn({
  iconSource,
  customWidth = 'w-[44px]',
  customHeight = 'h-[44px]',
  radius = 'rounded-full',
  iconWidth = 10,
  iconHeight = 10,
  iconTintColor = '#ffffff',
  className,
  ...props
}: AiCloseBtnProps) {
  return (
    <Pressable
      className={aiCloseBtnBgVariants({
        className: [
          props.disabled && 'opacity-50',
          customWidth,
          customHeight,
          radius,
          className,
        ].filter(Boolean).join(' '),
      })}
      accessibilityRole="button"
      {...props}
    >
      <Image
        source={iconSource}
        style={{ width: iconWidth, height: iconHeight, tintColor: iconTintColor }}
        resizeMode="contain"
      />
    </Pressable>
  );
}
