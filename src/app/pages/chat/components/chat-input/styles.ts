import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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

  holdInput: {
    width: '52%',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    paddingVertical: 0,
  },

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
