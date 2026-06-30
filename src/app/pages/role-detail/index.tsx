import type { ImageSourcePropType } from 'react-native';
import type { TsRoleAuthorPublic, TsRoleDetail } from '@/lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Image, Platform, Pressable, SafeAreaView, Text, View } from 'react-native';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiMoreBtn } from '@/components/ai-company/ai-more-btn';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import { styles } from '@/components/pages/role-detail/role-detail.styles';
import { pickTsImageUrl, tsRoleApi } from '@/lib/api';

const imgAddUser = require('../../../assets/images/role-detail/add_user.svg');
const imgAuthorAvatarFallback = require('../../../assets/images/role-detail/author_avatar.png');
const imgBg = require('../../../assets/images/role-detail/bg.png');
const imgClose = require('../../../assets/images/role-detail/close.svg');
const imgMore = require('../../../assets/images/role-detail/more.svg');
const imgRoleBadge = require('../../../assets/images/role-detail/role_avatar.png');
const imgVerified = require('../../../assets/images/role-detail/verified.svg');

type TabKey = 'about' | 'story';
type RoleDetailDataState = {
  role: TsRoleDetail | null;
  author: TsRoleAuthorPublic | null;
  loading: boolean;
  loadError: string | null;
};

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function toRemoteSource(url?: string | null): ImageSourcePropType | null {
  if (!url) {
    return null;
  }
  return { uri: url };
}

function toAssetUri(source?: ImageSourcePropType | null) {
  if (!source) {
    return '';
  }
  if (typeof source === 'number') {
    return (Image.resolveAssetSource(source) as any)?.uri ?? '';
  }
  if (typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
    return source.uri;
  }
  return (source as any)?.default ?? '';
}

