import type { Href } from 'expo-router';
import { router } from 'expo-router';
import * as React from 'react';

type PageItem = {
  label: string;
  href: Extract<Href, string>;
};

const pageItems: PageItem[] = [
  { label: 'Chat', href: '/pages/chat' },
  { label: 'Quick Login', href: '/pages/quick-login' },
  { label: 'Session List', href: '/pages/session-list' },
  { label: 'Conversation Detail', href: '/pages/conversation-detail' },
  { label: 'Browse Images', href: '/pages/browse-images-list' },
  { label: 'Create Role', href: '/pages/create-role' },
  { label: 'Create Character', href: '/pages/create-character' },
  { label: 'Email Login', href: '/pages/email-login' },
  { label: 'Verification Code Login', href: '/pages/verification-code-login' },
  { label: 'Select Role', href: '/pages/select-role' },
  { label: 'Role Detail', href: '/pages/role-detail' },
  { label: 'Create Story', href: '/pages/create-story' },
  { label: 'Create Page', href: '/pages/create-page' },
  { label: 'Draft', href: '/pages/draft' },
  { label: 'Sound Edit', href: '/pages/sound-edit' },
  { label: 'General Setting', href: '/pages/general-setting' },
  { label: 'User Setting', href: '/pages/user-setting' },
  { label: 'Mine', href: '/pages/mine' },
  { label: 'Generating Page', href: '/pages/generating-page' },
  { label: 'Generating Select', href: '/pages/generating-select' as Extract<Href, string> },
  { label: 'My Gallery', href: '/pages/my-gallery' },
  { label: 'Admin Chat', href: '/pages/admin-chat' },
  { label: 'System Chat', href: '/pages/system-chat' },
];

export default function PagesHubScreen() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Pages Navigation</h1>
        <p style={styles.subtitle}>Tap any button to open a page</p>

        <div style={styles.buttonList}>
          {pageItems.map(item => (
            <button
              key={item.href}
              type="button"
              style={styles.button}
              onClick={() => router.push(item.href)}
            >
              <div style={styles.buttonText}>{item.label}</div>
              <div style={styles.pathText}>{item.href}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0b1220',
    overflowY: 'auto',
  },
  content: {
    padding: '20px 16px 40px',
  },
  title: {
    margin: 0,
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 800,
  },
  subtitle: {
    margin: '8px 0 16px',
    color: '#9ca3af',
    fontSize: 14,
  },
  buttonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#131d33',
    border: '1px solid #26314f',
    borderRadius: 12,
    padding: '12px 14px',
    cursor: 'pointer',
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: 700,
  },
  pathText: {
    color: '#93c5fd',
    fontSize: 12,
    marginTop: 4,
  },
};
