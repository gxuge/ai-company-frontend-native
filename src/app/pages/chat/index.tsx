import type { TsAgentChatMessage, TsChatMessage } from '@/lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';
import { buildStoryDescriptionText, extractStoryRoleIds, pickStoryPreviewText, pickTsImageUrl, tsAgentChatApi, tsChatApi, tsRoleApi, tsStoryApi } from '@/lib/api';
import { getCachedChatAudioObjectUrl, primeChatAudioCache } from '@/lib/chat-audio-cache';
import { storage } from '@/lib/storage';

import { ChatAi } from './components/chat-ai';
import ChatDesc from './components/chat-desc';
import { ChatHeader } from './components/chat-header';
import { ChatInput } from './components/chat-input';
import { ChatRoleHeader } from './components/chat-role-header';
import type { ChatTipItem } from './components/chat-tip';
import { ChatTip } from './components/chat-tip';
import { ChatUser } from './components/chat-user';

const imgFeatureCall = require('@/assets/images/admin-chat/feature_call.svg');
const imgFeatureCamera = require('@/assets/images/admin-chat/feature_camera.svg');
const imgFeatureFile = require('@/assets/images/admin-chat/feature_file.svg');
const imgFeatureImage = require('@/assets/images/admin-chat/feature_image.svg');

const FEATURE_EXPANDED_HEIGHT = 92;
const TIP_HINT_EMPTY_ID = '__tip_hint_empty__';
const TIP_HINT_ERROR_ID = '__tip_hint_error__';
const AGENT_AUDIO_TODO_TEXT = '当前 Agent 会话暂未接入语音播放。';

type ChatListItem = {
  id: string;
  messageId?: number;
  type: 'ai' | 'user';
  name?: string;
  actionText?: string;
  speechText?: string;
  audioDuration?: string;
  audioUrl?: string;
  localAudioUrl?: string;
  audioCacheKey?: string;
  mimeType?: string;
  audioStatus?: 'idle' | 'loading' | 'ready' | 'failed';
  segments?: Array<{ text: string; type: 'speech' | 'action' }>;
};

type ChatHeaderState = {
  mode: 'story' | 'role';
  storyId: number | null;
  roleId: number | null;
  activeRoleId?: number;
  storyTitle?: string;
  storyFanCount?: string;
  roleName?: string;
  roleUsername?: string;
  roleChatCount?: string;
  roleAvatar?: string;
  roleBackground?: string;
  descTitle?: string;
  descDescription?: string;
  descAvatarSources?: string[];
};

type ChatSessionMode = 'chat' | 'agent';

const SEND_ERROR_TEXT = '消息发送失败，请稍后重试。';
const SESSION_INVALID_TEXT = '会话不存在，请返回会话列表重试。';
const DEFAULT_AI_REPLY_TEXT = '我收到了你的消息。';
const SUGGESTION_EMPTY_TEXT = '当前暂无可用建议。';
const SUGGESTION_ERROR_TEXT = '获取建议失败，请稍后重试。';
const MIC_TODO_TEXT = '语音识别暂未接入，请先输入文本后发送。';
const AUDIO_PLAY_UNSUPPORTED_TEXT = '当前设备暂未接入语音播放，请先在 Web 端使用。';
const AUDIO_FETCH_ERROR_TEXT = '语音获取失败，请稍后重试。';
const AUDIO_AUTO_FETCH_STORAGE_KEY = 'chat:auto-voice-fetch-enabled';

const DEFAULT_MESSAGES: ChatListItem[] = [
  {
    id: '1',
    type: 'ai',
    name: '系统',
    actionText: '',
    speechText: '你好，我在这里。',
    audioDuration: '',
  },
  {
    id: '2',
    type: 'user',
    segments: [{ text: '你好', type: 'speech' }],
  },
];

const DEFAULT_HEADER_STATE: ChatHeaderState = {
  mode: 'story',
  storyId: null,
  roleId: null,
};

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function parseSessionId(value?: string | string[]) {
  const raw = firstParam(value);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.trunc(parsed);
}

function mapAgentBackendMessages(records?: TsAgentChatMessage[]): ChatListItem[] {
  const source = Array.isArray(records) ? [...records].reverse() : [];
  return source.map((item, index) => {
    const id = typeof item.id === 'number' && Number.isFinite(item.id) ? String(item.id) : String(index + 1);
    const content = typeof item.content === 'string' && item.content.trim() ? item.content.trim() : ' ';
    const segments = splitMessageSegments(content);
    const roleType = typeof item.roleType === 'string' ? item.roleType.toLowerCase() : '';
    if (roleType === 'user') {
      return {
        id,
        messageId: typeof item.id === 'number' && Number.isFinite(item.id) ? item.id : undefined,
        type: 'user',
        segments,
      };
    }
    return {
      id,
      messageId: typeof item.id === 'number' && Number.isFinite(item.id) ? item.id : undefined,
      type: 'ai',
      name: roleType === 'assistant' ? 'Agent' : '系统',
      speechText: content,
      audioDuration: '',
      audioStatus: 'idle',
      segments,
    };
  });
}

