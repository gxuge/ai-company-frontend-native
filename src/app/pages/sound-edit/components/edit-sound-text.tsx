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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 font-['Noto_Sans_SC',sans-serif] backdrop-blur-sm px-[6px]">
      {/* 弹窗主体：根据 750px 设计稿按比例缩放 0.52 (基于 max-w 390px) */}
      <div className="flex w-full max-w-[378px] flex-col gap-[13px] rounded-[21px] border border-[rgba(255,255,255,0.1)] bg-[#161616] px-[17px] py-[14px] shadow-[0_0_20px_rgba(0,0,0,0.6)]">
        
        {/* 标题行 */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] leading-[28px] font-bold text-white tracking-[-0.4px]">编辑试听文本</h2>
          <AiGenerateBtn />
        </div>

        {/* 文本输入区 */}
        <div className="flex flex-col gap-[3px] rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[#222] px-[11px] pt-[11px] pb-[6px]">
          <textarea
            className="h-[88px] w-full resize-none bg-transparent text-[14px] leading-[22.75px] text-white placeholder-gray-500 outline-none"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= maxLen) {
                setText(e.target.value);
              }
            }}
            maxLength={maxLen}
          />
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(155,254,3,0.3)] to-transparent" />
          <div className="w-full text-right text-[12px] leading-[16px] font-medium text-[#6b7280]">
            {text.length}/{maxLen}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex h-[39px] gap-[13px]">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-transparent text-[14px] font-medium text-[#d1d5db]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm(text)}
            className="flex-1 rounded-[10px] bg-[rgba(155,254,3,0.9)] text-[14px] font-bold text-[#3b3f34]"
          >
            确认
          </button>
        </div>

      </div>
    </div>
  );
}
