import os

def fix_basic_info():
    path = 'src/components/pages/create-role/basic-info.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Props
    if '  background: string;\n  greeting: string;' not in content:
        content = content.replace(
            '  background: string;\n  voiceName: string;',
            '  background: string;\n  greeting: string;\n  voiceName: string;'
        )
        content = content.replace(
            '  onBackgroundChange: (value: string) => void;\n  onGenerateSetting?: () => void;',
            '  onBackgroundChange: (value: string) => void;\n  onGreetingChange: (value: string) => void;\n  onGenerateSetting?: () => void;'
        )

    # 2. Update destructured args
    if '  background,\n  greeting,' not in content:
        content = content.replace(
            '  background,\n  voiceName,',
            '  background,\n  greeting,\n  voiceName,'
        )
        content = content.replace(
            '  onBackgroundChange,\n  onGenerateSetting,',
            '  onBackgroundChange,\n  onGreetingChange,\n  onGenerateSetting,'
        )

    # 3. Add UI below background
    greeting_ui = """
          <div className="space-y-4 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <FieldLabel text="开场白" required={false} />
            <AiFormTextarea
              placeholder="输入角色开场白，将作为对话的第一句话。"
              value={greeting}
              isGenerating={generatingSetting}
              className="min-h-[96px] w-full resize-none bg-transparent p-[16px] text-[13.5px] text-white placeholder-[#6b7280] outline-none"
              containerClassName="bg-black rounded-[6px] border-[1px] border-[#494949] overflow-hidden"
              onChange={e => onGreetingChange(e.target.value)}
              showCount={true}
              maxLength={300}
            />
          </div>
"""
    if 'FieldLabel text="开场白"' not in content:
        # Find the background UI
        background_end = """              }}
            />
          </div>"""
        
        content = content.replace(background_end, background_end + greeting_ui)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_create_character():
    path = 'src/components/pages/create-role/create-character.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. State
    if "const [greeting, setGreeting] = useState('');" not in content:
        content = content.replace(
            "const [background, setBackground] = useState('');\n  const [voiceName",
            "const [background, setBackground] = useState('');\n  const [greeting, setGreeting] = useState('');\n  const [voiceName"
        )
    
    # 2. Save payload
    if 'introText: greeting.trim() || undefined,' not in content:
        content = content.replace(
            "    backgroundStory: background.trim() || undefined,\n    avatarUrl:",
            "    backgroundStory: background.trim() || undefined,\n    introText: greeting.trim() || undefined,\n    avatarUrl:"
        )

    # 3. Usage
    if 'greeting={greeting}' not in content:
        content = content.replace(
            "                    background={background}\n                    voiceName={voiceName}",
            "                    background={background}\n                    greeting={greeting}\n                    voiceName={voiceName}"
        )
        content = content.replace(
            "                    onBackgroundChange={setBackground}\n                    onGenerateSetting={handleGenerateSetting}",
            "                    onBackgroundChange={setBackground}\n                    onGreetingChange={setGreeting}\n                    onGenerateSetting={handleGenerateSetting}"
        )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_basic_info()
fix_create_character()
print('Done!')
