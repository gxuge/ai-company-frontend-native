import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResult } from './types';

export type ErrorMessageMode = 'none' | 'message';
export type SuccessMessageMode = 'none' | 'success';

export type RequestOptions = {
  withToken?: boolean;
  isTransformResponse?: boolean;
  isReturnNativeResponse?: boolean;
  errorMessageMode?: ErrorMessageMode;
  successMessageMode?: SuccessMessageMode;
  joinParamsToUrl?: boolean;
  joinTime?: boolean;
};

export type CreateAxiosOptions = AxiosRequestConfig & {
  authenticationScheme?: string;
  requestOptions?: RequestOptions;
  transform?: AxiosTransform;
};

export type ApiRequestConfig = AxiosRequestConfig & {
  requestOptions?: RequestOptions;
  withToken?: boolean;
  _retry?: boolean;
  _refreshRetried?: boolean;
};

export abstract class AxiosTransform {
  beforeRequestHook?: (config: ApiRequestConfig, options: RequestOptions) => ApiRequestConfig;
  transformRequestHook?: (res: AxiosResponse<ApiResult>, options: RequestOptions) => any;
  requestCatchHook?: (error: unknown, options: RequestOptions) => Promise<unknown> | unknown;
  requestInterceptors?: (config: ApiRequestConfig, options: CreateAxiosOptions) => ApiRequestConfig;
  responseInterceptors?: (res: AxiosResponse<ApiResult>) => AxiosResponse<ApiResult>;
  requestInterceptorsCatch?: (error: unknown) => unknown;
  responseInterceptorsCatch?: (error: unknown) => Promise<unknown> | unknown;
}
