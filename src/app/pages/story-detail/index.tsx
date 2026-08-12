/* eslint-disable max-lines-per-function, perfectionist/sort-imports, style/arrow-parens, style/semi */
import { useState } from 'react'

import { FixedDesignCanvas } from '@/components/reusables/fixed-design-canvas'
import imgHero from '@/assets/images/story-detail/8c863370aaa3407cd047490ee1eac7af93064b1d.png'
import imgStatusSignal from '@/assets/images/story-detail/803b1ad4ac5eee12e2c9dbff1a9e829ade5b40aa.png'
import imgStatusWifi from '@/assets/images/story-detail/11a3a58966d9271c6c78aa215c2ae8393c5646da.png'
import imgStatusBattery from '@/assets/images/story-detail/d598326bbb9c2da7bd666da57016675f5f2d25bd.png'
import imgNavBack from '@/assets/images/story-detail/26cd3078e601e919652b219f8d43f8eb9da67fa2.png'
import imgNavShare from '@/assets/images/story-detail/349a603226918caa7bfc80b3a872a34a84f50942.png'
import imgNavMore from '@/assets/images/story-detail/6fc615b66d3c2a86605491aa3da565d7106586fe.png'
import imgAuthorAvatar from '@/assets/images/story-detail/26c4295c2ad1037015f8d3341f1bb3d02460cb6e.png'
import imgIconGear from '@/assets/images/story-detail/07f1398d0f5245e69d94ee10e8354c3af4280442.png'
import imgIconCopy from '@/assets/images/story-detail/77ec211e4dc884504cb5aede0eec0640e26f40e7.png'
import imgFollowBg from '@/assets/images/story-detail/bd236c7088bc847b44785056a9b6d076f6d2f7e3.png'
import imgIconStar from '@/assets/images/story-detail/74461762fa09ea76a3214c1622ca53d1c4a15938.png'
import imgIconSparkle from '@/assets/images/story-detail/53bebde1f323e9a9b0b6eef412066f1689fdc46f.png'
import imgIconChevron from '@/assets/images/story-detail/5020abfbced6c0773d75a338dacdfd3d9d34bc76.png'
import imgIconBook from '@/assets/images/story-detail/9879a5c1979c917102beea139499419185b55cc0.png'
import imgIconMask from '@/assets/images/story-detail/e0c272f3ed9fc3373f3f8d1282a4f203f214230a.png'
import imgIconPlot from '@/assets/images/story-detail/3bc44e22bd6b38d6bf23932c78a8caa2fbf72170.png'
import imgCharLu from '@/assets/images/story-detail/6c3ffe469552efe45f4165ba6a4231c67af6795b.png'
import imgCharSu from '@/assets/images/story-detail/a0ea41f5611755292f91472a72c938e78dc3cf74.png'
import imgCharFu from '@/assets/images/story-detail/7e23fd041b49f4ac59b8fdd0de57377774691317.png'
import imgCharYe from '@/assets/images/story-detail/472649489f191ea8992ba1028f850a7cec30afe8.png'
import imgCharGu from '@/assets/images/story-detail/5f6b56f82018303b3d489c32e110180fa7461e5e.png'
import imgVoiceThumb from '@/assets/images/story-detail/27abccb706824cd9bb0432d494108491adb035eb.png'
import imgVoiceChevron from '@/assets/images/story-detail/fc98795f94fb3de77be3555a1084439c3704382a.png'
import imgHiddenBg from '@/assets/images/story-detail/c9cdcb2bf813c2c37132378790976abbfd26f93f.png'
import imgHiddenThumb from '@/assets/images/story-detail/5db81ab66de74a72d673af862feaaf39cbe7b1d0.png'
import imgHiddenChevron from '@/assets/images/story-detail/36b162172af5a7594cf98affc66c3ff3b2c3b65c.png'
import imgHeroLamp from '@/assets/images/story-detail/7e9cfdff0fb8e2c10bdf4f1417a42575c5f8b014.png'
import imgHeroArmillary from '@/assets/images/story-detail/9b092a24a2e63f5677f16666350f210657a34c89.png'

const characters = [
  { name: '陆临川', role: '伙伴', image: imgCharLu, nameColor: '#a3a4a4', roleColor: '#5b5d5f' },
  { name: '苏念安', role: '知己', image: imgCharSu, nameColor: '#9b9b9c', roleColor: '#5f6162' },
  { name: '傅言深', role: '伙伴', image: imgCharFu, nameColor: '#9b9b9c', roleColor: '#555759' },
  { name: '叶清歌', role: '同行者', image: imgCharYe, nameColor: '#9b9c9d', roleColor: '#5d5e60' },
  { name: '顾承远', role: '观察者', image: imgCharGu, nameColor: '#8d8e8f', roleColor: '#5a5b5c' },
]

