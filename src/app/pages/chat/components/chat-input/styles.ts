import { StyleSheet } from 'react-native';

// Figma canvas: 750x109px (2x scale) → RN values ÷ 2
// Node 222:868 — Chat input bar (pill-shaped dark background)

export const styles = StyleSheet.create({
  // Outer wrapper - acts as the pill background
  container: {
    marginHorizontal: 15,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 4,
    backgroundColor: '#1d1d1d',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // Left section: microphone icon
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },

  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // "按住说话" center label
  holdTextWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  holdText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '400',
  },

  // Right section: lightbulb and plus icons
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 1,
  },

  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
