import { View, Image } from 'react-native';

export type StoryGridItem = {
  id: string | number;
  imageUrl?: string;
};

const STORY_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1608889825103-acc2db19fb8e?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=300&h=420&fit=crop',
];

const CARD_ASPECT = 208 / 292;

interface StoryGridProps {
  items?: StoryGridItem[];
}

export function StoryGrid({ items }: StoryGridProps) {
  const data = (items && items.length > 0)
    ? items
    : STORY_POSTERS.map((url, index) => ({ id: index, imageUrl: url }));

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {data.map((item, index) => (
        <View
          key={String(item.id)}
          style={{
            width: '31.5%',
            aspectRatio: CARD_ASPECT,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
          }}
        >
          <Image
            source={{ uri: item.imageUrl || STORY_POSTERS[index % STORY_POSTERS.length] }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      ))}
    </View>
  );
}
