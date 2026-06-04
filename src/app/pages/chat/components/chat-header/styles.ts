import { translate } from '@/lib/i18n';
import { StyleSheet } from 'react-native';

// Figma canvas: 750px (2x) → RN values ÷ 2
// Node 222:783 — Chat header bar

export const styles = StyleSheet.create({
  // Root horizontal bar
  container: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },

  // Center side: title + meta stacked
  left: {
    position: 'absolute',
    width:'100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },

  // Top row: title text + book icon
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  title: {
    color: '#bcbab6',
    fontSize: 20,
    fontWeight: 'bold',
    maxWidth: 200,
  },

  bookIconWrapper: {
    width: 20,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom row: fire emoji + fan count
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  fireIconWrapper: {
    width: 15,
    height: 15,
  },

  fanCount: {
    color: '#929292',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Right: volume icon button
  volumeBtn: {
    position: 'absolute',
    right: 15,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
