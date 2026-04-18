import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { styles } from './styles';

// ─── Assets ───
const imgAvatar = require('../../../../../assets/images/chat/chat-header/avatar.png');
const imgAddUserIcon = require('../../../../../assets/images/chat/chat-header/add-user.svg');
const imgChatPreviewIcon = require('../../../../../assets/images/chat/chat-header/chat-preview.svg');
const imgVolumeIcon = require('../../../../../assets/images/chat/chat-header/volume.svg');

function AddUserIcon() {
  return <Image source={imgAddUserIcon} style={{ width: 20, height: 20 }} resizeMode="contain" />;
}

function ChatPreviewIcon() {
  return <Image source={imgChatPreviewIcon} style={{ width: 22, height: 22 }} resizeMode="contain" />;
}

function VolumeIcon() {
  return <Image source={imgVolumeIcon} style={{ width: 28, height: 28 }} resizeMode="contain" />;
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
  onAvatarPress?: () => void;
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
  onAvatarPress,
}: ChatRoleHeaderProps) {
  return (
    <View style={styles.container}>
      {/* ── 左侧：胶囊（头像 + 姓名 + add-user）+ chat 徽章 ── */}
      <View style={styles.leftSection}>

        {/* 深色胶囊：头像 + 名字 + 用户名 + add-user 图标 */}
        <View style={styles.pill}>
          {/* 头像 */}
          <Pressable onPress={onAvatarPress}>
            <Image
              source={avatarSource ? { uri: avatarSource as string } : imgAvatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          </Pressable>

          {/* 名字 + 用户名 */}
          <View style={styles.nameBlock}>
            <Text style={styles.nameText} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.usernameText} numberOfLines={1}>
              {username}
            </Text>
          </View>

          {/* Add user 图标 */}
          <Pressable style={styles.addUserBtn} onPress={onAddUserPress}>
            <AddUserIcon />
          </Pressable>
        </View>

        {/* Chat 预览徽章：图标 + 数字叠加 */}
        <Pressable style={styles.chatBadge} onPress={onChatPreviewPress}>
          <View style={styles.chatIconWrapper}>
            <ChatPreviewIcon />
          </View>
          <Text style={styles.chatCount}>{chatCount}</Text>
        </Pressable>
      </View>

      {/* ── 右侧：音量按钮 ── */}
      <Pressable style={styles.volumeBtn} onPress={onVolumePress}>
        <VolumeIcon />
      </Pressable>
    </View>
  );
}
