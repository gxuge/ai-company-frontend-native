import type { TsDraftContent, TsDraftRecord } from '@/lib/api';
import { router, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';

import imgPencilPrimary from '@/assets/images/draft-list/3d8c7203651134dbf0a0cf10214f370f0de1c2d3.png';
import imgTrashStory from '@/assets/images/draft-list/5b65c81b20d536123f6ee685985d4390e55e33d3.png';
import imgDotGreen from '@/assets/images/draft-list/7fa7e40b648b98c459e14d649d5d1c18bdad5ef2.png';
import imgClock from '@/assets/images/draft-list/9e1b3280e583934f84fcc9b3f1c4ad0ae89dd04a.png';
import imgDotBlue from '@/assets/images/draft-list/58b1999075c525521fa24540bf026dda7e97ad68.png';
import imgPencilSecondary from '@/assets/images/draft-list/9170143255933a7c00a5121eae030dee2d950707.png';
import imgPerson from '@/assets/images/draft-list/bc30645210c0033557c063648ac8762df430b4f3.png';
import imgBook from '@/assets/images/draft-list/bf2c178323dfd06ce50d04fc40f9943224dbc1e5.png';
import imgDotYellow from '@/assets/images/draft-list/c70e2724dff0256d158ab0b0b74e652174c04953.png';
import imgTrashPrimary from '@/assets/images/draft-list/cedf4cfed95af20531ae794f7bcfa2853263c338.png';
import imgSearch from '@/assets/images/draft-list/d318b4c86ac604202c905e86b0276995a425abdd.png';
import imgPencilStory from '@/assets/images/draft-list/e9166e3b9b4734c9d7f90fda7fe9fd279cc27899.png';
import imgChevron from '@/assets/images/draft-list/fd18ccd5e736e5c0a104d5120414d25dcb49059c.png';
import imgTrashSecondary from '@/assets/images/draft-list/ffbad6d42727098eb4051b87d831879fe6aed3f9.png';
import { AiHeader } from '@/components/ai-company/ai-header';
import { tsDraftApi } from '@/lib/api';

type DraftKind = 'character' | 'story';
type DraftFilter = 'all' | DraftKind;
type SortField = 'updatedAt' | 'createdAt';

type DraftCardModel = {
  id: number;
  title: string;
  kind: DraftKind;
  editedAt: string;
  updatedAt: number;
  createdAt: number;
  status: string;
  statusDot: string;
  summary: string;
  revisions: number;
  thumb?: string;
  fallbackIcon: string;
  pencil: string;
  trash: string;
};

const TABS = [
  { id: 'all' as const, label: '全部', icon: null },
  { id: 'character' as const, label: '角色', icon: imgPerson },
  { id: 'story' as const, label: '故事', icon: imgBook },
];

function readString(content: TsDraftContent, keys: string[]) {
  for (const key of keys) {
    const value = content[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readNumber(content: TsDraftContent, keys: string[]) {
  for (const key of keys) {
    const value = content[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.max(0, Math.floor(value));
    }
    if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
      return Math.max(0, Math.floor(Number(value)));
    }
  }
  return 0;
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
  const isToday
    = date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();

  if (isToday) {
    return `${time}最后编辑`;
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day} ${time}最后编辑`;
}

function resolveRoleStatus(draft: TsDraftRecord) {
  const content = draft.content || {};
  const hasGeneratedContent = Boolean(
    readString(content, [
      'roleName',
      'name',
      'occupation',
      'job',
      'background',
      'backgroundStory',
      'greeting',
      'avatarUrl',
      'generatedAvatarUrl',
    ]),
  );

  if (draft.status === 0 || !hasGeneratedContent) {
    return { label: '待完善', dot: imgDotYellow };
  }
  return { label: 'AI生成', dot: imgDotGreen };
}

function mapDraftToCard(draft: TsDraftRecord, index: number): DraftCardModel {
  const content = draft.content || {};
  const kind: DraftKind = draft.draftType === 'story' ? 'story' : 'character';
  const updatedAt = draft.updatedAt ? new Date(draft.updatedAt).getTime() : 0;
  const createdAt = draft.createdAt ? new Date(draft.createdAt).getTime() : 0;
  const revisions = readNumber(content, [
    'revisionCount',
    'revisions',
    'editCount',
    'modifyCount',
  ]);

  if (kind === 'story') {
    return {
      id: draft.id,
      title: draft.draftName?.trim() || '暂未填写标题',
      kind,
      editedAt: formatLastEdit(draft.updatedAt),
      updatedAt: Number.isNaN(updatedAt) ? 0 : updatedAt,
      createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
      status: '创作中',
      statusDot: imgDotBlue,
      summary:
        readString(content, [
          'storySettingText',
          'storySetting',
          'siteSetting',
          'sceneSettingText',
          'summary',
          'description',
        ]) || '故事设定暂未完善，继续编辑以补充剧情内容。',
      revisions,
      thumb: readString(content, ['sceneImageUrl', 'coverUrl', 'imageUrl']) || undefined,
      fallbackIcon: imgBook,
      pencil: imgPencilStory,
      trash: imgTrashStory,
    };
  }

  const status = resolveRoleStatus(draft);
  const variant = index % 2;
  return {
    id: draft.id,
    title: draft.draftName?.trim() || '暂未填写名称',
    kind,
    editedAt: formatLastEdit(draft.updatedAt),
    updatedAt: Number.isNaN(updatedAt) ? 0 : updatedAt,
    createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
    status: status.label,
    statusDot: status.dot,
    summary:
      readString(content, [
        'background',
        'backgroundStory',
        'occupation',
        'job',
        'greeting',
      ]) || '角色设定暂未完善，继续编辑以补充人物信息。',
    revisions,
    thumb:
      readString(content, ['avatarUrl', 'generatedAvatarUrl', 'coverUrl', 'imageUrl'])
      || undefined,
    fallbackIcon: imgPerson,
    pencil: variant === 0 ? imgPencilPrimary : imgPencilSecondary,
    trash: variant === 0 ? imgTrashPrimary : imgTrashSecondary,
  };
}

function KindTag({ kind }: { kind: DraftKind }) {
  const tone
    = kind === 'character'
      ? 'border-[#91c40b] text-[#6f9a10]'
      : 'border-[#8549c7] text-[#8161be]';

  return (
    <span
      className={`shrink-0 rounded-[7px] border border-solid bg-black px-[7px] py-[2px] text-[11px] leading-normal ${tone}`}
    >
      {kind === 'character' ? '人物' : '故事'}
    </span>
  );
}

function DraftCard({
  draft,
  deleting,
  onDelete,
  onOpen,
}: {
  draft: DraftCardModel;
  deleting: boolean;
  onDelete: (draft: DraftCardModel) => void;
  onOpen: (draft: DraftCardModel) => void;
}) {
  return (
    <article
      className="relative flex cursor-pointer gap-3 overflow-hidden rounded-[18px] border border-solid border-[#0d0d0e] bg-[#08090a] p-2 transition-opacity"
      onClick={() => onOpen(draft)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(draft);
        }
      }}
      role="button"
      tabIndex={0}
      style={{ opacity: deleting ? 0.55 : 1 }}
    >
      <div className="flex h-[132px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#111213] sm:h-[150px] sm:w-[106px]">
        {draft.thumb
          ? (
              <img alt={draft.title} src={draft.thumb} className="size-full object-cover" />
            )
          : (
              <img alt="" src={draft.fallbackIcon} className="size-[26px] object-contain opacity-35" />
            )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1 pr-11">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-[17px] leading-[1.3] font-bold text-[#d1d1d1]">
            {draft.title}
          </h2>
          <KindTag kind={draft.kind} />
        </div>

        <div className="mt-[7px] flex items-center gap-2 text-[11px] leading-[1.4] text-[#676767]">
          <span className="truncate">{draft.editedAt}</span>
          <img alt="" src={draft.statusDot} className="size-[9px] shrink-0 object-contain" />
          <span className="shrink-0 text-[#848485]">{draft.status}</span>
        </div>

        <p className="mt-[10px] line-clamp-2 text-[12.5px] leading-[1.45] text-[#8b8b8b]">
          {draft.summary}
        </p>

        <div className="mt-auto flex items-center gap-[7px] pt-[10px]">
          <img alt="" src={draft.pencil} className="size-[13px] object-contain" />
          <span className="text-[12px] leading-[1.4] text-[#8a8a8a]">
            修改
            {draft.revisions}
            次
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label={`删除${draft.title}`}
        className="absolute top-[10px] right-[10px] size-[36px] rounded-full transition-opacity active:opacity-60 disabled:cursor-not-allowed"
        disabled={deleting}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(draft);
        }}
      >
        <img alt="" src={draft.trash} className="size-full object-contain" />
      </button>
    </article>
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
export default function DraftListPage() {
  const isFocused = useIsFocused();
  const [active, setActive] = useState<DraftFilter>('all');
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [drafts, setDrafts] = useState<TsDraftRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DraftCardModel | null>(null);

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const page = await tsDraftApi.getDraftList({ pageNo: 1, pageSize: 20 });
      setDrafts(page?.records || []);
    }
    catch (error) {
      console.warn('load drafts failed', error);
      setDrafts([]);
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

  const visibleDrafts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return drafts
      .map(mapDraftToCard)
      .filter(
        draft =>
          (active === 'all' || draft.kind === active)
          && (!keyword
            || draft.title.toLowerCase().includes(keyword)
            || draft.summary.toLowerCase().includes(keyword)),
      )
      .sort((left, right) => right[sortField] - left[sortField]);
  }, [active, drafts, query, sortField]);

  const handleOpen = (draft: DraftCardModel) => {
    router.push({
      pathname: draft.kind === 'character' ? '/pages/create-role' : '/pages/create-story',
      params: { draftId: String(draft.id) },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete || deletingId !== null) {
      return;
    }

    setDeletingId(pendingDelete.id);
    try {
      await tsDraftApi.deleteDraft(pendingDelete.id);
      setDrafts(current => current.filter(item => item.id !== pendingDelete.id));
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
    <div className="min-h-screen bg-black px-4 pt-5 pb-10 text-white">
      <AiHeader title="草稿箱" className="mb-5" />

      <header className="flex items-center gap-2 sm:gap-3">
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#0a0b0b] p-[4px] sm:p-[5px]">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-[5px] rounded-full px-[11px] py-[8px] text-[13px] leading-none transition-colors sm:gap-[7px] sm:px-[15px] sm:py-[9px] sm:text-[14px] ${
                  isActive
                    ? 'border border-solid border-[#76a518] bg-black text-[#8fca16]'
                    : 'border border-transparent bg-black text-[#cfcfcf]'
                }`}
              >
                {tab.icon
                  ? (
                      <img
                        alt=""
                        src={tab.icon}
                        className="size-[14px] object-contain sm:size-[15px]"
                      />
                    )
                  : null}
                <span className="font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <label className="flex min-w-0 flex-1 items-center gap-[7px] rounded-full border border-solid border-[#1e1e1e] bg-[#09090a] px-[13px] py-[11px] sm:max-w-[240px] sm:gap-[10px] sm:px-[18px] sm:py-[12px]">
          <img
            alt=""
            src={imgSearch}
            className="size-[14px] shrink-0 object-contain sm:size-[15px]"
          />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="搜索草稿"
            className="min-w-0 flex-1 bg-transparent text-[13px] leading-none text-[#cfcfcf] outline-none placeholder:text-[#919191] sm:text-[14px]"
          />
        </label>
      </header>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-[9px]">
          <img alt="" src={imgClock} className="size-[16px] object-contain" />
          <h1 className="text-[14px] leading-none font-bold text-[#bdbdbc]">最近编辑</h1>
        </div>
        <button
          type="button"
          className="flex items-center gap-[9px] text-[13px] leading-none text-[#868686]"
          onClick={() =>
            setSortField(current => (current === 'updatedAt' ? 'createdAt' : 'updatedAt'))}
        >
          {sortField === 'updatedAt' ? '按编辑时间排序' : '按创建时间排序'}
          <img
            alt=""
            src={imgChevron}
            className="h-[7px] w-[11px] object-contain"
          />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {loading
          ? (
              <p className="py-16 text-center text-[13px] text-[#5a5a5a]">正在加载草稿...</p>
            )
          : null}
        {!loading && errorMessage
          ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-[13px] text-[#5a5a5a]">{errorMessage}</p>
                <button
                  type="button"
                  className="text-[13px] text-[#8ebd1d]"
                  onClick={() => void loadDrafts()}
                >
                  重新加载
                </button>
              </div>
            )
          : null}
        {!loading && !errorMessage
          ? visibleDrafts.map(draft => (
              <DraftCard
                key={draft.id}
                draft={draft}
                deleting={deletingId === draft.id}
                onDelete={setPendingDelete}
                onOpen={handleOpen}
              />
            ))
          : null}
        {!loading && !errorMessage && visibleDrafts.length === 0
          ? (
              <p className="py-16 text-center text-[13px] text-[#5a5a5a]">
                {drafts.length === 0 ? '暂无草稿' : '没有匹配的草稿'}
              </p>
            )
          : null}
      </div>

      {pendingDelete
        ? (
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
                aria-labelledby="draft-list-delete-title"
                aria-describedby="draft-list-delete-description"
              >
                <h2
                  id="draft-list-delete-title"
                  className="text-center text-[18px] font-bold text-[#f4f4f5]"
                >
                  删除草稿
                </h2>
                <p
                  id="draft-list-delete-description"
                  className="mt-3 text-center text-[13px]/5 text-[#8b8b92]"
                >
                  确定删除草稿“
                  {pendingDelete.title}
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
          )
        : null}
    </div>
  );
}
