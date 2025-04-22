// Microsoft Auth Configuration
export const microsoftConfig = {
  clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '',
  authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID}`,
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  scopes: ['user.read', 'openid', 'profile', 'email']
};

// Google Auth Configuration
export const googleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  scope: 'openid profile email'
};

// Apple Auth Configuration
export const appleConfig = {
  clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  scope: 'name email'
};

export const handleSocialLogin = async (provider: 'microsoft' | 'google' | 'apple') => {
  try {
    let authUrl = '';
    switch (provider) {
      case 'microsoft':
        authUrl = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?` +
          `client_id=${microsoftConfig.clientId}&` +
          `response_type=code&` +
          `redirect_uri=${microsoftConfig.redirectUri}&` +
          `scope=${microsoftConfig.scopes.join(' ')}`;
        break;
      case 'google':
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${googleConfig.clientId}&` +
          `response_type=code&` +
          `redirect_uri=${googleConfig.redirectUri}&` +
          `scope=${googleConfig.scope}`;
        break;
      case 'apple':
        authUrl = `https://appleid.apple.com/auth/authorize?` +
          `client_id=${appleConfig.clientId}&` +
          `redirect_uri=${appleConfig.redirectUri}&` +
          `response_type=code&` +
          `scope=${appleConfig.scope}&` +
          `response_mode=form_post`;
        break;
    }
    window.location.href = authUrl;
  } catch (error) {
    console.error(`${provider} login failed:`, error);
    throw error;
  }
}; 