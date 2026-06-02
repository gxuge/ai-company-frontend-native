import re

file_path = 'src/app/pages/create-story/index.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The original block to replace
original_block = """            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 一键生成</h3>
            <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
              您可以选择只生成当前模块的内容，或让 AI 为您一次性完善所有设定和剧情。
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="button"
                className="w-full rounded-full bg-[rgba(155,254,3,0.9)] py-3 text-center text-base font-bold text-black active:opacity-80"
                onClick={() => {
                  if (generateModalTarget === 'setting') handleGenerateSetting();
                  if (generateModalTarget === 'scene') handleGenerateScene();
                  if (generateModalTarget === 'outline') handleGenerateOutline();
                  setGenerateModalTarget(null);
                }}
              >
                只生成当前项
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-[rgba(155,254,3,0.9)] bg-transparent py-3 text-center text-base font-bold text-[rgba(155,254,3,0.9)] active:bg-white/5"
                onClick={() => {
                  handleGenerateAll();
                }}
              >
                完善所有内容
              </button>
            </div>"""

new_block = """            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 一键生成</h3>
            <div className="text-[14px] leading-relaxed text-[#a1a1aa] flex flex-col gap-2">
              <p>您希望 AI 如何为您扩写？</p>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(155,254,3,0.9)] mt-1">•</span>
                <p><span className="text-white font-medium">仅当前：</span>只针对您刚点击的模块进行扩写。</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(155,254,3,0.9)] mt-1">•</span>
                <p><span className="text-white font-medium">全生成：</span>依次为您自动补全故事、场景和大纲。</p>
              </div>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(155,254,3,0.9)] bg-transparent py-3 text-center text-base font-bold text-[rgba(155,254,3,0.9)] active:bg-white/5"
                onClick={() => {
                  if (generateModalTarget === 'setting') handleGenerateSetting();
                  if (generateModalTarget === 'scene') handleGenerateScene();
                  if (generateModalTarget === 'outline') handleGenerateOutline();
                  setGenerateModalTarget(null);
                }}
              >
                仅当前
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-[rgba(155,254,3,0.9)] py-3 text-center text-base font-bold text-black active:opacity-80"
                onClick={() => {
                  handleGenerateAll();
                }}
              >
                全生成
              </button>
            </div>"""

if original_block in content:
    content = content.replace(original_block, new_block)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Original block not found. Checking close matches...")
    # fallback with regex or similar if exact match fails
    
