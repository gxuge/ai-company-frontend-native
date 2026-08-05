import type { FC } from 'react';
import type { AgentChatStep, AgentChatStepStatus, AgentChatStreamState } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { isAgentChatConfirmationToolStep } from '@/lib/api';
import { resolveApiErrorMessage } from '@/lib/i18n';
import AdminChatImageToolCard from './admin-chat-image-tool-card';
import AdminChatMarkdownContent from './admin-chat-markdown-content';

export type AdminChatThinkingPanelProps = {
  state: AgentChatStreamState;
  fallbackContent?: string;
};

const statusAccent: Record<AgentChatStepStatus, string> = {
  idle: '#8b8b8b',
  running: '#f59e0b',
  done: '#22c55e',
  error: '#ef4444',
  interrupted: '#a3a3a3',
};

function StepBadge({ text, color }: { text: string; color: string }) {
  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: `${color}20`,
        borderWidth: 1,
        borderColor: `${color}50`,
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{text}</Text>
    </View>
  );
}

function ToolStepCard({ step }: { step: AgentChatStep }) {
  const { t } = useTranslation();
  const accent = statusAccent[step.status];
  const title = step.toolName || step.name || t('adminChat.thinking.toolCall');
  const statusLabel: Record<AgentChatStepStatus, string> = {
    idle: t('adminChat.thinking.statusIdle'),
    running: t('adminChat.thinking.statusRunning'),
    done: t('adminChat.thinking.statusDone'),
    error: t('adminChat.thinking.statusError'),
    interrupted: t('adminChat.thinking.statusInterrupted'),
  };
  const statusText = step.asynchronous && step.status === 'running'
    ? t('adminChat.thinking.executing')
    : statusLabel[step.status];

  return (
    <View
      style={{
        marginTop: 10,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: `${accent}33`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 14,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: accent,
            }}
          />
          <Text
            style={{
              color: '#ffffff',
              fontSize: 15,
              fontWeight: '700',
              flexShrink: 1,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {step.asynchronous ? <StepBadge text={t('adminChat.thinking.async')} color="#38bdf8" /> : null}
        </View>
        <StepBadge text={statusText} color={accent} />
      </View>

      {step.status !== 'error' && step.text
        ? (
            <Text
              selectable
              style={{
                marginTop: 12,
                color: 'rgba(255,255,255,0.88)',
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              {step.text}
            </Text>
          )
        : null}
    </View>
  );
}

function ToolStepRenderer({ step }: { step: AgentChatStep }) {
  if (step.contentType?.toLowerCase() === 'image') {
    return <AdminChatImageToolCard step={step} />;
  }
  return <ToolStepCard step={step} />;
}

const AdminChatThinkingPanel: FC<AdminChatThinkingPanelProps> = ({ state, fallbackContent }) => {
  const localizedError = state.error
    ? resolveApiErrorMessage({
        message: state.error,
        errorCode: state.errorCode || undefined,
        errorCategory: state.errorCategory || undefined,
        retryable: state.retryable ?? undefined,
        errorArgs: state.errorArgs || undefined,
      })
    : null;
  const timelineSteps = state.steps.filter(
    step => step.kind === 'llm'
      || (step.kind === 'tool' && !isAgentChatConfirmationToolStep(step, state)),
  );
  const hasToolStep = timelineSteps.some(step => step.kind === 'tool');
  const hasLlmText = timelineSteps.some(step => step.kind === 'llm' && Boolean(step.text.trim()));
  const isToolError = Boolean(
    state.error
    && timelineSteps.some(step => step.kind === 'tool' && step.error === state.error),
  );

  if (!hasToolStep && !state.error) {
    return null;
  }

  return (
    <View>
      {timelineSteps.map((step) => {
        if (step.kind === 'tool') {
          return <ToolStepRenderer key={step.id} step={step} />;
        }
        if (!step.text.trim()) {
          return null;
        }
        return (
          <View key={step.id} style={{ marginTop: 10 }}>
            <AdminChatMarkdownContent content={step.text} />
          </View>
        );
      })}

      {!hasLlmText && fallbackContent?.trim()
        ? (
            <View style={{ marginTop: 10 }}>
              <AdminChatMarkdownContent content={fallbackContent} />
            </View>
          )
        : null}

      {state.error && !isToolError
        ? (
            <View
              style={{
                marginTop: 10,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'rgba(239,68,68,0.4)',
                backgroundColor: 'rgba(239,68,68,0.12)',
                padding: 14,
              }}
            >
              <Text style={{ color: '#fecaca', fontSize: 13, lineHeight: 20 }}>
                {localizedError}
              </Text>
            </View>
          )
        : null}
    </View>
  );
};

export default AdminChatThinkingPanel;
