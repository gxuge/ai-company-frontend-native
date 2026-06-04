import type { ImageSourcePropType } from 'react-native';
import * as React from 'react';
import { Image, Platform, Pressable } from 'react-native';
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

export type AiMoreBtnProps = React.ComponentProps<typeof Pressable> & {
  iconSource: ImageSourcePropType;
  customWidth?: string;
  customHeight?: string;
  radius?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconTintColor?: string;
};

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
  const resolvedSource = typeof iconSource === 'number'
    ? (Image.resolveAssetSource(iconSource) as any)?.uri ?? ''
    : ((iconSource as any)?.uri ?? (iconSource as any)?.default ?? '');

  if (Platform.OS === 'web') {
    const { onPress, disabled, style, ...restProps } = props as any;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onPress}
        style={{
          width: Number.parseInt(customWidth.match(/\d+/)?.[0] ?? '44', 10),
          height: Number.parseInt(customHeight.match(/\d+/)?.[0] ?? '44', 10),
          borderRadius: radius.includes('full') ? 9999 : Number.parseInt(radius.match(/\d+/)?.[0] ?? '22', 10),
          border: 'none',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          appearance: 'none',
          WebkitAppearance: 'none',
          ...(style as any),
        }}
        {...restProps}
      >
        <img
          src={resolvedSource}
          style={{
            width: iconWidth,
            height: iconHeight,
            objectFit: 'contain',
            filter: iconTintColor === '#ffffff' ? 'brightness(0) invert(1)' : undefined,
          }}
        />
      </button>
    );
  }

  return (
    <Pressable
      className={aiMoreBtnBgVariants({
        className: [
          props.disabled && 'opacity-50',
          customWidth,
          customHeight,
          radius,
          className,
        ].filter(Boolean).join(' '),
      })}
      role="button"
      {...props}
    >
      <Image
        source={iconSource}
        style={{ width: iconWidth, height: iconHeight }}
        tintColor={iconTintColor}
        resizeMode="contain"
      />
    </Pressable>
  );
}
