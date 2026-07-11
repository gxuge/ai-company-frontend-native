import sys

file_path = 'src/app/pages/create-character/index.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update InputCard signature to include onDeleteRefImage
content = content.replace(
"""function InputCard({
  value,
  onChange,
  onPickRefImage,
  referenceImageUrl,
  onPreviewRefImage,
  onGenerate,
  generating = false,
  backgroundImage,
}) {""",
"""// eslint-disable-next-line max-lines-per-function
function InputCard({
  value,
  onChange,
  onPickRefImage,
  referenceImageUrl,
  onPreviewRefImage,
  onDeleteRefImage,
  onGenerate,
  generating = false,
  backgroundImage,
}) {"""
)

# 2. Fix the reference image button (delete icon + hollow styling for generate button)
old_ref_btn = """            <button
              onClick={referenceImageUrl ? onPreviewRefImage : onPickRefImage}
              className="flex w-30 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.45)] bg-[rgba(22,22,30,0.6)] px-5 py-3 backdrop-blur-sm transition-transform active:scale-95 overflow-hidden"
              title={referenceImageUrl ? '点击预览参考图' : '选择参考图'}
            >
              {referenceImageUrl
                ? (
                    <img
                      src={referenceImageUrl}
                      alt="参考图"
                      style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )"""

new_ref_btn = """            <button
              onClick={onPickRefImage}
              className="flex w-30 items-center justify-center gap-2 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.45)] bg-[rgba(22,22,30,0.6)] px-5 py-3 backdrop-blur-sm transition-transform active:scale-95"
              title={referenceImageUrl ? '更换参考图' : '选择参考图'}
            >
              {referenceImageUrl
                ? (
                    <div className="relative">
                      <img
                        src={referenceImageUrl}
                        alt="参考图"
                        style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 4 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewRefImage();
                        }}
                      />
                      <div
                        className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRefImage();
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                    </div>
                  )"""
content = content.replace(old_ref_btn, new_ref_btn)


# 3. Generate button replacement (Hollow Green styling)
old_gen_btn = """            <button
              onClick={onGenerate}
              disabled={generating}
              className="border-[rgba(var(--color-brand-green-rgb), 0.9)] shadow-[0px_0px_15px_0px_rgba(var(--color-brand-green-rgb), 0.2)] flex w-30 items-center justify-center gap-2 rounded-xl border bg-[rgba(22,22,30,0.6)] px-5 py-3 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 38 40">
                <path d={svgPaths.p6e49400} fill="rgba(var(--color-brand-green-rgb), 0.9)" fillOpacity="0.9" />
              </svg>
              <span className="text-[rgba(var(--color-brand-green-rgb), 0.9)] font-['Inter',sans-serif] text-sm font-bold whitespace-nowrap">
                {generating ? '生成中...' : 'AI 生成'}
              </span>
            </button>"""

# Wait, if `npm run lint` or something reformatted it in git master, let's just match a broader substring for the generate button.
# Let's use re to replace the button block.
import re

gen_btn_pattern = r'            <button\s+onClick=\{onGenerate\}\s+disabled=\{generating\}[\s\S]*?AI 生成\'\}\s+</span>\s+</button>'

new_gen_btn_full = """            <button
              onClick={onGenerate}
              disabled={generating}
              className="flex w-30 items-center justify-center gap-2 rounded-xl border border-brand-green bg-transparent px-5 py-3 transition-transform active:scale-95 active:bg-brand-green/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 38 40">
                <path d={svgPaths.p6e49400} fill="currentColor" className="text-brand-green" />
              </svg>
              <span className="font-['Inter',sans-serif] text-sm font-bold whitespace-nowrap text-brand-green">
                {generating ? '润色中...' : 'AI 润色'}
              </span>
            </button>"""

content = re.sub(gen_btn_pattern, new_gen_btn_full, content)


# 4. State updates in Container
old_state = """  const [previewSrc, setPreviewSrc] = useState('');
  const fileInputRef = useRef(null);"""

new_state = """  const [previewSrc, setPreviewSrc] = useState('');
  const [emptyAlertVisible, setEmptyAlertVisible] = useState(false);
  const [confirmOptimizeVisible, setConfirmOptimizeVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const fileInputRef = useRef(null);"""

content = content.replace(old_state, new_state)


# 5. handleGenerate check replacement
old_handle_gen = """  const handleGenerate = async () => {
    const promptTextTrimmed = promptText.trim();
    if (!promptTextTrimmed && !referenceImageUrl) {
      showMessage('请输入形象描述或选择参考图');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await tsRoleApi.generateTextByTemplate({"""

new_handle_gen = """  const handleGenerate = () => {
    const promptTextTrimmed = promptText.trim();
    if (!promptTextTrimmed) {
      setEmptyAlertVisible(true);
      return;
    }
    setConfirmOptimizeVisible(true);
  };

  const executeGenerate = async () => {
    const promptTextTrimmed = promptText.trim();
    setIsGenerating(true);
    try {
      const generated = await tsRoleApi.generateTextByTemplate({"""

