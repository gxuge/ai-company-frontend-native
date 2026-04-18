import * as React from 'react';
import { View, TextInput, Image, TextInputProps, Platform } from 'react-native';

interface AiDateInputProps extends TextInputProps {
  iconSource: any;
  containerClassName?: string;
  inputClassName?: string;
}

export const AiDateInput: React.FC<AiDateInputProps> = ({
  iconSource,
  containerClassName = "relative",
  inputClassName = "w-full h-[56px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 text-white text-[16px] outline-none transition-colors pr-16",
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);
  
  // Apply focus style override for web
  const webFocusStyle = Platform.OS === 'web' ? { 
    outlineStyle: 'none' as any,
    borderColor: focused ? 'rgba(155,254,3,0.5)' : 'rgba(255,255,255,0.3)'
  } : {};

  return (
    <View className={containerClassName}>
      <TextInput
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor="rgba(255,255,255,0.4)"
        className={inputClassName}
        style={[
          webFocusStyle,
          { fontFamily: "'Noto Sans SC', sans-serif" }
        ]}
      />
      <View className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <Image 
          source={iconSource} 
          style={{ width: 26, height: 28 }} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
};
