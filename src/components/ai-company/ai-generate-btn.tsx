import * as React from 'react';
import svgPaths from './svg-u5al272n02';

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
}

export function AiGenerateBtn({ text = "一键生成", onClick, className = "" }: AiGenerateBtnProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-[6px] px-[13px] py-[7px] rounded-full border-[1px] border-[rgba(155,254,3,0.2)] shadow-[0px_0px_5px_0px_rgba(155,254,3,0.2),0px_0px_10px_0px_rgba(155,254,3,0.1)] bg-transparent cursor-pointer shrink-0 ${className}`}
    >
      <SparkleIcon />
      <span 
        className="text-[rgba(155,254,3,0.9)] shrink-0 whitespace-nowrap"
        style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </button>
  );
}
