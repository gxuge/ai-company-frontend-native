import type { TsChatSession } from '@/lib/api';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';
import { tsChatApi } from '@/lib/api';

const imgCategoryBgBlue = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/category_bg_blue.svg'));
const imgCategoryBgOrange = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/category_bg_orange.svg'));
const imgCategoryBgRed = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/category_bg_red.svg'));
const imgCategoryBgGreen = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/category_bg_green.svg'));
const imgIconAddUser = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/icon_add_user.svg'));
const imgIconFrame = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/icon_frame.svg'));
const imgIconHeart = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/icon_heart.svg'));
const imgIconMoreSquare = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/icon_more_square.svg'));
const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/fe8f8455c56209efe0d72facc734a87895b2dd6d.png'));
const imgAvatar = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/session-list/5acb32030bcf30b8d2528774380aabcaab7e2018.png'));
const imgSystemAvatar = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/quick-login/logo.png'));

const tabs = [
  { label: '消息', value: '消息' },
  { label: '关注', value: '关注' },
];

const categories = [
  {
    label: '关注',
    color: '#3B82F6',
    fillOpacity: 0.3,
    icon: 'addUser',
  },
  {
    label: '订阅',
    color: '#F97316',
    fillOpacity: 0.2,
    icon: 'frame',
  },
  {
    label: '点赞',
    color: '#EF4444',
    fillOpacity: 0.2,
    icon: 'heart',
  },
  {
    label: '评论',
    color: '#84CC16',
    fillOpacity: 0.2,
    icon: 'moreSquare',
  },
];

type Conversation = {
  id: number;
  name: string;
  message: string;
  time: string;
  badge: number;
  isSystemSession: boolean;
};

type SessionListState = {
  conversations: Conversation[];
  loading: boolean;
  loadError: string | null;
};

const SESSION_PAGE_SIZE = 20;

