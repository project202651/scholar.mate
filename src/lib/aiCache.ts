// Client-side and server-side lightweight LRU Cache for instant zero-latency AI responses

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiryMs: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const MAX_MEMORY_ITEMS = 300;
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function getCachedAI<T = any>(key: string): T | null {
  const mem = memoryCache.get(key);
  if (mem) {
    if (Date.now() - mem.timestamp < mem.expiryMs) {
      return mem.data;
    }
    memoryCache.delete(key);
  }

  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem('sm_cache_' + key);
      if (item) {
        const parsed: CacheEntry<T> = JSON.parse(item);
        if (Date.now() - parsed.timestamp < parsed.expiryMs) {
          memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          localStorage.removeItem('sm_cache_' + key);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  return null;
}

export function setCachedAI<T = any>(key: string, data: T, expiryMs = DEFAULT_TTL_MS): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    expiryMs,
  };

  if (memoryCache.size >= MAX_MEMORY_ITEMS) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }
  memoryCache.set(key, entry);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sm_cache_' + key, JSON.stringify(entry));
    } catch {
      // Storage might be full, ignore
    }
  }
}

// Aliases for blueprint compliance
export const getCachedAIResponse = getCachedAI;
export const setCachedAIResponse = setCachedAI;

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}
