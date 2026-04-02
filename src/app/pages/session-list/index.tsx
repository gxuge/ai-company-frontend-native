import { useState } from "react";
import { AiNavigateTabs } from "@/components/ai-company/ai-navigate-tabs";
const imgCategoryBgBlue = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/category_bg_blue.svg"));
const imgCategoryBgOrange = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/category_bg_orange.svg"));
const imgCategoryBgRed = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/category_bg_red.svg"));
const imgCategoryBgGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/category_bg_green.svg"));
const imgIconAddUser = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/icon_add_user.svg"));
const imgIconFrame = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/icon_frame.svg"));
const imgIconHeart = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/icon_heart.svg"));
const imgIconMoreSquare = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/icon_more_square.svg"));
const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/fe8f8455c56209efe0d72facc734a87895b2dd6d.png"));
const imgAvatar = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/5acb32030bcf30b8d2528774380aabcaab7e2018.png"));
const AVATAR_URL = "https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzMzMDMwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const tabs = [
  { label: "消息", value: "消息" },
  { label: "关注", value: "关注" },
];

const categories = [
  {
    label: "关注",
    color: "#3B82F6",
    fillOpacity: 0.3,
    icon: "addUser",
  },
  {
    label: "订阅",
    color: "#F97316",
    fillOpacity: 0.2,
    icon: "frame",
  },
  {
    label: "点赞",
    color: "#EF4444",
    fillOpacity: 0.2,
    icon: "heart",
  },
  {
    label: "评论",
    color: "#84CC16",
    fillOpacity: 0.2,
    icon: "moreSquare",
  },
];

const conversations = [
  { id: 1, name: "安妮", message: "你好", time: "20.00", badge: 2 },
  { id: 2, name: "安妮", message: "你好", time: "20.00", badge: 2 },
  { id: 3, name: "安妮", message: "你好", time: "20.00", badge: 2 },
  { id: 4, name: "安妮", message: "你好", time: "20.00", badge: 2 },
  { id: 5, name: "安妮", message: "你好", time: "20.00", badge: 2 },
  { id: 6, name: "安妮", message: "你好", time: "20.00", badge: 2 },
  { id: 7, name: "安妮", message: "你好", time: "20.00", badge: 2 },
];

function CategoryIcon({ icon, color }: { icon: string; color: string }) {
  const bgSrc =
    color === "#3B82F6"
      ? imgCategoryBgBlue
      : color === "#F97316"
        ? imgCategoryBgOrange
        : color === "#EF4444"
          ? imgCategoryBgRed
          : imgCategoryBgGreen;
  const iconSrc =
    icon === "addUser"
      ? imgIconAddUser
      : icon === "frame"
        ? imgIconFrame
        : icon === "heart"
          ? imgIconHeart
          : imgIconMoreSquare;
  const iconWidth = icon === "addUser" ? 22 : icon === "frame" ? 20 : icon === "heart" ? 20 : 19;
  const iconHeight = icon === "addUser" ? 20 : icon === "frame" ? 16 : icon === "heart" ? 19 : 19;

  return (
    <div className="relative w-[48px] h-[48px] overflow-hidden">
      <img src={bgSrc} alt="" className="absolute inset-0 w-full h-full object-contain" />
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={iconSrc} alt="" className="object-contain" style={{ width: iconWidth, height: iconHeight }} />
      </div>
    </div>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <div className="w-[20px] h-[20px] bg-[#ff4245] rounded-full flex items-center justify-center border border-[#3e7df8]">
      <span className="text-white text-[11px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
        {count}
      </span>
    </div>
  );
}

function ConversationItem({ name, message, time, badge }: { name: string; message: string; time: string; badge: number }) {
  return (
    <div className="flex items-center px-4 py-3 border-t border-[#5d5d5d]">
      {/* Avatar */}
      <div className="relative shrink-0 w-[56px] h-[56px] mr-3">
        <img
          src={imgAvatar}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
        {/* Online indicator */}
        <div className="absolute bottom-0 left-0 w-[12px] h-[12px] bg-[#3B82F6] rounded-full border-2 border-[#202020]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[#e1e1e1] text-[15px] truncate" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
          {name}
        </p>
        <p className="text-[#9c9c9c] text-[12px] truncate mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
          {message}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
        <Badge count={badge} />
        <span className="text-[#989898] text-[11px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
          {time}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("关注");

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#111]">
      <div className="w-full max-w-[430px] bg-[#1e1e1e] min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-[rgba(0,0,0,0.5)]">
          <AiNavigateTabs
            options={tabs}
            activeValue={activeTab}
            onChange={setActiveTab}
            containerClassName="flex-row items-center gap-8"
            activeTextClassName="text-[18px] text-[rgba(155,254,3,0.9)] font-bold pb-1"
            inactiveTextClassName="text-[18px] text-[#e7e7e7] pb-1"
            indicatorClassName="absolute bottom-[-2px] h-[3px] bg-[rgba(155,254,3,0.9)] rounded-full"
          />
          {/* Search icon */}
          <div className="w-[22px] h-[22px]">
            <img src={imgImage} alt="search" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Category Icons */}
        <div className="flex items-center justify-around px-4 py-5 bg-[#202020]">
          {categories.map((cat) => (
            <div key={cat.label} className="flex flex-col items-center gap-2">
              <CategoryIcon icon={cat.icon} color={cat.color} />
              <span
                className="text-[#9ca3af] text-[14px] tracking-tight"
                style={{ fontFamily: "sans-serif", fontWeight: 700 }}
              >
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              name={conv.name}
              message={conv.message}
              time={conv.time}
              badge={conv.badge}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
