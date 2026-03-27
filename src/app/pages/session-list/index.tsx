import { useState } from "react";
const svgPaths = {
p1457c100: "M45 90C69.8527 90 90 69.8512 90 45C90 20.1473 69.8527 0 45 0C20.1473 0 0 20.1473 0 45C0 69.8512 20.1473 90 45 90Z",
p1802f300: "M24.7554 19.3501C23.7618 19.3501 22.9482 18.5455 22.9482 17.5501C22.9482 16.5547 23.7456 15.7501 24.7392 15.7501H24.7554C25.749 15.7501 26.5554 16.5547 26.5554 17.5501C26.5554 18.5455 25.749 19.3501 24.7554 19.3501ZM17.5572 19.3501C16.5636 19.3501 15.75 18.5455 15.75 17.5501C15.75 16.5547 16.5474 15.7501 17.541 15.7501H17.5572C18.5508 15.7501 19.3572 16.5547 19.3572 17.5501C19.3572 18.5455 18.5508 19.3501 17.5572 19.3501ZM10.3572 19.3501C9.3636 19.3501 8.55 18.5455 8.55 17.5501C8.55 16.5547 9.3474 15.7501 10.341 15.7501H10.3572C11.3508 15.7501 12.1572 16.5547 12.1572 17.5501C12.1572 18.5455 11.3508 19.3501 10.3572 19.3501ZM17.55 0C4.5918 0 0 4.5936 0 17.5501C0 30.5065 4.5918 35.1001 17.55 35.1001C30.5082 35.1001 35.1 30.5065 35.1 17.5501C35.1 4.5936 30.5082 0 17.55 0Z",
p1e66bd00: "M14.6875 24.5089C22.6516 24.5089 29.375 25.8194 29.375 30.8805C29.375 35.9416 22.6085 37.2083 14.6875 37.2083C6.72336 37.2083 0 35.8959 0 30.8368C0 25.7757 6.76452 24.5089 14.6875 24.5089ZM33.2897 9.79167C34.2614 9.79167 35.0501 10.5935 35.0501 11.5769V13.8804H37.4062C38.376 13.8804 39.1667 14.6822 39.1667 15.6656C39.1667 16.6491 38.376 17.4509 37.4062 17.4509H35.0501V19.7564C35.0501 20.7398 34.2614 21.5417 33.2897 21.5417C32.3199 21.5417 31.5292 20.7398 31.5292 19.7564V17.4509H29.1772C28.2054 17.4509 27.4167 16.6491 27.4167 15.6656C27.4167 14.6822 28.2054 13.8804 29.1772 13.8804H31.5292V11.5769C31.5292 10.5935 32.3199 9.79167 33.2897 9.79167ZM14.6875 0C20.0819 0 24.406 4.38007 24.406 9.84423C24.406 15.3084 20.0819 19.6885 14.6875 19.6885C9.29313 19.6885 4.96901 15.3084 4.96901 9.84423C4.96901 4.38007 9.29313 0 14.6875 0Z",
p2281f80: "M45 0.5C69.5766 0.5 89.5 20.4234 89.5 45C89.5 69.5751 69.5766 89.5 45 89.5C20.4234 89.5 0.5 69.5751 0.5 45C0.5 20.4234 20.4234 0.5 45 0.5Z",
p26cd4b00: "M11.775 0.000289996C12.9563 0.0362144 14.1 0.242464 15.2082 0.619339H15.3188C15.3938 0.654964 15.45 0.694339 15.4875 0.729964C15.9019 0.863089 16.2938 1.01309 16.6688 1.21934L17.3813 1.53809C17.6625 1.68809 18 1.96746 18.1875 2.08184C18.375 2.19246 18.5813 2.30684 18.75 2.43621C20.8332 0.844339 23.3625 -0.0181606 25.9688 0.000289996C27.1519 0.000289996 28.3332 0.167464 29.4563 0.544339C36.3769 2.79434 38.8707 10.3881 36.7875 17.0256C35.6063 20.4175 33.675 23.5131 31.1457 26.0425C27.525 29.5487 23.5519 32.6612 19.275 35.3425L18.8063 35.6256L18.3188 35.3237C14.0269 32.6612 10.0313 29.5487 6.37691 26.0237C3.86441 23.4943 1.93128 20.4175 0.731281 17.0256C-1.38747 10.3881 1.10628 2.79434 8.10191 0.504964C8.64566 0.317464 9.20628 0.186214 9.76878 0.113089H9.99378C10.5207 0.0362144 11.0438 0.000289996 11.5688 0.000289996H11.775ZM28.4813 5.92559C27.7125 5.66121 26.8688 6.07559 26.5875 6.86309C26.325 7.65059 26.7375 8.51309 27.525 8.79246C28.7269 9.24246 29.5313 10.4256 29.5313 11.7362V11.7943C29.4957 12.2237 29.625 12.6381 29.8875 12.9568C30.15 13.2756 30.5438 13.4612 30.9563 13.5006C31.725 13.48 32.3813 12.8631 32.4375 12.0737V11.8506C32.4938 9.22371 30.9019 6.84434 28.4813 5.92559Z",
p7eb9200: "M0 3.75C0 1.67893 1.67893 0 3.75 0H5.625V30H3.75C1.67893 30 0 28.3211 0 26.25V3.75ZM26.25 8.4375H18.75C18.2323 8.4375 17.8125 8.85724 17.8125 9.375V11.25C17.8125 11.7677 18.2323 12.1875 18.75 12.1875H26.25C26.7677 12.1875 27.1875 11.7677 27.1875 11.25V9.375C27.1875 8.85724 26.7677 8.4375 26.25 8.4375ZM8.4375 30H33.75C35.8211 30 37.5 28.3211 37.5 26.25V3.75C37.5 1.67893 35.8211 0 33.75 0H8.4375V30ZM18.75 5.625H26.25C28.3211 5.625 30 7.30393 30 9.375V11.25C30 13.3211 28.3211 15 26.25 15H18.75C16.6789 15 15 13.3211 15 11.25V9.375C15 7.30393 16.6789 5.625 18.75 5.625Z",
};
const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/fe8f8455c56209efe0d72facc734a87895b2dd6d.png"));
const imgAvatar = ((m: any) => m?.default ?? m?.uri ?? m)(require("../../../assets/images/session-list/5acb32030bcf30b8d2528774380aabcaab7e2018.png"));
const AVATAR_URL = "https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzMzMDMwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const tabs = ["消息", "关注"] as const;

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
  const iconColor = icon === "addUser" ? "#60A5FA" : icon === "frame" ? "#FB923C" : icon === "heart" ? "#F87171" : color;

  return (
    <div className="relative w-[48px] h-[48px] overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 90 90">
        <path d={svgPaths.p1457c100} fill={color} fillOpacity={0.2} />
        <path d={svgPaths.p2281f80} stroke={color} strokeOpacity={0.3} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width={icon === "addUser" ? "22" : icon === "frame" ? "20" : icon === "heart" ? "20" : "19"}
          height={icon === "addUser" ? "20" : icon === "frame" ? "16" : icon === "heart" ? "19" : "19"}
          viewBox={
            icon === "addUser"
              ? "0 0 39.1667 37.2083"
              : icon === "frame"
                ? "0 0 37.5 30"
                : icon === "heart"
                  ? "0 0 37.5004 35.6256"
                  : "0 0 35.1 35.1001"
          }
          fill="none"
        >
          <path
            d={
              icon === "addUser"
                ? svgPaths.p1e66bd00
                : icon === "frame"
                  ? svgPaths.p7eb9200
                  : icon === "heart"
                    ? svgPaths.p26cd4b00
                    : svgPaths.p1802f300
            }
            fill={iconColor}
            fillRule={icon === "moreSquare" ? "evenodd" : undefined}
            clipRule={icon === "moreSquare" ? "evenodd" : undefined}
          />
        </svg>
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
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("关注");

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#111]">
      <div className="w-full max-w-[430px] bg-[#1e1e1e] min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-[rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex flex-col items-center pb-1"
              >
                <span
                  className={`text-[18px] ${activeTab === tab ? "text-[rgba(155,254,3,0.9)]" : "text-[#e7e7e7]"}`}
                  style={{ fontFamily: "sans-serif", fontWeight: activeTab === tab ? 700 : 400 }}
                >
                  {tab}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-[rgba(155,254,3,0.9)] rounded-full" />
                )}
              </button>
            ))}
          </div>
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
