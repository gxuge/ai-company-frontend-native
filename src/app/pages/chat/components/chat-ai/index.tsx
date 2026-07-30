import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, Image, ImageBackground, Platform } from 'react-native';
import { styles } from './styles';

// ─── SVG Icons (from Figma exported assets) ───
const imgPlayIcon = require('../../../../../assets/images/chat/chat-ai/play-icon.svg');
const imgRefreshIcon = require('../../../../../assets/images/chat/chat-ai/refresh.svg');
const imgThumbsUpIcon = require('../../../../../assets/images/chat/chat-ai/thumbs-up.svg');
const imgNameTagBg = require('../../../../../assets/images/chat/chat-ai/name-tag-bg.svg');
const imgPlayBg = require('../../../../../assets/images/chat/chat-ai/play-bg.svg');

const imgWaveWhiteTiny = ((m: any) => m?.default ?? m?.uri ?? m)(require('@/assets/images/wave-icon/wave-white-tiny.gif'));

function toAssetUri(source: any) {
  return source?.uri ?? source?.default ?? source;
}

function PlayIcon({ isPlaying }: { isPlaying?: boolean }) {
  if (isPlaying) {
    return (
      <Image
        source={typeof imgWaveWhiteTiny === 'string' ? { uri: imgWaveWhiteTiny } : imgWaveWhiteTiny}
        style={{ width: 22, height: 18, marginTop: -2 }}
        resizeMode="contain"
      />
    );
  }
  return <Image source={imgPlayIcon} style={{ width: 14, height: 14 }} resizeMode="contain" />;
}

function RefreshIcon() {
  return <Image source={imgRefreshIcon} style={{ width: 20, height: 20 }} resizeMode="contain" />;
}

function ThumbsUpIcon() {
  return <Image source={imgThumbsUpIcon} style={{ width: 20, height: 20 }} resizeMode="contain" />;
}

// ─── Component Props ───

interface ChatAiProps {
  name?: string;
  speechText?: string;
  audioDuration?: string;
  segments?: Array<{ text: string; type: 'speech' | 'action' }>;
  onRefresh?: () => void;
  onThumbsUp?: () => void;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
  showActions?: boolean;
}

// ─── Main Component ───

