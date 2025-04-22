import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/routes';

export const useAuthProtection = (shouldBeAuthenticated = true) => {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const isAuthenticated = checkAuth();

    if (shouldBeAuthenticated && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    } else if (!shouldBeAuthenticated && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [router, checkAuth, shouldBeAuthenticated]);
}; 