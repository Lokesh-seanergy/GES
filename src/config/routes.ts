// Define routes without base path
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SHOWS: '/shows',
  EXHIBITS: '/exhibits',
  CUSTOMERS: '/customers',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// Define which routes are public (no auth required)
export const PUBLIC_ROUTES = new Set([
  ROUTES.LOGIN,
]);

// Define which routes require authentication
export const PRIVATE_ROUTES = new Set([
  ROUTES.DASHBOARD,
  ROUTES.SHOWS,
  ROUTES.EXHIBITS,
  ROUTES.CUSTOMERS,
  ROUTES.REPORTS,
  ROUTES.SETTINGS,
]);

// Helper to add base path to routes
export const withBasePath = (path: string) => `/GES${path}`;

export const isPublicRoute = (path: string): boolean => {
  const normalizedPath = path.replace('/GES', '');
  return Array.from(PUBLIC_ROUTES).some(route => normalizedPath === route);
};

export const isPrivateRoute = (path: string): boolean => {
  const normalizedPath = path.replace('/GES', '');
  return Array.from(PRIVATE_ROUTES).some(route => normalizedPath.startsWith(route));
};

// Helper to create redirect URLs
export const createRedirectUrl = (path: string, baseUrl: string): URL => {
  const url = new URL(withBasePath(path), baseUrl);
  return url;
}; 