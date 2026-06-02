import re

file_path = 'src/components/pages/create-role/create-character.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add SVG imports if missing
if "import Svg, { Line } from 'react-native-svg';" not in content:
    content = content.replace(
        "import { ScrollView, Modal, TextInput } from 'react-native';",
        "import { ScrollView, Modal, TextInput } from 'react-native';\nimport Svg, { Line } from 'react-native-svg';"
    )

# 2. Add generateModalVisible state to CreateCharacter component
# First, let's find the component signature
comp_start = "export function CreateCharacter() {"
state_addition = "  const [generateModalVisible, setGenerateModalVisible] = useState(false);\n"
content = content.replace(comp_start, comp_start + "\n" + state_addition)


# 3. Replace handleGenerateSetting logic and remove alert functions
# The functions selectSettingGenerateMode and confirmSettingOverwrite:
content = re.sub(r'async function selectSettingGenerateMode\(\): Promise<SettingGenerateMode \| null> \{.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'async function confirmSettingOverwrite\(\): Promise<boolean> \{.*?\}', '', content, flags=re.DOTALL)

old_handle_generate = """  const handleGenerateSetting = async () => {
    if (generatingSetting || saving) {
      return;
    }
    const generateMode = await selectSettingGenerateMode();
    if (!generateMode) {
      return;
    }
    const hasExistingSetting = Boolean(name.trim() || job.trim() || background.trim());
    if (hasExistingSetting) {
      const confirmed = await confirmSettingOverwrite();
      if (!confirmed) {
        return;
      }
    }
    setGeneratingSetting(true);
    try {
      const result = generateMode === 'full'
        ? await tsRoleApi.generateRoleSettingPreset({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            keywords: selectedTags.join(','),
          })
        : await tsRoleApi.generateRoleSetting({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            keywords: selectedTags.join(','),
          });
      const roleName = result?.roleName ?? result?.role_name;
      const generatedGender = result?.gender;
      const occupation = result?.occupation;
      const backgroundStory = result?.backgroundStory ?? result?.background_story;

      if (typeof roleName === 'string' && roleName.trim()) {
        setName(roleName);
      }
      if (generatedGender === 'male' || generatedGender === 'female' || generatedGender === 'unknown') {
        setGender(generatedGender);
      }
      if (typeof occupation === 'string' && occupation.trim()) {
        setJob(occupation);
      }
      if (typeof backgroundStory === 'string' && backgroundStory.trim()) {
        setBackground(backgroundStory);
      }
      setBasicAiGenerated(true);
      showMessage(generateMode === 'full' ? '角色设定已全量生成。' : '角色设定已生成补全。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '生成设定失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
    }
  };"""

new_handle_generate = """  const handleGenerateSetting = () => {
    if (generatingSetting || saving) return;
    const isEmpty = !name.trim() && !job.trim() && !background.trim() && gender === 'random';
    if (isEmpty) {
      executeGenerateSetting('full');
    } else {
      setGenerateModalVisible(true);
    }
  };

  const executeGenerateSetting = async (generateMode: 'single' | 'full') => {
    setGeneratingSetting(true);
    try {
      const result = generateMode === 'full'
        ? await tsRoleApi.generateRoleSettingPreset({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            keywords: selectedTags.join(','),
          })
        : await tsRoleApi.generateRoleSetting({
            roleId: roleId || undefined,
            roleName: name.trim() || undefined,
            gender,
            occupation: job.trim() || undefined,
            backgroundStory: background.trim() || undefined,
            keywords: selectedTags.join(','),
          });
      const roleName = result?.roleName ?? result?.role_name;
      const generatedGender = result?.gender;
      const occupation = result?.occupation;
      const backgroundStory = result?.backgroundStory ?? result?.background_story;

      if (typeof roleName === 'string' && roleName.trim()) {
        setName(roleName);
      }
      if (generatedGender === 'male' || generatedGender === 'female' || generatedGender === 'unknown') {
        setGender(generatedGender);
      }
      if (typeof occupation === 'string' && occupation.trim()) {
        setJob(occupation);
      }
      if (typeof backgroundStory === 'string' && backgroundStory.trim()) {
        setBackground(backgroundStory);
      }
      setBasicAiGenerated(true);
      showMessage(generateMode === 'full' ? '角色设定已全量生成。' : '角色设定已生成补全。');
    }
    catch (error) {
      showMessage(extractErrorMessage(error, '生成设定失败，请稍后重试。'));
    }
    finally {
      setGeneratingSetting(false);
    }
  };"""

if old_handle_generate in content:
    content = content.replace(old_handle_generate, new_handle_generate)
else:
    # Use regex if exact string is slightly different
    content = re.sub(
        r'const handleGenerateSetting = async \(\) => \{.*?finally \{\s*setGeneratingSetting\(false\);\s*\}\s*\};',
        new_handle_generate,
        content,
        flags=re.DOTALL
    )


# 4. Inject Modal JSX
# Find the place to inject it. We can put it right before the final `</div>` of CreateCharacter.
# Let's search for `<SaveButton` and put it right before.
modal_jsx = """
      <Modal
        visible={generateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGenerateModalVisible(false)}
      >
        <div 
          className="flex h-full w-full items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setGenerateModalVisible(false)}
        >
          <div 
            className="relative w-full max-w-[320px] rounded-[24px] border border-[#333] bg-[#111] p-6 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-bold tracking-wide text-white">AI 一键生成</h3>
            <div className="text-[14px] leading-relaxed text-[#a1a1aa] flex flex-col gap-2">
              <p>检测到您已填写了部分设定。您希望 AI 如何为您生成？</p>
              <div className="flex items-start gap-1">
                <span className="text-[rgba(155,254,3,0.9)] mt-1">•</span>
                <p><span className="text-white font-medium">接着生成：</span>基于您当前的灵感，继续润色和扩写。</p>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-[#ff4d4f] mt-1">•</span>
                <p><span className="text-white font-medium">全量覆盖：</span>清空所有输入，重新随机生成完整角色。</p>
              </div>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <button
                type="button"
                className="flex-1 rounded-full border border-[rgba(155,254,3,0.9)] bg-transparent py-3 text-center text-base font-bold text-[rgba(155,254,3,0.9)] active:bg-white/5"
                onClick={() => {
                  setGenerateModalVisible(false);
                  executeGenerateSetting('single');
                }}
              >
                接着生成
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-[#ff4d4f] py-3 text-center text-base font-bold text-white active:opacity-80"
                onClick={() => {
                  setGenerateModalVisible(false);
                  executeGenerateSetting('full');
                }}
              >
                全量覆盖
              </button>
            </div>
            <button
              onClick={() => setGenerateModalVisible(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Line x1="18" y1="6" x2="6" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
                <Line x1="6" y1="6" x2="18" y2="18" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              </Svg>
            </button>
          </div>
        </div>
      </Modal>

      <SaveButton"""

content = content.replace("<SaveButton", modal_jsx)

# Clean up any residual SettingGenerateMode type errors if we deleted the type?
# SettingGenerateMode was defined as `type SettingGenerateMode = 'single' | 'full';`
# I'll just leave it if it exists.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated create-character.tsx with unified modal logic')
