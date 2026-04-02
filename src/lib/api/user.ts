import { defHttp } from './def-http';

export type PhoneLoginPayload = {
  mobile: string;
  captcha: string;
  loginOrgCode?: string;
};

export type PhoneLoginResult = {
  token: string;
  refreshToken?: string;
  userInfo: Record<string, any>;
  departs?: Record<string, any>[];
  multi_depart?: number;
};

const LOCAL_PHONE_LOGIN_MODE = false;

function buildLocalPhoneLoginResult(mobile: string): PhoneLoginResult {
  return {
    token: `local-phone-token-${mobile}-${Date.now()}`,
    userInfo: {
      username: mobile,
      realname: mobile,
      phone: mobile,
    },
    departs: [],
    multi_depart: 0,
  };
}

async function phoneLoginRemote(payload: PhoneLoginPayload) {
  return defHttp.post<PhoneLoginResult>(
    {
      url: '/sys/phoneLogin',
      data: payload,
    },
    { withToken: false },
  );
}

export const userApi = {
  async phoneLogin(payload: PhoneLoginPayload) {
    if (LOCAL_PHONE_LOGIN_MODE) {
      return buildLocalPhoneLoginResult(payload.mobile);
    }
    return phoneLoginRemote(payload);
  },

  async quickLoginByPhone(mobile: string) {
    return this.phoneLogin({
      mobile,
      captcha: '000000',
    });
  },

  async getUserInfo() {
    return defHttp.get<{ userInfo: Record<string, any> }>({
      url: '/sys/user/getUserInfo',
    });
  },
};
