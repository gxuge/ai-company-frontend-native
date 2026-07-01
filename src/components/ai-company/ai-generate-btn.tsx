import * as React from 'react';
import { brandGreenRgba } from '@/components/ui/brand';
import svgPaths from './svg-u5al272n02';

function SparkleIcon() {
  return (
    <svg className="w-[14px] h-[14px] shrink-0" viewBox="0 0 26 27" fill="none">
      <path d={svgPaths.p79c5600} fill={brandGreenRgba(0.9)} />
    </svg>
  );
}

interface AiGenerateBtnProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function AiGenerateBtn({ 
  text = "一键生成", 
  onClick, 
  className = "",
  loading = false,
  disabled = false
}: AiGenerateBtnProps) {
  const displaySafeText = loading && text === '一键生成' ? '生成中...' : text;
  const isActionable = !loading && !disabled;

  return (
    <button 
      onClick={isActionable ? onClick : undefined}
      disabled={!isActionable}
      className={`flex items-center gap-[6px] px-[13px] py-[7px] rounded-full border-[1px] border-[rgba(var(--color-brand-green-rgb), 0.2)] shadow-[0px_0px_5px_0px_rgba(var(--color-brand-green-rgb), 0.2),0px_0px_10px_0px_rgba(var(--color-brand-green-rgb), 0.1)] bg-transparent shrink-0 transition-all duration-300 ${disabled ? 'cursor-not-allowed grayscale-[0.8] opacity-40' : (loading ? 'cursor-progress text-glow' : 'cursor-pointer active:opacity-70 text-glow')} ${className}`}
      style={{
        animation: loading ? 'pulse-glow 2s ease-in-out infinite' : 'none'
      }}
    >
      <div className={loading ? 'animate-pulse-star' : ''} style={{ animationDuration: '2s', opacity: disabled ? 0.4 : 1 }}>
        <SparkleIcon />
      </div>
      <span 
        className={`shrink-0 whitespace-nowrap ${loading ? 'loading-shimmer' : ''}`}
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          color: disabled ? "#6b7280" : brandGreenRgba(0.9),
          ...(loading ? {
            backgroundImage: `linear-gradient(90deg, ${brandGreenRgba(0.9)} 0%, #fff 50%, ${brandGreenRgba(0.9)} 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 2s linear infinite"
          } : {})
        }}
      >
        {displaySafeText}
      </span>

      <style>{`
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0px 0px 5px 0px ${brandGreenRgba(0.2)}, 0px 0px 10px 0px ${brandGreenRgba(0.1)};
            border-color: ${brandGreenRgba(0.2)};
          }
          50% { 
            box-shadow: 0px 0px 12px 2px ${brandGreenRgba(0.4)}, 0px 0px 20px 0px ${brandGreenRgba(0.2)};
            border-color: ${brandGreenRgba(0.5)};
          }
        }
        .animate-pulse-star {
          animation: pulse-star 1.2s ease-in-out infinite;
        }
        @keyframes pulse-star {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            filter: drop-shadow(0 0 2px ${brandGreenRgba(0.4)});
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
            filter: drop-shadow(0 0 8px ${brandGreenRgba(1)});
          }
        }
      `}</style>
    </button>
  );
}
