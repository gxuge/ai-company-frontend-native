import React from 'react';
import { Platform, Text, View } from 'react-native';
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
  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.bubble}>
          <div style={webStyles.textRow}>
            {segments.map((seg, idx) => (
              <span
                key={idx}
                style={seg.type === 'speech' ? webStyles.speechText : webStyles.actionText}
              >
                {seg.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    marginLeft: 'auto',
    backgroundColor: '#c6ffb8',
    borderRadius: 15,
    padding: 16,
    border: '1px solid #181818',
    boxSizing: 'border-box',
  },
  textRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  speechText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '24px',
  },
  actionText: {
    color: '#087200',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: '24px',
  },
};
