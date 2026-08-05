import { useState } from 'react'

import imgStarfield from '@/assets/images/mine/286086961ad95d3db89e33c681b67fdbea40bf45.png'
import imgHeaderSky from '@/assets/images/mine/aef606d7209107def80fb57f59976316f7350b5b.png'
import imgAvatar from '@/assets/images/mine/5057b783a4a9d4eed01846904e273e741b16874f.png'
import imgMascot from '@/assets/images/mine/3cbfc035e5501e78837aee11497b3ac60959ad8b.png'
import imgPlanetDeco from '@/assets/images/mine/23b2bc99b71460bc8cdcbb607c06c7fbafbd1a07.png'
import imgCompose from '@/assets/images/mine/b3bf923033b92884a91686a83d27ba514d28d324.png'
import imgSettings from '@/assets/images/mine/4f1f4522339659e2c6f8d9389c880246ade9283b.png'
import imgLevelBg from '@/assets/images/mine/2813d7f008906b8840be82e8fb69a223d5fee42f.png'
import imgPiaBg from '@/assets/images/mine/d662ab778ff655f78582341e8e7d192892c8db31.png'
import imgPiaIcon from '@/assets/images/mine/194e5e60e6743f9404eb1aa9c38df2cf039f65fb.png'
import imgVipCrown from '@/assets/images/mine/6a7ecfdf28055f8d153310702d139e6be42b2d3b.png'
import imgEditPencil from '@/assets/images/mine/69f4ed584e0d446d07bf999cdb5fdbeff0f313b7.png'
import imgGenderIcon from '@/assets/images/mine/e81a4169ee96fc52e963de24193db0d65a158975.png'
import imgCityBg from '@/assets/images/mine/4e9471d9a851911e8133dbeef4e01196e26c88c9.png'
import imgCityIcon from '@/assets/images/mine/3ad2f5eaef02b89b3cd989c30e904a59d53fa665.png'
import imgVoiceTagBg from '@/assets/images/mine/e8dec6764abe92ee92ea3a8e3d0644d716ac4ea3.png'
import imgVoiceTagIcon from '@/assets/images/mine/1c6224777f7eb85afe6b093e53413d84de0be3e2.png'
import imgStatDivider1 from '@/assets/images/mine/ad964822056729b7cd59f10ebc7146958665ccc0.png'
import imgStatDivider2 from '@/assets/images/mine/721e5d8b148ddf75ad2f3ba3a5a9abb43fe7c24a.png'
import imgChevronInterest from '@/assets/images/mine/eb9d1d2f67ff72dc52e7e0da2bd11fc3e1fd19d8.png'
import imgTagInteract from '@/assets/images/mine/cc7fa3dabae50dbd5cfc1675473cb91edda40e85.png'
import imgTagPlot from '@/assets/images/mine/b351071ab58c78e7d0e7988c2d02acd4b88482a0.png'
import imgTagVoiceFan from '@/assets/images/mine/a577609669d4d4d064af4c6d398c979de765da9c.png'
import imgTagActing from '@/assets/images/mine/836e9a9f25855ecb8056e43b6e9f491bab61c733.png'
import imgBadgeOldFriend from '@/assets/images/mine/36262de47af2efe8e708b9843b67e81066aaa054.png'
import imgBadgeHundred from '@/assets/images/mine/bad5b32969bc769f0e3584445b856f48589cd0f6.png'
import imgBadgeStar from '@/assets/images/mine/e790c3c4d7afa4a16d43592850a850714fe01952.png'
import imgBadgeWarm from '@/assets/images/mine/c251878d53b34f3df9226ea2ea5805df262a9d7a.png'
import imgBadgeMore from '@/assets/images/mine/386e45d53e878bb2816a7f1f4cd2552a99bd3c57.png'
import imgChevronBadge from '@/assets/images/mine/75caa4c75964472b02b776ef9bd466116b6bd22a.png'
import imgEntryRoom from '@/assets/images/mine/a9880c10e4c64607a43c706f3ce64b7e5179ca94.png'
import imgEntryTask from '@/assets/images/mine/fd769c1e93dfdb50164d809ec0ef7db2fe9dd83e.png'
import imgEntryFavorite from '@/assets/images/mine/bcac92614ff932f048cd04bd99d1deb0bd7b50e6.png'
import imgEntryHistory from '@/assets/images/mine/33d00baeccd1c78f0ccd788daf0503315c949903.png'
import imgEntryActivity from '@/assets/images/mine/9b704d8bcfd99f045264293e90a7306ba63276bb.png'
import imgEntryWallet from '@/assets/images/mine/d4462269c535ab3f3c7fa4599f288b9423007f52.png'
import imgEntryDressUp from '@/assets/images/mine/b2ad79bd5bc1a8521a6d408dffc1b6e0ad1a4649.png'
import imgEntryVoiceCard from '@/assets/images/mine/3294bcce1bf1ecf868c01bf9064714e46b884046.png'
import imgEntryLevel from '@/assets/images/mine/bcb2c58ecadfd5b4e2221ca778345dc5b49aecde.png'
import imgEntrySupport from '@/assets/images/mine/cf805035c5a20a68c02a89194e96b74230b7780a.png'
import imgRedDotActivity from '@/assets/images/mine/a5b86b45fc091e690cf9c3ccee78e48c13fa3dbf.png'
import imgRedDotTask from '@/assets/images/mine/713da8d5815268a60e53225b1e3ee4a1606fbb60.png'
import imgChevronWorks from '@/assets/images/mine/b9e3593b1bfe8c9423c0e5a85cda0a0f56b4175e.png'
import imgTabUnderline from '@/assets/images/mine/f8478aa45cd2f9d3e9c6850cebf20efd4afec7fb.png'
import imgWorkCharacter from '@/assets/images/mine/f220cc9f353755885d425cc9d14994d0752f299a.png'
import imgWorkStory from '@/assets/images/mine/f9677e6e0425fd308a2854a874f90ade1f5656b8.png'
import imgWorkWorld from '@/assets/images/mine/47161e15c338421b02d6c0638b7ee34d4c03125a.png'
import imgFlame1 from '@/assets/images/mine/3b1a409cf02b7d52f3776dbaa952e34480ee6572.png'
import imgFlame2 from '@/assets/images/mine/5298e4bbbf4cf867ab09ce3fde2ed3ba577d310e.png'
import imgWorldTagIcon from '@/assets/images/mine/9c239cb9965ace8b7adb3d437848c280d9e64126.png'
import imgHealTagBg from '@/assets/images/mine/d4ec0dee5ec9ba5e9282e22264d1febe1e2005ad.png'
import imgNavHome from '@/assets/images/mine/0cccf2095c13dbac0ce45685e271dfeab75d929d.png'
import imgNavDub from '@/assets/images/mine/f7241a292c9ab7f40e513917823b1753710faedf.png'
import imgNavSquare from '@/assets/images/mine/b01cb8be37c648f61cde6a187b027891f31fe4d2.png'
import imgNavMessage from '@/assets/images/mine/d317b268c600398636fbcaf7481abb0472c3afc2.png'
import imgNavMine from '@/assets/images/mine/9eafe4e24b97839a972f28eda14d24827fa42137.png'
import imgNavIndicator from '@/assets/images/mine/9ebb44cb055c045d19a0318d5c43a1a270da94df.png'
import imgMessageBadge from '@/assets/images/mine/4f20a094cbc505e6fadb99bb3a18a0e2e5f3b750.png'
import imgTitleUnderline from '@/assets/images/mine/fde6c1c1f098b6bee6cb7f8b4f63e0b2e1ba6cf4.png'

