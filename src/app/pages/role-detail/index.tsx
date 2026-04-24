import type { ImageSourcePropType } from 'react-native';
import type { TsRoleAuthorPublic, TsRoleDetail } from '@/lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiMoreBtn } from '@/components/ai-company/ai-more-btn';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import { tsRoleApi } from '@/lib/api';

const imgAddUser = require('../../../assets/images/role-detail/add_user.svg');
const imgAuthorAvatarFallback = require('../../../assets/images/role-detail/author_avatar.png');
const imgBg = require('../../../assets/images/role-detail/bg.png');
const imgClose = require('../../../assets/images/role-detail/close.svg');
const imgMore = require('../../../assets/images/role-detail/more.svg');
const imgRoleBadge = require('../../../assets/images/role-detail/role_avatar.png');
const imgVerified = require('../../../assets/images/role-detail/verified.svg');
const { styles } = require('./components/role-detail.styles');

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

  return (
    <View style={styles.bottomSection}>
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <Text style={styles.characterName}>{displayRoleName}</Text>
          <Image
            source={imgRoleBadge}
            style={styles.roleAvatar}
          />
        </View>

        <Pressable style={styles.followButton}>
          <Image
            source={imgAddUser}
            style={styles.followIcon}
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

      <AiNavigateTabs
        options={[
          { label: '关于 TA', value: 'about' },
          { label: '故事', value: 'story' },
        ]}
        activeValue={activeTab}
        onChange={val => onTabChange(val as TabKey)}
      />
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
  const backgroundSource = toRemoteSource(role?.avatarUrl) ?? toRemoteSource(role?.coverUrl) ?? imgBg;
  const authorAvatarSource = toRemoteSource(author?.avatar) ?? imgAuthorAvatarFallback;
  const displayRoleName = role?.roleName || '角色';
  const displayAuthorName = author?.displayName || '作者';
  const tabContent = activeTab === 'about'
    ? (role?.introText || role?.personaText || role?.occupation || '暂无角色介绍')
    : (role?.storyText || role?.backgroundStory || '暂无故事内容');

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
              <Pressable style={styles.navButton} onPress={() => router.back()}>
                <Image
                  source={imgClose}
                  style={[styles.navIcon, { width: 16, height: 16 }]}
                />
              </Pressable>
              <Pressable style={styles.navButton}>
                <Image
                  source={imgMore}
                  style={[styles.navIcon, { width: 20, height: 20 }]}
                />
              </Pressable>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
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
