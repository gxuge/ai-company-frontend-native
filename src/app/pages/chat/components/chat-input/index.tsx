import * as React from 'react';
import { Image, Pressable, TextInput, View, Platform, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import imgLightbulbIcon from '../../../../../assets/images/chat/chat-input/lightbulb.svg';
import imgMicIcon from '../../../../../assets/images/chat/chat-input/mic.svg';
import imgPlusIcon from '../../../../../assets/images/chat/chat-input/plus.svg';
import imgKeyboardIcon from '../../../../../assets/images/chat/keyboard.svg';
import { styles } from './styles';

function MicIcon() {
  return <Image source={imgMicIcon} style={{ width: 21.3, height: 25 }} resizeMode="contain" />;
}

function KeyboardIcon() {
  return <Image source={imgKeyboardIcon} style={{ width: 25, height: 25 }} resizeMode="contain" />;
}

function LightbulbIcon() {
  return <Image source={imgLightbulbIcon} style={{ width: 21.2, height: 25.5 }} resizeMode="contain" />;
}

function PlusIcon() {
  return <Image source={imgPlusIcon} style={{ width: 23.4, height: 24.2 }} resizeMode="contain" />;
}

function toAssetUri(source: any) {
  return source?.uri ?? source?.default ?? source;
}

type ChatInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  submitting?: boolean;
  featureExpanded?: boolean;
  onMicPress?: () => void;
  onLightbulbPress?: () => void;
  onPlusPress?: () => void;
  onFocus?: () => void;
};

export const ChatInput = React.forwardRef<any, ChatInputProps>(({
  value,
  onChangeText,
  onSubmit,
  submitting = false,
  featureExpanded = false,
  onMicPress,
  onLightbulbPress,
  onPlusPress,
  onFocus,
}, ref) => {
  const [inputType, setInputType] = React.useState<'keyboard' | 'voice'>('keyboard');
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<any>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }));

  const plusRotation = useSharedValue(featureExpanded ? 45 : 0);

  React.useEffect(() => {
    plusRotation.value = withTiming(featureExpanded ? 45 : 0, { duration: 220 });
  }, [featureExpanded, plusRotation]);

  const plusIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${plusRotation.value}deg` }],
  }));

  const handleLeftIconPress = () => {
    setInputType(prev => (prev === 'keyboard' ? 'voice' : 'keyboard'));
  };

  const handleAddParentheses = (e?: any) => {
    e?.preventDefault();
    const current = value || '';
    onChangeText?.(current + '（）');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={{ ...webStyles.leftSection, opacity: isFocused ? 0 : 1, pointerEvents: isFocused ? 'none' : 'auto' }}>
          <button type="button" style={webStyles.micButton} onClick={handleLeftIconPress}>
            <img src={toAssetUri(inputType === 'keyboard' ? imgMicIcon : imgKeyboardIcon)} style={inputType === 'keyboard' ? { width: 21.3, height: 25 } : { width: 25, height: 25 }} />
          </button>
        </div>

        <div style={webStyles.holdTextWrapper}>
          {inputType === 'keyboard' ? (
            <input
              ref={inputRef}
              value={value || ''}
              onChange={e => onChangeText?.(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSubmit?.();
                }
              }}
              onFocus={() => {
                setIsFocused(true);
                onFocus?.();
              }}
              onBlur={() => setIsFocused(false)}
              disabled={submitting}
              placeholder="发送消息..."
              style={{
                ...webStyles.holdInput,
                width: '100%',
                textAlign: 'left',
                paddingLeft: isFocused ? 15 : 60,
                paddingRight: 145,
                boxSizing: 'border-box'
              }}
            />
          ) : (
            <div onClick={onMicPress} style={{ width: '52%', textAlign: 'center', cursor: 'pointer', color: '#ffffff', fontSize: 16 }}>
              按住说话
            </div>
          )}
        </div>

        <div style={webStyles.rightSection}>
          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={handleAddParentheses}
            style={{
              ...webStyles.iconButton,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
              width: 28,
              height: 32,
            }}
          >
            ()
          </button>
          <button type="button" style={webStyles.iconButton} onClick={onLightbulbPress}>
            <img src={toAssetUri(imgLightbulbIcon)} style={{ width: 21.2, height: 25.5 }} />
          </button>
          <button type="button" style={webStyles.iconButton} onClick={onPlusPress ?? onSubmit}>
            <img
              src={toAssetUri(imgPlusIcon)}
              style={{
                width: 23.4,
                height: 24.2,
                transform: `rotate(${featureExpanded ? 45 : 0}deg)`,
                transition: 'transform 220ms ease',
              }}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.leftSection, isFocused && { opacity: 0 }]} pointerEvents={isFocused ? 'none' : 'auto'}>
        <Pressable style={styles.micButton} onPress={handleLeftIconPress}>
          {inputType === 'keyboard' ? <MicIcon /> : <KeyboardIcon />}
        </Pressable>
      </View>

      <View style={styles.holdTextWrapper}>
        {inputType === 'keyboard' ? (
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            editable={!submitting}
            placeholder="发送消息..."
            placeholderTextColor="rgba(255,255,255,0.55)"
            style={[
              styles.holdInput,
              { width: '100%', textAlign: 'left', paddingRight: 145 },
              { paddingLeft: isFocused ? 15 : 60 }
            ]}
            returnKeyType="send"
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <Pressable onPress={onMicPress} style={{ width: '52%', alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>按住说话</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.rightSection}>
        <Pressable
          style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, width: 28, height: 32 }]}
          onPress={handleAddParentheses}
        >
          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>()</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onLightbulbPress}>
          <LightbulbIcon />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onPlusPress ?? onSubmit}>
          <Animated.View style={plusIconAnimatedStyle}>
            <PlusIcon />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
});

const webStyles: Record<string, React.CSSProperties> = {
  container: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 4,
    minHeight: 56,
    padding: '0 20px',
    borderRadius: 17,
    border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: '#1d1d1d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    boxSizing: 'border-box',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  holdTextWrapper: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    pointerEvents: 'none',
  },
  holdInput: {
    width: '52%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center',
    pointerEvents: 'auto',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    zIndex: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    border: 'none',
    background: 'transparent',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};

