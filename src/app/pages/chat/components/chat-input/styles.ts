import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    minHeight: 56,
    marginBottom: 4,
    backgroundColor: '#1d1d1d',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },

  containerExpanded: {
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
    left: 14,
    top: undefined,
    bottom: 9,
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
    right: 14,
    top: undefined,
    bottom: 11,
  },

  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
