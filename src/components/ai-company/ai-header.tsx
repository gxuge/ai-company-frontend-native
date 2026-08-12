import type { ReactNode } from 'react';
import { router } from 'expo-router';

const fontBase = 'font-[\'Noto_Sans_SC\',sans-serif]';

type AiHeaderProps = {
  title: string;
  className?: string;
  onBack?: () => void;
  rightElement?: ReactNode;
};

export function AiHeader({ title, className = '', onBack, rightElement }: AiHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
    else if (router.canGoBack()) {
      router.back();
    }
    else {
      router.push('../'); // Fallback if no history
    }
  };

  return (
    <header className={`relative flex items-center justify-between ${className}`}>
      <button
        type="button"
        aria-label="返回"
        onClick={handleBack}
        className="z-10 grid size-10 shrink-0 place-items-center rounded-full bg-[#232322] transition-transform active:scale-95"
      >
        <svg aria-hidden="true" width="18" height="17" viewBox="0 0 35 33.6" fill="none">
          <path
            clipRule="evenodd"
            d="M29.3419 15.3994H10.3327L17.3915 8.36998L15.4161 6.38618L4.95811 16.8008L15.4161 27.214L17.3915 25.2302L10.3299 18.1994H29.3419V15.3994Z"
            fill="white"
            fillRule="evenodd"
          />
        </svg>
      </button>
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <h1 className={`m-0 text-lg font-bold text-white ${fontBase}`}>{title}</h1>
      </div>
      {/* Right slot: custom element or symmetry spacer */}
      {rightElement ?? <div className="size-10 shrink-0" />}
    </header>
  );
}
