import { useState } from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { AiHeader } from "../../../components/ai-company/ai-header";
import { AiTopTabs } from "../../../components/ai-company/ai-top-tabs";
import { AiLoginBtn } from "../../../components/ai-company/ai-login-btn";
const imgSparkle = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/sparkle.svg"));
const imgChevronRightGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/chevron_right_gray.svg"));
const imgChevronRightWhite = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/chevron_right_white.svg"));
const imgChevronRightDarkGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/chevron_right_darkgray.svg"));
const imgUserDefault = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/user_default.svg"));
const imgUserEdit = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/user_edit.svg"));
const imgAddRoleGray = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/add_role_gray.svg"));
const imgAddChapterGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/create-story/add_chapter_green.svg"));

/* ── Reusable: Generate Button ── */
function GenerateButton() {
  return (
    <button className="flex items-center gap-[6px] px-[13px] py-[7px] rounded-full border-[1px] border-[rgba(155,254,3,0.2)] shadow-[0px_0px_5px_0px_rgba(155,254,3,0.2),0px_0px_10px_0px_rgba(155,254,3,0.1)] bg-transparent cursor-pointer shrink-0">
      <img src={imgSparkle} alt="" className="shrink-0 w-[14px] h-[14px] object-contain" />
      <span
        className="text-[rgba(155,254,3,0.9)] whitespace-nowrap"
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        一键生成
      </span>
    </button>
  );
}

/* ── Reusable: Chevron Right Icon ── */
function ChevronRight({ color = "#9CA3AF" }: { color?: string }) {
  const src =
    color === "white"
      ? imgChevronRightWhite
      : color === "#6B7280"
        ? imgChevronRightDarkGray
        : imgChevronRightGray;
  return (
    <img src={src} alt="" className="shrink-0 w-[6px] h-[10px] object-contain" />
  );
}

/* ── Header ── */
function Header() {
  return (
    <AiHeader
      title="创建原创故事"
      className="sticky top-0 z-50 bg-[#0a0a0a] h-[65px] px-[20px] shrink-0"
    />
  );
}

/* ── Tab Toggle ── */
function TabToggle({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (tab: string) => void;
}) {
  const tabs = [
    { id: "normal", label: "普通剧情" },
    { id: "chapter", label: "章节剧情" },
  ];

  return (
    <AiTopTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tab) => onChange(tab)}
      containerClassName="bg-black rounded-full border-[1px] border-[#494949] p-[5px] h-[48px]"
      activeBgClassName="bg-[rgba(155,254,3,0.9)] shadow-[0px_0px_15px_0px_rgba(155,254,3,0.5)] rounded-full"
      activeTextClassName="text-[#3b3f34] font-bold"
      inactiveTextClassName="text-[#9ca3af]"
    />
  );
}

function SectionHeader({
  title,
  required,
  optional,
  showGenerate = true,
  large = false,
}: {
  title: string;
  required?: boolean;
  optional?: boolean;
  showGenerate?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between w-full pl-[4px]">
      <div className="flex items-baseline gap-[2px]">
        <span
          className="text-white"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: large ? "20px" : "16px",
            fontWeight: 700,
            letterSpacing: "0.4px",
          }}
        >
          {title}
        </span>
        {required && (
          <span
            className="text-[rgba(155,254,3,0.9)] ml-[2px]"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: large ? "20px" : "16px",
              fontWeight: 700,
            }}
          >
            *
          </span>
        )}
        {optional && (
          <span
            className="text-[#4b5563] ml-[2px]"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            (选填)
          </span>
        )}
      </div>
      {showGenerate && <GenerateButton />}
    </div>
  );
}

/* ── Story Settings Section ── */
function StorySettingsSection() {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title="故事设定" />
      <div className="bg-black rounded-[16px] border-[1px] border-[#494949] overflow-hidden">
        <textarea
          className="w-full min-h-[144px] bg-transparent border-0 outline-none resize-none p-[17px] text-white placeholder-[#6b7280]"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
          }}
          placeholder="输入故事整体想法和背景设定，可辅助生成剧情。"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}

