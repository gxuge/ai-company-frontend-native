/* eslint-disable max-lines-per-function, perfectionist/sort-imports, style/arrow-parens, style/indent, style/member-delimiter-style, style/semi, unicorn/filename-case */
import type { TsRoleAuthorPublic, TsRoleDetail } from '@/lib/api'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'

import { pickTsImageUrl, tsRoleApi } from '@/lib/api'
import { FixedDesignCanvas } from '@/components/reusables/fixed-design-canvas'

import imgHero from '@/assets/images/role-intro/3ee541dc85231bbd1c483127388a437a603e8a53.png'
import imgChevronStory from '@/assets/images/role-intro/0e243c99c4af0857670eb975d5594e1525cee4e3.png'
import imgStoryThumb from '@/assets/images/role-intro/7dcd4901d7dc33db317eb7be96fadc79b35f66de.png'
import imgChevronMemory from '@/assets/images/role-intro/e701d9d89cb96e6c31d6d7d4aaefe93f83b3eede.png'
import imgMemoryThumb from '@/assets/images/role-intro/b57d09bb626f61dd25101e1efab892b6afbbbf74.png'
import imgIconBackground from '@/assets/images/role-intro/c1da549ac7648c9dc744cd23b62dac37c5030bd4.png'
import imgIconPersonality from '@/assets/images/role-intro/f49ee7335626fac8ea749ec66a610d6d2142bafb.png'
import imgIconIdentity from '@/assets/images/role-intro/9685e9c9d8404cd1b826cf2eb57526e56cee5de3.png'
import imgIconIntro from '@/assets/images/role-intro/8441201918895ce920cdbe9a79628e1ea89674f9.png'
import imgTabUnderline from '@/assets/images/role-intro/0c128e0a52eab493ab80e5627952000f85e8153c.png'
import imgTabRule from '@/assets/images/role-intro/b5916d7241d7466334ac091cd61327698eb04cf3.png'
import imgRule1 from '@/assets/images/role-intro/1238f0070ec170a75b04158521c96b81a809d10f.png'
import imgRule2 from '@/assets/images/role-intro/d446ec152e73e5dca36ac390f6b4070117333bc5.png'
import imgStar from '@/assets/images/role-intro/365c05757346cc49f89e6369189639b9011724d0.png'
import imgCopy from '@/assets/images/role-intro/ef4ab06fdb5c3cacc76ee580251157fe2b36cf76.png'
import imgAuthorAvatar from '@/assets/images/role-intro/79af03742284c24bf9105b549093c09ba06197e7.png'
import imgNameBadge from '@/assets/images/role-intro/feda8a0f6396ee14751ac1c3da6b112d809c5c31.png'
import imgMore from '@/assets/images/role-intro/16274c47e1ccb43e25262ff5058c7d2d38a37597.png'
import imgShareCircle from '@/assets/images/role-intro/a296a2c0f589833212dd287a09fc3771f9ae2adb.png'
import imgShareGlyph from '@/assets/images/role-intro/51ad5b64f55d47abcea4377ca3b2086e77d0fa78.png'
import imgBack from '@/assets/images/role-intro/e4d7890756ca91a14e8775234ca158e8c25ef47d.png'
import imgBattery from '@/assets/images/role-intro/863bd4962093c2bcfa870df660968ae431d08a50.png'
import imgWifi from '@/assets/images/role-intro/606c1caaa51f14df1bfd8a942c19d0b63c12cd12.png'
import imgSignal from '@/assets/images/role-intro/8effef8e93d4900d26be82f2f440161a4de724d3.png'
import imgStatDivider from '@/assets/images/role-intro/e7fae09917d14435b39da4b948087f259cd4064a.png'
import imgMetaDivider from '@/assets/images/role-intro/623f3c6c29ad8eb77f1e67f4f0b72693660e2ba8.png'

type RoleDetailDataState = {
  role: TsRoleDetail | null
  author: TsRoleAuthorPublic | null
  loading: boolean
  loadError: string | null
}

const stats = [
  { value: '4万', label: '连接者' },
  { value: '5601', label: '粉丝' },
  { value: '387万', label: '对话次数' },
]

const tabs = ['关于TA', '记忆', '故事'] as const
type Tab = (typeof tabs)[number]

const fallbackAttributes = [
  {
    icon: imgIconIntro,
    label: '角色简介',
    lines: ['他是权倾朝野的寒渊宗宗主，清冷孤傲，手段狠厉。', '在权力与血雨的世界里，唯独对你有了致命的偏执。'],
    rule: null,
  },
  { icon: imgIconIdentity, label: '身份', lines: ['寒渊宗宗主·剑修·天下十大宗主之一'], rule: null },
  { icon: imgIconPersonality, label: '性格', lines: ['清冷寡言·心机深沉·占有欲极强·外冷内热'], rule: imgRule2 },
  { icon: imgIconBackground, label: '背景', lines: ['出身名门，被迫掌权。', '以铁血手腕守护宗门，却在遇见你后乱了心。'], rule: imgRule1 },
]

