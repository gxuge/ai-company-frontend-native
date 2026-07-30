import type { TsDraftContent, TsDraftRecord } from '../../../lib/api';
import { router, useIsFocused } from 'expo-router';
import { BookOpen, UserRound } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { AiHeader } from '../../../components/ai-company/ai-header';
import { tsDraftApi } from '../../../lib/api';

const asset = (m: any) => m?.default ?? m?.uri ?? m;
const imgCardBg3 = asset(require('../../../assets/images/draft/1f4cadfd6427ed31f586e3f9a5ea8178db3011d8.png'));
const imgDeleteIcon3 = asset(require('../../../assets/images/draft/7d1adc8b689fd7114409f0deee545e7f1f15c9fa.png'));
const imgCardBg1 = asset(require('../../../assets/images/draft/3be710d9c7a3c1c90875a63de87782fd2f5b5570.png'));
const imgDeleteIcon1 = asset(require('../../../assets/images/draft/0335f2666c31bbbba5ea57d605cc11706ff4f763.png'));

type DraftType = 'character' | 'story';

const TYPE_CONFIG: Record<DraftType, {
  label: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
}> = {
  character: {
    label: '人物',
    tagBg: '#1e1e2c',
    tagText: '#7878a8',
    tagBorder: '#2e2e48',
  },
  story: {
    label: '故事',
    tagBg: '#1b2218',
    tagText: '#5a8060',
    tagBorder: '#283825',
  },
};

function TypeTag({ type }: { type: DraftType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-sm px-1.5 py-[2px] text-[10px]"
      style={{
        backgroundColor: cfg.tagBg,
        color: cfg.tagText,
        border: `1px solid ${cfg.tagBorder}`,
        lineHeight: '14px',
        fontFamily: '\'Noto Sans SC\', sans-serif',
      }}
    >
      {cfg.label}
    </span>
  );
}

const MAX_AVATARS = 3;

function AvatarRow({ avatars }: { avatars: string[] }) {
  const visible = avatars.slice(0, MAX_AVATARS);
  const extra = avatars.length - MAX_AVATARS;
  return (
    <div className="mt-2 flex items-center">
      {visible.map((src, i) => (
        <div
          key={src}
          className="size-[22px] shrink-0 overflow-hidden rounded-full"
          style={{
            marginLeft: i > 0 ? '-7px' : '0',
            border: '1.5px solid #28292d',
            zIndex: MAX_AVATARS - i,
            position: 'relative',
          }}
        >
          <img src={src} alt="" className="size-full object-cover object-top" />
        </div>
      ))}
      {extra > 0 && (
        <div
          className="flex size-[22px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
          style={{
            marginLeft: '-7px',
            zIndex: 0,
            position: 'relative',
            backgroundColor: '#222230',
            color: '#7878a8',
            border: '1.5px solid #2e2e48',
          }}
        >
          +
          {extra}
        </div>
      )}
    </div>
  );
}

function CoverPlaceholder({ type }: { type: DraftType }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
      style={{ backgroundColor: '#1a1a1c' }}
    >
      {type === 'character'
        ? <UserRound strokeWidth={1.2} className="size-9" style={{ color: '#383848' }} />
        : <BookOpen strokeWidth={1.2} className="size-9" style={{ color: '#2a3a28' }} />}
      <span
        className="text-[9px]"
        style={{ color: type === 'character' ? '#383848' : '#2a3a28', fontFamily: '\'Noto Sans SC\', sans-serif' }}
      >
        暂无封面
      </span>
    </div>
  );
}

