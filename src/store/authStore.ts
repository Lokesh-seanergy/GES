import { create } from 'zustand'
import Cookies from 'js-cookie'
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';

interface UserProfile {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthStore {
  isAuthenticated: boolean;
  token: string | null;
  userProfile: UserProfile | null;
  login: (token: string, userProfile?: UserProfile) => void;
  logout: () => void;
  checkAuth: () => boolean;
  updateUserProfile: (profile: UserProfile) => void;
}

// Initialize the state from cookies if available
const getInitialState = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false, token: null, userProfile: null };
  const token = Cookies.get('auth-token');
  
  // Try to get user profile from cookie
  let userProfile = null;
  try {
    const profileStr = Cookies.get('user-profile');
    if (profileStr) {
      userProfile = JSON.parse(profileStr);
    }
  } catch (e) {
    console.error('Error parsing user profile from cookie', e);
  }
  
  // Only consider authenticated if token exists and is valid
  return {
    isAuthenticated: !!token && token.length > 0,
    token: token || null,
    userProfile
  };
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...getInitialState(),
  login: (token: string, userProfile?: UserProfile) => {
    if (!token) return;
    
    // Set auth token cookie
    Cookies.set('auth-token', token, {
      expires: 7, // expires in 7 days
      path: '/',
      sameSite: 'strict'
    });
    
    // Set user profile cookie if provided
    if (userProfile) {
      Cookies.set('user-profile', JSON.stringify(userProfile), {
        expires: 7,
        path: '/',
        sameSite: 'strict'
      });
    }
    
    set({ isAuthenticated: true, token, userProfile: userProfile || null });
  },
  logout: async () => {
    try {
      // Sign out from Firebase Auth to clear Google credentials
      await signOut(auth);
      
      // Remove the cookies
    Cookies.remove('auth-token', { path: '/' });
      Cookies.remove('user-profile', { path: '/' });
    
      // Clear the local state
      set({ isAuthenticated: false, token: null, userProfile: null });
    
      // Clear any other session data (if any)
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.replace('/ges-workbench/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // If there's an error, still try to clean up as much as possible
      Cookies.remove('auth-token', { path: '/' });
      Cookies.remove('user-profile', { path: '/' });
      set({ isAuthenticated: false, token: null, userProfile: null });
    window.location.replace('/ges-workbench/login');
    }
  },
  checkAuth: () => {
    const token = Cookies.get('auth-token');
    const isAuthenticated = !!token && token.length > 0;
    
    // Update user profile if available
    let userProfile = null;
    try {
      const profileStr = Cookies.get('user-profile');
      if (profileStr) {
        userProfile = JSON.parse(profileStr);
      }
    } catch (e) {
      console.error('Error parsing user profile from cookie', e);
    }
    
    set({ isAuthenticated, token: token || null, userProfile });
    return isAuthenticated;
  },
  updateUserProfile: (profile: UserProfile) => {
    Cookies.set('user-profile', JSON.stringify(profile), {
      expires: 7,
      path: '/',
      sameSite: 'strict'
    });
    
    set({ userProfile: profile });
  }
})) 