import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, TextInput, useWindowDimensions, Image, ScrollView } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import type { TsChatMessage } from "@/lib/api";
import { tsChatApi } from "@/lib/api";

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
const imgFeatureCamera = resolveAsset(require("@/assets/images/admin-chat/feature_camera.svg"));
const imgFeatureImage = resolveAsset(require("@/assets/images/admin-chat/feature_image.svg"));
const imgFeatureFile = resolveAsset(require("@/assets/images/admin-chat/feature_file.svg"));
const imgFeatureCall = resolveAsset(require("@/assets/images/admin-chat/feature_call.svg"));

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
  id: number;
  role: ChatRole;
  content: string;
};

// ─── Mock 对话数据 ─────────────────────────────────────────────────────────────
const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, role: "user", content: "如何快速清空当前对话记录？" },
  {
    id: 2,
    role: "ai",
    content: "您可以点击右上角菜单，选择\"清空对话\"即可快速清空当前的对话记录。",
  },
  { id: 3, role: "user", content: "明白了，还有其他功能吗？" },
  {
    id: 4,
    role: "ai",
    content: "当然！您还可以使用AI创作功能生成图片、文本等内容，也可以通过相机、图片等功能分享素材给我。",
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

function toChatMessages(records: TsChatMessage[] | undefined) {
  const source = Array.isArray(records) ? [...records].reverse() : [];
  return source.map((item, index) => ({
    id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : index + 1,
    role: item.senderType === "user" ? "user" as const : "ai" as const,
    content: typeof item.contentText === "string" && item.contentText.trim()
      ? item.contentText.trim()
      : " ",
  }));
}

/* ─── AI 气泡（左对齐）────────────────────────────────────────────────────── */
function AIBubble({ content }: { content: string }) {
  return (
    <View style={{ alignSelf: "flex-start", marginBottom: 30 }}>
      <View
        style={{
          maxWidth: 492,
          borderRadius: 25,
          backgroundColor: "#2d2520",
          paddingHorizontal: 34,
          paddingVertical: 27,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            lineHeight: 45,
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
          }}
        >
          {content}
        </Text>
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
          shadowColor: "#fbbf24",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 18,
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
function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
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
          AI创作
        </Text>
      </Pressable>
    </Animated.View>
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

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const scrollViewRef = useRef<ScrollView>(null);
  const scale = useViewportScale();
  const sessionId = parseSessionId(params.sessionId);

  const { height } = useWindowDimensions();
  const innerHeight = height / scale;

  useEffect(() => {
    let alive = true;
    if (!sessionId) {
      return () => {
        alive = false;
      };
    }
    tsChatApi.getMessageList({
      sessionId,
      pageNo: 1,
      pageSize: 100,
    }).then((page) => {
      if (!alive) {
        return;
      }
      const mapped = toChatMessages(page?.records);
      if (mapped.length > 0) {
        setMessages(mapped);
      }
    }).catch(() => {
      // 保留当前页面默认消息，避免布局抖动
    });
    return () => {
      alive = false;
    };
  }, [sessionId]);

  /** 发送消息（用户） */
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // 模拟 AI 回复
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: "我收到了您的消息，正在为您处理...",
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 600);
  };

  /** 点击推荐问题快速发送 */
  const handleSuggestedMessage = (text: string) => {
    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: "您可以点击右上角菜单，选择\"清空对话\"即可快速清空当前的对话记录。",
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 600);
  };

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
              <Text style={{ color: "white", fontSize: 28.2, marginRight: 8 }}>系统小探</Text>
              <View style={{ width: 10, height: 21.4 }}>
                <Image source={imgImage1} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              </View>
            </View>
            <Text style={{ color: "#9a8b7a", fontSize: 19.2 }}>内容由AI生成</Text>
          </View>

          {/* right menu icon */}
          <Pressable style={{ width: 56.3, height: 56.3, justifyContent: "center", alignItems: "center" }}>
            {({ hovered }) => (
              <View style={{ width: "80%", height: "80%" }}>
                <Image source={hovered ? imgMenuActive : imgMenuWhite} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
              </View>
            )}
          </Pressable>
        </View>

        {/* CHAT AREA ─────────────────────────────────────────────────────── */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 36, paddingHorizontal: 26.5, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* 对话气泡列表 */}
          {messages.map(msg =>
            msg.role === "ai"
              ? <AIBubble key={msg.id} content={msg.content} />
              : <UserBubble key={msg.id} content={msg.content} />
          )}

          {/* 聊聊新话题 + 推荐问题：紧跟在最后一条 AI 气泡下方，左对齐 */}
          <View style={{ alignItems: "center", marginTop: 10, marginBottom: 20 }}>
            <Text style={{ fontSize: 22.6, color: "#7a6b5a" }}>聊聊新话题</Text>
          </View>
          <View style={{ gap: 25, alignItems: "flex-start" }}>
            <SuggestedButton text="如何快速清空当前对话记录？" onPress={() => handleSuggestedMessage("如何快速清空当前对话记录？")} />
            <SuggestedButton text="有哪些AI创作功能？" onPress={() => handleSuggestedMessage("有哪些AI创作功能？")} />
            <SuggestedButton text="怎么上传图片素材？" onPress={() => handleSuggestedMessage("怎么上传图片素材？")} />
          </View>
        </ScrollView>

        {/* INPUT BAR */}
        <View style={{ paddingTop: 24, paddingLeft: 26.5, paddingRight: 20.5 }}>
          <View style={{ flexDirection: "row", gap: 15, marginBottom: 15 }}>
            <AIButton />
            <AIButton />
          </View>
          <View
            style={{
              height: 100,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 25,
              backgroundColor: "rgba(45, 37, 32, 0.8)",
              borderRadius: 30,
              borderWidth: 2,
              borderColor: "rgba(251, 191, 36, 0.2)",
            }}
          >
            {/* voice icon */}
            <Pressable style={{ width: 50, height: 50, marginRight: 20 }}>
              {({ hovered }) => (
                <View style={{ width: "100%", height: "100%", padding: 4 }}>
                  <Image source={hovered ? imgVoiceActive : imgVoiceWhite} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
              )}
            </Pressable>

            {/* text input */}
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSend}
              placeholder="发消息或按住说话..."
              placeholderTextColor="#5a4a3a"
              returnKeyType="send"
              style={{
                flex: 1,
                fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
                fontSize: 30,
                color: "white",
                outlineStyle: 'none' // Remove focus outline on web
              }}
            />

            {/* send icon */}
            <Pressable style={{ width: 45.7, height: 47.2, marginLeft: 15 }} onPress={handleSend}>
              {({ hovered }) => (
                <View style={{ width: "100%", height: "100%", padding: 4 }}>
                  <Image source={hovered ? imgSendActive : imgSendWhite} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* FEATURE CARDS */}
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
            label="相机"
            icon={
              <Image source={imgFeatureCamera} style={{ width: 37.5, height: 33.75 }} resizeMode="contain" />
            }
          />

          <FeatureCard
            label="图片"
            icon={
              <Image source={imgFeatureImage} style={{ width: 42.3, height: 42.3 }} resizeMode="contain" />
            }
          />

          <FeatureCard
            label="文件"
            icon={
              <Image source={imgFeatureFile} style={{ width: 38.8, height: 38.8 }} resizeMode="contain" />
            }
          />

          <FeatureCard
            label="通话"
            icon={
              <Image source={imgFeatureCall} style={{ width: 48, height: 48 }} resizeMode="contain" />
            }
          />
        </View>
      </View>
    </View>
  );
}
