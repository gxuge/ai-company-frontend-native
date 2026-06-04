import React from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Image, Platform } from 'react-native';
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

function toAssetUri(source: any) {
  return source?.uri ?? source?.default ?? source;
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
  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.left}>
          <div style={webStyles.titleRow}>
            <div style={webStyles.title}>{title}</div>
            <button type="button" style={webStyles.iconButton} onClick={onBookPress ?? (() => router.push('/pages/conversation-detail'))}>
              <img src={toAssetUri(imgBookIcon)} style={{ width: 20, height: 19 }} />
            </button>
          </div>
          <div style={webStyles.metaRow}>
            <img src={toAssetUri(imgFireIcon)} style={{ width: 15, height: 15 }} />
            <div style={webStyles.fanCount}>{fanCount}</div>
          </div>
        </div>
        <button type="button" style={webStyles.volumeBtn} onClick={onVolumePress}>
          <img src={toAssetUri(imgVolumeIcon)} style={{ width: 27, height: 21 }} />
        </button>
      </div>
    );
  }

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

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: 70,
    padding: '12px 15px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  left: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    maxWidth: 200,
    color: '#bcbab6',
    fontSize: 20,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  fanCount: {
    color: '#929292',
    fontSize: 13,
    fontWeight: 700,
  },
  iconButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  volumeBtn: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 28,
    height: 28,
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};