function SectionHeader({
  icon,
  iconClassName = 'h-[14px] w-[15px]',
  title,
  titleClassName = '',
}: {
  icon: string;
  iconClassName?: string;
  title: string;
  titleClassName?: string;
}) {
  return (
    <div className="flex items-center gap-[5px]">
      <img alt="" src={icon} className={`${iconClassName} shrink-0 object-contain`} />
      <h2 className={`text-[12px] leading-[15px] text-[#a9a9aa] ${titleClassName}`}>{title}</h2>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[31px] items-start justify-between px-[16px] pt-[11px]">
      <span className="font-inter text-[12px] leading-[14px] font-medium text-[#c0c1c1]">09:41</span>
      <div className="flex items-center gap-[4px]">
        <img alt="" src={imgStatusSignal} className="h-[10px] w-[15px] object-contain" />
        <img alt="" src={imgStatusWifi} className="h-[10px] w-[13px] object-contain" />
        <img alt="" src={imgStatusBattery} className="h-[10px] w-[21px] object-contain" />
      </div>
    </div>
  )
}

export default function App() {
  const [following, setFollowing] = useState(false)

  return (
    <FixedDesignCanvas
      className="bg-[#020408]"
      canvasClassName="bg-[#020408] font-sans antialiased"
    >
      {/* Hero — the imported frame's top image, with the title block sitting on
          its lower gradient. */}
      <header className="relative isolate h-[243px]">
        <div className="absolute inset-x-0 top-0 -z-10 h-[248px] overflow-hidden">
          <img alt="" src={imgHero} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[#020408]" />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#020408] to-transparent" />
        </div>

        <img
          alt=""
          src={imgHeroArmillary}
          className="pointer-events-none absolute left-[288px] top-[132px] h-[48px] w-[52px] object-contain"
        />
        <img
          alt=""
          src={imgHeroLamp}
          className="pointer-events-none absolute left-[343.5px] top-[114.5px] h-[42px] w-[50px] object-contain"
        />

        <StatusBar />

        <nav className="absolute inset-x-0 top-[40px] flex items-center justify-between px-[15px]">
          <button type="button" aria-label="返回" className="size-[30px]">
            <img alt="" src={imgNavBack} className="size-full object-contain" />
          </button>
          <div className="flex items-center gap-[11px]">
            <button type="button" aria-label="分享" className="size-[30px]">
              <img alt="" src={imgNavShare} className="size-full object-contain" />
            </button>
            <button type="button" aria-label="更多" className="size-[30px]">
              <img alt="" src={imgNavMore} className="size-full object-contain" />
            </button>
          </div>
        </nav>

        <div className="absolute left-[17px] top-[101px]">
          <h1 className="text-[17px] leading-[21px] font-bold text-[#b1b1b2]">命运回响</h1>
          <p className="mt-[7px] text-[10px] leading-[15px] text-[#535456]">一段可自由展开的互动故事</p>

          <div className="mt-[15px] flex items-center gap-[7px]">
            <img
              alt="小星帝"
              src={imgAuthorAvatar}
              className="size-[30px] shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-[4px]">
                <span className="text-[9px] leading-[13px] text-[#9a9b9b]">作者：</span>
                <span className="text-[11px] leading-[14px] text-[#938a80]">小星帝</span>
                <img alt="" src={imgIconGear} className="size-[10px] object-contain" />
              </div>
              <div className="flex items-center gap-[4px]">
                <span className="font-inter text-[9px] leading-[12px] text-[#535457]">ID: DxJ0ZWkVva</span>
                <img alt="" src={imgIconCopy} className="size-[8px] object-contain" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFollowing((value) => !value)}
          className="absolute right-[14px] top-[194px] flex h-[29px] w-[77px] items-center justify-center gap-[4px] overflow-hidden rounded-full"
        >
          <img alt="" src={imgFollowBg} className="absolute inset-0 size-full object-cover" />
          <img alt="" src={imgIconStar} className="relative size-[12px] object-contain" />
          <span className="relative text-[11px] leading-[14px] text-[#b5b5b5]">
            {following ? '已关注' : '关注'}
          </span>
        </button>

        <button
          type="button"
          className="absolute left-[15px] top-[207px] flex h-[27px] w-[101px] items-center gap-[5px] rounded-full border border-[#282a2d] bg-[#121417] px-[10px]"
        >
          <img alt="" src={imgIconSparkle} className="size-[12px] object-contain" />
          <span className="text-[11px] leading-[14px] text-[#9b9c9d]">对话模式</span>
          <img alt="" src={imgIconChevron} className="ml-auto h-[8px] w-[5px] object-contain" />
        </button>
      </header>

      <main className="mt-[9px] flex flex-col gap-[11px] px-[14px]">
        {/* 故事简介 */}
        <section className="ml-[2px] mr-[3px] h-[124px] rounded-[11px] border border-[#222426] bg-[#0d1012] px-[16px] pt-[17px]">
          <SectionHeader icon={imgIconBook} title="故事简介" titleClassName="text-[12.5px] font-bold" />
          <p className="mt-[14px] w-[298px] text-[11px] leading-[18.8px] text-[#616264]">
            你将踏入一个充满未知与可能的世界，结识性格各异的角色，你的每个选择都会影响故事的走向，书写独一无二的结局。这是你的故事，由你开启，由你决定。
          </p>
        </section>

        {/* 人物体系 */}
        <section className="mr-[1.5px] h-[174px] rounded-[14px] border-2 border-[#16171a] bg-[#0e0f12] px-[9px] pt-[14px]">
          <div className="px-[6px]">
            <SectionHeader icon={imgIconMask} iconClassName="h-[14px] w-[12px]" title="人物体系" />
          </div>
          <ul className="mt-[8px] flex gap-[3px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {characters.map((character) => (
              <li
                key={character.name}
                className="relative h-[127px] min-w-0 flex-1 shrink-0 basis-[68px] overflow-hidden rounded-[7px]"
              >
                <img
                  alt={character.name}
                  src={character.image}
                  className="h-[122px] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-[5px] pb-[11px]">
                  <span className="text-[10.5px] leading-[13px]" style={{ color: character.nameColor }}>
                    {character.name}
                  </span>
                  <span className="text-[8.5px] leading-[11px]" style={{ color: character.roleColor }}>
                    {character.role}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 剧情探索 */}
        <section className="ml-[0.5px] mr-[2.5px] h-[129px] rounded-[11px] border border-[#1a1b1e] bg-[#0d0f12] px-[4.5px] pt-[14px]">
          <div className="px-[5.5px]">
            <SectionHeader icon={imgIconPlot} iconClassName="h-[13px] w-[12.5px]" title="剧情探索" />
          </div>

          <div className="mt-[7px] grid h-[81px] grid-cols-2 gap-[4px]">
            <button
              type="button"
              className="relative flex items-center gap-[6px] overflow-hidden rounded-[7px] bg-[#0d0f12] pr-[6px] text-left"
            >
              <img
                alt=""
                src={imgVoiceThumb}
                className="h-[77px] w-[71px] shrink-0 rounded-[6px] object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] leading-[14px] text-[#9c9d9d]">心声</span>
                <span className="mt-[6px] block text-[8px] leading-[15px] text-[#58595a]">
                  聆听内心的声音，
                  <br />
                  解锁更多故事片段。
                </span>
              </span>
              <img
                alt=""
                src={imgVoiceChevron}
                className="h-[7px] w-[4px] shrink-0 object-contain"
              />
            </button>

            <button
              type="button"
              className="relative flex items-center gap-[6px] overflow-hidden rounded-[7px] pr-[6px] text-left"
            >
              <img alt="" src={imgHiddenBg} className="absolute inset-0 size-full object-cover" />
              <img
                alt=""
                src={imgHiddenThumb}
                className="relative h-[78px] w-[70px] shrink-0 rounded-[6px] object-cover"
              />
              <span className="relative min-w-0 flex-1">
                <span className="block text-[10.5px] leading-[14px] text-[#a2a2a3]">隐藏剧情</span>
                <span className="mt-[6px] block text-[8px] leading-[15px] text-[#555658]">
                  探索不为人知的秘密，
                  <br />
                  发现隐藏的故事线索。
                </span>
              </span>
              <img
                alt=""
                src={imgHiddenChevron}
                className="relative h-[7px] w-[4px] shrink-0 object-contain"
              />
            </button>
          </div>
        </section>
      </main>
    </FixedDesignCanvas>
  )
}
