import React from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const imgGrandAtmosphericPalaceInteriorWithChandelier = require("../../../assets/images/conversation-detail/imgGrandAtmosphericPalaceInteriorWithChandelier.png");
const imgCreatorAvatar = require("../../../assets/images/conversation-detail/imgCreatorAvatar.png");
const imgCharacter1 = require("../../../assets/images/conversation-detail/imgCharacter1.png");
const imgCharacter2 = require("../../../assets/images/conversation-detail/imgCharacter2.png");
const imgCharacter3 = require("../../../assets/images/conversation-detail/imgCharacter3.png");
const imgCharacter4 = require("../../../assets/images/conversation-detail/imgCharacter4.png");
const imgCharacter5 = require("../../../assets/images/conversation-detail/imgCharacter5.png");
const imgGroup = require("../../../assets/images/conversation-detail/imgGroup.svg");
const imgMoreSquare41 = require("../../../assets/images/conversation-detail/imgMoreSquare41.svg");
const imgFluentAdd12Filled = require("../../../assets/images/conversation-detail/imgFluentAdd12Filled.svg");
const imgIcon = require("../../../assets/images/conversation-detail/imgIcon.svg");
const imgGroup1 = require("../../../assets/images/conversation-detail/imgGroup1.svg");
const imgContainer = require("../../../assets/images/conversation-detail/imgContainer.svg");

export default function Body() {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={imgGrandAtmosphericPalaceInteriorWithChandelier}
                style={styles.backgroundImage}
            >
                <View style={styles.gradientOverlay} />
            </ImageBackground>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={imgGroup} style={styles.closeIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={imgMoreSquare41} style={styles.moreIcon} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.contentHeader}>
                        <Text style={styles.title}>哪来的小可怜呀</Text>

                        <View style={styles.creatorCard}>
                            <View style={styles.creatorInfo}>
                                <Image source={imgCreatorAvatar} style={styles.avatar} />
                                <Text style={styles.creatorName}>kerwin亮亮</Text>
                            </View>
                            <TouchableOpacity style={styles.followButton}>
                                <Image source={imgFluentAdd12Filled} style={styles.addIcon} />
                                <Text style={styles.followText}>关注</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>
                                {`用户是别国进献给姬茗枫的人\n【四弟替换成四妹的版本】\n【用户一切自拟】`}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.storyDetailButton}>
                            <Text style={styles.storyDetailText}>故事详情</Text>
                            <Image source={imgIcon} style={styles.chevronIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.characterListCard}>
                        <Text style={styles.cardTitle}>角色列表</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.characterScroll}>
                            {[
                                { name: '姬茗雪', img: imgCharacter1 },
                                { name: '姬芷岚', img: imgCharacter2 },
                                { name: '姬不语', img: imgCharacter3 },
                                { name: '姬思瑶', img: imgCharacter4 },
                                { name: '姬茗枫', img: imgCharacter5 },
                            ].map((character, index) => (
                                <View key={index} style={styles.characterItem}>
                                    <View style={styles.characterImageContainer}>
                                        <Image source={character.img} style={styles.characterImage} />
                                    </View>
                                    <Text style={styles.characterName}>{character.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <TouchableOpacity style={styles.impressionCard}>
                        <View style={styles.impressionLeft}>
                            <View style={styles.impressionIconContainer}>
                                <Image source={imgGroup1} style={styles.impressionIcon} />
                            </View>
                            <Text style={styles.cardTitle}>观感</Text>
                        </View>
                        <Image source={imgContainer} style={styles.chevronIconLight} />
                    </TouchableOpacity>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 10, 10, 0.4)', // Simplified gradient effect
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 20,
        height: 20,
        tintColor: '#ffffff',
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: '#ffffff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    contentHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 30,
    },
    creatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        width: '100%',
        marginBottom: 30,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    creatorName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#e5e7eb',
        marginLeft: 12,
    },
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9bfe03',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    addIcon: {
        width: 14,
        height: 14,
        tintColor: '#000000',
        marginRight: 4,
    },
    followText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    descriptionContainer: {
        width: '100%',
        marginBottom: 30,
    },
    descriptionText: {
        fontSize: 16,
        color: '#d1d5db',
        lineHeight: 26,
        textAlign: 'left',
    },
    storyDetailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(155, 254, 3, 0.8)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    storyDetailText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#9bfe03',
        marginRight: 8,
    },
    chevronIcon: {
        width: 8,
        height: 12,
        tintColor: '#9bfe03',
    },
    characterListCard: {
        backgroundColor: 'rgba(22, 22, 22, 0.8)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    characterScroll: {
        marginTop: 20,
        flexDirection: 'row',
    },
    characterItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    characterImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        marginBottom: 8,
    },
    characterImage: {
        width: '100%',
        height: '100%',
    },
    characterName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9ca3af',
    },
    impressionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(22, 22, 22, 0.8)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    impressionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    impressionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#262626',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    impressionIcon: {
        width: 18,
        height: 18,
    },
    chevronIconLight: {
        width: 8,
        height: 14,
        tintColor: '#ffffff',
    },
    bottomSpacer: {
        height: 40,
    }
});