function useRoleDetailData(roleId: number | null): RoleDetailDataState {
  const [state, setState] = React.useState<RoleDetailDataState>({
    role: null,
    author: null,
    loading: false,
    loadError: null,
  });

  React.useEffect(() => {
    let alive = true;
    if (!roleId) {
      return () => {
        alive = false;
      };
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, loadError: null }));
      const [roleResult, authorResult] = await Promise.allSettled([
        tsRoleApi.getRoleDetail(roleId),
        tsRoleApi.getRoleAuthorPublic(roleId),
      ]);
      if (!alive) {
        return;
      }

      const failedMessages: string[] = [];
      if (roleResult.status !== 'fulfilled') {
        failedMessages.push('角色信息加载失败');
      }
      if (authorResult.status !== 'fulfilled') {
        failedMessages.push('作者信息加载失败');
      }

      setState(prev => ({
        role: roleResult.status === 'fulfilled' ? roleResult.value : prev.role,
        author: authorResult.status === 'fulfilled' ? authorResult.value : prev.author,
        loading: false,
        loadError: failedMessages.length > 0 ? failedMessages.join('，') : null,
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
  }, [roleId]);

  return state;
}

type BottomSectionProps = {
  activeTab: TabKey;
  author: TsRoleAuthorPublic | null;
  authorAvatarSource: ImageSourcePropType;
  displayAuthorName: string;
  displayRoleName: string;
  loadError: string | null;
  loading: boolean;
  onTabChange: (next: TabKey) => void;
  tabContent: string;
};

function RoleDetailBottomSection(props: BottomSectionProps) {
  const {
    activeTab,
    author,
    authorAvatarSource,
    displayAuthorName,
    displayRoleName,
    loadError,
    loading,
    onTabChange,
    tabContent,
  } = props;

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.bottomSection}>
        <div style={webStyles.headerRow}>
          <div style={webStyles.nameRow}>
            <div style={webStyles.characterName}>{displayRoleName}</div>
            <img
              src={toAssetUri(imgRoleBadge)}
              style={webStyles.roleAvatar}
            />
          </div>

          <button type="button" style={webStyles.followButton}>
            <img
              src={toAssetUri(imgAddUser)}
              style={webStyles.followIcon}
            />
            <div style={webStyles.followText}>关注</div>
          </button>
        </div>

        <div style={webStyles.authorRow}>
          <div style={webStyles.authorLabel}>作者：</div>
          <img
            src={toAssetUri(authorAvatarSource)}
            style={webStyles.authorAvatar}
          />
          <div style={webStyles.authorName}>{displayAuthorName}</div>
          {(author?.verified ?? 0) > 0
            ? (
                <img
                  src={toAssetUri(imgVerified)}
                  style={webStyles.verifiedIcon}
                />
              )
            : null}
        </div>

        <div style={webStyles.statsRow}>
          <div style={webStyles.statItem}>
            <div style={webStyles.statValue}>--</div>
            <div style={webStyles.statLabel}>连接者</div>
          </div>
          <div style={webStyles.statItem}>
            <div style={webStyles.statValue}>--</div>
            <div style={webStyles.statLabel}>粉丝</div>
          </div>
          <div style={webStyles.statItem}>
            <div style={webStyles.statValue}>--</div>
            <div style={webStyles.statLabel}>对话数</div>
          </div>
        </div>

        <div style={webStyles.tabsWrap}>
          <AiNavigateTabs
            options={[
              { label: '关于 TA', value: 'about' },
              { label: '故事', value: 'story' },
            ]}
            activeValue={activeTab}
            onChange={val => onTabChange(val as TabKey)}
            activeTextClassName="text-brand-green/90 text-[20px] font-bold pb-[8px]"
            inactiveTextClassName="text-[#e7e7e7] text-[20px] pb-[8px]"
            indicatorClassName="absolute bottom-0 h-1 bg-brand-green/90 rounded-[2px]"
            containerClassName="flex-row items-center gap-[30px]"
          />
        </div>

        <div style={webStyles.contentWrap}>
          <div style={webStyles.contentText}>{tabContent}</div>
          {loading ? <div style={webStyles.loadingText}>加载中...</div> : null}
          {loadError ? <div style={webStyles.errorText}>{loadError}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <View style={styles.bottomSection}>
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <Text style={styles.characterName}>{displayRoleName}</Text>
          <Image
            source={imgRoleBadge}
            style={styles.roleAvatar}
            resizeMode="contain"
          />
        </View>

        <Pressable style={styles.followButton}>
          <Image
            source={imgAddUser}
            style={styles.followIcon}
            resizeMode="contain"
          />
          <Text style={styles.followText}>关注</Text>
        </Pressable>
      </View>

      <View style={styles.authorRow}>
        <Text style={styles.authorLabel}>作者：</Text>
        <Image
          source={authorAvatarSource}
          style={styles.authorAvatar}
        />
        <Text style={styles.authorName}>{displayAuthorName}</Text>
        {(author?.verified ?? 0) > 0
          ? (
              <Image
                source={imgVerified}
                style={styles.verifiedIcon}
                resizeMode="contain"
              />
            )
          : null}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statLabel}>连接者</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statLabel}>粉丝</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statLabel}>对话数</Text>
        </View>
      </View>

      <View style={{ marginBottom: 14 }}>
        <AiNavigateTabs
          options={[
            { label: '关于 TA', value: 'about' },
            { label: '故事', value: 'story' },
          ]}
          activeValue={activeTab}
          onChange={val => onTabChange(val as TabKey)}
          activeTextClassName="text-brand-green/90 text-[20px] font-bold pb-[8px]"
          inactiveTextClassName="text-[#e7e7e7] text-[20px] pb-[8px]"
          indicatorClassName="absolute bottom-0 h-1 bg-brand-green/90 rounded-[2px]"
          containerClassName="flex-row items-center gap-[30px]"
        />
      </View>
      <View style={{ marginTop: 14 }}>
        <Text style={{ color: '#E7E7E7', fontSize: 14, lineHeight: 22 }}>
          {tabContent}
        </Text>
        {loading ? <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>加载中...</Text> : null}
        {loadError ? <Text style={{ color: '#FCA5A5', fontSize: 12, marginTop: 8 }}>{loadError}</Text> : null}
      </View>
    </View>
  );
}

