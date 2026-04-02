import { StyleSheet } from 'react-native';

// Figma canvas: 690px wide (@2x) → RN values ÷ 2
// Node 221:449 — Groups / chat role header row

export const styles = StyleSheet.create({
  // Full-width row, vertically centered, space-between
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 11.5, // 23px / 2
  },

  // ─── Left group: pill + chat badge ───
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // 10px / 2
  },

  // Dark pill: avatar + name + add-user icon
  // 266 x 80px → 133 x 40pt
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 30, // 60.6px / 2
    paddingVertical: 0,
    paddingLeft: 6,
    paddingRight: 8,
    height: 40,
    gap: 6, // 12.12px / 2
  },

  // Avatar: 70.3 x 72.7px → ~35 x 36pt
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },

  // Name + username stacked text block
  nameBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 2,
  },
  nameText: {
    color: '#c2c2c3',
    fontSize: 12, // 24.24px / 2
    fontWeight: '400',
  },
  usernameText: {
    color: '#a8a0a4',
    fontSize: 10, // 19.39px / 2
    fontWeight: '400',
  },

  // Add-user icon button: 38 x 38px → 19 x 19pt
  addUserBtn: {
    width: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },

  // Chat preview icon + count badge: 56 x 45px → 28 x 22.5pt
  chatBadge: {
    width: 36,
    height: 28,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  chatCount: {
    position: 'absolute',
    top: 0,
    right: -4,
    color: '#ffffff',
    fontSize: 8, // 15.48px / 2 ≈ 7.7
    fontWeight: '400',
  },

  // ─── Right: volume button ───
  volumeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
