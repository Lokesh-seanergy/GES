import { LoginCredentials, SocialProvider, AuthResponse, SocialLoginResponse } from '@/types/auth';

// Simulated email login function
export const loginWithEmail = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // This is a mock implementation. Replace with actual API call.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        redirectUrl: '/dashboard',
      });
    }, 1000);
  });
};

// Simulated social login function
export const loginWithSocialProvider = async (provider: SocialProvider): Promise<SocialLoginResponse> => {
  // This is a mock implementation. Replace with actual social login implementation.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        provider,
        redirectUrl: '/dashboard',
        token: 'mock-token',
      });
    }, 1000);
  });
}; 