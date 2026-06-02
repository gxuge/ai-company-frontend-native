import re

file_path = 'src/app/pages/create-story/index.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add the new state variable
content = content.replace(
    "const [generateModalTarget, setGenerateModalTarget] = useState<'setting' | 'scene' | 'outline' | null>(null);",
    "const [generateModalTarget, setGenerateModalTarget] = useState<'setting' | 'scene' | 'outline' | null>(null);\n  const [confirmAllVisible, setConfirmAllVisible] = useState(false);"
)

# Update the '全生成' button logic in the first modal
old_button_logic = """              <button
                type="button"
                className="flex-1 rounded-full bg-[rgba(155,254,3,0.9)] py-3 text-center text-base font-bold text-black active:opacity-80"
                onClick={() => {
                  handleGenerateAll();
                }}
              >
                全生成
              </button>"""

new_button_logic = """              <button
                type="button"
                className="flex-1 rounded-full bg-[rgba(155,254,3,0.9)] py-3 text-center text-base font-bold text-black active:opacity-80"
                onClick={() => {
                  setGenerateModalTarget(null);
                  setConfirmAllVisible(true);
                }}
              >
                全生成
              </button>"""

content = content.replace(old_button_logic, new_button_logic)

# Add the confirmation modal JSX right after the first modal
first_modal_end = "      </Modal>"

second_modal_jsx = """
      <Modal
        visible={confirmAllVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmAllVisible(false)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setConfirmAllVisible(false)}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">⚠️ 覆盖警告</h3>
            <p className="text-[14px] leading-relaxed text-[#a1a1aa]">
              选择全生成将由 AI 重新生成并<span className="text-[#ff4d4f] font-medium">覆盖</span>当前除“角色”以外的所有已有内容（包括故事设定、场景设定、剧情大纲）。
              <br /><br />
              是否继续？
            </p>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[#333] bg-transparent py-3 text-center text-base font-bold text-white active:bg-white/5"
                onClick={() => setConfirmAllVisible(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-[#ff4d4f] py-3 text-center text-base font-bold text-white active:opacity-80"
                onClick={() => {
                  setConfirmAllVisible(false);
                  handleGenerateAll();
                }}
              >
                确认覆盖并生成
              </button>
            </div>
            <button
              onClick={() => setConfirmAllVisible(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>
          </div>
        </div>
      </Modal>"""

# Replace the first occurrence from the bottom.
content = content.replace(first_modal_end, first_modal_end + second_modal_jsx, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully added confirmation modal.")
