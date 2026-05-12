import * as React from 'react';
import svgPaths from './svg-u5al272n02';
import { View, Text, Pressable } from 'react-native';

function SparkleIcon() {
  return (
    <svg className="w-[14px] h-[14px] shrink-0" viewBox="0 0 26 27" fill="none">
      <path d={svgPaths.p79c5600} fill="rgba(155,254,3,0.9)" />
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
    <Pressable 
      onPress={isActionable ? onClick : undefined}
      disabled={!isActionable}
      className={`flex items-center gap-[6px] px-[13px] py-[7px] rounded-full border-[1px] border-[rgba(155,254,3,0.2)] shadow-[0px_0px_5px_0px_rgba(155,254,3,0.2),0px_0px_10px_0px_rgba(155,254,3,0.1)] bg-transparent shrink-0 transition-all duration-300 ${disabled ? 'cursor-not-allowed grayscale-[0.8] opacity-40' : (loading ? 'cursor-progress text-glow' : 'cursor-pointer active:opacity-70 text-glow')} ${className}`}
      style={{
        // @ts-expect-error
        animation: loading ? 'pulse-glow 2s ease-in-out infinite' : 'none'
      }}
    >
      <View className={loading ? 'animate-spin' : ''} style={{ animationDuration: '2s', opacity: disabled ? 0.4 : 1 }}>
        <SparkleIcon />
      </View>
      <Text 
        className={`shrink-0 whitespace-nowrap ${loading ? 'loading-shimmer' : ''}`}
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: disabled ? "#6b7280" : "rgba(155,254,3,0.9)",
          ...(loading ? {
            backgroundImage: "linear-gradient(90deg, rgba(155,254,3,0.9) 0%, #fff 50%, rgba(155,254,3,0.9) 100%)",
            backgroundSize: "200% auto",
            
            
            
          } : {})
        }}
      >
        {displaySafeText}
      </Text>

      <style>{`
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0px 0px 5px 0px rgba(155,254,3,0.2), 0px 0px 10px 0px rgba(155,254,3,0.1);
            border-color: rgba(155,254,3,0.2);
          }
          50% { 
            box-shadow: 0px 0px 12px 2px rgba(155,254,3,0.4), 0px 0px 20px 0px rgba(155,254,3,0.2);
            border-color: rgba(155,254,3,0.5);
          }
        }
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Pressable>
  );
}
