import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const imgCover = require('../../../assets/images/quick-login/cover.png');
const imgCheck = require('../../../assets/images/quick-login/check.svg');
const imgClose = require('../../../assets/images/quick-login/close.svg');

import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';

export default function QuickLogin() {
    const [agreed, setAgreed] = useState(false);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

                {/* Top Right Close Button */}
                <View style={styles.header}>
                    <AiCloseBtn iconSource={imgClose} />
                </View>

                {/* Center Content Area */}
                <View style={styles.content}>
                    {/* Cover Image & Branding */}
                    <View style={styles.brandSection}>
                        <View style={styles.coverWrapper}>
                            <Image source={imgCover} style={styles.coverImage} resizeMode="cover" />
                        </View>
                        <Text style={styles.brandTitle}>探拾</Text>
                    </View>

                    {/* User Phone Info */}
                    <View style={styles.phoneSection}>
                        <Text style={styles.phoneLabel}>本机号码</Text>
                        <View style={styles.phoneRow}>
                            <Text style={styles.phonePrefix}>147****</Text>
                            <Text style={styles.phoneSuffix}>7554</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>一键登录</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>其他手机号登录</Text>
                    </TouchableOpacity>

                    {/* Agreement Footer */}
                    <View style={styles.agreementSection}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setAgreed(!agreed)}
                        >
                            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                                {agreed && <Image source={imgCheck} style={styles.checkIcon} />}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.agreementTextContainer}>
                            <Text style={styles.agreementText}>已阅读并同意</Text>
                            <Text style={styles.agreementLink}>《用户服务协议》《用户隐私政策》</Text>
                            <Text style={styles.agreementLink}>《中国移动认证服务条款》</Text>
                        </View>
                    </View>
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
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingTop: 10,
        zIndex: 10,
    },
    closeButton: {
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 60,
    },
    coverWrapper: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    brandTitle: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    phoneSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 6,
        marginBottom: 8,
    },
    phonePrefix: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginRight: 4,
    },
    phoneSuffix: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    phoneLabel: {
        fontSize: 16,
        color: '#828286',
    },
    bottomSection: {
        paddingHorizontal: 25,
        paddingBottom: 40,
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#9aff00',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    secondaryButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#28292d',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    secondaryButtonText: {
        fontSize: 18,
        color: '#b2b3b6',
    },
    agreementSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 15,
    },
    checkboxContainer: {
        marginRight: 10,
        marginTop: 2,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#9aff00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: '#9aff00',
    },
    checkIcon: {
        width: 10,
        height: 10,
        tintColor: '#000000',
    },
    agreementTextContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    agreementText: {
        fontSize: 13,
        color: '#67686c',
        lineHeight: 22,
    },
    agreementLink: {
        fontSize: 13,
        color: '#9c9da1',
        lineHeight: 22,
    },
});
