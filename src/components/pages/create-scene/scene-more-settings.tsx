import { useState } from 'react'

import imgHint from '@/assets/images/create-scene/background-design/812072acd19087c94cbcf92a44c5f169309554c9.png'

// 氛围
import icMoodOppress from '@/assets/images/create-scene/background-design/ddf7dd67af262e0a882f702060eb330eb6cab975.png'
import imgMoodOppress from '@/assets/images/create-scene/background-design/ffad786d1733f832ce245c2715a79d44310c8aa2.png'
import icMoodDream from '@/assets/images/create-scene/background-design/d2f8cf63125f0e0a1385f4584b97a0bc35c5b693.png'
import imgMoodDream from '@/assets/images/create-scene/background-design/52852d8674ce39861f15bb7bc62a1974f0c6c5d4.png'
import icMoodMystic from '@/assets/images/create-scene/background-design/46721e76459016880f17da49b08a14fd27353fb5.png'
import imgMoodMystic from '@/assets/images/create-scene/background-design/3c2206d762f524f8d99457e3ca00d27f8af566ee.png'
import icMoodWarm from '@/assets/images/create-scene/background-design/58ace53483df5b5e7818095b4cb7983d8f2ffa9a.png'
import imgMoodWarm from '@/assets/images/create-scene/background-design/65af2d2f95fbececfa8610de39257ad39d0e493f.png'
import icMoodRandom from '@/assets/images/create-scene/background-design/ff9c4b51d8d2a3856c18a8ca2f741812ea835133.png'
import imgMoodRandom from '@/assets/images/create-scene/background-design/52a0b9ff89c5d17ee33b932070fedfb445ad989b.png'
import badgeMood from '@/assets/images/create-scene/background-design/510f3eacad88d88111aef12f2812e590114fe3f4.png'
import icSectionMood from '@/assets/images/create-scene/background-design/9192fb947cbfc0fbed2639ec5db2d726ee4f8df5.png'

// 天气
import icWeaFog from '@/assets/images/create-scene/background-design/d1bc6d48548109962be9375ffbf1ed50b52e4aee.png'
import imgWeaFog from '@/assets/images/create-scene/background-design/5a4a5082504933b4ebfe88671d51bb18d6b6f89b.png'
import icWeaSnow from '@/assets/images/create-scene/background-design/014623fe8ed5e73fc326d78935ea7bc9aaca410b.png'
import imgWeaSnow from '@/assets/images/create-scene/background-design/4724765aee9965cf319d2cd91fe2f3009242d8cf.png'
import icWeaRain from '@/assets/images/create-scene/background-design/b2bd8f10fcd086c3b42a14f09947ee505aed26b5.png'
import imgWeaRain from '@/assets/images/create-scene/background-design/2e0dd070ad6b83bd09136685e45fcf2c7a16744d.png'
import icWeaSun from '@/assets/images/create-scene/background-design/8e04bfc1d29cb12ef6415e77c5e43c963c52af08.png'
import imgWeaSun from '@/assets/images/create-scene/background-design/2fbff7c8c700c65e32ff16347674f005cab93ff0.png'
import icWeaRandom from '@/assets/images/create-scene/background-design/eff3eb8e24db31436b30af3f99b6009f6e2aeabb.png'
import imgWeaRandom from '@/assets/images/create-scene/background-design/d4e8ace47cbf903bf3a6850d54f817d46bca70aa.png'
import badgeWeather from '@/assets/images/create-scene/background-design/69d9e0b39cdbd5a12e4a254e7dbe4fdade67a374.png'
import icSectionWeather from '@/assets/images/create-scene/background-design/b45dd865e78fab1c9a872b44c1d0888b262250df.png'

// 时间
import icTimeMorning from '@/assets/images/create-scene/background-design/dc72ebb622b37163ab24f660b31f03f1f441155f.png'
import imgTimeMorning from '@/assets/images/create-scene/background-design/a7d6d4867b416eec15005d588c9d6a07922d3a90.png'
import icTimeNight from '@/assets/images/create-scene/background-design/98108d60890c8e465c2e3f54f7186158c247014a.png'
import imgTimeNight from '@/assets/images/create-scene/background-design/e34958ba03a370d8b01b6debc74d20180624f4c3.png'
import icTimeDusk from '@/assets/images/create-scene/background-design/6c1a751e7665cfb27d064a4143fd2202a882beb4.png'
import imgTimeDusk from '@/assets/images/create-scene/background-design/6ab0564bbd40f135817753747d870fd326b6cb0e.png'
import icTimeDay from '@/assets/images/create-scene/background-design/024974b227996ae08c69df9e25a172db04d62769.png'
import imgTimeDay from '@/assets/images/create-scene/background-design/f51f8b5a99ab8a902bd2450830362bf120de60c6.png'
import icTimeRandom from '@/assets/images/create-scene/background-design/eb4a30b27e971e7f5e1fe1bda497df178611ec70.png'
import imgTimeRandom from '@/assets/images/create-scene/background-design/9d628e32db1556bbbc2caa8a11b19b48c8e214ef.png'
import badgeTime from '@/assets/images/create-scene/background-design/2d26a3db0688d6e56d7cd16bd4f9b877dc90feb2.png'
import icSectionTime from '@/assets/images/create-scene/background-design/613cbff6614cb664fcaf3f788bd81bf8fc930c11.png'

