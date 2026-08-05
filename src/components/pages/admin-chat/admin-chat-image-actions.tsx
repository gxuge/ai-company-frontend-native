import type { TFunction } from 'i18next';
import type { FC, ReactNode } from 'react';
import { Bookmark, Check, Download, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { tsImageApi, tsRoleImageApi } from '@/lib/api';

type AdminChatImageActionsProps = {
  imageUrl: string;
  eventId?: string;
  resourceType?: string;
};

type SaveStatus = 'idle' | 'saving' | 'saved';

type ImageActionButtonProps = {
  accessibilityLabel: string;
  backgroundColor: string;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
  opacity?: number;
};

function ImageActionButton({
  accessibilityLabel,
  backgroundColor,
  disabled,
  icon,
  label,
  onPress,
  opacity = 1,
}: ImageActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={{
        minWidth: 112,
        height: 42,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        opacity,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {icon}
      <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function resolveSourceType(resourceType?: string) {
  if (resourceType === 'role_image' || resourceType === 'story_scene_image') {
    return resourceType;
  }
  return 'ai_generate';
}

function buildFileName(resourceType?: string) {
  const prefix = resourceType === 'story_scene_image' ? 'story-scene' : 'role-image';
  return `${prefix}-${Date.now()}`;
}

function resolveDownloadFileName(contentDisposition: unknown, fallbackFileName: string) {
  if (typeof contentDisposition !== 'string') {
    return fallbackFileName;
  }
  const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    }
    catch {
      return fallbackFileName;
    }
  }
  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1] || fallbackFileName;
}

async function downloadImage(imageUrl: string, fileName: string) {
  const response = await tsImageApi.downloadImage({
    sourceImageUrl: imageUrl,
    fileName,
  });
  const objectUrl = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = resolveDownloadFileName(
    response.headers['content-disposition'],
    `${fileName}.png`,
  );
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}

function resolveSaveLabel(t: TFunction, saveStatus: SaveStatus) {
  if (saveStatus === 'saving') {
    return t('adminChat.imageActions.saving');
  }
  if (saveStatus === 'saved') {
    return t('adminChat.imageActions.saved');
  }
  return t('adminChat.imageActions.save');
}

const AdminChatImageActions: FC<AdminChatImageActionsProps> = ({
  imageUrl,
  eventId,
  resourceType,
}) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }
    setIsDownloading(true);
    try {
      await downloadImage(imageUrl, buildFileName(resourceType));
    }
    catch {
      showMessage({
        message: t('adminChat.imageActions.downloadFailed'),
        type: 'danger',
      });
    }
    finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    if (saveStatus !== 'idle') {
      return;
    }
    if (!eventId) {
      showMessage({
        message: t('adminChat.imageActions.saveFailed'),
        type: 'danger',
      });
      return;
    }

    setSaveStatus('saving');
    try {
      const asset = await tsRoleImageApi.importGeneratedImage({
        sourceImageUrl: imageUrl,
        fileName: buildFileName(resourceType),
        sourceType: resolveSourceType(resourceType),
        sourceKey: eventId,
      });
      setSaveStatus('saved');
      showMessage({
        message: asset?.alreadySaved
          ? t('adminChat.imageActions.alreadySaved')
          : t('adminChat.imageActions.saveSuccess'),
        type: 'success',
      });
    }
    catch {
      setSaveStatus('idle');
      showMessage({
        message: t('adminChat.imageActions.saveFailed'),
        type: 'danger',
      });
    }
  };

  const saveLabel = resolveSaveLabel(t, saveStatus);

  return (
    <View
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <ImageActionButton
        accessibilityLabel={t('adminChat.imageActions.download')}
        backgroundColor="rgba(20,16,14,0.82)"
        disabled={isDownloading}
        icon={isDownloading
          ? <LoaderCircle size={18} color="#ffffff" />
          : <Download size={18} color="#ffffff" />}
        label={t('adminChat.imageActions.download')}
        onPress={() => void handleDownload()}
        opacity={isDownloading ? 0.72 : 1}
      />

      <ImageActionButton
        accessibilityLabel={saveLabel}
        backgroundColor={saveStatus === 'saved'
          ? 'rgba(34,197,94,0.88)'
          : 'rgba(229,69,0,0.9)'}
        disabled={saveStatus !== 'idle'}
        icon={saveStatus === 'saving'
          ? <LoaderCircle size={18} color="#ffffff" />
          : saveStatus === 'saved'
            ? <Check size={18} color="#ffffff" />
            : <Bookmark size={18} color="#ffffff" />}
        label={saveLabel}
        onPress={() => void handleSave()}
        opacity={saveStatus === 'saving' ? 0.72 : 1}
      />
    </View>
  );
};

export default AdminChatImageActions;
