import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';
import type { TsChatMessage } from '@/lib/api';
import { tsChatApi } from '@/lib/api';
import { ChatHeader } from './components/chat-header';
import ChatDesc from './components/chat-desc';
import { ChatAi } from './components/chat-ai';
import { ChatUser } from './components/chat-user';
import { ChatInput } from './components/chat-input';

type ChatListItem = {
  id: string;
  type: 'ai' | 'user';
  name?: string;
  actionText?: string;
  speechText?: string;
  audioDuration?: string;
  segments?: Array<{ text: string; type: 'speech' | 'action' }>;
};

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
    const id = typeof item.id === 'number' && Number.isFinite(item.id) ? String(item.id) : `${index + 1}`;
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

export default function Chat() {
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const [messages, setMessages] = useState<ChatListItem[]>(DEFAULT_MESSAGES);
  const sessionId = parseSessionId(params.sessionId);

  useEffect(() => {
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
      const mapped = mapBackendMessages(page?.records);
      if (mapped.length > 0) {
        setMessages(mapped);
      }
    }).catch(() => {
      // 保持默认内容，避免影响既有布局
    });

    return () => {
      alive = false;
    };
  }, [sessionId]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ChatHeader />

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
          <ChatInput />
        </View>

        <View style={styles.tabContainer}>
          <AiBottomTabs />
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
});
