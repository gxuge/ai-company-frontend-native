import type { ApiResult } from './types';

type ApiErrorInit = {
  code?: number;
  errorCode?: string;
  errorCategory?: string;
  retryable?: boolean;
  errorArgs?: Record<string, unknown>;
  cause?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function readArgs(value: unknown) {
  return isRecord(value) ? value : undefined;
}

export class ApiError extends Error {
  readonly code?: number;
  readonly errorCode?: string;
  readonly errorCategory?: string;
  readonly retryable?: boolean;
  readonly errorArgs?: Record<string, unknown>;

  constructor(message: string, init: ApiErrorInit = {}) {
    super(message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = 'ApiError';
    this.code = init.code;
    this.errorCode = init.errorCode;
    this.errorCategory = init.errorCategory;
    this.retryable = init.retryable;
    this.errorArgs = init.errorArgs;
  }

  static fromResult(result: Partial<ApiResult>, fallback = 'Request failed') {
    return new ApiError(readString(result.message) || fallback, {
      code: readNumber(result.code),
      errorCode: readString(result.errorCode),
      errorCategory: readString(result.errorCategory),
      retryable: readBoolean(result.retryable),
      errorArgs: readArgs(result.errorArgs),
    });
  }
}

function readResponseData(error: unknown) {
  if (!isRecord(error)) {
    return undefined;
  }
  const response = isRecord(error.response) ? error.response : undefined;
  return response?.data;
}

export function toApiError(error: unknown, fallback = 'Request failed') {
  if (error instanceof ApiError) {
    return error;
  }

  const responseData = readResponseData(error);
  if (isRecord(responseData)) {
    return ApiError.fromResult(responseData as Partial<ApiResult>, fallback);
  }

  if (isRecord(error) && (
    readString(error.errorCode)
    || readString(error.errorCategory)
    || readBoolean(error.retryable) !== undefined
  )) {
    return new ApiError(readString(error.message) || fallback, {
      code: readNumber(error.code),
      errorCode: readString(error.errorCode),
      errorCategory: readString(error.errorCategory),
      retryable: readBoolean(error.retryable),
      errorArgs: readArgs(error.errorArgs),
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || fallback, { cause: error });
  }

  return new ApiError(readString(error) || fallback, { cause: error });
}
