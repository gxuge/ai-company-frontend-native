import { useState } from "react";
import { View, Text, Pressable, TextInput, useWindowDimensions, Image, Platform } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import svgPaths from "@/assets/images/admin-chat/svg-stdnzgn42m";

const imgImage = require("@/assets/images/admin-chat/ecb7a353c6950598ee6e686ed5e5d05068e56c7f.png");
const imgImage1 = require("@/assets/images/admin-chat/a5ca4172116f94768b6109da1c02910fc74f649b.png");

/** 原始设计稿宽度（2× Figma 导出） */
const DESIGN_WIDTH = 750;

/** 根据当前视口宽度计算等比缩放因子 */
function useViewportScale() {
  const { width } = useWindowDimensions();
  // 在 Web 端为了防止滚动条影响，取最大值，但不超过 1 避免过度拉伸
  return width / DESIGN_WIDTH;
}

/* ─── Feature Card ──────────────────────────────────────────────────────── */
function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      style={{
        flexShrink: 0,
        width: 160,
        height: 160,
        overflow: "hidden",
        borderRadius: 24,
      }}
      className="bg-[#1e1916] active:scale-95 hover:scale-105 transition-transform duration-200 ease-out"
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {/* 渐变底色（通过多个叠加层实现渐变色和阴影效果） */}
      <View style={{ position: "absolute", top: 1, left: 1, right: 1, bottom: 1, backgroundColor: "#201b17", borderRadius: 23 }} />

      {/* Hover 发光效果层（此处使用原生背景色模拟，因为 React Native 的渐变需要额外包，我们用半透明色模拟） */}
      {isHovered && Platform.OS === 'web' && (
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
  );
}

/* ─── AI Creation Button ─────────────────────────────────────────────────── */
function AIButton() {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 171,
        height: 75,
        paddingVertical: 7,
        paddingHorizontal: 28,
        borderRadius: 15,
        overflow: "hidden"
      }}
      className="bg-[#d97706] active:scale-95 hover:scale-105 transition-transform group"
    >
      {/* 简单的背景色替代 Native 中复杂的渐变结构，若 Web 使用 Nativewind v4，Tailwind class 依旧生效 */}
      
      {/* AI spark icon */}
      <View style={{ width: 35, height: 35, position: "relative", marginRight: 5 }}>
        <View style={{ position: "absolute", top: '8%', bottom: '8%', left: '4%', right: '12%' }}>
          <Svg style={{ width: "100%", height: "100%" }} viewBox="0 0 29.0306 29.029">
            <Path d={svgPaths.p1ad98500} fill="white" />
          </Svg>
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
  );
}

