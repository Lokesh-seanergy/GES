import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSettingsStore } from '@/store/settingsStore';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  language: string;
  timezone: string;
}

// Mock API functions - replace with actual API calls
const fetchSettings = async (): Promise<Settings> => {
  // Simulate API call
  return {
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      sound: true,
    },
    language: 'en',
    timezone: 'UTC',
  };
};

const updateSettings = async (settings: Partial<Settings>): Promise<Settings> => {
  // Simulate API call
  return {
    ...settings,
    theme: settings.theme || 'system',
    notifications: settings.notifications || {
      email: true,
      push: true,
      sound: true,
    },
    language: settings.language || 'en',
    timezone: settings.timezone || 'UTC',
  };
};

export const useSettings = () => {
  const queryClient = useQueryClient();
  const { setTheme, setLanguage, setTimezone } = useSettingsStore();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      // Update local state
      if (data.theme) setTheme(data.theme);
      if (data.language) setLanguage(data.language);
      if (data.timezone) setTimezone(data.timezone);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}; 