import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  language: string;
  timezone: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleNotification: (type: 'email' | 'push' | 'sound') => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        sound: true,
      },
      language: 'en',
      timezone: 'UTC',
      setTheme: (theme) => set({ theme }),
      toggleNotification: (type) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [type]: !state.notifications[type],
          },
        })),
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),
    }),
    {
      name: 'settings-storage',
    }
  )
); 