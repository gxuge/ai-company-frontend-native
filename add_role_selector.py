import os

path = 'src/app/pages/create-story/index.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update ChapterCard Props
if 'selectedRoles: any[];' not in content:
    content = content.replace(
        '  onChange: (next: ChapterForm) => void;\n}) {',
        '  onChange: (next: ChapterForm) => void;\n  selectedRoles: any[];\n  onOpenRoleSelector: () => void;\n}) {'
    )
    content = content.replace(
        '  index,\n  isGenerating,\n  onChange,\n}: {',
        '  index,\n  isGenerating,\n  onChange,\n  selectedRoles,\n  onOpenRoleSelector,\n}: {'
    )

# 2. Update ChapterCard role selector body
new_selector = """            {chapter.openingRoleId ? (
              <div className="flex items-center gap-[8px]">
                <span
                  className="text-[rgba(155,254,3,0.9)]"
                  style={{
                    fontFamily: '\\'Noto Sans SC\\', sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {selectedRoles.find(r => r.id === chapter.openingRoleId)?.name || '未知角色'}
                </span>
                <button
                  onClick={() => onChange({ ...chapter, openingRoleId: undefined })}
                  className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Line x1="18" y1="6" x2="6" y2="18" stroke="#ff4d4f" strokeWidth="2.5" strokeLinecap="round" />
                    <Line x1="6" y1="6" x2="18" y2="18" stroke="#ff4d4f" strokeWidth="2.5" strokeLinecap="round" />
                  </Svg>
                </button>
              </div>
            ) : (
              <button onClick={onOpenRoleSelector} className="flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0">
                <span
                  className="text-white underline decoration-[rgba(155,254,3,0.3)]"
                  style={{
                    fontFamily: '\\'Noto Sans SC\\', sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    textDecorationSkipInk: 'none',
                  }}
                >
                  选择角色
                </span>
                <ChevronRight color="white" />
              </button>
            )}"""

old_full = """              >
                开场白
              </span>
            </div>
            <button className="flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0">
              <span
                className="text-white underline decoration-[rgba(155,254,3,0.3)]"
                style={{
                  fontFamily: '\\'Noto Sans SC\\', sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  textDecorationSkipInk: 'none',
                }}
              >
                选择角色
              </span>
              <ChevronRight color="white" />
            </button>"""

new_full = """              >
                开场白
              </span>
            </div>
""" + new_selector

content = content.replace(old_full, new_full)

# 3. Update PlotOutlineSection Props
if 'onOpenRoleSelector: (index: number) => void;' not in content:
    content = content.replace(
        '  onHelpClick?: () => void;\n}: {',
        '  onHelpClick?: () => void;\n  selectedRoles: any[];\n  onOpenRoleSelector: (index: number) => void;\n}: {'
    )
    content = content.replace(
        '  optimizeLoading,\n  onHelpClick,\n}: {',
        '  optimizeLoading,\n  onHelpClick,\n  selectedRoles,\n  onOpenRoleSelector,\n}: {'
    )

# 4. Pass props from PlotOutlineSection to ChapterCard
if 'selectedRoles={selectedRoles}' not in content:
    content = content.replace(
        '          onChange={next => onChapterChange(index, next)}\n        />',
        '          onChange={next => onChapterChange(index, next)}\n          selectedRoles={selectedRoles}\n          onOpenRoleSelector={() => onOpenRoleSelector(index)}\n        />'
    )

# 5. Add selectingRoleChapterIndex state in App
if 'const [selectingRoleChapterIndex, setSelectingRoleChapterIndex] = useState' not in content:
    content = content.replace(
        '  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);',
        '  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);\n  const [selectingRoleChapterIndex, setSelectingRoleChapterIndex] = useState<number | null>(null);'
    )

# 6. Pass props to PlotOutlineSection in App
if 'selectedRoles={selectedRoles}\n                  onOpenRoleSelector={setSelectingRoleChapterIndex}' not in content:
    old_plot = "                  optimizeLoading={optimizingOutline}\\n                  onHelpClick={() => setTooltipType('outline')}\\n                />"
    new_plot = "                  optimizeLoading={optimizingOutline}\\n                  onHelpClick={() => setTooltipType('outline')}\\n                  selectedRoles={selectedRoles}\\n                  onOpenRoleSelector={setSelectingRoleChapterIndex}\\n                />"
    content = content.replace(old_plot, new_plot)

# 7. Add Modal to App
modal_code = """
      <Modal
        visible={selectingRoleChapterIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectingRoleChapterIndex(null)}
      >
        <div className="flex size-full flex-col justify-end bg-black/60">
          <div className="flex w-full flex-col overflow-hidden rounded-t-[24px] bg-[#1a1a1a] pb-8">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="text-[16px] font-bold text-white">选择角色</span>
              <button
                onClick={() => setSelectingRoleChapterIndex(null)}
                className="p-1 active:opacity-70"
              >
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                  <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </button>
            </div>
            <ScrollView className="max-h-[60vh] w-full px-4 py-2">
              {selectedRoles.length === 0 ? (
                <div className="flex w-full items-center justify-center py-8">
                  <span className="text-[14px] text-[#6b7280]">暂无可选角色，请先在“角色列表”中添加</span>
                </div>
              ) : (
                selectedRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => {
                      if (selectingRoleChapterIndex !== null) {
                        const newChapters = [...chapters];
                        newChapters[selectingRoleChapterIndex].openingRoleId = role.id;
                        setChapters(newChapters);
                      }
                      setSelectingRoleChapterIndex(null);
                    }}
                    className="mb-2 flex w-full items-center gap-4 rounded-[12px] bg-black p-3 active:opacity-80"
                  >
                    <div className="size-[48px] overflow-hidden rounded-full border border-white/10">
                      <img src={role.avatar || imgUserDefault} alt="" className="size-full object-cover" />
                    </div>
                    <span className="text-[15px] font-medium text-white">{role.name}</span>
                  </button>
                ))
              )}
            </ScrollView>
          </div>
        </div>
      </Modal>
"""

last_div_index = content.rfind('    </div>\\n  );\\n}')
if last_div_index != -1 and 'visible={selectingRoleChapterIndex !== null}' not in content:
    content = content[:last_div_index] + modal_code + content[last_div_index:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
