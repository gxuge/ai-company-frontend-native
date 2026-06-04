import type { ImageSourcePropType } from 'react-native';
import type { TsStory, TsStoryChapter } from '@/lib/api';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiMoreBtn } from '@/components/ai-company/ai-more-btn';
import { tsChatApi, tsRoleApi, tsStoryApi } from '@/lib/api';
import StoryDetailModal from './components/StoryDetailModal';

const imgCharacter1 = require('../../../assets/images/conversation-detail/imgCharacter1.png');
const imgCharacter2 = require('../../../assets/images/conversation-detail/imgCharacter2.png');
const imgCharacter3 = require('../../../assets/images/conversation-detail/imgCharacter3.png');
const imgCharacter4 = require('../../../assets/images/conversation-detail/imgCharacter4.png');
const imgCharacter5 = require('../../../assets/images/conversation-detail/imgCharacter5.png');

const imgCloseIcon = require('../../../assets/images/conversation-detail/imgCloseIcon.svg');
const imgContainer = require('../../../assets/images/conversation-detail/imgContainer.svg');
const imgCreatorAvatar = require('../../../assets/images/conversation-detail/imgCreatorAvatar.png');
const imgFluentAdd12Filled = require('../../../assets/images/conversation-detail/imgFluentAdd12Filled.svg');
const imgGrandAtmosphericPalaceInteriorWithChandelier = require('../../../assets/images/conversation-detail/imgGrandAtmosphericPalaceInteriorWithChandelier.png');
const imgGroup1 = require('../../../assets/images/conversation-detail/imgGroup1.svg');
const imgIcon = require('../../../assets/images/conversation-detail/imgIcon.svg');
const imgMoreSquare41 = require('../../../assets/images/conversation-detail/imgMoreSquare41.svg');

type CharacterCard = {
  id: number;
  name: string;
  avatarSource: ImageSourcePropType;
};

type ConversationDetailState = {
  story: TsStory | null;
  chapters: TsStoryChapter[];
  characterCards: CharacterCard[];
  loading: boolean;
  loadError: string | null;
};

const FALLBACK_DESCRIPTION = '暂无故事简介';
const FALLBACK_TITLE = '故事详情';
const FALLBACK_AUTHOR = '匿名作者';
const FALLBACK_CHARACTER_SOURCES: ImageSourcePropType[] = [
  imgCharacter1,
  imgCharacter2,
  imgCharacter3,
  imgCharacter4,
  imgCharacter5,
];

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function parsePositiveInt(value?: string | string[]) {
  const raw = firstParam(value);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.trunc(parsed);
}

function toRemoteSource(url?: string | null): ImageSourcePropType | null {
  if (!url) {
    return null;
  }
  return { uri: url };
}

function toAssetUri(source: ImageSourcePropType) {
  if (typeof source === 'string') {
    return source;
  }
  if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
    return source.uri;
  }
  const candidate = source as { default?: string; uri?: string } | number;
  if (typeof candidate === 'object') {
    if (typeof candidate.default === 'string') {
      return candidate.default;
    }
    if (typeof candidate.uri === 'string') {
      return candidate.uri;
    }
  }
  return '';
}

function buildFallbackCharacters() {
  return [
    { id: 1, name: '角色1', avatarSource: imgCharacter1 },
    { id: 2, name: '角色2', avatarSource: imgCharacter2 },
    { id: 3, name: '角色3', avatarSource: imgCharacter3 },
    { id: 4, name: '角色4', avatarSource: imgCharacter4 },
    { id: 5, name: '角色5', avatarSource: imgCharacter5 },
  ] satisfies CharacterCard[];
}

