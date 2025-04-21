import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, checkAuth]);

  return <>{children}</>;
}; 