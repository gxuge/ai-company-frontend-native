import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { ShimmerLine } from '@/components/ai-company/ai-form-textarea';
import { styles } from './styles';

// ─── Assets ───
const imgEditSquare = require('../../../../../assets/images/chat/chat-tip/edit-square.svg');

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
