import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  // ─── 左侧区域 ───
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // 增大胶囊和聊天提醒的间距
  },

  // 1. 头像与姓名胶囊区
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // 半透明遮罩，适应深色背景
    borderRadius: 30,
    paddingLeft: 4,  // 紧贴头像
    paddingRight: 12,
    paddingVertical: 4,
    gap: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000', // 防止透明图镂空
  },
  nameBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 110, // 防止长名字溢出
  },
  nameText: {
    color: '#F0F0F0', // 提升对比度
    fontSize: 14,     // 稍微增大字体提升阅读体验
    fontWeight: '600',
    lineHeight: 18,
  },
  usernameText: {
    color: '#A8A0A4',
    fontSize: 11,
    lineHeight: 14,
  },
  addUserBtn: {
    marginLeft: 2,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 2. 聊天信息预览徽章
  chatBadge: {
    width: 46, // 固定容器宽度以容纳文字和图标
    height: 28,
  },
  chatIconWrapper: {
    position: 'absolute',
    left: 0,
    bottom: 2, // 让图标靠下
  },
  chatCount: {
    position: 'absolute',
    left: 18, // 文字向右偏移，悬浮在图标上侧
    top: -2,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
  },

  // ─── 右侧音量 ───
  volumeBtn: {
    width: 32,
    height: 32,
    alignItems: 'flex-end',  // 使得触控区域靠右
    justifyContent: 'center',
  },
});
