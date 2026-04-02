import * as React from 'react';
import { Pressable, Image, type ImageSourcePropType } from 'react-native';
import { tv } from 'tailwind-variants';

const aiMoreBtnBgVariants = tv({
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

export interface AiMoreBtnProps extends React.ComponentProps<typeof Pressable> {
  iconSource: ImageSourcePropType;
  customWidth?: string;
  customHeight?: string;
  radius?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconTintColor?: string;
}

export function AiMoreBtn({
  iconSource,
  customWidth = 'w-[44px]',
  customHeight = 'h-[44px]',
  radius = 'rounded-full',
  iconWidth = 24,
  iconHeight = 24,
  iconTintColor = '#ffffff',
  className,
  ...props
}: AiMoreBtnProps) {
  return (
    <Pressable
      className={aiMoreBtnBgVariants({
        className: [
          props.disabled && 'opacity-50',
          customWidth,
          customHeight,
          radius,
          className
        ].filter(Boolean).join(' '),
      })}
      role="button"
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