/* ── Character List Section ── */
function CharacterListSection() {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title="角色列表" required />
      <div className="bg-black rounded-[16px] border-[1px] border-[#494949] py-[20px] px-[21px]">
        <div className="flex items-start gap-[24px]">
          {/* User avatar */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <div className="w-[64px] h-[64px] rounded-full bg-[#111] border-[1px] border-[rgba(255,255,255,0.1)] flex items-center justify-center shadow-[0px_10px_15px_-3px_black,0px_4px_6px_-4px_black]">
                <img src={imgUserDefault} alt="" className="w-[27px] h-[34px] object-contain" />
              </div>
              <div className="absolute -bottom-[2px] -right-[2px] w-[24px] h-[24px] rounded-full bg-black border-[1px] border-[rgba(255,255,255,0.2)] flex items-center justify-center">
                <img src={imgUserEdit} alt="" className="w-[13px] h-[13px] object-contain" />
              </div>
            </div>
            <span
              className="text-[#9ca3af] mt-[12px]"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
            >
              用户
            </span>
          </div>
          {/* Add button */}
          <div className="flex flex-col items-center shrink-0">
            <button 
              onClick={() => router.push('/pages/select-role')}
              className="w-[64px] h-[64px] rounded-full border-[1px] border-dashed border-[#737373] flex items-center justify-center cursor-pointer bg-transparent p-0"
            >
              <img src={imgAddRoleGray} alt="" className="w-[22px] h-[23px] object-contain" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Location Section ── */
function LocationSection() {
  return (
    <div className="flex flex-col gap-[12px]">
      <SectionHeader title="场所设定" optional showGenerate={false} />
      <button className="bg-black rounded-[16px] border-[1px] border-[#494949] px-[17px] py-[17px] flex items-center justify-between cursor-pointer w-full">
        <span
          className="text-[#9ca3af]"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          选择实体店融合剧情
        </span>
        <ChevronRight />
      </button>
    </div>
  );
}

/* ── Glow Dot ── */
function GlowDot() {
  return (
    <div className="w-[6px] h-[6px] rounded-full bg-white shadow-[0px_0px_4px_0px_#9bfe03] shrink-0" />
  );
}

/* ── Chapter Card ── */
function ChapterCard() {
  const [openingText, setOpeningText] = useState("");
  const [taskText, setTaskText] = useState("");

  return (
    <div className="bg-black rounded-[8px] border-[1px] border-[#494949] overflow-hidden">
      <div className="px-[20px] py-[20px] flex flex-col gap-[15px]">
        {/* Chapter title */}
        <div className="flex flex-col gap-[8px]">
          <span
            className="text-[#fffdfd]"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.9px",
              textShadow: "0px 0px 8px rgba(155,254,3,0.5)",
            }}
          >
            第一章
          </span>
        </div>

        {/* Description with green left border */}
        <div className="border-l-[2px] border-[rgba(155,254,3,0.9)] pl-[14px]">
          <p
            className="text-[#9ca3af] m-0"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "20px",
            }}
          >
            描述主要情节，包括用户在故事中和其他角色的互动
          </p>
        </div>

        {/* Divider gradient */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(155,254,3,0.3)] to-transparent" />

        {/* Opening line section */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between px-[4px]">
            <div className="flex items-center gap-[8px]">
              <GlowDot />
              <span
                className="text-white"
                style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase" as const,
                }}
              >
                开场白
              </span>
            </div>
            <button className="flex items-center gap-[5px] bg-transparent border-0 cursor-pointer p-0">
              <span
                className="text-white underline decoration-[rgba(155,254,3,0.3)]"
                style={{
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  textDecorationSkipInk: "none",
                }}
              >
                选择角色
              </span>
              <ChevronRight color="white" />
            </button>
          </div>
          <div className="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden">
            <textarea
              className="w-full min-h-[96px] bg-transparent border-0 outline-none resize-none p-[13px] text-white placeholder-[#4b5563]"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
              }}
              placeholder=">> 输入开场白内容，开启本故事..."
              value={openingText}
              onChange={(e) => setOpeningText(e.target.value)}
            />
          </div>
        </div>

        {/* Task goals section */}
        <div className="flex flex-col gap-[8px] pt-[8px]">
          <div className="flex items-center gap-[8px] px-[4px]">
            <GlowDot />
            <span
              className="text-white"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.6px",
                textTransform: "uppercase" as const,
              }}
            >
              任务目标
            </span>
          </div>
          <div className="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden">
            <textarea
              className="w-full min-h-[96px] bg-transparent border-0 outline-none resize-none p-[13px] text-white placeholder-[#4b5563]"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
              }}
              placeholder=">> 请输入任务目标..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
          </div>
        </div>

        {/* Banned characters */}
        <div className="flex items-center justify-between relative pl-[12px] pr-[3px]">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[16px] bg-[rgba(155,254,3,0.3)] rounded-full" />
          <span
            className="text-[#6b7280]"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            禁止出场角色
          </span>
          <button className="flex items-center gap-[5px] bg-transparent border-0 cursor-pointer p-0">
            <span
              className="text-[#6b7280]"
              style={{
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
              }}
            >
              选择角色
            </span>
            <ChevronRight color="#6B7280" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Plot Outline Section ── */
function PlotOutlineSection() {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <SectionHeader title="剧情大纲" large />
      <ChapterCard />
      {/* Add chapter button */}
      <button className="w-full flex items-center justify-center gap-[8px] py-[18px] rounded-[16px] border-[1px] border-dashed border-[rgba(155,254,3,0.5)] bg-transparent cursor-pointer mt-[4px]">
        <img src={imgAddChapterGreen} alt="" className="shrink-0 w-[20px] h-[20px] object-contain" />
        <span
          className="text-[rgba(155,254,3,0.9)]"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          添加下一章
        </span>
      </button>
    </div>
  );
}

/* ── Bottom Button ── */
function BottomButton() {
  return (
    <div className="sticky bottom-0 z-50 shrink-0">
      <div className="bg-gradient-to-t from-black via-[rgba(0,0,0,0.95)] to-transparent px-[16px] pb-[20px] pt-[36px]">
        <AiLoginBtn
          label="下一步"
          customWidth="w-full"
          customHeight="h-[56px]"
          radius="rounded-full"
          textClassName="text-[18px] font-bold tracking-[1.4px] text-[#3b3f34]"
        />
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("chapter");

  return (
    <div className="min-h-full bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-full bg-black">
        <Header />
        <ScrollView className="flex-1">
          <div className="px-[16px] pb-[8px] flex flex-col gap-[32px] pt-[10px]">
            <TabToggle activeTab={activeTab} onChange={setActiveTab} />
            <StorySettingsSection />
            <CharacterListSection />
            <LocationSection />
            <PlotOutlineSection />
            {/* spacer for bottom button */}
            <div className="h-[20px] shrink-0" />
          </div>
        </ScrollView>
        <BottomButton />
      </div>
    </div>
  );
}
