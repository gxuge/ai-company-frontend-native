import Env from 'env';
import { getAccessToken } from '@/lib/auth/utils';
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

const parseErrorDetail = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return response.statusText || 'unknown error';
  }

  try {
    const parsed = JSON.parse(text) as { detail?: string; message?: string };
    return parsed.detail || parsed.message || text;
  }
  catch {
    return text;
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
  catch (error) {
    await wait(250);
    try {
      response = await fetch(buildApiUrl(path), {
        ...restInit,
        headers,
      });
    }
    catch (retryError) {
      throw new Error(
        retryError instanceof Error ? retryError.message : String(retryError),
      );
    }
  }

  if (!response.ok) {
    const detail = await parseErrorDetail(response);
    throw new Error(`Request failed (${response.status} ${response.statusText}): ${detail}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const detail = await parseErrorDetail(response);
    throw new Error(detail);
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
