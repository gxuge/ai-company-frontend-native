import { StyleSheet } from 'react-native';

// Figma canvas: 750px (2x scale) → RN values ÷ 2
// Node 222:862 — User message bubble (right-aligned, green background)

export const styles = StyleSheet.create({
  // Root container — right-aligned
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },

  // Green chat bubble (right-aligned)
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#c6ffb8',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#181818',
  },

  // Rich text paragraph container
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },

  // Bold black speech text (main user dialogue)
  speechText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },

  // Green action text (in parentheses — gesture/emotion)
  actionText: {
    color: '#087200',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24,
  },
});
