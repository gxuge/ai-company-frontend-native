import React from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
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

function toAssetUri(source: any) {
  return source?.uri ?? source?.default ?? source;
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
  if (Platform.OS === 'web') {
    const avatarUri = avatarSource ? toAssetUri(avatarSource) : toAssetUri(imgAvatar);
    return (
      <div style={webStyles.container}>
        <div style={webStyles.leftSection}>
          <div style={webStyles.pill}>
            <button type="button" style={webStyles.avatarButton} onClick={onAvatarPress}>
              <img src={avatarUri} style={webStyles.avatar} />
            </button>
            <div style={webStyles.nameBlock}>
              <div style={webStyles.nameText}>{name}</div>
              <div style={webStyles.usernameText}>{username}</div>
            </div>
            <button type="button" style={webStyles.addUserBtn} onClick={onAddUserPress}>
              <img src={toAssetUri(imgAddUserIcon)} style={{ width: 20, height: 20 }} />
            </button>
          </div>
          <button type="button" style={webStyles.chatBadge} onClick={onChatPreviewPress}>
            <img src={toAssetUri(imgChatPreviewIcon)} style={webStyles.chatPreviewIcon} />
            <div style={webStyles.chatCount}>{chatCount}</div>
          </button>
        </div>
        <button type="button" style={webStyles.volumeBtn} onClick={onVolumePress}>
          <img src={toAssetUri(imgVolumeIcon)} style={{ width: 28, height: 28 }} />
        </button>
      </div>
    );
  }

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

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 12px 4px 4px',
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  avatarButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    cursor: 'pointer',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    backgroundColor: '#000',
    objectFit: 'cover',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 110,
    minWidth: 0,
  },
  nameText: {
    color: '#F0F0F0',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  usernameText: {
    color: '#A8A0A4',
    fontSize: 11,
    lineHeight: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  addUserBtn: {
    marginLeft: 2,
    width: 24,
    height: 24,
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  chatBadge: {
    position: 'relative',
    width: 46,
    height: 28,
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
  },
  chatPreviewIcon: {
    position: 'absolute',
    left: 0,
    bottom: 2,
    width: 22,
    height: 22,
  },
  chatCount: {
    position: 'absolute',
    left: 18,
    top: -2,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 500,
  },
  volumeBtn: {
    width: 32,
    height: 32,
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};
