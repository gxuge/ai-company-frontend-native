import * as React from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import imgLightbulbIcon from '../../../../../assets/images/chat/chat-input/lightbulb.svg';
import imgMicIcon from '../../../../../assets/images/chat/chat-input/mic.svg';
import imgPlusIcon from '../../../../../assets/images/chat/chat-input/plus.svg';
import { styles } from './styles';

function MicIcon() {
  return <Image source={imgMicIcon} style={{ width: 21.3, height: 25 }} resizeMode="contain" />;
}

function LightbulbIcon() {
  return <Image source={imgLightbulbIcon} style={{ width: 21.2, height: 25.5 }} resizeMode="contain" />;
}

function PlusIcon() {
  return <Image source={imgPlusIcon} style={{ width: 23.4, height: 24.2 }} resizeMode="contain" />;
}

type ChatInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  submitting?: boolean;
  featureExpanded?: boolean;
  onMicPress?: () => void;
  onLightbulbPress?: () => void;
  onPlusPress?: () => void;
};

export function ChatInput({
  value,
  onChangeText,
  onSubmit,
  submitting = false,
  featureExpanded = false,
  onMicPress,
  onLightbulbPress,
  onPlusPress,
}: ChatInputProps) {
  const plusRotation = useSharedValue(featureExpanded ? 45 : 0);

  React.useEffect(() => {
    plusRotation.value = withTiming(featureExpanded ? 45 : 0, { duration: 220 });
  }, [featureExpanded, plusRotation]);

  const plusIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${plusRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Pressable style={styles.micButton} onPress={onMicPress}>
          <MicIcon />
        </Pressable>
      </View>

      <View style={styles.holdTextWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          editable={!submitting}
          placeholder="按住说话"
          placeholderTextColor="rgba(255,255,255,0.55)"
          style={styles.holdInput}
          returnKeyType="send"
        />
      </View>

      <View style={styles.rightSection}>
        <Pressable style={styles.iconButton} onPress={onLightbulbPress}>
          <LightbulbIcon />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onPlusPress ?? onSubmit}>
          <Animated.View style={plusIconAnimatedStyle}>
            <PlusIcon />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