export default function RoleDetail() {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const params = useLocalSearchParams<{ roleId?: string | string[]; id?: string | string[] }>();
  const roleId = useMemo(() => {
    const raw = firstParam(params.roleId) ?? firstParam(params.id);
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [params.id, params.roleId]);

  const { role, author, loading, loadError } = useRoleDetailData(roleId);
  const backgroundSource = toRemoteSource(pickTsImageUrl(role, 'character_image', 'character_avatar')) ?? imgBg;
  const authorAvatarSource = toRemoteSource(author?.avatar) ?? imgAuthorAvatarFallback;
  const displayRoleName = role?.roleName || '角色';
  const displayAuthorName = author?.displayName || '作者';
  const tabContent = activeTab === 'about'
    ? (role?.greeting?.trim() || '')
    : (role?.backgroundStory || '暂无故事内容');

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <div style={webStyles.page}>
          <img
            src={toAssetUri(backgroundSource)}
            style={webStyles.backgroundImage}
          />
          <div style={webStyles.overlay}>
            <div style={webStyles.topNav}>
              <AiCloseBtn
                iconSource={imgClose}
                iconWidth={16}
                iconHeight={16}
                iconTintColor="#ffffff"
                onPress={() => router.back()}
                style={webStyles.navButton}
              />
              <AiMoreBtn
                iconSource={imgMore}
                iconWidth={20}
                iconHeight={20}
                iconTintColor="#ffffff"
                style={webStyles.navButton}
              />
            </div>

            <div style={webStyles.centerWrap}>
              <RoleDetailBottomSection
                activeTab={activeTab}
                author={author}
                authorAvatarSource={authorAvatarSource}
                displayAuthorName={displayAuthorName}
                displayRoleName={displayRoleName}
                loadError={loadError}
                loading={loading}
                onTabChange={setActiveTab}
                tabContent={tabContent}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={backgroundSource}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)', '#000']}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.overlay}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.topNav}>
              <AiCloseBtn
                iconSource={imgClose}
                iconWidth={16}
                iconHeight={16}
                iconTintColor="#ffffff"
                onPress={() => router.back()}
                style={styles.navButton}
              />
              <AiMoreBtn
                iconSource={imgMore}
                iconWidth={20}
                iconHeight={20}
                iconTintColor="#ffffff"
                style={styles.navButton}
              />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: '30%' }}>
              <RoleDetailBottomSection
                activeTab={activeTab}
                author={author}
                authorAvatarSource={authorAvatarSource}
                displayAuthorName={displayAuthorName}
                displayRoleName={displayRoleName}
                loadError={loadError}
                loading={loading}
                onTabChange={setActiveTab}
                tabContent={tabContent}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </>
  );
}

const webStyles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.78) 72%, #000000 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  topNav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '18px 20px 0',
    boxSizing: 'border-box',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  navIcon: {
    width: 16,
    height: 16,
    objectFit: 'contain',
  },
  moreIcon: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
  centerWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '30vh',
  },
  bottomSection: {
    width: '100%',
    padding: '0 20px 40px',
    boxSizing: 'border-box',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 700,
    color: '#ffffff',
    marginRight: 8,
    lineHeight: '34px',
  },
  roleAvatar: {
    width: 14,
    height: 20,
    objectFit: 'contain',
  },
  followButton: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    border: '1.5px solid rgba(155,254,3,0.9)',
    borderRadius: 20,
    padding: '8px 16px',
    background: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
  },
  followIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    objectFit: 'contain',
  },
  followText: {
    color: 'rgba(var(--color-brand-green-rgb), 0.9)',
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '20px',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  authorLabel: {
    color: '#ffffff',
    fontSize: 14,
    marginRight: 4,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    marginRight: 6,
    objectFit: 'cover',
  },
  authorName: {
    color: 'rgba(var(--color-brand-green-rgb), 0.9)',
    fontSize: 14,
    marginRight: 4,
  },
  verifiedIcon: {
    width: 10,
    height: 14,
    objectFit: 'contain',
  },
  statsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    marginBottom: 32,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
  },
  statLabel: {
    color: '#e7e7e7',
    fontSize: 12,
  },
  tabsWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 30,
    marginBottom: 14,
  },
  tabBtn: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    position: 'relative',
  },
  activeTabBtn: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    position: 'relative',
  },
  tabText: {
    color: '#e7e7e7',
    fontSize: 20,
    lineHeight: '28px',
    paddingBottom: 8,
  },
  activeTabText: {
    color: 'rgba(var(--color-brand-green-rgb), 0.9)',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    paddingBottom: 8,
  },
  tabIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    borderRadius: 2,
    background: 'rgba(var(--color-brand-green-rgb), 0.9)',
  },
  contentWrap: {
    marginTop: 14,
  },
  contentText: {
    color: '#E7E7E7',
    fontSize: 14,
    lineHeight: '22px',
    whiteSpace: 'pre-wrap',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    marginTop: 8,
  },
};
