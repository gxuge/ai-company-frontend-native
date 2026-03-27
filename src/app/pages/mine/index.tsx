import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GRID_GAP = 8;
const GRID_PADDING = 15;
const GRID_ITEM_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP * 2) / 3;
const GRID_ITEM_HEIGHT = GRID_ITEM_WIDTH * 1.5;

// ─── Assets ────────────────────────────────────────────────────────────────
const imgGridImage     = require('../../../assets/images/mine/grid_image.png');
const imgViewIcon      = require('../../../assets/images/mine/view_icon.png');
const imgUserAvatar    = require('../../../assets/images/mine/user_avatar.png');
const imgProfilePic    = require('../../../assets/images/mine/profile_picture.png');
const imgBgPattern     = require('../../../assets/images/mine/bg_pattern.png');
const imgSetting       = require('../../../assets/images/mine/setting.svg');
const imgEditAvatar    = require('../../../assets/images/mine/edit_avatar.svg');
const imgCopy          = require('../../../assets/images/mine/copy.svg');

// ─── Mock Data ─────────────────────────────────────────────────────────────
const GRID_ITEMS = Array.from({ length: 6 }, (_, i) => ({
    id: String(i),
    image: imgGridImage,
    views: '76.4万',
    author: '@每个ai为..',
    authorAvatar: imgUserAvatar,
}));

const TABS = ['作品', '话题'];

// ─── Sub-components ────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function GridCard({ item }: { item: typeof GRID_ITEMS[0] }) {
    return (
        <View style={styles.gridCard}>
            <Image source={item.image} style={styles.gridImage} />
            {/* Bottom overlay */}
            <View style={styles.gridOverlay}>
                <View style={styles.gridAuthorRow}>
                    <Image source={item.authorAvatar} style={styles.gridAvatar} />
                    <Text style={styles.gridAuthorText} numberOfLines={1}>{item.author}</Text>
                </View>
                <View style={styles.gridViewRow}>
                    <Image source={imgViewIcon} style={styles.gridViewIcon} />
                    <Text style={styles.gridViewText}>{item.views}</Text>
                </View>
            </View>
        </View>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function Mine() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(1); // 话题 is active by default in design

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* ── Header ── */}
                    <View style={styles.header}>
                        {/* Settings button */}
                        <TouchableOpacity style={styles.settingBtn} onPress={() => {}}>
                            <Image source={imgSetting} style={styles.settingIcon} />
                        </TouchableOpacity>

                        {/* Avatar */}
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarRing}>
                                <Image source={imgProfilePic} style={styles.avatarImage} />
                            </View>
                            {/* Edit badge */}
                            <View style={styles.editBadge}>
                                <Image source={imgEditAvatar} style={styles.editBadgeIcon} />
                            </View>
                        </View>

                        {/* Username */}
                        <Text style={styles.username}>用户12312312</Text>

                        {/* UID row */}
                        <View style={styles.uidRow}>
                            <Text style={styles.uidText}>UID: 12313211</Text>
                            <Image source={imgCopy} style={styles.copyIcon} />
                        </View>

                        {/* Stats */}
                        <View style={styles.statsRow}>
                            <StatItem value="1" label="关注" />
                            <StatItem value="1" label="粉丝" />
                            <StatItem value="1" label="点赞" />
                        </View>
                    </View>

                    {/* ── AI PRO Banner ── */}
                    <View style={styles.proContainer}>
                        <View style={styles.proBanner}>
                            {/* Background gradient effect */}
                            <View style={styles.proGlowEffect} />
                            <View style={styles.proContent}>
                                <View style={styles.proLeft}>
                                    <View style={styles.proTitleRow}>
                                        <Text style={styles.proTitle}>AI PRO</Text>
                                        <View style={styles.vipBadge}>
                                            <Text style={styles.vipText}>VIP</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.proDesc}>解锁无限对话 &amp; 高级音色模型</Text>
                                </View>
                                <TouchableOpacity style={styles.upgradeBtn}>
                                    <Text style={styles.upgradeBtnText}>立即升级</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* ── Tab Bar ── */}
                    <View style={styles.tabBar}>
                        {TABS.map((tab, index) => (
                            <TouchableOpacity
                                key={tab}
                                style={styles.tabItem}
                                onPress={() => setActiveTab(index)}
                            >
                                <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
                                    {tab}
                                </Text>
                                {activeTab === index && <View style={styles.tabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ── Grid ── */}
                    <View style={styles.gridContainer}>
                        {GRID_ITEMS.map((item) => (
                            <GridCard key={item.id} item={item} />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const ACCENT = 'rgba(155, 254, 3, 0.9)';
const ACCENT_DIM = 'rgba(155, 254, 3, 0.2)';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060a00',
    },
    // ── Header ──
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    settingBtn: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    settingIcon: {
        width: 28,
        height: 28,
        tintColor: '#ffffff',
    },
    avatarWrapper: {
        marginTop: 10,
        marginBottom: 18,
    },
    avatarRing: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: ACCENT,
        padding: 6,
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#333',
    },
    editBadgeIcon: {
        width: 16,
        height: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    uidRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    uidText: {
        fontSize: 14,
        color: '#6b7280',
        marginRight: 6,
    },
    copyIcon: {
        width: 14,
        height: 14,
        tintColor: '#6b7280',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#ffffff',
    },
    // ── AI PRO Banner ──
    proContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    proBanner: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#111827',
    },
    proGlowEffect: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: ACCENT_DIM,
        opacity: 0.3,
    },
    proContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    proLeft: {
        flex: 1,
    },
    proTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    proTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: ACCENT,
        letterSpacing: 1,
        marginRight: 10,
    },
    vipBadge: {
        backgroundColor: ACCENT_DIM,
        borderWidth: 1,
        borderColor: 'rgba(155, 254, 3, 0.3)',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    vipText: {
        fontSize: 12,
        color: ACCENT,
        fontWeight: '600',
    },
    proDesc: {
        fontSize: 14,
        color: '#9ca3af',
    },
    upgradeBtn: {
        backgroundColor: ACCENT,
        borderRadius: 100,
        paddingHorizontal: 18,
        paddingVertical: 12,
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    upgradeBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    // ── Tabs ──
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
        marginBottom: 10,
    },
    tabItem: {
        marginRight: 30,
        paddingBottom: 10,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 18,
        color: '#e7e7e7',
    },
    tabTextActive: {
        color: ACCENT,
        fontWeight: 'bold',
    },
    tabIndicator: {
        height: 4,
        width: '100%',
        backgroundColor: ACCENT,
        borderRadius: 2,
        marginTop: 4,
    },
    // ── Grid ──
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: GRID_PADDING,
        gap: GRID_GAP,
    },
    gridCard: {
        width: GRID_ITEM_WIDTH,
        height: GRID_ITEM_HEIGHT,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#111',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gridOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingVertical: 5,
    },
    gridAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gridAvatar: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 4,
    },
    gridAuthorText: {
        fontSize: 10,
        color: '#e7e7e7',
        flex: 1,
    },
    gridViewRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gridViewIcon: {
        width: 12,
        height: 8,
        marginRight: 3,
        tintColor: '#bfbcbd',
    },
    gridViewText: {
        fontSize: 10,
        color: '#bfbcbd',
    },
});
