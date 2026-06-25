const CHAT_AUDIO_CACHE_NAME = 'chat-tts-audio-v1';
const CHAT_AUDIO_CACHE_META_KEY = 'chat-tts-audio-meta-v1';
const CHAT_AUDIO_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CHAT_AUDIO_CACHE_MAX_ENTRIES = 80;

type ChatAudioCacheMetaItem = {
  entryUrl: string;
  expiresAt: number;
  lastAccessedAt: number;
  size?: number;
};

type ChatAudioCacheMeta = Record<string, ChatAudioCacheMetaItem>;

type ChatAudioMemoryItem = {
  objectUrl: string;
  expiresAt: number;
  lastAccessedAt: number;
};

const memoryCache = new Map<string, ChatAudioMemoryItem>();
const inFlightCache = new Map<string, Promise<string>>();

function isCacheSupported() {
  return typeof window !== 'undefined'
    && 'caches' in window
    && typeof URL !== 'undefined'
    && typeof URL.createObjectURL === 'function';
}

function buildCacheEntryUrl(cacheKey: string) {
  return `https://chat-tts-cache.local/${encodeURIComponent(cacheKey)}`;
}

function readCacheMeta(): ChatAudioCacheMeta {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(CHAT_AUDIO_CACHE_META_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as ChatAudioCacheMeta;
    return parsed && typeof parsed === 'object' ? parsed : {};
  }
  catch {
    return {};
  }
}

function writeCacheMeta(meta: ChatAudioCacheMeta) {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CHAT_AUDIO_CACHE_META_KEY, JSON.stringify(meta));
  }
  catch {
    // Ignore cache metadata write failures and keep runtime flow available.
  }
}

function revokeObjectUrl(item?: ChatAudioMemoryItem) {
  if (!item?.objectUrl || typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
    return;
  }
  try {
    URL.revokeObjectURL(item.objectUrl);
  }
  catch {
    // Ignore object URL revoke failures.
  }
}

async function deletePersistentCacheEntry(entryUrl: string) {
  if (!isCacheSupported()) {
    return;
  }
  try {
    const cache = await window.caches.open(CHAT_AUDIO_CACHE_NAME);
    await cache.delete(entryUrl);
  }
  catch {
    // Ignore persistent cache delete failures.
  }
}

async function removeCacheEntry(cacheKey: string, meta?: ChatAudioCacheMeta) {
  const sourceMeta = meta ?? readCacheMeta();
  const target = sourceMeta[cacheKey];
  if (target) {
    delete sourceMeta[cacheKey];
    writeCacheMeta(sourceMeta);
    await deletePersistentCacheEntry(target.entryUrl);
  }
  const memoryItem = memoryCache.get(cacheKey);
  if (memoryItem) {
    revokeObjectUrl(memoryItem);
    memoryCache.delete(cacheKey);
  }
}

async function trimCache(meta: ChatAudioCacheMeta) {
  const keys = Object.keys(meta);
  if (keys.length <= CHAT_AUDIO_CACHE_MAX_ENTRIES) {
    return;
  }
  const overflowKeys = keys
    .sort((left, right) => {
      const leftTime = meta[left]?.lastAccessedAt ?? 0;
      const rightTime = meta[right]?.lastAccessedAt ?? 0;
      return leftTime - rightTime;
    })
    .slice(0, keys.length - CHAT_AUDIO_CACHE_MAX_ENTRIES);

  for (const cacheKey of overflowKeys) {
    await removeCacheEntry(cacheKey, meta);
  }
}

async function cleanupExpiredCache() {
  const now = Date.now();
  const meta = readCacheMeta();
  const expiredKeys = Object.keys(meta).filter(cacheKey => (meta[cacheKey]?.expiresAt ?? 0) <= now);
  for (const cacheKey of expiredKeys) {
    await removeCacheEntry(cacheKey, meta);
  }

  for (const [cacheKey, item] of memoryCache.entries()) {
    if (item.expiresAt <= now) {
      revokeObjectUrl(item);
      memoryCache.delete(cacheKey);
    }
  }

  await trimCache(meta);
}