content = content.replace(old_handle_gen, new_handle_gen)


# 6. Pass onDeleteRefImage to InputCard inside Container
old_input_use = """      <InputCard
        value={promptText}
        onChange={setPromptText}
        onPickRefImage={handlePickRefImage}
        referenceImageUrl={referenceImageUrl}
        onPreviewRefImage={() => setPreviewSrc(referenceImageUrl)}
        onGenerate={handleGenerate}
        generating={isGenerating}
        backgroundImage={generatedImageUrl}
      />"""

new_input_use = """      <InputCard
        value={promptText}
        onChange={setPromptText}
        onPickRefImage={handlePickRefImage}
        referenceImageUrl={referenceImageUrl}
        onPreviewRefImage={() => setPreviewSrc(referenceImageUrl)}
        onDeleteRefImage={() => setDeleteConfirmVisible(true)}
        onGenerate={handleGenerate}
        generating={isGenerating}
        backgroundImage={generatedImageUrl}
      />"""

content = content.replace(old_input_use, new_input_use)


# 7. Hollow bottom "创建形象" button
create_btn_pattern = r'      <div className="px-4 pb-8">\s+<AiLoginBtn\s+label="创建形象"\s+onPress=\{handleCreate\}[\s\S]*?/>\s+</div>'
new_create_btn = """      <div className="px-4 pb-8">
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className={`flex h-14 w-full items-center justify-center rounded-2xl border-2 border-solid border-brand-green bg-transparent font-['Noto_Sans_SC',sans-serif] text-base font-bold tracking-widest text-brand-green transition-colors active:bg-brand-green/10 ${
            isCreating ? 'cursor-not-allowed opacity-60' : ''
          }`}
        >
          {isCreating ? '创建中...' : '创建形象'}
        </button>
      </div>"""

content = re.sub(create_btn_pattern, new_create_btn, content)


# 8. Modals at the end of file
old_modals = """      {/* 图片预览弹层 */}
      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc('')} />
    </div>
  );
}"""

new_modals = """      {/* 图片预览弹层 */}
      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc('')} />

      {/* 空内容提示弹窗 */}
      {emptyAlertVisible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setEmptyAlertVisible(false)}
        >
          <div
            className="relative flex w-full max-w-[320px] flex-col gap-[20px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">提示</h3>
            <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
              请先填写内容，以便 AI 更好地为您润色提示词。
            </p>
            <button
              onClick={() => setEmptyAlertVisible(false)}
              className="mt-4 w-full rounded-full border border-brand-green bg-transparent py-3 text-center text-base font-bold text-brand-green active:bg-white/5"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* 确认润色弹窗 */}
      {confirmOptimizeVisible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setConfirmOptimizeVisible(false)}
        >
          <div
            className="relative flex w-full max-w-[320px] flex-col gap-[20px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 润色</h3>
            <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
              AI 将根据您当前的内容优化并扩写提示词，是否继续？
            </p>
            <div className="mt-4 flex flex-row gap-3">
              <button
                className="flex-1 rounded-full border border-[#494949] bg-transparent py-3 text-center text-base font-bold text-[#9ca3af] active:bg-white/5"
                onClick={() => setConfirmOptimizeVisible(false)}
              >
                取消
              </button>
              <button
                className="flex-1 rounded-full border-2 border-solid border-brand-green bg-transparent py-3 text-center text-base font-bold text-brand-green active:bg-brand-green/10"
                onClick={() => {
                  setConfirmOptimizeVisible(false);
                  executeGenerate();
                }}
              >
                继续
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 确认删除参考图弹窗 */}
      {deleteConfirmVisible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setDeleteConfirmVisible(false)}
        >
          <div
            className="relative flex w-full max-w-[320px] flex-col gap-[20px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">删除参考图</h3>
            <p className="text-center text-[14px] leading-relaxed text-[#a1a1aa]">
              确定要删除当前的参考图吗？
            </p>
            <div className="mt-4 flex flex-row gap-3">
              <button
                className="flex-1 rounded-full border border-[#494949] bg-transparent py-3 text-center text-base font-bold text-[#9ca3af] active:bg-white/5"
                onClick={() => setDeleteConfirmVisible(false)}
              >
                取消
              </button>
              <button
                className="flex-1 rounded-full border-2 border-solid border-[#ff4d4f] bg-transparent py-3 text-center text-base font-bold text-[#ff4d4f] active:bg-[#ff4d4f]/10"
                onClick={() => {
                  setDeleteConfirmVisible(false);
                  setReferenceImageUrl('');
                }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""

content = content.replace(old_modals, new_modals)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File successfully updated with robust regex and replacements.")
