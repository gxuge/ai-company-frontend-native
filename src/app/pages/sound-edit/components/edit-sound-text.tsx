import { useState } from 'react';
import { AiGenerateBtn } from '@/components/ai-company/ai-generate-btn';

type EditSoundTextProps = {
  initialText: string;
  onCancel: () => void;
  onConfirm: (nextText: string) => void;
};

export default function EditSoundText(props: EditSoundTextProps) {
  const { initialText, onCancel, onConfirm } = props;
  const [text, setText] = useState(initialText);
  const maxLen = 500;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black/80 font-['Noto_Sans_SC',sans-serif] backdrop-blur-sm sm:items-center">
      <div className="flex w-full flex-col gap-5 rounded-t-[24px] border border-white/10 bg-[#161616] p-5 sm:max-w-[420px] sm:rounded-[24px] sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-white">编辑试听文本</h2>
          <AiGenerateBtn />
        </div>

        <div className="flex flex-col items-center gap-[2.5px] rounded-[10px] border border-white/10 bg-[#222] px-[11px] pt-[11px] pb-[6px]">
          <textarea
            className="min-h-[68px] w-full resize-none bg-transparent text-[14px] leading-[22.75px] text-white placeholder-gray-500 outline-none"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= maxLen) {
                setText(e.target.value);
              }
            }}
            maxLength={maxLen}
          />
          <div className="h-px w-full bg-linear-to-r from-transparent via-[rgba(155,254,3,0.3)] to-transparent" />
          <div className="w-full text-right text-[12px] text-[#6b7280]">
            {text.length}
            /
            {maxLen}
          </div>
        </div>

        <div className="flex h-[50px] gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-white/10 bg-transparent text-base text-gray-300"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm(text)}
            className="flex-1 rounded-2xl bg-[rgba(155,254,3,0.9)] text-base text-[#3b3f34]"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
