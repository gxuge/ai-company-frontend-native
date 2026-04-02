import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { styles } from './styles';

// ─── Assets ───
const imgAvatar = require('../../../../../assets/images/chat/chat-header/avatar.png');
const imgAddUserIcon = require('../../../../../assets/images/chat/chat-header/add-user.svg');
const imgChatPreviewIcon = require('../../../../../assets/images/chat/chat-header/chat-preview.svg');
const imgVolumeIcon = require('../../../../../assets/images/chat/chat-header/volume.svg');

function AddUserIcon() {
  // add-user.svg viewBox: 35.35 x 33.59 → scale to 19pt
  return <Image source={imgAddUserIcon} style={{ width: 19, height: 18 }} resizeMode="contain" />;
}

function ChatPreviewIcon() {
  // chat-preview.svg viewBox: 35.83 x 34.17 → scale to 20pt
  return <Image source={imgChatPreviewIcon} style={{ width: 20, height: 19 }} resizeMode="contain" />;
}

function VolumeIcon() {
  // volume icon: svg 11, 56.3px at @2x → ~28pt
  return <Image source={imgVolumeIcon} style={{ width: 24, height: 24 }} resizeMode="contain" />;
}

// ─── Component Props ───

interface ChatRoleHeaderProps {
  name?: string;
  username?: string;
  chatCount?: string;
  avatarSource?: string | number;
  onAddUserPress?: () => void;
  onChatPreviewPress?: () => void;
  onVolumePress?: () => void;
}

// ─── Main Component ───

export function ChatRoleHeader({
  name = '林梦',
  username = '@莫耀誉',
  chatCount = '244',
  avatarSource,
  onAddUserPress,
  onChatPreviewPress,
  onVolumePress,
}: ChatRoleHeaderProps) {
  return (
    <View style={styles.container}>
      {/* ── Left section: pill with avatar + name + add-user, then chat badge ── */}
      <View style={styles.leftSection}>
        {/* Avatar + Name pill */}
        <View style={styles.pill}>
          {/* Avatar image */}
          <View style={styles.avatarWrapper}>
            <Image
              source={avatarSource ? { uri: avatarSource as string } : imgAvatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          {/* Name + username text block */}
          <View style={styles.nameBlock}>
            <Text style={styles.nameText} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.usernameText} numberOfLines={1}>
              {username}
            </Text>
          </View>

          {/* Add user icon */}
          <Pressable style={styles.addUserBtn} onPress={onAddUserPress}>
            <AddUserIcon />
          </Pressable>
        </View>

        {/* Chat preview badge */}
        <Pressable style={styles.chatBadge} onPress={onChatPreviewPress}>
          <ChatPreviewIcon />
          <Text style={styles.chatCount}>{chatCount}</Text>
        </Pressable>
      </View>

      {/* ── Right: volume button ── */}
      <Pressable style={styles.volumeBtn} onPress={onVolumePress}>
        <VolumeIcon />
      </Pressable>
    </View>
  );
}
