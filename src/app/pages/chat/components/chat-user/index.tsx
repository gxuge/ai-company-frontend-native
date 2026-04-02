import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

// ─── Types ───

interface TextSegment {
  text: string;
  type: 'speech' | 'action';
}

interface ChatUserProps {
  /**
   * Array of text segments. Use 'speech' for bold black dialogue text
   * and 'action' for green parenthetical action/gesture text.
   *
   * Example:
   * [
   *   { text: '我不知道', type: 'speech' },
   *   { text: '（摇了摇头）', type: 'action' },
   * ]
   */
  segments: TextSegment[];
}

// ─── Main Component ───

export function ChatUser({ segments }: ChatUserProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.textRow}>
          {segments.map((seg, idx) => (
            <Text
              key={idx}
              style={seg.type === 'speech' ? styles.speechText : styles.actionText}
            >
              {seg.text}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
