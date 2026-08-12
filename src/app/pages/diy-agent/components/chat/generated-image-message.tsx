import actionEdit from '@/assets/images/diy-agent/chat/action-edit.png';
import actionRegenerate from '@/assets/images/diy-agent/chat/action-regenerate.png';
import actionSave from '@/assets/images/diy-agent/chat/action-save.png';
import assistantAvatar from '@/assets/images/diy-agent/chat/assistant-avatar-primary.png';
import generatedCharacter from '@/assets/images/diy-agent/chat/generated-character.png';
import resultSparkle from '@/assets/images/diy-agent/chat/result-sparkle.png';

type GeneratedImageMessageProps = {
  imageUrl?: string;
  onEdit?: () => void;
  onRegenerate?: () => void;
  onSave?: () => void;
};

const actions = [
  { icon: actionRegenerate, key: 'regenerate', label: '重生成' },
  { icon: actionEdit, key: 'edit', label: '编辑' },
  { icon: actionSave, key: 'save', label: '保存' },
] as const;

export function GeneratedImageMessage({
  imageUrl = generatedCharacter,
  onEdit,
  onRegenerate,
  onSave,
}: GeneratedImageMessageProps) {
  const handlers = {
    edit: onEdit,
    regenerate: onRegenerate,
    save: onSave,
  };

  return (
    <div className="flex w-full items-start gap-[6px] px-[6px]">
      <img src={assistantAvatar} alt="星启小宇" className="mt-[1px] size-[33px] shrink-0 object-contain" />
      <section className="w-[313px] rounded-tl-[7.5px] rounded-tr-[5px] rounded-br-[7.5px] rounded-bl-[9.5px] border border-[#121212] bg-[#0a0a0b] p-[7px]">
        <p className="m-0 flex items-center gap-[5px] text-[10px] leading-[14px] text-[#919190]">
          角色形象已生成，看看这个版本~
          <img src={resultSparkle} alt="" className="size-[10px] object-contain" />
        </p>
        <img
          src={imageUrl}
          alt="生成的角色形象"
          className="mt-[6px] h-[176.5px] w-full rounded-[7px] object-cover"
        />
        <div className="mt-[7px] grid grid-cols-3 gap-[5px]">
          {actions.map(action => (
            <button
              key={action.key}
              type="button"
              onClick={handlers[action.key]}
              className="flex h-[26px] items-center justify-center gap-[5px] rounded-[8px] border border-[#303031] bg-[#0d0d0d] text-[9.5px] text-[#949493] transition-colors hover:border-[#4a4a4b] hover:text-white active:bg-[#171717]"
            >
              <img src={action.icon} alt="" className="size-[11.5px] object-contain" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
