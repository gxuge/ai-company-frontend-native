export type ApiResult<T = unknown> = {
  code: number;
  success: boolean;
  message: string;
  messageCode?: string;
  errorCode?: string;
  errorCategory?: string;
  retryable?: boolean;
  errorArgs?: Record<string, unknown>;
  result: T;
  timestamp?: number;
};

export type ApiRequestOptions = import('./http-types').RequestOptions;
