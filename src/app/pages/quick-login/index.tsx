import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiLoginBtn } from '@/components/ai-company/ai-login-btn';

import imgBgCircle from "../../../assets/images/quick-login/logo.png";
const imgClose = require('../../../assets/images/quick-login/p62a9900.svg');
const imgAgreementCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/quick-login/p1c5e8800.svg'));

const DESIGN_W = 750;
const DESIGN_H = 1622.932;

export default function QuickLoginPage() {
  const [scale, setScale] = useState(() => Dimensions.get('window').width / DESIGN_W);

  useEffect(() => {
    const update = () => setScale(Dimensions.get('window').width / DESIGN_W);
    const subscription = Dimensions.addEventListener('change', update);
    return () => subscription?.remove();
  }, []);

  return (
    <View
      className="bg-black overflow-hidden w-full"
      style={{
        height: DESIGN_H * scale,
      }}
    >
      <View
        className="relative bg-black overflow-hidden"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          // RN requires scale in transform array
          transform: [
            { translateX: -(DESIGN_W - DESIGN_W * scale) / 2 },
            { translateY: -(DESIGN_H - DESIGN_H * scale) / 2 },
            { scale },
          ],
        } as any}
      >
        {/* ── Close button ── */}
        <View className="absolute top-[52.967px] left-[54.38px] w-[86.755px] h-[86.755px] z-10">
          <AiCloseBtn
            iconSource={imgClose}
            customWidth="w-[86.755px]"
            customHeight="h-[86.755px]"
            iconWidth={27}
            iconHeight={32}
            onPress={() => router.back()}
          />
        </View>

        {/* ── Logo Group (Logo + 探拾) ── */}
        <View className="absolute top-[320px] left-[275.192px] w-[197.368px] z-10 flex-col items-center">
          {/* Main logo */}
          <Image
            source={imgBgCircle}
            className="w-[197px] h-[197px]"
            resizeMode="contain"
          />

          {/* 探拾 text */}
          <View className="w-full flex-row items-center justify-center -mt-[10px] z-20">
            <Text className="text-[69.925px] font-bold text-white tracking-[2px]">
              探拾
            </Text>
          </View>
        </View>

        {/* ── 本机号码 label ── */}
        <View className="absolute top-[972.181px] w-full flex-row justify-center z-10">
          <Text className="text-[#828286] text-[29.323px]">本机号码</Text>
        </View>

        {/* ── Phone number: 147****7554 ── */}
        <View className="absolute top-[1048.868px] w-full flex-row justify-center z-10">
          <Text className="text-[#c2c3c5] text-[42.857px] font-semibold">
            147****7554
          </Text>
        </View>

        {/* ── Green primary button: 一键登录 ── */}
        <View className="absolute top-[1163.913px] w-full flex-row items-center justify-center z-10">
          <AiLoginBtn
            onPress={() => router.replace('/pages/chat')}
            label="一键登录"
            customWidth="w-[627px]"
            customHeight="h-[85px]"
            radius="rounded-[44px]"
            className="bg-[#9bfe03]"
            textClassName="text-[30px] font-bold font-sans text-black"
          />
        </View>

        {/* ── Dark secondary button: 其他手机号登录 ── */}
        <View className="absolute top-[1281.2px] w-full flex-row items-center justify-center z-10">
          <AiLoginBtn
            onPress={() => router.push('/pages/verification-code-login')}
            label="其他手机号登录"
            customWidth="w-[627px]"
            customHeight="h-[85px]"
            radius="rounded-[44px]"
            className="bg-[#28292d]"
            textClassName="text-[30px] font-sans text-[#b2b3b6]"
          />
        </View>

        {/* ── Agreement section ── */}
        <View className="absolute top-[1437.972px] left-[73.304px] w-[586.466px] h-[77.82px] z-10">
          {/* Row 1 */}
          <View className="flex-row items-center absolute top-[7.891px] left-[65.416px]">
            <Text className="text-[22.556px] text-[#67686c]">已阅读并同意</Text>
            <Text className="text-[21.429px] text-[#9c9da1]">《用户服务协议》《用户隐私政策》</Text>
          </View>
          {/* Row 2 */}
          <View className="flex-row items-center justify-center absolute top-[41.729px] left-[190.606px]">
            <Text className="text-[21.429px] text-[#9a9b9f]">《中国移动认证服务条款》</Text>
          </View>
          {/* Circle */}
          <View className="absolute left-[20.3px] top-[8px]">
            <Image 
              source={imgAgreementCircle} 
              className="w-[31.57px] h-[31.57px]" 
              resizeMode="contain" 
            />
          </View>
        </View>

      </View>
    </View>
  );
}
