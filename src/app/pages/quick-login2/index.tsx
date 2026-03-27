import { router } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Dimensions, Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { AiLoginBtn } from '@/components/ai-company/ai-login-btn';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';

const imgCover = require('../../../assets/images/quick-login2/cover.png');
const imgClose = require('../../../assets/images/quick-login2/svg/p62a9900.svg');
const imgCheck = require('../../../assets/images/quick-login2/svg/p1c5e8800.svg');

export default function App() {
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="w-full flex-1 bg-black">
        {/* 鈹€鈹€ Close button 鈹€鈹€ */}
        <View className="mt-6 w-full flex-row px-7">
          <AiCloseBtn
            iconSource={imgClose}
            customWidth="w-[43px]"
            customHeight="h-[43px]"
            iconWidth={18}
            iconHeight={20}
            onPress={() => router.back()}
          />
        </View>

        <View className="w-full flex-1 items-center px-7">
          {/* 鈹€鈹€ Logo Group 鈹€鈹€ */}
          <View className="mt-14 items-center">
            {/* Magnifying glass logo */}
            <Image source={imgCover} style={{ width: 150, height: 150, borderRadius: 10, overflow: 'hidden' }} resizeMode="cover" />
            {/* <Image
              source={imgLogo}
              className="w-[78px] h-[128px]"
              resizeMode="contain"
            /> */}

            {/* 鎺㈡嬀 text */}
            <Text className="text-[35px] font-bold tracking-widest text-white">
              鎺㈡嬀
            </Text>
          </View>

          {/* 鈹€鈹€ Spacer 鈹€鈹€ */}
          <View className="flex-1" />

          {/* 鈹€鈹€ Bottom Section 鈹€鈹€ */}
          <View className="w-full items-center pb-12">
            {/* 鏈満鍙风爜 label */}
            <Text className="mb-2 text-[15px] font-medium text-[#828286]">
              鏈満鍙风爜
            </Text>

            {/* Phone number */}
            <View className="mb-10 flex-row items-baseline">
              <Text className="mr-[2px] text-[22px] font-bold text-[#c2c3c5]">147****</Text>
              <Text className="text-[22px] font-bold text-[#d1d1d3]">7554</Text>
            </View>

            {/* Primary Button */}
            <AiLoginBtn 
              className="mb-4"
              themeColor="primary" 
              textClassName="text-[17px] font-bold"
            />

            {/* Secondary Button */}
            <AiLoginBtn 
              className="mb-10"
              themeColor="secondary" 
              label="鍏朵粬鎵嬫満鍙风櫥褰?"
              textClassName="text-[15px] font-medium"
            />

            {/* Agreement */}
            <View className="flex-row items-start justify-center px-2">
              <TouchableOpacity
                className="mt-[2px] mr-2"
                onPress={() => setAgreed(!agreed)}
                activeOpacity={0.7}
              >
                <Image source={imgCheck} style={{ width: 15, height: 15, tintColor: '#528700' }} resizeMode="contain" />
              </TouchableOpacity>

              <View className="flex-1 flex-row flex-wrap items-center">
                <Text className="text-[11px] leading-[18px] text-[#67686c]">
                  宸查槄璇诲苟鍚屾剰
                </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-[11px] leading-[18px] text-[#9c9da1]">
                    銆婄敤鎴锋湇鍔″崗璁€?                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-[11px] leading-[18px] text-[#9c9da1]">
                    銆婄敤鎴烽殣绉佹斂绛栥€?                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-[11px] leading-[18px] text-[#9a9b9f]">
                    銆婁腑鍥界Щ鍔ㄨ璇佹湇鍔℃潯娆俱€?                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