function readString(content: TsDraftContent, keys: string[]) {
  for (const key of keys) {
    const value = content[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readStoryRoles(content: TsDraftContent) {
  const selectedRoles = content.selectedRoles;
  if (!Array.isArray(selectedRoles)) {
    return { count: 0, avatars: [] as string[] };
  }
  const avatars = selectedRoles
    .map((role) => {
      if (!role || typeof role !== 'object') {
        return '';
      }
      const item = role as Record<string, unknown>;
      const avatar = item.avatar ?? item.avatarUrl;
      return typeof avatar === 'string' ? avatar.trim() : '';
    })
    .filter(Boolean);
  return { count: selectedRoles.length, avatars };
}

function formatLastEdit(value?: string) {
  if (!value) {
    return '刚刚最后编辑';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '刚刚最后编辑';
  }
  const now = new Date();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  if (
    date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate()
  ) {
    return `${time}最后编辑`;
  }
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${time}最后编辑`;
}

type DraftCardItem = {
  id: number;
  draftType: DraftType;
  coverImg?: string;
  cardBgImg: string;
  deleteIcon: string;
  name: string;
  lastEdit: string;
  bio: string;
  bioLines: number;
  cardHeight: string;
  avatars?: string[];
};

function mapDraftToCard(draft: TsDraftRecord): DraftCardItem {
  const content = draft.content || {};
  if (draft.draftType === 'story') {
    const roles = readStoryRoles(content);
    const mode = readString(content, ['activeTab', 'storyMode']);
    const sceneText = readString(content, ['sceneSettingText', 'siteSetting', 'sceneNameSnapshot']);
    const sceneImageUrl = readString(content, ['sceneImageUrl', 'coverUrl']);
    const hasScene = Boolean(sceneText || sceneImageUrl);
    return {
      id: draft.id,
      draftType: 'story',
      coverImg: sceneImageUrl || undefined,
      cardBgImg: imgCardBg3,
      deleteIcon: imgDeleteIcon3,
      name: draft.draftName?.trim() || '暂未填写标题',
      lastEdit: formatLastEdit(draft.updatedAt),
      bio: `${roles.count}个角色 · ${mode === 'chapter' ? '章节剧情' : '普通剧情'} · ${hasScene ? '已填写场景' : '未填写场景'}`,
      bioLines: 2,
      cardHeight: 'h-40',
      avatars: roles.avatars,
    };
  }

  const background = readString(content, ['background', 'backgroundStory']);
  const occupation = readString(content, ['job', 'occupation']);
  const greeting = readString(content, ['greeting']);
  return {
    id: draft.id,
    draftType: 'character',
    coverImg: readString(content, ['avatarUrl', 'generatedAvatarUrl', 'coverUrl']) || undefined,
    cardBgImg: imgCardBg1,
    deleteIcon: imgDeleteIcon1,
    name: draft.draftName?.trim() || '暂未填写名称',
    lastEdit: formatLastEdit(draft.updatedAt),
    bio: background || occupation || greeting || '角色设定未完善',
    bioLines: background ? 3 : 1,
    cardHeight: background ? 'h-40' : 'h-36',
  };
}

type DraftItemProps = {
  id: number;
  draftType: DraftType;
  coverImg?: string;
  cardBgImg?: string;
  deleteIcon: string;
  overlayImg?: string;
  name: string;
  lastEdit: string;
  bio: string;
  bioLines?: number;
  cardHeight?: string;
  avatars?: string[];
  deleting?: boolean;
  onOpen: (id: number, draftType: DraftType) => void;
  onDelete: (id: number, name: string) => void;
};

function DraftItem({
  id,
  draftType,
  coverImg,
  cardBgImg,
  deleteIcon,
  overlayImg,
  name,
  lastEdit,
  bio,
  bioLines = 1,
  cardHeight = 'h-36',
  avatars,
  deleting = false,
  onOpen,
  onDelete,
}: DraftItemProps) {
  return (
    <div
      className={`flex ${cardHeight} relative cursor-pointer overflow-hidden rounded-2xl`}
      onClick={() => onOpen(id, draftType)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(id, draftType);
        }
      }}
      role="button"
      tabIndex={0}
      style={{ opacity: deleting ? 0.55 : 1 }}
    >
      <div className="relative w-[26%] shrink-0 bg-[#1a1a1c]">
        {coverImg
          ? (
              <img
                src={coverImg}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            )
          : <CoverPlaceholder type={draftType} />}
        {overlayImg && (
          <img
            src={overlayImg}
            alt=""
            className="absolute bottom-4 left-1/2 size-11 -translate-x-1/2 object-contain"
          />
        )}
      </div>

      <button
        type="button"
        className="absolute top-0 right-0 z-10 size-[29px] border-0 bg-transparent p-0"
        disabled={deleting}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(id, name);
        }}
        aria-label={`删除${name}`}
      >
        <img src={deleteIcon} alt="" className="size-full object-contain" />
      </button>

      <div
        className="relative flex-1"
        style={
          cardBgImg
            ? { backgroundImage: `url(${cardBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: '#28292d', borderTop: '1px solid #212023', borderRight: '1px solid #212023', borderBottom: '1px solid #212023' }
        }
      >
        <div className="flex flex-col gap-[5px] p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="text-[15px]/5 font-bold"
              style={{ color: '#bcbcc0', fontFamily: '\'Noto Sans SC\', sans-serif' }}
            >
              {name}
            </span>
            <TypeTag type={draftType} />
          </div>

          <span
            className="text-[11px]/4"
            style={{ color: '#5d5e62', fontFamily: '\'Noto Sans SC\', sans-serif' }}
          >
            {lastEdit}
          </span>

          <p
            className="text-[12px] leading-[18px]"
            style={{
              color: '#727278',
              fontFamily: '\'Noto Sans SC\', sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: bioLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {bio}
          </p>

          {avatars && avatars.length > 0 && <AvatarRow avatars={avatars} />}
        </div>
      </div>
    </div>
  );
}

function showMessage(message: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // eslint-disable-next-line no-alert
    window.alert(message);
    return;
  }
  Alert.alert('提示', message);
}

// eslint-disable-next-line max-lines-per-function
export default function App() {
  const isFocused = useIsFocused();
  const [drafts, setDrafts] = useState<TsDraftRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: number; name: string } | null>(null);

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const page = await tsDraftApi.getDraftList({ pageNo: 1, pageSize: 20 });
      setDrafts(page?.records || []);
      setTotal(page?.total ?? page?.records?.length ?? 0);
    }
    catch (error) {
      console.warn('load drafts failed', error);
      setDrafts([]);
      setTotal(0);
      setErrorMessage(error instanceof Error ? error.message : '草稿加载失败，请稍后重试。');
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      void loadDrafts();
    }
  }, [isFocused, loadDrafts]);

  const cards = useMemo(() => drafts.map(mapDraftToCard), [drafts]);

  const handleOpen = (id: number, draftType: DraftType) => {
    router.push({
      pathname: draftType === 'character' ? '/pages/create-role' : '/pages/create-story',
      params: { draftId: String(id) },
    });
  };

  const handleDeleteRequest = (id: number, name: string) => {
    if (deletingId !== null) {
      return;
    }
    setPendingDelete({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete || deletingId !== null) {
      return;
    }
    const { id } = pendingDelete;
    setDeletingId(id);
    try {
      await tsDraftApi.deleteDraft(id);
      setDrafts(current => current.filter(item => item.id !== id));
      setTotal(current => Math.max(0, current - 1));
      setPendingDelete(null);
    }
    catch (error) {
      console.warn('delete draft failed', error);
      showMessage(error instanceof Error ? error.message : '删除草稿失败，请稍后重试。');
    }
    finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="flex h-screen w-full flex-col bg-[#121214]"
      style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
    >
      <div className="sticky top-0 z-10 shrink-0 bg-[#121214] px-4 py-2">
        <AiHeader title={`我的草稿${total}/20`} />
      </div>

      <div className="flex-1 overflow-y-auto pt-2 pb-10">
        <div className="flex flex-col gap-3 bg-[#121214] px-3">
          {loading && (
            <div className="py-12 text-center text-[13px] text-[#727278]">
              正在加载草稿...
            </div>
          )}
          {!loading && errorMessage && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="text-[13px] text-[#727278]">{errorMessage}</span>
              <button
                type="button"
                className="border-0 bg-transparent text-[13px] text-[#8b8bb8]"
                onClick={() => void loadDrafts()}
              >
                重新加载
              </button>
            </div>
          )}
          {!loading && !errorMessage && cards.length === 0 && (
            <div className="py-12 text-center text-[13px] text-[#727278]">
              暂无草稿
            </div>
          )}
          {!loading && !errorMessage && cards.map(item => (
            <DraftItem
              key={item.id}
              id={item.id}
              draftType={item.draftType}
              coverImg={item.coverImg}
              cardBgImg={item.cardBgImg}
              deleteIcon={item.deleteIcon}
              name={item.name}
              lastEdit={item.lastEdit}
              bio={item.bio}
              bioLines={item.bioLines}
              cardHeight={item.cardHeight}
              avatars={item.avatars}
              deleting={deletingId === item.id}
              onOpen={handleOpen}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm"
          onClick={() => {
            if (deletingId === null) {
              setPendingDelete(null);
            }
          }}
        >
          <div
            className="flex w-full max-w-[320px] flex-col rounded-[24px] border border-[#343438] bg-[#18181b] px-6 pt-7 pb-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            onClick={event => event.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="draft-delete-title"
            aria-describedby="draft-delete-description"
          >
            <h2
              id="draft-delete-title"
              className="text-center text-[18px] font-bold text-[#f4f4f5]"
            >
              删除草稿
            </h2>
            <p
              id="draft-delete-description"
              className="mt-3 text-center text-[13px]/5 text-[#8b8b92]"
            >
              确定删除草稿“
              {pendingDelete.name}
              ”吗？删除后无法恢复。
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="h-11 flex-1 rounded-full border border-[#3b3b40] bg-[#252529] text-[14px] font-medium text-[#c7c7cc] active:bg-[#303035] disabled:opacity-50"
                disabled={deletingId !== null}
                onClick={() => setPendingDelete(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="h-11 flex-1 rounded-full border border-[#8f343a] bg-[#722d32] text-[14px] font-bold text-white active:bg-[#83363c] disabled:opacity-60"
                disabled={deletingId !== null}
                onClick={() => void handleDeleteConfirm()}
              >
                {deletingId !== null ? '删除中...' : '删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
