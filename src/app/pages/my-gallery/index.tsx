import { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { AiHeader } from '@/components/ai-company/ai-header';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop', name: '时尚女孩_参考01', type: '参考图' },
  { id: 2, url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop', name: '商务男士_生成', type: '生成图' },
  { id: 3, url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop', name: '优雅女性_收藏', type: '收藏图' },
  { id: 4, url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop', name: '职业造型_参考02', type: '参考图' },
  { id: 5, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop', name: '都市风格_生成', type: '生成图' },
  { id: 6, url: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop', name: '清新女孩_收藏', type: '收藏图' },
];

type ImageItem = typeof initialImages[number];

// ─── Icons ────────────────────────────────────────────────────────────────────
function CheckIcon({ color = 'black', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon({ color = 'white', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" stroke="#52525b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 5h6M19 2v6" stroke="#52525b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 15l-5-5L5 21" stroke="#52525b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="9" cy="9" r="2" stroke="#52525b" strokeWidth={1.5} />
    </Svg>
  );
}

// ─── ImageCard ────────────────────────────────────────────────────────────────
type ImageCardProps = {
  image: ImageItem;
  index: number;
  selected: boolean;
  isManageMode: boolean;
  isSelectedForDelete: boolean;
  onPress: () => void;
};

function ImageCard({ image, index, selected, isManageMode, isSelectedForDelete, onPress }: ImageCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(450)}
      style={{ width: '50%', paddingHorizontal: 6, paddingBottom: 14 }}
    >
      <Pressable onPress={onPress}>
        {/* Image container */}
        <View style={{ aspectRatio: 3 / 4, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <Image
            source={{ uri: image.url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Normal selection highlight */}
          {!isManageMode && selected && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: 16, borderWidth: 2, borderColor: '#34d399',
              }} />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(52,211,153,0.06)' }} />
              <View style={{
                position: 'absolute', top: 10, right: 10,
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: '#34d399', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckIcon color="black" size={15} />
              </View>
            </Animated.View>
          )}

          {/* Manage mode — delete checkbox */}
          {isManageMode && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <View style={{
                width: 28, height: 28, borderRadius: 14, borderWidth: 2,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: isSelectedForDelete ? '#ef4444' : 'rgba(0,0,0,0.4)',
                borderColor: isSelectedForDelete ? '#ef4444' : '#71717a',
              }}>
                {isSelectedForDelete && <CheckIcon color="white" size={14} />}
              </View>
            </Animated.View>
          )}

          {/* Default border */}
          {!(selected && !isManageMode) && (
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 16, borderWidth: 1, borderColor: 'rgba(39,39,42,0.5)',
            }} />
          )}
        </View>

        {/* Image label */}
        <View style={{ paddingHorizontal: 4, paddingTop: 6 }}>
          <Text numberOfLines={1} style={{ color: '#d4d4d8', fontSize: 13 }}>{image.name}</Text>
          <Text style={{ color: '#52525b', fontSize: 11 }}>{image.type}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyGallery() {
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);

  const handleImageSelect = (id: number) => {
    if (isManageMode) {
      setSelectedForDelete(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedImage(selectedImage === id ? null : id);
    }
  };

  const handleUseImage = () => {
    console.log('Using image:', selectedImage);
  };

  const handleDelete = () => {
    setImages(prev => prev.filter(img => !selectedForDelete.includes(img.id)));
    setSelectedForDelete([]);
    setIsManageMode(false);
  };

  const handleToggleManage = () => {
    setIsManageMode(!isManageMode);
    setSelectedForDelete([]);
    setSelectedImage(null);
  };

  // AiHeader 右侧"管理 / 完成"按钮
  const manageButton = (
    <Pressable
      onPress={handleToggleManage}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{
        color: isManageMode ? '#34d399' : '#a1a1aa',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Noto Sans SC',
      }}>
        {isManageMode ? '完成' : '管理'}
      </Text>
    </Pressable>
  );

  // ── Empty State ──────────────────────────────────────────────────
  if (images.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b' }}>
        <AiHeader title="我的图库" className="px-5 py-4" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center' }}>
            <View style={{
              width: 80, height: 80, borderRadius: 16,
              backgroundColor: '#18181b', borderWidth: 1, borderColor: 'rgba(39,39,42,0.5)',
              alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            }}>
              <ImagePlaceholderIcon />
            </View>
            <Text style={{ color: '#e4e4e7', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
              你还没有图片
            </Text>
            <Text style={{ color: '#71717a', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
              上传参考图或保存生成结果后，会显示在这里
            </Text>
            <Pressable style={{
              paddingHorizontal: 24, paddingVertical: 12,
              backgroundColor: 'rgba(16,185,129,0.9)', borderRadius: 12,
            }}>
              <Text style={{ color: 'black', fontWeight: '500' }}>返回创建人物</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ── Gallery State ────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <AiHeader title="我的图库" className="px-5 py-4" rightElement={manageButton} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20, paddingBottom: 128 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              selected={selectedImage === image.id}
              isManageMode={isManageMode}
              isSelectedForDelete={selectedForDelete.includes(image.id)}
              onPress={() => handleImageSelect(image.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* 底部操作按钮 */}
      {!isManageMode && selectedImage && (
        <Animated.View
          entering={SlideInDown.springify().damping(25).stiffness(300)}
          exiting={SlideOutDown.duration(200)}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.85)',
          }}
        >
          <Pressable
            onPress={handleUseImage}
            style={{
              paddingVertical: 16, borderRadius: 16,
              backgroundColor: 'rgba(16,185,129,0.9)',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>使用这张图片</Text>
          </Pressable>
        </Animated.View>
      )}

      {isManageMode && selectedForDelete.length > 0 && (
        <Animated.View
          entering={SlideInDown.springify().damping(25).stiffness(300)}
          exiting={SlideOutDown.duration(200)}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 }}
        >
          <Pressable
            onPress={handleDelete}
            style={{
              paddingVertical: 16, borderRadius: 16,
              backgroundColor: 'rgba(239,68,68,0.9)',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <TrashIcon color="white" size={20} />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              删除 {selectedForDelete.length} 张图片
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