function formatConversationTime(raw?: string) {
  if (!raw) {
    return '--.--';
  }
  const normalized = raw.includes(' ') && !raw.includes('T') ? raw.replace(' ', 'T') : raw;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return '--.--';
  }
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}.${mm}`;
}

function normalizeBadge(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.trunc(value);
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.trunc(parsed);
    }
  }
  return 0;
}

async function buildConversationRows(sessions: TsChatSession[]) {
  const messageEntries = await Promise.all(
    sessions.map(async (session) => {
      if (!session.id || !Number.isFinite(session.id)) {
        return [session.id, ''] as const;
      }
      try {
        const page = await tsChatApi.getMessageList({
          sessionId: session.id,
          pageNo: 1,
          pageSize: 1,
        });
        const text = page?.records?.[0]?.contentText;
        return [session.id, typeof text === 'string' ? text.trim() : ''] as const;
      }
      catch {
        return [session.id, ''] as const;
      }
    }),
  );

  const messageMap = new Map<number, string>(messageEntries);
  return sessions.map(session => ({
    id: session.id,
    name: session.sessionTitle?.trim() || `会话${session.id}`,
    message: messageMap.get(session.id) || '暂无消息',
    time: formatConversationTime(session.lastMessageAt || session.updatedAt || session.createdAt),
    badge: normalizeBadge(session.unreadCount),
    isSystemSession: session.isSystemSession === true,
  }));
}

function useSessionListData() {
  const [state, setState] = useState<SessionListState>({
    conversations: [],
    loading: false,
    loadError: null,
  });

  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, loadError: null }));
      const sessionPage = await tsChatApi.getSessionList({
        pageNo: 1,
        pageSize: SESSION_PAGE_SIZE,
      });
      if (!alive) {
        return;
      }

      const sessions = sessionPage?.records || [];
      const conversations = await buildConversationRows(sessions);
      if (!alive) {
        return;
      }
      setState({
        conversations,
        loading: false,
        loadError: null,
      });
    };

    loadData().catch((error) => {
      if (!alive) {
        return;
      }
      const message = error instanceof Error ? error.message : '会话列表加载失败';
      setState(prev => ({ ...prev, loading: false, loadError: message }));
    });

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

function CategoryIcon({ icon, color }: { icon: string; color: string }) {
  const bgSrc
    = color === '#3B82F6'
      ? imgCategoryBgBlue
      : color === '#F97316'
        ? imgCategoryBgOrange
        : color === '#EF4444'
          ? imgCategoryBgRed
          : imgCategoryBgGreen;
  const iconSrc
    = icon === 'addUser'
      ? imgIconAddUser
      : icon === 'frame'
        ? imgIconFrame
        : icon === 'heart'
          ? imgIconHeart
          : imgIconMoreSquare;
  const iconWidth = icon === 'addUser' ? 22 : icon === 'frame' ? 20 : icon === 'heart' ? 20 : 19;
  const iconHeight = icon === 'addUser' ? 20 : icon === 'frame' ? 16 : icon === 'heart' ? 19 : 19;

  return (
    <div className="relative size-[48px] overflow-hidden">
      <img src={bgSrc} alt="" className="absolute inset-0 size-full object-contain" />
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={iconSrc} alt="" className="object-contain" style={{ width: iconWidth, height: iconHeight }} />
      </div>
    </div>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <div className="flex size-[20px] items-center justify-center rounded-full border border-[#3e7df8] bg-[#ff4245]">
      <span className="text-[11px] text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
        {count}
      </span>
    </div>
  );
}

function ConversationItem({
  isSystemSession,
  name,
  message,
  time,
  badge,
  onPress,
}: {
  isSystemSession: boolean;
  name: string;
  message: string;
  time: string;
  badge: number;
  onPress?: () => void;
}) {
  const avatarSrc = isSystemSession ? imgSystemAvatar : imgAvatar;
  return (
    <div className="flex items-center border-t border-[#5d5d5d] px-4 py-3" onClick={onPress}>
      <div className="relative mr-3 size-[56px] shrink-0">
        <img
          src={avatarSrc}
          alt={name}
          className="size-full rounded-full object-cover"
        />
        <div className="absolute bottom-0 left-0 size-[12px] rounded-full border-2 border-[#202020] bg-[#3B82F6]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] text-[#e1e1e1]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
          {name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#9c9c9c]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {message}
        </p>
      </div>

      <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
        <Badge count={badge} />
        <span className="text-[11px] text-[#989898]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
          {time}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('关注');
  const { conversations, loading, loadError } = useSessionListData();
  const handleOpenConversation = (conversation: Conversation) => {
    const pathname = conversation.isSystemSession ? '/pages/admin-chat' : '/pages/chat';
    router.push({
      pathname,
      params: { sessionId: String(conversation.id) },
    });
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#111]">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-[#1e1e1e]">
        <div className="flex items-center justify-between bg-[rgba(0,0,0,0.5)] px-4 pt-3 pb-2">
          <AiNavigateTabs
            options={tabs}
            activeValue={activeTab}
            onChange={setActiveTab}
            containerClassName="flex-row items-center gap-8"
            activeTextClassName="text-[18px] text-[rgba(155,254,3,0.9)] font-bold pb-1"
            inactiveTextClassName="text-[18px] text-[#e7e7e7] pb-1"
            indicatorClassName="absolute bottom-[-2px] h-[3px] bg-[rgba(155,254,3,0.9)] rounded-full"
          />
          <div className="size-[22px]">
            <img src={imgImage} alt="search" className="size-full object-contain" />
          </div>
        </div>

        <div className="flex items-center justify-around bg-[#202020] px-4 py-5">
          {categories.map(cat => (
            <div key={cat.label} className="flex flex-col items-center gap-2">
              <CategoryIcon icon={cat.icon} color={cat.color} />
              <span
                className="text-[14px] tracking-tight text-[#9ca3af]"
                style={{ fontFamily: 'sans-serif', fontWeight: 700 }}
              >
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pb-[90px]">
          {loading ? <div className="px-4 py-3 text-[12px] text-[#9ca3af]">加载中...</div> : null}
          {loadError ? <div className="px-4 py-3 text-[12px] text-[#fca5a5]">{loadError}</div> : null}
          {!loading && conversations.length === 0 ? <div className="px-4 py-3 text-[12px] text-[#9ca3af]">暂无会话</div> : null}
          {conversations.map(conv => (
            <ConversationItem
              key={conv.id}
              isSystemSession={conv.isSystemSession}
              name={conv.name}
              message={conv.message}
              time={conv.time}
              badge={conv.badge}
              onPress={() => handleOpenConversation(conv)}
            />
          ))}
        </div>

        {/* Bottom Tabs */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] w-full max-w-[430px] self-center">
          <AiBottomTabs activeTab="chat" />
        </div>
      </div>
    </div>
  );
}
