import type { TFunction } from 'i18next'
import type { UIEvent } from 'react'
import type { TsChatSession, TsRoleDetail } from '@/lib/api'
import type { Href } from 'expo-router'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { pickTsImageUrl, tsChatApi, tsRoleApi } from '@/lib/api'

import imgBottomBar from '@/assets/images/chat-list/93aafc4189042303764d04279cdc54d155c672ef.png'
import imgAvatarCat from '@/assets/images/chat-list/d9f32dac83f7a33b3bc2683a9a7ece6e61bab0c2.png'
import imgAvatarSystem from '@/assets/images/chat-list/22853c87aa4b52d7bc8224e7b0c0bfc8da8da271.png'
import imgOfficialPill from '@/assets/images/chat-list/afcc0b83b18fe569bfc816d40f6d60a49486c6c6.png'
import imgAvatarPia from '@/assets/images/chat-list/5b1e0e83b5b9ccc7a7d035bbef27e28090f9a91a.png'
import imgAvatarGalaxy from '@/assets/images/chat-list/d9c92d471406ce0bd25dc1cd3e158a510704f34e.png'
import imgAvatarMilk from '@/assets/images/chat-list/faf3eae3bef345818b00d8820bdf3b9934473fd8.png'
import imgAvatarBoy from '@/assets/images/chat-list/cd0405e207a070f24d8f1bc46dde1c3c16920b18.png'
import imgRedDot from '@/assets/images/chat-list/f0a2b26f54128ac4397e9557184283ecad7ff65a.png'
import imgAvatarRabbit from '@/assets/images/chat-list/54e9f139e4789686220518455b90041d8879e6b7.png'
import imgTabUnderline from '@/assets/images/chat-list/bf914bb2ddd61be7d19bf6830c9239f8fe87ab98.png'
import imgPlusButton from '@/assets/images/chat-list/e0548793bd5cb352ad3c8a43c8f51df83f0cc978.png'
import imgHeadSparkA from '@/assets/images/chat-list/0f38155c448fc5a78b1e707278698011860f2ec7.png'
import imgHeadSparkB from '@/assets/images/chat-list/9a37d9c6d186c20034061e35edd43726c187eeb1.png'
import imgHeadSparkC from '@/assets/images/chat-list/4cca9f78654f3e8141f88abb83f294bfa3784f6a.png'
import imgHeadSparkD from '@/assets/images/chat-list/69fd02303dcc7532ba5e4719e12937164eb6f8db.png'
import imgHeadSparkE from '@/assets/images/chat-list/fb36cdecbaa102ddd85c4429990dcd3ee7a6d7ef.png'
import imgWatermarkSwirl from '@/assets/images/chat-list/d8aaf3f19600d8928df62cc5eacd48638d202e44.png'
import imgWatermarkText from '@/assets/images/chat-list/0f719698495f77e64fb18c7e976a00ea1a133858.png'
import imgQuickFavorite from '@/assets/images/chat-list/quick-favorite.png'
import imgQuickFollow from '@/assets/images/chat-list/quick-follow.png'
import imgQuickInteraction from '@/assets/images/chat-list/quick-interaction.png'
import imgQuickLike from '@/assets/images/chat-list/quick-like.png'
import imgStoryEventCard from '@/assets/images/chat-list/story-event-card.png'
import imgStoryEventChevron from '@/assets/images/chat-list/story-event-chevron.png'
import imgStoryEventDotActive from '@/assets/images/chat-list/story-event-dot-active.png'
import imgStoryEventDotMuted from '@/assets/images/chat-list/story-event-dot-muted.png'
import imgStoryEventDot from '@/assets/images/chat-list/story-event-dot.png'
import imgStoryEventSparkle from '@/assets/images/chat-list/story-event-sparkle.png'
import imgStoryEventStar from '@/assets/images/chat-list/story-event-star.png'
import imgNavCreate from '@/assets/images/role-list/7a144175cd74b1e5c98afc16acbdb627a27a6d07.png'
import imgNavHome from '@/assets/images/role-list/fb069b64e3efbce9b675c95ddca2c2805526c9d5.png'
import imgNavMessage from '@/assets/images/role-list/213f7fe65e6fe3800e3e03f45e2db877e0fd7f93.png'
import imgNavMessageDot from '@/assets/images/role-list/5e4898131631d711eab062c49e699bc2bbfdb16c.png'
import imgNavMine from '@/assets/images/role-list/a05b699755bd7e4747ae5d8c5751ff4e3d464758.png'
import imgNavPlaza from '@/assets/images/role-list/e8722061359d4c67ef70f479247e98894f0ac763.png'

