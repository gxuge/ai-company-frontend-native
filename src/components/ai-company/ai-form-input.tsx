import * as React from 'react';
import { TextInput, TextInputProps, Platform } from 'react-native';

export interface AiFormInputProps extends TextInputProps {
  customContainerClass?: string;
}

export const AiFormInput = React.forwardRef<TextInput, AiFormInputProps>(
  (
    {
      customContainerClass = "w-full h-[38px] px-3 bg-transparent border border-[#494949] rounded-lg text-xs text-white",
      placeholderTextColor = "#6b7280",
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Apply focus style override to mimic web DOM behavior if needed
    const webFocusStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {};

    return (
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor}
        className={[customContainerClass, className].filter(Boolean).join(' ')}
        selectionColor="rgba(155,254,3,0.5)"
        style={[webFocusStyle, style]}
        {...props}
      />
    );
  }
);

AiFormInput.displayName = 'AiFormInput';
