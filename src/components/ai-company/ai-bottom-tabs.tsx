import { useState } from 'react';

const resolveAsset = (m: any) => m?.default ?? m?.uri ?? m;

const imgHome = resolveAsset(require('../../assets/images/ai-tabs/svg/home.svg'));
const imgSearch = resolveAsset(require('../../assets/images/ai-tabs/svg/search.svg'));
const imgCreate = resolveAsset(require('../../assets/images/ai-tabs/svg/create.svg'));
const imgCreateBadge = resolveAsset(require('../../assets/images/ai-tabs/svg/create-badge.svg'));
const imgChat = resolveAsset(require('../../assets/images/ai-tabs/svg/chat.svg'));
const imgProfile = resolveAsset(require('../../assets/images/ai-tabs/svg/profile.svg'));

const tabs = [
  { id: 'home', label: '首页' },
  { id: 'search', label: '搜索' },
  { id: 'create', label: '创建' },
  { id: 'chat', label: '消息' },
  { id: 'profile', label: '我的' },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={imgHome} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: active ? 1 : 0.5 }} />
    </div>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={imgSearch} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: active ? 1 : 0.5 }} />
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
      <img src={imgChat} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: active ? 1 : 0.5 }} />
    </div>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <img src={imgProfile} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: active ? 1 : 0.5 }} />
    </div>
  );
}

const iconComponents = [HomeIcon, SearchIcon, CreateIcon, ChatIcon, ProfileIcon];

export default function AiBottomTabs() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="size-full bg-black flex flex-col justify-end">
      <nav className="w-full bg-black border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab, i) => {
            const Icon = iconComponents[i];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center justify-center flex-1 h-full"
              >
                <Icon active={isActive} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