function parseMessageAudioMeta(contentJson?: string | null) {
  if (typeof contentJson !== 'string' || !contentJson.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(contentJson);
    return parsed && typeof parsed === 'object' ? parsed : null;
  }
  catch {
    return null;
  }
}

function formatAudioDuration(durationSec?: number | null) {
  if (typeof durationSec !== 'number' || !Number.isFinite(durationSec) || durationSec <= 0) {
    return '';
  }
  return `${Math.max(1, Math.round(durationSec))}"`;
}

function mapBackendMessages(records?: TsChatMessage[]): ChatListItem[] {
  const source = Array.isArray(records) ? [...records].reverse() : [];
  return source.map((item, index) => {
    const id = typeof item.id === 'number' && Number.isFinite(item.id) ? String(item.id) : String(index + 1);
    const content = typeof item.contentText === 'string' && item.contentText.trim() ? item.contentText.trim() : ' ';
    const audioMeta = parseMessageAudioMeta(item.contentJson);
    const segments = splitMessageSegments(content);
    if (item.senderType === 'user') {
      return {
        id,
        messageId: typeof item.id === 'number' && Number.isFinite(item.id) ? item.id : undefined,
        type: 'user',
        segments,
      };
    }
    return {
      id,
      messageId: typeof item.id === 'number' && Number.isFinite(item.id) ? item.id : undefined,
      type: 'ai',
      name: item.senderName || '系统',
      actionText: '',
      speechText: content,
      audioDuration: formatAudioDuration(typeof audioMeta?.durationSec === 'number' ? audioMeta.durationSec : undefined),
      audioUrl: typeof audioMeta?.audioUrl === 'string' ? audioMeta.audioUrl : undefined,
      audioCacheKey: typeof audioMeta?.audioCacheKey === 'string' ? audioMeta.audioCacheKey : undefined,
      mimeType: typeof audioMeta?.mimeType === 'string' ? audioMeta.mimeType : undefined,
      audioStatus: typeof audioMeta?.audioUrl === 'string' && audioMeta.audioUrl ? 'ready' : 'idle',
      segments,
    };
  });
}

function splitMessageSegments(content: string): Array<{ text: string; type: 'speech' | 'action' }> {
  const text = typeof content === 'string' ? content : '';
  if (!text) {
    return [{ text: ' ', type: 'speech' }];
  }

  const segments: Array<{ text: string; type: 'speech' | 'action' }> = [];
  const pattern = /([（(][^（）()]+[）)])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      const speechText = text.slice(lastIndex, match.index);
      if (speechText) {
        segments.push({ text: speechText, type: 'speech' });
      }
    }
    segments.push({ text: match[0], type: 'action' });
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    const speechText = text.slice(lastIndex);
    if (speechText) {
      segments.push({ text: speechText, type: 'speech' });
    }
  }

  return segments.length > 0 ? segments : [{ text, type: 'speech' }];
}

function toTipItems(source: unknown, emptyText: string): ChatTipItem[] {
  if (!Array.isArray(source)) {
    return [{ id: TIP_HINT_EMPTY_ID, text: emptyText }];
  }
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const item of source) {
    if (typeof item !== 'string') {
      continue;
    }
    const value = item.trim();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
    if (normalized.length >= 3) {
      break;
    }
  }
  if (normalized.length === 0) {
    return [{ id: TIP_HINT_EMPTY_ID, text: emptyText }];
  }
  return normalized.map((text, index) => ({
    id: `tip-${index + 1}`,
    text,
  }));
}

function isTipHintItem(item: ChatTipItem) {
  return item.id === TIP_HINT_EMPTY_ID || item.id === TIP_HINT_ERROR_ID;
}

function toPositiveInt(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.trunc(value);
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.trunc(parsed);
    }
  }
  return null;
}

function formatCompactCount(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return '0';
  }
  const intValue = Math.trunc(value);
  if (intValue >= 10000) {
    const w = intValue / 10000;
    const valueText = w >= 10 ? w.toFixed(0) : w.toFixed(1).replace(/\\.0$/, '');
    return `${valueText}w`;
  }
  return String(intValue);
}

