// This is a stub implementation of framer-motion
// It provides empty implementations of the required components and functions
// to prevent errors when framer-motion is not available

import React from 'react';

interface MotionProps {
  children: React.ReactNode;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  variants?: Record<string, unknown>;
}

export const motion = {
  div: React.forwardRef<HTMLDivElement, MotionProps>((props, ref) => {
    return <div ref={ref} {...props} />;
  }),
  span: React.forwardRef<HTMLSpanElement, MotionProps>((props, ref) => {
    return <span ref={ref} {...props} />;
  }),
  button: React.forwardRef<HTMLButtonElement, MotionProps>((props, ref) => {
    return <button ref={ref} {...props} />;
  }),
};

motion.div.displayName = 'MotionDiv';
motion.span.displayName = 'MotionSpan';
motion.button.displayName = 'MotionButton';

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

AnimatePresence.displayName = 'AnimatePresence';

// Export other potential functions that might be used
export const useAnimation = () => ({ start: () => Promise.resolve() });
export const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} });
export const useTransform = () => 0; 