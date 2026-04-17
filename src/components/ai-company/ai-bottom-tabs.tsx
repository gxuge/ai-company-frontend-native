import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const resolveAsset = (m: any) => m?.default ?? m?.uri ?? m;

const imgHome = resolveAsset(require('../../assets/images/ai-tabs/svg/home.svg'));
const imgHomeActive = resolveAsset(require('../../assets/images/ai-tabs/svg/home-active.svg'));
const imgSearch = resolveAsset(require('../../assets/images/ai-tabs/svg/search.svg'));
const imgSearchActive = resolveAsset(require('../../assets/images/ai-tabs/svg/search-active.svg'));
const imgCreate = resolveAsset(require('../../assets/images/ai-tabs/svg/create.svg'));
const imgCreateBadge = resolveAsset(require('../../assets/images/ai-tabs/svg/create-badge.svg'));
const imgChat = resolveAsset(require('../../assets/images/ai-tabs/svg/chat.svg'));
const imgChatActive = resolveAsset(require('../../assets/images/ai-tabs/svg/chat-active.svg'));
const imgProfile = resolveAsset(require('../../assets/images/ai-tabs/svg/profile.svg'));
const imgProfileActive = resolveAsset(require('../../assets/images/ai-tabs/svg/profile-active.svg'));

const tabs = [
  { id: 'home', label: '首页', path: '/pages/select-role' },
  { id: 'search', label: '搜索', path: '/pages/browse-images-list' },
  { id: 'create', label: '创建', path: '/pages/create-page' },
  { id: 'chat', label: '消息', path: '/pages/session-list' },
  { id: 'profile', label: '我的', path: '/pages/mine' },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={active ? imgHomeActive : imgHome} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={active ? imgSearchActive : imgSearch} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
  );
}

function CreateIcon({ active }: { active: boolean }) {
  return (
    <div className="relative" style={{ width: 28, height: 28, opacity: active ? 1 : 0.5 }}>
      <img src={imgCreate} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      <img src={imgCreateBadge} alt="" className="absolute -top-2 -right-3" style={{ width: 16, height: 16 }} />
    </div>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={active ? imgChatActive : imgChat} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={active ? imgProfileActive : imgProfile} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
  );
}

const iconComponents = [HomeIcon, SearchIcon, CreateIcon, ChatIcon, ProfileIcon];

export default function AiBottomTabs({ activeTab }: { activeTab?: string }) {
  const insets = useSafeAreaInsets();

  return (
    <nav 
      className="w-full bg-black border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-[1000]"
      style={{ paddingBottom: Math.max(insets.bottom, 15) }}
    >
      <div className="flex items-center justify-around h-[64px]">
        {tabs.map((tab, i) => {
          const Icon = iconComponents[i];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => router.replace(tab.path as any)}
              className="flex items-center justify-center flex-1 h-full transition-all active:scale-95"
            >
              <Icon active={isActive} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