type ChatListTab = 'chat' | 'notifications' | 'comments' | 'system'

type ChatListTabItem = {
  label: string
  value: ChatListTab
}

type Conversation = {
  id: number
  name: string
  avatar: string
  message: string
  time: string
  isSystemSession: boolean
  unread: number
}

type SessionListState = {
  conversations: Conversation[]
  pageNo: number
  hasMore: boolean
  loading: boolean
  loadingMore: boolean
  loadError: string | null
}

type BottomTabId = 'home' | 'search' | 'create' | 'chat' | 'profile'

const SESSION_PAGE_SIZE = 10
const LOAD_MORE_THRESHOLD = 140
const DESIGN_WIDTH = 405
const DESIGN_HEIGHT = 720
const DEFAULT_AVATARS = [
  imgAvatarRabbit,
  imgAvatarBoy,
  imgAvatarMilk,
  imgAvatarGalaxy,
  imgAvatarPia,
  imgAvatarCat,
]
const BOTTOM_TABS: Array<{
  id: BottomTabId
  icon: string
  path: Extract<Href, string>
}> = [
  { id: 'home', icon: imgNavHome, path: '/pages/select-role' },
  { id: 'search', icon: imgNavPlaza, path: '/pages/browse-images-list' },
  { id: 'create', icon: imgNavCreate, path: '/pages/create-page' },
  { id: 'chat', icon: imgNavMessage, path: '/pages/chat-list' as Extract<Href, string> },
  { id: 'profile', icon: imgNavMine, path: '/pages/mine' },
]
const QUICK_ACTIONS = [
  { id: 'like', label: '点赞', image: imgQuickLike },
  { id: 'follow', label: '关注', image: imgQuickFollow },
  { id: 'interaction', label: '互动提醒', image: imgQuickInteraction },
  { id: 'favorite', label: '收藏', image: imgQuickFavorite },
] as const
const roleDetailRequestCache = new Map<number, Promise<TsRoleDetail | null>>()

function getViewportWidth() {
  if (typeof window === 'undefined') {
    return DESIGN_WIDTH
  }
  return Math.max(1, window.visualViewport?.width ?? document.documentElement.clientWidth)
}

function getViewportHeight() {
  if (typeof window === 'undefined') {
    return DESIGN_HEIGHT
  }
  return Math.max(1, window.visualViewport?.height ?? document.documentElement.clientHeight)
}

function subscribeViewport(onChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  window.addEventListener('resize', onChange)
  window.visualViewport?.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('resize', onChange)
    window.visualViewport?.removeEventListener('resize', onChange)
  }
}

function getRoleDetailCached(roleId?: number) {
  if (!roleId || !Number.isFinite(roleId)) {
    return Promise.resolve(null)
  }
  const cached = roleDetailRequestCache.get(roleId)
  if (cached) {
    return cached
  }
  const request = tsRoleApi.getRoleDetail(roleId)
    .catch(() => {
      roleDetailRequestCache.delete(roleId)
      return null
    })
  roleDetailRequestCache.set(roleId, request)
  return request
}

function formatConversationTime(raw?: string) {
  if (!raw) {
    return '--:--'
  }
  const normalized = raw.includes(' ') && !raw.includes('T') ? raw.replace(' ', 'T') : raw
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    return '--:--'
  }
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function normalizeBadge(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.trunc(value)
  }
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.trunc(parsed)
    }
  }
  return 0
}

