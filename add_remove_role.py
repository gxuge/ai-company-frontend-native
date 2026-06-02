import re

file_path = 'src/app/pages/create-story/index.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add onRemoveRole to CharacterListSection props
old_signature = """function CharacterListSection({
  roles = [],
  onAddRole,
  onHelpClick,
}: {
  roles?: any[];
  onAddRole: () => void;
  onHelpClick?: () => void;
}) {"""

new_signature = """function CharacterListSection({
  roles = [],
  onAddRole,
  onRemoveRole,
  onHelpClick,
}: {
  roles?: any[];
  onAddRole: () => void;
  onRemoveRole?: (role: any) => void;
  onHelpClick?: () => void;
}) {"""

content = content.replace(old_signature, new_signature)

# 2. Add the delete button to the role map
old_role_map = """          {roles.map((role, idx) => (
            <div key={`${role.id}-${idx}`} className="flex shrink-0 flex-col items-center">
              <div className="size-[61px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[#111] overflow-hidden">
                <img src={role.avatar || imgUserDefault} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="mt-[12px] text-white text-[12px] font-medium truncate w-[60px] text-center">{role.name}</span>
            </div>
          ))}"""

new_role_map = """          {roles.map((role, idx) => (
            <div key={`${role.id}-${idx}`} className="relative flex shrink-0 flex-col items-center">
              <div className="size-[61px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[#111] overflow-hidden">
                <img src={role.avatar || imgUserDefault} alt="" className="w-full h-full object-cover" />
              </div>
              {onRemoveRole && (
                <button
                  onClick={() => onRemoveRole(role)}
                  className="absolute -top-[2px] right-[4px] flex size-[18px] items-center justify-center rounded-full bg-[#333] border border-[#666] text-white active:bg-[#ff4d4f]"
                >
                  <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <Line x1="18" y1="6" x2="6" y2="18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    <Line x1="6" y1="6" x2="18" y2="18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </Svg>
                </button>
              )}
              <span className="mt-[12px] text-white text-[12px] font-medium truncate w-[60px] text-center">{role.name}</span>
            </div>
          ))}"""

content = content.replace(old_role_map, new_role_map)

# 3. Update the CharacterListSection usage
old_usage = """            <CharacterListSection
              roles={selectedRoles}
              onAddRole={() => router.push('/pages/select-role?from=create-story')}
              onHelpClick={() => setTooltipType('role')}
            />"""

new_usage = """            <CharacterListSection
              roles={selectedRoles}
              onAddRole={() => router.push('/pages/select-role?from=create-story')}
              onRemoveRole={(role) => setSelectedRoles(prev => prev.filter(r => r.id !== role.id))}
              onHelpClick={() => setTooltipType('role')}
            />"""

content = content.replace(old_usage, new_usage)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully added the remove role button.')
