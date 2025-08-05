export interface Environment {
  production: boolean;
  environment: string;
  apiUrl: string;
  isLoggingEnabled: boolean;
  enableDebugMode: boolean;
  appVersion: string;
}