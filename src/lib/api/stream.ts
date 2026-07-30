import type { ApiResult } from './types';
import Env from 'env';
import { getAccessToken } from '@/lib/auth/utils';
import { localizeApiError } from '@/lib/i18n/api-message';
import { getLanguage } from '@/lib/i18n/utils';
import { ApiError, toApiError } from './api-error';
import { ConfigEnum, ContentTypeEnum } from './http-enum';

const apiBase = (Env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

export type SseEvent = {
  event: string;
  data: string;
  raw: string;
  id?: string;
  retry?: number;
};

export type StreamRequestOptions = {
  withToken?: boolean;
};

export const buildApiUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
};

const buildRequestHeaders = (initHeaders: HeadersInit | undefined, withToken: boolean) => {
  const headers = new Headers(initHeaders);
  headers.set('Accept-Language', getLanguage());
  headers.set('Content-Type', ContentTypeEnum.JSON);
  headers.set('Accept', 'text/event-stream');
  headers.set(ConfigEnum.VERSION, 'v3');

  if (withToken) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', token);
      headers.set(ConfigEnum.TOKEN, token);
    }
  }

  return headers;
};

const parseErrorResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return localizeApiError(new ApiError(response.statusText || 'Request failed', {
      code: response.status,
    }));
  }

  try {
    const parsed = JSON.parse(text) as Partial<ApiResult> & { detail?: string };
    return localizeApiError(ApiError.fromResult(
      parsed,
      parsed.detail || response.statusText || 'Request failed',
    ));
  }
  catch {
    return localizeApiError(new ApiError(text, { code: response.status }));
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const requestStream = async (
  path: string,
  init?: RequestInit,
  options: StreamRequestOptions = {},
): Promise<ReadableStream<Uint8Array>> => {
  const { withToken = true } = options;
  const { headers: initHeaders, ...restInit } = init ?? {};
  const headers = buildRequestHeaders(initHeaders, withToken);
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...restInit,
      headers,
    });
  }
  catch {
    await wait(250);
    try {
      response = await fetch(buildApiUrl(path), {
        ...restInit,
        headers,
      });
    }
    catch (retryError) {
      throw localizeApiError(toApiError(retryError));
    }
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    throw await parseErrorResponse(response);
  }

  if (!response.body) {
    throw new Error('Streaming response not supported by the browser.');
  }

  return response.body;
};

const parseSseBlock = (block: string): SseEvent | null => {
  const lines = block.replace(/\r\n/g, '\n').split('\n');
  let event = 'message';
  let id: string | undefined;
  let retry: number | undefined;
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line || line.startsWith(':')) {
      continue;
    }

    const separatorIndex = line.indexOf(':');
    const field = separatorIndex >= 0 ? line.slice(0, separatorIndex).trim() : line.trim();
    const value = separatorIndex >= 0 ? line.slice(separatorIndex + 1).replace(/^\s/, '') : '';

    if (field === 'event') {
      event = value || 'message';
      continue;
    }

    if (field === 'data') {
      dataLines.push(value);
      continue;
    }

    if (field === 'id') {
      id = value;
      continue;
    }

    if (field === 'retry') {
      const parsedRetry = Number(value);
      if (Number.isFinite(parsedRetry)) {
        retry = parsedRetry;
      }
    }
  }

  const data = dataLines.join('\n');
  if (!event && !data) {
    return null;
  }

  return {
    event,
    data,
    raw: block,
    id,
    retry,
  };
};

export async function* iterateSseEvents(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SseEvent, void, void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, '\n');

      while (true) {
        const boundaryIndex = buffer.indexOf('\n\n');
        if (boundaryIndex < 0) {
          break;
        }

        const block = buffer.slice(0, boundaryIndex).trim();
        buffer = buffer.slice(boundaryIndex + 2);
        if (!block) {
          continue;
        }

        const event = parseSseBlock(block);
        if (event) {
          yield event;
        }
      }
    }

    const tail = buffer.trim();
    if (tail) {
      const event = parseSseBlock(tail);
      if (event) {
        yield event;
      }
    }
  }
  finally {
    reader.releaseLock();
  }
}
