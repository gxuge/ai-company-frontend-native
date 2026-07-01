import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
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
        {step.name ? <StepBadge text={step.name} color="#f97316" /> : null}
      </View>

      {step.status !== 'error' && step.text ? (
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
  const [isExpanded, setIsExpanded] = useState(true);

  const hasContent =
    state.agentStatus !== 'idle'
    || state.steps.length > 0
    || Boolean(state.finalText)
    || Boolean(state.error);

  if (!hasContent) {
    return null;
  }

  const summaryStatus = state.active ? 'running' : state.finalStatus;
  const summaryColor = statusAccent[summaryStatus];

  return (
    <View
      style={{
        marginBottom: 18,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: `${summaryColor}40`,
        backgroundColor: 'rgba(24, 19, 16, 0.92)',
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.28,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsExpanded(!isExpanded)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: summaryColor,
            }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 17,
              fontWeight: '800',
              flexShrink: 1,
            }}
          >
            正在思考
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <StepBadge text={statusLabel[summaryStatus]} color={summaryColor} />
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            {isExpanded ? '▲' : '▼'}
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <>
          {state.agentName ? (
            <Text
              selectable
              style={{
                marginTop: 8,
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
              }}
            >
              {`Agent: ${state.agentName}`}
            </Text>
          ) : null}

          {(state.routeDecision || state.targetSubAgent) ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {state.routeDecision ? <StepBadge text={`Route ${state.routeDecision}`} color="#38bdf8" /> : null}
              {state.targetSubAgent ? <StepBadge text={`Target ${state.targetSubAgent}`} color="#a78bfa" /> : null}
            </View>
          ) : null}

          <ScrollView
            style={{ marginTop: 8, maxHeight: 280 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {state.steps.map((step) => (
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

            {state.finalText ? (
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(34,197,94,0.24)',
                  backgroundColor: 'rgba(34,197,94,0.08)',
                  padding: 14,
                }}
              >
                <Text style={{ color: '#86efac', fontSize: 12, fontWeight: '700', marginBottom: 8 }}>
                  最终结果
                </Text>
                <Text selectable style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 22 }}>
                  {state.finalText}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default AdminChatThinkingPanel;