function buildDescription(story: TsStory | null) {
  if (!story) {
    return FALLBACK_DESCRIPTION;
  }
  const parts = [story.storyIntro, story.storySetting, story.storyBackground]
    .map(item => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
  if (parts.length === 0) {
    return FALLBACK_DESCRIPTION;
  }
  return Array.from(new Set(parts)).join('\n');
}

async function resolveStoryId(params: {
  storyId?: string | string[];
  id?: string | string[];
  sessionId?: string | string[];
}) {
  const directStoryId = parsePositiveInt(params.storyId) ?? parsePositiveInt(params.id);
  if (directStoryId) {
    return directStoryId;
  }

  const sessionId = parsePositiveInt(params.sessionId);
  if (sessionId) {
    try {
      const session = await tsChatApi.getSessionDetail(sessionId);
      if (typeof session?.storyId === 'number' && Number.isFinite(session.storyId) && session.storyId > 0) {
        return Math.trunc(session.storyId);
      }
    }
    catch {
      // noop: fallback to latest story below
    }
  }

  try {
    const storyPage = await tsStoryApi.getStoryList({ pageNo: 1, pageSize: 1 });
    const firstStoryId = storyPage?.records?.[0]?.id;
    if (typeof firstStoryId === 'number' && Number.isFinite(firstStoryId) && firstStoryId > 0) {
      return Math.trunc(firstStoryId);
    }
  }
  catch {
    return null;
  }

  return null;
}

async function buildCharacterCards(story: TsStory | null) {
  const roleIds = Array.from(
    new Set(
      (story?.roleBindings || [])
        .map(item => Number(item.roleId))
        .filter(id => Number.isFinite(id) && id > 0),
    ),
  );

  if (roleIds.length === 0) {
    return buildFallbackCharacters();
  }

  const roleResults = await Promise.allSettled(roleIds.map(roleId => tsRoleApi.getRoleDetail(roleId)));
  const cards: CharacterCard[] = [];

  roleResults.forEach((result, index) => {
    const fallbackSource = FALLBACK_CHARACTER_SOURCES[index % FALLBACK_CHARACTER_SOURCES.length];
    const fallbackRoleId = roleIds[index];
    if (result.status !== 'fulfilled') {
      cards.push({
        id: fallbackRoleId,
        name: `角色${fallbackRoleId}`,
        avatarSource: fallbackSource,
      });
      return;
    }

    const role = result.value;
    cards.push({
      id: role.id,
      name: role.roleName || role.roleSubtitle || `角色${role.id}`,
      avatarSource: toRemoteSource(role.avatarUrl || role.coverUrl) ?? fallbackSource,
    });
  });

  return cards.length > 0 ? cards : buildFallbackCharacters();
}

function useConversationDetailData(storyIdParam?: string | string[], idParam?: string | string[], sessionIdParam?: string | string[]) {
  const [state, setState] = React.useState<ConversationDetailState>(() => ({
    story: null,
    chapters: [],
    characterCards: buildFallbackCharacters(),
    loading: false,
    loadError: null,
  }));

  React.useEffect(() => {
    let alive = true;
    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, loadError: null }));
      const storyId = await resolveStoryId({
        storyId: storyIdParam,
        id: idParam,
        sessionId: sessionIdParam,
      });
      if (!alive) {
        return;
      }

      if (!storyId) {
        setState(prev => ({
          ...prev,
          loading: false,
          loadError: '未找到可展示的故事数据',
        }));
        return;
      }

      const [storyResult, chapterResult] = await Promise.allSettled([
        tsStoryApi.getStoryDetail(storyId),
        tsStoryApi.getStoryChapterList({ pageNo: 1, pageSize: 50, storyId }),
      ]);

      if (!alive) {
        return;
      }

      const story = storyResult.status === 'fulfilled' ? storyResult.value : null;
      const chapters = chapterResult.status === 'fulfilled' ? (chapterResult.value?.records || []) : [];
      const characterCards = await buildCharacterCards(story);
      if (!alive) {
        return;
      }

      const failedMessages: string[] = [];
      if (storyResult.status !== 'fulfilled') {
        failedMessages.push('故事详情加载失败');
      }
      if (chapterResult.status !== 'fulfilled') {
        failedMessages.push('章节列表加载失败');
      }

      setState({
        story,
        chapters,
        characterCards,
        loading: false,
        loadError: failedMessages.length > 0 ? failedMessages.join('；') : null,
      });
    };

    loadData().catch((error) => {
      if (!alive) {
        return;
      }
      const message = error instanceof Error ? error.message : '会话详情加载失败';
      setState(prev => ({ ...prev, loading: false, loadError: message }));
    });

    return () => {
      alive = false;
    };
  }, [idParam, sessionIdParam, storyIdParam]);

  return state;
}

