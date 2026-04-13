import { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import { SearchBar } from './components/SearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { StoryGrid } from './components/StoryGrid';
import { ImageCard } from './components/ImageCard';
import { BottomNav } from './components/BottomNav';

type TabValue = 'story' | 'character';

const CHARACTER_CARDS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  username: '@每个ai为..',
  author: 'kerwin壳壳',
  views: '76.4万',
}));

const TAB_OPTIONS = [
  { label: '故事', value: 'story' as TabValue },
  { label: '角色', value: 'character' as TabValue },
];

export default function BrowseImagesList() {
  const [activeTab, setActiveTab] = useState<TabValue>('story');
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaView style={{ backgroundColor: '#000' }} />

      {/* ── 顶部主 Tab（故事 / 角色），复用 AiNavigateTabs ── */}
      <View style={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 12 }}>
        <AiNavigateTabs
          options={TAB_OPTIONS}
          activeValue={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* ── 搜索框 ── */}
      <SearchBar placeholder={activeTab === 'story' ? '搜索故事' : '搜索角色'} />

      {/* ── 分类 Pill（横向可滑动）── */}
      <View style={{ paddingVertical: 6 }}>
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </View>

      {/* ── 内容区 ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'story' ? (
          <StoryGrid />
        ) : (
          /* 角色列表：2 列网格，严格还原 343x518 比例并在左右边缘对齐 SearchBar */
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {CHARACTER_CARDS.map((card) => (
              <View key={card.id} style={{ width: '47.4%', marginBottom: 18 }}>
                <ImageCard
                  username={card.username}
                  author={card.author}
                  views={card.views}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── 底部导航 ── */}
      <BottomNav />
    </View>
  );
}
