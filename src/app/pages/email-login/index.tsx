import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiInput } from '@/components/ai-company/ai-input';
import { AiLoginBtn } from '@/components/ai-company/ai-login-btn';
import { signIn } from '@/features/auth/use-auth-store';
import { userApi } from '@/lib/api';

const imgBackground = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/5002ae40133251c579d54d15ebcf7a815a0bc048.png'));
const imgClose = require('../../../assets/images/quick-login/svg/p62a9900.svg');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESIGN_W = 750;
const DESIGN_H = 1624;

export default function EmailLoginPage() {
  const [scale, setScale] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [agreementError, setAgreementError] = useState('');

  const isEmailValid = EMAIL_REGEX.test(email);
  const isPasswordValid = password.length >= 6; // Basic validation
  const canConfirmLogin = isEmailValid && isPasswordValid && !submitting;

  const showNativeAlert = (message: string, onConfirm?: () => void) => {
    if (typeof window !== 'undefined') {
      window.alert(message);
      onConfirm?.();
    } else {
      Alert.alert('提示', message, [{ text: '确定', onPress: () => onConfirm?.() }]);
    }
  };

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleLogin = async () => {
    if (submitting) {
      return;
    }
    if (!agreed) {
      setAgreementError('登录前请先勾选同意《用户协议》与《隐私政策》，我们会保护您的个人信息安全 🔒');
      return;
    }
    setAgreementError('');
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('请输入正确的邮箱地址');
      return;
    }
    setEmailError('');
    if (password.length < 6) {
      showNativeAlert('密码长度不能少于6位');
      return;
    }

    setSubmitting(true);
    try {
      const loginResult = await userApi.login({
        username: email,
        password: password,
      });
      signIn({ token: loginResult.token, refreshToken: loginResult.refreshToken });
      showNativeAlert('登录成功', () => {
        router.replace('/pages/chat');
      });
    }
    catch (error) {
      const message = error instanceof Error ? error.message : '登录失败，请稍后重试';
      showNativeAlert(message);
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: `${DESIGN_H * scale}px`,
        overflow: 'hidden',
        background: '#020202',
      }}
    >
      <div
        style={{
          width: `${DESIGN_W}px`,
          height: `${DESIGN_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          background: '#020202',
          overflow: 'hidden',
        }}
      >

        <div style={{ position: 'absolute', top: 114, left: 52 }}>
          <AiCloseBtn
            iconSource={imgClose}
            customWidth="w-[87px]"
            customHeight="h-[87px]"
            iconWidth={26}
            iconHeight={32}
            onPress={() => router.back()}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 255,
            left: 60,
            width: 632,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 45,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'sans-serif',
              textAlign: 'center',
              lineHeight: 1.2,
              width: '100%',
            }}
          >
            邮箱登录
          </div>

          <div
            style={{
              width: 632,
              minHeight: 58,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#666668', textAlign: 'center', width: '100%' }}>
              未注册的邮箱验证通过后将自动注册
            </span>
          </div>

          <div style={{ height: 12 }} />

          {/* 邮箱输入框 + 行内错误提示 */}
          <div
            style={{
              position: 'relative',
              width: 634,
              height: 84,
              marginBottom: emailError ? 16 : 0,
              transition: 'margin-bottom 0.2s ease-in-out',
            }}
          >
            <AiInput
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder="输入邮箱地址"
              placeholderTextColor="#666668"
              inputStyle={{
                flex: 1,
                borderWidth: 0,
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontSize: 30,
                fontFamily: 'Microsoft YaHei, sans-serif',
              }}
              containerStyle={{
                width: 634,
                height: 84,
                backgroundColor: '#1e1f21',
                borderRadius: 37,
                display: 'flex',
                paddingLeft: 36,
                paddingRight: 36,
                flexShrink: 0,
              }}
            />
            {emailError
              ? (
                  <div style={{ position: 'absolute', top: 90, left: 36, color: '#f56c6c', fontSize: 16, fontFamily: 'sans-serif' }}>
                    {emailError}
                  </div>
                )
              : null}
          </div>

          <AiInput
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            placeholder="输入密码"
            placeholderTextColor="#666668"
            secureTextEntry={true}
            inputStyle={{
              flex: 1,
              borderWidth: 0,
              backgroundColor: 'transparent',
              color: '#ffffff',
              fontSize: 29,
              fontFamily: 'Microsoft YaHei, sans-serif',
            }}
            containerStyle={{
              width: 627,
              height: 85,
              backgroundColor: '#1f1e20',
              borderRadius: 42,
              display: 'flex',
              paddingLeft: 36,
              paddingRight: 36,
              justifyContent: 'space-between',
              flexShrink: 0,
              gap: 16,
            }}
          />

          <div style={{ height: 60 }} />

          <AiLoginBtn
            onPress={handleLogin}
            disabled={!canConfirmLogin}
            label={submitting ? '登录中...' : '确认登录'}
            customWidth=""
            customHeight=""
            radius=""
            className={canConfirmLogin ? '' : 'opacity-65'}
            style={{
              width: 627,
              height: 85,
              backgroundColor: canConfirmLogin ? '#9BFE03' : '#528700',
              borderColor: canConfirmLogin ? '#9BFE03' : '#4f4736',
              borderWidth: 1.1,
              borderRadius: 44,
              flexShrink: 0,
            }}
            textClassName="text-[30px] font-bold font-sans text-[#141414]"
          />
        </div>

        {/* 协议勾选区域 */}
        <div style={{ position: 'absolute', top: 849, left: 79 }}>
          {agreementError
            ? (
                <div style={{ color: '#f56c6c', fontSize: 18, fontFamily: 'sans-serif', marginBottom: 6, paddingLeft: 2 }}>
                  {agreementError}
                </div>
              )
            : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 17 }}>
            <button
              type="button"
              onClick={() => { setAgreed(value => !value); setAgreementError(''); }}
              style={{ border: 'none', background: 'transparent', padding: 0, margin: 0, cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  borderStyle: 'solid',
                  borderWidth: 2,
                  borderColor: agreed ? '#9bfe03' : '#646466',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent',
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#9bfe03',
                    opacity: agreed ? 1 : 0,
                    transform: agreed ? 'scale(1)' : 'scale(0.5)',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
              <span style={{ color: '#646466', fontSize: 22, fontFamily: 'Microsoft YaHei, sans-serif' }}>
                已阅读并同意
              </span>
              <span style={{ color: '#ffffff', fontSize: 22, fontFamily: 'sans-serif' }}>
                《用户协议》
              </span>
              <span style={{ color: '#ffffff', fontSize: 22, fontFamily: 'sans-serif' }}>
                《隐私政策》
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