function useChatMessages(sessionMode: ChatSessionMode, sessionId: number | null) {
  const [messages, setMessages] = React.useState<ChatListItem[]>(DEFAULT_MESSAGES);

  React.useEffect(() => {
    let alive = true;
    if (!sessionId) {
      return () => {
        alive = false;
      };
    }

    const request = sessionMode === 'agent'
      ? tsAgentChatApi.getMessageList({ sessionId, pageNo: 1, pageSize: 100 })
      : tsChatApi.getMessageList({ sessionId, pageNo: 1, pageSize: 100 });

    request.then((page) => {
      if (!alive) {
        return;
      }
      setMessages(sessionMode === 'agent'
        ? mapAgentBackendMessages(page?.records as TsAgentChatMessage[])
        : mapBackendMessages(page?.records));
    }).catch(() => {
      if (!alive) {
        return;
      }
      setMessages([]);
    });

    return () => {
      alive = false;
    };
  }, [sessionId, sessionMode]);

  return { messages, setMessages };
}

async function resolveChatHeaderState(sessionMode: ChatSessionMode, sessionId: number): Promise<ChatHeaderState> {
  if (sessionMode === 'agent') {
    const session = await tsAgentChatApi.getSessionDetail(sessionId);
    return {
      mode: 'story',
      storyId: null,
      roleId: null,
      storyTitle: session?.sessionTitle || session?.agentCode || undefined,
      descTitle: session?.sessionTitle || session?.agentCode || undefined,
      descDescription: session?.sessionSummary || undefined,
    };
  }
  const session = await tsChatApi.getSessionDetail(sessionId);
  const storyId = toPositiveInt(session?.storyId);
  const roleId = toPositiveInt(session?.targetRoleId ?? session?.roleId);
  const sessionType = typeof session?.sessionType === 'string' ? session.sessionType.trim().toLowerCase() : '';
  const sessionRoleAvatar = pickTsImageUrl(session, 'character_avatar', 'character_image', 'story_scene');
  const sessionRoleBackground = pickTsImageUrl(session, 'character_image', 'story_scene', 'character_avatar');
  const preferRoleMode = sessionType === 'single' && !!roleId;

  if (preferRoleMode && roleId) {
    try {
      const role = await tsRoleApi.getRoleDetail(roleId);
      const usernameSource = (role?.roleSubtitle || role?.occupation || '').trim();
      const roleAvatar = pickTsImageUrl(role, 'character_avatar', 'character_image') || sessionRoleAvatar || undefined;
      const roleBackground = pickTsImageUrl(role, 'character_image', 'character_avatar') || sessionRoleBackground;
      return {
        mode: 'role',
        storyId,
        roleId,
        roleName: role?.roleName || session?.sessionTitle || undefined,
        roleUsername: usernameSource ? `@${usernameSource.replace(/^@+/, '')}` : undefined,
        roleChatCount: role?.dialogueLength || '0',
        roleAvatar,
        roleBackground,
        activeRoleId: roleId,
        descTitle: role?.roleName || session?.sessionTitle || undefined,
        descDescription: role?.greeting?.trim() || undefined,
        descAvatarSources: roleAvatar
          ? [roleAvatar]
          : undefined,
      };
    }
    catch {
      return {
        mode: 'role',
        storyId,
        roleId,
        activeRoleId: roleId,
        roleName: session?.sessionTitle || undefined,
        roleAvatar: sessionRoleAvatar || undefined,
        roleBackground: sessionRoleBackground || undefined,
        descTitle: session?.sessionTitle || undefined,
      };
    }
  }

  if (storyId) {
    try {
      const story = await tsStoryApi.getStoryDetail(storyId);
      const storyRoleIds = extractStoryRoleIds(story);
      const roleResults = await Promise.allSettled(storyRoleIds.slice(0, 5).map(roleId => tsRoleApi.getRoleDetail(roleId)));
      const storyRoleAvatars = roleResults
        .map(result => (result.status === 'fulfilled' ? pickTsImageUrl(result.value, 'character_avatar', 'character_image') : undefined))
        .filter((item): item is string => Boolean(item));
      const descAvatarSources = storyRoleAvatars.length > 0
        ? storyRoleAvatars
        : (sessionRoleAvatar ? [sessionRoleAvatar] : undefined);
      return {
        mode: 'story',
        storyId,
        roleId,
        activeRoleId: roleId ?? storyRoleIds[0],
        storyTitle: story?.title || session?.sessionTitle || undefined,
        storyFanCount: formatCompactCount(story?.followerCount),
        descTitle: story?.title || session?.sessionTitle || undefined,
        descDescription: pickStoryPreviewText(story) || buildStoryDescriptionText(story, ' ') || undefined,
        descAvatarSources,
      };
    }
    catch {
      return {
        mode: 'story',
        storyId,
        roleId,
        activeRoleId: roleId ?? undefined,
        storyTitle: session?.sessionTitle || undefined,
        descTitle: session?.sessionTitle || undefined,
      };
    }
  }

  if (roleId) {
    try {
      const role = await tsRoleApi.getRoleDetail(roleId);
      const usernameSource = (role?.roleSubtitle || role?.occupation || '').trim();
      const roleAvatar = pickTsImageUrl(role, 'character_avatar', 'character_image') || sessionRoleAvatar || undefined;
      const roleBackground = pickTsImageUrl(role, 'character_image', 'character_avatar') || sessionRoleBackground;
      return {
        mode: 'role',
        storyId,
        roleId,
        roleName: role?.roleName || session?.sessionTitle || undefined,
        roleUsername: usernameSource ? `@${usernameSource.replace(/^@+/, '')}` : undefined,
        roleChatCount: role?.dialogueLength || '0',
        roleAvatar,
        roleBackground,
        activeRoleId: roleId,
        descTitle: role?.roleName || session?.sessionTitle || undefined,
        descDescription: role?.greeting?.trim() || undefined,
        descAvatarSources: roleAvatar
          ? [roleAvatar]
          : undefined,
      };
    }
    catch {
      return {
        mode: 'role',
        storyId,
        roleId,
        activeRoleId: roleId,
        roleName: session?.sessionTitle || undefined,
        roleAvatar: sessionRoleAvatar || undefined,
        roleBackground: sessionRoleBackground || undefined,
        descTitle: session?.sessionTitle || undefined,
      };
    }
  }

  return {
    mode: 'story',
    storyId: null,
    roleId: null,
    storyTitle: session?.sessionTitle || undefined,
  };
}

