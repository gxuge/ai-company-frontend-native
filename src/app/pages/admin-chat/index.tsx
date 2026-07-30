import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Pressable, TextInput, useWindowDimensions, Image, ScrollView, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, { interpolate, useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence, withDelay } from "react-native-reanimated";
import Env from "env";
import type { AgentChatStreamState, TsAgentChatMessage, TsAgentChatSession } from "@/lib/api";
import { createAsyncToolHistoryState, createImageToolHistoryState, hasVisibleAgentChatToolStep, iterateSseEvents, tsAgentChatApi } from '@/lib/api';
import { resolveApiErrorMessage } from '@/lib/i18n';
import AdminChatThinkingPanel from "@/components/pages/admin-chat/admin-chat-thinking-panel";
import AdminChatMarkdownContent from '@/components/pages/admin-chat/admin-chat-markdown-content';
import { useAgentChatStream } from "@/hooks";

const resolveAsset = (m: any) => m?.default ?? m?.uri ?? m;
const imgImage = require("@/assets/images/admin-chat/ecb7a353c6950598ee6e686ed5e5d05068e56c7f.png");
const imgImage1 = require("@/assets/images/admin-chat/a5ca4172116f94768b6109da1c02910fc74f649b.png");
const imgAiSpark = resolveAsset(require("@/assets/images/admin-chat/ai_spark.svg"));
const imgMenuWhite = resolveAsset(require("@/assets/images/admin-chat/menu_white.svg"));
const imgMenuActive = resolveAsset(require("@/assets/images/admin-chat/menu_active.svg"));
const imgVoiceWhite = resolveAsset(require("@/assets/images/admin-chat/voice_white.svg"));
const imgVoiceActive = resolveAsset(require("@/assets/images/admin-chat/voice_active.svg"));
const imgSendWhite = resolveAsset(require("@/assets/images/admin-chat/send_white.svg"));
const imgSendActive = resolveAsset(require("@/assets/images/admin-chat/send_active.svg"));
const imgSubmitMessage = resolveAsset(require("@/assets/images/chat/chat-input/send.svg"));
const imgFeatureCamera = resolveAsset(require("@/assets/images/admin-chat/feature_camera.svg"));
const imgFeatureImage = resolveAsset(require("@/assets/images/admin-chat/feature_image.svg"));
const imgFeatureFile = resolveAsset(require("@/assets/images/admin-chat/feature_file.svg"));
const imgFeatureCall = resolveAsset(require("@/assets/images/admin-chat/feature_call.svg"));
const imgFluentAdd12Filled = resolveAsset(require("@/assets/images/conversation-detail/imgFluentAdd12Filled.svg"));

/** 原始设计稿宽度（2× Figma 导出） */
const DESIGN_WIDTH = 750;

/** 根据当前视口宽度计算等比缩放因子 */
function useViewportScale() {
  const { width } = useWindowDimensions();
  return width / DESIGN_WIDTH;
}

// ─── 对话消息类型 ──────────────────────────────────────────────────────────────
type ChatRole = "ai" | "user";

type ChatMessage = {
  id: number | string;
  role: ChatRole;
  content: string;
  status?: string;
  loading?: boolean;
  streamState?: AgentChatStreamState | null;
  localOnly?: boolean;
};
const FEATURE_CARDS_EXPANDED_HEIGHT = 251;
const DEFAULT_AGENT_CHAT_APP_ID = Env.EXPO_PUBLIC_AIRAG_PROMPT_CHAT_APP_ID?.trim() || "";
const DEFAULT_AGENT_CHAT_AGENT_CODE = Env.EXPO_PUBLIC_TS_AGENT_CHAT_AGENT_CODE?.trim() || "admin_chat";
const LAST_AGENT_SESSION_STORAGE_KEY = "ts_agent_chat:last_session_id";
const LOCAL_GREETING_MESSAGE_ID = -1;

type PendingSessionState = {
  appId: string;
  agentCode: string;
  sessionTitle: string;
  sessionSummary: string;
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

function readLastAgentSessionId() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(LAST_AGENT_SESSION_STORAGE_KEY);
    return parseSessionId(raw ?? undefined);
  } catch {
    return null;
  }
}

function writeLastAgentSessionId(sessionId: number | null) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (sessionId && Number.isFinite(sessionId) && sessionId > 0) {
      window.localStorage.setItem(LAST_AGENT_SESSION_STORAGE_KEY, String(Math.trunc(sessionId)));
      return;
    }
    window.localStorage.removeItem(LAST_AGENT_SESSION_STORAGE_KEY);
  } catch {
    // ignore localStorage errors on Web/private mode
  }
}

function toAgentChatMessages(records: TsAgentChatMessage[] | undefined) {
  const source = Array.isArray(records) ? [...records] : [];
  return source.flatMap((item, index) => {
    const mapped: ChatMessage[] = [];
    const roleType = typeof item.roleType === "string" ? item.roleType.trim().toLowerCase() : "";
    const content = typeof item.content === "string" && item.content.trim() ? item.content.trim() : " ";
    mapped.push({
      id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : index + 1,
      role: roleType === "user" ? "user" as const : "ai" as const,
      content,
    });
    item.events?.forEach((event) => {
      const streamState = createAsyncToolHistoryState(event) || createImageToolHistoryState(event);
      if (!streamState) {
        return;
      }
      mapped.push({
        id: `tool-event-${event.id}`,
        role: 'ai',
        content: '',
        loading: streamState.active,
        status: streamState.finalStatus,
        streamState,
      });
    });
    return mapped;
  });
}

