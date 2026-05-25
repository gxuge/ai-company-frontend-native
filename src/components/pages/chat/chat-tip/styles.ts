import { StyleSheet } from 'react-native';

// Figma 原始画布 750px (@2x) → RN pt 值 ÷ 2
// Node 204:1082 — chat-tip / 快捷提示列表

export const styles = StyleSheet.create({
  // 整体容器：纵向列表，间距 7.5pt (Figma gap-[15px] / 2)
  container: {
    flexDirection: 'column',
    gap: 7.5,
    width: '100%',
  },

  // 每行卡片：bg-[#4a4a45], 圆角 10pt (20px/2), 高 35pt (70px/2), px 10pt, py 7.5pt
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4a4a45',
    borderRadius: 10,
    height: 35,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  // 左侧文字区：flex-1 防止挤压
  tipText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,       // Figma text-[30px] / 2
    fontWeight: '400',
    lineHeight: 15,
    fontFamily: 'System',
  },

  // 右侧操作区：分隔线 + 编辑图标
  // Figma: w-[90.708px]→45.35pt, 图标 40px→20pt, 分隔线 left-[30px]→15pt
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 45,
    height: 20,
    position: 'relative',
  },

  // 竖线分隔符：bg-[#fffafa], h-[30px]→15pt, w-px→1pt
  divider: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#fffafa',
  },

  // 编辑图标：size-[40px]→20pt, absolute left-[50.71px]→25.35pt
  editIconWrapper: {
    position: 'absolute',
    left: 14,
    top: 0,
    width: 20,
    height: 20,
  },

  // ─── Loading State ───
  loadingContainer: {
    gap: 7.5,
    width: '100%',
  },
  skeletonRow: {
    backgroundColor: '#1d1d1d',
    borderRadius: 10,
    height: 35,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 4,
  },
});
