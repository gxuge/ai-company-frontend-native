import assistantAvatar from '@/assets/images/diy-agent/chat/assistant-avatar.png';

type ChatBubbleProps = {
  message: string;
  time?: string;
};

export function UserChatBubble({ message, time = '09:41' }: ChatBubbleProps) {
  return (
    <div className="flex w-full justify-end pr-[11px]">
      <div className="max-w-[267px]">
        <div className="rounded-t-[11px] rounded-br-[2px] rounded-bl-[10px] border border-[#2b416f] bg-[#080809] px-[9px] py-[8px]">
          <p className="m-0 text-[10px] leading-[15px] text-[#9fa0a0]">{message}</p>
        </div>
        <time className="mt-[2px] block pr-[2px] text-right text-[8.5px] leading-[10px] text-[#636362]">
          {time}
        </time>
      </div>
    </div>
  );
}

export function AssistantChatBubble({ message, time = '09:41' }: ChatBubbleProps) {
  return (
    <div className="flex w-full items-start gap-[7px] px-[6px]">
      <img
        src={assistantAvatar}
        alt="星启小宇"
        className="mt-[-1px] size-[33px] shrink-0 object-contain"
      />
      <div className="max-w-[235px] rounded-[10px] border border-[#202020] bg-[#0a0a0a] px-[9px] py-[7px]">
        <p className="m-0 text-[10px] leading-[15px] text-[#999]">{message}</p>
        <time className="mt-[1px] block text-[8px] leading-[10px] text-[#605f5f]">{time}</time>
      </div>
    </div>
  );
}