// 头部 / 折叠态
import icChevronUp from '@/assets/images/create-scene/background-design/1f77be53fa3ddeba43a184a8a85234931c7f0ebd.png'
import icChevronDown from '@/assets/images/create-scene/background-design/45da26b8ff581c85156a770e76ea8c540cbd01de.png'
import icHeaderExpanded from '@/assets/images/create-scene/background-design/2ec611cd0e2aad0b57335b18135222eb98f9fcab.png'
import icHeaderCollapsed from '@/assets/images/create-scene/background-design/0ae1bf5205a59eff2d4bc9fcee795e2cf79635da.png'
import icChipMood from '@/assets/images/create-scene/background-design/b2049c06827995a1917973fa55f54f7fe2c1f02d.png'
import icChipWeather from '@/assets/images/create-scene/background-design/d416f0ae59bd923ffd867d3990c6a6e8a286655b.png'
import icChipTime from '@/assets/images/create-scene/background-design/23693f377a42bf850bb6998d8691933221be2c73.png'
import dotA from '@/assets/images/create-scene/background-design/33b779cc2f60d06386dff0baa9ffd53357705a14.png'
import dotB from '@/assets/images/create-scene/background-design/36abddfd2b6ccb243b9cf1fd1ac579e8e0fff5ce.png'

type Option = { id: string; label: string; icon: string; thumb: string }

type Section = {
  id: string
  title: string
  icon: string
  badge: string
  options: Option[]
}

const SECTIONS: Section[] = [
  {
    id: 'time',
    title: '时间',
    icon: icSectionTime,
    badge: badgeTime,
    options: [
      { id: 'random', label: '随机', icon: icTimeRandom, thumb: imgTimeRandom },
      { id: 'day', label: '白天', icon: icTimeDay, thumb: imgTimeDay },
      { id: 'dusk', label: '黄昏', icon: icTimeDusk, thumb: imgTimeDusk },
      { id: 'night', label: '夜晚', icon: icTimeNight, thumb: imgTimeNight },
      { id: 'morning', label: '清晨', icon: icTimeMorning, thumb: imgTimeMorning },
    ],
  },
  {
    id: 'weather',
    title: '天气',
    icon: icSectionWeather,
    badge: badgeWeather,
    options: [
      { id: 'random', label: '随机', icon: icWeaRandom, thumb: imgWeaRandom },
      { id: 'sun', label: '晴天', icon: icWeaSun, thumb: imgWeaSun },
      { id: 'rain', label: '雨天', icon: icWeaRain, thumb: imgWeaRain },
      { id: 'snow', label: '雪天', icon: icWeaSnow, thumb: imgWeaSnow },
      { id: 'fog', label: '雾天', icon: icWeaFog, thumb: imgWeaFog },
    ],
  },
  {
    id: 'mood',
    title: '氛围',
    icon: icSectionMood,
    badge: badgeMood,
    options: [
      { id: 'random', label: '随机', icon: icMoodRandom, thumb: imgMoodRandom },
      { id: 'warm', label: '温馨', icon: icMoodWarm, thumb: imgMoodWarm },
      { id: 'mystic', label: '神秘', icon: icMoodMystic, thumb: imgMoodMystic },
      { id: 'dream', label: '梦幻', icon: icMoodDream, thumb: imgMoodDream },
      { id: 'oppress', label: '压迫', icon: icMoodOppress, thumb: imgMoodOppress },
    ],
  },
]

const CHIPS = [
  { icon: icChipTime, label: '夜晚', dot: dotA },
  { icon: icChipWeather, label: '雨天', dot: dotB },
  { icon: icChipMood, label: '神秘', dot: null },
]