/* ─── Suggested Button ───────────────────────────────────────────────────── */
function SuggestedButton({ text }: { text: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Pressable
      style={{
        height: 80,
        width: "100%",
        paddingHorizontal: 30,
        borderRadius: 15,
        justifyContent: "center",
        overflow: "hidden"
      }}
      className="bg-[#302823] active:scale-95 hover:scale-[1.02] transition-transform"
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {isHovered && Platform.OS === 'web' && (
        <View style={{ position: "absolute", top: 1, left: 1, right: 1, bottom: 1, borderColor: "rgba(251, 191, 36, 0.6)", borderWidth: 1, borderRadius: 14 }} />
      )}

      <Text
        style={{
          fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
          fontSize: 24.8,
          color: isHovered ? "white" : "rgba(255,255,255,0.8)",
        }}
        className="transition-colors"
      >
        {text}
      </Text>
    </Pressable>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [inputValue, setInputValue] = useState("");
  const scale = useViewportScale();

  const { height } = useWindowDimensions();
  const innerHeight = height / scale;

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
                <Svg viewBox="0 0 49 37" width="100%" height="100%">
                  <G stroke={hovered ? "#fbbf24" : "rgba(255,255,255,0.6)"}>
                    <Path d={svgPaths.p104f6100} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
                    <Path d={svgPaths.p320ddf80} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
                    <Path d={svgPaths.p32073300} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
                  </G>
                </Svg>
              </View>
            )}
          </Pressable>
        </View>

        {/* CHAT AREA */}
        <View style={{ flex: 1, justifyContent: "center", overflow: "hidden", paddingTop: 40, paddingHorizontal: 26.5 }}>
          {/* 聊聊新话题 */}
          <View style={{ alignItems: "center", marginBottom: 30 }}>
            <Text style={{ fontSize: 22.6, color: "#7a6b5a" }}>聊聊新话题</Text>
          </View>

          <View style={{ gap: 25 }}>
            <SuggestedButton text="如何快速清空当前对话记录？" />
            <SuggestedButton text="如何快速清空当前对话记录？" />
            <SuggestedButton text="如何快速清空当前对话记录？" />
          </View>

          <View style={{ flexDirection: "row", gap: 15, marginTop: 164, justifyContent: "center" }}>
            <AIButton />
            <AIButton />
          </View>
        </View>

        {/* INPUT BAR */}
        <View style={{ paddingTop: 24, paddingLeft: 26.5, paddingRight: 20.5 }}>
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
                  <Svg viewBox="0 0 45.8 45.8" width="100%" height="100%">
                    <G stroke={hovered ? "#fbbf24" : "rgba(255,255,255,0.6)"}>
                      <Path d={svgPaths.p1d182000} strokeLinejoin="round" strokeWidth="4.17" />
                      <Path d={svgPaths.p1a121b80} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.17" />
                    </G>
                    <Path d={svgPaths.p3f782180} fill={hovered ? "#fbbf24" : "rgba(255,255,255,0.6)"} />
                  </Svg>
                </View>
              )}
            </Pressable>

            {/* text input */}
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="发消息或按住说话..."
              placeholderTextColor="#5a4a3a"
              style={{
                flex: 1,
                fontFamily: "'Alibaba PuHuiTi 3.0', 'Noto Sans SC', sans-serif",
                fontSize: 30,
                color: "white",
                outlineStyle: 'none' // Remove focus outline on web
              }}
            />

            {/* send icon */}
            <Pressable style={{ width: 45.7, height: 47.2, marginLeft: 15 }}>
              {({ hovered }) => (
                <View style={{ width: "100%", height: "100%", padding: 4 }}>
                  <Svg viewBox="0 0 46.7 48.2" width="100%" height="100%">
                    <G fill={hovered ? "#fbbf24" : "rgba(255,255,255,0.6)"} stroke={hovered ? "#fbbf24" : "rgba(255,255,255,0.6)"}>
                      <Path d={svgPaths.p16246900} />
                      <Path d={svgPaths.pd31ba70} />
                      <Path d={svgPaths.pddf3000} />
                    </G>
                  </Svg>
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
              <Svg style={{ width: 37.5, height: 33.75 }} viewBox="0 0 37.5 33.75">
                <Path d={svgPaths.p2c2b5a71} fill="rgba(255,255,255,0.9)" />
              </Svg>
            }
          />

          <FeatureCard
            label="图片"
            icon={
              <Svg style={{ width: 42.3, height: 42.3 }} viewBox="0 0 42.3529 42.3529">
                <Path d={svgPaths.p3fc05300} fill="rgba(255,255,255,0.9)" />
              </Svg>
            }
          />

          <FeatureCard
            label="文件"
            icon={
              <Svg style={{ width: 38.8, height: 38.8 }} viewBox="0 0 38.8052 38.7539">
                <Path d={svgPaths.p3efb1e80} stroke="rgba(255,255,255,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" />
                <Path d="M10.3742 24.306H28.362" stroke="rgba(255,255,255,0.9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </Svg>
            }
          />

          <FeatureCard
            label="通话"
            icon={
              <Svg style={{ width: 48, height: 48 }} viewBox="0 0 48 48">
                <Path d={svgPaths.p10927680} fill="rgba(255,255,255,0.9)" />
              </Svg>
            }
          />
        </View>
      </View>
    </View>
  );
}