export function ChatAi({
  name,
  speechText,
  audioDuration = '8"',
  segments,
  onRefresh,
  onThumbsUp,
  onPlayAudio,
  isPlaying,
  showActions = true,
}: ChatAiProps) {
  const { t } = useTranslation();
  const displayName = name || t('chat.common.systemName');
  const displaySpeechText = speechText || t('chat.main.defaultAiMessage');
  const normalizedSegments = Array.isArray(segments) && segments.length > 0
    ? segments
    : displaySpeechText
      ? [{ text: displaySpeechText, type: 'speech' as const }]
      : [];

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.bubbleWrapper}>
          <div style={webStyles.nameTagBg}>
            <img src={toAssetUri(imgNameTagBg)} style={webStyles.nameTagBgImage} />
            <div style={webStyles.nameTagText}>{displayName}</div>
          </div>

          <button type="button" style={webStyles.playBgWrapper} onClick={onPlayAudio}>
            <div style={webStyles.playBg}>
              <img src={toAssetUri(imgPlayBg)} style={webStyles.playBgImage} />
              <div style={webStyles.playContent}>
              {isPlaying
                ? <img src={toAssetUri(imgWaveWhiteTiny)} style={{ width: 22, height: 18 }} />
                : <img src={toAssetUri(imgPlayIcon)} style={{ width: 14, height: 14 }} />}
                <span style={webStyles.playDuration}>{audioDuration}</span>
              </div>
            </div>
          </button>

          <div style={webStyles.bubble}>
            <div style={webStyles.textContent}>
              {normalizedSegments.map((segment, index) => (
                <span
                  key={`${segment.type}-${index}`}
                  style={segment.type === 'action' ? webStyles.actionText : webStyles.speechText}
                >
                  {segment.text}
                </span>
              ))}
            </div>
          </div>
        </div>
        {showActions && (
          <div style={webStyles.actionBar}>
            <div style={webStyles.actionBarPill}>
              <button type="button" style={webStyles.iconButton} onClick={onRefresh}>
                <img src={toAssetUri(imgRefreshIcon)} style={{ width: 20, height: 20 }} />
              </button>
              <button type="button" style={webStyles.iconButton} onClick={onThumbsUp}>
                <img src={toAssetUri(imgThumbsUpIcon)} style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Chat bubble structure ── */}
      <View style={styles.bubbleWrapper}>
        {/* Absolute headers fixed to left and right corners, sitting BEHIND the bubble wrapper */}
        <ImageBackground source={imgNameTagBg} style={styles.nameTagBg} imageStyle={styles.nameTagBgImage}>
          <Text style={styles.nameTagText}>{displayName}</Text>
        </ImageBackground>

        <Pressable style={styles.playBgWrapper} onPress={onPlayAudio}>
          <ImageBackground source={imgPlayBg} style={styles.playBg} imageStyle={styles.playBgImage}>
            <View style={styles.playContent}>
              <PlayIcon isPlaying={isPlaying} />
              <Text style={styles.playDuration}>{audioDuration}</Text>
            </View>
          </ImageBackground>
        </Pressable>

        {/* ── Main Chat bubble (higher zIndex to cover tag corners) ── */}
        <View style={styles.bubble}>
          <View style={styles.textContent}>
            {normalizedSegments.map((segment, index) => (
              <Text
                key={`${segment.type}-${index}`}
                style={segment.type === 'action' ? styles.actionText : styles.speechText}
              >
                {segment.text}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* ── Action bar: refresh + thumbs-up ── */}
      {showActions && (
        <View style={styles.actionBar}>
          <View style={styles.actionBarPill}>
            <Pressable style={styles.actionIconBtn} onPress={onRefresh}>
              <RefreshIcon />
            </Pressable>
            <Pressable style={styles.actionIconBtn} onPress={onThumbsUp}>
              <ThumbsUpIcon />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    boxSizing: 'border-box',
  },
  bubbleWrapper: {
    position: 'relative',
    width: '80%',
    marginTop: 24,
  },
  nameTagBg: {
    position: 'absolute',
    top: -23.5,
    left: -1,
    width: 67.5,
    height: 35.4,
    paddingTop: 3,
    paddingLeft: 12,
    zIndex: 1,
    boxSizing: 'border-box',
  },
  nameTagBgImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  nameTagText: {
    position: 'relative',
    zIndex: 2,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  playBgWrapper: {
    position: 'absolute',
    top: -23.65,
    right: -1,
    zIndex: 1,
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
  },
  playBg: {
    position: 'relative',
    width: 45.6,
    height: 31,
    paddingTop: 5,
    paddingLeft: 10,
    boxSizing: 'border-box',
  },
  playBgImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    transform: 'scaleX(-1)',
  },
  playContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  playDuration: {
    color: '#b2b3b7',
    fontSize: 11,
    fontWeight: 500,
  },
  bubble: {
    position: 'relative',
    zIndex: 20,
    width: '100%',
    backgroundColor: '#181818',
    borderRadius: 15,
    padding: 16,
    boxSizing: 'border-box',
    border: '1px solid #181818',
    display: 'flex',
  },
  textContent: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 0,
  },
  actionText: {
    color: '#80817b',
    fontSize: 15,
    lineHeight: '22px',
  },
  speechText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: '24px',
  },
  actionBar: {
    marginTop: 10,
  },
  actionBarPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 14,
    padding: '8px 10px',
    borderRadius: 10,
    backgroundColor: 'rgba(74,74,69,0.4)',
  },
  iconButton: {
    width: 20,
    height: 20,
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};