async function buildConversationRows(sessions: TsChatSession[], t: TFunction) {
  const [messageEntries, roleEntries] = await Promise.all([
    Promise.all(
      sessions.map(async (session) => {
        if (!session.id || !Number.isFinite(session.id)) {
          return [session.id, ''] as const
        }
        try {
          const page = await tsChatApi.getMessageList({
            sessionId: session.id,
            pageNo: 1,
            pageSize: 1,
          })
          const text = page?.records?.[0]?.contentText
          return [session.id, typeof text === 'string' ? text.trim() : ''] as const
        }
        catch {
          return [session.id, ''] as const
        }
      }),
    ),
    Promise.all(
      sessions.map(async session => [
        session.id,
        session.isSystemSession ? null : await getRoleDetailCached(session.targetRoleId),
      ] as const),
    ),
  ])
  const messageMap = new Map<number, string>(messageEntries)
  const roleMap = new Map<number, TsRoleDetail | null>(roleEntries)

  return sessions.map((session, index) => {
    const role = roleMap.get(session.id)
    return {
      id: session.id,
      name: role?.roleName?.trim()
        || session.sessionTitle?.trim()
        || t('chat.sessionList.sessionFallback', { id: session.id }),
      avatar: session.isSystemSession
        ? imgAvatarSystem
        : session.roleAvatarUrl?.trim()
          || role?.avatarUrl?.trim()
          || pickTsImageUrl(session, 'character_avatar', 'character_image', 'story_scene')
          || pickTsImageUrl(role, 'character_avatar', 'character_image')
          || DEFAULT_AVATARS[index % DEFAULT_AVATARS.length],
      message: messageMap.get(session.id) || t('chat.sessionList.noMessage'),
      time: formatConversationTime(session.lastMessageAt || session.updatedAt || session.createdAt),
      isSystemSession: session.isSystemSession === true,
      unread: normalizeBadge(session.unreadCount),
    }
  })
}

function useSessionListData() {
  const { t } = useTranslation()
  const requestInFlightRef = useRef(false)
  const aliveRef = useRef(true)
  const [state, setState] = useState<SessionListState>({
    conversations: [],
    pageNo: 0,
    hasMore: true,
    loading: false,
    loadingMore: false,
    loadError: null,
  })

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
    }
  }, [])

  const loadPage = useCallback(async (pageNo: number, append: boolean) => {
    if (requestInFlightRef.current) {
      return
    }
    requestInFlightRef.current = true
    setState(prev => ({
      ...prev,
      loading: !append,
      loadingMore: append,
      loadError: null,
    }))

    try {
      const sessionPage = await tsChatApi.getSessionList({
        pageNo,
        pageSize: SESSION_PAGE_SIZE,
      })
      const sessions = sessionPage?.records || []
      const rows = await buildConversationRows(sessions, t)
      if (!aliveRef.current) {
        return
      }
      setState((prev) => {
        const merged = append
          ? [...prev.conversations, ...rows.filter(row => !prev.conversations.some(item => item.id === row.id))]
          : rows
        const currentPage = sessionPage?.current || pageNo
        const totalPages = sessionPage?.pages
        const total = sessionPage?.total
        const hasMore = typeof totalPages === 'number'
          ? currentPage < totalPages
          : typeof total === 'number'
            ? merged.length < total
            : sessions.length === SESSION_PAGE_SIZE
        return {
          conversations: merged,
          pageNo: currentPage,
          hasMore,
          loading: false,
          loadingMore: false,
          loadError: null,
        }
      })
    }
    catch (error) {
      if (!aliveRef.current) {
        return
      }
      const message = error instanceof Error ? error.message : t('chat.sessionList.loadFailed')
      setState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
        loadError: message,
      }))
    }
    finally {
      requestInFlightRef.current = false
    }
  }, [t])

  useEffect(() => {
    void loadPage(1, false)
  }, [loadPage])

  const loadMore = useCallback(() => {
    if (!state.hasMore || state.loading || state.loadingMore) {
      return
    }
    void loadPage(state.pageNo + 1, true)
  }, [loadPage, state.hasMore, state.loading, state.loadingMore, state.pageNo])

  const retry = useCallback(() => {
    const append = state.conversations.length > 0
    void loadPage(append ? state.pageNo + 1 : 1, append)
  }, [loadPage, state.conversations.length, state.pageNo])

  return { ...state, loadMore, retry }
}

