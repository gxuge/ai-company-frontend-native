import type { TFunction } from 'i18next';
import type { TsUserImageAsset } from '@/lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, DeviceEventEmitter, FlatList, Image, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { AiEmpty } from '@/components/ai-company/ai-empty';
import { AiHeader } from '@/components/ai-company/ai-header';
import { brandGreenRgba } from '@/components/ui/brand';
import { tsRoleImageApi } from '@/lib/api';

const resolveAsset = (m: any) => m?.default ?? m?.uri ?? m;
const imgCheckBlack = resolveAsset(require('@/assets/images/my-gallery/check_black.svg'));
const imgCheckWhite = resolveAsset(require('@/assets/images/my-gallery/check_white.svg'));
const imgTrashWhite = resolveAsset(require('@/assets/images/my-gallery/trash_white.svg'));
const imgImagePlaceholder = resolveAsset(require('@/assets/images/my-gallery/image_placeholder.svg'));
const imgFabAddRole = resolveAsset(require('@/assets/images/select-role/fab_add_role.svg'));

const PAGE_SIZE = 8;
const ROLE_IMAGE_FILE_NAME_PREFIX = 'role-image-';

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

function resolveSourceTypeLabel(sourceType: string | undefined, t: TFunction) {
  if (!sourceType) {
    return t('contentBrowse.gallery.uncategorized');
  }
  const key = sourceType.trim().toLowerCase();
  if (!key) {
    return t('contentBrowse.gallery.uncategorized');
  }
  const translationKeys: Record<string, string> = {
    reference: 'contentBrowse.gallery.sourceTypes.reference',
    generated: 'contentBrowse.gallery.sourceTypes.generated',
    favorite: 'contentBrowse.gallery.sourceTypes.favorite',
    role_image: 'contentBrowse.gallery.sourceTypes.roleImage',
    story_scene_image: 'contentBrowse.gallery.sourceTypes.storySceneImage',
  };
  return translationKeys[key] ? t(translationKeys[key]) : sourceType;
}

function shouldIncludeRoleGalleryAsset(asset: TsUserImageAsset) {
  const sourceType = typeof asset.sourceType === 'string' ? asset.sourceType.trim().toLowerCase() : '';
  if (sourceType === 'ai_generate' || sourceType === 'role_image') {
    return true;
  }

  const fileName = typeof asset.fileName === 'string' ? asset.fileName.trim().toLowerCase() : '';
  return fileName.startsWith(ROLE_IMAGE_FILE_NAME_PREFIX);
}

function shouldIncludeStoryGalleryAsset(asset: TsUserImageAsset) {
  const sourceType = typeof asset.sourceType === 'string' ? asset.sourceType.trim().toLowerCase() : '';
  return sourceType === 'story_scene_image';
}

function mapAssetToImageItem(asset: TsUserImageAsset, index: number, t: TFunction): ImageItem {
  const id = Number(asset.id);
  const imageUrl = typeof asset.thumbnailUrl === 'string' && asset.thumbnailUrl.trim()
    ? asset.thumbnailUrl.trim()
    : typeof asset.fileUrl === 'string' && asset.fileUrl.trim()
      ? asset.fileUrl.trim()
      : undefined;

  const fallbackName = t('contentBrowse.gallery.imageFallback', {
    id: Number.isFinite(id) ? id : index + 1,
  });
  const name = typeof asset.fileName === 'string' && asset.fileName.trim()
    ? asset.fileName.trim()
    : fallbackName;

  return {
    id,
    url: imageUrl,
    name,
    type: resolveSourceTypeLabel(asset.sourceType, t),
  };
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error && error.message) {
    return String(error.message);
  }
  return fallback;
}

function resolveGalleryPresentation(from: string | undefined, t: TFunction) {
  if (from === 'create-role') {
    return {
      title: t('contentBrowse.gallery.role.title'),
      emptyTitle: t('contentBrowse.gallery.role.emptyTitle'),
      emptyDescription: t('contentBrowse.gallery.role.emptyDescription'),
      emptyActionText: t('contentBrowse.gallery.role.emptyAction'),
    };
  }
  if (from === 'create-story') {
    return {
      title: t('contentBrowse.gallery.story.title'),
      emptyTitle: t('contentBrowse.gallery.story.emptyTitle'),
      emptyDescription: t('contentBrowse.gallery.story.emptyDescription'),
      emptyActionText: t('contentBrowse.gallery.story.emptyAction'),
    };
  }
  return {
    title: t('contentBrowse.gallery.default.title'),
    emptyTitle: t('contentBrowse.gallery.default.emptyTitle'),
    emptyDescription: t('contentBrowse.gallery.default.emptyDescription'),
    emptyActionText: t('contentBrowse.gallery.default.emptyAction'),
  };
}

