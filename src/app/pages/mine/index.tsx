import type { ImageSourcePropType } from 'react-native';
import type { TsRoleDetail, TsStory } from '@/lib/api';
import * as React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import AiBottomTabs from '@/components/ai-company/ai-bottom-tabs';
import { AiEmpty } from '@/components/ai-company/ai-empty';
import { AiSkeleton } from '@/components/ai-company/ai-skeleton';
import { router } from 'expo-router';
import { tsRoleApi } from '@/lib/api/ts-role';
import { tsStoryApi } from '@/lib/api/ts-story';
import { tsChatApi } from '@/lib/api/ts-chat';
import { userApi } from '@/lib/api/user';

const { width } = Dimensions.get('window');
const GRID_GAP = 8;
const GRID_PADDING = 15;
const GRID_ITEM_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP * 2) / 3;
const GRID_ITEM_HEIGHT = GRID_ITEM_WIDTH * 1.5;

const imgCopy = require('../../../assets/images/mine/copy.svg');
const imgEditAvatar = require('../../../assets/images/mine/edit_avatar.svg');
const imgGridImage = require('../../../assets/images/mine/grid_image.png');
const imgProfilePic = require('../../../assets/images/mine/profile_picture.png');
const imgSetting = require('../../../assets/images/mine/setting.svg');
const imgUserAvatar = require('../../../assets/images/mine/user_avatar.png');
const imgViewIcon = require('../../../assets/images/mine/view_icon.png');

type GridItem = {
  id: string;
  originalId: number;
  type: 'story' | 'role';
  image: ImageSourcePropType;
  views: string;
  author: string;
  authorAvatar: ImageSourcePropType;
};

type MineDataState = {
  userInfo: Record<string, unknown> | null;
  stories: TsStory[];
  roles: TsRoleDetail[];
  loading: boolean;
  loadError: string | null;
};

type MineHeaderSectionProps = {
  avatarSource: ImageSourcePropType;
  displayName: string;
  displayUid: string;
  fansStat: string;
  followStat: string;
  likeStat: string;
  onAvatarPress?: () => void;
  onEditPress?: () => void;
};

type MineGridSectionProps = {
  activeGridItems: GridItem[];
  activeTab: number;
  loadError: string | null;
  loading: boolean;
  onTabChange: (value: number) => void;
  onItemPress: (item: GridItem) => void;
};

const FALLBACK_GRID_ITEMS: GridItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `fallback-${i}`,
  originalId: i + 1,
  type: 'story',
  image: imgGridImage,
  views: '--',
  author: '@用户',
  authorAvatar: imgUserAvatar,
}));

const TABS = [
  { label: '故事', value: 0 },
  { label: '角色', value: 1 },
];

function toRemoteSource(url?: string | null): ImageSourcePropType | null {
  if (!url) {
    return null;
  }
  return { uri: url };
}

function toDisplayStat(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return '--';
}

function pickFirstValue(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return null;
  }
  for (const key of keys) {
    const value = source[key];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return value;
    }
  }
  return null;
}

