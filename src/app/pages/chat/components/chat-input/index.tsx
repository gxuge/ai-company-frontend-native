import * as React from 'react';
import { Image, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import imgLightbulbIcon from '../../../../../assets/images/chat/chat-input/lightbulb.svg';
import imgMicIcon from '../../../../../assets/images/chat/chat-input/mic.svg';
import imgPlusIcon from '../../../../../assets/images/chat/chat-input/plus.svg';
import imgKeyboardIcon from '../../../../../assets/images/chat/keyboard.svg';
import { styles } from './styles';

// eslint-disable-next-line perfectionist/sort-imports
const imgSendIcon = require('../../../../../assets/images/chat/chat-input/send.svg');

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

function SendIcon() {
  return <Image source={imgSendIcon} style={{ width: 24, height: 24 }} resizeMode="contain" />;
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

// eslint-disable-next-line max-lines-per-function
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
  const [nativeInputHeight, setNativeInputHeight] = React.useState(40);
  const inputRef = React.useRef<any>(null);
  const hasInputContent = Boolean(value?.trim());
  const showExpandedLayout = inputType === 'keyboard' && (isFocused || hasInputContent);
  const showSendButton = inputType === 'keyboard' && isFocused && hasInputContent;

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    },
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

  const handleInputBlur = () => {
    setIsFocused(false);
    if (!value?.trim()) {
      onChangeText?.('');
    }
  };

  const handleSubmit = () => {
    if (!value?.trim() || submitting) {
      return;
    }
    inputRef.current?.blur();
    setIsFocused(false);
    onSubmit?.();
  };

  const handleAddParentheses = (e?: any) => {
    e?.preventDefault();
    const current = value || '';
    onChangeText?.(`${current}（）`);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  React.useEffect(() => {
    if (Platform.OS !== 'web' || inputType !== 'keyboard' || !inputRef.current) {
      return;
    }
    const element = inputRef.current as HTMLTextAreaElement;
    element.style.height = '40px';
    const nextHeight = Math.min(Math.max(element.scrollHeight, 40), 160);
    element.style.height = `${nextHeight}px`;
    element.style.overflowY = element.scrollHeight > 160 ? 'auto' : 'hidden';
  }, [inputType, value]);

  if (Platform.OS === 'web') {
    if (inputType === 'voice') {
      return (
        <div style={webStyles.container}>
          <div style={webStyles.leftSection}>
            <button type="button" style={webStyles.micButton} onClick={handleLeftIconPress}>
              <img src={toAssetUri(imgKeyboardIcon)} style={{ width: 25, height: 25 }} />
            </button>
          </div>

          <div onClick={onMicPress} style={webStyles.voiceHoldText}>
            按住说话
          </div>

          <div style={webStyles.rightSection}>
            <button
              type="button"
              onMouseDown={event => event.preventDefault()}
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
            <button type="button" style={webStyles.iconButton} onClick={onPlusPress ?? handleSubmit}>
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
      <div
        style={{
          ...webStyles.container,
          display: 'grid',
          gridTemplateColumns: '36px minmax(0, 1fr) auto',
          gridTemplateRows: showExpandedLayout ? 'minmax(40px, auto) 36px' : '40px',
          columnGap: showExpandedLayout ? 0 : 12,
          rowGap: showExpandedLayout ? 10 : 0,
          padding: showExpandedLayout ? '10px 14px' : '8px 20px',
          transition: 'grid-template-rows 220ms cubic-bezier(0.22, 1, 0.36, 1), row-gap 220ms cubic-bezier(0.22, 1, 0.36, 1), padding 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            ...webStyles.leftSection,
            gridColumn: 1,
            gridRow: showExpandedLayout ? 2 : 1,
          }}
        >
          <button type="button" style={webStyles.micButton} onClick={handleLeftIconPress}>
            <img src={toAssetUri(imgMicIcon)} style={{ width: 21.3, height: 25 }} />
          </button>
        </div>

        <textarea
          ref={inputRef}
          value={value || ''}
          onChange={event => onChangeText?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={handleInputBlur}
          disabled={submitting}
          placeholder="发送消息..."
          rows={1}
          style={{
            ...webStyles.holdInput,
            gridColumn: showExpandedLayout ? '1 / -1' : 2,
            gridRow: 1,
            width: '100%',
            minHeight: 40,
            maxHeight: 160,
            alignSelf: 'stretch',
            boxSizing: 'border-box',
          }}
        />

        <div
          style={{
            ...webStyles.rightSection,
            gridColumn: showExpandedLayout ? '2 / 4' : 3,
            gridRow: showExpandedLayout ? 2 : 1,
            justifySelf: 'end',
          }}
        >
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
          <button
            type="button"
            disabled={showSendButton && submitting}
            onMouseDown={(event) => {
              if (showSendButton) {
                event.preventDefault();
              }
            }}
            onClick={showSendButton ? handleSubmit : onPlusPress}
            style={{
              ...webStyles.iconButton,
              opacity: showSendButton && submitting ? 0.45 : 1,
            }}
          >
            {showSendButton && (
              <img src={toAssetUri(imgSendIcon)} style={{ width: 24, height: 24 }} />
            )}
            {!showSendButton && (
              <img
                src={toAssetUri(imgPlusIcon)}
                style={{
                  width: 23.4,
                  height: 24.2,
                  transform: `rotate(${featureExpanded ? 45 : 0}deg)`,
                  transition: 'transform 220ms ease',
                }}
              />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <View style={[styles.container, showExpandedLayout && styles.containerExpanded]}>
      <View style={[styles.leftSection, showExpandedLayout && styles.leftSectionExpanded]}>
        <Pressable style={styles.micButton} onPress={handleLeftIconPress}>
          {inputType === 'keyboard' ? <MicIcon /> : <KeyboardIcon />}
        </Pressable>
      </View>

      {inputType === 'keyboard' && (
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          editable={!submitting}
          multiline
          blurOnSubmit
          placeholder="发送消息..."
          placeholderTextColor="rgba(255,255,255,0.55)"
          style={[
            styles.holdInput,
            showExpandedLayout ? styles.holdInputExpanded : styles.holdInputCompact,
            { height: nativeInputHeight },
          ]}
          returnKeyType="send"
          onContentSizeChange={(event) => {
            const nextHeight = Math.min(Math.max(event.nativeEvent.contentSize.height, 40), 120);
            setNativeInputHeight(nextHeight);
          }}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={handleInputBlur}
        />
      )}
      {inputType === 'voice' && (
        <Pressable onPress={onMicPress} style={styles.voiceHoldText}>
          <Text style={{ color: '#ffffff', fontSize: 16 }}>按住说话</Text>
        </Pressable>
      )}

      <View style={[styles.rightSection, showExpandedLayout && styles.rightSectionExpanded]}>
        <Pressable
          style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, width: 28, height: 32 }]}
          onPress={handleAddParentheses}
        >
          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>()</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onLightbulbPress}>
          <LightbulbIcon />
        </Pressable>
        <Pressable
          style={[styles.iconButton, showSendButton && submitting && { opacity: 0.45 }]}
          disabled={showSendButton && submitting}
          onPress={showSendButton ? handleSubmit : onPlusPress}
        >
          {showSendButton && (
            <SendIcon />
          )}
          {!showSendButton && (
            <Animated.View style={plusIconAnimatedStyle}>
              <PlusIcon />
            </Animated.View>
          )}
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
    padding: '8px 20px',
    borderRadius: 17,
    border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: '#1d1d1d',
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
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    padding: '8px 0',
    margin: 0,
    resize: 'none',
    overflowY: 'hidden',
    pointerEvents: 'auto',
  },
  voiceHoldText: {
    flex: 1,
    textAlign: 'center',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: 16,
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
