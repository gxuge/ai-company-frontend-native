import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', // A subtle overall darken if needed, but mainly gradient at bottom
        justifyContent: 'space-between',
    },
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50, // safe area approx
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // for blur or child bounds
    },
    navIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#fff',
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        // Note: In RN, linear gradient requires expo-linear-gradient. We will use a standard View with semi-transparent background for now if gradient not available, or just rely on image's darkness.
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    characterName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 8,
    },
    roleAvatar: {
        width: 14,
        height: 20,
        resizeMode: 'contain',
    },
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(155,254,3,0.9)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    followIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        resizeMode: 'contain',
    },
    followText: {
        color: 'rgba(155,254,3,0.9)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    authorLabel: {
        color: '#fff',
        fontSize: 14,
        marginRight: 4,
    },
    authorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 6,
    },
    authorName: {
        color: 'rgba(155,254,3,0.9)',
        fontSize: 14,
        marginRight: 4,
    },
    verifiedIcon: {
        width: 10,
        height: 14,
        resizeMode: 'contain',
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 32,
        gap: 30, // Supported in newer RN
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    statLabel: {
        color: '#e7e7e7',
        fontSize: 12,
    },
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    tabItem: {
        alignItems: 'center',
    },
    tabTextActive: {
        color: 'rgba(155,254,3,0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tabIndicatorActive: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(155,254,3,0.9)',
        borderRadius: 2,
    },
    tabTextInactive: {
        color: '#e7e7e7',
        fontSize: 20,
        marginBottom: 8, // matching the alignment without indicator
    },
});
