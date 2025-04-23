import { create } from 'zustand'
import Cookies from 'js-cookie'

interface AuthStore {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

// Initialize the state from cookies if available
const getInitialState = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false, token: null };
  const token = Cookies.get('auth-token');
  // Only consider authenticated if token exists and is valid
  return {
    isAuthenticated: !!token && token.length > 0,
    token: token || null
  };
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...getInitialState(),
  login: (token: string) => {
    if (!token) return;
    // Set cookie with appropriate options
    Cookies.set('auth-token', token, {
      expires: 7, // expires in 7 days
      path: '/',
      sameSite: 'strict'
    });
    set({ isAuthenticated: true, token });
  },
  logout: () => {
    // First, remove the cookie
    Cookies.remove('auth-token', { path: '/' });
    
    // Then clear the state
    set({ isAuthenticated: false, token: null });
    
    // Finally, redirect to login page
    window.location.replace('/ges-workbench/login');
  },
  checkAuth: () => {
    const token = Cookies.get('auth-token');
    const isAuthenticated = !!token && token.length > 0;
    set({ isAuthenticated, token: token || null });
    return isAuthenticated;
  }
})) 