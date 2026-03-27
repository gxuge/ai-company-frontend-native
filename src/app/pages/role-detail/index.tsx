import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import { styles } from './components/role-detail.styles';

const windowHeight = Dimensions.get('window').height;

export default function RoleDetail() {
    const [activeTab, setActiveTab] = useState<'about' | 'story'>('about');

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* Background Image */}
                <Image
                    source={require('../../../assets/images/role-detail/bg.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />

                {/* Gradient Overlay for Text Readability */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)', '#000']}
                    locations={[0, 0.4, 0.7, 1]}
                    style={styles.overlay}
                >
                    {/* Top Navigation */}
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.topNav}>
                            <Pressable style={styles.navButton} onPress={() => router.back()}>
                                <Image
                                    source={require('../../../assets/images/role-detail/close.svg')}
                                    style={styles.navIcon}
                                />
                            </Pressable>
                            <Pressable style={styles.navButton}>
                                <Image
                                    source={require('../../../assets/images/role-detail/more.svg')}
                                    style={styles.navIcon}
                                />
                            </Pressable>
                        </View>
                    </SafeAreaView>

                    {/* Bottom Content Section */}
                    <View style={styles.bottomSection}>
                        {/* Name and Follow Button */}
                        <View style={styles.headerRow}>
                            <View style={styles.nameRow}>
                                <Text style={styles.characterName}>江城渊</Text>
                                <Image
                                    source={require('../../../assets/images/role-detail/role_avatar.png')}
                                    style={styles.roleAvatar}
                                />
                            </View>

                            <Pressable style={styles.followButton}>
                                <Image
                                    source={require('../../../assets/images/role-detail/add_user.svg')}
                                    style={styles.followIcon}
                                />
                                <Text style={styles.followText}>关注</Text>
                            </Pressable>
                        </View>

                        {/* Author Information */}
                        <View style={styles.authorRow}>
                            <Text style={styles.authorLabel}>作者：</Text>
                            <Image
                                source={require('../../../assets/images/role-detail/author_avatar.png')}
                                style={styles.authorAvatar}
                            />
                            <Text style={styles.authorName}>小皇帝（AD钙）</Text>
                            <Image
                                source={require('../../../assets/images/role-detail/verified.svg')}
                                style={styles.verifiedIcon}
                            />
                        </View>

                        {/* Statistics */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>5601</Text>
                                <Text style={styles.statLabel}>连接者</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>5601</Text>
                                <Text style={styles.statLabel}>粉丝</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>5601</Text>
                                <Text style={styles.statLabel}>对话数</Text>
                            </View>
                        </View>

                        {/* Tabs */}
                        <View style={styles.tabsRow}>
                            <Pressable style={styles.tabItem} onPress={() => setActiveTab('about')}>
                                <Text
                                    style={
                                        activeTab === 'about'
                                            ? styles.tabTextActive
                                            : styles.tabTextInactive
                                    }
                                >
                                    关于 TA
                                </Text>
                                {activeTab === 'about' && (
                                    <View style={styles.tabIndicatorActive} />
                                )}
                            </Pressable>

                            <Pressable style={styles.tabItem} onPress={() => setActiveTab('story')}>
                                <Text
                                    style={
                                        activeTab === 'story'
                                            ? styles.tabTextActive
                                            : styles.tabTextInactive
                                    }
                                >
                                    故事
                                </Text>
                                {activeTab === 'story' && (
                                    <View style={styles.tabIndicatorActive} />
                                )}
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </>
    );
}
