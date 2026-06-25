import { BookOpen, UserRound } from 'lucide-react';
import { AiHeader } from '../../../components/ai-company/ai-header';

const asset = (m: any) => m?.default ?? m?.uri ?? m;
const imgDeleteIcon5 = asset(require('../../../assets/images/draft/73e2913fc630830fa03a5c373e728f17d347339f.png'));
const imgCover5 = asset(require('../../../assets/images/draft/485145304fb638c0b97b0eab29598a13d4923dc2.png'));
const imgDeleteIcon4 = asset(require('../../../assets/images/draft/be037963d4580ab831f0bd0fc0f965eec7c8bb7d.png'));
const imgCover4 = asset(require('../../../assets/images/draft/d6b152b0b4b0140ee344e496260257af48b35c5f.png'));
const imgCardBg3 = asset(require('../../../assets/images/draft/1f4cadfd6427ed31f586e3f9a5ea8178db3011d8.png'));
const imgDeleteIcon3 = asset(require('../../../assets/images/draft/7d1adc8b689fd7114409f0deee545e7f1f15c9fa.png'));
const imgCover3 = asset(require('../../../assets/images/draft/e427dcf8e5d1e25fa3603a06cb48d5a2473fe2a9.png'));
const imgOverlay3 = asset(require('../../../assets/images/draft/d6e72aa65fbffa57c43c8ba413427dc7f10104b6.png'));
const imgDeleteIcon2 = asset(require('../../../assets/images/draft/bcf95b46eb4effb2074ce63e0eaa4eb462c897c8.png'));
const imgCover2 = asset(require('../../../assets/images/draft/2b771303c261225f1a61956b90ac7ffa6658b13c.png'));
const imgOverlay2 = asset(require('../../../assets/images/draft/4d3b6bfeff59e9ed58e68b96fe9950d838887c1b.png'));
const imgCardBg1 = asset(require('../../../assets/images/draft/3be710d9c7a3c1c90875a63de87782fd2f5b5570.png'));
const imgDeleteIcon1 = asset(require('../../../assets/images/draft/0335f2666c31bbbba5ea57d605cc11706ff4f763.png'));
const imgCover1 = asset(require('../../../assets/images/draft/3098cb28eecb0dc2cd92aeeca6532ca48934007b.png'));
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

type DraftItemProps = {
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
};

function DraftItem({
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
}: DraftItemProps) {
  return (
    <div className={`flex ${cardHeight} relative overflow-hidden rounded-2xl`}>
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

      <img
        src={deleteIcon}
        alt="delete"
        className="absolute top-0 right-0 z-10 size-[29px] object-contain"
      />

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

const MOCK_DRAFT_LIST = [
  {
    id: '1',
    draftType: 'character' as DraftType,
    coverImg: imgCover1,
    cardBgImg: imgCardBg1,
    deleteIcon: imgDeleteIcon1,
    name: '莉莉',
    lastEdit: '17:48最后编辑',
    bio: '还未填写简介',
  },
  {
    id: '2',
    draftType: 'character' as DraftType,
    coverImg: imgCover2,
    overlayImg: imgOverlay2,
    deleteIcon: imgDeleteIcon2,
    name: '莉莉',
    lastEdit: '17:47最后编辑',
    bio: '职业 · 性格 · 背景未完善',
  },
  {
    id: '3',
    draftType: 'story' as DraftType,
    coverImg: imgCover3,
    overlayImg: imgOverlay3,
    cardBgImg: imgCardBg3,
    deleteIcon: imgDeleteIcon3,
    name: '暂未填写标题',
    lastEdit: '06-01 11:02最后编辑',
    bio: '4个角色 · 普通剧情 · 未填写场景',
    cardHeight: 'h-40',
    avatars: [imgCover1, imgCover2, imgCover4, imgCover5],
  },
  {
    id: '4',
    draftType: 'character' as DraftType,
    coverImg: imgCover4,
    deleteIcon: imgDeleteIcon4,
    name: '迟慢',
    lastEdit: '04-15 20:59最后编辑',
    bio: '一个看起来像摆烂实则稳得离谱的拖稿狂魔，牵着你把拖延清单变完成清单；他说得少，但随时递出一杯咖啡和一个准时的截止日。',
    bioLines: 3,
    cardHeight: 'h-40',
  },
  {
    id: '5',
    isSpecial: true,
    draftType: 'story' as DraftType,
    coverImg: imgCover5,
    deleteIcon: imgDeleteIcon5,
    name: '暂未填写标题',
  },
];

export default function App() {
  return (
    <div
      className="flex h-screen w-full flex-col bg-[#121214]"
      style={{ fontFamily: '\'Noto Sans SC\', sans-serif' }}
    >
      <div className="sticky top-0 z-10 shrink-0 bg-[#121214] px-4 py-2">
        <AiHeader title="我的草稿5/20" />
      </div>

      <div className="flex-1 overflow-y-auto pb-10 pt-2">
        <div className="flex flex-col gap-3 bg-[#121214] px-3">
          {MOCK_DRAFT_LIST.map((item) => {
            if (item.isSpecial) {
              return (
                <div key={item.id} className="relative flex h-16 overflow-hidden rounded-2xl">
                  <div className="relative w-[26%] shrink-0 bg-[#1a1a1c]">
                    <img src={item.coverImg} alt="" className="size-full object-cover" />
                  </div>
                  <img
                    src={item.deleteIcon}
                    alt="delete"
                    className="absolute top-0 right-0 z-10 size-[29px] object-contain"
                  />
                  <div
                    className="flex flex-1 items-center gap-2 px-3"
                    style={{ backgroundColor: '#28292d', borderTop: '1px solid #1e1f23', borderRight: '1px solid #1e1f23', borderBottom: '1px solid #1e1f23' }}
                  >
                    <span className="text-[15px] font-bold" style={{ color: '#c1c2c5' }}>
                      {item.name}
                    </span>
                    <TypeTag type={item.draftType} />
                  </div>
                </div>
              );
            }
            return (
              <DraftItem
                key={item.id}
                draftType={item.draftType}
                coverImg={item.coverImg}
                cardBgImg={item.cardBgImg}
                overlayImg={item.overlayImg}
                deleteIcon={item.deleteIcon}
                name={item.name}
                lastEdit={item.lastEdit!}
                bio={item.bio!}
                bioLines={item.bioLines}
                cardHeight={item.cardHeight}
                avatars={item.avatars}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