function OptionCard({
  option,
  badge,
  selected,
  onSelect,
}: {
  option: Option
  badge: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col items-center gap-[0.55rem] focus:outline-none"
      aria-pressed={selected}
    >
      <span
        className={`relative block w-full overflow-hidden rounded-[0.55rem] transition ${
          selected
            ? 'ring-2 ring-[#7a9438] shadow-[0_0_0_1px_rgba(122,148,56,0.35)]'
            : 'ring-1 ring-[#161b21]'
        }`}
      >
        <img
          src={option.thumb}
          alt={option.label}
          className="block aspect-[16/13] w-full object-cover"
        />
        {selected && (
          <img
            src={badge}
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-[5%] right-[5%] w-[18%] max-w-[1.4rem] min-w-[0.9rem]"
          />
        )}
      </span>
      <span className="flex items-center gap-[0.3rem] leading-none">
        <img src={option.icon} alt="" aria-hidden className="h-[0.95em] w-auto" />
        <span
          className={`text-[0.8rem] sm:text-[0.9rem] ${
            selected ? 'text-[#7a9438]' : 'text-[#8f9092]'
          }`}
        >
          {option.label}
        </span>
      </span>
    </button>
  )
}

export default function SceneMoreSettings() {
  const [expanded, setExpanded] = useState(true)
  const [selection, setSelection] = useState<Record<string, string>>({
    time: 'random',
    weather: 'random',
    mood: 'random',
  })

  return (
    <div className="min-h-screen w-full bg-[#020307] px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
        {/* 折叠态卡片 */}
        <section className="rounded-[1.1rem] border border-[#181e24] bg-[#0a0f14] px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-[0.6rem]">
              <div className="flex items-center gap-[0.55rem]">
                <img src={icHeaderCollapsed} alt="" aria-hidden className="h-[1.1rem] w-auto" />
                <h2 className="text-[1.05rem] font-bold text-[#aeafb1] sm:text-[1.15rem]">
                  更多设置
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-[0.45rem] gap-y-2 pl-[0.4rem]">
                {CHIPS.map((chip) => (
                  <span key={chip.label} className="flex items-center gap-[0.45rem]">
                    <span className="flex items-center gap-[0.3rem]">
                      <img src={chip.icon} alt="" aria-hidden className="h-[1rem] w-auto" />
                      <span className="text-[0.85rem] text-[#9a9b9d]">{chip.label}</span>
                    </span>
                    {chip.dot && (
                      <img src={chip.dot} alt="" aria-hidden className="mx-1 size-[3px]" />
                    )}
                  </span>
                ))}
              </div>
            </div>
            <img src={icChevronDown} alt="" aria-hidden className="mt-2 w-[1.15rem] opacity-80" />
          </div>
        </section>

        {/* 展开态面板 */}
        <section className="overflow-hidden rounded-[0.35rem] border-[6px] border-[#0b0d12] bg-[#0b0f14]">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-5"
          >
            <span className="flex flex-col gap-[0.4rem]">
              <span className="flex items-center gap-[0.55rem]">
                <img src={icHeaderExpanded} alt="" aria-hidden className="h-[1.1rem] w-auto" />
                <span className="text-[1.05rem] font-bold text-[#b4b5b6] sm:text-[1.15rem]">
                  更多设置
                </span>
              </span>
              <span className="pl-[0.15rem] text-[0.78rem] text-[#5a5e64]">
                可选项会影响背景的整体表现效果
              </span>
            </span>
            <img
              src={expanded ? icChevronUp : icChevronDown}
              alt=""
              aria-hidden
              className="mt-2 w-[1.15rem] opacity-80"
            />
          </button>

          {expanded && (
            <div className="border-t-[3px] border-[#0f131a]">
              {SECTIONS.map((section, index) => (
                <div
                  key={section.id}
                  className={`px-4 py-5 sm:px-5 ${
                    index > 0 ? 'border-t-[3px] border-[#0d1117]' : ''
                  }`}
                >
                  <div className="mb-3 flex items-center gap-[0.5rem]">
                    <img src={section.icon} alt="" aria-hidden className="h-[1.05rem] w-auto" />
                    <h3 className="text-[0.98rem] text-[#9d9e9f] sm:text-[1.05rem]">
                      {section.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-5 sm:gap-x-4">
                    {section.options.map((option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        badge={section.badge}
                        selected={selection[section.id] === option.id}
                        onSelect={() =>
                          setSelection((prev) => ({
                            ...prev,
                            [section.id]: prev[section.id] === option.id ? '' : option.id,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-center gap-[0.4rem] border-t-[3px] border-[#0d1117] px-4 py-5">
                <img src={imgHint} alt="" aria-hidden className="h-[1rem] w-auto" />
                <p className="text-[0.78rem] text-[#5f636a]">
                  以上选择为可选设置，不选择将使用默认效果
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