function ImageCard({ image, index, selected, isManageMode, isSelectedForDelete, onPress }: ImageCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay((index % PAGE_SIZE) * 60).duration(450)}
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
                borderRadius: 16, borderWidth: 2, borderColor: brandGreenRgba(0.9),
              }} />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: brandGreenRgba(0.1) }} />
              <View style={{
                position: 'absolute', top: 10, right: 10,
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: brandGreenRgba(0.9), alignItems: 'center', justifyContent: 'center',
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
  const { i18n, t } = useTranslation();
  const params = useLocalSearchParams<{ from?: string }>();
  const isRoleGallery = params.from === 'create-role';
  const isStoryGallery = params.from === 'create-story';
  const galleryPresentation = resolveGalleryPresentation(params.from, t);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const nextPageRef = useRef(1);
  const pendingAssetsRef = useRef<TsUserImageAsset[]>([]);
  const loadingRequestRef = useRef(false);
  const requestVersionRef = useRef(0);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.1, { duration: 1500 }), -1, true);
  }, [isRoleGallery]);

  const pulseStyle = useAnimatedStyle(() => {
    const progress = (pulse.value - 1) * 10; // 0 -> 1 range
    return {
      transform: [{ scale: pulse.value }],
      boxShadow: `0px 0px ${10 + progress * 10}px ${brandGreenRgba(0.6 + progress * 0.4)}`,
      elevation: 8 + progress * 4,
      borderRadius: 28,
    };
  });

  const loadImages = useCallback(async (reset = false) => {
    if (loadingRequestRef.current) {
      return;
    }

    loadingRequestRef.current = true;
    const requestVersion = requestVersionRef.current;
    const startPage = reset ? 1 : nextPageRef.current;
    const bufferedAssets = reset ? [] : [...pendingAssetsRef.current];
    let pageNo = startPage;
    let backendHasMore = true;
    let scannedPageCount = 0;

    if (reset) {
      setLoading(true);
    }
    else {
      setLoadingMore(true);
    }
    setLoadError(null);

    try {
      const collectedAssets = bufferedAssets;

      while (collectedAssets.length < PAGE_SIZE && backendHasMore && scannedPageCount < 200) {
        const pageData = await tsRoleImageApi.getUserImageAssets({
          pageNo,
          pageSize: PAGE_SIZE,
          ...(isStoryGallery ? { sourceType: 'story_scene_image' } : {}),
        });
        const records = (pageData?.records || [])
          .filter(item => Number.isFinite(Number(item.id)))
          .filter((item) => {
            if (isRoleGallery) {
              return shouldIncludeRoleGalleryAsset(item);
            }
            if (isStoryGallery) {
              return shouldIncludeStoryGalleryAsset(item);
            }
            return true;
          });

        collectedAssets.push(...records);
        backendHasMore = typeof pageData?.pages === 'number' && pageData.pages > 0
          ? pageNo < pageData.pages
          : (pageData?.records || []).length >= PAGE_SIZE;
        pageNo += 1;
        scannedPageCount += 1;
      }

      if (scannedPageCount >= 200) {
        backendHasMore = false;
      }

      if (requestVersion !== requestVersionRef.current) {
        return;
      }

      const nextAssets = collectedAssets.slice(0, PAGE_SIZE);
      pendingAssetsRef.current = collectedAssets.slice(PAGE_SIZE);
      nextPageRef.current = pageNo;
      setHasMore(pendingAssetsRef.current.length > 0 || backendHasMore);
      setImages((current) => {
        const existingIds = new Set(reset ? [] : current.map(item => item.id));
        const mapped = nextAssets
          .filter(item => !existingIds.has(Number(item.id)))
          .map((item, index) => mapAssetToImageItem(item, (reset ? 0 : current.length) + index, t));
        return reset ? mapped : [...current, ...mapped];
      });
    }
    catch (error) {
      if (requestVersion === requestVersionRef.current) {
        setLoadError(extractErrorMessage(error, t('contentBrowse.gallery.loadFailed')));
      }
    }
    finally {
      if (requestVersion === requestVersionRef.current) {
        loadingRequestRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [isRoleGallery, isStoryGallery, t]);

  useEffect(() => {
    requestVersionRef.current += 1;
    loadingRequestRef.current = false;
    nextPageRef.current = 1;
    pendingAssetsRef.current = [];
    setImages([]);
    setHasMore(true);
    void loadImages(true);

    return () => {
      requestVersionRef.current += 1;
      loadingRequestRef.current = false;
    };
  }, [i18n.resolvedLanguage, loadImages]);

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
      setLoadError(t('contentBrowse.gallery.unavailable'));
      return;
    }

    if (isStoryGallery) {
      DeviceEventEmitter.emit('storySceneImageSelected', {
        imageUrl: selectedImageItem.url,
      });
      router.back();
      return;
    }

    const isFromCreateRole = params.from === 'create-role';
    const pathname = isFromCreateRole ? '/pages/create-role' : '/pages/create-character';
    const paramKey = isFromCreateRole ? 'selectedImageUrl' : 'referenceImageUrl';

    router.replace({
      pathname: pathname as any,
      params: {
        [paramKey]: selectedImageItem.url,
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
      setLoadError(t('contentBrowse.gallery.deleteFailed', { count: failedIds.length }));
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

  const handleEmptyAction = () => {
    if (isStoryGallery) {
      router.back();
      return;
    }
    router.push(isRoleGallery ? '/pages/create-role' : '/pages/create-character');
  };

  const manageButton = (
    <Pressable
      onPress={handleToggleManage}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{
        color: isManageMode ? brandGreenRgba(0.9) : '#a1a1aa',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Noto Sans SC',
      }}>
        {isManageMode ? t('contentBrowse.common.done') : t('contentBrowse.common.manage')}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <AiHeader title={galleryPresentation.title} className="px-5 py-4" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#a1a1aa', fontSize: 14 }}>
            {t('contentBrowse.common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <AiHeader title={galleryPresentation.title} className="px-5 py-4" />
        <AiEmpty
          title={galleryPresentation.emptyTitle}
          description={galleryPresentation.emptyDescription}
          actionText={galleryPresentation.emptyActionText}
          onAction={handleEmptyAction}
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <AiHeader title={galleryPresentation.title} className="px-5 py-4" rightElement={manageButton} />

      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20, paddingBottom: 128 }}
        initialNumToRender={PAGE_SIZE}
        maxToRenderPerBatch={PAGE_SIZE}
        windowSize={5}
        onEndReachedThreshold={0.35}
        onEndReached={() => {
          if (hasMore && !loading && !loadingMore) {
            void loadImages();
          }
        }}
        ListHeaderComponent={loadError
          ? (
              <Text style={{ color: '#fca5a5', fontSize: 12, paddingHorizontal: 6, marginBottom: 8 }}>
                {loadError}
              </Text>
            )
          : null}
        ListFooterComponent={loadingMore
          ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                <ActivityIndicator color={brandGreenRgba(0.9)} size="small" />
              </View>
            )
          : null}
        renderItem={({ item: image, index }) => (
          <ImageCard
            image={image}
            index={index}
            selected={selectedImage === image.id}
            isManageMode={isManageMode}
            isSelectedForDelete={selectedForDelete.includes(image.id)}
            onPress={() => handleImageSelect(image.id)}
          />
        )}
      />

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
              borderWidth: 1, borderColor: brandGreenRgba(0.9),
              backgroundColor: brandGreenRgba(0.1),
              alignItems: 'center',
              opacity: selectedImageItem?.url ? 1 : 0.6,
            }}
          >
            <Text style={{ color: brandGreenRgba(0.9), fontSize: 16, fontWeight: '600' }}>
              {t('contentBrowse.common.use')}
            </Text>
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
              {deleting
                ? t('contentBrowse.common.deleting')
                : t('contentBrowse.gallery.deleteCount', { count: selectedForDelete.length })}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {!isStoryGallery && (
        <Animated.View
          entering={FadeIn.delay(300).duration(300)}
          style={[{
            position: 'absolute',
            bottom: (!isManageMode && selectedImage) || (isManageMode && selectedForDelete.length > 0) ? 110 : 40,
            right: 20,
            zIndex: 10,
          }, pulseStyle]}
        >
          <Pressable
            onPress={() => router.push('/pages/create-character')}
            style={({ pressed }) => ({
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderWidth: 1.5,
              borderColor: brandGreenRgba(0.9),
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Image source={imgFabAddRole} style={{ width: 32, height: 32 }} resizeMode="contain" />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