async function saveBlobToCache(params: {
  cacheKey: string;
  blob: Blob;
  expiresAt: number;
}) {
  const { cacheKey, blob, expiresAt } = params;
  const objectUrl = URL.createObjectURL(blob);
  const lastAccessedAt = Date.now();
  const previousMemory = memoryCache.get(cacheKey);
  if (previousMemory) {
    revokeObjectUrl(previousMemory);
  }
  memoryCache.set(cacheKey, {
    objectUrl,
    expiresAt,
    lastAccessedAt,
  });

  if (isCacheSupported()) {
    try {
      const entryUrl = buildCacheEntryUrl(cacheKey);
      const cache = await window.caches.open(CHAT_AUDIO_CACHE_NAME);
      await cache.put(entryUrl, new Response(blob));
      const meta = readCacheMeta();
      meta[cacheKey] = {
        entryUrl,
        expiresAt,
        lastAccessedAt,
        size: blob.size,
      };
      writeCacheMeta(meta);
      await trimCache(meta);
    }
    catch {
      // Ignore persistent cache failures, in-memory cache still works.
    }
  }

  return objectUrl;
}

function touchMeta(cacheKey: string, metaItem?: ChatAudioCacheMetaItem) {
  if (!metaItem) {
    return;
  }
  const meta = readCacheMeta();
  if (!meta[cacheKey]) {
    return;
  }
  meta[cacheKey] = {
    ...meta[cacheKey],
    lastAccessedAt: Date.now(),
  };
  writeCacheMeta(meta);
}

export async function getCachedChatAudioObjectUrl(cacheKey?: string | null) {
  if (!cacheKey) {
    return null;
  }

  await cleanupExpiredCache();

  const now = Date.now();
  const memoryItem = memoryCache.get(cacheKey);
  if (memoryItem && memoryItem.expiresAt > now) {
    memoryItem.lastAccessedAt = now;
    memoryCache.set(cacheKey, memoryItem);
    touchMeta(cacheKey, readCacheMeta()[cacheKey]);
    return memoryItem.objectUrl;
  }
  if (memoryItem) {
    revokeObjectUrl(memoryItem);
    memoryCache.delete(cacheKey);
  }

  if (!isCacheSupported()) {
    return null;
  }

  const meta = readCacheMeta();
  const metaItem = meta[cacheKey];
  if (!metaItem) {
    return null;
  }
  if (metaItem.expiresAt <= now) {
    await removeCacheEntry(cacheKey, meta);
    return null;
  }

  try {
    const cache = await window.caches.open(CHAT_AUDIO_CACHE_NAME);
    const response = await cache.match(metaItem.entryUrl);
    if (!response) {
      await removeCacheEntry(cacheKey, meta);
      return null;
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    memoryCache.set(cacheKey, {
      objectUrl,
      expiresAt: metaItem.expiresAt,
      lastAccessedAt: now,
    });
    touchMeta(cacheKey, metaItem);
    return objectUrl;
  }
  catch {
    return null;
  }
}

export async function primeChatAudioCache(cacheKey?: string | null, audioUrl?: string | null) {
  if (!cacheKey || !audioUrl || typeof fetch !== 'function' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return null;
  }

  const cachedObjectUrl = await getCachedChatAudioObjectUrl(cacheKey);
  if (cachedObjectUrl) {
    return cachedObjectUrl;
  }

  const inFlightTask = inFlightCache.get(cacheKey);
  if (inFlightTask) {
    return inFlightTask;
  }

  const task = (async () => {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error('语音缓存下载失败');
    }
    const blob = await response.blob();
    return saveBlobToCache({
      cacheKey,
      blob,
      expiresAt: Date.now() + CHAT_AUDIO_CACHE_TTL_MS,
    });
  })().finally(() => {
    inFlightCache.delete(cacheKey);
  });

  inFlightCache.set(cacheKey, task);
  return task;
}

