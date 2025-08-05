import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Environment {
  production: boolean;
  environment: string;
  apiUrl: string;
  isLoggingEnabled: boolean;
  enableDebugMode: boolean;
  appVersion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly env: Environment = environment as Environment;

  /**
   * Get the current environment configuration
   */
  get config(): Environment {
    return this.env;
  }

  /**
   * Check if running in production
   */
  get isProduction(): boolean {
    return this.env.production;
  }

  /**
   * Check if running in development
   */
  get isDevelopment(): boolean {
    return this.env.environment === 'development';
  }

  /**
   * Check if running in UAT
   */
  get isUAT(): boolean {
    return this.env.environment === 'uat';
  }

  /**
   * Get the current environment name
   */
  get environmentName(): string {
    return this.env.environment;
  }

  /**
   * Get API base URL
   */
  get apiUrl(): string {
    return this.env.apiUrl;
  }

  /**
   * Check if logging is enabled
   */
  get isLoggingEnabled(): boolean {
    return this.env.isLoggingEnabled;
  }

  /**
   * Check if debug mode is enabled
   */
  get isDebugMode(): boolean {
    return this.env.enableDebugMode;
  }

  /**
   * Get app version
   */
  get appVersion(): string {
    return this.env.appVersion;
  }

  /**
   * Log environment information (only in non-production)
   */
  logEnvironmentInfo(): void {
    if (!this.isProduction && this.isLoggingEnabled) {
      console.group('🌍 Environment Configuration');
      console.log('Environment:', this.environmentName);
      console.log('Version:', this.appVersion);
      console.log('API URL:', this.apiUrl);
      console.log('Debug Mode:', this.isDebugMode);
      console.groupEnd();
    }
  }
}
