import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { checkAuth } = useAuthStore();
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return null; // or return a loading state or redirect component
  }

  return <>{children}</>;
};
