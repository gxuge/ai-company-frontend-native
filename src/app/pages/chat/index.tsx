import type { TsChatMessage } from '@/lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';
import { tsChatApi, tsRoleApi, tsStoryApi } from '@/lib/api';
import { ChatAi } from './components/chat-ai';
import ChatDesc from './components/chat-desc';
import { ChatHeader } from './components/chat-header';
import { ChatInput } from './components/chat-input';
import { ChatRoleHeader } from './components/chat-role-header';
import { ChatUser } from './components/chat-user';

const imgFeatureCamera = require('@/assets/images/admin-chat/feature_camera.svg');
const imgFeatureImage = require('@/assets/images/admin-chat/feature_image.svg');
const imgFeatureFile = require('@/assets/images/admin-chat/feature_file.svg');
const imgFeatureCall = require('@/assets/images/admin-chat/feature_call.svg');
const FEATURE_EXPANDED_HEIGHT = 92;

type ChatListItem = {
  id: string;
  type: 'ai' | 'user';
  name?: string;
  actionText?: string;
  speechText?: string;
  audioDuration?: string;
  segments?: Array<{ text: string; type: 'speech' | 'action' }>;
};

type ChatHeaderState = {
  mode: 'story' | 'role';
  storyId: number | null;
  roleId: number | null;
  storyTitle?: string;
  storyFanCount?: string;
  roleName?: string;
  roleUsername?: string;
  roleChatCount?: string;
  roleAvatar?: string;
};

const SEND_ERROR_TEXT = '消息发送失败，请稍后重试。';
const SESSION_INVALID_TEXT = '会话不存在，请返回会话列表重试。';
const DEFAULT_AI_REPLY_TEXT = '我收到了你的消息。';
const SUGGESTION_EMPTY_TEXT = '当前暂无可用建议。';
const SUGGESTION_ERROR_TEXT = '获取建议失败，请稍后重试。';
const MIC_TODO_TEXT = '语音识别暂未接入，请先输入文本后发送。';

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

