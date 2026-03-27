import { useState } from "react";
const svgPaths = {
p10210280: "M17.6667 29.0924C27.2478 29.0924 35.3333 30.6493 35.3333 36.6561C35.3333 42.665 27.1948 44.1667 17.6667 44.1667C8.08774 44.1667 0 42.6098 0 36.6031C0 30.5941 8.13855 29.0924 17.6667 29.0924ZM17.6667 0C24.1572 0 29.3575 5.19847 29.3575 11.6844C29.3575 18.1703 24.1572 23.371 17.6667 23.371C11.1784 23.371 5.97578 18.1703 5.97578 11.6844C5.97578 5.19847 11.1784 0 17.6667 0Z",
p1764b200: "M22.2792 7.97156L23.3204 5.72355L25.5866 4.71786C26.1378 4.54039 26.1378 3.83049 25.5866 3.59386L23.3204 2.58817L22.2792 0.399317C22.0342 -0.133106 21.3604 -0.133106 21.1154 0.399317L20.0742 2.58817L17.7468 3.59386C17.2568 3.83049 17.2568 4.48123 17.7468 4.71786L20.0742 5.72355L21.1154 7.97156C21.2992 8.44482 22.0342 8.44482 22.2792 7.97156ZM11.8669 9.86462L9.78445 5.42776C9.35571 4.42207 7.88575 4.42207 7.45701 5.42776L5.37456 9.86462L0.780919 11.876C-0.260306 12.2901 -0.260306 13.7099 0.780919 14.124L5.37456 16.1354L7.45701 20.5722C7.88575 21.5779 9.35571 21.5779 9.78445 20.5722L11.8669 16.1354L16.4605 14.124C17.5018 13.7099 17.5018 12.2901 16.4605 11.876L11.8669 9.86462ZM21.1154 18.0284L20.0742 20.2765L17.7468 21.2821C17.2568 21.4596 17.2568 22.1695 17.7468 22.4061L20.0742 23.4118L21.1154 25.6007C21.2992 26.1331 22.0342 26.1331 22.2792 25.6007L23.3204 23.4118L25.5866 22.4061C26.1378 22.1695 26.1378 21.5188 25.5866 21.2821L23.3204 20.2765L22.2792 18.0284C22.0342 17.5552 21.2992 17.5552 21.1154 18.0284Z",
p2175f400: "M2.92629 0.409664C2.3579 0.955882 2.3579 1.91176 2.92629 2.45798L8.82327 8.125L2.92629 13.792C2.3579 14.3382 2.3579 15.2941 2.92629 15.8403C3.56572 16.3866 4.48934 16.3866 5.05773 15.8403L12.0204 9.14916C12.6599 8.60294 12.6599 7.64706 12.0204 7.10084L5.05773 0.409664C4.48934 -0.136555 3.56572 -0.136555 2.92629 0.409664Z",
p2f924600: "M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z",
p352dd8f0: "M17.2066 10.014L16.5366 10.9047C16.4372 11.0369 16.2494 11.0637 16.117 10.9645L10.9362 7.08345C10.8038 6.98428 10.7767 6.79665 10.8756 6.66403L11.5466 5.76399C12.2366 4.83399 13.3066 4.34399 14.3866 4.34399C15.1266 4.34399 15.8666 4.57399 16.5066 5.05399C17.2566 5.62399 17.7466 6.45399 17.8866 7.38399C18.0166 8.32399 17.7766 9.25399 17.2066 10.014Z",
p39510cf2: "M19.5 5.6875C20.1465 5.6875 20.7665 5.94431 21.2236 6.40143C21.6807 6.85855 21.9375 7.47853 21.9375 8.125V17.0625H30.875C31.5215 17.0625 32.1415 17.3193 32.5986 17.7764C33.0557 18.2335 33.3125 18.8535 33.3125 19.5C33.3125 20.1465 33.0557 20.7665 32.5986 21.2236C32.1415 21.6807 31.5215 21.9375 30.875 21.9375H21.9375V30.875C21.9375 31.5215 21.6807 32.1415 21.2236 32.5986C20.7665 33.0557 20.1465 33.3125 19.5 33.3125C18.8535 33.3125 18.2335 33.0557 17.7764 32.5986C17.3193 32.1415 17.0625 31.5215 17.0625 30.875V21.9375H8.125C7.47853 21.9375 6.85855 21.6807 6.40143 21.2236C5.94431 20.7665 5.6875 20.1465 5.6875 19.5C5.6875 18.8535 5.94431 18.2335 6.40143 17.7764C6.85855 17.3193 7.47853 17.0625 8.125 17.0625H17.0625V8.125C17.0625 7.47853 17.3193 6.85855 17.7764 6.40143C18.2335 5.94431 18.8535 5.6875 19.5 5.6875Z",
p3a801700: "M19.8585 19.3518H13.4815C13.0675 19.3518 12.7315 19.6878 12.7315 20.1018C12.7315 20.5158 13.0675 20.8518 13.4815 20.8518H19.8585C20.2725 20.8518 20.6085 20.5158 20.6085 20.1018C20.6085 19.6878 20.2725 19.3518 19.8585 19.3518Z",
p3aa5000: "M21 6.27083C21.6962 6.27083 22.3639 6.55398 22.8562 7.05798C23.3484 7.56199 23.625 8.24556 23.625 8.95833V18.8125H33.25C33.9462 18.8125 34.6139 19.0956 35.1062 19.5997C35.5984 20.1037 35.875 20.7872 35.875 21.5C35.875 22.2128 35.5984 22.8963 35.1062 23.4004C34.6139 23.9044 33.9462 24.1875 33.25 24.1875H23.625V34.0417C23.625 34.7544 23.3484 35.438 22.8562 35.942C22.3639 36.446 21.6962 36.7292 21 36.7292C20.3038 36.7292 19.6361 36.446 19.1438 35.942C18.6516 35.438 18.375 34.7544 18.375 34.0417V24.1875H8.75C8.05381 24.1875 7.38613 23.9044 6.89384 23.4004C6.40156 22.8963 6.125 22.2128 6.125 21.5C6.125 20.7872 6.40156 20.1037 6.89384 19.5997C7.38613 19.0956 8.05381 18.8125 8.75 18.8125H18.375V8.95833C18.375 8.24556 18.6516 7.56199 19.1438 7.05798C19.6361 6.55398 20.3038 6.27083 21 6.27083Z",
p520f1f0: "M4.68206 0.655462C3.77265 1.52941 3.77265 3.05882 4.68206 3.93277L14.1172 13L4.68206 22.0672C3.77265 22.9412 3.77265 24.4706 4.68206 25.3445C5.70515 26.2185 7.18295 26.2185 8.09236 25.3445L19.2327 14.6387C20.2558 13.7647 20.2558 12.2353 19.2327 11.3613L8.09236 0.655462C7.18295 -0.218487 5.70515 -0.218487 4.68206 0.655462Z",
pf54df00: "M9.61667 8.34336C9.71611 8.2111 9.90387 8.18434 10.0363 8.28355L15.2163 12.164C15.349 12.2634 15.3759 12.4516 15.2763 12.5842L10.4566 19.004C9.29664 20.554 7.54664 20.864 6.33664 20.864C5.58664 20.864 5.04664 20.744 4.98664 20.734C4.85664 20.704 4.73664 20.614 4.66664 20.494C4.59664 20.364 2.87664 17.304 4.79664 14.754L9.61667 8.34336Z",
};

