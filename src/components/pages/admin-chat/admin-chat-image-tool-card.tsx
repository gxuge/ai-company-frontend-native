import type { FC } from 'react';
import type { AgentChatStep } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import AdminChatImageActions from './admin-chat-image-actions';

type AdminChatImageToolCardProps = {
  step: AgentChatStep;
};

const AdminChatImageToolCard: FC<AdminChatImageToolCardProps> = ({ step }) => {
  const { t } = useTranslation();
  const imageUrl = step.imageUrl || '';
  const generated = step.status === 'done' && Boolean(imageUrl);
  const failed = step.status === 'error' || (step.status === 'done' && !imageUrl);
  const interrupted = step.status === 'interrupted';

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 3 / 4,
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#211b18',
        borderWidth: 1,
        borderColor: failed ? 'rgba(239,68,68,0.42)' : 'rgba(255,255,255,0.1)',
      }}
    >
      {generated
        ? (
            <>
              <Image
                source={{ uri: imageUrl }}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
              <AdminChatImageActions
                imageUrl={imageUrl}
                eventId={step.eventId}
                resourceType={step.resourceType}
              />
            </>
          )
        : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                paddingHorizontal: 24,
              }}
            >
              {failed || interrupted
                ? (
                    <Text style={{ color: interrupted ? '#d4d4d4' : '#fca5a5', fontSize: 16, fontWeight: '700' }}>
                      {interrupted
                        ? t('adminChat.imageTool.interrupted')
                        : t('adminChat.imageTool.failed')}
                    </Text>
                  )
                : (
                    <>
                      <ActivityIndicator size="large" color="#ff8904" />
                      <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, fontWeight: '700' }}>
                        {t('adminChat.imageTool.generating')}
                      </Text>
                    </>
                  )}
            </View>
          )}
    </View>
  );
};

export default AdminChatImageToolCard;
