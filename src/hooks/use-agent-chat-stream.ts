import { useCallback, useRef, useState, type MutableRefObject } from 'react';
import {
  createInitialAgentChatStreamState,
  reduceAgentChatStreamState,
  type AgentChatStreamState,
} from '@/lib/api';

type StreamStateUpdater = (state: AgentChatStreamState) => AgentChatStreamState;

export type UseAgentChatStreamResult = {
  state: AgentChatStreamState;
  stateRef: MutableRefObject<AgentChatStreamState>;
  activeMessageIdRef: MutableRefObject<number | null>;
  startTurn: (messageId: number) => AgentChatStreamState;
  reset: () => AgentChatStreamState;
  applyEvent: (messageId: number, eventName: string, dataText: string) => AgentChatStreamState | null;
  markError: (messageId: number, errorText: string) => AgentChatStreamState | null;
  completeTurn: (messageId: number) => AgentChatStreamState | null;
  stopTurn: (messageId?: number) => void;
  isActiveTurn: (messageId: number) => boolean;
};

function createCompletedState(previous: AgentChatStreamState): AgentChatStreamState {
  return previous.active
    ? {
        ...previous,
        active: false,
        agentStatus: previous.agentStatus === 'error' ? 'error' : 'done',
        finalStatus: previous.finalStatus === 'error' ? 'error' : 'done',
      }
    : previous;
}

function createErroredState(previous: AgentChatStreamState, errorText: string): AgentChatStreamState {
  return {
    ...previous,
    active: false,
    agentStatus: 'error',
    finalStatus: 'error',
    error: errorText,
  };
}

function useStreamStateSync() {
  const [state, setState] = useState<AgentChatStreamState>(createInitialAgentChatStreamState());
  const stateRef = useRef<AgentChatStreamState>(state);

  const commitState = useCallback((nextState: AgentChatStreamState) => {
    stateRef.current = nextState;
    setState(nextState);
    return nextState;
  }, []);

  return { state, stateRef, commitState };
}

export function useAgentChatStream(): UseAgentChatStreamResult {
  const { state, stateRef, commitState } = useStreamStateSync();
  const activeMessageIdRef = useRef<number | null>(null);

  const reset = useCallback(() => commitState(createInitialAgentChatStreamState()), [commitState]);

  const startTurn = useCallback((messageId: number) => {
    activeMessageIdRef.current = messageId;
    return reset();
  }, [reset]);

  const isActiveTurn = useCallback((messageId: number) => activeMessageIdRef.current === messageId, []);

  const stopTurn = useCallback((messageId?: number) => {
    if (messageId == null || activeMessageIdRef.current === messageId) {
      activeMessageIdRef.current = null;
    }
  }, []);

  const applyEvent = useCallback((messageId: number, eventName: string, dataText: string) => {
    if (!isActiveTurn(messageId)) {
      return null;
    }

    const current = stateRef.current ?? createInitialAgentChatStreamState();
    const next = reduceAgentChatStreamState(current, eventName, dataText);
    return commitState(next);
  }, [commitState, isActiveTurn, stateRef]);

  const applyStateUpdate = useCallback((
    messageId: number,
    updater: StreamStateUpdater,
  ) => {
    if (!isActiveTurn(messageId)) {
      return null;
    }

    const current = stateRef.current ?? createInitialAgentChatStreamState();
    return commitState(updater(current));
  }, [commitState, isActiveTurn, stateRef]);

  const markError = useCallback((messageId: number, errorText: string) =>
    applyStateUpdate(messageId, (current) => createErroredState(current, errorText)),
  [applyStateUpdate]);

  const completeTurn = useCallback((messageId: number) =>
    applyStateUpdate(messageId, createCompletedState),
  [applyStateUpdate]);

  return {
    state,
    stateRef,
    activeMessageIdRef,
    startTurn,
    reset,
    applyEvent,
    markError,
    completeTurn,
    stopTurn,
    isActiveTurn,
  };
}
