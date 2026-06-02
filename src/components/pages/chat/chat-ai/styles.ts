import { StyleSheet } from 'react-native';

// Figma canvas: 750px wide (2x), scale ÷ 2 for RN
// Node 222:825 — AI message bubble (left-aligned)

export const styles = StyleSheet.create({
  // Root container — left-aligned
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 8,
  },

  // ─── Main chat bubble wrapper ───
  bubbleWrapper: {
    width: '80%',
    marginTop: 24, // Provide space for absolutely positioned tags
  },
  bubble: {
    zIndex: 20, // High z-index to cover the underlying tags
    width: '100%',
    backgroundColor: '#181818',
    borderRadius: 15,
    borderTopLeftRadius: 15, // Top corners cover the tags
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: '#181818',
    padding: 16,
    gap: 10,
  },

  // Name tag overlapping styling
  nameTagBg: {
    position: 'absolute',
    top: -23.5, // The main body is exactly 23.5 tall, sitting on the bubble edge
    left: -1, // -1 to perfectly conceal the bubble border
    width: 67.5, // 135 / 2
    height: 35.4, // 70.76 / 2
    paddingTop: 3, // slightly move text down vertically inside the top 23.5 area
    paddingLeft: 12, // pushing the name away from the left edge slightly
    alignItems: 'flex-start',
    zIndex: 1, // Sit below the bubble
  },
  nameTagBgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  nameTagText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '400',
  },

  // Play button overlapping styling
  playBgWrapper: {
    position: 'absolute',
    top: -23.65, // Main body is 47.3 / 2 = 23.65 tall
    right: -1, // -1 to conceal the right border
    zIndex: 1, // Sit below the bubble
  },
  playBg: {
    width: 45.6, // 91.2 / 2
    height: 31, // 61.9 / 2
    paddingTop: 5,
    paddingLeft: 10,  // Content shifted to the left since the tail is now on the right
    alignItems: 'flex-start',
  },
  playBgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    transform: [{ scaleX: -1 }],
  },
  playContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playDuration: {
    color: '#b2b3b7',
    fontSize: 11,
    fontWeight: '500',
  },

  // Gray action/narration text
  actionText: {
    color: '#80817b',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },

  // White speech text
  speechText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },

  // ─── Action bar below bubble ───
  actionBar: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74,74,69,0.4)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 14,
  },
  actionIconBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
