import type { AxiosRequestConfig } from 'axios';
import type { RequestOptions } from './http-types';
import { defHttp } from './def-http';

export function request<T = unknown>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
  return defHttp.request<T>(config, options);
}
