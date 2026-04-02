import type { AxiosResponse } from 'axios';
import type { ApiRequestConfig, CreateAxiosOptions, RequestOptions } from './http-types';
import type { ApiResult } from './types';
import axios from 'axios';
import { client } from './client';

export class VAxios {
  private axiosInstance = client;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.setupInterceptors();
  }

  getAxios() {
    return this.axiosInstance;
  }

  private getTransform() {
    return this.options.transform;
  }

  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const next = config as ApiRequestConfig;
        if (requestInterceptors) {
          return requestInterceptors(next, this.options);
        }
        return next;
      },
      requestInterceptorsCatch ? error => requestInterceptorsCatch(error) : undefined,
    );

    this.axiosInstance.interceptors.response.use(
      response => (responseInterceptors ? responseInterceptors(response as AxiosResponse<ApiResult>) : response),
      responseInterceptorsCatch ? error => responseInterceptorsCatch(error) : undefined,
    );
  }

  get<T = unknown>(config: ApiRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T = unknown>(config: ApiRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T = unknown>(config: ApiRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T = unknown>(config: ApiRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  request<T = unknown>(config: ApiRequestConfig, options?: RequestOptions): Promise<T> {
    const transform = this.getTransform();
    const requestOptions: RequestOptions = {
      ...(this.options.requestOptions || {}),
      ...(options || {}),
    };

    const withHooksConfig
      = transform?.beforeRequestHook
        ? transform.beforeRequestHook({ ...config, requestOptions }, requestOptions)
        : ({ ...config, requestOptions } as ApiRequestConfig);

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<ApiResult, AxiosResponse<ApiResult>>(withHooksConfig)
        .then((response) => {
          try {
            if (transform?.transformRequestHook) {
              resolve(transform.transformRequestHook(response, requestOptions));
            }
            else {
              resolve(response.data as T);
            }
          }
          catch (error) {
            reject(error);
          }
        })
        .catch(async (error) => {
          try {
            if (transform?.requestCatchHook) {
              const next = await transform.requestCatchHook(error, requestOptions);
              reject(next);
              return;
            }
            if (axios.isAxiosError(error)) {
              reject(error);
              return;
            }
            reject(error);
          }
          catch (hookError) {
            reject(hookError);
          }
        });
    });
  }
}
