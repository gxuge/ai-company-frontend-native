import type { TsRoleDetail } from '../../../lib/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Inbox, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AiHeader } from '../../../components/ai-company/ai-header';
import { tsRoleApi } from '../../../lib/api';
import { View, Text, Image, Pressable, TextInput } from 'react-native';

const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/select-role/bfc3c41d1a6b570e1b0987aedf706c872d00b6d5.png'));
const imgFabAddRole = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/select-role/fab_add_role.svg'));

type SelectRoleItem = {
  id: number;
  name: string;
  avatar: any;
  avatarParam: string;
};

function mapRoleToItem(role: TsRoleDetail): SelectRoleItem {
  const avatarParam = (role.avatarUrl || role.coverUrl || '').trim();
  return {
    id: role.id,
    name: (role.roleName || `角色${role.id}`).trim(),
    avatar: avatarParam || imgImage,
    avatarParam,
  };
}

// eslint-disable-next-line max-lines-per-function
export default function App() {
  const { from, storyId } = useLocalSearchParams<{ from?: string; storyId?: string }>();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<SelectRoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const fromPage = Array.isArray(from) ? from[0] : from;
  const currentStoryId = Array.isArray(storyId) ? storyId[0] : storyId;

  useEffect(() => {
    let alive = true;

    const loadRoleList = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const pageData = await tsRoleApi.getRoleList({
          pageNo: 1,
          pageSize: 200,
          status: 1,
        });
        if (!alive) {
          return;
        }
        const mapped = (pageData.records || [])
          .filter((role): role is TsRoleDetail => Boolean(role?.id))
          .map(mapRoleToItem);
        setItems(mapped);
        setSelectedId((prev) => {
          if (prev && mapped.some(role => role.id === prev)) {
            return prev;
          }
          return mapped[0]?.id ?? null;
        });
      }
      catch (error) {
        if (!alive) {
          return;
        }
        console.warn('load role list failed', error);
        setItems([]);
        setSelectedId(null);
        setLoadError('角色加载失败，请稍后重试');
      }
      finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };

    void loadRoleList();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return items;
    }
    return items.filter(item => item.name.toLowerCase().includes(keyword));
  }, [items, search]);

  const selectedRole = useMemo(
    () => items.find(item => item.id === selectedId) || null,
    [items, selectedId],
  );

  const handleDone = () => {
    if (!selectedRole) {
      return;
    }
    if (fromPage === '\u521B\u5EFA\u6545\u4E8B' || fromPage === 'create-story') {
      router.replace({
        pathname: '/pages/create-story',
        params: {
          storyId: currentStoryId,
          selectedRoleId: String(selectedRole.id),
          selectedRoleName: selectedRole.name,
          selectedRoleAvatar: selectedRole.avatarParam,
        },
      });
    }
    else {
      router.back();
    }
  };

  return (
    <View className="relative size-full bg-black overflow-hidden">
      {/* Background layers */}
      <View className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black" />
      <View
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#9BFE03 1px, transparent 1px), linear-gradient(90deg, #9BFE03 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <View className="relative z-10 flex flex-col items-center size-full max-w-[750px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <View className="w-full pt-[50px] pb-4">
          <AiHeader title="选择角色" />
        </View>

        {/* Search bar */}
        <View className="w-full mb-6 sm:mb-8">
          <View className="relative group">
            <TextInput
              
              value={search}
              // @ts-expect-error
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索角色"
              className="w-full h-[56px] sm:h-[68px] bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-full pl-[56px] sm:pl-[72px] pr-6 sm:pr-8 text-white text-[18px] sm:text-[24px] placeholder-[#707070] outline-none border-2 border-white/10 transition-all duration-300"
            />
            <View className="absolute left-[20px] sm:left-[28px] top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#707070] group-focus-within:text-[#9BFE03] transition-colors duration-300" strokeWidth={2.5} />
            </View>
          </View>
        </View>

        {/* Character list */}
        <View className="w-full flex flex-col gap-3 sm:gap-4 pb-[120px] sm:pb-[180px] overflow-y-auto">
          {!isLoading && filtered.length > 0
            ? (
                filtered.map((item) => {
                  const selected = selectedId === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setSelectedId(item.id)}
                      className={`group w-full rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] active:scale-[0.98] ${
                        selected
                          ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-[#9BFE03] shadow-[0_0_30px_rgba(155,254,3,0.35)]'
                          : 'bg-gradient-to-br from-[#222] to-[#1a1a1a] border-2 border-white/5 hover:border-[#9BFE03]/40 hover:shadow-[0_0_20px_rgba(155,254,3,0.2)]'
                      }`}
                    >
                      <View className="flex items-center gap-4">
                        {/* Avatar */}
                        <View className="relative">
                          <View className="size-12 rounded-full shrink-0 ring-2 ring-white/10 group-hover:ring-[#9BFE03]/50 transition-all duration-300 overflow-hidden">
                            <Image
                              source={item.avatar}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </View>
                        </View>

                        {/* Name */}
                        <View className="flex-1 text-left">
                          <Text className="text-base font-medium transition-colors duration-300 text-white group-hover:text-[#9BFE03]/90">
                            {item.name}
                          </Text>
                        </View>

                        {/* Check icon */}
                        <View
                          className={`size-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                            selected
                              ? 'bg-[#9BFE03] scale-100'
                              : 'bg-white/5 scale-0 group-hover:scale-100'
                          }`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 ${
                              selected ? 'text-black' : 'text-[#9BFE03]'
                            }`}
                            strokeWidth={3.5}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })
              )
            : (
                <View className="flex flex-col items-center justify-center text-[#707070] py-[60px] gap-4">
                  <Inbox className="w-16 h-16 opacity-50" strokeWidth={1} />
                  <View className="text-[20px] sm:text-[24px]">
                    {isLoading ? '加载中...' : (loadError || '暂无数据')}
                  </View>
                </View>
              )}
        </View>
      </View>

      {/* Bottom Action Bar */}
      {fromPage === 'create-story' && (
        <View className="fixed bottom-0 left-0 right-0 z-[50] p-[20px] pb-[34px] bg-background/60 backdrop-blur-xl border-t border-white/5">
          <Pressable
            // @ts-expect-error
            type="button"
            onPress={handleDone}
            disabled={!selectedRole}
            className="flex h-[50px] w-full items-center justify-center rounded-[16px] bg-[#9BFE03] shadow-[0_4px_20px_rgba(155,254,3,0.3)] active:scale-95 transition-all outline-none disabled:opacity-50 disabled:grayscale"
          >
            <Text className="text-[16px] font-bold text-black">{`\u5B8C\u6210`}</Text>
          </Pressable>
        </View>
      )}

      {/* Floating action button */}
      <style>
        {`
          @keyframes breathing {
            0% { transform: scale(1); box-shadow: 2px 2px 20px 0px rgba(152,252,3,0.3); }
            50% { transform: scale(1.05); box-shadow: 2px 2px 50px 0px rgba(152,252,3,0.6); }
            100% { transform: scale(1); box-shadow: 2px 2px 20px 0px rgba(152,252,3,0.3); }
          }
          .animate-breathing {
            animation: breathing 2.5s infinite ease-in-out;
          }
        `}
      </style>
      {fromPage === 'create-story' && (
        <Pressable
          // @ts-expect-error
          type="button"
          className="animate-breathing fixed bottom-[120px] right-6 bg-black border border-black rounded-full w-16 h-16 flex items-center justify-center z-[60]"
          onPress={() => {
            router.push('/pages/create-role');
          }}
        >
          <Image source={imgFabAddRole} alt="" className="w-[36px] h-[36px] object-contain" />
        </Pressable>
      )}
      {fromPage !== 'create-story' && (
        <Pressable
          // @ts-expect-error
          type="button"
          className="animate-breathing fixed bottom-[100px] right-6 bg-black border border-black rounded-full w-16 h-16 flex items-center justify-center z-[60]"
          onPress={() => {
            router.push('/pages/create-role');
          }}
        >
          <Image source={imgFabAddRole} alt="" className="w-[36px] h-[36px] object-contain" />
        </Pressable>
      )}
    </View>
  );
}
