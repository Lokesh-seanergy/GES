import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useMsalAuth = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  const handleMicrosoftLogin = () => {
    // Just login with a dummy token and redirect to dashboard
    login('dummy-token');
    router.push('/ges-workbench/dashboard');
  };

  return {
    handleMicrosoftLogin,
  };
}; 