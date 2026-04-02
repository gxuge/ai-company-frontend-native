import * as React from 'react';
import svgPaths from './svg-u5al272n02';

function SparkleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 26 27" fill="none">
      <path d={svgPaths.p79c5600} fill="#9BFE03" />
    </svg>
  );
}

export function AiGenerateBtn() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(155,254,3,0.2)] shadow-[0_0_8px_rgba(155,254,3,0.2),0_0_16px_rgba(155,254,3,0.1)] bg-transparent">
      <SparkleIcon />
      <span className="text-[#9bfe03] text-sm">{"\u4e00\u952e\u751f\u6210"}</span>
    </button>
  );
}