const memories = [
  { title: '初雪那夜', desc: '他把外袍披在你肩上，只说了一句「别乱走」。' },
  { title: '断剑之约', desc: '折剑为誓，他从不轻许承诺，却为你破了例。' },
  { title: '寒渊闭关', desc: '七日不出，出关第一句问的却是你的名字。' },
]

const fallbackStories = [
  { title: '第一章 · 雪落寒渊', desc: '宗门大典之上，你第一次撞进他的视线。' },
  { title: '第二章 · 血雨之夜', desc: '血雨腥风里，他挡在了你身前。' },
  { title: '第三章 · 命里的劫', desc: '真相揭开时，他的偏执再无处遮掩。' },
]

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function useRoleDetailData(roleId: number | null): RoleDetailDataState {
  const [state, setState] = useState<RoleDetailDataState>({
    role: null,
    author: null,
    loading: false,
    loadError: null,
  })

  useEffect(() => {
    let alive = true
    if (!roleId) {
      return () => {
        alive = false
      }
    }

    const loadData = async () => {
      setState((previous) => ({ ...previous, loading: true, loadError: null }))
      const [roleResult, authorResult] = await Promise.allSettled([
        tsRoleApi.getRoleDetail(roleId),
        tsRoleApi.getRoleAuthorPublic(roleId),
      ])
      if (!alive) {
        return
      }

      const failedMessages: string[] = []
      if (roleResult.status !== 'fulfilled') {
        failedMessages.push('角色信息加载失败')
      }
      if (authorResult.status !== 'fulfilled') {
        failedMessages.push('作者信息加载失败')
      }

      setState((previous) => ({
        role: roleResult.status === 'fulfilled' ? roleResult.value : previous.role,
        author: authorResult.status === 'fulfilled' ? authorResult.value : previous.author,
        loading: false,
        loadError: failedMessages.length > 0 ? failedMessages.join('，') : null,
      }))
    }

    loadData().catch((error) => {
      if (!alive) {
        return
      }
      setState((previous) => ({
        ...previous,
        loading: false,
        loadError: error instanceof Error ? error.message : '页面加载失败',
      }))
    })

    return () => {
      alive = false
    }
  }, [roleId])

  return state
}

function EntryCard({
  thumb,
  chevron,
  title,
  desc,
  titleClass,
}: {
  thumb: string
  chevron: string
  title: string
  desc: string
  titleClass?: string
}) {
  return (
    <button
      type="button"
      className="flex h-[65px] w-full items-center gap-[12px] rounded-[10px] border border-[#131417] bg-[#16171c] p-[4px] text-left transition-colors hover:bg-[#1b1d22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8c8780]"
    >
      <img src={thumb} alt="" className="h-[57px] w-[82px] shrink-0 rounded-[7px] bg-[#0e1013] object-cover" />
      <span className="min-w-0 flex-1">
        <span className={`block text-[13px] leading-[16px] ${titleClass ?? 'text-[#b1b1b2]'}`}>{title}</span>
        <span className="mt-[5px] block truncate text-[10px] leading-[14px] text-[#57585b]">{desc}</span>
      </span>
      <img src={chevron} alt="" className="mr-[16px] h-[10px] w-[5.5px] shrink-0 object-contain opacity-80" />
    </button>
  )
}

