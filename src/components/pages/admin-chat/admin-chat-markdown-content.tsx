import type { StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

export type AdminChatMarkdownContentProps = {
  content: string;
};

const markdownStyles: StyleSheet.NamedStyles<any> = {
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: '\'Alibaba PuHuiTi 3.0\', \'Noto Sans SC\', sans-serif',
    fontSize: 30,
    lineHeight: 45,
  },
  text: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: '\'Alibaba PuHuiTi 3.0\', \'Noto Sans SC\', sans-serif',
    fontSize: 30,
    lineHeight: 45,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 18,
  },
  strong: {
    color: '#ffffff',
    fontWeight: '800',
  },
  em: {
    fontStyle: 'italic',
  },
  blockquote: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(245,158,11,0.6)',
    borderLeftWidth: 4,
    marginLeft: 0,
    paddingHorizontal: 12,
  },
  bullet_list: {
    marginTop: 0,
    marginBottom: 18,
  },
  ordered_list: {
    marginTop: 0,
    marginBottom: 18,
  },
  list_item: {
    marginBottom: 8,
  },
  bullet_list_icon: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 30,
    lineHeight: 45,
  },
  bullet_list_content: {
    flex: 1,
  },
  ordered_list_icon: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 30,
    lineHeight: 45,
  },
  ordered_list_content: {
    flex: 1,
  },
  code_inline: {
    color: '#fef3c7',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  fence: {
    color: '#fef3c7',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 18,
  },
  code_block: {
    color: '#fef3c7',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 18,
  },
};

export default function AdminChatMarkdownContent({ content }: AdminChatMarkdownContentProps) {
  return (
    <Markdown style={markdownStyles}>
      {content}
    </Markdown>
  );
}
