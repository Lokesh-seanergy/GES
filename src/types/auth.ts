export type SocialProvider = 'google' | 'apple' | 'microsoft';

export interface LoginCredentials {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  redirectUrl?: string;
}

export interface SocialLoginResponse extends AuthResponse {
  provider: SocialProvider;
  token?: string;
} 