function Header({ title, startLabel }: { title: string; startLabel: string }) {
  return (
    <header className="relative h-[64px] shrink-0 px-[18px]">
      <img
        alt=""
        aria-hidden
        src={imgWatermarkSwirl}
        className="pointer-events-none absolute left-[10px] top-[8px] h-[42px] w-[78px] opacity-90"
      />
      <img
        alt=""
        aria-hidden
        src={imgWatermarkText}
        className="pointer-events-none absolute left-[52px] top-[40px] h-[18px] w-[34px] opacity-70"
      />
      <h1 className="relative pt-[14px] text-[26px] font-bold leading-none text-[#d1ceac]">{title}</h1>

      <img alt="" aria-hidden src={imgHeadSparkE} className="pointer-events-none absolute left-[29%] top-[16px] size-[13px]" />
      <img alt="" aria-hidden src={imgHeadSparkD} className="pointer-events-none absolute left-[33%] top-[11px] h-[5px] w-[6px]" />
      <img alt="" aria-hidden src={imgHeadSparkC} className="pointer-events-none absolute left-[62%] top-[17px] h-[9px] w-[10px]" />
      <img alt="" aria-hidden src={imgHeadSparkB} className="pointer-events-none absolute left-[73%] top-[10px] size-[13px]" />
      <img alt="" aria-hidden src={imgHeadSparkA} className="pointer-events-none absolute left-[71%] top-[27px] h-[5px] w-[6px]" />

      <button
        type="button"
        aria-label={startLabel}
        className="absolute right-[16px] top-[15px] size-[34px] transition-transform active:scale-95"
      >
        <img alt="" src={imgPlusButton} className="size-full" />
      </button>
    </header>
  )
}

