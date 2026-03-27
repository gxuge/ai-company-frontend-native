import { StyleSheet } from 'react-native';

// ─── Color Constants ───
const ACCENT = 'rgba(155,254,3,0.9)';
const ACCENT_GLOW = 'rgba(155,254,3,0.2)';
const BG_PRIMARY = '#000000';
const BG_HEADER = '#0a0a0a';
const BG_CARD = '#16161e';
const BG_DARK = '#1d1d1d';
const BG_BUTTON = 'rgba(22,22,30,0.6)';
const TEXT_PRIMARY = '#e7e7e7';
const TEXT_SECONDARY = '#b3b3b3';
const BORDER_LIGHT = '#b2b2b2';

export const styles = StyleSheet.create({
  // ─── Root ───
  container: {
    flex: 1,
    backgroundColor: BG_PRIMARY,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ─── Header ───
  header: {
    backgroundColor: BG_HEADER,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#232322',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },

  // ─── Tabs ───
  tabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabTextActive: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ACCENT,
    marginBottom: 4,
  },
  tabTextInactive: {
    fontSize: 18,
    color: TEXT_PRIMARY,
    marginBottom: 7.5,
  },
  tabIndicator: {
    height: 3.5,
    width: 62,
    backgroundColor: ACCENT,
    borderRadius: 1.5,
  },

  // ─── Gallery Button ───
  galleryBtnRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BG_BUTTON,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  galleryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },

  // ─── Image Card ───
  imageCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    overflow: 'hidden',
    minHeight: 340,
    marginBottom: 16,
  },
  imageCardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  imageCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22,22,30,0.88)',
  },
  imageCardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 32,
    minHeight: 340,
  },
  imageCardSpacer: {
    height: 32,
  },
  imageCardTextGroup: {
    alignItems: 'center',
    paddingTop: 16,
  },
  imageCardTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  imageCardSubtitle: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  imageCardButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 24,
  },
  refButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BG_BUTTON,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  refButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BG_BUTTON,
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: ACCENT_GLOW,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 1,
    elevation: 4,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ACCENT,
  },

  // ─── Style Section ───
  styleSection: {
    marginHorizontal: 16,
    backgroundColor: BG_DARK,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    borderRadius: 20,
    padding: 20,
  },
  styleSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  styleSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_SECONDARY,
  },
  moreBtn: {
    backgroundColor: 'rgba(178,178,178,0.25)',
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  moreBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  styleGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  styleItem: {
    alignItems: 'center',
  },
  styleThumbWrapperActive: {
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    overflow: 'hidden',
    marginBottom: 8,
  },
  styleThumbWrapperInactive: {
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginBottom: 8,
    opacity: 0.6,
  },
  styleThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  styleLabelActive: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  styleLabelInactive: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
});
