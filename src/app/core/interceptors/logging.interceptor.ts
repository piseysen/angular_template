import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const started = Date.now();
  
  console.group(`HTTP Request: ${req.method} ${req.url}`);
  console.log('Request Details:', {
    method: req.method,
    url: req.url,
    headers: req.headers.keys().length > 0 ? req.headers.keys().reduce((acc, key) => {
      acc[key] = req.headers.get(key);
      return acc;
    }, {} as any) : {},
    body: req.body
  });
  
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          const elapsed = Date.now() - started;
          const status = event.status;
          const statusText = event.statusText;
          
          console.log(`Response received in ${elapsed}ms:`, {
            status: `${status} ${statusText}`,
            headers: event.headers.keys().length > 0 ? event.headers.keys().reduce((acc, key) => {
              acc[key] = event.headers.get(key);
              return acc;
            }, {} as any) : {},
            body: event.body,
            redirected: (event as any).redirected || false,
            url: event.url
          });
          
          // Color code based on status
          const color = status >= 200 && status < 300 ? '✅' : 
                       status >= 400 && status < 500 ? '⚠️' : 
                       status >= 500 ? '❌' : '🔄';
          
          console.log(`${color} Status: ${status} ${statusText}`);
        }
      },
      error: (error) => {
        const elapsed = Date.now() - started;
        console.error(`Request failed after ${elapsed}ms:`, {
          error: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
      },
      complete: () => {
        console.groupEnd();
      }
    })
  );
};
