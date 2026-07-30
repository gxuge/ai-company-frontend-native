import { AiHeader } from '@/components/ai-company/ai-header';
import { useSelectedLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n/resources';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

// Reusable SectionCard component (could be extracted later)
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl">
      <div className="bg-[rgba(30,35,40,0.6)] rounded-2xl border border-white/10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.3)]">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/10 mx-4" />;
}

const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja', name: '日本語' },
];

export function LanguagePage() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSelectedLanguage();
  const router = useRouter();

  const handleLanguageSelect = (langCode: Language) => {
    if (langCode === language) return;
    setLanguage(langCode);
    // Assuming we want to go back automatically after selecting a language.
    // If not, we can remove this, but changing language usually restarts the app on native.
    if (typeof window !== 'undefined') {
        // on web, it will reload, but let's navigate back first if it doesn't instantly reload
        router.back();
    }
  };

  return (
    <div className="relative min-h-full bg-black font-['Noto_Sans_SC',sans-serif] overflow-auto">
      {/* Background gradient blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 450,
            left: -40,
            top: -180,
            background: "rgba(88,28,135,0.1)",
            filter: "blur(45px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 450,
            right: -40,
            bottom: -90,
            background: "rgba(30,58,138,0.1)",
            filter: "blur(55px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 270,
            left: "20%",
            top: "40%",
            background: "rgba(54,83,20,0.1)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="px-5" style={{ paddingTop: 12, paddingBottom: 12 }}>
          <AiHeader title={t('settings.languagePage.title')} />
        </div>

        {/* Sections */}
        <div className="px-5 pt-3 pb-6 flex flex-col gap-5">
          <SectionCard>
            {LANGUAGES.map((lang, index) => {
              const isSelected = language === lang.code;
              return (
                <div key={lang.code}>
                  <button
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="flex items-center justify-between w-full px-5 py-4 active:bg-white/5 transition-colors"
                  >
                    <span
                      className={`font-['Noto_Sans_SC',sans-serif] ${
                        isSelected ? 'text-white' : 'text-gray-300'
                      }`}
                      style={{ fontSize: 16, fontWeight: isSelected ? 500 : 400 }}
                    >
                      {lang.name}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      </div>
                    )}
                  </button>
                  {index < LANGUAGES.length - 1 && <Divider />}
                </div>
              );
            })}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