function ListPanel({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`flex items-start gap-3 py-3.5 ${i > 0 ? 'border-t border-[#1e2023]' : ''}`}
        >
          <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-[#4a4b4f]" />
          <span className="min-w-0">
            <span className="block text-[13px] text-[#9b9997]">{item.title}</span>
            <span className="mt-1 block text-[12.5px] leading-relaxed text-[#6f7073]">{item.desc}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function CharacterProfile() {
  const params = useLocalSearchParams<{ roleId?: string | string[]; id?: string | string[] }>()
  const roleId = useMemo(() => {
    const raw = firstParam(params.roleId) ?? firstParam(params.id)
    if (!raw) {
      return null
    }
    const parsed = Number(raw)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }, [params.id, params.roleId])
  const { role, author, loading, loadError } = useRoleDetailData(roleId)
  const [tab, setTab] = useState<Tab>('关于TA')
  const [following, setFollowing] = useState(false)
  const [copied, setCopied] = useState(false)
  const characterId = role?.id ? String(role.id) : 'DxJ0ZWkVva'
  const heroImage = pickTsImageUrl(role, 'character_image', 'character_avatar') || imgHero
  const displayRoleName = role?.roleName || (loading ? '加载中...' : '江城渊')
  const displayGreeting = loadError
    || role?.greeting
    || (loading ? '正在加载角色信息...' : '“你是我命里失控的劫，也是唯一的波。”')
  const displayAuthorName = author?.displayName || '小皇帝'
  const authorAvatar = author?.avatar || imgAuthorAvatar
  const attributes = useMemo(() => {
    if (!role) {
      return fallbackAttributes
    }

    const personality = [role.toneTendency, role.interactionMode].filter(Boolean).join('·')
    return [
      {
        icon: imgIconIntro,
        label: '角色简介',
        lines: [role.roleSubtitle || role.greeting || fallbackAttributes[0].lines[0]],
        rule: null,
      },
      {
        icon: imgIconIdentity,
        label: '身份',
        lines: [role.occupation || fallbackAttributes[1].lines[0]],
        rule: null,
      },
      {
        icon: imgIconPersonality,
        label: '性格',
        lines: [personality || fallbackAttributes[2].lines[0]],
        rule: imgRule2,
      },
      {
        icon: imgIconBackground,
        label: '背景',
        lines: [role.backgroundStory || fallbackAttributes[3].lines.join('')],
        rule: imgRule1,
      },
    ]
  }, [role])
  const storyItems = useMemo(() => {
    if (!role?.backgroundStory) {
      return fallbackStories
    }
    return [{
      title: role.roleName ? `${role.roleName}的故事` : '角色故事',
      desc: role.backgroundStory,
    }]
  }, [role])

  const copyId = () => {
    navigator.clipboard?.writeText(characterId).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <FixedDesignCanvas
      className="bg-[#080a0d]"
      canvasClassName="bg-[#080a0d] text-[#cccccd]"
    >
        {/* Hero */}
        <div className="relative h-[260px] w-full overflow-hidden bg-[#0e1013]">
          <img
            src={heroImage}
            alt={`${displayRoleName}角色立绘`}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#080a0d] via-[#080a0d]/75 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

          {/* Status bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-3">
            <span className="text-[13.5px] font-medium tracking-tight text-[#b6b7b7]">09:41</span>
            <span className="flex items-center gap-1.5">
              <img src={imgSignal} alt="" className="h-[11px] w-[17px] object-contain" />
              <img src={imgWifi} alt="" className="h-[11px] w-[14px] object-contain" />
              <img src={imgBattery} alt="" className="h-[11px] w-[24px] object-contain" />
            </span>
          </div>

          {/* Nav */}
          <div className="absolute inset-x-0 top-[42px] flex items-center justify-between px-4">
            <button type="button" aria-label="返回" className="transition-opacity hover:opacity-80" onClick={() => router.back()}>
              <img src={imgBack} alt="" className="size-[28px] object-contain" />
            </button>
            <span className="flex items-center gap-2">
              <button type="button" aria-label="分享" className="relative transition-opacity hover:opacity-80">
                <img src={imgShareCircle} alt="" className="size-[28px] object-contain" />
                <img
                  src={imgShareGlyph}
                  alt=""
                  className="absolute left-1/2 top-1/2 h-[12px] w-[13.5px] -translate-x-1/2 -translate-y-1/2 object-contain"
                />
              </button>
              <button type="button" aria-label="更多" className="transition-opacity hover:opacity-80">
                <img src={imgMore} alt="" className="size-[28px] object-contain" />
              </button>
            </span>
          </div>
        </div>

        {/* Identity block */}
        <div className="absolute inset-x-0 top-[135px] h-[114px] px-5">
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] leading-[31px] text-[#cccccd]">{displayRoleName}</h1>
            <img src={imgNameBadge} alt="" className="h-[23px] w-[24px] object-contain" />
          </div>
          <p className="mt-[8px] line-clamp-2 w-[110px] text-[9.5px] leading-[15px] text-[#6e6f72]">
            {displayGreeting}
          </p>

          <div className="absolute left-5 top-[94px] flex h-[20px] items-center gap-[7px]">
            <img src={authorAvatar} alt="" className="h-[20px] w-[21.5px] shrink-0 rounded-full object-cover" />
            <span className="text-[8px] leading-[12px] text-[#717274]">作者：</span>
            <span className="text-[10.5px] leading-[14px] text-[#928874]">{displayAuthorName}</span>
            <img src={imgMetaDivider} alt="" className="h-[9.5px] w-px object-fill" />
            <button
              type="button"
              onClick={copyId}
              className="flex min-w-0 items-center gap-[4px] text-[10.5px] leading-[13px] text-[#6e6f71] transition-colors hover:text-[#9b9997]"
            >
              <span className="truncate">{copied ? '已复制 ID' : `ID: ${characterId}`}</span>
              <img src={imgCopy} alt="" className="h-[10px] w-[9px] shrink-0 object-contain" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFollowing((v) => !v)}
            aria-pressed={following}
            className={`absolute right-[15px] top-[81px] flex h-[30px] w-[76px] items-center justify-center gap-[5px] rounded-full border-2 text-[11px] leading-[14px] transition-colors ${
              following
                ? 'border-[#3a3630] bg-[#23211d] text-[#d6cfc0]'
                : 'border-[#222224] bg-[#16181b] text-[#afaca5] hover:border-[#33342f]'
            }`}
          >
            <img src={imgStar} alt="" className="size-[11.5px] object-contain" />
            {following ? '已关注' : '关注'}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-[4px] px-[16.5px]">
          <div className="grid h-[57px] grid-cols-3 rounded-[9.5px] border border-[#1a1c1f] bg-[#14161a]">
            {stats.map((stat, i) => (
              <div key={stat.label} className="relative flex flex-col items-center justify-center gap-[4px]">
                {i > 0 && (
                  <img
                    src={imgStatDivider}
                    alt=""
                    className="absolute left-0 top-1/2 h-[32px] w-px -translate-y-1/2 object-fill"
                  />
                )}
                <span className="text-[13px] leading-[15px] text-[#9c9c9d]">{stat.value}</span>
                <span className="text-[10.5px] leading-[13px] text-[#65666a]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed detail panel */}
        <div className="mt-[9px] px-4">
          <div className="min-h-[232px] rounded-[11px] border border-[#121417] bg-[#16181c] px-4 pt-px">
            <div className="relative -ml-[16.5px] h-[41px] w-[372px]">
              <img
                src={imgTabRule}
                alt=""
                className="absolute left-[7.5px] top-[37px] h-[1.5px] w-[360px] object-fill"
              />
              {tabs.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTab(label)}
                  className={`absolute top-[13px] flex h-[16px] items-center justify-center border-0 bg-transparent p-0 text-[13px] leading-[16px] outline-none transition-colors focus:outline-none focus-visible:outline-none ${
                    label === '关于TA'
                      ? 'left-[27px] w-[44px]'
                      : label === '记忆'
                        ? 'left-[108.5px] w-[28px]'
                        : 'left-[176.5px] w-[28px]'
                  } ${
                    tab === label
                      ? 'text-[#a1a1a2]'
                      : label === '记忆'
                        ? 'text-[#7e7f81] hover:text-[#9a9a9c]'
                        : 'text-[#7f7f82] hover:text-[#9a9a9c]'
                  }`}
                >
                  {label}
                  {tab === label && (
                    <img
                      src={imgTabUnderline}
                      alt=""
                      className="absolute left-1/2 top-[23.5px] z-10 h-[2px] w-[43.5px] max-w-none -translate-x-1/2 object-fill"
                    />
                  )}
                </button>
              ))}
            </div>

            {tab === '关于TA' && (
              <div className="flex flex-col">
                {attributes.map((attr, i) => (
                  <div
                    key={attr.label}
                    className={`flex items-center gap-3 ${
                      i === 0
                        ? 'min-h-[54px]'
                        : i === 1
                          ? 'min-h-[38px]'
                          : i === 2
                            ? 'min-h-[36px]'
                            : 'min-h-[59px]'
                    } ${i > 0 ? 'border-t border-[#1e2023]' : ''}`}
                  >
                    <img src={attr.icon} alt="" className="size-[14px] shrink-0 object-contain" />
                    <span className="w-[52px] shrink-0 text-[10.5px] leading-[14px] text-[#8c8780]">{attr.label}</span>
                    <span className="min-w-0 flex-1 text-[10.5px] leading-[15px] text-[#6f7073]">
                      {attr.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tab === '记忆' && (
              <div className="pt-1 pb-2">
                <ListPanel items={memories} />
              </div>
            )}

            {tab === '故事' && (
              <div className="pt-1 pb-2">
                <ListPanel items={storyItems} />
              </div>
            )}
          </div>
        </div>

        {/* Entry cards */}
        <div className="mt-[9px] flex flex-col gap-[6px] px-4">
          <EntryCard
            thumb={imgMemoryThumb}
            chevron={imgChevronMemory}
            title="记忆"
            desc="与他的点滴回忆，藏在每个瞬间里。"
          />
          <EntryCard
            thumb={imgStoryThumb}
            chevron={imgChevronStory}
            title="故事"
            desc={role?.backgroundStory || '探索他的故事，揭开命运的真相。'}
            titleClass="font-bold text-[#9e9ea0]"
          />
        </div>
    </FixedDesignCanvas>
  )
}