function mapBackendMessages(records?: TsChatMessage[]): ChatListItem[] {
  const source = Array.isArray(records) ? [...records].reverse() : [];
  return source.map((item, index) => {
    const id = typeof item.id === 'number' && Number.isFinite(item.id) ? String(item.id) : String(index + 1);
    const content = typeof item.contentText === 'string' && item.contentText.trim() ? item.contentText.trim() : ' ';
    if (item.senderType === 'user') {
      return {
        id,
        type: 'user',
        segments: [{ text: content, type: 'speech' }],
      };
    }
    return {
      id,
      type: 'ai',
      name: item.senderName || '系统',
      actionText: '',
      speechText: content,
      audioDuration: '',
    };
  });
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

function useChatMessages(sessionId: number | null) {
  const [messages, setMessages] = React.useState<ChatListItem[]>(DEFAULT_MESSAGES);

  React.useEffect(() => {
    let alive = true;
    if (!sessionId) {
      return () => {
        alive = false;
      };
    }

    tsChatApi.getMessageList({ sessionId, pageNo: 1, pageSize: 100 }).then((page) => {
      if (!alive) {
        return;
      }
      setMessages(mapBackendMessages(page?.records));
    }).catch(() => {
      if (!alive) {
        return;
      }
      setMessages([]);
    });

    return () => {
      alive = false;
    };
  }, [sessionId]);

  return { messages, setMessages };
}

async function resolveChatHeaderState(sessionId: number): Promise<ChatHeaderState> {
  const session = await tsChatApi.getSessionDetail(sessionId);
  const storyId = toPositiveInt(session?.storyId);
  const roleId = toPositiveInt(session?.targetRoleId ?? session?.roleId);

  if (storyId) {
    try {
      const story = await tsStoryApi.getStoryDetail(storyId);
      return {
        mode: 'story',
        storyId,
        roleId,
        storyTitle: story?.title || session?.sessionTitle || undefined,
        storyFanCount: formatCompactCount(story?.followerCount),
      };
    }
    catch {
      return {
        mode: 'story',
        storyId,
        roleId,
        storyTitle: session?.sessionTitle || undefined,
      };
    }
  }

  if (roleId) {
    try {
      const role = await tsRoleApi.getRoleDetail(roleId);
      const usernameSource = (role?.roleSubtitle || role?.occupation || '').trim();
      return {
        mode: 'role',
        storyId,
        roleId,
        roleName: role?.roleName || session?.sessionTitle || undefined,
        roleUsername: usernameSource ? `@${usernameSource.replace(/^@+/, '')}` : undefined,
        roleChatCount: role?.dialogueLength || '0',
        roleAvatar: role?.avatarUrl || role?.coverUrl || undefined,
      };
    }
    catch {
      return {
        mode: 'role',
        storyId,
        roleId,
        roleName: session?.sessionTitle || undefined,
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

function useChatHeaderState(sessionId: number | null) {
  const [headerState, setHeaderState] = React.useState<ChatHeaderState>(DEFAULT_HEADER_STATE);

  React.useEffect(() => {
    let alive = true;
    if (!sessionId) {
      return () => {
        alive = false;
      };
    }

    resolveChatHeaderState(sessionId)
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
  }, [sessionId]);

  return sessionId ? headerState : DEFAULT_HEADER_STATE;
}

function ChatTopHeader({ headerState, sessionId }: { headerState: ChatHeaderState; sessionId: number | null }) {
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

  if (headerState.mode === 'role') {
    return (
      <ChatRoleHeader
        name={headerState.roleName}
        username={headerState.roleUsername}
        chatCount={headerState.roleChatCount}
        avatarSource={headerState.roleAvatar}
        onChatPreviewPress={openConversationDetail}
      />
    );
  }

  return (
    <ChatHeader
      title={headerState.storyTitle}
      fanCount={headerState.storyFanCount}
      onBookPress={openConversationDetail}
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
}) {
  const featureExpandProgress = useSharedValue(isFeatureExpanded ? 1 : 0);

  React.useEffect(() => {
    featureExpandProgress.value = withTiming(isFeatureExpanded ? 1 : 0, { duration: 240 });
  }, [featureExpandProgress, isFeatureExpanded]);

  const featureCardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: featureExpandProgress.value,
    height: interpolate(featureExpandProgress.value, [0, 1], [0, FEATURE_EXPANDED_HEIGHT]),
    transform: [{ translateY: interpolate(featureExpandProgress.value, [0, 1], [8, 0]) }],
  }));

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ChatTopHeader headerState={headerState} sessionId={sessionId} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ChatDesc />
          <View style={{ flex: 1 }} />

          <View style={styles.chatList}>
            {messages.map((msg) => {
              if (msg.type === 'ai') {
                return (
                  <ChatAi
                    key={msg.id}
                    name={msg.name}
                    actionText={msg.actionText}
                    speechText={msg.speechText}
                    audioDuration={msg.audioDuration}
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
          <ChatInput
            value={inputValue}
            onChangeText={onInputChange}
            onSubmit={onSubmit}
            submitting={sending}
            featureExpanded={isFeatureExpanded}
            onMicPress={onMicPress}
            onLightbulbPress={onSuggestion}
            onPlusPress={onPlusPress}
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
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const sessionId = parseSessionId(params.sessionId);
  const { messages, setMessages } = useChatMessages(sessionId);
  const headerState = useChatHeaderState(sessionId);
  const [inputValue, setInputValue] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [isFeatureExpanded, setIsFeatureExpanded] = React.useState(false);

  const appendMessage = React.useCallback((next: ChatListItem) => {
    setMessages(prev => [...prev, next]);
  }, [setMessages]);

  const sendMessage = React.useCallback(async (rawText: string) => {
    const text = rawText.trim();
    if (!text || sending) {
      return;
    }
    if (!sessionId) {
      Alert.alert('提示', SESSION_INVALID_TEXT);
      return;
    }

    appendMessage({
      id: String(Date.now()),
      type: 'user',
      segments: [{ text, type: 'speech' }],
    });
    setInputValue('');
    setSending(true);
    try {
      const reply = await tsChatApi.createAiReply({
        sessionId,
        userContent: text,
        historyCount: 12,
        generateVoice: true,
      });
      const aiText = typeof reply?.contentText === 'string' && reply.contentText.trim()
        ? reply.contentText.trim()
        : DEFAULT_AI_REPLY_TEXT;
      appendMessage({
        id: typeof reply?.assistantMessageId === 'number' && Number.isFinite(reply.assistantMessageId)
          ? String(reply.assistantMessageId)
          : String(Date.now() + 1),
        type: 'ai',
        name: '系统',
        speechText: aiText,
      });
    }
    catch {
      appendMessage({
        id: String(Date.now() + 1),
        type: 'ai',
        name: '系统',
        speechText: SEND_ERROR_TEXT,
      });
    }
    finally {
      setSending(false);
    }
  }, [appendMessage, sending, sessionId]);

  const handleSubmit = React.useCallback(() => {
    void sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleSuggestion = React.useCallback(async () => {
    if (!sessionId || sending) {
      return;
    }
    try {
      const result = await tsChatApi.createReplySuggestions({
        sessionId,
        historyCount: 12,
        userDraft: inputValue.trim() || undefined,
      });
      const suggestion = (result?.suggestions || []).find(item => typeof item === 'string' && item.trim());
      if (!suggestion) {
        Alert.alert('提示', SUGGESTION_EMPTY_TEXT);
        return;
      }
      setInputValue(suggestion.trim());
    }
    catch {
      Alert.alert('提示', SUGGESTION_ERROR_TEXT);
    }
  }, [inputValue, sending, sessionId]);

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
      sessionId={sessionId}
      messages={messages}
      inputValue={inputValue}
      sending={sending}
      isFeatureExpanded={isFeatureExpanded}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      onMicPress={handleMicPress}
      onSuggestion={() => { void handleSuggestion(); }}
      onPlusPress={handleToggleFeature}
    />
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
});
