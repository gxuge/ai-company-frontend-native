import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { AiCloseBtn } from '@/components/ai-company/ai-close-btn';
import { AiInput } from '@/components/ai-company/ai-input';
import { AiLoginBtn } from '@/components/ai-company/ai-login-btn';
import { signIn } from '@/features/auth/use-auth-store';
import { userApi } from '@/lib/api';

const imgImage = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/2dfbef3493ddaae489166e016e1a4a78aa729aac.png'));
const imgImage1 = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/4a0515f093f505d671ec2d74d4010daa50d88b96.png'));
const imgImage2 = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/b3da50266386b29a46ab5c05f2530974789cc419.png'));
const imgBackground = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/5002ae40133251c579d54d15ebcf7a815a0bc048.png'));
const imgAgreementCircle = ((m: any) => m?.default ?? m?.uri ?? m)(require('../../../assets/images/verification-code-login/agreement_circle.svg'));
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
  const showNativeAlert = (message: string) => {
    Alert.alert('提示', message);
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
      showNativeAlert('请输入正确的11位手机号码');
      return;
    }
    if (phone === QUICK_LOGIN_BYPASS_PHONE) {
      showNativeAlert('该手机号已开通快捷登录，可直接点击确认登录');
      return;
    }
    if (countdown === 0) {
      setCountdown(60);
    }
  };

  const handleLogin = async () => {
    if (submitting) {
      return;
    }
    if (!agreed) {
      showNativeAlert('请先阅读并同意用户协议和隐私政策');
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      showNativeAlert('请输入正确的11位手机号码');
      return;
    }
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
      router.replace('/pages/chat');
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

          <AiInput
            value={phone}
            onChangeText={(text: string) => setPhone(text.replace(/\D/g, '').slice(0, 11))}
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
            disabled={submitting}
            label={submitting ? '登录中...' : '确认登录'}
            customWidth=""
            customHeight=""
            radius=""
            className={submitting ? 'opacity-75' : ''}
            style={{
              width: 627,
              height: 85,
              backgroundColor: '#528700',
              borderColor: '#4f4736',
              borderWidth: 1.1,
              borderRadius: 44,
              flexShrink: 0,
            }}
            textClassName="text-[30px] font-bold font-sans text-[#141414]"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 849,
            left: 79,
            display: 'flex',
            alignItems: 'center',
            gap: 17,
          }}
        >
          <button
            type="button"
            onClick={() => setAgreed(value => !value)}
            style={{ border: 'none', background: 'transparent', padding: 0, margin: 0, cursor: 'pointer' }}
          >
            <img
              src={imgAgreementCircle}
              alt=""
              style={{ width: 34, height: 34, objectFit: 'contain', opacity: agreed ? 1 : 0.35 }}
            />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
            <span
              style={{
                color: '#646466',
                fontSize: 22,
                fontFamily: 'Microsoft YaHei, sans-serif',
              }}
            >
              已阅读并同意
            </span>
            <span
              style={{
                color: '#ffffff',
                fontSize: 22,
                fontFamily: 'sans-serif',
              }}
            >
              《用户协议》
            </span>
            <span
              style={{
                color: '#ffffff',
                fontSize: 22,
                fontFamily: 'sans-serif',
              }}
            >
              《隐私政策》
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
