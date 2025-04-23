import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { checkAuth } = useAuthStore();
  const isAuthenticated = checkAuth();
  
  // If not authenticated, this would typically redirect in the checkAuth function
  
  return <>{children}</>;
}; 