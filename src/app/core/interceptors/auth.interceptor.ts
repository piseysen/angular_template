import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Inject the AuthService to get authentication tokens
  const authService = inject(AuthService);
  
  // Skip authentication for certain URLs (login, register, public APIs)
  const skipUrls = ['/auth/login', '/auth/register', 'dummyjson.com'];
  const shouldSkipAuth = skipUrls.some(url => req.url.includes(url));
  
  if (shouldSkipAuth) {
    return next(req);
  }

  // Get the authentication token
  const authToken = authService.getToken();
  
  if (authToken) {
    // Clone the request to add the authentication header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    
    return next(authReq);
  }
  
  // If no token available, proceed without authentication header
  return next(req);
};