function useChatHeaderState(sessionMode: ChatSessionMode, sessionId: number | null) {
  const [headerState, setHeaderState] = React.useState<ChatHeaderState>(DEFAULT_HEADER_STATE);

  React.useEffect(() => {
    let alive = true;
    if (!sessionId) {
      return () => {
        alive = false;
      };
    }

    resolveChatHeaderState(sessionMode, sessionId)
      .then((next) => {
        if (!alive) {
          return;
        }
        setHeaderState(next);
      })
      .catch(() => {
        if (!alive) {
          return;
        }
        setHeaderState(DEFAULT_HEADER_STATE);
      });

    return () => {
      alive = false;
    };
  }, [sessionId, sessionMode]);

  return sessionId ? headerState : DEFAULT_HEADER_STATE;
}

function ChatTopHeader({
  headerState,
  sessionId,
  onVolumePress,
}: {
  headerState: ChatHeaderState;
  sessionId: number | null;
  onVolumePress?: () => void;
}) {
  const openConversationDetail = React.useCallback(() => {
    const nextParams: Record<string, string> = {};
    if (sessionId) {
      nextParams.sessionId = String(sessionId);
    }
    if (headerState.storyId) {
      nextParams.storyId = String(headerState.storyId);
    }
    router.push({
      pathname: '/pages/conversation-detail',
      params: nextParams,
    });
  }, [headerState.storyId, sessionId]);

  const openRoleDetail = React.useCallback(() => {
    if (headerState.roleId) {
      router.push({
        pathname: '/pages/role-detail',
        params: { roleId: String(headerState.roleId) },
      });
    }
  }, [headerState.roleId]);

  if (headerState.mode === 'role') {
    return (
      <ChatRoleHeader
        name={headerState.roleName}
        username={headerState.roleUsername}
        chatCount={headerState.roleChatCount}
        avatarSource={headerState.roleAvatar}
        onChatPreviewPress={openConversationDetail}
        onAvatarPress={openRoleDetail}
        onVolumePress={onVolumePress}
      />
    );
  }

  return (
    <ChatHeader
      title={headerState.storyTitle}
      fanCount={headerState.storyFanCount}
      onBookPress={openConversationDetail}
      onVolumePress={onVolumePress}
    />
  );
}

