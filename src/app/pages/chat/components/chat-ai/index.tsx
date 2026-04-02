import React from 'react';
import { View, Text, Pressable, Image, ImageBackground } from 'react-native';
import { styles } from './styles';

// ─── SVG Icons (from Figma exported assets) ───
const imgPlayIcon = require('../../../../../assets/images/chat/chat-ai/play-icon.svg');
const imgRefreshIcon = require('../../../../../assets/images/chat/chat-ai/refresh.svg');
const imgThumbsUpIcon = require('../../../../../assets/images/chat/chat-ai/thumbs-up.svg');
const imgNameTagBg = require('../../../../../assets/images/chat/chat-ai/name-tag-bg.svg');
const imgPlayBg = require('../../../../../assets/images/chat/chat-ai/play-bg.svg');

function PlayIcon() {
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
  actionText?: string;
  speechText?: string;
  audioDuration?: string;
  onRefresh?: () => void;
  onThumbsUp?: () => void;
  onPlayAudio?: () => void;
}

// ─── Main Component ───

export function ChatAi({
  name = 'Assistant',
  actionText = '(坐在桌前，嘴角挂着看似无害的笑容，',
  speechText = '来挺精神的嘛，不知道能坚持多久不被熏',
  audioDuration = '8"',
  onRefresh,
  onThumbsUp,
  onPlayAudio,
}: ChatAiProps) {
  return (
    <View style={styles.container}>
      {/* ── Chat bubble structure ── */}
      <View style={styles.bubbleWrapper}>
        {/* Absolute headers fixed to left and right corners, sitting BEHIND the bubble wrapper */}
        <ImageBackground source={imgNameTagBg} style={styles.nameTagBg} imageStyle={styles.nameTagBgImage}>
          <Text style={styles.nameTagText}>{name}</Text>
        </ImageBackground>

        <Pressable style={styles.playBgWrapper} onPress={onPlayAudio}>
          <ImageBackground source={imgPlayBg} style={styles.playBg} imageStyle={styles.playBgImage}>
            <View style={styles.playContent}>
              <PlayIcon />
              <Text style={styles.playDuration}>{audioDuration}</Text>
            </View>
          </ImageBackground>
        </Pressable>

        {/* ── Main Chat bubble (higher zIndex to cover tag corners) ── */}
        <View style={styles.bubble}>
          {actionText ? (
            <Text style={styles.actionText}>{actionText}</Text>
          ) : null}
          {speechText ? (
            <Text style={styles.speechText}>{speechText}</Text>
          ) : null}
        </View>
      </View>

      {/* ── Action bar: refresh + thumbs-up ── */}
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
    </View>
  );
}
