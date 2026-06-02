import re

file_path = 'src/components/pages/create-role/create-character.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update TONE_OPTIONS
old_tone = "const TONE_OPTIONS = ['默认', '温柔体贴', '幽默傲娇', '高冷傲慢', '热情开朗', '毒舌腹黑', '稳重知性'];"
new_tone = "const TONE_OPTIONS = ['默认', '轻声细语', '惜字如金', '喋喋不休', '慵懒随意', '咬文嚼字', '干练果断', '粗犷豪放'];"
if old_tone in content:
    content = content.replace(old_tone, new_tone)

# 2. Remove Smart Recommend button from TagsSection
old_tags_section = """      <div className="flex items-center justify-between px-1">
        <h2 className={`text-base text-white ${fontBase} font-bold tracking-wide`}>角色标签</h2>
        <button
          onClick={onSmartRecommend}
          className="flex items-center gap-1.5 rounded-full border border-[rgba(155,254,3,0.2)] px-3 py-1.5 shadow-[0px_0px_6px_0px_rgba(155,254,3,0.2),0px_0px_12px_0px_rgba(155,254,3,0.1)]"
        >
          <img src={imgSparkle} alt="" className="size-[14px] shrink-0 object-contain" />
          <span className={`text-sm text-[rgba(155,254,3,0.9)] ${fontBase} font-medium`}>
            智能推荐
          </span>
        </button>
      </div>"""
new_tags_section = """      <div className="flex items-center justify-between px-1">
        <h2 className={`text-base text-white ${fontBase} font-bold tracking-wide`}>角色标签</h2>
      </div>"""
content = content.replace(old_tags_section, new_tags_section)

# 3. Remove onSmartRecommend from TagsSection props
content = content.replace(
    "  onToggleTag,\n  onSmartRecommend,\n  onAddCustomTag,\n}: {",
    "  onToggleTag,\n  onAddCustomTag,\n}: {"
)
content = content.replace(
    "  onToggleTag: (tag: string) => void;\n  onSmartRecommend: () => void;\n  onAddCustomTag: (tag: string) => void;\n}) {",
    "  onToggleTag: (tag: string) => void;\n  onAddCustomTag: (tag: string) => void;\n}) {"
)

# 4. Remove onSmartRecommend usage in CreateCharacter
old_tags_usage = """          <TagsSection
            tagOptions={tagOptions}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onSmartRecommend={handleRecommendTags}
            onAddCustomTag={handleAddCustomTag}
          />"""
new_tags_usage = """          <TagsSection
            tagOptions={tagOptions}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onAddCustomTag={handleAddCustomTag}
          />"""
content = content.replace(old_tags_usage, new_tags_usage)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated create-character.tsx')


# Update basic-info.tsx to hide role voice generation
file_path_2 = 'src/components/pages/create-role/basic-info.tsx'
with open(file_path_2, 'r', encoding='utf-8') as f:
    content_2 = f.read()

# Let's find the specific block for Role Voice generation header and hide the generate button
voice_header_old = """            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <h2 className="text-sm tracking-wide text-white">角色声音</h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTooltipType('voice');
                  }}
                  className="flex items-center justify-center p-1 active:opacity-70"
                >
                  <HelpCircle size={14} color="#9ca3af" />
                </button>
              </div>
              <AiGenerateBtn
                loading={generatingVoice}
                onClick={handleGenerateVoiceClick}
              />
            </div>"""

voice_header_new = """            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <h2 className="text-sm tracking-wide text-white">角色声音</h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTooltipType('voice');
                  }}
                  className="flex items-center justify-center p-1 active:opacity-70"
                >
                  <HelpCircle size={14} color="#9ca3af" />
                </button>
              </div>
              {/* <AiGenerateBtn
                loading={generatingVoice}
                onClick={handleGenerateVoiceClick}
              /> */}
            </div>"""
content_2 = content_2.replace(voice_header_old, voice_header_new)

with open(file_path_2, 'w', encoding='utf-8') as f:
    f.write(content_2)
print('Updated basic-info.tsx')