function ChatView({
  headerState,
  sessionId,
  messages,
  inputValue,
  sending,
  isFeatureExpanded,
  onInputChange,
  onSubmit,
  onMicPress,
  onSuggestion,
  onPlusPress,
  playingMessageId,
  onPlayMessageAudio,
  tips,
  tipsExpanded,
  tipsLoading,
  onTipPress,
  onEditTip,
  chatInputRef,
  scrollViewRef,
  onScrollToBottom,
  onDismissTips,
  onVolumePress,
}: {
  headerState: ChatHeaderState;
  sessionId: number | null;
  messages: ChatListItem[];
  inputValue: string;
  sending: boolean;
  isFeatureExpanded: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onMicPress: () => void;
  onSuggestion: () => void;
  onPlusPress: () => void;
  playingMessageId: string | null;
  onPlayMessageAudio: (id: string) => void;
  tips: ChatTipItem[];
  tipsExpanded: boolean;
  tipsLoading: boolean;
  onTipPress: (item: ChatTipItem) => void;
  onEditTip: (item: ChatTipItem) => void;
  chatInputRef: React.RefObject<any>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  onScrollToBottom: () => void;
  onDismissTips: () => void;
  onVolumePress?: () => void;
}) {
  const featureExpandProgress = useSharedValue(isFeatureExpanded ? 1 : 0);
  const tipsExpandProgress = useSharedValue(tipsExpanded ? 1 : 0);
  const roleBackgroundSource = headerState.mode === 'role' && headerState.roleBackground
    ? { uri: headerState.roleBackground }
    : null;

  React.useEffect(() => {
    featureExpandProgress.value = withTiming(isFeatureExpanded ? 1 : 0, { duration: 240 });
  }, [featureExpandProgress, isFeatureExpanded]);

  React.useEffect(() => {
    tipsExpandProgress.value = withTiming(tipsExpanded ? 1 : 0, { duration: 300 });
  }, [tipsExpandProgress, tipsExpanded]);

  const featureCardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: featureExpandProgress.value,
    height: interpolate(featureExpandProgress.value, [0, 1], [0, FEATURE_EXPANDED_HEIGHT]),
    transform: [{ translateY: interpolate(featureExpandProgress.value, [0, 1], [8, 0]) }],
  }));

  const tipsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tipsExpandProgress.value,
    height: interpolate(tipsExpandProgress.value, [0, 1], [0, 130]), // Approximate height for 3 tips + padding
    transform: [{ translateY: interpolate(tipsExpandProgress.value, [0, 1], [10, 0]) }],
    marginBottom: interpolate(tipsExpandProgress.value, [0, 1], [0, 12]),
  }));

  let lastAiIndex = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].type === 'ai') {
      lastAiIndex = i;
      break;
    }
  }

  return (
    <View style={styles.container}>
      {roleBackgroundSource && Platform.OS === 'web' ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${roleBackgroundSource.uri})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 0,
            }}
          />
          <View style={[styles.roleBackgroundOverlay, { zIndex: 0 }]} />
        </>
      ) : roleBackgroundSource ? (
        <>
          <Image
            source={roleBackgroundSource}
            style={[styles.roleBackgroundImage, { zIndex: 0 }]}
            resizeMode="cover"
          />
          <View style={[styles.roleBackgroundOverlay, { zIndex: 0 }]} />
        </>
      ) : null}
      <SafeAreaView style={styles.safeArea}>
        <ChatTopHeader headerState={headerState} sessionId={sessionId} onVolumePress={onVolumePress} />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={onScrollToBottom}
          onScrollBeginDrag={onDismissTips}
          onTouchStart={onDismissTips}
        >
          <ChatDesc
            title={headerState.descTitle}
            description={headerState.descDescription}
            avatarSources={headerState.descAvatarSources}
            mode={headerState.mode}
          />
          <View style={{ flex: 1 }} />

          <View style={styles.chatList}>
            {messages.map((msg, index) => {
              if (msg.type === 'ai') {
                return (
                  <ChatAi
                    key={msg.id}
                    name={msg.name}
                    speechText={msg.speechText}
                    audioDuration={msg.audioDuration}
                    segments={msg.segments}
                    isPlaying={playingMessageId === msg.id}
                    onPlayAudio={() => onPlayMessageAudio(msg.id)}
                    showActions={index === lastAiIndex}
                  />
                );
              }
              return (
                <ChatUser
                  key={msg.id}
                  segments={msg.segments || [{ text: ' ', type: 'speech' }]}
                />
              );
            })}
          </View>
        </ScrollView>

        <View style={{ marginBottom: 12 }}>
          <Animated.View style={[styles.tipsWrap, tipsAnimatedStyle]}>
            <ChatTip
              items={tips}
              loading={tipsLoading}
              onTipPress={onTipPress}
              onEditPress={onEditTip}
            />
          </Animated.View>
          <ChatInput
            ref={chatInputRef}
            value={inputValue}
            onChangeText={onInputChange}
            onSubmit={onSubmit}
            submitting={sending}
            featureExpanded={isFeatureExpanded}
            onMicPress={onMicPress}
            onLightbulbPress={onSuggestion}
            onPlusPress={onPlusPress}
            onFocus={onDismissTips}
          />
          <Animated.View style={[styles.featureCardsWrap, featureCardsAnimatedStyle]}>
            <View style={styles.featureCardsRow}>
              <View style={styles.featureCard}>
                <Image source={imgFeatureCamera} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureLabel}>相机</Text>
              </View>
              <View style={styles.featureCard}>
                <Image source={imgFeatureImage} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureLabel}>图片</Text>
              </View>
              <View style={styles.featureCard}>
                <Image source={imgFeatureFile} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureLabel}>文件</Text>
              </View>
              <View style={styles.featureCard}>
                <Image source={imgFeatureCall} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureLabel}>通话</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.tabContainer}>
          <AiBottomTabs />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function Chat() {
  const params = useLocalSearchParams<{ sessionId?: string | string[]; agentSessionId?: string | string[] }>();
  const sessionId = parseSessionId(params.sessionId);
  const agentSessionId = parseSessionId(params.agentSessionId);
  const sessionMode: ChatSessionMode = agentSessionId ? 'agent' : 'chat';
  const activeSessionId = agentSessionId ?? sessionId;
  const { messages, setMessages } = useChatMessages(sessionMode, activeSessionId);
  const headerState = useChatHeaderState(sessionMode, activeSessionId);
  const [inputValue, setInputValue] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [isFeatureExpanded, setIsFeatureExpanded] = React.useState(false);
  const [playingMessageId, setPlayingMessageId] = React.useState<string | null>(null);
  const [isTipsExpanded, setIsTipsExpanded] = React.useState(false);
  const [isTipsLoading, setIsTipsLoading] = React.useState(false);
  const [tipsData, setTipsData] = React.useState<ChatTipItem[]>([]);
  const tipsRequestIdRef = React.useRef(0);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const chatInputRef = React.useRef<any>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [autoVoiceFetchEnabled, setAutoVoiceFetchEnabled] = React.useState(() => {
    const stored = storage.getBoolean(AUDIO_AUTO_FETCH_STORAGE_KEY);
    return stored === undefined ? true : stored;
  });

  const scrollToBottom = React.useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd?.({ animated: true });
    });
  }, []);

  const lastAssistantMessageId = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const message = messages[i];
      if (message.type !== 'ai') {
        continue;
      }
      const rawId = String(message.id);
      if (!/^\d+$/.test(rawId)) {
        continue;
      }
      const numericId = Number(rawId);
      if (Number.isFinite(numericId) && numericId > 0) {
        return Math.trunc(numericId);
      }
    }
    return undefined;
  }, [messages]);

  React.useEffect(() => {
    tipsRequestIdRef.current += 1;
    setIsTipsExpanded(false);
    setIsTipsLoading(false);
    setTipsData([]);
  }, [activeSessionId]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTipsExpanded, isFeatureExpanded, tipsData, scrollToBottom]);

  const stopCurrentAudio = React.useCallback(() => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingMessageId(null);
  }, []);

  React.useEffect(() => () => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.pause();
      audioRef.current = null;
    }
  }, []);

  const appendMessage = React.useCallback((next: ChatListItem) => {
    setMessages(prev => [...prev, next]);
  }, [setMessages]);

  const updateMessageAudioState = React.useCallback((messageId: number, patch: Partial<ChatListItem>) => {
    setMessages(prev => prev.map(item => item.messageId === messageId ? { ...item, ...patch } : item));
  }, [setMessages]);

  const cacheMessageAudioForWeb = React.useCallback(async (params: {
    messageId: number;
    audioCacheKey?: string | null;
    audioUrl?: string | null;
  }) => {
    if (Platform.OS !== 'web' || !params.audioCacheKey || !params.audioUrl) {
      return null;
    }
    try {
      const localAudioUrl = await primeChatAudioCache(params.audioCacheKey, params.audioUrl);
      if (localAudioUrl) {
        updateMessageAudioState(params.messageId, { localAudioUrl });
      }
      return localAudioUrl;
    }
    catch (error) {
      console.error('Prime chat audio cache error:', error);
      return null;
    }
  }, [updateMessageAudioState]);

  const fetchMessageAudio = React.useCallback(async (messageId: number, options?: { silent?: boolean }) => {
    if (!activeSessionId || sessionMode !== 'chat') {
      return null;
    }
    updateMessageAudioState(messageId, { audioStatus: 'loading' });
    try {
      const result = await tsChatApi.createMessageTts({
        sessionId: activeSessionId,
        messageId,
      });
      updateMessageAudioState(messageId, {
        audioUrl: result?.audioUrl,
        audioCacheKey: result?.audioCacheKey,
        mimeType: result?.mimeType,
        audioDuration: formatAudioDuration(result?.durationSec),
        audioStatus: result?.audioUrl ? 'ready' : 'failed',
      });
      const localAudioUrl = await cacheMessageAudioForWeb({
        messageId,
        audioCacheKey: result?.audioCacheKey,
        audioUrl: result?.audioUrl,
      });
      return {
        ...result,
        localAudioUrl: localAudioUrl || undefined,
      };
    }
    catch (error) {
      updateMessageAudioState(messageId, { audioStatus: 'failed' });
      if (!options?.silent) {
        Alert.alert('提示', AUDIO_FETCH_ERROR_TEXT);
      }
      console.error('Fetch message audio error:', error);
      return null;
    }
  }, [activeSessionId, cacheMessageAudioForWeb, sessionMode, updateMessageAudioState]);

  const playMessageAudio = React.useCallback(async (message: ChatListItem) => {
    if (sessionMode === 'agent') {
      Alert.alert('提示', AGENT_AUDIO_TODO_TEXT);
      return;
    }
    if (Platform.OS !== 'web') {
      Alert.alert('提示', AUDIO_PLAY_UNSUPPORTED_TEXT);
      return;
    }
    if (!message.messageId) {
      return;
    }
    if (playingMessageId === message.id && audioRef.current) {
      stopCurrentAudio();
      return;
    }

    let audioUrl = message.localAudioUrl;

    if (!audioUrl && message.audioCacheKey) {
      audioUrl = await getCachedChatAudioObjectUrl(message.audioCacheKey) || undefined;
      if (audioUrl) {
        updateMessageAudioState(message.messageId, { localAudioUrl: audioUrl });
      }
    }

    if (!audioUrl && message.audioCacheKey && message.audioUrl) {
      audioUrl = await cacheMessageAudioForWeb({
        messageId: message.messageId,
        audioCacheKey: message.audioCacheKey,
        audioUrl: message.audioUrl,
      }) || undefined;
    }

    if (!audioUrl) {
      const result = await fetchMessageAudio(message.messageId);
      audioUrl = result?.localAudioUrl || result?.audioUrl;
    }
    if (!audioUrl) {
      return;
    }

    stopCurrentAudio();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
      setPlayingMessageId(current => current === message.id ? null : current);
    };
    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
      setPlayingMessageId(current => current === message.id ? null : current);
      Alert.alert('提示', AUDIO_FETCH_ERROR_TEXT);
    };

    try {
      setPlayingMessageId(message.id);
      await audio.play();
    }
    catch (error) {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
      setPlayingMessageId(current => current === message.id ? null : current);
      console.error('Play audio error:', error);
      Alert.alert('提示', AUDIO_FETCH_ERROR_TEXT);
    }
  }, [cacheMessageAudioForWeb, fetchMessageAudio, playingMessageId, sessionMode, stopCurrentAudio, updateMessageAudioState]);

  const handlePlayMessageAudio = React.useCallback((id: string) => {
    const target = messages.find(item => item.id === id && item.type === 'ai');
    if (!target || target.audioStatus === 'loading') {
      return;
    }
    void playMessageAudio(target);
  }, [messages, playMessageAudio]);

  const handleToggleAutoVoiceFetch = React.useCallback(() => {
    setAutoVoiceFetchEnabled(prev => {
      const next = !prev;
      storage.set(AUDIO_AUTO_FETCH_STORAGE_KEY, next);
      Alert.alert('提示', next
        ? '已开启自动准备语音。后续角色回复会提前生成可播放语音。'
        : '已关闭自动准备语音。后续角色回复仅返回文字，点播放时再获取语音。');
      return next;
    });
  }, []);

  const sendMessage = React.useCallback(async (rawText: string) => {
    const text = rawText.trim();
    if (!text || sending) {
      return;
    }
    if (!activeSessionId) {
      Alert.alert('提示', SESSION_INVALID_TEXT);
      return;
    }
    if (sessionMode === 'chat' && !headerState.activeRoleId) {
      Alert.alert('提示', '当前会话还未加载可发言角色，请稍后再试。');
      return;
    }

    appendMessage({
      id: `local-user-${Date.now()}`,
      messageId: undefined,
      type: 'user',
      segments: splitMessageSegments(text),
    });
    setInputValue('');
    tipsRequestIdRef.current += 1;
    setIsTipsExpanded(false);
    setIsTipsLoading(false);
    setTipsData([]);
    setSending(true);
    try {
      const reply = sessionMode === 'agent'
        ? await tsAgentChatApi.createAiReply({
          sessionId: activeSessionId,
          userInput: text,
          historyCount: 12,
        })
        : await tsChatApi.createTemplateAiReply({
          sessionId: activeSessionId,
          userInput: text,
          activeRoleId: headerState.activeRoleId,
          historyCount: 12,
          lastAssistantMessageId,
        });
      const aiText = typeof reply?.contentText === 'string' && reply.contentText.trim()
        ? reply.contentText.trim()
        : DEFAULT_AI_REPLY_TEXT;
      const assistantName = sessionMode === 'agent'
        ? headerState.storyTitle || headerState.descTitle || 'Agent'
        : reply?.activeRoleName || headerState.roleName || '系统';

      appendMessage({
        id: typeof reply?.assistantMessageId === 'number' && Number.isFinite(reply.assistantMessageId)
          ? String(reply.assistantMessageId)
          : `local-ai-${Date.now() + 1}`,
        messageId: typeof reply?.assistantMessageId === 'number' && Number.isFinite(reply.assistantMessageId)
          ? reply.assistantMessageId
          : undefined,
        type: 'ai',
        name: assistantName,
        speechText: aiText,
        audioDuration: '',
        audioStatus: 'idle',
        segments: splitMessageSegments(aiText),
      });
      if (sessionMode === 'chat' && autoVoiceFetchEnabled && Platform.OS === 'web' && typeof reply?.assistantMessageId === 'number' && Number.isFinite(reply.assistantMessageId)) {
        void fetchMessageAudio(reply.assistantMessageId, { silent: true });
      }
    }
    catch {
      appendMessage({
        id: `local-ai-${Date.now() + 1}`,
        messageId: undefined,
        type: 'ai',
        name: '系统',
        speechText: SEND_ERROR_TEXT,
        audioDuration: '',
        audioStatus: 'idle',
        segments: splitMessageSegments(SEND_ERROR_TEXT),
      });
    }
    finally {
      setSending(false);
    }
  }, [
    activeSessionId,
    appendMessage,
    autoVoiceFetchEnabled,
    fetchMessageAudio,
    headerState.activeRoleId,
    headerState.descTitle,
    headerState.roleName,
    headerState.storyTitle,
    lastAssistantMessageId,
    sending,
    sessionMode,
  ]);

  const handleSubmit = React.useCallback(() => {
    void sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleSuggestion = React.useCallback(async () => {
    if (!activeSessionId || isTipsLoading) {
      return;
    }
    if (sessionMode === 'agent') {
      Alert.alert('提示', '当前 Agent 会话暂未接入候选回复。');
      return;
    }

    if (isTipsExpanded) {
      tipsRequestIdRef.current += 1;
      setIsTipsExpanded(false);
      setIsTipsLoading(false);
      return;
    }

    setIsTipsExpanded(true);

    // 如果已经有缓存的提示词，直接展示即可，不再重复请求
    if (tipsData.length > 0) {
      return;
    }

    const requestId = tipsRequestIdRef.current + 1;
    tipsRequestIdRef.current = requestId;
    setIsTipsLoading(true);
    try {
      const result = await tsChatApi.createReplySuggestions({
        sessionId: activeSessionId,
        historyCount: 12,
        userDraft: inputValue.trim() || undefined,
        lastAssistantMessageId,
      });
      if (tipsRequestIdRef.current !== requestId) {
        return;
      }
      const newTips = toTipItems(result?.suggestions, SUGGESTION_EMPTY_TEXT);
      if (newTips.length === 0 || newTips[0].id === TIP_HINT_EMPTY_ID) {
        setIsTipsExpanded(false);
        setTipsData([]);
      } else {
        setTipsData(newTips);
      }
    }
    catch (error) {
      if (tipsRequestIdRef.current !== requestId) {
        return;
      }
      console.error('Fetch suggestions error:', error);
      setIsTipsExpanded(false);
      setTipsData([]);
    }
    finally {
      if (tipsRequestIdRef.current === requestId) {
        setIsTipsLoading(false);
      }
    }
  }, [activeSessionId, inputValue, isTipsExpanded, isTipsLoading, lastAssistantMessageId, sessionMode, tipsData.length]);

  const handleTipPress = React.useCallback((item: ChatTipItem) => {
    if (isTipHintItem(item)) {
      return;
    }
    void sendMessage(item.text);
  }, [sendMessage]);

  const handleEditTip = React.useCallback((item: ChatTipItem) => {
    if (isTipHintItem(item)) {
      return;
    }
    setInputValue(item.text);
    setIsTipsExpanded(false);
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  }, []);

  const handleMicPress = React.useCallback(() => {
    if (inputValue.trim()) {
      void sendMessage(inputValue);
      return;
    }
    Alert.alert('提示', MIC_TODO_TEXT);
  }, [inputValue, sendMessage]);

  const handleToggleFeature = React.useCallback(() => {
    setIsFeatureExpanded(prev => !prev);
  }, []);

  return (
    <ChatView
      headerState={headerState}
      sessionId={activeSessionId}
      messages={messages}
      inputValue={inputValue}
      sending={sending}
      isFeatureExpanded={isFeatureExpanded}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      onMicPress={handleMicPress}
      onSuggestion={() => { void handleSuggestion(); }}
      onPlusPress={handleToggleFeature}
      playingMessageId={playingMessageId}
      onPlayMessageAudio={handlePlayMessageAudio}
      tips={tipsData}
      tipsExpanded={isTipsExpanded}
      tipsLoading={isTipsLoading}
      onTipPress={handleTipPress}
      onEditTip={handleEditTip}
      chatInputRef={chatInputRef}
      scrollViewRef={scrollViewRef}
      onScrollToBottom={scrollToBottom}
      onDismissTips={() => setIsTipsExpanded(false)}
      onVolumePress={handleToggleAutoVoiceFetch}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  roleBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  roleBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  chatList: {
    marginTop: 20,
    gap: 20,
  },
  tabContainer: {
    height: 64,
    width: '100%',
    backgroundColor: '#000000',
  },
  featureCardsWrap: {
    overflow: 'hidden',
    marginTop: 8,
    marginHorizontal: 15,
  },
  featureCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  featureCard: {
    flex: 1,
    minHeight: 78,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 20,
    height: 20,
  },
  featureLabel: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
  },
  tipsWrap: {
    overflow: 'hidden',
    marginHorizontal: 15,
  },
});
