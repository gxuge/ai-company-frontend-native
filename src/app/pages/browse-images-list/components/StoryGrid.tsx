import { View, Image } from 'react-native';

// 6 张故事海报图（竖版，3:4 比例）
const STORY_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1608889825103-acc2db19fb8e?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=420&fit=crop',
  'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=300&h=420&fit=crop',
];

// 从 Figma：w=208 h=292 in 750px grid → 比例约 0.713:1
const CARD_ASPECT = 208 / 292;

export function StoryGrid() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {STORY_POSTERS.map((uri, i) => (
        <View
          key={i}
          style={{
            width: '31.5%',
            aspectRatio: CARD_ASPECT,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
          }}
        >
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      ))}
    </View>
  );
}