function Tabs({
  active,
  items,
  onChange,
}: {
  active: ChatListTab
  items: ChatListTabItem[]
  onChange: (tab: ChatListTab) => void
}) {
  return (
    <nav className="mx-[16px] mt-[6px] flex shrink-0 items-center rounded-[16px] rounded-br-[14px] rounded-tr-[16px] border-2 border-[#121419] bg-[#111218] p-[3px]">
      {items.map((tab) => {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`relative flex-1 rounded-[16px] py-[10px] text-[15px] leading-none transition-colors ${
              isActive ? 'bg-[#16181f] font-bold text-[#bbbbbd]' : 'text-[#838384]'
            }`}
          >
            {tab.label}
            {isActive && (
              <img
                alt=""
                aria-hidden
                src={imgTabUnderline}
                className="pointer-events-none absolute bottom-[3px] left-1/2 h-[6px] w-[26px] -translate-x-1/2"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}

function QuickActions() {
  return (
    <nav className="grid shrink-0 grid-cols-4 px-[16px] pt-[8px]" aria-label="消息快捷入口">
      {QUICK_ACTIONS.map(action => (
        <button
          key={action.id}
          type="button"
          aria-label={action.label}
          className="flex min-w-0 flex-col items-center transition-transform active:scale-95"
        >
          <span className="flex h-[62px] w-full items-center justify-center overflow-hidden">
            <img
              alt=""
              aria-hidden
              src={action.image}
              className="h-[62px] w-auto max-w-full object-contain"
            />
          </span>
          <span className="mt-[2px] text-[11px] leading-none text-[#9e9ea0]">
            {action.label}
          </span>
        </button>
      ))}
    </nav>
  )
}

function AnnouncementCard() {
  return (
    <section className="relative aspect-[760/274] w-full shrink-0 overflow-hidden rounded-[18px]">
      <img
        alt=""
        aria-hidden
        src={imgStoryEventCard}
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <img
        alt=""
        aria-hidden
        src={imgStoryEventSparkle}
        className="pointer-events-none absolute top-[8%] left-[47%] size-[10px]"
      />

      <div className="absolute top-[8%] left-[4%] inline-flex items-center gap-[5px] rounded-[10px] bg-[#1e213c] px-[8px] py-[5px]">
        <img alt="" aria-hidden src={imgStoryEventStar} className="size-[13px]" />
        <span className="text-[10px] leading-none text-[#91846c]">
          故事活动
        </span>
      </div>

      <h2 className="absolute top-[32%] left-[5%] text-[15px] leading-tight font-bold text-[#b8b9be]">
        「星海回声」限时剧情开启!
      </h2>
      <p className="absolute top-[54%] left-[5%] text-[10px] leading-normal text-[#5b5c69]">
        与他一同穿越星海，解锁专属结局
      </p>

      <button
        type="button"
        className="absolute bottom-[12%] left-[4%] inline-flex items-center gap-[9px] rounded-[14px] border border-[#272b3e] bg-[#11172b] px-[12px] py-[7px] text-[11px] leading-none text-[#787982] transition-transform active:scale-[0.97]"
      >
        查看详情
        <img alt="" aria-hidden src={imgStoryEventChevron} className="h-[10px] w-[6px]" />
      </button>

      <div className="pointer-events-none absolute bottom-[8%] left-1/2 flex -translate-x-1/2 gap-[6px]" aria-hidden>
        <img alt="" src={imgStoryEventDotActive} className="size-[7px]" />
        <img alt="" src={imgStoryEventDot} className="size-[7px]" />
        <img alt="" src={imgStoryEventDotMuted} className="size-[7px]" />
      </div>
    </section>
  )
}

function OfficialTag({ label }: { label: string }) {
  return (
    <span className="relative inline-flex h-[17px] w-[31px] shrink-0 items-center justify-center overflow-hidden rounded-[6px]">
      <img alt="" aria-hidden src={imgOfficialPill} className="absolute inset-0 size-full" />
      <span
        className={`relative leading-none text-[#ccbcfd] ${label.length > 3 ? 'text-[7px]' : 'text-[8px]'}`}
      >
        {label}
      </span>
    </span>
  )
}

function UnreadBadge({ count }: { count: number }) {
  return (
    <span className="relative inline-flex size-[21px] items-center justify-center">
      <img alt="" aria-hidden src={imgRedDot} className="absolute inset-0 size-full" />
      <span className="relative font-inter text-[10px] leading-none text-[#fdb3b0]">
        {count > 99 ? '99+' : count}
      </span>
    </span>
  )
}

function ConversationRow({
  item,
  officialLabel,
  onPress,
}: {
  item: Conversation
  officialLabel: string
  onPress: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onPress}
        className="flex w-full items-center gap-[11px] rounded-[16px] bg-[#171a20] px-[13px] py-[13px] text-left transition-colors active:bg-[#1c2028]"
      >
        <span className="relative size-[58px] shrink-0">
          <span className="absolute inset-0 rounded-full border-2 border-[#d9cf63] bg-[#0d1016] p-[2px]">
            <img
              alt=""
              src={item.avatar}
              className="size-full rounded-full border border-[#e489a5] object-cover"
            />
          </span>
          {!item.isSystemSession ? (
            <span
              aria-hidden
              className="absolute right-0 bottom-0 size-[15px] rounded-full border-2 border-[#171a20] bg-[#55df67]"
            />
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-[7px]">
            <span
              className={`truncate text-[13px] leading-none text-[#bbbcbe] ${
                item.unread > 0 ? 'font-bold' : ''
              }`}
            >
              {item.name}
            </span>
            {item.isSystemSession && <OfficialTag label={officialLabel} />}
          </span>
          <span className="mt-[9px] block truncate text-[10px] leading-normal text-[#717174]">
            {item.message}
          </span>
        </span>

        <span className="flex h-[46px] shrink-0 flex-col items-end justify-between py-[1px]">
          <span
            className="font-inter text-[10px] leading-none text-[#6f6f72]"
          >
            {item.time}
          </span>
          {item.unread > 0 ? (
            <UnreadBadge count={item.unread} />
          ) : (
            <span className="size-[21px]" />
          )}
        </span>
      </button>
    </li>
  )
}

function ConversationSkeleton() {
  return (
    <li className="flex items-center gap-[11px] rounded-[16px] bg-[#171a20] px-[13px] py-[13px]">
      <span className="size-[54px] shrink-0 animate-pulse rounded-full bg-[#222630]" />
      <span className="min-w-0 flex-1">
        <span className="block h-[15px] w-[42%] animate-pulse rounded bg-[#252932]" />
        <span className="mt-[9px] block h-[13px] w-[78%] animate-pulse rounded bg-[#20242d]" />
      </span>
      <span className="h-[12px] w-[34px] shrink-0 animate-pulse rounded bg-[#20242d]" />
    </li>
  )
}

function ListFeedback({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel?: string
  description?: string
  onAction?: () => void
  title: string
}) {
  return (
    <div className="flex flex-col items-center px-[20px] py-[34px] text-center">
      <p className="text-[15px] font-bold text-[#aeb0b5]">{title}</p>
      {description ? <p className="mt-[8px] text-[12px] text-[#666970]">{description}</p> : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-[14px] rounded-[14px] border border-[#343740] bg-[#1b1e25] px-[16px] py-[8px] text-[12px] text-[#b9bbc0]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default function App() {
  const { t } = useTranslation()
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [activeTab, setActiveTab] = useState<ChatListTab>('chat')
  const viewportWidth = useSyncExternalStore(subscribeViewport, getViewportWidth, () => DESIGN_WIDTH)
  const viewportHeight = useSyncExternalStore(subscribeViewport, getViewportHeight, () => DESIGN_HEIGHT)
  const scale = viewportWidth / DESIGN_WIDTH
  const canvasHeight = viewportHeight / scale
  const {
    conversations,
    hasMore,
    loadError,
    loading,
    loadingMore,
    loadMore,
    retry,
  } = useSessionListData()
  const tabs = useMemo<ChatListTabItem[]>(() => [
    { label: t('chat.chatList.tabs.chat'), value: 'chat' },
    { label: t('chat.chatList.tabs.notifications'), value: 'notifications' },
    { label: t('chat.chatList.tabs.comments'), value: 'comments' },
    { label: t('chat.chatList.tabs.system'), value: 'system' },
  ], [t])
  const visibleConversations = useMemo(() => {
    if (activeTab === 'chat') {
      return conversations.filter(item => !item.isSystemSession)
    }
    if (activeTab === 'system') {
      return conversations.filter(item => item.isSystemSession)
    }
    return []
  }, [activeTab, conversations])

  const handleOpenConversation = useCallback((conversation: Conversation) => {
    router.push({
      pathname: conversation.isSystemSession ? '/pages/system-chat' : '/pages/chat',
      params: { sessionId: String(conversation.id) },
    })
  }, [])

  const handleScroll = useCallback((event: UIEvent<HTMLElement>) => {
    if (activeTab !== 'chat' && activeTab !== 'system') {
      return
    }
    const target = event.currentTarget
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight
    if (distanceToBottom <= LOAD_MORE_THRESHOLD) {
      loadMore()
    }
  }, [activeTab, loadMore])

  const handleBottomTab = useCallback(async (tab: { id: BottomTabId; path: Extract<Href, string> }) => {
    if (tab.id === 'home') {
      try {
        const sessionPage = await tsChatApi.getSessionList({ pageNo: 1, pageSize: 50 })
        const nonSystemSession = (sessionPage?.records || []).find(session => session.isSystemSession !== true)
        if (nonSystemSession) {
          router.replace({
            pathname: '/pages/chat',
            params: { sessionId: String(nonSystemSession.id) },
          })
          return
        }
      }
      catch (error) {
        console.error('Failed to fetch sessions for home tab navigation:', error)
      }
    }
    router.replace(tab.path)
  }, [])

  const emptyState = useMemo(() => {
    if (activeTab === 'notifications') {
      return {
        title: t('chat.chatList.notificationsEmptyTitle'),
        description: t('chat.chatList.notificationsEmptyDescription'),
      }
    }
    if (activeTab === 'comments') {
      return {
        title: t('chat.chatList.commentsEmptyTitle'),
        description: t('chat.chatList.commentsEmptyDescription'),
      }
    }
    if (activeTab === 'system') {
      return {
        title: t('chat.chatList.systemEmptyTitle'),
        description: t('chat.chatList.systemEmptyDescription'),
      }
    }
    return {
      title: t('chat.sessionList.emptyTitle'),
      description: t('chat.sessionList.emptyDescription'),
    }
  }, [activeTab, t])

  useEffect(() => {
    const target = scrollContainerRef.current
    const supportsSessionRows = activeTab === 'chat' || activeTab === 'system'
    if (
      supportsSessionRows
      && target
      && !loading
      && !loadingMore
      && hasMore
      && target.scrollHeight <= target.clientHeight + LOAD_MORE_THRESHOLD
    ) {
      loadMore()
    }
  }, [activeTab, hasMore, loadMore, loading, loadingMore, visibleConversations.length])

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0a0b10]">
      <div className="relative w-full" style={{ height: viewportHeight }}>
        <div
          className="flex w-[405px] flex-col bg-[#0a0b10] font-cjk"
          style={{
            height: canvasHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <Header
            title={t('chat.chatList.title')}
            startLabel={t('chat.chatList.startConversation')}
          />
          <Tabs active={activeTab} items={tabs} onChange={setActiveTab} />
          <div className="shrink-0">
            <QuickActions />
            <div className="px-[16px] pt-[9px]">
              <AnnouncementCard />
            </div>
          </div>

          <main
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto px-[16px] pb-[24px] pt-[13px]"
            onScroll={handleScroll}
          >
            <ul className="flex flex-col gap-[9px]">
              {loading
                ? Array.from({ length: 5 }, (_, index) => <ConversationSkeleton key={index} />)
                : visibleConversations.map(item => (
                    <ConversationRow
                      key={item.id}
                      item={item}
                      officialLabel={t('chat.chatList.official')}
                      onPress={() => handleOpenConversation(item)}
                    />
                  ))}
            </ul>
            {!loading && loadError ? (
              <ListFeedback
                title={loadError}
                actionLabel={t('chat.chatList.retry')}
                onAction={retry}
              />
            ) : null}
            {!loading && !loadError && visibleConversations.length === 0 ? (
              <ListFeedback title={emptyState.title} description={emptyState.description} />
            ) : null}
            {loadingMore ? (
              <p className="py-[16px] text-center text-[12px] text-[#686b72]">
                {t('chat.chatList.loadingMore')}
              </p>
            ) : null}
            {!loading && !loadingMore && !loadError && !hasMore && visibleConversations.length > 0 ? (
              <p className="py-[16px] text-center text-[11px] text-[#4f5259]">
                {t('chat.chatList.noMore')}
              </p>
            ) : null}
          </main>

          <div className="relative h-[44px] shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imgBottomBar})` }}
            />
            <div className="absolute inset-0 grid grid-cols-5">
              {BOTTOM_TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  aria-label={t(`chat.chatList.bottomTabs.${tab.id}`)}
                  onClick={() => void handleBottomTab(tab)}
                  className="relative grid h-full w-full place-items-center border-0 bg-transparent p-0"
                >
                  <img
                    alt=""
                    aria-hidden
                    src={tab.icon}
                    className={tab.id === 'create' ? 'size-[24px]' : 'h-[20px] w-auto'}
                  />
                  {tab.id === 'chat' ? (
                    <img
                      alt=""
                      aria-hidden
                      src={imgNavMessageDot}
                      className="absolute top-[8px] left-[57%] size-[7px]"
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