export default function Body() {
  const [storyDetailVisible, setStoryDetailVisible] = React.useState(false);
  const params = useLocalSearchParams<{ storyId?: string | string[]; id?: string | string[]; sessionId?: string | string[] }>();
  const { story, chapters, characterCards, loading, loadError } = useConversationDetailData(
    params.storyId,
    params.id,
    params.sessionId,
  );

  const title = story?.title || FALLBACK_TITLE;
  const creatorName = story?.createdName || story?.updatedName || FALLBACK_AUTHOR;
  const description = buildDescription(story);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imgGrandAtmosphericPalaceInteriorWithChandelier}
        style={styles.backgroundImage}
      >
        <View style={styles.gradientOverlay} />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <AiCloseBtn
            iconSource={imgCloseIcon}
            customWidth="w-[44px]"
            customHeight="h-[44px]"
            radius="rounded-[22px]"
            iconWidth={20}
            iconHeight={20}
            className="ml-[8px] mt-[4px]"
          />
          <AiMoreBtn iconSource={imgMoreSquare41} className="mr-[8px] mt-[4px]" />
        </View>

        <div style={debugStyles.scrollBody}>
          <div style={debugStyles.contentHeader}>
            <div style={debugStyles.title}>{title}</div>

            <div style={debugStyles.creatorCard}>
              <div style={debugStyles.creatorInfo}>
                <img src={toAssetUri(imgCreatorAvatar)} style={debugStyles.avatar} />
                <div style={debugStyles.creatorName}>{creatorName}</div>
              </div>
              <button type="button" style={debugStyles.followButton}>
                <img src={toAssetUri(imgFluentAdd12Filled)} style={debugStyles.addIcon} />
                <span style={debugStyles.followText}>关注</span>
              </button>
            </div>

            <div style={debugStyles.descriptionContainer}>
              <div style={debugStyles.descriptionText}>{description}</div>
            </div>

            <button type="button" style={debugStyles.storyDetailButton} onClick={() => setStoryDetailVisible(true)}>
              <span style={debugStyles.storyDetailText}>故事详情</span>
              <img src={toAssetUri(imgIcon)} style={debugStyles.chevronIcon} />
            </button>

            {loading ? <div style={debugStyles.dataHintText}>加载中...</div> : null}
            {loadError ? <div style={debugStyles.dataErrorText}>{loadError}</div> : null}
          </div>

          <div style={debugStyles.card}>
            <div style={debugStyles.cardTitle}>角色列表</div>
            <div style={debugStyles.characterRow}>
              {characterCards.map(character => (
                <div key={character.id} style={debugStyles.characterItem}>
                  <div style={debugStyles.characterImageContainer}>
                    <img src={toAssetUri(character.avatarSource)} style={debugStyles.characterImage} />
                  </div>
                  <div style={debugStyles.characterName}>{character.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={debugStyles.impressionCard}>
            <div style={debugStyles.impressionLeft}>
              <div style={debugStyles.impressionIconContainer}>
                <img src={toAssetUri(imgGroup1)} style={debugStyles.impressionIcon} />
              </div>
              <div style={debugStyles.cardTitle}>观感</div>
            </div>
            <img src={toAssetUri(imgContainer)} style={debugStyles.chevronIconLight} />
          </div>

          <div style={debugStyles.bottomSpacer} />
        </div>

        {storyDetailVisible
          ? (
              <StoryDetailModal
                onClose={() => setStoryDetailVisible(false)}
                storyTitle={title}
                storySetting={story?.storySetting}
                storyBackground={story?.storyBackground || story?.storyIntro}
                chapters={chapters}
                loading={loading}
                loadError={loadError}
              />
            )
          : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.4)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 18,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  contentHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    marginBottom: 30,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
    marginLeft: 12,
    flexShrink: 1,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9bfe03',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addIcon: {
    width: 14,
    height: 14,
    tintColor: '#000000',
    marginRight: 4,
  },
  followText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 26,
    textAlign: 'left',
  },
  storyDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(155, 254, 3, 0.8)',
    backgroundColor: 'transparent',
  },
  storyDetailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9bfe03',
    marginRight: 8,
  },
  chevronIcon: {
    width: 8,
    height: 12,
    tintColor: '#9bfe03',
  },
  dataHintText: {
    marginTop: 10,
    color: '#9ca3af',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  dataErrorText: {
    marginTop: 8,
    color: '#fca5a5',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  characterListCard: {
    backgroundColor: 'rgba(22, 22, 22, 0.8)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  characterScroll: {
    marginTop: 20,
    flexDirection: 'row',
  },
  characterItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  characterImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  characterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    maxWidth: 86,
    textAlign: 'center',
  },
  impressionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 22, 22, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  impressionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impressionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  impressionIcon: {
    width: 18,
    height: 18,
  },
  chevronIconLight: {
    width: 8,
    height: 14,
    tintColor: '#ffffff',
  },
  bottomSpacer: {
    height: 40,
  },
});

