/**
 * SoundGenerating — 声音生成中的覆盖组件
 * 合并自 pages/sound-generating 页面及其 VoiceLoadingInput 子组件
 */
export function SoundGenerating() {
  return (
    <div className="relative w-full rounded-[30px] bg-black border-[1.923px] border-solid border-[#494949] px-8 py-6">
      <div className="flex items-center gap-4">
        {/* Left: Sound Wave Icon with breathing effect */}
        <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
          {/* Outer pulse ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-[rgba(155,254,3,0.3)]"
            style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
          />
          {/* Inner circle with sound waves */}
          <div className="relative w-10 h-10 rounded-full bg-[rgba(155,254,3,0.15)] flex items-center justify-center">
            <div className="flex items-center gap-[3px]">
              {[0, 150, 300].map((delay, i) => (
                <div
                  key={i}
                  className="w-[2.5px] rounded-full bg-[rgba(155,254,3,0.9)]"
                  style={{
                    animation: 'wave-bar 0.8s ease-in-out infinite',
                    animationDelay: `${delay}ms`,
                    height: '8px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Text Content */}
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-[15px] leading-tight text-[rgba(155,254,3,0.9)] font-['Noto_Sans_SC',sans-serif]">
            正在生成声音
          </p>
          <p className="text-[13px] leading-tight text-[#9ca3af] font-['Noto_Sans_SC',sans-serif]">
            匹配角色声线中
          </p>
          {/* Thin progress bar */}
          <div className="relative w-[120px] h-[2px] bg-[rgba(155,254,3,0.1)] rounded-full mt-2 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-transparent via-[rgba(155,254,3,0.9)] to-transparent"
              style={{ animation: 'progress-flow 1.5s linear infinite' }}
            />
          </div>
        </div>

        {/* Right: Loading dots */}
        <div className="shrink-0 flex gap-1">
          {[0, 200, 400].map((delay, i) => (
            <div
              key={i}
              className="w-[5px] h-[5px] rounded-full bg-[rgba(155,254,3,0.6)]"
              style={{
                animation: 'dot-pulse 1.2s ease-in-out infinite',
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        @keyframes wave-bar {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        @keyframes progress-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
