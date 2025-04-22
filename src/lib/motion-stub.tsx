// This is a stub implementation of framer-motion
// It provides empty implementations of the required components and functions
// to prevent errors when framer-motion is not available

import React from 'react';

// AnimatePresence stub
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// motion stub
export const motion = new Proxy(
  {},
  {
    get: function(target, prop) {
      // Return a component that just renders its children
      if (typeof prop === 'string') {
        return React.forwardRef((props: any, ref) => {
          const { children, ...rest } = props;
          // Create the element directly using React.createElement
          return React.createElement(prop, { ...rest, ref }, children);
        });
      }
      return () => null;
    }
  }
) as Record<string, React.ForwardRefExoticComponent<any>>;

// Export other potential functions that might be used
export const useAnimation = () => ({ start: () => Promise.resolve() });
export const useMotionValue = (initial: any) => ({ get: () => initial, set: () => {} });
export const useTransform = () => 0; 