const debugStyles: Record<string, React.CSSProperties> = {
  scrollBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '30px 20px 40px',
    boxSizing: 'border-box',
  },
  contentHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 30,
    fontSize: 32,
    fontWeight: 700,
    color: '#ffffff',
    textAlign: 'center',
  },
  creatorCard: {
    width: '100%',
    marginBottom: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    padding: '12px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxSizing: 'border-box',
  },
  creatorInfo: {
    minWidth: 0,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    objectFit: 'cover',
  },
  creatorName: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: 500,
  },
  followButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#9bfe03',
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
  },
  addIcon: {
    width: 14,
    height: 14,
  },
  followText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#000000',
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 30,
  },
  descriptionText: {
    color: '#d1d5db',
    fontSize: 16,
    lineHeight: '26px',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
  },
  storyDetailButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    borderRadius: 30,
    border: '1px solid rgba(155, 254, 3, 0.8)',
    backgroundColor: 'transparent',
  },
  storyDetailText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#9bfe03',
  },
  chevronIcon: {
    width: 8,
    height: 12,
  },
  dataHintText: {
    marginTop: 10,
    alignSelf: 'flex-start',
    color: '#9ca3af',
    fontSize: 12,
  },
  dataErrorText: {
    marginTop: 8,
    alignSelf: 'flex-start',
    color: '#fca5a5',
    fontSize: 12,
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(22, 22, 22, 0.8)',
    borderRadius: 20,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 700,
  },
  impressionCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(22, 22, 22, 0.8)',
    borderRadius: 20,
    padding: 20,
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impressionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  impressionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#262626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  impressionIcon: {
    width: 18,
    height: 18,
  },
  chevronIconLight: {
    width: 8,
    height: 14,
    flexShrink: 0,
  },
  characterRow: {
    display: 'flex',
    gap: 16,
    marginTop: 20,
    overflowX: 'auto',
  },
  characterItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 64,
  },
  characterImageContainer: {
    width: 64,
    height: 64,
    marginBottom: 8,
    borderRadius: '50%',
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  characterName: {
    maxWidth: 86,
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
};
