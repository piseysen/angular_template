import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry, timer, mergeMap, finalize } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorHandlingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  
  return next(req).pipe(
    // Retry logic for failed requests (except for certain status codes)
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Don't retry for client errors (4xx) or authentication errors
        if (error.status >= 400 && error.status < 500) {
          return throwError(() => error);
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.warn(`Retrying request in ${backoffTime}ms (attempt ${retryCount + 1}/3)`);
        return timer(backoffTime);
      }
    }),
    
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      let userMessage = 'Something went wrong. Please try again.';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        userMessage = 'Connection problem. Please check your internet connection.';
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Network Error: Unable to connect to server';
            userMessage = 'Unable to connect to the server. Please check your internet connection.';
            break;
          case 400:
            errorMessage = `Bad Request: ${error.error?.message || 'Invalid request'}`;
            userMessage = error.error?.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized: Authentication required';
            userMessage = 'Your session has expired. Please log in again.';
            // Redirect to login page
            router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'Forbidden: Access denied';
            userMessage = 'You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'Not Found: Resource does not exist';
            userMessage = 'The requested resource was not found.';
            break;
          case 408:
            errorMessage = 'Request Timeout';
            userMessage = 'The request took too long. Please try again.';
            break;
          case 429:
            errorMessage = 'Too Many Requests: Rate limit exceeded';
            userMessage = 'Too many requests. Please wait a moment before trying again.';
            break;
          case 500:
            errorMessage = 'Internal Server Error';
            userMessage = 'Server error. Please try again later.';
            break;
          case 502:
            errorMessage = 'Bad Gateway';
            userMessage = 'Server is temporarily unavailable. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service Unavailable';
            userMessage = 'Service is temporarily unavailable. Please try again later.';
            break;
          case 504:
            errorMessage = 'Gateway Timeout';
            userMessage = 'Server response timeout. Please try again later.';
            break;
          default:
            errorMessage = `Server Error ${error.status}: ${error.statusText}`;
            userMessage = `Server returned an error (${error.status}). Please try again later.`;
        }
      }
      
      console.error('HTTP Error Details:', {
        url: req.url,
        method: req.method,
        status: error.status,
        statusText: error.statusText,
        message: errorMessage,
        error: error.error,
        timestamp: new Date().toISOString()
      });
      
      // Create enhanced error object with user-friendly message
      const enhancedError = new HttpErrorResponse({
        error: {
          ...error.error,
          userMessage,
          originalMessage: error.error?.message,
          timestamp: new Date().toISOString(),
          url: req.url,
          method: req.method
        },
        headers: error.headers,
        status: error.status,
        statusText: error.statusText,
        url: error.url || undefined
      });
      
      return throwError(() => enhancedError);
    })
  );
};
