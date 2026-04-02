import type { AxiosResponse } from 'axios';
import type { ApiRequestConfig, AxiosTransform, CreateAxiosOptions, RequestOptions } from './http-types';
import type { ApiResult } from './types';
import Env from 'env';
import { getAccessToken, getRefreshToken, removeToken, updateTokenPair } from '@/lib/auth/utils';
import { VAxios } from './axios';
import { ConfigEnum, ContentTypeEnum, RequestEnum, ResultEnum } from './http-enum';

type RefreshResult = {
  token: string;
  refreshToken?: string;
};

const REFRESH_URL = '/sys/refreshToken';
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function flushTokenRefresh(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

function buildUrlWithParams(url: string, params: Record<string, unknown>) {
  const parsed = new URL(url, 'http://localhost');
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    parsed.searchParams.set(key, String(value));
  });
  return `${parsed.pathname}${parsed.search}`;
}

function joinTimestamp(url: string, enabled = true) {
  if (!enabled) {
    return url;
  }
  const parsed = new URL(url, 'http://localhost');
  parsed.searchParams.set('_t', Date.now().toString());
  return `${parsed.pathname}${parsed.search}`;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const resp = await fetch(`${Env.EXPO_PUBLIC_API_URL}${REFRESH_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!resp.ok) {
    throw new Error(`refresh token request failed (${resp.status})`);
  }
  const data = (await resp.json()) as ApiResult<RefreshResult>;
  const ok = data?.success || data?.code === ResultEnum.SUCCESS || data?.code === ResultEnum.HTTP_SUCCESS;
  if (!ok || !data?.result?.token) {
    throw new Error(data?.message || 'refresh token failed');
  }
  updateTokenPair(data.result.token, data.result.refreshToken || refreshToken);
  return data.result.token;
}

const transform: AxiosTransform = {
  transformRequestHook: (res: AxiosResponse<ApiResult>, options: RequestOptions) => {
    const { isReturnNativeResponse, isTransformResponse, successMessageMode } = options;
    if (isReturnNativeResponse) {
      return res;
    }
    if (!isTransformResponse) {
      return res.data;
    }

    const { code, result, message, success } = res.data || {};
    const hasSuccess = success || code === ResultEnum.SUCCESS || code === ResultEnum.HTTP_SUCCESS;
    if (hasSuccess) {
      if (successMessageMode === 'success' && message) {
        console.log(message);
      }
      return result;
    }
    throw new Error(message || 'Request failed');
  },

  beforeRequestHook: (config: ApiRequestConfig, options: RequestOptions) => {
    const next = { ...config };
    const requestUrl = next.url || '';
    const joinTime = options.joinTime !== false;

    if (next.method?.toUpperCase() === RequestEnum.GET) {
      if (typeof next.params === 'string') {
        next.url = joinTimestamp(`${requestUrl}${next.params}`, joinTime);
        next.params = undefined;
      }
      else {
        next.url = joinTimestamp(requestUrl, joinTime);
      }
    }
    else if (options.joinParamsToUrl && next.params && typeof next.params === 'object') {
      next.url = buildUrlWithParams(requestUrl, next.params as Record<string, unknown>);
      next.params = undefined;
    }

    return next;
  },

  requestInterceptors: (config: ApiRequestConfig, options: CreateAxiosOptions) => {
    const next = { ...config };
    const shouldAttachToken = config.withToken ?? config.requestOptions?.withToken ?? true;
    const token = getAccessToken();
    next.headers = next.headers || {};
    next.headers[ConfigEnum.VERSION] = 'v3';
    if (shouldAttachToken && token) {
      next.headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
      next.headers[ConfigEnum.TOKEN] = token;
    }
    return next;
  },

  responseInterceptors: res => res,

  responseInterceptorsCatch: async (error: any) => {
    const status = error?.response?.status;
    const originalRequest = error?.config as ApiRequestConfig | undefined;
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    const isRefreshRequest = (originalRequest.url || '').includes(REFRESH_URL);
    if (!refreshToken || isRefreshRequest || originalRequest._refreshRetried) {
      removeToken();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = token;
          originalRequest.headers[ConfigEnum.TOKEN] = token;
          resolve(defHttp.getAxios().request(originalRequest));
        });
      });
    }

    originalRequest._refreshRetried = true;
    isRefreshing = true;
    try {
      const token = await refreshAccessToken();
      flushTokenRefresh(token);
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = token;
      originalRequest.headers[ConfigEnum.TOKEN] = token;
      return defHttp.getAxios().request(originalRequest);
    }
    catch (refreshError) {
      removeToken();
      return Promise.reject(refreshError);
    }
    finally {
      isRefreshing = false;
    }
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  const options: CreateAxiosOptions = {
    authenticationScheme: '',
    timeout: 10_000,
    baseURL: Env.EXPO_PUBLIC_API_URL,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    transform,
    requestOptions: {
      isReturnNativeResponse: false,
      isTransformResponse: true,
      joinParamsToUrl: false,
      joinTime: true,
      errorMessageMode: 'message',
      successMessageMode: 'none',
      withToken: true,
    },
    ...(opt || {}),
  };
  return new VAxios(options);
}

export const defHttp = createAxios();
