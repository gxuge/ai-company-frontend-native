import React from 'react';
import { View, Text, Image, Pressable, Platform } from 'react-native';
import { ShimmerLine } from '@/components/ai-company/ai-form-textarea';
import { styles } from './styles';

// ─── Assets ───
const imgEditSquare = require('../../../../../assets/images/chat/chat-tip/edit-square.svg');

function toAssetUri(source: any) {
  return source?.uri ?? source?.default ?? source;
}

// ─── Types ───

export interface ChatTipItem {
  id: string | number;
  text: string;
}

interface ChatTipProps {
  /** 提示列表 */
  items?: ChatTipItem[];
  /** 加载状态 */
  loading?: boolean;
  /** 点击某条提示（发送该内容）*/
  onTipPress?: (item: ChatTipItem) => void;
  /** 点击编辑图标 */
  onEditPress?: (item: ChatTipItem) => void;
}

// ─── 单行 Tip 卡片 ───

function TipRow({
  item,
  onTipPress,
  onEditPress,
}: {
  item: ChatTipItem;
  onTipPress?: () => void;
  onEditPress?: () => void;
}) {
  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.tipRow} onClick={onTipPress}>
        <div style={webStyles.tipText}>{item.text}</div>
        <div style={webStyles.rightSection}>
          <div style={webStyles.divider} />
          <button type="button" style={webStyles.editIconWrapper} onClick={(e) => { e.stopPropagation(); onEditPress?.(); }}>
            <img src={toAssetUri(imgEditSquare)} style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Pressable style={styles.tipRow} onPress={onTipPress}>
      {/* 左侧文字 */}
      <Text style={styles.tipText} numberOfLines={1}>
        {item.text}
      </Text>

      {/* 右侧：竖分隔线 + 编辑图标 */}
      <View style={styles.rightSection}>
        {/* 竖线 */}
        <View style={styles.divider} />
        {/* 编辑图标按钮 */}
        <Pressable style={styles.editIconWrapper} onPress={onEditPress} hitSlop={8}>
          <Image
            source={imgEditSquare}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

// ─── Loading Skeleton ───

function SkeletonTip() {
  return (
    <View style={styles.skeletonRow}>
      <ShimmerLine className="h-[14px] w-full bg-[#2a2a2a] rounded-[4px]" />
    </View>
  );
}

// ─── Main Component ───

export function ChatTip({
  items = [],
  loading = false,
  onTipPress,
  onEditPress,
}: ChatTipProps) {
  if (loading) {
    if (Platform.OS === 'web') {
      return (
        <div style={webStyles.loadingContainer}>
          <div style={webStyles.skeletonRow} />
          <div style={webStyles.skeletonRow} />
          <div style={webStyles.skeletonRow} />
        </div>
      );
    }
    return (
      <View style={styles.loadingContainer}>
        <SkeletonTip />
        <SkeletonTip />
        <SkeletonTip />
      </View>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        {items.map(item => (
          <TipRow
            key={item.id}
            item={item}
            onTipPress={() => onTipPress?.(item)}
            onEditPress={() => onEditPress?.(item)}
          />
        ))}
      </div>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TipRow
          key={item.id}
          item={item}
          onTipPress={() => onTipPress?.(item)}
          onEditPress={() => onEditPress?.(item)}
        />
      ))}
    </View>
  );
}

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7.5,
    width: '100%',
  },
  tipRow: {
    width: '100%',
    height: 35,
    padding: '0 10px',
    border: 'none',
    borderRadius: 10,
    backgroundColor: '#4a4a45',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  tipText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: '15px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rightSection: {
    width: 45,
    height: 20,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#fffafa',
  },
  editIconWrapper: {
    position: 'absolute',
    left: 14,
    top: 0,
    width: 20,
    height: 20,
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7.5,
    width: '100%',
  },
  skeletonRow: {
    width: '100%',
    height: 35,
    borderRadius: 10,
    backgroundColor: '#1d1d1d',
  },
};
