import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Custom hook to handle navigation redirects
 * @param {string} currentPath - Current path to check
 * @param {string} redirectTo - Path to redirect to
 * @param {boolean} condition - Additional condition for redirection (optional)
 */
export const useNavigation = (
  currentPath: string,
  redirectTo: string,
  condition: boolean = true
) => {
  const router = useRouter();

  useEffect(() => {
    console.log("Current path:", currentPath);

    // Force the redirect to happen immediately on component mount
    // This is more reliable than checking specific paths
    if (condition) {
      console.log("Redirecting to:", redirectTo);
      router.push(redirectTo);
    }
  }, [redirectTo, condition, router, currentPath]);

  return { navigate: (path: string) => router.push(path) };
};

export default useNavigation;