const CARD_BG = 'bg-[#121723]'

const interestTags = [
  { label: '戏感玩家', icon: imgTagActing, bg: 'bg-[#1c1c34]', border: 'border-[#1e2037]', color: 'text-[#7d649e]' },
  { label: '声优爱好者', icon: imgTagVoiceFan, bg: 'bg-[#201f23]', border: 'border-[#262224]', color: 'text-[#9b683e]' },
  { label: '剧情党', icon: imgTagPlot, bg: 'bg-[#151f30]', border: 'border-[#172234]', color: 'text-[#537899]' },
  { label: '互动达人', icon: imgTagInteract, bg: 'bg-[#231b2c]', border: 'border-transparent', color: 'text-[#995d80]' },
]

const badges = [
  { name: '戏鲸老友', date: '2023.05.20', icon: imgBadgeOldFriend },
  { name: '百场之声', date: '2024.01.18', icon: imgBadgeHundred },
  { name: '人气之星', date: '2024.06.30', icon: imgBadgeStar },
  { name: '暖心陪伴', date: '2024.11.11', icon: imgBadgeWarm },
]

const entries = [
  { label: '我的房间', icon: imgEntryRoom },
  { label: '我的任务', icon: imgEntryTask, dot: imgRedDotTask },
  { label: '我的收藏', icon: imgEntryFavorite },
  { label: '浏览记录', icon: imgEntryHistory },
  { label: '活动中心', icon: imgEntryActivity, dot: imgRedDotActivity },
  { label: '钱包', icon: imgEntryWallet },
  { label: '装扮中心', icon: imgEntryDressUp },
  { label: '声鉴卡', icon: imgEntryVoiceCard },
  { label: '我的等级', icon: imgEntryLevel },
  { label: '客服中心', icon: imgEntrySupport },
]

