import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AiEmptyProps {
  title?: string;
  description?: string;
  icon?: any;
  actionText?: string;
  onAction?: () => void;
  style?: any;
}

const resolveAsset = (m: any) => m?.default ?? m?.uri ?? m;
const defaultPlaceholder = resolveAsset(require('@/assets/images/my-gallery/image_placeholder.svg'));

export function AiEmpty({ 
  title = '\u6682\u65E0\u8BB0\u5F55', 
  description = '\u8FD9\u91CC\u8FD8\u6CA1\u6709\u4EFB\u4F55\u5185\u5BB9\u663E\u793A', 
  icon, 
  actionText, 
  onAction,
  style 
}: AiEmptyProps) {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }, style]}>
      <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center' }}>
        {/* Placeholder Icon with Glow/Border */}
        <View style={{
          width: 80, height: 80, borderRadius: 20,
          backgroundColor: '#18181b', borderWidth: 1, borderColor: 'rgba(39,39,42,0.8)',
          alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          shadowColor: '#9bfe03',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }}>
          {icon ? (
            <Image source={icon} style={{ width: 40, height: 40 }} resizeMode="contain" />
          ) : (
            <Image source={defaultPlaceholder} style={{ width: 36, height: 36, opacity: 0.5 }} resizeMode="contain" />
          )}
        </View>

        {/* Text Content */}
        <Text style={{ 
          color: '#e4e4e7', 
          fontSize: 18, 
          fontWeight: '600', 
          marginBottom: 10,
          fontFamily: 'Noto Sans SC' 
        }}>
          {title}
        </Text>
        <Text style={{ 
          color: '#71717a', 
          fontSize: 14, 
          textAlign: 'center', 
          lineHeight: 22, 
          marginBottom: 32,
          fontFamily: 'Noto Sans SC' 
        }}>
          {description}
        </Text>

        {/* Optional Action Button */}
        {actionText && onAction && (
          <Pressable 
            onPress={onAction}
            style={({ pressed }) => ({
              paddingHorizontal: 28, 
              paddingVertical: 14,
              backgroundColor: pressed ? 'rgba(155,254,3,0.7)' : 'rgba(155,254,3,0.9)', 
              borderRadius: 14,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: '#9bfe03',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            })}
          >
            <Text style={{ color: '#09090b', fontWeight: '600', fontSize: 16 }}>
              {actionText}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
