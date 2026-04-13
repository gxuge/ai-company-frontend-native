import type { TsVoiceProfile } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';
import { tsVoiceApi } from '@/lib/api';
import EditSoundText from './components/edit-sound-text';

const imgPlay = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/play.svg'));
const imgCheckCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/check_circle.svg'));
const imgCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/sound-edit/circle.svg'));
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
};

function VoiceCard({ voice, selected, onSelect }: VoiceCardProps) {
  const tags = resolveVoiceTags(voice);

  return (
    <div
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center justify-between rounded-[15px] bg-[#161616] p-[12px] ${selected ? 'border border-[#e9fac8] shadow-[0_0_10px_rgba(155,254,3,0.05)]' : ''}`}
    >
      <div className="flex items-center gap-[12px]">
        <div className="relative size-[48px] shrink-0 rounded-full" style={{ backgroundImage: 'linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)' }}>
          <div className="flex size-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[20px]">
            🎙️
          </div>
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] backdrop-blur-[1px]">
              <img src={imgPlay} alt="" className="size-[18px] object-contain" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="text-[14px] text-white" style={{ fontWeight: 700 }}>{voice.name || '\u672A\u547D\u540D\u97F3\u8272'}</span>
          <div className="flex gap-[4px]">
            {tags.map(tag => (
              <span key={tag} className="rounded-[5px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.05)] px-[7px] py-[3px] text-[10px] text-[#9ca3af]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      {selected
        ? (
            <img src={imgCheckCircle} alt="" className="size-[23px] object-contain" />
          )
        : (
            <img src={imgCircle} alt="" className="size-[23px] object-contain" />
          )}
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function SoundEditPage() {
  const [pitch, setPitch] = useState(20);
  const [speed, setSpeed] = useState(1.2);
  const [voices, setVoices] = useState<TsVoiceProfile[]>(VOICE_FALLBACK_LIST);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(VOICE_FALLBACK_LIST[0]?.id ?? null);
  const [preferredVoiceId, setPreferredVoiceId] = useState<number | null>(null);
  const [genderFilter, setGenderFilter] = useState<(typeof GENDERS)[number]>('\u5168\u90E8');
  const [ageOpen, setAgeOpen] = useState(false);
  const [age, setAge] = useState<(typeof AGE_OPTIONS)[number]>('\u5C11\u5E74');
  const [isEditSoundTextOpen, setIsEditSoundTextOpen] = useState(false);
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW_TEXT);
  const [isListening, setIsListening] = useState(false);

  const selectedVoice = useMemo(
    () => voices.find(item => item.id === selectedVoiceId) || null,
    [selectedVoiceId, voices],
  );

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

    setIsListening(true);
    try {
      await tsVoiceApi.saveCurrentVoiceConfig({
        selectedVoiceProfileId: selectedVoice.id,
        pitchPercent: Number(pitch.toFixed(2)),
        speedRate: Number(speed.toFixed(2)),
      });

      const preview = await tsVoiceApi.previewVoiceProfile({
        voiceProfileId: selectedVoice.id,
        previewText,
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

  return (
    <div className="flex min-h-screen justify-center bg-background font-['Noto_Sans_SC',sans-serif]">
      <div className="flex w-full flex-col items-stretch gap-0 py-[8px] px-[12.5px]">
        <div className="flex flex-col gap-[12px] rounded-[21px] border border-[#4c4c4c] bg-[#161616] p-[16px] shadow-[0_0_20px_rgba(155,254,3,0.05)]">
          <div className="flex items-center justify-between pb-[4px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex size-[28px] items-center justify-center rounded-full text-[12px]" style={{ backgroundImage: 'linear-gradient(135deg, rgb(55,65,81) 0%, rgb(17,24,39) 100%)' }}>
                <span className="flex size-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)]">🎙️</span>
              </div>
              <span className="text-[18px] tracking-[-0.45px] text-white" style={{ fontWeight: 700 }}>{selectedVoice?.name || '\u674E\u660E'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditSoundTextOpen(true)}
              className="flex h-[32px] shrink-0 items-center gap-[8px] rounded-[8px] border border-[rgba(155,254,3,0.9)] bg-[#161616] px-[13px]"
            >
              <img src={imgEdit} alt="" className="size-[12px] object-contain" />
              <span className="text-[12px] text-[rgba(155,254,3,0.8)]">{`\u8BD5\u542C\u6587\u6848\u7F16\u8F91`}</span>
            </button>
          </div>

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

        <div className="flex flex-col gap-[16px] pt-[20px] pb-[96px]">
          <h2 className="pl-[4px] text-[14px] tracking-[0.7px] text-[#9ca3af] uppercase" style={{ fontWeight: 700 }}>{`\u63A8\u8350\u97F3\u8272\u5E93`}</h2>

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
    </div>
  );
}