const workTabs = ['角色', '故事', '世界'] as const

const navItems = [
  { label: '首页', icon: imgNavHome },
  { label: '配音', icon: imgNavDub },
  { label: '广场', icon: imgNavSquare },
  { label: '消息', icon: imgNavMessage, badge: 3 },
  { label: '我的', icon: imgNavMine },
]

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`${CARD_BG} border border-[#141925] rounded-[14px] ${className}`}>{children}</div>
  )
}

function MoreLink({ label, chevron }: { label: string; chevron: string }) {
  return (
    <button type="button" className="flex items-center gap-[5px] text-[#6a6b70] text-[12px]">
      {label}
      <img src={chevron} alt="" className="h-[8px] w-[4px] object-contain" />
    </button>
  )
}

export default function ProfileScreen() {
  const [activeWorkTab, setActiveWorkTab] = useState<(typeof workTabs)[number]>('角色')
  const [activeNav, setActiveNav] = useState('我的')

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0c121e] font-sans">
      {/* deep-space backdrop from the design */}
      <img
        src={imgStarfield}
        alt=""
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] w-full object-cover opacity-90"
      />

      <div className="relative mx-auto w-full max-w-[430px] pb-[76px]">
        {/* ---------- header ---------- */}
        <header className="relative">
          <img src={imgHeaderSky} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <img
            src={imgPlanetDeco}
            alt=""
            className="pointer-events-none absolute left-1/2 top-[14px] h-[15px] w-[27px] -translate-x-1/2 object-contain"
          />
          <img
            src={imgMascot}
            alt=""
            className="pointer-events-none absolute right-[14px] top-[22px] h-[93px] w-[71px] object-contain"
          />

          <div className="relative flex items-start justify-end gap-[20px] px-[20px] pt-[14px]">
            <button type="button" aria-label="发布">
              <img src={imgCompose} alt="" className="h-[15px] w-[15px] object-contain" />
            </button>
            <button type="button" aria-label="设置">
              <img src={imgSettings} alt="" className="h-[16px] w-[16px] object-contain" />
            </button>
          </div>

          <div className="relative flex items-start gap-[14px] px-[18px] pb-[22px] pt-[16px]">
            <div className="relative shrink-0">
              <img
                src={imgAvatar}
                alt="鲸行万里的头像"
                className="h-[85px] w-[85px] rounded-full object-cover"
              />
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2">
                <div className="relative h-[16px] w-[35px]">
                  <img src={imgLevelBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
                  <span className="font-inter absolute inset-0 flex items-center justify-center text-[9px] text-[#cebdfc]">
                    Lv.28
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1 pt-[8px]">
              <div className="flex flex-wrap items-center gap-[7px]">
                <h1 className="text-[15px] font-bold text-[#bebebe]">鲸行万里</h1>
                <div className="relative flex h-[13px] w-[28px] items-center justify-center">
                  <img src={imgPiaBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
                  <img
                    src={imgPiaIcon}
                    alt=""
                    className="relative h-[10px] w-[9px] shrink-0 object-contain"
                  />
                  <span className="font-inter relative pl-[2px] text-[7px] font-light text-[#cdb3fc]">PIA</span>
                </div>
                <div className="flex h-[12px] items-center gap-[1px] rounded-[3px] border border-[#c17800] bg-[#bd7a01] pr-[4px]">
                  <img src={imgVipCrown} alt="" className="h-[12px] w-[11px] object-contain" />
                  <span className="text-[7px] text-[#e4c491]">年费VIP</span>
                </div>
              </div>

              <div className="mt-[8px] flex items-center gap-[6px]">
                <p className="text-[9px] text-[#86878b]">声入人心，共赴热爱。</p>
                <img src={imgEditPencil} alt="" className="h-[9px] w-[9px] object-contain" />
              </div>

              <div className="mt-[12px] flex flex-wrap items-center gap-[7px]">
                <div className="relative flex h-[16px] items-center gap-[3px] rounded-[7px] border border-[#431f3b] bg-[#3f1a30] px-[8px]">
                  <img src={imgGenderIcon} alt="" className="h-[8px] w-[6px] object-contain" />
                  <span className="font-inter text-[8px] text-[#9e8391]">22</span>
                </div>
                <div className="relative flex h-[16px] items-center gap-[3px] px-[8px]">
                  <img src={imgCityBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
                  <img src={imgCityIcon} alt="" className="relative h-[9px] w-[8px] object-contain" />
                  <span className="relative text-[8px] text-[#828690]">杭州</span>
                </div>
                <div className="relative flex h-[16px] items-center gap-[3px] px-[8px]">
                  <img src={imgVoiceTagBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
                  <img src={imgVoiceTagIcon} alt="" className="relative h-[8px] w-[8px] object-contain" />
                  <span className="relative text-[8px] text-[#7e76a1]">声控星人</span>
                </div>
              </div>
            </div>
          </div>

        </header>

        <div className="relative space-y-[13px] px-[16px] pt-[14px]">
          {/* ---------- stats ---------- */}
          <SectionCard className="flex items-stretch bg-[#111621] py-[13px]">
            <div className="flex flex-1 flex-col items-center gap-[3px]">
              <span className="font-inter text-[13px] font-medium text-[#cbcccf]">128</span>
              <span className="text-[9px] text-[#6a6b71]">关注</span>
            </div>
            <img src={imgStatDivider2} alt="" className="my-[2px] w-[5px] object-contain" />
            <div className="flex flex-1 flex-col items-center gap-[3px]">
              <span className="font-inter text-[13px] font-bold text-[#c1c2c6]">3.2w</span>
              <span className="text-[9px] text-[#6a6b72]">粉丝</span>
            </div>
            <img src={imgStatDivider1} alt="" className="my-[3px] w-[1px] object-contain" />
            <div className="flex flex-1 flex-col items-center gap-[3px]">
              <span className="font-inter text-[13px] text-[#b6b8bc]">8.7w</span>
              <span className="text-[9px] text-[#696a71]">获赞</span>
            </div>
          </SectionCard>

          {/* ---------- interest identities ---------- */}
          <SectionCard className="px-[14px] py-[14px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] text-[#a9abaf]">兴趣身份</h2>
              <MoreLink label="更多" chevron={imgChevronInterest} />
            </div>
            <div className="no-scrollbar -mx-[14px] mt-[12px] flex gap-[8px] overflow-x-auto px-[14px]">
              {interestTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  className={`flex h-[24px] shrink-0 items-center gap-[5px] rounded-[10px] border px-[10px] ${tag.bg} ${tag.border}`}
                >
                  <img src={tag.icon} alt="" className="h-[13px] w-[13px] object-contain" />
                  <span className={`whitespace-nowrap text-[9px] ${tag.color}`}>{tag.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* ---------- achievement badges ---------- */}
          <SectionCard className="rounded-[15px] px-[10px] py-[14px]">
            <h2 className="px-[4px] text-[11px] text-[#acadb1]">成就勋章</h2>
            <div className="mt-[12px] flex items-start">
              {badges.map((badge) => (
                <div key={badge.name} className="flex flex-1 flex-col items-center gap-[5px]">
                  <img src={badge.icon} alt="" className="h-[43px] w-[43px] object-contain" />
                  <span className="text-[9px] text-[#93959a]">{badge.name}</span>
                  <span className="font-inter text-[8px] text-[#65676f]">{badge.date}</span>
                </div>
              ))}
              <button type="button" className="flex flex-1 flex-col items-center gap-[5px]">
                <img src={imgBadgeMore} alt="" className="h-[41px] w-[41px] object-contain" />
                <span className="flex items-center gap-[4px] text-[9px] text-[#6a6c71]">
                  更多勋章
                  <img src={imgChevronBadge} alt="" className="h-[7px] w-[4px] object-contain" />
                </span>
              </button>
            </div>
          </SectionCard>

          {/* ---------- entry grid ---------- */}
          <SectionCard className="rounded-[16px] border-2 px-[6px] py-[14px]">
            <div className="grid grid-cols-5 gap-y-[14px]">
              {entries.map((entry) => (
                <button key={entry.label} type="button" className="flex flex-col items-center gap-[6px]">
                  <span className="relative">
                    <img src={entry.icon} alt="" className="h-[22px] w-[22px] object-contain" />
                    {entry.dot && (
                      <img
                        src={entry.dot}
                        alt=""
                        className="absolute -right-[4px] -top-[2px] h-[7px] w-[7px] object-contain"
                      />
                    )}
                  </span>
                  <span className="text-[9px] text-[#8f9198]">{entry.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ---------- my works ---------- */}
        <section className="relative mt-[18px]">
          <div className="flex items-center justify-between px-[16px]">
            <h2 className="relative text-[13px] font-bold text-[#bdbdbd]">
              我的作品
              <img
                src={imgTitleUnderline}
                alt=""
                className="pointer-events-none absolute -bottom-[5px] left-0 h-[7px] w-[45px] object-contain"
              />
            </h2>
            <MoreLink label="查看全部" chevron={imgChevronWorks} />
          </div>

          <div className="mt-[10px] flex items-center gap-[20px] px-[16px]">
            {workTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveWorkTab(tab)}
                className="relative pb-[6px]"
              >
                <span
                  className={`text-[10px] ${activeWorkTab === tab ? 'text-[#a1a2a6]' : 'text-[#6d6f75]'}`}
                >
                  {tab}
                </span>
                {activeWorkTab === tab && (
                  <img
                    src={imgTabUnderline}
                    alt=""
                    className="absolute bottom-0 left-1/2 h-[2px] w-[18px] -translate-x-1/2 object-fill"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="no-scrollbar mt-[8px] flex gap-[8px] overflow-x-auto px-[16px] pb-[4px]">
            {/* 角色 */}
            <article className="relative aspect-[114/126] w-[38%] shrink-0 overflow-hidden rounded-[10px]">
              <img src={imgWorkCharacter} alt="林汐" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-[8px]">
                <h3 className="text-[10px] text-[#a3a3a6]">林汐</h3>
                <p className="mt-[2px] text-[8px] text-[#77777d]">温柔治愈系姐姐</p>
                <div className="mt-[5px] flex gap-[4px]">
                  <span className="relative flex h-[13px] items-center rounded-[6px] border border-[#222227] bg-[#2f2a2b] px-[6px] text-[7px] text-[#8b633d]">
                    治愈
                  </span>
                  <span className="relative flex h-[13px] items-center justify-center px-[6px]">
                    <img src={imgHealTagBg} alt="" className="absolute inset-0 h-full w-full object-fill" />
                    <span className="relative text-[7px] text-[#826fa4]">陪伴</span>
                  </span>
                </div>
                <div className="mt-[5px] flex items-center gap-[3px]">
                  <img src={imgFlame1} alt="" className="h-[10px] w-[9px] object-contain" />
                  <span className="text-[8px] text-[#6a6c74]">12.5k互动</span>
                </div>
              </div>
            </article>

            {/* 故事 */}
            <article className="relative aspect-[114/126] w-[38%] shrink-0 overflow-hidden rounded-[10px]">
              <img src={imgWorkStory} alt="雨夜咖啡馆" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-[8px]">
                <h3 className="text-[10px] text-[#9b9ca0]">雨夜咖啡馆</h3>
                <p className="mt-[2px] text-[8px] text-[#76787e]">互动故事</p>
                <p className="mt-[3px] text-[8px] text-[#5e6069]">第12章</p>
                <div className="mt-[8px] flex items-center gap-[3px]">
                  <img src={imgFlame2} alt="" className="h-[10px] w-[8px] object-contain" />
                  <span className="text-[8px] text-[#6e7078]">8.6k热度</span>
                </div>
              </div>
            </article>

            {/* 世界 */}
            <article className="relative aspect-[114/126] w-[38%] shrink-0 overflow-hidden rounded-[10px]">
              <img src={imgWorkWorld} alt="星海纪元" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-[8px]">
                <h3 className="text-[10px] text-[#abafb7]">星海纪元</h3>
                <p className="mt-[2px] text-[8px] text-[#868993]">科幻世界</p>
                <p className="mt-[3px] text-[8px] text-[#64666e]">5个角色·12个故事</p>
                <div className="mt-[6px] flex">
                  <span className="flex h-[14px] items-center gap-[4px] rounded-[6px] border border-[#161b27] bg-[#1b212e] px-[6px]">
                    <img src={imgWorldTagIcon} alt="" className="h-[9px] w-[9px] object-contain" />
                    <span className="text-[7px] text-[#6e717a]">世界观</span>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      {/* ---------- bottom nav ---------- */}
      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[430px] border-t border-[#141925] bg-[#0c121e]/95 backdrop-blur-sm">
        <div className="flex items-end justify-around pb-[8px] pt-[7px]">
          {navItems.map((item) => {
            const active = activeNav === item.label
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveNav(item.label)}
                className="relative flex flex-1 flex-col items-center gap-[3px]"
              >
                <span className="relative">
                  <img src={item.icon} alt="" className="h-[19px] w-[20px] object-contain" />
                  {item.badge && (
                    <span className="absolute -right-[7px] -top-[4px] flex h-[11px] w-[11px] items-center justify-center">
                      <img src={imgMessageBadge} alt="" className="absolute inset-0 h-full w-full object-fill" />
                      <span className="font-inter relative text-[7px] text-[#faa3a0]">{item.badge}</span>
                    </span>
                  )}
                </span>
                <span className={`text-[9px] ${active ? 'text-[#c9cad0]' : 'text-[#84848b]'}`}>
                  {item.label}
                </span>
                {active && (
                  <img
                    src={imgNavIndicator}
                    alt=""
                    className="absolute -bottom-[4px] h-[2px] w-[18px] object-fill"
                  />
                )}
              </button>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
