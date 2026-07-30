import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Pressable, Text } from 'react-native';
import { brandGreenRgba } from '@/components/ui/brand';

interface CategoryTabsProps {
  active?: number;
  onChange?: (index: number) => void;
}

export function CategoryTabs({ active: externalActive, onChange }: CategoryTabsProps) {
  const { t } = useTranslation();
  const [internalActive, setInternalActive] = useState(0);
  const active = externalActive ?? internalActive;
  const categories = [
    t('contentBrowse.browse.categories.recommended'),
    t('contentBrowse.browse.categories.subscribed'),
    t('contentBrowse.browse.categories.liked'),
    t('contentBrowse.browse.categories.anime'),
    t('contentBrowse.browse.categories.urban'),
    t('contentBrowse.browse.categories.ancient'),
    t('contentBrowse.browse.categories.sciFi'),
  ];

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
      {categories.map((cat, i) => {
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
