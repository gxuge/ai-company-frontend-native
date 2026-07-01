import { useState } from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { brandGreenRgba } from '@/components/ui/brand';

const CATEGORIES = ['推荐', '订阅', '点赞', '二次元', '都市', '古风', '科幻'];

interface CategoryTabsProps {
  active?: number;
  onChange?: (index: number) => void;
}

export function CategoryTabs({ active: externalActive, onChange }: CategoryTabsProps) {
  const [internalActive, setInternalActive] = useState(0);
  const active = externalActive ?? internalActive;

  const handlePress = (i: number) => {
    setInternalActive(i);
    onChange?.(i);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8, flexDirection: 'row', paddingVertical: 4 }}
    >
      {CATEGORIES.map((cat, i) => {
        const isActive = i === active;
        return (
          <Pressable
            key={cat}
            onPress={() => handlePress(i)}
            style={{
              height: 36,
              paddingHorizontal: 20,
              borderRadius: 18,
              justifyContent: 'center',
              backgroundColor: isActive ? brandGreenRgba(0.9) : brandGreenRgba(0.2),
              borderWidth: 1.5,
              borderColor: isActive ? 'transparent' : brandGreenRgba(0.9),
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                fontSize: 15,
                color: isActive ? '#202020' : brandGreenRgba(0.9),
              }}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
