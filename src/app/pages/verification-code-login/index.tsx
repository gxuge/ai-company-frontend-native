import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiInput } from '@/components/ai-company/ai-input';
import { AiLoginBtn } from '@/components/ai-company/ai-login-btn';
import { signIn } from '@/features/auth/use-auth-store';
import { userApi } from '@/lib/api';

const imgBackground = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/5002ae40133251c579d54d15ebcf7a815a0bc048.png'));
const imgClose = require('../../../assets/images/quick-login/svg/p62a9900.svg');

const PHONE_REGEX = /^1\d{10}$/;
const CODE_REGEX = /^\d{6}$/;
const QUICK_LOGIN_BYPASS_PHONE = '13609742270';
const DESIGN_W = 750;
const DESIGN_H = 1624;

export default function VerificationCodeLoginPage() {
  const [scale, setScale] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [agreementError, setAgreementError] = useState('');

  const isPhoneValid = PHONE_REGEX.test(phone);
  const isCodeValid = CODE_REGEX.test(code);
  const canConfirmLogin = isPhoneValid && isCodeValid && !submitting;

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

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = setInterval(() => setCountdown(value => value - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!PHONE_REGEX.test(phone)) {
      setPhoneError('请输入正确的11位手机号码');
      return;
    }
    if (phone === QUICK_LOGIN_BYPASS_PHONE) {
      showNativeAlert('该手机号已开通快捷登录，可直接点击确认登录');
      return;
    }
    setPhoneError('');
    if (countdown === 0) {
      setCountdown(60);
    }
  };

  const handleLogin = async () => {
    if (submitting) {
      return;
    }
    if (!agreed) {
      setAgreementError('登录前请先勾选同意《用户协议》与《隐私政策》，我们会保护您的个人信息安全 🔒');
      return;
    }
    setAgreementError('');
    if (!PHONE_REGEX.test(phone)) {
      setPhoneError('请输入正确的11位手机号码');
      return;
    }
    setPhoneError('');
    const isBypassPhone = phone === QUICK_LOGIN_BYPASS_PHONE;
    if (!isBypassPhone && !CODE_REGEX.test(code)) {
      showNativeAlert('验证码必须为6位数字');
      return;
    }

    setSubmitting(true);
    try {
      const loginResult = await userApi.phoneLogin({
        mobile: phone,
        captcha: isBypassPhone ? (code || '000000') : code,
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
            欢迎登录 探拾
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
              未注册的手机号验证通过后将自动注册
            </span>
          </div>

          <div style={{ height: 12 }} />

          {/* 手机号输入框 + 行内错误提示 */}
          <div
            style={{
              position: 'relative',
              width: 634,
              height: 84,
              marginBottom: phoneError ? 16 : 0,
              transition: 'margin-bottom 0.2s ease-in-out',
            }}
          >
            <AiInput
              value={phone}
              onChangeText={(text: string) => {
                setPhone(text.replace(/\D/g, '').slice(0, 11));
                if (phoneError) setPhoneError('');
              }}
              placeholder="输入手机号码"
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
              leftNode={
                <>
                  <span
                    style={{
                      color: '#e7e7e7',
                      fontSize: 29,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      marginRight: 20,
                    }}
                  >
                    +86
                  </span>
                  <img
                    src={imgBackground}
                    alt=""
                    style={{ width: 1.1, height: 24, objectFit: 'cover', marginRight: 20, opacity: 0.6 }}
                  />
                </>
              }
            />
            {phoneError
              ? (
                  <div style={{ position: 'absolute', top: 90, left: 36, color: '#f56c6c', fontSize: 16, fontFamily: 'sans-serif' }}>
                    {phoneError}
                  </div>
                )
              : null}
          </div>

          <AiInput
            value={code}
            onChangeText={(text: string) => setCode(text.replace(/\D/g, '').slice(0, 6))}
            placeholder="输入验证码"
            placeholderTextColor="#666668"
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
            rightNode={
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: countdown > 0 ? '#7a7a7c' : '#5c5c5e',
                  fontSize: 28,
                  fontFamily: 'Microsoft YaHei, sans-serif',
                  cursor: countdown > 0 ? 'default' : 'pointer',
                }}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            }
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
