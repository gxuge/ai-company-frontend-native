import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { AgentChatStep, AgentChatStepStatus, AgentChatStreamState } from '@/lib/api';

export interface AdminChatThinkingPanelProps {
  state: AgentChatStreamState;
}

const statusLabel: Record<AgentChatStepStatus, string> = {
  idle: '待开始',
  running: '生成中',
  done: '已完成',
  error: '失败',
};

const statusAccent: Record<AgentChatStepStatus, string> = {
  idle: '#8b8b8b',
  running: '#f59e0b',
  done: '#22c55e',
  error: '#ef4444',
};

const kindLabel: Record<AgentChatStep['kind'], string> = {
  llm: 'LLM',
  tool: 'Tool',
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

function StepCard({ step }: { step: AgentChatStep }) {
  const accent = statusAccent[step.status];
  const showText = step.kind === 'tool' || step.status === 'running';

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
            {step.title}
          </Text>
        </View>
        <StepBadge text={statusLabel[step.status]} color={accent} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        <StepBadge text={kindLabel[step.kind]} color={accent} />
        {step.promptCode ? <StepBadge text={`Prompt ${step.promptCode}`} color="#60a5fa" /> : null}
        {step.toolName ? <StepBadge text={step.toolName} color="#c084fc" /> : null}
      </View>

      {step.status !== 'error' && showText && step.text ? (
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
      ) : null}

      {step.error ? (
        <Text
          selectable
          style={{
            marginTop: 12,
            color: '#fecaca',
            fontSize: 13,
            lineHeight: 20,
          }}
        >
          {step.error}
        </Text>
      ) : null}
    </View>
  );
}

const AdminChatThinkingPanel: React.FC<AdminChatThinkingPanelProps> = ({ state }) => {
  const toolSteps = state.steps.filter((step) => step.kind === 'tool');

  const hasContent = toolSteps.length > 0 || Boolean(state.error);

  if (!hasContent) {
    return null;
  }

  return (
    <View>
      <ScrollView
        style={{ maxHeight: 280 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {toolSteps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}

        {state.error ? (
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
              {state.error}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default AdminChatThinkingPanel;
