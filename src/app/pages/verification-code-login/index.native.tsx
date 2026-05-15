import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, Text, View } from 'react-native';
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
    Alert.alert('Tip', message, [{ text: 'OK', onPress: () => onConfirm?.() }]);
  };

  useEffect(() => {
    const update = () => setScale(Dimensions.get('window').width / DESIGN_W);
    update();
    const subscription = Dimensions.addEventListener('change', update);
    return () => subscription?.remove();
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
    <View
      style={{
        width: '100%',
        height: DESIGN_H * scale,
        overflow: 'hidden',
        backgroundColor: '#020202',
      }}
    >
      <View
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: [
            { scale },
            { translateX: -(DESIGN_W * (1 - scale)) / (2 * scale) },
            { translateY: -(DESIGN_H * (1 - scale)) / (2 * scale) },
          ],
          position: 'relative',
          backgroundColor: '#020202',
          overflow: 'hidden',
        }}
      >

        <View style={{ position: 'absolute', top: 114, left: 52 }}>
          <AiCloseBtn
            iconSource={imgClose}
            customWidth="w-[87px]"
            customHeight="h-[87px]"
            iconWidth={26}
            iconHeight={32}
            onPress={() => router.back()}
          />
        </View>

        <View
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
          <Text
            style={{
              fontSize: 45,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'sans-serif',
              textAlign: 'center',
              lineHeight: 54,
              width: '100%',
            }}
          >
            欢迎登录 探拾
          </Text>

          <View
            style={{
              width: 632,
              minHeight: 58,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#666668', textAlign: 'center', width: '100%' }}>
              未注册的手机号验证通过后将自动注册
            </Text>
          </View>

          <View style={{ height: 12 }} />

          {/* 手机号输入框 + 行内错误提示 */}
          <View
            style={{
              position: 'relative',
              width: 634,
              height: 84,
              marginBottom: phoneError ? 16 : 0,
            }}
          >
            <AiInput
              value={phone}
              onChangeText={(text: string) => {
                setPhone(text.replace(/\D/g, '').slice(0, 11));
                if (phoneError)
                  setPhoneError('');
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
              leftNode={(
                <>
                  <Text
                    style={{
                      color: '#e7e7e7',
                      fontSize: 29,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      marginRight: 20,
                    }}
                  >
                    +86
                  </Text>
                  <Image
                    source={imgBackground}

                    style={{ width: 1.1, height: 24, marginRight: 20, opacity: 0.6 }}
                  />
                </>
              )}
            />
            {phoneError
              ? (
                  <Text style={{ position: 'absolute', top: 90, left: 36, color: '#f56c6c', fontSize: 16, fontFamily: 'sans-serif' }}>
                    {phoneError}
                  </Text>
                )
              : null}
          </View>

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
            rightNode={(
              <Pressable
                onPress={handleSendCode}
                disabled={countdown > 0}
                style={{ backgroundColor: 'transparent' }}
              >
                <Text style={{ color: countdown > 0 ? '#7a7a7c' : '#5c5c5e', fontSize: 28, fontFamily: 'Microsoft YaHei, sans-serif' }}>
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Text>
              </Pressable>
            )}
          />

          <View style={{ height: 60 }} />

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
        </View>

        {/* 协议勾选区域 */}
        <View style={{ position: 'absolute', top: 849, left: 79 }}>
          {agreementError
            ? (
                <Text style={{ color: '#f56c6c', fontSize: 18, fontFamily: 'sans-serif', marginBottom: 6, paddingLeft: 2 }}>
                  {agreementError}
                </Text>
              )
            : null}
          <View style={{ display: 'flex', alignItems: 'center', gap: 17 }}>
            <Pressable

              onPress={() => { setAgreed(value => !value); setAgreementError(''); }}
              style={{ backgroundColor: 'transparent', padding: 0, margin: 0 }}
            >
              <View
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
                  backgroundColor: 'transparent',
                }}
              >
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#9bfe03',
                    opacity: agreed ? 1 : 0,
                    transform: [{ scale: agreed ? 1 : 0.5 }],
                  }}
                />
              </View>
            </Pressable>
            <View style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
              <Text style={{ color: '#646466', fontSize: 22, fontFamily: 'Microsoft YaHei, sans-serif' }}>
                已阅读并同意
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 22, fontFamily: 'sans-serif' }}>
                《用户协议》
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 22, fontFamily: 'sans-serif' }}>
                《隐私政策》
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
