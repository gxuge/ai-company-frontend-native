import type { Href } from 'expo-router';
import { router } from 'expo-router';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  { label: 'Verification Code Login', href: '/pages/verification-code-login' },
  { label: 'Select Role', href: '/pages/select-role' },
  { label: 'Role Detail', href: '/pages/role-detail' },
  { label: 'Create Story', href: '/pages/create-story' },
  { label: 'Create Page', href: '/pages/create-page' },
  { label: 'Sound Edit', href: '/pages/sound-edit' },
  { label: 'General Setting', href: '/pages/general-setting' },
  { label: 'User Setting', href: '/pages/user-setting' },
  { label: 'Mine', href: '/pages/mine' },
  { label: 'Generating Page', href: '/pages/generating-page' },
  { label: 'My Gallery', href: '/pages/my-gallery' },
  { label: 'Admin Chat', href: '/pages/admin-chat' },
  { label: 'Sound Generating', href: '/pages/sound-generating' },
];

export default function PagesHubScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pages Navigation</Text>
      <Text style={styles.subtitle}>Tap any button to open a page</Text>

      <View style={styles.buttonList}>
        {pageItems.map(item => (
          <TouchableOpacity key={item.href} style={styles.button} activeOpacity={0.85} onPress={() => router.push(item.href)}>
            <Text style={styles.buttonText}>{item.label}</Text>
            <Text style={styles.pathText}>{item.href}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonList: {
    gap: 10,
  },
  button: {
    backgroundColor: '#131d33',
    borderWidth: 1,
    borderColor: '#26314f',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
  },
  pathText: {
    color: '#93c5fd',
    fontSize: 12,
    marginTop: 4,
  },
});
