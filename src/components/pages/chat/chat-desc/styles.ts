import { StyleSheet } from 'react-native';

const BG_COLOR = '#181919';
const ACCENT_BORDER = 'rgba(233, 250, 200, 0.6)';

export const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 15,
  },

  // Root wrapper — fills width, no extra background
  container: {
    width: '100%',
    alignItems: 'center',
  },

  // Dark card with rounded corners
  card: {
    width: '100%',
    backgroundColor: BG_COLOR,
    borderRadius: 15,
    paddingTop: 18,
    paddingBottom: 20,
    alignItems: 'center',
    marginHorizontal: 15,
  },

  // ─── Title row with gradient separator lines ───
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    width: '100%',
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 8,
    textAlign: 'center',
  },

  // ─── Avatar row ───
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.1,
    borderColor: ACCENT_BORDER,
    overflow: 'hidden',
    padding: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },

  // ─── Description section ───
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    width: '100%',
  },
  iconWrapper: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  descTextContainer: {
    flex: 1,
    marginLeft: 2,
  },
  descTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 20,
  },
  descDots: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
});
