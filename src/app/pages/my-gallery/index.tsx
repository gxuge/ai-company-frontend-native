import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { AiHeader } from '@/components/ai-company/ai-header';
import { AiEmpty } from '@/components/ai-company/ai-empty';
import { tsRoleImageApi } from '@/lib/api';
import type { TsUserImageAsset } from '@/lib/api';

const resolveAsset = (m: any) => m?.default ?? m?.uri ?? m;
const imgCheckBlack = resolveAsset(require('@/assets/images/my-gallery/check_black.svg'));
const imgCheckWhite = resolveAsset(require('@/assets/images/my-gallery/check_white.svg'));
const imgTrashWhite = resolveAsset(require('@/assets/images/my-gallery/trash_white.svg'));
const imgImagePlaceholder = resolveAsset(require('@/assets/images/my-gallery/image_placeholder.svg'));

const PAGE_SIZE = 60;

const SOURCE_TYPE_LABEL_MAP: Record<string, string> = {
  reference: '\u53C2\u8003\u56FE',
  generated: '\u751F\u6210\u56FE',
  favorite: '\u6536\u85CF\u56FE',
};

type ImageItem = {
  id: number;
  url?: string;
  name: string;
  type: string;
};

type ImageCardProps = {
  image: ImageItem;
  index: number;
  selected: boolean;
  isManageMode: boolean;
  isSelectedForDelete: boolean;
  onPress: () => void;
};

function resolveSourceTypeLabel(sourceType?: string) {
  if (!sourceType) {
    return '\u672A\u5206\u7C7B';
  }
  const key = sourceType.trim().toLowerCase();
  if (!key) {
    return '\u672A\u5206\u7C7B';
  }
  return SOURCE_TYPE_LABEL_MAP[key] || sourceType;
}

function mapAssetToImageItem(asset: TsUserImageAsset, index: number): ImageItem {
  const id = Number(asset.id);
  const imageUrl = typeof asset.thumbnailUrl === 'string' && asset.thumbnailUrl.trim()
    ? asset.thumbnailUrl.trim()
    : typeof asset.fileUrl === 'string' && asset.fileUrl.trim()
      ? asset.fileUrl.trim()
      : undefined;

  const fallbackName = Number.isFinite(id) ? `\u56FE\u7247${id}` : `\u56FE\u7247${index + 1}`;
  const name = typeof asset.fileName === 'string' && asset.fileName.trim()
    ? asset.fileName.trim()
    : fallbackName;

  return {
    id,
    url: imageUrl,
    name,
    type: resolveSourceTypeLabel(asset.sourceType),
  };
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error && error.message) {
    return String(error.message);
  }
  return fallback;
}

