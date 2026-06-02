import re

file_path = 'src/app/pages/create-story/index.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Restore previous fixes
content = content.replace('maxLength={1000}\n        onOptimize={() => showMessage(\'提示词优化功能开发中...\')}', 'maxLength={500}\n        onOptimize={() => showMessage(\'提示词优化功能开发中...\')}')
content = content.replace('maxLength={2000}\n          onOptimize={() => showMessage(\'提示词优化功能开发中...\')}', 'maxLength={1000}\n          onOptimize={() => showMessage(\'提示词优化功能开发中...\')}')
content = content.replace('maxLength={1000}\n          />\n        </div>\n\n        <div className="flex flex-col gap-[8px] pt-[8px]">', 'maxLength={200}\n          />\n        </div>\n\n        <div className="flex flex-col gap-[8px] pt-[8px]">')
content = content.replace('placeholder="输入故事整体想法和背景设定，可辅助生成剧情。"', 'placeholder="例：写下故事背景、世界规则、用户身份和主要目标。比如：午夜后的城市会出现异常街区，用户需要探索规则、收集线索，逐步揭开隐藏真相。"')
content = content.replace('placeholder="输入场景设定，生成人物所在场景"', 'placeholder="例：写下当前场景的时间、地点、氛围和可互动线索。比如：凌晨的旧车站空无一人，站牌显示不存在的班次，长椅上放着一张旧车票。"')

# Add generateModalTarget
content = content.replace(
    "const [tooltipType, setTooltipType] = useState<'none' | 'story' | 'role' | 'scene' | 'outline'>('none');",
    "const [tooltipType, setTooltipType] = useState<'none' | 'story' | 'role' | 'scene' | 'outline'>('none');\n  const [generateModalTarget, setGenerateModalTarget] = useState<'setting' | 'scene' | 'outline' | null>(null);"
)

# Replace onGenerate props
content = content.replace(
    "onGenerate={handleGenerateSetting}",
    "onGenerate={() => setGenerateModalTarget('setting')}"
)
content = content.replace(
    "onGenerate={handleGenerateScene}",
    "onGenerate={() => setGenerateModalTarget('scene')}"
)
content = content.replace(
    "onGenerate={handleGenerateOutline}",
    "onGenerate={() => setGenerateModalTarget('outline')}"
)

# Add handleGenerateAll after handleGenerateOutline
handle_generate_all = '''

  const handleGenerateAll = async () => {
    if (saving || generatingSetting || generatingScene || generatingOutline) return;
    setGenerateModalTarget(null);

    let currentSetting = storySettingText;
    let currentBackground = storyBackground;
    let currentTitle = storyTitle;
    let currentIntro = storyIntro;
    let currentScene = sceneSettingText;

    // 1. Setting
    setGeneratingSetting(true);
    try {
      const settingResult = await tsStoryApi.generateStorySetting({
        storyId: storyId || undefined,
        title: storyTitle || undefined,
        storyMode: activeTab,
        storyIntro: storyIntro || undefined,
        storySetting: storySettingText || undefined,
        storyBackground: storyBackground || undefined,
        ideaInput: buildIdeaInput(storySettingText, sceneSettingText, outlineText),
      });
      if (settingResult?.title) currentTitle = settingResult.title;
      if (settingResult?.storyIntro) currentIntro = settingResult.storyIntro;
      if (settingResult?.storySetting) currentSetting = settingResult.storySetting;
      if (settingResult?.storyBackground) currentBackground = settingResult.storyBackground;
      
      setStoryTitle(currentTitle);
      setStoryIntro(currentIntro);
      setStorySettingText(currentSetting);
      setStoryBackground(currentBackground);
      setIsAiStorySetting(settingResult?.generated !== false);
    } catch (e) {
      showMessage(resolveGenerateErrorMessage(e, '故事设定生成失败'));
      setGeneratingSetting(false);
      return;
    }
    setGeneratingSetting(false);

    // 2. Scene
    setGeneratingScene(true);
    try {
      const sceneResult = await tsStoryApi.generateStoryScene({
        title: currentTitle || undefined,
        storyMode: activeTab,
        storySetting: currentSetting || undefined,
        storyBackground: currentBackground || undefined,
        sceneSetting: currentScene || undefined,
      });
      const sceneText = (sceneResult?.sceneSummary || sceneResult?.sceneNameSnapshot || '').trim();
      if (sceneText) {
        currentScene = sceneText;
        setSceneSettingText(currentScene);
      }
    } catch (e) {
      showMessage(resolveGenerateErrorMessage(e, '场景设定生成失败'));
      setGeneratingScene(false);
      return;
    }
    setGeneratingScene(false);

    // 3. Outline (only if normal)
    if (activeTab === 'normal') {
      if (!currentSetting.trim() || selectedRoles.length === 0 || !currentScene.trim()) {
        showMessage('部分内容缺失（如未添加角色），未能生成剧情大纲。故事和场景已生成。');
        return;
      }
      setGeneratingOutline(true);
      try {
        const outlineResult = await tsStoryApi.generateStoryOutline({
          storyId: storyId || undefined,
          title: currentTitle || undefined,
          storyMode: activeTab,
          storySetting: currentSetting || undefined,
          sceneSetting: currentScene || undefined,
          storyBackground: currentBackground || undefined,
          chapterCount: 3,
          roleNames: selectedRoles.map(role => role?.name).filter(Boolean),
          extraRequirements: outlineText.trim() || undefined,
        });

        const generatedChapters = outlineResult?.chapters || [];
        if (generatedChapters.length > 0) {
          setOutlineText(buildOutlineTextFromChapters(generatedChapters));
          setIsAiOutline(true);
        }
      } catch (e) {
        showMessage(resolveGenerateErrorMessage(e, '剧情大纲生成失败'));
      }
      setGeneratingOutline(false);
    }

    showMessage('已为您生成所有可用的设定内容。');
  };
'''

# Find the end of handleGenerateOutline
outline_end_str = """    finally {
      setGeneratingOutline(false);
    }
  };"""

content = content.replace(outline_end_str, outline_end_str + handle_generate_all)

# Add Generate Modal
modal_jsx = """
      <Modal
        visible={generateModalTarget !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGenerateModalTarget(null)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setGenerateModalTarget(null)}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 一键生成</h3>
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
            </div>
            <button
              onClick={() => setGenerateModalTarget(null)}
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

content = content.replace("      <Modal\n        visible={tooltipType !== 'none'}", modal_jsx + "\n      <Modal\n        visible={tooltipType !== 'none'}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
