// Rate limiting configuration
export const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
export const MAX_ATTEMPTS = 5;

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
}

// Store rate limit data in memory (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if an action should be rate limited
 * @param identifier Unique identifier for the action (e.g., IP address or user ID)
 * @returns boolean indicating if the action should be blocked
 */
export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    rateLimitStore.set(identifier, { attempts: 1, firstAttempt: now });
    return false;
  }

  // Reset if outside window
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { attempts: 1, firstAttempt: now });
    return false;
  }

  // Increment attempts
  entry.attempts += 1;
  rateLimitStore.set(identifier, entry);

  // Check if over limit
  return entry.attempts > MAX_ATTEMPTS;
};

/**
 * Reset rate limit for an identifier
 * @param identifier Unique identifier to reset
 */
export const resetRateLimit = (identifier: string): void => {
  rateLimitStore.delete(identifier);
};

/**
 * Get remaining attempts for an identifier
 * @param identifier Unique identifier to check
 * @returns number of remaining attempts
 */
export const getRemainingAttempts = (identifier: string): number => {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return MAX_ATTEMPTS;
  
  const now = Date.now();
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.delete(identifier);
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - entry.attempts);
};

/**
 * Enhanced password validation
 * @param password Password to validate
 * @returns Object containing validation result and any error messages
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if browser features required for security are available
 * @returns Object containing check results
 */
export const checkSecurityFeatures = (): { 
  cookiesEnabled: boolean;
  localStorageAvailable: boolean;
  secureContextAvailable: boolean;
} => {
  return {
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    secureContextAvailable: window.isSecureContext
  };
};

/**
 * Sanitize user input to prevent XSS
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Log security events
 * @param event Event details
 */
export const logSecurityEvent = (event: {
  type: 'auth' | 'rate-limit' | 'security-check';
  status: 'success' | 'failure';
  details: string;
  identifier?: string;
}): void => {
  // In production, send to logging service
  console.log(`[Security Event] ${event.type}: ${event.status}`, {
    timestamp: new Date().toISOString(),
    ...event
  });
}; 