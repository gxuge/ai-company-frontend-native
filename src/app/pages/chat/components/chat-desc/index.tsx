import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { styles } from './styles';

const imgAvatar = require('../../../../../assets/images/chat/chat-desc/avatar.png');
const imgBookIcon = require('../../../../../assets/images/chat/chat-desc/book_icon.svg');

// ─── Component ───
export default function ChatDesc() {
    return (
      <View style={styles.outer}>
        <View style={styles.container}>
            <View style={styles.card}>
                {/* ── Header Row (Title with Line Separators) ── */}
                <View style={styles.headerRow}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.4)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.separatorLine}
                    />
                    <Text style={styles.title}>顶级室友：五倍酸爽！</Text>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.4)', 'rgba(0,0,0,0)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.separatorLine}
                    />
                </View>

                {/* ── Avatar Row (5 Avatars) ── */}
                <View style={styles.avatarRow}>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <View key={item} style={styles.avatarWrapper}>
                            <Image source={imgAvatar} style={styles.avatarImage} resizeMode="cover" />
                        </View>
                    ))}
                </View>

                {/* ── Description Row ── */}
                <View style={styles.descriptionRow}>
                    <View style={styles.iconWrapper}>
                        <Image source={imgBookIcon} style={styles.icon} resizeMode="contain" />
                    </View>
                    <View style={styles.descTextContainer}>
                        <Text style={styles.descTitle}>简介 。。。。。</Text>
                    </View>
                </View>
            </View>
        </View>
      </View>
    );
}
