import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const imgTabHome = require('../../../assets/images/chat/tab_home.svg');
const imgTabSearch = require('../../../assets/images/chat/tab_search.svg');
const imgTabAddOutline = require('../../../assets/images/chat/tab_add_outline.svg');
const imgTabAddInner = require('../../../assets/images/chat/tab_add_inner.svg');
const imgTabChat = require('../../../assets/images/chat/tab_chat.svg');
const imgTabProfile = require('../../../assets/images/chat/tab_profile.svg');
const imgAvatar = require('../../../assets/images/chat/avatar.png');
const imgBookTop = require('../../../assets/images/chat/top_book.svg');
const imgFire = require('../../../assets/images/chat/fire.svg');
const imgVolume = require('../../../assets/images/chat/more.svg');
const imgBookDesc = require('../../../assets/images/chat/book.svg');
const imgNameBubble = require('../../../assets/images/chat/voice_bubble.svg');
const imgVoiceBubble = require('../../../assets/images/chat/voice_bubble_2.svg');
const imgPlay = require('../../../assets/images/chat/play.svg');
const imgRefresh = require('../../../assets/images/chat/refresh.svg');
const imgLike = require('../../../assets/images/chat/like.svg');
const imgInputBg = require('../../../assets/images/chat/input_bg.svg');
const imgKeyboard = require('../../../assets/images/chat/keyboard.svg');
const imgLightbulb = require('../../../assets/images/chat/lightbulb.svg');
const imgPlus = require('../../../assets/images/chat/plus.svg');

