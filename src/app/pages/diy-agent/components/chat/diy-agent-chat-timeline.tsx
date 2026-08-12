import { ImageGenerationCard, ThinkingProcessCard } from './agent-process-card';
import { AssistantChatBubble, UserChatBubble } from './chat-bubbles';
import { GeneratedImageMessage } from './generated-image-message';

type DiyAgentChatTimelineProps = {
  userMessage: string;
};

export function DiyAgentChatTimeline({ userMessage }: DiyAgentChatTimelineProps) {
  return (
    <section className="absolute top-[78px] left-0 flex w-[405px] flex-col gap-[4px] pb-[96px]">
      <UserChatBubble message={userMessage} />
      <AssistantChatBubble message="好的，我会先帮你梳理需求，再开始生成图片~" />
      <ThinkingProcessCard status="done" />
      <ImageGenerationCard status="done" />
      <GeneratedImageMessage />
    </section>
  );
}
