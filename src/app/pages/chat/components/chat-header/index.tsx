import React from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Image } from 'react-native';
import { styles } from './styles';

// ─── SVG Icons (from Figma exported assets) ───
const imgBookIcon = require('../../../../../assets/images/chat/chat-header/book.svg');
const imgFireIcon = require('../../../../../assets/images/chat/chat-header/fire.svg');
const imgVolumeIcon = require('../../../../../assets/images/chat/chat-header/volume.svg');

function BookIcon() {
  return <Image source={imgBookIcon} style={{ width: 20, height: 19 }} resizeMode="contain" />;
}

function FireIcon() {
  return <Image source={imgFireIcon} style={{ width: 15, height: 15 }} resizeMode="contain" />;
}

function VolumeIcon() {
  return <Image source={imgVolumeIcon} style={{ width: 27, height: 21 }} resizeMode="contain" />;
}

// ─── Component Props ───

interface ChatHeaderProps {
  title?: string;
  fanCount?: string;
  onBookPress?: () => void;
  onVolumePress?: () => void;
}

// ─── Main Component ───

export function ChatHeader({
  title = 'Top Roommate',
  fanCount = '16.6w',
  onBookPress,
  onVolumePress,
}: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: title row + meta row */}
      <View style={styles.left}>
        {/* Title + book icon */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Pressable style={styles.bookIconWrapper} onPress={onBookPress ?? (() => router.push('/pages/conversation-detail'))}>
            <BookIcon />
          </Pressable>
        </View>

        {/* Fire emoji + fan count */}
        <View style={styles.metaRow}>
          <View style={styles.fireIconWrapper}>
            <FireIcon />
          </View>
          <Text style={styles.fanCount}>{fanCount}</Text>
        </View>
      </View>

      {/* Right: volume button */}
      <Pressable style={styles.volumeBtn} onPress={onVolumePress}>
        <VolumeIcon />
      </Pressable>
    </View>
  );
}
