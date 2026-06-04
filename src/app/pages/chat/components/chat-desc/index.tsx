import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Image, Platform, Text, View } from 'react-native';

import { styles } from './styles';

const imgAvatar = require('../../../../../assets/images/chat/chat-desc/avatar.png');

const imgBookIcon = require('../../../../../assets/images/chat/chat-desc/book_icon.svg');

function toAssetUri(source: any) {
  return source?.uri ?? source?.default ?? source;
}

type ChatDescProps = {
  title?: string;
  description?: string;
  avatarSources?: Array<string | number>;
  mode?: 'story' | 'role';
};

// ─── Component ───
export default function ChatDesc({
  title = '顶级室友：五倍酸爽！',
  description = '简介 。。。。。',
  avatarSources,
  mode,
}: ChatDescProps) {
  const displayAvatars = avatarSources && avatarSources.length > 0 ? avatarSources.slice(0, 5) : [imgAvatar, imgAvatar, imgAvatar, imgAvatar, imgAvatar];

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.outer}>
        <div style={webStyles.container}>
          <div style={webStyles.card}>
            {mode !== 'role' && (
              <div style={webStyles.headerRow}>
                <div style={webStyles.separatorLeft} />
                <div style={webStyles.title}>{title}</div>
                <div style={webStyles.separatorRight} />
              </div>
            )}
            {mode !== 'role' && (
              <div style={webStyles.avatarRow}>
                {displayAvatars.map((item, index) => (
                  <div key={index} style={webStyles.avatarWrapper}>
                    <img src={toAssetUri(item)} style={webStyles.avatarImage} />
                  </div>
                ))}
              </div>
            )}
            <div style={webStyles.descriptionRow}>
              <div style={webStyles.descTitle}>
                <img src={toAssetUri(imgBookIcon)} style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 10, display: 'inline-block' }} />
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* ── Header Row (Title with Line Separators) ── */}
          {mode !== 'role' && (
            <View style={styles.headerRow}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.4)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.separatorLine}
              />
              <Text style={styles.title}>{title}</Text>
              <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'rgba(0,0,0,0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.separatorLine}
              />
            </View>
          )}

          {/* ── Avatar Row (5 Avatars) ── */}
          {mode !== 'role' && (
            <View style={styles.avatarRow}>
              {displayAvatars.map((item, index) => (
                <View key={index} style={styles.avatarWrapper}>
                  <Image source={typeof item === 'string' ? { uri: item } : item} style={styles.avatarImage} resizeMode="cover" />
                </View>
              ))}
            </View>
          )}

          {/* ── Description Row ── */}
          <View style={styles.descriptionRow}>
            <Text style={styles.descTitle}>
              <Image source={imgBookIcon} style={{ width: 18, height: 18, marginRight: 8 }} resizeMode="contain" />
              {description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const webStyles: Record<string, React.CSSProperties> = {
  outer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#181919',
    borderRadius: 15,
    paddingTop: 18,
    paddingBottom: 20,
    boxSizing: 'border-box',
  },
  headerRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    marginBottom: 8,
    boxSizing: 'border-box',
  },
  separatorLeft: {
    flex: 1,
    height: 1,
    background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,0.4))',
  },
  separatorRight: {
    flex: 1,
    height: 1,
    background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(0,0,0,0))',
  },
  title: {
    margin: '0 8px',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 0',
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '1.1px solid rgba(233, 250, 200, 0.6)',
    overflow: 'hidden',
    padding: 1,
    boxSizing: 'border-box',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  descriptionRow: {
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  descTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '22px',
    textAlign: 'left',
  },
};
