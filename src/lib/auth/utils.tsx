import { getItem, removeItem, setItem } from '@/lib/storage';

const TOKEN = 'token';

export type TokenType = {
  token: string;
  refreshToken?: string;
  // Backward-compatible fields (legacy shape)
  access?: string;
  refresh?: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

export function resolveAccessToken(token: TokenType | null | undefined) {
  if (!token) {
    return '';
  }
  return token.token || token.access || '';
}

export function getAccessToken() {
  return resolveAccessToken(getToken());
}

export function resolveRefreshToken(token: TokenType | null | undefined) {
  if (!token) {
    return '';
  }
  return token.refreshToken || token.refresh || '';
}

export function getRefreshToken() {
  return resolveRefreshToken(getToken());
}

export function updateAccessToken(nextToken: string) {
  const current = getToken();
  if (!current) {
    setToken({ token: nextToken });
    return;
  }
  setToken({
    ...current,
    token: nextToken,
  });
}

export function updateTokenPair(nextToken: string, nextRefreshToken?: string) {
  const current = getToken();
  setToken({
    ...(current || {}),
    token: nextToken,
    refreshToken: nextRefreshToken || current?.refreshToken || current?.refresh,
  });
}