function formatCount(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return '--';
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}w`;
  }
  return String(value);
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function GridCard({ item, onPress }: { item: GridItem; onPress?: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.gridCard}
    >
      <Image source={item.image} style={styles.gridImage} />
      <View style={styles.gridOverlay}>
        <View style={styles.gridAuthorRow}>
          <Image source={item.authorAvatar} style={styles.gridAvatar} />
          <Text style={styles.gridAuthorText} numberOfLines={1}>{item.author}</Text>
        </View>
        <View style={styles.gridViewRow}>
          <Image source={imgViewIcon} style={styles.gridViewIcon} />
          <Text style={styles.gridViewText}>{item.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function useMineData() {
  const [state, setState] = React.useState<MineDataState>({
    userInfo: null,
    stories: [],
    roles: [],
    loading: false,
    loadError: null,
  });

  React.useEffect(() => {
    let alive = true;
    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, loadError: null }));
      const [userResult, storyResult, roleResult] = await Promise.allSettled([
        userApi.getUserInfo(),
        tsStoryApi.getStoryList({ pageNo: 1, pageSize: 30 }),
        tsRoleApi.getRoleList({ pageNo: 1, pageSize: 30, status: 1 }),
      ]);

      if (!alive) {
        return;
      }

      const failedMessages: string[] = [];
      if (userResult.status !== 'fulfilled') {
        failedMessages.push('用户信息加载失败');
      }
      if (storyResult.status !== 'fulfilled') {
        failedMessages.push('故事列表加载失败');
      }
      if (roleResult.status !== 'fulfilled') {
        failedMessages.push('角色列表加载失败');
      }

      setState(prev => ({
        userInfo: userResult.status === 'fulfilled' ? (userResult.value?.userInfo || null) : prev.userInfo,
        stories: storyResult.status === 'fulfilled' ? (storyResult.value?.records || []) : prev.stories,
        roles: roleResult.status === 'fulfilled' ? (roleResult.value?.records || []) : prev.roles,
        loading: false,
        loadError: failedMessages.length > 0 ? failedMessages.join('；') : null,
      }));
    };

    loadData().catch((error) => {
      if (!alive) {
        return;
      }
      const fallbackMessage = error instanceof Error ? error.message : '页面数据加载失败';
      setState(prev => ({ ...prev, loading: false, loadError: fallbackMessage }));
    });

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

function MineHeaderSection(props: MineHeaderSectionProps) {
  const {
    avatarSource,
    displayName,
    displayUid,
    fansStat,
    followStat,
    likeStat,
  } = props;

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingBtn} onPress={() => router.push('/pages/general-setting')}>
          <Image source={imgSetting} style={styles.settingIcon} />
        </TouchableOpacity>

        <View style={styles.avatarWrapper}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={props.onAvatarPress}
            style={styles.avatarRing}
          >
            <Image source={avatarSource} style={styles.avatarImage} />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={props.onEditPress}
            style={styles.editBadge}
          >
            <Image source={imgEditAvatar} style={styles.editBadgeIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.username}>{displayName}</Text>

        <View style={styles.uidRow}>
          <Text style={styles.uidText}>
            UID:
            {' '}
            {displayUid}
          </Text>
          <Image source={imgCopy} style={styles.copyIcon} />
        </View>

        <View style={styles.statsRow}>
          <StatItem value={followStat} label="关注" />
          <StatItem value={fansStat} label="粉丝" />
          <StatItem value={likeStat} label="点赞" />
        </View>
      </View>

    </>
  );
}

function MineGridSection(props: MineGridSectionProps) {
  const {
    activeGridItems,
    activeTab,
    loadError,
    loading,
    onTabChange,
    onItemPress,
  } = props;

  return (
    <>
      <View style={styles.tabBar}>
        <AiNavigateTabs
          options={TABS}
          activeValue={activeTab}
          onChange={value => onTabChange(Number(value))}
          activeTextClassName="text-[rgba(155,254,3,0.9)] text-[18px] font-bold pb-[10px]"
          inactiveTextClassName="text-[#e7e7e7] text-[18px] pb-[10px]"
          indicatorClassName="absolute bottom-[-1px] h-1 bg-[rgba(155,254,3,0.9)] rounded-[2px]"
        />
      </View>

      {loadError ? <Text style={styles.dataErrorText}>{loadError}</Text> : null}

      <View style={styles.gridContainer}>
        {loading && activeGridItems.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <View key={`skeleton-${i}`} style={styles.gridCard}>
              <AiSkeleton width="100%" height="100%" borderRadius={10} />
            </View>
          ))
        ) : activeGridItems.length > 0 ? (
          activeGridItems.map(item => (
            <GridCard key={item.id} item={item} onPress={() => onItemPress(item)} />
          ))
        ) : !loading && !loadError ? (
          <AiEmpty 
            title={activeTab === 0 ? "还没有发布故事" : "还没有发布角色"} 
            description="快去发现页看看大家的创作，或者自己动笔试试吧！" 
            style={{ marginTop: 40, width: width - GRID_PADDING * 2 }}
          />
        ) : null}
      </View>
    </>
  );
}

function useMineViewModel(activeTab: number) {
  const { userInfo, stories, roles, loading, loadError } = useMineData();

  const displayName = React.useMemo(
    () => String(pickFirstValue(userInfo, ['realname', 'nickname', 'username']) || '用户'),
    [userInfo],
  );
  const displayUid = React.useMemo(
    () => String(pickFirstValue(userInfo, ['id', 'username', 'phone']) || '--'),
    [userInfo],
  );
  const avatarSource = React.useMemo(
    () => toRemoteSource(typeof userInfo?.avatar === 'string' ? userInfo.avatar : null) ?? imgProfilePic,
    [userInfo],
  );
  const authorAvatarSource = React.useMemo(
    () => toRemoteSource(typeof userInfo?.avatar === 'string' ? userInfo.avatar : null) ?? imgUserAvatar,
    [userInfo],
  );
  const authorName = React.useMemo(() => `@${displayName}`, [displayName]);

  const followStat = React.useMemo(
    () => toDisplayStat(pickFirstValue(userInfo, ['followCount', 'followingCount', 'focusCount'])),
    [userInfo],
  );
  const fansStat = React.useMemo(
    () => toDisplayStat(pickFirstValue(userInfo, ['fansCount', 'followerCount', 'followersCount'])),
    [userInfo],
  );
  const likeStat = React.useMemo(
    () => toDisplayStat(pickFirstValue(userInfo, ['likeCount', 'likedCount', 'praiseCount'])),
    [userInfo],
  );

  const storyGridItems = React.useMemo<GridItem[]>(
    () => stories.map(story => ({
      id: `story-${story.id}`,
      originalId: story.id,
      type: 'story',
      image: toRemoteSource(story.coverUrl) ?? imgGridImage,
      views: formatCount(story.followerCount ?? story.dialogueCount),
      author: authorName,
      authorAvatar: authorAvatarSource,
    })),
    [authorAvatarSource, authorName, stories],
  );
  const roleGridItems = React.useMemo<GridItem[]>(
    () => roles.map(role => ({
      id: `role-${role.id}`,
      originalId: role.id,
      type: 'role',
      image: toRemoteSource(role.coverUrl || role.avatarUrl) ?? imgGridImage,
      views: '--',
      author: authorName,
      authorAvatar: authorAvatarSource,
    })),
    [authorAvatarSource, authorName, roles],
  );
  const activeGridItems = React.useMemo(() => {
    return activeTab === 0 ? storyGridItems : roleGridItems;
  }, [activeTab, roleGridItems, storyGridItems]);

  return {
    activeGridItems,
    avatarSource,
    displayName,
    displayUid,
    fansStat,
    followStat,
    likeStat,
    loadError,
    loading,
  };
}

export default function Mine() {
  const [activeTab, setActiveTab] = React.useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isResolving, setIsResolving] = React.useState(false);
  const viewModel = useMineViewModel(activeTab);

  const handleAvatarPress = () => {
    setIsPreviewOpen(true);
  };

  const handleEditPress = () => {
    router.push('/pages/user-setting');
  };

  const handleItemPress = async (item: GridItem) => {
    if (isResolving) {
      return;
    }

    setIsResolving(true);
    try {
      const queryParams: any = {};
      if (item.type === 'role') {
        queryParams.targetRoleId = item.originalId;
      } else {
        queryParams.storyId = item.originalId;
      }

      // 1. Try to find an existing session
      const sessions = await tsChatApi.getSessionList({
        ...queryParams,
        pageNo: 1,
        pageSize: 1,
      });

      if (sessions?.records && sessions.records.length > 0) {
        const existsSession = sessions.records[0];
        const pathname = existsSession?.isSystemSession ? '/pages/admin-chat' : '/pages/chat';
        router.push({
          pathname,
          params: { sessionId: String(existsSession.id) },
        });
        return;
      }

      // 2. No session found, create a new one
      const newSession = await tsChatApi.createSession({
        ...queryParams,
        sessionType: item.type === 'role' ? 'single' : 'story',
      });

      if (newSession?.id) {
        const pathname = newSession?.isSystemSession ? '/pages/admin-chat' : '/pages/chat';
        router.push({
          pathname,
          params: { sessionId: String(newSession.id) },
        });
      } else {
        throw new Error('创建会话失败');
      }
    } catch (err) {
      console.error('Failed to resolve chat session:', err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <MineHeaderSection
            avatarSource={viewModel.avatarSource}
            displayName={viewModel.displayName}
            displayUid={viewModel.displayUid}
            fansStat={viewModel.fansStat}
            followStat={viewModel.followStat}
            likeStat={viewModel.likeStat}
            onAvatarPress={handleAvatarPress}
            onEditPress={handleEditPress}
          />
          <MineGridSection
            activeGridItems={viewModel.activeGridItems}
            activeTab={activeTab}
            loadError={viewModel.loadError}
            loading={viewModel.loading || isResolving}
            onTabChange={setActiveTab}
            onItemPress={handleItemPress}
          />
        </ScrollView>
        <View style={styles.tabContainer}>
          <AiBottomTabs activeTab="profile" />
        </View>
      </SafeAreaView>

      {/* Avatar Full-screen Preview Modal */}
      <Modal
        visible={isPreviewOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPreviewOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPreviewOpen(false)}>
          <View style={styles.previewContainer}>
            <View style={{ width: width * 0.85, height: width * 0.85 }}>
              <Image 
                source={viewModel.avatarSource} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
            </View>
            <Text style={styles.previewTip}>点击任意区域关闭</Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const ACCENT = 'rgba(155, 254, 3, 0.9)';
const ACCENT_DIM = 'rgba(155, 254, 3, 0.2)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060a00',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  settingBtn: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  settingIcon: {
    width: 28,
    height: 28,
    tintColor: '#ffffff',
  },
  avatarWrapper: {
    marginTop: 10,
    marginBottom: 18,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: ACCENT,
    padding: 6,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  editBadgeIcon: {
    width: 16,
    height: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  uidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  uidText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 6,
  },
  copyIcon: {
    width: 14,
    height: 14,
    tintColor: '#6b7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
  },
  proContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  proBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  proGlowEffect: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: ACCENT_DIM,
    opacity: 0.3,
  },
  proContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  proLeft: {
    flex: 1,
  },
  proTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  proTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ACCENT,
    letterSpacing: 1,
    marginRight: 10,
  },
  vipBadge: {
    backgroundColor: ACCENT_DIM,
    borderWidth: 1,
    borderColor: 'rgba(155, 254, 3, 0.3)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  vipText: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: '600',
  },
  proDesc: {
    fontSize: 14,
    color: '#9ca3af',
  },
  upgradeBtn: {
    backgroundColor: ACCENT,
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  upgradeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    marginBottom: 10,
  },
  dataHintText: {
    color: '#9ca3af',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  dataErrorText: {
    color: '#fca5a5',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    gap: GRID_GAP,
  },
  gridCard: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  gridAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 4,
  },
  gridAuthorText: {
    fontSize: 10,
    color: '#e7e7e7',
    flex: 1,
  },
  gridViewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridViewIcon: {
    width: 12,
    height: 8,
    marginRight: 3,
    tintColor: '#bfbcbd',
  },
  gridViewText: {
    fontSize: 10,
    color: '#bfbcbd',
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewTip: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 30,
  },
});
