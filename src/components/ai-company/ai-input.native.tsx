import * as React from 'react';
import { TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
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
  editable = true,
  ...props
}, ref) => {
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
        className={inputFieldTv({
          className: inputClassName,
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