function ImageCard({ image, index, selected, isManageMode, isSelectedForDelete, onPress }: ImageCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(450)}
      style={{ width: '50%', paddingHorizontal: 6, paddingBottom: 14 }}
    >
      <Pressable onPress={onPress}>
        <View style={{ aspectRatio: 3 / 4, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <Image
            source={image.url ? { uri: image.url } : imgImagePlaceholder}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

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
                <Image source={imgCheckBlack} style={{ width: 15, height: 15 }} resizeMode="contain" />
              </View>
            </Animated.View>
          )}

          {isManageMode && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <View style={{
                width: 28, height: 28, borderRadius: 14, borderWidth: 2,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: isSelectedForDelete ? '#ef4444' : 'rgba(0,0,0,0.4)',
                borderColor: isSelectedForDelete ? '#ef4444' : '#71717a',
              }}>
                {isSelectedForDelete && <Image source={imgCheckWhite} style={{ width: 14, height: 14 }} resizeMode="contain" />}
              </View>
            </Animated.View>
          )}

          {!(selected && !isManageMode) && (
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 16, borderWidth: 1, borderColor: 'rgba(39,39,42,0.5)',
            }} />
          )}
        </View>

        <View style={{ paddingHorizontal: 4, paddingTop: 6 }}>
          <Text numberOfLines={1} style={{ color: '#d4d4d8', fontSize: 13 }}>{image.name}</Text>
          <Text style={{ color: '#52525b', fontSize: 11 }}>{image.type}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function MyGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const loadImages = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const allAssets: TsUserImageAsset[] = [];
        let pageNo = 1;
        let hasMore = true;

        while (hasMore) {
          const pageData = await tsRoleImageApi.getUserImageAssets({
            pageNo,
            pageSize: PAGE_SIZE,
          });

          const records = pageData?.records || [];
          allAssets.push(...records);

          if (typeof pageData?.pages === 'number' && pageData.pages > 0) {
            hasMore = pageNo < pageData.pages;
          } else {
            hasMore = records.length >= PAGE_SIZE;
          }

          pageNo += 1;
          if (pageNo > 200) {
            break;
          }
        }

        if (!alive) {
          return;
        }

        const mapped = allAssets
          .filter(item => Number.isFinite(Number(item.id)))
          .map((item, index) => mapAssetToImageItem(item, index));

        setImages(mapped);
      } catch (error) {
        if (!alive) {
          return;
        }
        setLoadError(extractErrorMessage(error, '\u56FE\u5E93\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5'));
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadImages().catch((error) => {
      if (!alive) {
        return;
      }
      setLoading(false);
      setLoadError(extractErrorMessage(error, '\u56FE\u5E93\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5'));
    });

    return () => {
      alive = false;
    };
  }, []);

  const selectedImageItem = useMemo(
    () => images.find(item => item.id === selectedImage) || null,
    [images, selectedImage],
  );

  const handleImageSelect = (id: number) => {
    if (isManageMode) {
      setSelectedForDelete(prev =>
        prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
      );
    } else {
      setSelectedImage(selectedImage === id ? null : id);
    }
  };

  const handleUseImage = () => {
    if (!selectedImageItem?.url) {
      setLoadError('\u5F53\u524D\u56FE\u7247\u5730\u5740\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u56DE\u586B');
      return;
    }

    router.replace({
      pathname: '/pages/create-character',
      params: {
        referenceImageUrl: selectedImageItem.url,
      },
    });
  };

  const handleDelete = async () => {
    if (selectedForDelete.length === 0 || deleting) {
      return;
    }

    setDeleting(true);
    setLoadError(null);

    const settled = await Promise.allSettled(
      selectedForDelete.map(id => tsRoleImageApi.deleteUserImageAsset(id)),
    );

    const successIds: number[] = [];
    const failedIds: number[] = [];

    settled.forEach((result, index) => {
      const id = selectedForDelete[index];
      if (result.status === 'fulfilled') {
        successIds.push(id);
      } else {
        failedIds.push(id);
      }
    });

    if (successIds.length > 0) {
      setImages(prev => prev.filter(img => !successIds.includes(img.id)));
      if (selectedImage !== null && successIds.includes(selectedImage)) {
        setSelectedImage(null);
      }
    }

    if (failedIds.length > 0) {
      setSelectedForDelete(failedIds);
      setLoadError(`\u6709 ${failedIds.length} \u5F20\u56FE\u7247\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5`);
    } else {
      setSelectedForDelete([]);
      setIsManageMode(false);
    }

    setDeleting(false);
  };

  const handleToggleManage = () => {
    setIsManageMode(!isManageMode);
    setSelectedForDelete([]);
    setSelectedImage(null);
  };

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
        {isManageMode ? '\u5B8C\u6210' : '\u7BA1\u7406'}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b' }}>
        <AiHeader title="\u6211\u7684\u56FE\u5E93" className="px-5 py-4" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#a1a1aa', fontSize: 14 }}>\u52A0\u8F7D\u4E2D...</Text>
        </View>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b' }}>
        <AiHeader title="\u6211\u7684\u56FE\u5E93" className="px-5 py-4" />
        <AiEmpty 
          title="\u4F60\u8FD8\u6CA1\u6709\u56FE\u7247" 
          description="\u4E0A\u4F20\u53C2\u8003\u56FE\u6216\u4FDD\u5B58\u751F\u6210\u7ED3\u679C\u540E\uFF0C\u4F1A\u663E\u793A\u5728\u8FD9\u91CC" 
          actionText="\u8FD4\u56DE\u521B\u5EFA\u4EBA\u7269"
          onAction={() => router.push('/pages/create-character')}
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <AiHeader title="\u6211\u7684\u56FE\u5E93" className="px-5 py-4" rightElement={manageButton} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20, paddingBottom: 128 }}>
        {loadError ? (
          <Text style={{ color: '#fca5a5', fontSize: 12, paddingHorizontal: 6, marginBottom: 8 }}>
            {loadError}
          </Text>
        ) : null}
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
              opacity: selectedImageItem?.url ? 1 : 0.6,
            }}
          >
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>\u4F7F\u7528\u8FD9\u5F20\u56FE\u7247</Text>
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
              opacity: deleting ? 0.75 : 1,
            }}
          >
            <Image source={imgTrashWhite} style={{ width: 20, height: 20 }} resizeMode="contain" />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {deleting ? '\u5220\u9664\u4E2D...' : `\u5220\u9664 ${selectedForDelete.length} \u5F20\u56FE\u7247`}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
