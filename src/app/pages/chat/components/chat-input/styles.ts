import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  inputRow: {
    marginHorizontal: 15,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#1d1d1d',
  },

  container: {
    flex: 1,
    minHeight: 56,
    backgroundColor: '#1d1d1d',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },

  containerExpanded: {
    borderRadius: 17,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 54,
  },

  leftSection: {
    position: 'absolute',
    left: 20,
    top: 10,
    zIndex: 2,
  },

  leftSectionExpanded: {
    left: 20,
    top: undefined,
    bottom: 10,
  },

  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  holdInput: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },

  holdInputCompact: {
    left: 68,
    right: 142,
    top: 7,
    textAlign: 'left',
  },

  holdInputExpanded: {
    position: 'relative',
    width: '100%',
    minHeight: 40,
    maxHeight: 120,
  },

  voiceHoldText: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightSection: {
    position: 'absolute',
    right: 20,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 2,
  },

  rightSectionExpanded: {
    right: 20,
    top: undefined,
    bottom: 12,
  },

  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
