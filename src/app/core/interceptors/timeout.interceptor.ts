import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpContextToken } from '@angular/common/http';
import { Observable, timeout, TimeoutError } from 'rxjs';
import { catchError, throwError } from 'rxjs';

// Context token to control timeout behavior
export const REQUEST_TIMEOUT = new HttpContextToken<number>(() => 30000); // 30 seconds default

export const timeoutInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const timeoutDuration = req.context.get(REQUEST_TIMEOUT);
  
  return next(req).pipe(
    timeout(timeoutDuration),
    catchError(error => {
      if (error instanceof TimeoutError) {
        console.error(`Request timeout after ${timeoutDuration}ms: ${req.method} ${req.url}`);
        return throwError(() => new Error(`Request timeout after ${timeoutDuration}ms`));
      }
      return throwError(() => error);
    })
  );
};
