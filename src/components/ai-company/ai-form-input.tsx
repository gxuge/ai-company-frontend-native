import * as React from 'react';
import { TextInput, TextInputProps, Platform, View } from 'react-native';
import { ShimmerLine } from './ai-form-textarea';

export interface AiFormInputProps extends TextInputProps {
  customContainerClass?: string;
  isGenerating?: boolean;
  children?: React.ReactNode;
}

export const AiFormInput = React.forwardRef<TextInput, AiFormInputProps>(
  (
    {
      customContainerClass = "bg-black rounded-[15px] border-[1px] border-[#494949] overflow-hidden",
      className = "w-full h-[44px] px-[16px] bg-transparent border-0 outline-none text-white",
      placeholderTextColor = "#6b7280",
      isGenerating,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Apply focus style override to mimic web DOM behavior if needed
    const webFocusStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {};

    return (
      <View className={`relative w-full ${customContainerClass}`}>
        {isGenerating && (
          <View className="absolute inset-0 z-10 w-full h-full flex flex-col justify-center px-[16px] bg-black">
            <ShimmerLine className="h-[14px] w-full bg-[#2a2a2a] rounded-[4px]" />
          </View>
        )}
        {children ? (
          children
        ) : (
          <TextInput
            ref={ref}
            placeholderTextColor={placeholderTextColor}
            className={className}
            selectionColor="rgba(155,254,3,0.5)"
            style={[
              webFocusStyle, 
              style, 
              { fontFamily: "'Noto Sans SC', sans-serif", fontSize: 14 }
            ]}
            {...props}
          />
        )}
      </View>
    );
  }
);

AiFormInput.displayName = 'AiFormInput';
