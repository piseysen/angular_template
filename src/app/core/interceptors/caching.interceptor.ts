import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpEventType, HttpContextToken } from '@angular/common/http';
import { Observable, of, tap, shareReplay } from 'rxjs';
import { inject, Injectable } from '@angular/core';

// Context token to control caching behavior
export const CACHEABLE = new HttpContextToken<boolean>(() => false);
export const CACHE_TTL = new HttpContextToken<number>(() => 300000); // 5 minutes default

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
  ttl: number;
}

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private cache = new Map<string, CacheEntry>();
  
  get(key: string): HttpResponse<any> | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.response;
  }
  
  set(key: string, response: HttpResponse<any>, ttl: number): void {
    const entry: CacheEntry = {
      response: response.clone(),
      timestamp: Date.now(),
      ttl
    };
    
    this.cache.set(key, entry);
    
    // Cleanup old entries periodically
    if (this.cache.size > 50) {
      this.cleanupExpiredEntries();
    }
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.cache.delete(key));
  }
}

export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cacheService = inject(HttpCacheService);
  
  // Only cache GET requests that are explicitly marked as cacheable
  const isCacheable = req.context.get(CACHEABLE) && req.method === 'GET';
  
  if (!isCacheable) {
    return next(req);
  }
  
  // Create cache key from URL and query parameters
  const cacheKey = `${req.method}:${req.urlWithParams}`;
  
  // Check if we have a cached response
  const cachedResponse = cacheService.get(cacheKey);
  if (cachedResponse) {
    console.log(`Cache hit for ${req.url}`);
    return of(cachedResponse);
  }
  
  console.log(`Cache miss for ${req.url} - fetching from server`);
  
  // Make the request and cache the response
  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response && event instanceof HttpResponse) {
        const ttl = req.context.get(CACHE_TTL);
        cacheService.set(cacheKey, event, ttl);
        console.log(`💾 Cached response for ${req.url} (TTL: ${ttl}ms)`);
      }
    })
  );
};
