import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly requestCount = signal(0);
  
  readonly isLoading = this.requestCount.asReadonly();
  readonly hasActiveRequests = () => this.requestCount() > 0;
  
  addRequest(): void {
    this.requestCount.update(count => count + 1);
  }
  
  removeRequest(): void {
    this.requestCount.update(count => Math.max(0, count - 1));
  }
  
  reset(): void {
    this.requestCount.set(0);
  }
}

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);
  
  // Skip loading indicator for certain requests (like polling or background requests)
  const skipLoading = req.headers.get('X-Skip-Loading') === 'true';
  
  if (!skipLoading) {
    loadingService.addRequest();
  }
  
  return next(req).pipe(
    tap({
      next: (event) => {
        // Optional: You can add specific handling for different event types
        if (event.type === HttpEventType.Response) {
          console.log(`Request completed: ${req.method} ${req.url}`);
        }
      }
    }),
    finalize(() => {
      if (!skipLoading) {
        loadingService.removeRequest();
      }
    })
  );
};
