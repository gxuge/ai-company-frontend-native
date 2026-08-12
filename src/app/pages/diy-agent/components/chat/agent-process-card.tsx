import { useState } from 'react';

import chevronImageDone from '@/assets/images/diy-agent/chat/chevron-image-done.png';
import chevronImageRunning from '@/assets/images/diy-agent/chat/chevron-image-running.png';
import chevronThinkingDone from '@/assets/images/diy-agent/chat/chevron-thinking-done.png';
import chevronThinkingRunning from '@/assets/images/diy-agent/chat/chevron-thinking-running.png';
import imageGeneratingPreview from '@/assets/images/diy-agent/chat/image-generating-preview.png';
import statusImageDone from '@/assets/images/diy-agent/chat/status-image-done.png';
import statusImageRunning from '@/assets/images/diy-agent/chat/status-image-running.png';
import statusThinkingDone from '@/assets/images/diy-agent/chat/status-thinking-done.png';
import statusThinkingRunning from '@/assets/images/diy-agent/chat/status-thinking-running.png';
import thinkingTimeline from '@/assets/images/diy-agent/chat/thinking-timeline.png';

export type AgentProcessStatus = 'running' | 'done';

type ProcessHeaderProps = {
  chevron: string;
  icon: string;
  label: string;
  onToggle: () => void;
};

function ProcessHeader({ chevron, icon, label, onToggle }: ProcessHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-[28px] w-full items-center px-[8px] text-left"
    >
      <img src={icon} alt="" className="size-[14px] object-contain" />
      <span className="ml-[6px] text-[10px] leading-[13px] text-[#989998]">{label}</span>
      <img src={chevron} alt="" className="ml-auto h-[5px] w-[8.5px] object-contain" />
    </button>
  );
}

type ThinkingProcessCardProps = {
  status?: AgentProcessStatus;
  steps?: string[];
};

export function ThinkingProcessCard({
  status = 'done',
  steps = ['正在分析关键词：星空、探险、可爱、角色形象', '准备组织画面元素与风格描述'],
}: ThinkingProcessCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="ml-[31px] w-[315px] overflow-hidden rounded-[10.5px] border border-[#2b2b2c] bg-[#0b0b0b]">
      <ProcessHeader
        icon={statusThinkingRunning}
        chevron={chevronThinkingRunning}
        label="正在思考"
        onToggle={() => setExpanded(value => !value)}
      />
      {expanded && (
        <div className="relative mx-[21px] mb-[4px] min-h-[49px] rounded-[4.5px] border border-[#252525] bg-[#09090a] py-[7px] pr-[7px] pl-[20px]">
          <img
            src={thinkingTimeline}
            alt=""
            className="absolute top-[5px] bottom-[5px] left-[6px] h-[43.5px] w-px object-fill"
          />
          {steps.map(step => (
            <p
              key={step}
              className="relative m-0 pl-[8px] text-[8.5px] leading-[17.5px] text-[#676666] before:absolute before:top-[7px] before:left-0 before:size-[3.5px] before:rounded-full before:bg-[#777]"
            >
              {step}
            </p>
          ))}
        </div>
      )}
      {status === 'done' && (
        <div className="border-t border-[#151515]">
          <ProcessHeader
            icon={statusThinkingDone}
            chevron={chevronThinkingDone}
            label="思考完成"
            onToggle={() => setExpanded(value => !value)}
          />
        </div>
      )}
    </section>
  );
}

type ImageGenerationCardProps = {
  status?: AgentProcessStatus;
};

export function ImageGenerationCard({ status = 'done' }: ImageGenerationCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="ml-[31px] w-[315px] overflow-hidden rounded-[10px] border border-[#141414] bg-[#0a0a0a]">
      <ProcessHeader
        icon={statusImageRunning}
        chevron={chevronImageRunning}
        label="正在生成图片"
        onToggle={() => setExpanded(value => !value)}
      />
      {expanded && (
        <div className="mx-[6px] mb-[5px] overflow-hidden rounded-[6px] border border-[#252525] bg-[#09090a]">
          <img
            src={imageGeneratingPreview}
            alt="图片生成中"
            className="h-[97px] w-full object-cover"
          />
          <p className="m-0 py-[4px] text-center text-[8.5px] leading-[13px] text-[#616161]">
            图片生成中...
          </p>
        </div>
      )}
      {status === 'done' && (
        <div className="border-t border-[#151515]">
          <ProcessHeader
            icon={statusImageDone}
            chevron={chevronImageDone}
            label="生成图片完成"
            onToggle={() => setExpanded(value => !value)}
          />
        </div>
      )}
    </section>
  );
}
