const svgPaths = {
  p3a12d900: "",
  p86f2c00: "",
  p2fe93000: "",
  p1bdc1500: "",
  p303d4200: "",
  p17144680: "",
  p1fc50b00: "",
  p191b6f80: "",
  pe511420: "",
  p35d19300: "",
  p205c8f00: "",
  p18d9b280: "",
};

import { useState } from "react";

export function BottomNav() {
  const [active, setActive] = useState(0);

  const iconColor = (i: number) => (i === active ? "white" : "rgba(255,255,255,0.5)");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-black z-50">
      <div className="max-w-[430px] mx-auto flex items-center justify-around h-[56px] px-2">
        {/* Home */}
        <button onClick={() => setActive(0)} className="flex flex-col items-center justify-center w-12 h-12">
          <svg width="24" height="24" fill="none" viewBox="0 0 44.8574 44.8574">
            <path d="M15.7284 30.7725H27.4609" stroke={iconColor(0)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d={svgPaths.p2fe93000} stroke={iconColor(0)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
          </svg>
        </button>

        {/* Search */}
        <button onClick={() => setActive(1)} className="flex flex-col items-center justify-center w-12 h-12">
          <svg width="24" height="24" fill="none" viewBox="0 0 42.023 42.0218">
            <path d={svgPaths.p1bdc1500} stroke={iconColor(1)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d={svgPaths.p303d4200} stroke={iconColor(1)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
          </svg>
        </button>

        {/* Create (center, larger) */}
        <button onClick={() => setActive(2)} className="flex flex-col items-center justify-center w-14 h-14 -mt-2">
          <svg width="30" height="30" fill="none" viewBox="0 0 56.1186 56.1186">
            <path d={svgPaths.p17144680} stroke={iconColor(2)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d="M37.5226 28.0344H18.5975" stroke={iconColor(2)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d={svgPaths.p1fc50b00} stroke={iconColor(2)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
          </svg>
          <svg width="14" height="14" fill="none" viewBox="0 0 26.3457 28.7866" className="absolute mt-6">
            <path d={svgPaths.p191b6f80} stroke={iconColor(2)} strokeWidth="1" />
            <path d={svgPaths.pe511420} fill={iconColor(2)} stroke={iconColor(2)} strokeWidth="1" />
          </svg>
        </button>

        {/* Chat */}
        <button onClick={() => setActive(3)} className="flex flex-col items-center justify-center w-12 h-12">
          <svg width="24" height="24" fill="none" viewBox="0 0 44.8566 44.8566">
            <path d="M30.3765 23.2616H30.3947" stroke={iconColor(3)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d="M22.2871 23.2616H22.3053" stroke={iconColor(3)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d="M14.1988 23.2616H14.217" stroke={iconColor(3)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path d={svgPaths.p35d19300} stroke={iconColor(3)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
          </svg>
        </button>

        {/* Profile */}
        <button onClick={() => setActive(4)} className="flex flex-col items-center justify-center w-12 h-12">
          <svg width="24" height="24" fill="none" viewBox="0 0 34.7833 43.3687">
            <path d={svgPaths.p205c8f00} stroke={iconColor(4)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            <path clipRule="evenodd" d={svgPaths.p18d9b280} fillRule="evenodd" stroke={iconColor(4)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
          </svg>
        </button>
      </div>
      {/* Safe area bottom */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-black" />
    </div>
  );
}