/* ── Reusable: Generate Button ── */
function GenerateButton() {
  return (
    <button className="flex items-center gap-[6px] px-[13px] py-[7px] rounded-full border-[1px] border-[rgba(155,254,3,0.2)] shadow-[0px_0px_5px_0px_rgba(155,254,3,0.2),0px_0px_10px_0px_rgba(155,254,3,0.1)] bg-transparent cursor-pointer shrink-0">
      <svg
        className="shrink-0"
        width="14"
        height="14"
        viewBox="0 0 26 26"
        fill="none"
      >
        <path d={svgPaths.p1764b200} fill="#9BFE03" fillOpacity="0.9" />
      </svg>
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
  return (
    <svg
      className="shrink-0"
      width="6"
      height="10"
      viewBox="0 0 13 16.25"
      fill="none"
    >
      <path d={svgPaths.p2175f400} fill={color} />
    </svg>
  );
}

/* ── Header ── */
function Header() {
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a] flex items-center justify-center h-[65px] relative shrink-0">
      <button className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-[#232322] backdrop-blur-[6px] flex items-center justify-center border-0 cursor-pointer">
        <svg width="18" height="17" viewBox="0 0 35 33.6" fill="none">
          <path
            clipRule="evenodd"
            d={svgPaths.p2f924600}
            fill="white"
            fillRule="evenodd"
          />
        </svg>
      </button>
      <span
        className="text-white"
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        创建原创故事
      </span>
    </div>
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
  return (
    <div className="flex rounded-full border-[1px] border-[#494949] bg-black p-[5px] h-[48px]">
      {["普通剧情", "章节剧情"].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 flex items-center justify-center border-0 cursor-pointer rounded-full transition-all duration-200 ${
            activeTab === tab
              ? "bg-[rgba(155,254,3,0.9)] shadow-[0px_0px_15px_0px_rgba(155,254,3,0.5)]"
              : "bg-transparent"
          }`}
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "14px",
            fontWeight: activeTab === tab ? 700 : 400,
            color: activeTab === tab ? "#3b3f34" : "#9ca3af",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ── Section Header ── */
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
                <svg
                  width="27"
                  height="34"
                  viewBox="0 0 35.3333 44.1667"
                  fill="none"
                >
                  <path d={svgPaths.p10210280} fill="#6B7280" />
                </svg>
              </div>
              <div className="absolute -bottom-[2px] -right-[2px] w-[24px] h-[24px] rounded-full bg-black border-[1px] border-[rgba(255,255,255,0.2)] flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 25 25" fill="none">
                  <path
                    clipRule="evenodd"
                    d={svgPaths.p3a801700}
                    fill="#6B7280"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d={svgPaths.pf54df00}
                    fill="#6B7280"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d={svgPaths.p352dd8f0}
                    fill="#6B7280"
                    fillRule="evenodd"
                  />
                </svg>
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
            <button className="w-[64px] h-[64px] rounded-full border-[1px] border-dashed border-[#737373] flex items-center justify-center cursor-pointer bg-transparent p-0">
              <svg width="22" height="23" viewBox="0 0 42 43" fill="none">
                <path d={svgPaths.p3aa5000} fill="#9CA3AF" />
              </svg>
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
        <svg
          className="shrink-0"
          width="20"
          height="20"
          viewBox="0 0 39 39"
          fill="none"
        >
          <path d={svgPaths.p39510cf2} fill="#9BFE03" fillOpacity="0.9" />
        </svg>
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
        <button
          className="w-full py-[16px] rounded-full bg-[rgba(155,254,3,0.9)] shadow-[0px_0px_20px_0px_rgba(155,254,3,0.4)] border-0 cursor-pointer active:scale-[0.98] transition-transform"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "#3b3f34",
            letterSpacing: "1.4px",
            textTransform: "uppercase",
          }}
        >
          下一步
        </button>
      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [activeTab, setActiveTab] = useState("章节剧情");

  return (
    <div className="min-h-full bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-full bg-black">
        <Header />
        <div className="flex-1 px-[16px] pb-[8px] flex flex-col gap-[32px] pt-[10px]">
          <TabToggle activeTab={activeTab} onChange={setActiveTab} />
          <StorySettingsSection />
          <CharacterListSection />
          <LocationSection />
          <PlotOutlineSection />
          {/* spacer for bottom button */}
          <div className="h-[20px] shrink-0" />
        </div>
        <BottomButton />
      </div>
    </div>
  );
}
