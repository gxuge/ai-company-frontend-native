import type { TsVoiceProfile } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';
import { tsVoiceApi } from '@/lib/api';
import EditSoundText from './components/edit-sound-text';
import { AiNavigateTabs } from '@/components/ai-company/ai-navigate-tabs';
import { Check, Play, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { AiEmpty } from '@/components/ai-company/ai-empty';
import { router } from 'expo-router';

const imgPlay = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/play.svg'));
const imgEdit = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/edit.svg'));
const imgChevronDown = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/chevron_down.svg'));
const imgListenHeadphone = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/listen_headphone.svg'));

const DEFAULT_PREVIEW_TEXT = '\u8FD9\u662F\u8BD5\u542C\u6587\u672C\uFF0C\u8BF7\u6839\u636E\u97F3\u8272\u53C2\u6570\u64AD\u653E\u3002';
const GENDERS = ['\u5168\u90E8', '\u7537', '\u5973'] as const;
const AGE_OPTIONS = ['\u5C11\u5E74', '\u9752\u5E74', '\u4E2D\u5E74', '\u8001\u5E74'] as const;

const VOICE_FALLBACK_LIST: TsVoiceProfile[] = [
  { id: 1, name: '\u674E\u660E', tags: [{ id: 1, tagName: '\u65B0\u95FB' }, { id: 2, tagName: '\u65C1\u767D' }], gender: 'male', ageGroup: 'teen' },
  { id: 2, name: '\u674E\u660E', tags: [{ id: 3, tagName: '\u65B0\u95FB' }, { id: 4, tagName: '\u65C1\u767D' }], gender: 'male', ageGroup: 'adult' },
  { id: 3, name: '\u674E\u660E', tags: [{ id: 5, tagName: '\u65B0\u95FB' }, { id: 6, tagName: '\u65C1\u767D' }], gender: 'male', ageGroup: 'adult' },
];

const MY_VOICES_FALLBACK_LIST: TsVoiceProfile[] = [
  { id: 101, name: '\u6211\u7684\u5F55\u97F31', tags: [{ id: 1, tagName: '\u65B0\u95FB' }, { id: 2, tagName: '\u65C1\u767D' }], gender: 'male', ageGroup: 'adult' },
  { id: 102, name: '\u674E\u660E', tags: [{ id: 3, tagName: '\u65B0\u95FB' }, { id: 4, tagName: '\u65C1\u767D' }], gender: 'male', ageGroup: 'teen' },
];

function toGenderQuery(label: string) {
  if (label === '\u7537') {
    return 'male';
  }
  if (label === '\u5973') {
    return 'female';
  }
  return undefined;
}

function toAgeGroupQuery(label: string) {
  if (label === '\u5C11\u5E74') {
    return 'teen';
  }
  if (label === '\u9752\u5E74' || label === '\u4E2D\u5E74') {
    return 'adult';
  }
  if (label === '\u8001\u5E74') {
    return 'senior';
  }
  return undefined;
}

function toGenderLabel(gender?: string) {
  if (gender === 'male') {
    return '\u7537';
  }
  if (gender === 'female') {
    return '\u5973';
  }
  return '\u5168\u90E8';
}

function toAgeLabel(ageGroup?: string) {
  if (ageGroup === 'child' || ageGroup === 'teen') {
    return '\u5C11\u5E74';
  }
  if (ageGroup === 'adult') {
    return '\u9752\u5E74';
  }
  if (ageGroup === 'senior') {
    return '\u8001\u5E74';
  }
  return '\u5C11\u5E74';
}

function resolveVoiceTags(voice: TsVoiceProfile) {
  const tags = (voice.tags || [])
    .map(item => item?.tagName)
    .filter((item): item is string => Boolean(item))
    .slice(0, 2);

  if (tags.length > 0) {
    return tags;
  }

  const fallback: string[] = [];
  if (voice.gender) {
    fallback.push(voice.gender);
  }
  if (voice.ageGroup) {
    fallback.push(voice.ageGroup);
  }
  return fallback.slice(0, 2);
}

function notifyMessage(message: string) {
  console.warn(message);
}

function Slider({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative flex h-[16px] w-full items-center">
      <div className="pointer-events-none absolute inset-x-0 z-0 h-[3px] rounded-full bg-[#333]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        {[...Array.from({ length: 6 })].map((_, i) => {
          const p = i * 20;
          return (
            <div
              key={`dot-${p}`}
              className="absolute top-1/2 h-[5px] w-[3px] -translate-y-1/2 rounded-full bg-[#555]"
              style={{ left: `calc(${p}% - ${p * 0.14}px + 5.5px)` }}
            />
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute top-1/2 z-10 size-[14px] -translate-y-1/2 rounded-full border-2 border-background bg-[rgba(155,254,3,0.9)] shadow-[0_0_8px_rgba(155,254,3,0.4)]"
        style={{ left: `calc(${pct}% - ${pct * 0.14}px)` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute inset-0 z-20 m-0 size-full cursor-pointer p-0 opacity-0"
      />
    </div>
  );
}

type VoiceCardProps = {
  voice: TsVoiceProfile;
  selected: boolean;
  onSelect: () => void;
  isMyVoice?: boolean;
  onRename?: (id: number) => void;
  onDelete?: (id: number) => void;
};

function VoiceCard({ voice, selected, onSelect, isMyVoice, onRename, onDelete }: VoiceCardProps) {
  const tags = resolveVoiceTags(voice);
  const [showMenu, setShowMenu] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-no-select="true"]')) {
      return;
    }
    onSelect();
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('[data-no-select="true"]')) return;
        setIsPressed(true);
      }}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={(e) => {
        if ((e.target as HTMLElement).closest('[data-no-select="true"]')) return;
        setIsPressed(true);
      }}
      onTouchEnd={() => setIsPressed(false)}
      className={`group relative flex w-full cursor-pointer items-center justify-between rounded-[15px] p-[12px] border-2 transition-all duration-300 hover:scale-[1.01] ${isPressed ? 'scale-[0.98]' : ''} ${
        selected
          ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-[#9BFE03] shadow-[0_0_30px_rgba(155,254,3,0.35)]'
          : 'bg-gradient-to-br from-[#222] to-[#1a1a1a] border-white/5 hover:border-[#9BFE03]/40 hover:shadow-[0_0_20px_rgba(155,254,3,0.2)]'
      }`}
    >
      <div className="flex items-center gap-[12px]">
        <div
          data-no-select={selected ? 'true' : undefined}
          onClick={(e) => {
            if (selected) {
              e.stopPropagation();
            }
          }}
          className="relative size-[48px] shrink-0 rounded-full ring-2 ring-white/10 group-hover:ring-[#9BFE03]/50 transition-all duration-300 overflow-hidden"
          style={{ backgroundImage: 'linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)' }}
        >
          <div className="flex size-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[20px]">
            🎙️
          </div>
          {/* Figma node 150:3037 Play Button Overlay */}
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px]">
              <Play className="ml-0.5 size-5 text-[#9BFE03] fill-[#9BFE03]" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="text-[14px] font-medium transition-colors duration-300 text-white group-hover:text-[#9BFE03]/90">{voice.name || '\u672A\u547D\u540D\u97F3\u8272'}</span>
          <div className="flex gap-[4px]">
            {tags.map(tag => (
              <span key={tag} className="rounded-[5px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.05)] px-[7px] py-[3px] text-[10px] text-[#9ca3af]">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div
          className={`size-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
            selected
              ? "bg-[#9BFE03] scale-100"
              : "bg-white/5 scale-0 group-hover:scale-100"
          }`}
        >
          <Check
            className={`w-3.5 h-3.5 ${
              selected ? "text-black" : "text-[#9BFE03]"
            }`}
            strokeWidth={3.5}
          />
        </div>

        {/* My Voice More Menu - Figma 517:1105 */}
        {isMyVoice && (
          <div className="relative flex items-center justify-center" data-no-select="true">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              data-no-select="true"
              className="flex size-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="size-5 text-[#9CA3AF] group-hover:text-white" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  data-no-select="true"
                  className="fixed inset-0 z-[100]" 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} 
                />
                <div data-no-select="true" className="absolute right-0 top-10 z-[110] w-28 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
                  <div className="flex flex-col">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onRename?.(voice.id);
                      }}
                      className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-white/90 hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <Pencil className="size-3 text-white/70" />
                      <span>重命名</span>
                    </button>
                    <div className="h-px w-full bg-white/5" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete?.(voice.id);
                      }}
                      className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-red-500/90 hover:bg-red-500/5 active:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="size-3 text-red-500/70" />
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function SoundEditPage() {
  const [activeLibraryTab, setActiveLibraryTab] = useState<'recommend' | 'my'>('recommend');
  const [pitch, setPitch] = useState(20);
  const [speed, setSpeed] = useState(1.2);
  const [voices, setVoices] = useState<TsVoiceProfile[]>(VOICE_FALLBACK_LIST);
  const [myVoices] = useState<TsVoiceProfile[]>(MY_VOICES_FALLBACK_LIST);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(VOICE_FALLBACK_LIST[0]?.id ?? null);
  const [preferredVoiceId, setPreferredVoiceId] = useState<number | null>(null);
  const [genderFilter, setGenderFilter] = useState<(typeof GENDERS)[number]>('\u5168\u90E8');
  const [ageOpen, setAgeOpen] = useState(false);
  const [age, setAge] = useState<(typeof AGE_OPTIONS)[number]>('\u5C11\u5E74');
  const [isEditSoundTextOpen, setIsEditSoundTextOpen] = useState(false);
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW_TEXT);
  const [isListening, setIsListening] = useState(false);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);

  const selectedVoiceFromRecommend = useMemo(
    () => voices.find(item => item.id === selectedVoiceId) || null,
    [selectedVoiceId, voices],
  );
  const selectedVoiceFromMyLibrary = useMemo(
    () => myVoices.find(item => item.id === selectedVoiceId) || null,
    [myVoices, selectedVoiceId],
  );
  const selectedVoice = selectedVoiceFromRecommend || selectedVoiceFromMyLibrary;

  useEffect(() => {
    let alive = true;

    const loadConfig = async () => {
      try {
        const config = await tsVoiceApi.getCurrentVoiceConfig();
        if (!alive) {
          return;
        }

        if (typeof config.pitchPercent === 'number') {
          setPitch(Number(config.pitchPercent));
        }
        if (typeof config.speedRate === 'number') {
          setSpeed(Number(config.speedRate));
        }

        const selectedId = config.selectedVoiceProfileId ?? config.selectedVoiceProfile?.id ?? null;
        if (selectedId) {
          setPreferredVoiceId(selectedId);
          setSelectedVoiceId(selectedId);
        }

        if (config.selectedVoiceProfile?.gender) {
          setGenderFilter(toGenderLabel(config.selectedVoiceProfile.gender));
        }
        if (config.selectedVoiceProfile?.ageGroup) {
          setAge(toAgeLabel(config.selectedVoiceProfile.ageGroup));
        }
      }
      catch (error) {
        console.warn('load voice config failed', error);
      }
    };

    void loadConfig();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    const loadVoices = async () => {
      try {
        const pageData = await tsVoiceApi.getVoiceProfiles({
          pageNo: 1,
          pageSize: 50,
          status: 1,
          gender: toGenderQuery(genderFilter),
          ageGroup: toAgeGroupQuery(age),
        });

        if (!alive) {
          return;
        }

        const records = (pageData.records || []).filter(item => item && item.id);
        const nextList = records.length > 0 ? records : VOICE_FALLBACK_LIST;
        setVoices(nextList);

        setSelectedVoiceId((prev) => {
          const preferred = preferredVoiceId ?? prev;
          if (preferred && nextList.some(item => item.id === preferred)) {
            return preferred;
          }
          return nextList[0]?.id ?? null;
        });
      }
      catch (error) {
        if (!alive) {
          return;
        }
        console.warn('load voice list failed', error);
        setVoices(VOICE_FALLBACK_LIST);
        setSelectedVoiceId(prev => prev ?? VOICE_FALLBACK_LIST[0]?.id ?? null);
      }
    };

    void loadVoices();
    return () => {
      alive = false;
    };
  }, [age, genderFilter, preferredVoiceId]);

  const handleReset = () => {
    setPitch(0);
    setSpeed(1);
  };

  const handleListen = async () => {
    if (isListening) {
      return;
    }
    if (!selectedVoice) {
      notifyMessage('\u8BF7\u5148\u9009\u62E9\u97F3\u8272');
      return;
    }
    const providerVoiceId = selectedVoice.providerVoiceId?.trim();
    if (!providerVoiceId) {
      notifyMessage('\u5F53\u524D\u97F3\u8272\u7F3A\u5C11 providerVoiceId\uFF0C\u65E0\u6CD5\u8BD5\u542C');
      return;
    }

    setIsListening(true);
    try {
      if (selectedVoiceFromRecommend) {
        await tsVoiceApi.saveCurrentVoiceConfig({
          selectedVoiceProfileId: selectedVoiceFromRecommend.id,
          pitchPercent: Number(pitch.toFixed(2)),
          speedRate: Number(speed.toFixed(2)),
        });
      }

      const preview = await tsVoiceApi.previewVoiceProfile({
        voiceProfileId: selectedVoiceFromRecommend?.id,
        voiceId: providerVoiceId,
        previewText,
        speed: Math.max(0.8, Math.min(1.2, Number(speed.toFixed(2)))),
        pitch: Math.max(-6, Math.min(6, Number((pitch / 10).toFixed(2)))),
        volume: 1.0,
      });

      const audioUrl = preview.previewAudioUrl;
      if (audioUrl && typeof window !== 'undefined' && typeof window.Audio !== 'undefined') {
        const audio = new window.Audio(audioUrl);
        await audio.play();
      }
      else {
        notifyMessage('\u5DF2\u4FDD\u5B58\u97F3\u8272\u914D\u7F6E\uFF0C\u6682\u672A\u83B7\u53D6\u5230\u8BD5\u542C\u97F3\u9891');
      }
    }
    catch (error) {
      const message = error instanceof Error ? error.message : '\u8BD5\u542C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5';
      notifyMessage(message);
    }
    finally {
      setIsListening(false);
    }
  };

  const handleMyVoiceRename = (voiceId: number) => {
    notifyMessage(`\u97F3\u8272ID ${voiceId}\uFF1A\u91CD\u547D\u540D\u80FD\u529B\u5F85\u540E\u7AEF\u63A5\u53E3\u8865\u5145`);
  };

  const handleMyVoiceDelete = (voiceId: number) => {
    notifyMessage(`\u97F3\u8272ID ${voiceId}\uFF1A\u5220\u9664\u80FD\u529B\u5F85\u540E\u7AEF\u63A5\u53E3\u8865\u5145`);
  };

  const handleDone = async () => {
    try {
      if (selectedVoiceId) {
        await tsVoiceApi.saveCurrentVoiceConfig({
          selectedVoiceProfileId: selectedVoiceId,
          pitchPercent: Number(pitch.toFixed(2)),
          speedRate: Number(speed.toFixed(2)),
        });
      }
      router.back();
    }
    catch (error) {
      console.warn('save voice config failed', error);
      router.back();
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-background font-['Noto_Sans_SC',sans-serif]">
      <div className="flex w-full flex-col items-stretch gap-0 py-[8px] px-[12.5px]">
          <div
            className={`flex flex-col border shadow-[0_0_20px_rgba(155,254,3,0.05)] transition-all duration-500 ${
              isSettingsCollapsed
                ? 'cursor-pointer rounded-xl border-[#4c4c4c] bg-[#161616] p-3'
                : 'rounded-[21px] border-[#4c4c4c] bg-[#161616] p-[16px]'
            }`}
            onClick={isSettingsCollapsed ? () => setIsSettingsCollapsed(false) : undefined}
          >
            <div className={`flex items-center justify-between transition-all duration-500 ${isSettingsCollapsed ? '' : 'pb-[4px]'}`}>
              <div className="flex items-center gap-[8px]">
                <div
                  className={`flex items-center justify-center rounded-full transition-all duration-500 ${isSettingsCollapsed ? 'size-8 text-[14px]' : 'size-[28px] text-[12px]'}`}
                  style={{ backgroundImage: 'linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)' }}
                >
                  <span className="flex size-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)]">🎙️</span>
                </div>
                <span className={`text-white transition-all duration-500 ${isSettingsCollapsed ? 'text-[14px]' : 'text-[18px] tracking-[-0.45px]'}`} style={{ fontWeight: 700 }}>
                  {selectedVoice?.name || '\u674E\u660E'}
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="relative flex h-[32px] items-center justify-end">
                  <div className={`flex overflow-hidden transition-all duration-500 ${isSettingsCollapsed ? 'w-[32px] opacity-100' : 'w-0 opacity-0'}`}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleListen(); }}
                      disabled={isListening}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(155,254,3,0.2)] transition-colors hover:bg-[rgba(155,254,3,0.3)] disabled:opacity-50"
                    >
                      <img src={imgPlay} alt="" className="size-[16px] object-contain ml-[2px]" />
                    </button>
                  </div>

                  <div className={`flex overflow-hidden transition-all duration-500 ${isSettingsCollapsed ? 'w-0 opacity-0 ml-0' : 'ml-[4px] w-[100px] opacity-100'}`}>
                    <button
                      type="button"
                      onClick={() => setIsEditSoundTextOpen(true)}
                      className="flex h-[32px] w-[100px] shrink-0 items-center justify-center gap-[6px] rounded-[8px] border border-[rgba(155,254,3,0.9)] bg-[#161616]"
                    >
                      <img src={imgEdit} alt="" className="size-[12px] shrink-0 object-contain" />
                      <span className="whitespace-nowrap text-[12px] text-[rgba(155,254,3,0.8)]">{`\u8BD5\u542C\u6587\u6848\u7F16\u8F91`}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsSettingsCollapsed(!isSettingsCollapsed); }}
                  className="p-[4px]"
                  style={{ marginLeft: isSettingsCollapsed ? '4px' : '4px' }}
                >
                  <img src={imgChevronDown} alt="" className={`w-[14px] h-[8px] object-contain opacity-50 transition-transform duration-500 ${isSettingsCollapsed ? 'rotate-0' : 'rotate-180'}`} />
                </button>
              </div>
            </div>

            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                display: 'grid',
                gridTemplateRows: isSettingsCollapsed ? '0fr' : '1fr',
                opacity: isSettingsCollapsed ? 0 : 1,
                marginTop: isSettingsCollapsed ? 0 : 8,
              }}
            >
              <div className="flex min-h-0 flex-col gap-[12px] overflow-hidden">
                <div className="flex items-center justify-between py-[4px]">
                  <span className="text-[12px] tracking-[0.6px] text-[#9ca3af] uppercase" style={{ fontWeight: 700 }}>{`\u53C2\u6570\u8C03\u6574`}</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-[5px] border border-[rgba(155,254,3,0.9)] px-[9px] py-[3px] text-[10px] text-[rgba(155,254,3,0.9)]"
                  >
                    {`\u91CD\u7F6E`}
                  </button>
                </div>

                <div className="flex gap-[32px] pt-[8px] pb-[16px]">
                  <div className="flex flex-1 flex-col gap-[8px]">
                    <div className="flex items-end justify-between">
                      <span className="text-[11px] text-[#9ca3af]" style={{ fontWeight: 500 }}>{`\u97F3\u8C03`}</span>
                      <span className="font-mono text-[12px] text-[rgba(155,254,3,0.9)]" style={{ fontWeight: 700 }}>
                        {pitch > 0 ? '+' : ''}
                        {pitch}
                        %
                      </span>
                    </div>
                    <Slider value={pitch} onChange={setPitch} min={-50} max={50} step={5} />
                  </div>
                  <div className="flex flex-1 flex-col gap-[8px]">
                    <div className="flex items-end justify-between">
                      <span className="text-[11px] text-[#9ca3af]" style={{ fontWeight: 500 }}>{`\u8BED\u901F`}</span>
                      <span className="font-mono text-[12px] text-[rgba(155,254,3,0.9)]" style={{ fontWeight: 700 }}>
                        {speed.toFixed(1)}
                        x
                      </span>
                    </div>
                    <Slider value={speed} onChange={setSpeed} min={0.5} max={2.0} step={0.1} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={handleListen}
                    disabled={isListening}
                    className="flex h-[45px] w-full items-center justify-center gap-[10px] rounded-[16px] border-2 border-[rgba(155,254,3,0.9)] disabled:opacity-60"
                  >
                    <img src={imgListenHeadphone} alt="" className="size-[19px] object-contain" />
                    <span className="text-[16px] text-[rgba(155,254,3,0.9)]" style={{ fontWeight: 700 }}>
                      {isListening ? '\u8BD5\u542C\u4E2D...' : '\u8BD5\u542C\u97F3\u8272'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        <div className="flex flex-col gap-[16px] pt-[20px] pb-[140px]">
          <div className="flex flex-row justify-center border-b border-[#1a1a1a] mb-[16px]">
            <AiNavigateTabs 
              options={[
                { label: '推荐音色库', value: 'recommend' },
                { label: '我的音色库', value: 'my' }
              ]} 
              activeValue={activeLibraryTab} 
              onChange={setActiveLibraryTab} 
              activeTextClassName="text-[rgba(155,254,3,0.9)] text-[18px] font-bold pb-[10px]"
              inactiveTextClassName="text-[#e7e7e7] text-[18px] pb-[10px]"
              indicatorClassName="absolute bottom-[-1px] h-[4px] bg-[rgba(155,254,3,0.9)] rounded-[2px]"
            />
          </div>

          {activeLibraryTab === 'recommend' && (
            <>
              <div className="flex items-center justify-between px-[4px]">
                <div className="flex items-center gap-[8px]">
                  <span className="pr-[4px] text-[12px] text-[#6b7280]" style={{ fontWeight: 700 }}>{`\u6027\u522B`}</span>
                  <div className="relative flex h-[31px] w-[150px] rounded-[8px] border border-[rgba(255,255,255,0.05)] bg-[#222] p-[3.5px]">
                    <div
                      className="absolute top-[3.5px] bottom-[3.5px] w-[calc((100%-7px)/3)] rounded-[5px] bg-[rgba(155,254,3,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(${GENDERS.indexOf(genderFilter) * 100}%)` }}
                    />
                    {GENDERS.map(g => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={`relative z-10 flex h-full flex-1 items-center justify-center rounded-[5px] text-[11px] transition-colors duration-300 ${genderFilter === g ? 'text-[#9bfe03]' : 'text-[#9ca3af]'}`}
                        style={{ fontWeight: 500 }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <span className="text-[12px] text-[#6b7280]" style={{ fontWeight: 700 }}>{`\u5E74\u9F84`}</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setAgeOpen(!ageOpen)}
                      className="relative z-30 flex h-[31px] w-[66px] items-center justify-between rounded-[8px] border border-[rgba(155,254,3,0.2)] bg-[#161616] px-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.1)] transition-colors hover:border-[rgba(155,254,3,0.4)]"
                    >
                      <span className="text-[11px] text-[#9bfe03]" style={{ fontWeight: 500 }}>{age}</span>
                      <img src={imgChevronDown} alt="" className={`h-[5px] w-[7px] object-contain transition-transform duration-200 ${ageOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {ageOpen && (
                      <div className="absolute top-[calc(100%+6px)] right-0 z-40 flex w-[66px] flex-col overflow-hidden rounded-[8px] border border-[rgba(255,255,255,0.06)] bg-[#222] py-[4px] shadow-lg">
                        {AGE_OPTIONS.map(a => (
                          <button
                            type="button"
                            key={a}
                            onClick={() => {
                              setAge(a);
                              setAgeOpen(false);
                            }}
                            className={`block w-full px-[12px] py-[6px] text-center text-[11px] transition-colors ${age === a ? 'bg-[rgba(155,254,3,0.08)] text-[#9bfe03]' : 'text-[#9ca3af] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[16px]">
                {voices.map(voice => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    selected={selectedVoiceId === voice.id}
                    onSelect={() => setSelectedVoiceId(voice.id)}
                  />
                ))}
              </div>
            </>
          )}

          {activeLibraryTab === 'my' && (
            <div className="flex flex-col gap-[16px]">
              {myVoices.map(voice => (
                <VoiceCard
                  key={voice.id}
                  voice={voice}
                  isMyVoice
                  selected={selectedVoiceId === voice.id}
                  onSelect={() => setSelectedVoiceId(voice.id)}
                  onRename={handleMyVoiceRename}
                  onDelete={handleMyVoiceDelete}
                />
              ))}
              {myVoices.length === 0 && (
                <AiEmpty 
                  title="还没有录音" 
                  description="在推荐音色库中选择音色或开始您的创作" 
                  style={{ marginTop: 40 }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {isEditSoundTextOpen && (
        <EditSoundText
          initialText={previewText}
          onCancel={() => setIsEditSoundTextOpen(false)}
          onConfirm={(nextText) => {
            setPreviewText(nextText);
            setIsEditSoundTextOpen(false);
          }}
        />
      )}

      {/* Done Button Group */}
      <div className="fixed bottom-0 left-0 right-0 z-[50] p-[20px] pb-[34px] bg-background/60 backdrop-blur-xl border-t border-white/5">
        <button
          type="button"
          onClick={handleDone}
          className="flex h-[50px] w-full items-center justify-center rounded-[16px] bg-[#9BFE03] shadow-[0_4px_20px_rgba(155,254,3,0.3)] active:scale-95 transition-all outline-none"
        >
          <span className="text-[16px] font-bold text-black">{`\u5B8C\u6210`}</span>
        </button>
      </div>
    </div>
  );
}
