import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { 
  authInterceptor,
  loggingInterceptor,
  errorHandlingInterceptor,
  loadingInterceptor,
  cachingInterceptor,
  timeoutInterceptor
} from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        timeoutInterceptor,      // First: Apply timeouts
        cachingInterceptor,      // Second: Check cache before making requests
        authInterceptor,         // Third: Add authentication headers
        loggingInterceptor,      // Fourth: Log requests and responses
        loadingInterceptor,      // Fifth: Track loading states
        errorHandlingInterceptor // Last: Handle errors and retries
      ])
    ),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    provideAnimationsAsync()
  ]
};
