import { router } from 'expo-router';
import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function VrmDebugNativePlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VRM 人物调试</Text>
      <Text style={styles.description}>
        当前迁移阶段先验证 Expo Web。Android 和 iOS 渲染方案将在 Web 链路稳定后单独接入。
      </Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>返回</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#0c1017',
  },
  title: {
    color: '#f4f7fb',
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    maxWidth: 420,
    marginTop: 12,
    color: '#a6b0bf',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    minWidth: 100,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 6,
    backgroundColor: '#52cfa1',
  },
  buttonText: {
    color: '#07120e',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
