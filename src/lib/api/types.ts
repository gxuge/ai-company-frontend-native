export type ApiResult<T = unknown> = {
  code: number;
  success: boolean;
  message: string;
  result: T;
  timestamp?: number;
};

export type ApiRequestOptions = import('./http-types').RequestOptions;
