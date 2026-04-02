import * as React from 'react';
import { View, TextInput, Platform, type TextInputProps, type ViewStyle } from 'react-native';
import { tv } from 'tailwind-variants';

const aiInputTv = tv({
  base: 'flex-row items-center',
  variants: {
    editable: {
      false: 'opacity-50',
    },
  },
  defaultVariants: {
    editable: true,
  },
});

const inputFieldTv = tv({
  base: 'flex-1 p-0 m-0',
});

export interface AiInputProps extends Omit<TextInputProps, 'style'> {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  containerClassName?: string;
  containerStyle?: ViewStyle;
  inputClassName?: string;
  inputStyle?: TextInputProps['style'];
}

const AiInput = React.forwardRef<TextInput, AiInputProps>(({
  leftNode,
  rightNode,
  containerClassName,
  containerStyle,
  inputClassName,
  inputStyle,
  onFocus,
  onBlur,
  editable = true,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = React.useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <View 
      className={aiInputTv({
        editable,
        className: containerClassName,
      })}
      style={containerStyle}
    >
      {leftNode}
      
      <TextInput
        ref={ref}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputFieldTv({
          className: [
            Platform.OS === 'web' && 'outline-none',
            inputClassName
          ].filter(Boolean).join(' '),
        })}
        style={inputStyle}
        {...props}
      />

      {rightNode}
    </View>
  );
});

AiInput.displayName = 'AiInput';
export { AiInput };