export default function Chat() {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle} numberOfLines={1}>顶级室友：...</Text>
                        <View style={styles.hotnessContainer}>
                            <Image source={imgFire} style={styles.fireIcon} />
                            <Text style={styles.hotnessText}>16.6w</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Image source={imgBookTop} style={styles.topIcon} resizeMode="contain" />
                        <Image source={imgVolume} style={styles.topIcon} resizeMode="contain" />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoTitleContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.infoTitle}>顶级室友：五倍酸爽！</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.avatarsContainer}>
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <Image
                                    key={index}
                                    source={imgAvatar}
                                    style={[styles.avatar, index > 0 && styles.avatarOverlap]}
                                />
                            ))}
                        </View>

                        <View style={styles.descContainer}>
                            <Image source={imgBookDesc} style={styles.descIcon} />
                            <Text style={styles.descTextTitle}>简介 </Text>
                            <Text style={styles.descTextDots}>。。。。。。</Text>
                        </View>
                    </View>

                    {/* Chat Messages */}
                    <View style={styles.charMessageContainer}>
                        {/* Name and Voice tags container */}
                        <View style={styles.messageTagsContainer}>
                            <View style={styles.nameTag}>
                                <Image source={imgNameBubble} style={styles.nameTagBg} resizeMode="stretch" />
                                <Text style={styles.nameTagText}>柯北旸</Text>
                            </View>
                            <View style={styles.voiceTag}>
                                <Image source={imgVoiceBubble} style={styles.voiceTagBg} resizeMode="stretch" />
                                <Image source={imgPlay} style={styles.playIcon} />
                                <Text style={styles.voiceTagText}>8"</Text>
                            </View>
                        </View>

                        {/* Message Bubble */}
                        <View style={styles.charBubble}>
                            <Text style={styles.messageText}>
                                <Text style={styles.messageTextGray}>(坐在桌前，嘴角挂着看似无害的笑容，语气却有些阴阳怪气) </Text>
                                <Text style={styles.messageTextWhite}>哎呀，新室友看起来挺精神的嘛，不知道能坚持多久不被熏跑哦。</Text>
                                <Text style={styles.messageTextGray}>（说着，还故意深吸一口气，然</Text>
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.messageActions}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Image source={imgRefresh} style={styles.actionIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Image source={imgLike} style={styles.actionIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.userMessageContainer}>
                        <View style={styles.userBubble}>
                            <Text style={styles.userMessageTextMain}>我不知道</Text>
                            <Text style={styles.userMessageTextSub}> （摇了摇头）</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputSection}>
                    <TouchableOpacity
                        style={styles.inputBox}
                        onPressIn={() => setIsRecording(true)}
                        onPressOut={() => setIsRecording(false)}
                        activeOpacity={0.8}
                    >
                        <Image source={imgInputBg} style={styles.inputBg} resizeMode="stretch" />
                        <View style={styles.inputContent}>
                            <Image source={imgKeyboard} style={styles.inputSideIcon} />
                            <Text style={styles.inputText}>{isRecording ? '松开发送' : '按住说话'}</Text>
                            <View style={styles.inputRightIcons}>
                                <Image source={imgLightbulb} style={styles.inputSideIcon} />
                                <Image source={imgPlus} style={styles.inputSideIconRight} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Bottom Navigation */}
                <View style={styles.bottomTabs}>
                    <TouchableOpacity style={styles.tabItem}><Image source={imgTabHome} style={styles.tabIcon} /></TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}><Image source={imgTabSearch} style={styles.tabIcon} /></TouchableOpacity>
                    <TouchableOpacity style={styles.tabItemMiddle}>
                        <Image source={imgTabAddOutline} style={styles.tabAddOutline} />
                        <Image source={imgTabAddInner} style={styles.tabAddInner} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}><Image source={imgTabChat} style={styles.tabIcon} /></TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}><Image source={imgTabProfile} style={styles.tabIcon} /></TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        color: '#bcbab6',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    hotnessContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fireIcon: {
        width: 14,
        height: 14,
        marginRight: 4,
    },
    hotnessText: {
        color: '#929292',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topIcon: {
        width: 24,
        height: 24,
        marginLeft: 15,
        tintColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    infoCard: {
        backgroundColor: '#181919',
        borderRadius: 20,
        marginHorizontal: 15,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    infoTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'center',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    infoTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    avatarsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(233,250,200,0.6)',
    },
    avatarOverlap: {
        marginLeft: -10,
    },
    descContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    descIcon: {
        width: 18,
        height: 18,
        marginTop: 2,
        marginRight: 6,
    },
    descTextTitle: {
        color: '#ffffff',
        fontSize: 14,
    },
    descTextDots: {
        color: '#a8a8a8',
        fontSize: 14,
    },
    charMessageContainer: {
        paddingHorizontal: 15,
        marginBottom: 25,
        alignItems: 'flex-start',
    },
    messageTagsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 8,
        marginBottom: -12, // Pull bubble up to overlap
        zIndex: 10,
    },
    nameTag: {
        width: 70,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameTagBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    nameTagText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '500',
        paddingBottom: 2,
    },
    voiceTag: {
        width: 50,
        height: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    voiceTagBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    playIcon: {
        width: 12,
        height: 12,
        marginRight: 4,
    },
    voiceTagText: {
        color: '#b2b3b7',
        fontSize: 12,
        fontWeight: '500',
    },
    charBubble: {
        backgroundColor: '#181818',
        borderRadius: 20,
        paddingTop: 24,
        paddingBottom: 15,
        paddingHorizontal: 20,
        width: '90%',
        borderWidth: 1,
        borderColor: '#181818',
    },
    messageText: {
        lineHeight: 24,
    },
    messageTextWhite: {
        color: '#ffffff',
        fontSize: 15,
    },
    messageTextGray: {
        color: '#80817b',
        fontSize: 15,
    },
    messageActions: {
        flexDirection: 'row',
        backgroundColor: 'rgba(74,74,69,0.4)',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 10,
        marginLeft: 10,
    },
    actionBtn: {
        padding: 5,
        marginHorizontal: 5,
    },
    actionIcon: {
        width: 20,
        height: 20,
    },
    userMessageContainer: {
        paddingHorizontal: 15,
        marginBottom: 20,
        alignItems: 'flex-end',
    },
    userBubble: {
        backgroundColor: '#c6ffb8',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxWidth: '85%',
    },
    userMessageTextMain: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userMessageTextSub: {
        color: '#a8a8a8',
        fontSize: 15,
    },
    inputSection: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    inputBox: {
        width: '100%',
        height: 56,
        justifyContent: 'center',
    },
    inputBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    inputSideIcon: {
        width: 24,
        height: 24,
    },
    inputRightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputSideIconRight: {
        width: 24,
        height: 24,
        marginLeft: 15,
    },
    inputText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '500',
    },
    bottomTabs: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#181818',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    tabItemMiddle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    tabIcon: {
        width: 24,
        height: 24,
    },
    tabAddOutline: {
        position: 'absolute',
        width: 46,
        height: 46,
    },
    tabAddInner: {
        width: 20,
        height: 20,
    }
});
