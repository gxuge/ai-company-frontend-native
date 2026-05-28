import * as React from 'react';
import { Image, Platform, Pressable, type ImageSourcePropType } from 'react-native';
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
  const classes = aiCloseBtnBgVariants({
    className: [
      props.disabled && 'opacity-50',
      customWidth,
      customHeight,
      radius,
      className,
    ].filter(Boolean).join(' '),
  });

  if (Platform.OS === 'web') {
    const { onPress, disabled, style, ...restProps } = props as any;
    const resolvedSource: any = iconSource as any;
    const iconUri = resolvedSource?.uri ?? resolvedSource?.default ?? resolvedSource;
    return (
      <button
        type="button"
        className={classes}
        onClick={onPress}
        disabled={disabled}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          border: 'none',
          margin: 0,
          padding: 0,
          cursor: disabled ? 'default' : 'pointer',
          ...(style as any),
        }}
        {...restProps}
      >
        <img
          src={iconUri}
          alt=""
          style={{
            width: iconWidth,
            height: iconHeight,
            objectFit: 'contain',
          }}
        />
      </button>
    );
  }

  return (
    <Pressable
      className={classes}
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
