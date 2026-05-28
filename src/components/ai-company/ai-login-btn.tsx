import * as React from 'react';
import { Platform, Pressable, Text } from 'react-native';
import { tv } from 'tailwind-variants';

const aiLoginBtnBgVariants = tv({
  base: 'group flex-row items-center justify-center shadow-none',
  variants: {
    themeColor: {
      primary: 'bg-[#9bfe03] active:bg-[#9bfe03]/60 shadow-sm shadow-black/5',
      secondary: 'bg-[#28292d] active:bg-[#28292d]/80 shadow-sm shadow-black/5',
    },
  },
  defaultVariants: {
    themeColor: 'primary',
  },
});

const aiLoginBtnTextVariants = tv({
  base: 'font-medium text-center',
  variants: {
    themeColor: {
      primary: 'text-black',
      secondary: 'text-[#b2b3b6]',
    },
  },
  defaultVariants: {
    themeColor: 'primary',
  },
});

export interface AiLoginBtnProps extends React.ComponentProps<typeof Pressable> {
  label?: string;
  themeColor?: 'primary' | 'secondary';
  customWidth?: string;
  customHeight?: string;
  radius?: string;
  textClassName?: string;
}

export function AiLoginBtn({
  label = '一键登录',
  themeColor = 'primary',
  customWidth = 'w-full',
  customHeight = 'h-12',
  radius = 'rounded-full',
  textClassName,
  className,
  ...props
}: AiLoginBtnProps) {
  const classes = aiLoginBtnBgVariants({
    themeColor,
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
        <span className={aiLoginBtnTextVariants({ themeColor, className: textClassName })}>
          {label}
        </span>
      </button>
    );
  }

  return (
    <Pressable
      className={classes}
      role="button" // Same standard role as Button component
      {...props}
    >
      <Text className={aiLoginBtnTextVariants({ themeColor, className: textClassName })}>
        {label}
      </Text>
    </Pressable>
  );
}
