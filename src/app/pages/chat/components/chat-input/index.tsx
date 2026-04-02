import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { styles } from './styles';

// ─── SVG Icon Components (from Figma exported assets) ───
const imgMicIcon = require('../../../../../assets/images/chat/chat-input/mic.svg');
const imgLightbulbIcon = require('../../../../../assets/images/chat/chat-input/lightbulb.svg');
const imgPlusIcon = require('../../../../../assets/images/chat/chat-input/plus.svg');

function MicIcon() {
  return <Image source={imgMicIcon} style={{ width: 21.3, height: 25 }} resizeMode="contain" />;
}

function LightbulbIcon() {
  return <Image source={imgLightbulbIcon} style={{ width: 21.2, height: 25.5 }} resizeMode="contain" />;
}

function PlusIcon() {
  return <Image source={imgPlusIcon} style={{ width: 23.4, height: 24.2 }} resizeMode="contain" />;
}

// ─── Main Component ───

interface ChatInputProps {
  onMicPress?: () => void;
  onLightbulbPress?: () => void;
  onPlusPress?: () => void;
}

export function ChatInput({ onMicPress, onLightbulbPress, onPlusPress }: ChatInputProps) {
  return (
    <View style={styles.container}>
      {/* Left: mic button */}
      <View style={styles.leftSection}>
        <Pressable style={styles.micButton} onPress={onMicPress}>
          <MicIcon />
        </Pressable>
      </View>

      {/* Center label (absolute positioning to be perfectly centered) */}
      <View style={styles.holdTextWrapper} pointerEvents="none">
        <Text style={styles.holdText}>按住说话</Text>
      </View>

      {/* Right: lightbulb + plus icons */}
      <View style={styles.rightSection}>
        <Pressable style={styles.iconButton} onPress={onLightbulbPress}>
          <LightbulbIcon />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onPlusPress}>
          <PlusIcon />
        </Pressable>
      </View>
    </View>
  );
}