function createLocalGreetingMessage(content: string): ChatMessage {
  return {
    id: LOCAL_GREETING_MESSAGE_ID,
    role: "ai",
    content,
    status: "success",
    loading: false,
    streamState: null,
    localOnly: true,
  };
}

/* ─── Typing Indicator ──────────────────────────────────────────────────────── */
function BouncingDot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380 }),
          withTiming(0, { duration: 380 }),
        ),
        -1,
      ),
    );
  }, [delay, progress]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -10]) },
      { scale: interpolate(progress.value, [0, 1], [1, 1.35]) },
    ],
    opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: "#f59e0b",
          boxShadow: "0 0 10px rgba(245, 158, 11, 0.45)",
        } as any,
        dotStyle,
      ]}
    />
  );
}

function TypingIndicator() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <BouncingDot delay={0} />
      <BouncingDot delay={140} />
      <BouncingDot delay={280} />
    </View>
  );
}

/* ─── AI 气泡（左对齐）────────────────────────────────────────────────────── */
function AIBubble({
  content,
  streamState,
  onSuggestedPress,
  showSuggestedOptions,
}: {
  content: string;
  streamState?: AgentChatStreamState | null;
  onSuggestedPress?: (text: string, optionValue?: string, interactionId?: string) => void;
  showSuggestedOptions?: boolean;
}) {
  const isStreaming = streamState?.active;
  const isError = streamState?.finalStatus === 'error';
  const hasContent = Boolean(content && content.trim());
  const hasToolTimeline = hasVisibleAgentChatToolStep(streamState);
  const isWaiting = isStreaming && !hasContent && !hasToolTimeline;
  const shouldShowContent = hasContent && !isError && !hasToolTimeline;
  const hasResponseBody = hasToolTimeline || shouldShowContent || isWaiting;
  const optionPrompt = showSuggestedOptions ? streamState?.optionPrompt : null;

  return (
    <View style={{ alignSelf: "flex-start", marginBottom: 30 }}>
      <View
        style={{
          maxWidth: 492,
          borderRadius: 25,
          backgroundColor: "#2d2520",
          paddingHorizontal: 34,
          paddingVertical: 27,
          minWidth: 100,
        }}
      >
        {streamState && hasToolTimeline ? (
          <View style={{ marginBottom: optionPrompt ? 18 : 0 }}>
            <AdminChatThinkingPanel state={streamState} fallbackContent={content} />
          </View>
        ) : null}
        
        {isWaiting ? (
          <TypingIndicator />
        ) : null}

        {shouldShowContent ? (
          <AdminChatMarkdownContent content={content} />
        ) : null}

        {optionPrompt ? (
          <View style={{ marginTop: hasResponseBody ? 20 : 0 }}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 22.6, color: "#7a6b5a" }}>{optionPrompt.question}</Text>
            </View>
            <View style={{ gap: 25, alignItems: "flex-start" }}>
              {optionPrompt.options.map(option => (
                <SuggestedButton
                  key={`${option.label}-${option.optionValue}`}
                  text={option.label}
                  onPress={() => onSuggestedPress?.(
                    option.label,
                    option.optionValue,
                    optionPrompt.interactionId,
                  )}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ─── 用户气泡（右对齐）──────────────────────────────────────────────────── */
function UserBubble({ content }: { content: string }) {
  return (
    <View style={{ alignSelf: "flex-end", marginBottom: 30 }}>
      {/* 橙色发光底层 */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 34,
          backgroundColor: "rgba(255,137,4,0.2)",
          // RN 不支持 CSS blur，用阴影近似
          boxShadow: "0px 0px 18px rgba(251,191,36,0.35)",
        }}
      />
      <View
        style={{
          maxWidth: 492,
          borderRadius: 34,
          // 橙色渐变近似：单色取中间值
          backgroundColor: "#e54500",
          paddingHorizontal: 34,
          paddingVertical: 27,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            lineHeight: 45,
            color: "rgba(255,255,255,0.95)",
            fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
          }}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}

/* ─── Feature Card ──────────────────────────────────────────────────────── */
function FeatureCard({ icon, label }: { icon: ReactNode; label: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleHoverIn = () => {
    setIsHovered(true);
    scale.value = withSpring(1.05, { damping: 15, stiffness: 300 });
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(isHovered ? 1.05 : 1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={[{ flexShrink: 0, width: 160, height: 160, borderRadius: 24 }, animatedStyle]}>
      <Pressable
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 24,
          backgroundColor: "#1e1916",
        }}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* 渐变底色 */}
        <View style={{ position: "absolute", top: 1, left: 1, right: 1, bottom: 1, backgroundColor: "#201b17", borderRadius: 23 }} />

        {/* Hover 发光效果层 */}
        {isHovered && (
          <View
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(245, 158, 11, 0.15)", borderRadius: 24 }}
          />
        )}

        {/* icon */}
        <View
          style={{
            position: "absolute",
            left: 58,
            right: 57,
            top: 48,
            height: 45,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {icon}
        </View>

        {/* label */}
        <Text
          style={{
            position: "absolute",
            bottom: 28,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 23.5,
            fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans JP', sans-serif",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── AI Creation Button ─────────────────────────────────────────────────── */
function AIButton() {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ borderRadius: 15 }, animatedStyle]}>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 75,
          paddingVertical: 7,
          paddingHorizontal: 20,
          borderRadius: 15,
          overflow: "hidden",
          backgroundColor: "#d97706",
        }}
        onHoverIn={() => { scale.value = withSpring(1.05, { damping: 15, stiffness: 300 }); }}
        onHoverOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      >
        {/* AI spark icon */}
        <View style={{ width: 35, height: 35, position: "relative", marginRight: 5 }}>
          <View style={{ position: "absolute", top: '8%', bottom: '8%', left: '4%', right: '12%' }}>
            <Image source={imgAiSpark} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
          </View>
        </View>

        <Text
          style={{
            color: "white",
            fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
            fontSize: 26,
          }}
        >
          {t('adminChat.brand')}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function WebMenuIcon() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      aria-label={t('adminChat.menu')}
      onMouseEnter={(event) => {
        const image = event.currentTarget.querySelector("img");
        if (image) {
          image.src = imgMenuActive;
        }
      }}
      onMouseLeave={(event) => {
        const image = event.currentTarget.querySelector("img");
        if (image) {
          image.src = imgMenuWhite;
        }
      }}
      style={{
        width: 56.3,
        height: 56.3,
        padding: 0,
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={imgMenuWhite}
        alt=""
        style={{ width: "80%", height: "80%", objectFit: "contain" }}
      />
    </button>
  );
}

/* ─── Suggested Button ───────────────────────────────────────────────────── */
// 左对齐推荐问题按钮，宽度与 AI 气泡对齐（Figma: w=390px in 750px grid）
function SuggestedButton({ text, onPress }: { text: string; onPress?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleHoverIn = () => {
    setIsHovered(true);
    scale.value = withSpring(1.02, { damping: 15, stiffness: 300 });
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    // alignSelf: 'flex-start' 确保按钮左对齐，宽度跟随 Figma 固定值
    <Animated.View style={[{ alignSelf: "flex-start", borderRadius: 15 }, animatedStyle]}>
      <Pressable
        style={{
          height: 80,
          width: 390,           // Figma: w=390px in 750px design grid
          paddingHorizontal: 30,
          borderRadius: 15,
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: isHovered ? "#5a5a54" : "#4a4a45",  // Figma: #4a4a45
        }}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(isHovered ? 1.02 : 1, { damping: 15, stiffness: 300 }); }}
        onPress={onPress}
      >
        <Text
          style={{
            fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
            fontSize: 24.8,
            color: "white",
          }}
        >
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Admin Sidebar ──────────────────────────────────────────────────────── */
function AdminSidebar({
  isOpen,
  onClose,
  currentSessionId,
  agentCode,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  reloadToken,
  creatingSession,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId: number | null;
  agentCode?: string | null;
  onCreateSession: () => void;
  onRenameSession: (id: number, currentTitle: string) => void;
  onDeleteSession: (id: number) => void;
  reloadToken: number;
  creatingSession: boolean;
}) {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<{id: number; title: string; summary: string; appId: string | null; agentCode: string | null}[]>([]);

  useEffect(() => {
    if (isOpen) {
      const query: Parameters<typeof tsAgentChatApi.getSessionList>[0] = {
        pageNo: 1,
        pageSize: 20,
      };
      if (agentCode) {
        query.agentCode = agentCode;
      }
      tsAgentChatApi.getSessionList(query).then(res => {
        const mapped = (res.records || []).map(r => ({
          id: r.id,
          title: r.sessionTitle || r.agentCode || t('adminChat.defaultSessionTitle'),
          summary: r.sessionSummary || t('adminChat.defaultSessionSummary'),
          appId: typeof r.appId === "string" && r.appId.trim() ? r.appId.trim() : null,
          agentCode: typeof r.agentCode === "string" && r.agentCode.trim() ? r.agentCode.trim() : null,
        }));
        setSessions(mapped);
      }).catch(console.error);
    }
  }, [agentCode, isOpen, reloadToken, t]);

  return (
    <div
      className={`absolute inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 cursor-pointer"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-[525px] bg-[#2d2520] pt-[50px] px-[20px] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mb-[20px] flex items-center justify-between gap-[14px]">
          <h2 className="text-[28px] text-white font-['Alibaba_PuHuiTi_3.0','Noto_Sans_SC',sans-serif]">
            {t('adminChat.sessionList')}
          </h2>
          <button
            onClick={onCreateSession}
            disabled={creatingSession}
            className="inline-flex items-center gap-[8px] rounded-[14px] border border-white/10 bg-[#ff8904] px-[16px] py-[11px] text-[18px] text-white active:scale-95 transition-transform disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Image source={imgFluentAdd12Filled} style={{ width: 16, height: 16 }} resizeMode="contain" />
            {creatingSession ? t('adminChat.sessionState.creating') : t('adminChat.newConversation')}
          </button>
        </div>

        <div className="flex flex-col gap-[10px] overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
          {sessions.map(s => (
            <div
              key={s.id}
              className={`flex items-center justify-between py-[20px] px-[15px] border-b border-white/5 rounded-[12px] mb-[10px] ${s.id === currentSessionId ? 'bg-[#ff8904]/10' : 'bg-transparent'}`}
            >
              <div
                className="flex-1 cursor-pointer overflow-hidden"
                onClick={() => {
                  router.replace({
                    pathname: "/pages/admin-chat",
                    params: {
                      agentSessionId: String(s.id),
                      ...(s.agentCode ? { agentCode: s.agentCode } : agentCode ? { agentCode } : {}),
                      ...(s.appId ? { appId: s.appId } : {}),
                    },
                  });
                  onClose();
                }}
              >
                <div className="text-[24px] text-white font-['Alibaba_PuHuiTi_3.0','Noto_Sans_SC',sans-serif] truncate">
                  {s.title}
                </div>
                <div className="text-[18px] text-white/50 mt-[8px] font-['Alibaba_PuHuiTi_3.0','Noto_Sans_SC',sans-serif] truncate">
                  {s.summary}
                </div>
              </div>
              <div className="flex items-center ml-[10px] shrink-0 gap-[15px]">
                <button
                  onClick={() => onRenameSession(s.id, s.title)}
                  className="text-[#4da6ff] text-[20px] p-[10px] font-['Alibaba_PuHuiTi_3.0','Noto_Sans_SC',sans-serif] active:scale-95 transition-transform bg-transparent border-none cursor-pointer"
                >
                  {t('adminChat.sessionActions.rename')}
                </button>
                <button
                  onClick={() => onDeleteSession(s.id)}
                  className="text-[#ff4444] text-[20px] p-[10px] font-['Alibaba_PuHuiTi_3.0','Noto_Sans_SC',sans-serif] active:scale-95 transition-transform bg-transparent border-none cursor-pointer"
                >
                  {t('adminChat.sessionActions.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const { t } = useTranslation();
  const defaultSessionTitle = t('adminChat.defaultSessionTitle');
  const defaultSessionSummary = t('adminChat.defaultSessionSummary');
  const defaultAiReplyText = t('adminChat.defaultReply');
  const params = useLocalSearchParams<{ agentSessionId?: string | string[]; agentCode?: string | string[]; appId?: string | string[] }>();
  const initialSessionId = parseSessionId(params.agentSessionId);
  const initialAgentCode = firstParam(params.agentCode)?.trim() || DEFAULT_AGENT_CHAT_AGENT_CODE;
  const initialAppId = firstParam(params.appId)?.trim() || DEFAULT_AGENT_CHAT_APP_ID;
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeatureExpanded, setIsFeatureExpanded] = useState(false);
  const [sessionTitle, setSessionTitle] = useState(defaultSessionTitle);
  const [sessionSummary, setSessionSummary] = useState(defaultSessionSummary);
  const [resolvedAgentCode, setResolvedAgentCode] = useState<string | null>(initialAgentCode);
  const [resolvedAppId, setResolvedAppId] = useState<string | null>(initialAppId);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(initialSessionId);
  const [pendingSession, setPendingSession] = useState<PendingSessionState | null>(() => ({
    appId: initialAppId,
    agentCode: initialAgentCode,
    sessionTitle: defaultSessionTitle,
    sessionSummary: defaultSessionSummary,
  }));
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<number | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [sidebarReloadToken, setSidebarReloadToken] = useState(0);
  const [creatingSession, setCreatingSession] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrolledToBottomRef = useRef(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    isScrolledToBottomRef.current = isCloseToBottom;
    setShowScrollToBottom(!isCloseToBottom);
  };

  const agentStream = useAgentChatStream();
  const streamAbortRef = useRef<AbortController | null>(null);
  const creatingSessionRef = useRef(false);
  const submittingInteractionIdRef = useRef<string | null>(null);
  const scale = useViewportScale();
  const plusRotate = useSharedValue(0);
  const featureExpandProgress = useSharedValue(0);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [voiceHovered, setVoiceHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const submitPressStartedRef = useRef(false);
  const greetingText = t("adminChat.greeting");

  const showExpandedLayout = isInputFocused || inputValue.trim().length > 0;
  const showSendButton = isInputFocused && inputValue.trim().length > 0;

  // 自动撑高逻辑与竖线修复
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      const scrollH = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${Math.min(scrollH, 250)}px`;
      textAreaRef.current.style.overflowY = scrollH > 250 ? 'auto' : 'hidden';
    }
  }, [inputValue]);

  const { height } = useWindowDimensions();
  const innerHeight = height / scale;

  useEffect(() => {
    const target = isFeatureExpanded ? 1 : 0;
    plusRotate.value = withTiming(target * 45, { duration: 220 });
    featureExpandProgress.value = withTiming(target, { duration: 260 });
  }, [featureExpandProgress, isFeatureExpanded, plusRotate]);

  useEffect(() => {
    let alive = true;
    const applyBlankState = () => {
      setCurrentSessionId(null);
      setSessionTitle(defaultSessionTitle);
      setSessionSummary(defaultSessionSummary);
      setMessages([createLocalGreetingMessage(greetingText)]);
      setResolvedAgentCode(initialAgentCode);
      setResolvedAppId(initialAppId);
      setPendingSession({
        appId: initialAppId,
        agentCode: initialAgentCode,
        sessionTitle: defaultSessionTitle,
        sessionSummary: defaultSessionSummary,
      });
    };

    const applySessionSnapshot = (sessionId: number, detail: TsAgentChatSession | undefined, pageRecords: TsAgentChatMessage[] | undefined) => {
      const nextAgentCode = typeof detail?.agentCode === "string" && detail.agentCode.trim()
        ? detail.agentCode.trim()
        : null;
      const nextAppId = typeof detail?.appId === "string" && detail.appId.trim()
        ? detail.appId.trim()
        : null;
      setCurrentSessionId(sessionId);
      setSessionTitle(
        typeof detail?.sessionTitle === "string" && detail.sessionTitle.trim()
          ? detail.sessionTitle.trim()
          : nextAgentCode || defaultSessionTitle,
      );
      setSessionSummary(
        typeof detail?.sessionSummary === "string" && detail.sessionSummary.trim()
          ? detail.sessionSummary.trim()
          : defaultSessionSummary,
      );
      setResolvedAgentCode(nextAgentCode || initialAgentCode);
      setResolvedAppId(nextAppId || initialAppId);
      setPendingSession(null);
      writeLastAgentSessionId(sessionId);
      const historyMessages = toAgentChatMessages(pageRecords).map((item) => ({
        ...item,
        loading: false,
        status: item.role === "ai" ? "success" : "local",
        streamState: null,
      }));
      setMessages(
        [createLocalGreetingMessage(greetingText), ...historyMessages],
      );
    };

    const loadSessionSnapshot = async (sessionId: number) => {
      const [detail, page] = await Promise.all([
        tsAgentChatApi.getSessionDetail(sessionId),
        tsAgentChatApi.getMessageList({
          sessionId,
          pageNo: 1,
          pageSize: 100,
        }),
      ]);
      if (!alive) {
        return;
      }
      applySessionSnapshot(sessionId, detail, page?.records);
    };

    const resolveLatestSession = async () => {
      const query: Parameters<typeof tsAgentChatApi.getSessionList>[0] = {
        pageNo: 1,
        pageSize: 1,
      };
      if (initialAgentCode) {
        query.agentCode = initialAgentCode;
      }
      const sessionPage = await tsAgentChatApi.getSessionList(query);
      if (!alive) {
        return;
      }
      const latestSession = sessionPage?.records?.[0];
      if (latestSession?.id && Number.isFinite(latestSession.id)) {
        await loadSessionSnapshot(latestSession.id);
        return;
      }
      applyBlankState();
    };

    const restorePreferredSession = async () => {
      const storedSessionId = readLastAgentSessionId();
      const candidates = initialSessionId ? [initialSessionId, storedSessionId] : [storedSessionId];
      for (const candidate of candidates) {
        if (!candidate) {
          continue;
        }
        try {
          await loadSessionSnapshot(candidate);
          writeLastAgentSessionId(candidate);
          return;
        } catch {
          continue;
        }
      }

      try {
        await resolveLatestSession();
      } catch (error) {
        if (!alive) {
          return;
        }
        setCurrentSessionId(null);
        setSessionTitle(defaultSessionTitle);
        setSessionSummary(defaultSessionSummary);
        setPendingSession({
          appId: initialAppId,
          agentCode: initialAgentCode,
          sessionTitle: defaultSessionTitle,
          sessionSummary: defaultSessionSummary,
        });
        setMessages([{
          id: Date.now(),
          role: "ai",
          content: resolveApiErrorMessage(error, t('adminChat.errors.loadSession')),
          loading: false,
          status: "error",
          streamState: null,
        }]);
      }
    };

    void restorePreferredSession();
    return () => {
      alive = false;
    };
  }, [
    defaultSessionSummary,
    defaultSessionTitle,
    greetingText,
    initialAgentCode,
    initialAppId,
    initialSessionId,
    t,
  ]);

  const appendMessage = (next: ChatMessage) => {
    setMessages(prev => [...prev, next]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const createAndActivateSession = async (options?: {
    clearMessages?: boolean;
    clearInput?: boolean;
    closeSidebar?: boolean;
    useDefaultDraft?: boolean;
  }) => {
    if (creatingSessionRef.current) {
      return null;
    }
    creatingSessionRef.current = true;
    setCreatingSession(true);
    try {
      const draftSession = options?.useDefaultDraft
        ? {
            appId: (resolvedAppId || initialAppId || DEFAULT_AGENT_CHAT_APP_ID).trim(),
            agentCode: (resolvedAgentCode || initialAgentCode || DEFAULT_AGENT_CHAT_AGENT_CODE).trim(),
            sessionTitle: defaultSessionTitle,
            sessionSummary: defaultSessionSummary,
          }
        : pendingSession ?? {
            appId: (resolvedAppId || initialAppId || DEFAULT_AGENT_CHAT_APP_ID).trim(),
            agentCode: (resolvedAgentCode || initialAgentCode || DEFAULT_AGENT_CHAT_AGENT_CODE).trim(),
            sessionTitle: sessionTitle.trim() || defaultSessionTitle,
            sessionSummary: sessionSummary.trim() || defaultSessionSummary,
          };
      const nextAppId = draftSession.appId.trim();
      const nextAgentCode = draftSession.agentCode.trim();
      if (!nextAppId || !nextAgentCode) {
        throw new Error(t('adminChat.errors.createSession'));
      }

      const created = await tsAgentChatApi.createSession({
        appId: nextAppId,
        agentCode: nextAgentCode,
        sessionTitle: draftSession.sessionTitle.trim() || defaultSessionTitle,
        sessionSummary: draftSession.sessionSummary.trim() || defaultSessionSummary,
      });
      if (!created?.id || !Number.isFinite(created.id)) {
        throw new Error(t('adminChat.errors.createSession'));
      }

      const nextSessionId = created.id;
      setCurrentSessionId(nextSessionId);
      setResolvedAppId(typeof created.appId === "string" && created.appId.trim() ? created.appId.trim() : nextAppId);
      setResolvedAgentCode(typeof created.agentCode === "string" && created.agentCode.trim() ? created.agentCode.trim() : nextAgentCode);
      setSessionTitle(typeof created.sessionTitle === "string" && created.sessionTitle.trim() ? created.sessionTitle.trim() : defaultSessionTitle);
      setSessionSummary(typeof created.sessionSummary === "string" && created.sessionSummary.trim() ? created.sessionSummary.trim() : defaultSessionSummary);
      setPendingSession(null);
      if (options?.clearMessages) {
        setMessages([createLocalGreetingMessage(greetingText)]);
      }
      if (options?.clearInput) {
        setInputValue("");
      }
      if (options?.closeSidebar) {
        setIsSidebarOpen(false);
      }
      writeLastAgentSessionId(nextSessionId);
      setSidebarReloadToken((prev) => prev + 1);
      return nextSessionId;
    } catch (error) {
      appendMessage({
        id: Date.now(),
        role: "ai",
        content: resolveApiErrorMessage(error, t('adminChat.errors.createSession')),
        loading: false,
        status: "error",
        streamState: null,
      });
      return null;
    } finally {
      creatingSessionRef.current = false;
      setCreatingSession(false);
    }
  };

  const updateMessageById = useCallback(
    (messageId: number, updater: (item: ChatMessage) => ChatMessage) => {
      setMessages((prev) => prev.map((item) => (item.id === messageId ? updater(item) : item)));
    },
    [],
  );

  const syncStreamMessage = (messageId: number, nextState: AgentChatStreamState) => {
    if (!agentStream.isActiveTurn(messageId)) {
      return;
    }

    updateMessageById(messageId, (item) => ({
      ...item,
      content: nextState.finalText
        || (nextState.currentAgentScope === 'subagent' ? '' : item.content),
      streamState: nextState,
      status: nextState.active
        ? "running"
        : nextState.finalStatus === "error"
          ? "error"
          : "success",
      loading: nextState.active,
    } as ChatMessage));
  };

  const refreshSessionTitleIfNeeded = (sessionId: number, nextTitle: string) => {
    if (currentSessionId === sessionId) {
      setSessionTitle(nextTitle);
    }
  };

  const handleRenameSession = (id: number, currentTitle: string) => {
    setRenameTargetId(id);
    setRenameDraft(currentTitle);
    setRenameModalVisible(true);
  };

  const confirmRenameSession = async () => {
    if (renameTargetId == null) {
      setRenameModalVisible(false);
      return;
    }
    const nextTitle = renameDraft.trim();
    if (!nextTitle) {
      appendMessage({ id: Date.now(), role: "ai", content: t('adminChat.rename.titleRequired') });
      return;
    }
    try {
      const updated = await tsAgentChatApi.updateSession({
        id: renameTargetId,
        sessionTitle: nextTitle,
      });
      refreshSessionTitleIfNeeded(renameTargetId, updated?.sessionTitle?.trim() || nextTitle);
      setRenameModalVisible(false);
      setRenameTargetId(null);
      setSidebarReloadToken(prev => prev + 1);
    } catch (error) {
      appendMessage({
        id: Date.now(),
        role: "ai",
        content: resolveApiErrorMessage(error, t('adminChat.errors.renameSession')),
      });
    }
  };

  const handleDeleteSession = async (id: number) => {
    const confirmDelete = typeof globalThis.confirm === "function"
      ? globalThis.confirm(t('adminChat.deleteConfirm'))
      : true;
    if (!confirmDelete) {
      return;
    }
    try {
      await tsAgentChatApi.deleteSession(id);
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setSessionTitle(defaultSessionTitle);
        setSessionSummary(defaultSessionSummary);
        setMessages([createLocalGreetingMessage(greetingText)]);
        setPendingSession({
          appId: initialAppId,
          agentCode: initialAgentCode,
          sessionTitle: defaultSessionTitle,
          sessionSummary: defaultSessionSummary,
        });
        writeLastAgentSessionId(null);
      }
      setSidebarReloadToken(prev => prev + 1);
      setIsSidebarOpen(false);
    } catch (error) {
      appendMessage({
        id: Date.now(),
        role: "ai",
        content: resolveApiErrorMessage(error, t('adminChat.errors.deleteSession')),
      });
    }
  };

  const sendMessage = async (rawText: string, optionValue?: string, interactionId?: string) => {
    const text = rawText.trim();
    if (!text || sending) {
      return;
    }
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await createAndActivateSession();
      if (!sessionId) {
        return;
      }
    }

    const userMessageId = Date.now();
    const aiId = userMessageId + 1;
    appendMessage({ id: userMessageId, role: "user", content: text });
    agentStream.startTurn(aiId);
    appendMessage({
      id: aiId,
      role: "ai",
      content: "",
      loading: true,
      status: "loading",
      streamState: agentStream.stateRef.current,
    });
    setInputValue("");
    setSending(true);
    streamAbortRef.current?.abort();
    streamAbortRef.current = new AbortController();
    try {
      const streamPayload = {
        sessionId,
        userInput: text,
        interactionId,
        optionValue,
        historyCount: 12,
      };

      let streamedAny = false;

      try {
        const stream = await tsAgentChatApi.createAiReplyStream(streamPayload, streamAbortRef.current.signal);
        for await (const chunk of iterateSseEvents(stream)) {
          const eventName = typeof chunk.event === "string" ? chunk.event.trim() : "";
          if (!eventName) {
            continue;
          }
          streamedAny = true;
          const dataText = typeof chunk.data === "string" ? chunk.data : "";
          const nextState = agentStream.applyEvent(aiId, eventName, dataText);
          if (nextState) {
            syncStreamMessage(aiId, nextState);
          }
        }
      } catch (streamError) {
        const aborted =
          streamError instanceof DOMException && streamError.name === "AbortError"
          || (typeof streamError === "object" && streamError !== null && "name" in streamError && (streamError as { name?: string }).name === "AbortError");

        if (aborted) {
          agentStream.stopTurn(aiId);
          updateMessageById(aiId, (item) => ({
            ...item,
            loading: false,
            status: "stopped",
          }));
          return;
        }

        if (!streamedAny) {
          agentStream.stopTurn(aiId);
          const reply = await tsAgentChatApi.createAiReply({
            sessionId,
            userInput: text,
            interactionId,
            optionValue,
            historyCount: 12,
          });
          const aiText = typeof reply?.contentText === "string" && reply.contentText.trim()
            ? reply.contentText.trim()
            : defaultAiReplyText;
          updateMessageById(aiId, (item) => ({
            ...item,
            content: aiText,
            loading: false,
            status: "success",
            streamState: null,
          }));
          return;
        }

        const errMsg = resolveApiErrorMessage(streamError, t('adminChat.errors.sendMessage'));
        const failedState = agentStream.markError(aiId, errMsg);
        if (!failedState) {
          return;
        }
        syncStreamMessage(aiId, failedState);
        return;
      }

      const completedState = agentStream.completeTurn(aiId);
      if (!completedState) {
        return;
      }
      syncStreamMessage(aiId, completedState);
    } catch (error) {
      const aborted =
        error instanceof DOMException && error.name === "AbortError"
        || (typeof error === "object" && error !== null && "name" in error && (error as { name?: string }).name === "AbortError");
      if (aborted) {
        updateMessageById(aiId, (item) => ({
          ...item,
          loading: false,
          status: "stopped",
        }));
        return;
      }

      const errMsg = resolveApiErrorMessage(error, t('adminChat.errors.sendMessage'));
      updateMessageById(aiId, (item) => ({
        ...item,
        content: errMsg,
        loading: false,
        status: "error",
        streamState: null,
      }));
    } finally {
      setSending(false);
      streamAbortRef.current = null;
      agentStream.stopTurn(aiId);
    }
  };

  /** 发送消息（用户） */
  const handleSend = () => {
    textAreaRef.current?.blur();
    setIsInputFocused(false);
    setIsFeatureExpanded(false);
    void sendMessage(inputValue);
  };

  /** 点击推荐问题快速发送 */
  const handleSuggestedMessage = (text: string, optionValue?: string, interactionId?: string) => {
    if (interactionId) {
      if (submittingInteractionIdRef.current === interactionId) {
        return;
      }
      submittingInteractionIdRef.current = interactionId;
      setMessages(prev => prev.map((message) => {
        if (message.streamState?.optionPrompt?.interactionId !== interactionId) {
          return message;
        }
        return {
          ...message,
          streamState: {
            ...message.streamState,
            optionPrompt: null,
          },
        };
      }));
    }
    void sendMessage(text, optionValue, interactionId).finally(() => {
      if (submittingInteractionIdRef.current === interactionId) {
        submittingInteractionIdRef.current = null;
      }
    });
  };

  const toggleFeatureExpanded = () => {
    setIsFeatureExpanded(prev => !prev);
  };

  const plusIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${plusRotate.value}deg` }],
  }));

  const featureCardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: featureExpandProgress.value,
    height: interpolate(featureExpandProgress.value, [0, 1], [0, FEATURE_CARDS_EXPANDED_HEIGHT]),
    transform: [{ translateY: interpolate(featureExpandProgress.value, [0, 1], [12, 0]) }],
  }));

  const voiceIconEl = (
    <Pressable
      style={{ width: 50, height: 50 }}
      onHoverIn={() => setVoiceHovered(true)}
      onHoverOut={() => setVoiceHovered(false)}
    >
      <View style={{ width: "100%", height: "100%", padding: 4 }}>
        <Image source={voiceHovered ? imgVoiceActive : imgVoiceWhite} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
      </View>
    </Pressable>
  );

  const plusIconEl = (
    <View style={{ flexDirection: "row", alignItems: "center", height: 50 }}>
      <Pressable
        style={{
          width: 45.7,
          height: 47.2,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          opacity: showSendButton && sending ? 0.45 : 1,
        }}
        disabled={showSendButton && sending}
        onPressIn={() => {
          submitPressStartedRef.current = showSendButton;
          if (showSendButton) {
            handleSend();
          }
        }}
        onPress={() => {
          if (submitPressStartedRef.current) {
            submitPressStartedRef.current = false;
            return;
          }
          toggleFeatureExpanded();
        }}
      >
        {showSendButton ? (
          <Image
            source={imgSubmitMessage}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        ) : (
          <Animated.View style={plusIconAnimatedStyle}>
            <Image
              source={imgSendWhite}
              style={{ width: 42, height: 42 }}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#1c1613", overflow: "hidden" }}>
      {/* 内层：750px 宽，等比缩放，transform-origin 左上角 */}
      <View
        style={{
          width: DESIGN_WIDTH,
          height: innerHeight,
          transform: [
            { scale: scale },
            { translateX: (DESIGN_WIDTH * (scale - 1)) / (2 * scale) },
            { translateY: (innerHeight * (scale - 1)) / (2 * scale) }
          ],
          left: 0,
          top: 0,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <View
          style={{
            height: 170,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 38,
            backgroundColor: "rgba(0,0,0,0.4)",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.05)",
          }}
        >
          {/* left logo */}
          <View style={{ width: 38.3, height: 19.2 }}>
            <Image source={imgImage} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          </View>

          {/* center title */}
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ color: "white", fontSize: 28.2, marginRight: 8 }}>{sessionTitle}</Text>
              <View style={{ width: 10, height: 21.4 }}>
                <Image source={imgImage1} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              </View>
            </View>
            <Text style={{ color: "#9a8b7a", fontSize: 19.2 }}>{sessionSummary}</Text>
          </View>

          {/* right side icons container */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            {/* right menu icon (volume) */}
            <WebMenuIcon />

            {/* sidebar toggle icon (hamburger) */}
            <Pressable
              onPress={() => setIsSidebarOpen(true)}
              style={{ width: 56.3, height: 56.3, justifyContent: "center", alignItems: "center" }}
              onHoverIn={() => setSidebarHovered(true)}
              onHoverOut={() => setSidebarHovered(false)}
            >
              <View style={{ width: "70%", height: "70%", opacity: sidebarHovered ? 0.7 : 1 }}>
                <Image source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGxpbmUgeDE9IjMiIHkxPSIxMiIgeDI9IjIxIiB5Mj0iMTIiPjwvbGluZT48bGluZSB4MT0iMyIgeTE9IjYiIHgyPSIyMSIgeTI9IjYiPjwvbGluZT48bGluZSB4MT0iMyIgeTE9IjE4IiB4Mj0iMjEiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg==' }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* CHAT AREA ─────────────────────────────────────────────────────── */}
        <View style={{ flex: 1, position: 'relative' }}>
          {isFeatureExpanded && (
            <Pressable
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
              onPress={() => setIsFeatureExpanded(false)}
            />
          )}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 36, paddingHorizontal: 26.5, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (isScrolledToBottomRef.current) {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
          {/* 对话气泡列表 */}
          {messages.map((msg, index) =>
            msg.role === "ai"
              ? (
                  <AIBubble
                    key={msg.id}
                    content={msg.content}
                    streamState={msg.streamState}
                    onSuggestedPress={handleSuggestedMessage}
                    showSuggestedOptions={index === messages.length - 1}
                  />
                )
              : <UserBubble key={msg.id} content={msg.content} />
          )}
          </ScrollView>
          {showScrollToBottom && (
            <Pressable
              onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              style={{
                position: 'absolute',
                right: 26.5,
                bottom: 15,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                zIndex: 50,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </Pressable>
          )}
        </View>

        {/* INPUT BAR */}
        <View style={{ paddingTop: 24, paddingLeft: 26.5, paddingRight: 20.5 }}>
          {/* <View style={{ flexDirection: "row", gap: 15, marginBottom: 15 }}>
            <AIButton />
            <AIButton />
          </View> */}
          <div
            style={{
              minHeight: 100,
              display: "grid",
              gridTemplateColumns: "50px minmax(0, 1fr) 50px",
              gridTemplateRows: showExpandedLayout ? "minmax(50px, auto) 50px" : "50px",
              columnGap: showExpandedLayout ? 0 : 20,
              rowGap: showExpandedLayout ? 15 : 0,
              alignItems: "center",
              padding: "25px",
              backgroundColor: "rgba(45, 37, 32, 0.8)",
              borderRadius: 30,
              border: "2px solid rgba(251, 191, 36, 0.2)",
              boxSizing: "border-box",
              transition: "grid-template-rows 220ms cubic-bezier(0.22, 1, 0.36, 1), row-gap 220ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              style={{
                gridColumn: 1,
                gridRow: showExpandedLayout ? 2 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {voiceIconEl}
            </div>

            <textarea
              ref={textAreaRef}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                setIsInputFocused(false);
                if (!inputValue.trim()) {
                  setInputValue("");
                }
              }}
              placeholder={t('adminChat.inputPlaceholder')}
              maxLength={300}
              rows={1}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              style={{
                gridColumn: showExpandedLayout ? "1 / -1" : 2,
                gridRow: 1,
                alignSelf: "stretch",
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
                fontSize: 30,
                lineHeight: "50px",
                color: "white",
                outline: "none",
                border: "none",
                padding: 0,
                margin: 0,
                backgroundColor: "transparent",
                resize: "none",
                minHeight: 50,
                maxHeight: 250,
                overflowY: "hidden",
              }}
            />

            <div
              style={{
                gridColumn: 3,
                gridRow: showExpandedLayout ? 2 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {plusIconEl}
            </div>
          </div>
        </View>

        {/* FEATURE CARDS */}
        <Animated.View
          style={{
            overflow: "hidden",
          }}
        >
          <Animated.View style={featureCardsAnimatedStyle}>
            <View
              style={{
                paddingTop: 31,
                paddingLeft: 17,
                paddingRight: 20.3,
                paddingBottom: 60,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <FeatureCard
                label={t('adminChat.features.camera')}
                icon={
                  <Image source={imgFeatureCamera} style={{ width: 37.5, height: 33.75 }} resizeMode="contain" />
                }
              />

              <FeatureCard
                label={t('adminChat.features.image')}
                icon={
                  <Image source={imgFeatureImage} style={{ width: 42.3, height: 42.3 }} resizeMode="contain" />
                }
              />

              <FeatureCard
                label={t('adminChat.features.file')}
                icon={
                  <Image source={imgFeatureFile} style={{ width: 38.8, height: 38.8 }} resizeMode="contain" />
                }
              />

              <FeatureCard
                label={t('adminChat.features.call')}
                icon={
                  <Image source={imgFeatureCall} style={{ width: 48, height: 48 }} resizeMode="contain" />
                }
              />
            </View>
          </Animated.View>
        </Animated.View>

        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentSessionId={currentSessionId}
          agentCode={resolvedAgentCode || initialAgentCode}
          onCreateSession={() => void createAndActivateSession({ clearMessages: true, clearInput: true, closeSidebar: true, useDefaultDraft: true })}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          reloadToken={sidebarReloadToken}
          creatingSession={creatingSession}
        />

        <Modal
          visible={renameModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => { setRenameModalVisible(false); setRenameTargetId(null); }}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center", padding: 24 }}>
            <View style={{ width: "100%", maxWidth: 520, borderRadius: 20, backgroundColor: "#2d2520", padding: 20 }}>
              <Text style={{ color: "#fff", fontSize: 24, marginBottom: 12 }}>
                {t('adminChat.rename.title')}
              </Text>
              <TextInput
                value={renameDraft}
                onChangeText={setRenameDraft}
                placeholder={t('adminChat.rename.placeholder')}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={{
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.12)",
                  backgroundColor: "#1f1a17",
                  color: "#fff",
                  fontSize: 18,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  outlineStyle: "none",
                } as any}
              />
              <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
                <Pressable onPress={() => { setRenameModalVisible(false); setRenameTargetId(null); }} style={{ paddingHorizontal: 18, paddingVertical: 12 }}>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
                    {t('adminChat.cancel')}
                  </Text>
                </Pressable>
                <Pressable onPress={() => void confirmRenameSession()} style={{ paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: "#ff8904" }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    {t('adminChat.confirmAction')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
