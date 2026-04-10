import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';

// ─── Imported Sub-Components ───
import { ChatHeader } from './components/chat-header';
import ChatDesc from './components/chat-desc';
import { ChatAi } from './components/chat-ai';
import { ChatUser } from './components/chat-user';
import { ChatInput } from './components/chat-input';

export default function Chat() {
    const [messages, setMessages] = useState<any[]>([
        {
            id: '1',
            type: 'ai',
            name: '柯北旸',
            actionText: '（坐在桌前，嘴角挂着看似无害的笑容，',
            speechText: '来挺精神的嘛，不知道能坚持多久不被熏',
            audioDuration: '8"'
        },
        {
            id: '2',
            type: 'user',
            segments: [
                { text: '我不知道', type: 'speech' },
                { text: '（摇了摇头）', type: 'action' }
            ]
        }
    ]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* ── Top Header ── */}
                <ChatHeader />

                {/* ── Scrollable Content Area ── */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <ChatDesc />
                    <View style={{ flex: 1 }} />

                    {/* Chat Messages List */}
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
                            } else {
                                return (
                                    <ChatUser
                                        key={msg.id}
                                        segments={msg.segments}
                                    />
                                );
                            }
                        })}
                    </View>
                </ScrollView>

                {/* ── Bottom Input ── */}
                <View style={{ marginBottom: 12 }}>
                    <ChatInput />
                </View>

                {/* ── Bottom Navigation Tabs ── */}
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
        gap: 20, // spacing between message bubbles
    },
    tabContainer: {
        height: 64,
        width: '100%',
        backgroundColor: '#000000',
    }
});
