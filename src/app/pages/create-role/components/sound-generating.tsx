import { View, Text } from 'react-native';
/**
 * SoundGenerating — 声音生成中的覆盖组件
 * 合并自 pages/sound-generating 页面及其 VoiceLoadingInput 子组件
 */
export function SoundGenerating({ mini = false }: { mini?: boolean }) {
  if (mini) {
    return (
      <View className="flex h-full w-full items-center gap-3 bg-black px-4">
        {/* Left: Shrunk Sound Wave Icon */}
        <View className="relative size-8 shrink-0 flex items-center justify-center">
          <View
            className="absolute inset-0 rounded-full border-2 border-[rgba(155,254,3,0.3)]"
            style={{  }}
          />
          <View className="relative size-6 rounded-full bg-[rgba(155,254,3,0.15)] flex items-center justify-center">
            <View className="flex items-center gap-[2px]">
              {[0, 150, 300].map((delay, i) => (
                <View
                  key={i}
                  className="w-[2px] rounded-full bg-[rgba(155,254,3,0.9)]"
                  style={{
                    
                    animationDelay: `${delay}ms`,
                    height: 6,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Text Content */}
        <Text className="text-[14px] font-medium text-[rgba(155,254,3,0.9)] font-['Noto_Sans_SC',sans-serif]">
          正在生成声音...
        </Text>

        <style>{`
          @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.2; }
          }
          @keyframes wave-bar-mini {
            0%, 100% { height: 6px; }
            50% { height: 12px; }
          }
        `}</style>
      </View>
    );
  }

  return (
    <View className="relative w-full rounded-[30px] bg-black border-[1.923px] border-solid border-[#494949] px-8 py-6">
      <View className="flex items-center gap-4">
        {/* Left: Sound Wave Icon with breathing effect */}
        <View className="relative shrink-0 w-12 h-12 flex items-center justify-center">
          {/* Outer pulse ring */}
          <View
            className="absolute inset-0 rounded-full border-2 border-[rgba(155,254,3,0.3)]"
            style={{  }}
          />
          {/* Inner circle with sound waves */}
          <View className="relative w-10 h-10 rounded-full bg-[rgba(155,254,3,0.15)] flex items-center justify-center">
            <View className="flex items-center gap-[3px]">
              {[0, 150, 300].map((delay, i) => (
                <View
                  key={i}
                  className="w-[2.5px] rounded-full bg-[rgba(155,254,3,0.9)]"
                  style={{
                    
                    animationDelay: `${delay}ms`,
                    height: 8,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Middle: Text Content */}
        <View className="flex-1 flex flex-col gap-1">
          <Text className="text-[15px] leading-tight text-[rgba(155,254,3,0.9)] font-['Noto_Sans_SC',sans-serif]">
            正在生成声音
          </Text>
          <Text className="text-[13px] leading-tight text-[#9ca3af] font-['Noto_Sans_SC',sans-serif]">
            匹配角色声线中
          </Text>
          {/* Thin progress bar */}
          <View className="relative w-[120px] h-[2px] bg-[rgba(155,254,3,0.1)] rounded-full mt-2 overflow-hidden">
            <View
              className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-transparent via-[rgba(155,254,3,0.9)] to-transparent"
              style={{  }}
            />
          </View>
        </View>

        {/* Right: Loading dots */}
        <View className="shrink-0 flex gap-1">
          {[0, 200, 400].map((delay, i) => (
            <View
              key={i}
              className="w-[5px] h-[5px] rounded-full bg-[rgba(155,254,3,0.6)]"
              style={{
                
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </View>
      </View>

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
    </View>
  );
}
