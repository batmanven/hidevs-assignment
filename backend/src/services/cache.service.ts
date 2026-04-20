import NodeCache from 'node-cache'

class CacheService {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300,
      checkperiod: 320,
      useClones: false
    })
  }

  set(key: string, value: any, ttl?: number): boolean {
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl)
    }
    return this.cache.set(key, value)
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }

  del(key: string): number {
    return this.cache.del(key)
  }

  flushAll(): void {
    this.cache.flushAll()
  }

  getStats(): any {
    return this.cache.getStats()
  }

  keys(): string[] {
    return this.cache.keys()
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }
}

export const cacheService = new CacheService()
