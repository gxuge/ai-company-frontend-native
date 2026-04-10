import React from 'react';
import { View, TextInput, TextInputProps, Platform } from 'react-native';

const imgSearch1 = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../assets/images/ai-search/search_icon_1.svg"));
const imgSearch2 = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../assets/images/ai-search/search_icon_2.svg"));

export interface AiSearchProps extends TextInputProps {
  containerClassName?: string;
}

export const AiSearch = React.forwardRef<TextInput, AiSearchProps>(
  (
    {
      containerClassName = "",
      className = "",
      placeholderTextColor = "#909090",
      style,
      ...props
    },
    ref
  ) => {
    // Mimic Web DOM focus style stripping
    const webFocusStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {};

    return (
      <View 
        className={`flex-row items-center bg-[#202020] border-[1px] border-white rounded-[40px] px-[28px] h-[74px] overflow-hidden ${containerClassName}`}
      >
        <View className="flex-row items-center gap-[6px]">
          {/* Search Magnifying Glass Icon Composite */}
          <View className="relative shrink-0 w-[37px] h-[37px] overflow-hidden">
             <View className="absolute" style={{ top: '12.5%', bottom: '20.83%', left: '12.5%', right: '20.83%' }}>
                <img 
                  alt="" 
                  className="w-full h-full object-contain" 
                  src={imgSearch1} 
                />
             </View>
             <View className="absolute" style={{ top: '69.37%', bottom: '12.5%', left: '12.5%', right: '69.37%' }}>
                <img 
                  alt="" 
                  className="w-full h-full object-contain" 
                  src={imgSearch2} 
                />
             </View>
          </View>
        </View>

        <TextInput
          ref={ref}
          placeholder="搜索角色"
          placeholderTextColor={placeholderTextColor}
          selectionColor="rgba(155,254,3,0.5)"
          className={`flex-1 bg-transparent text-[#909090] text-[25px] border-0 outline-none pl-[10px] ${className}`}
          style={[
            webFocusStyle, 
            style, 
            { fontFamily: "'Noto Sans SC', sans-serif" }
          ]}
          {...props}
        />
      </View>
    );
  }
);

AiSearch.displayName = 'AiSearch';
