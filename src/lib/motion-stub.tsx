// This is a stub implementation of framer-motion
// It provides empty implementations of the required components and functions
// to prevent errors when framer-motion is not available

import React from "react";

interface MotionProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

// AnimatePresence stub
export const AnimatePresence = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

// motion stub
export const motion = new Proxy(
  {},
  {
    get: function (target, prop) {
      // Return a component that just renders its children
      if (typeof prop === "string") {
        const MotionComponent = React.forwardRef<HTMLElement, MotionProps>(
          (props, ref) => {
            const { children, ...rest } = props;
            // Create the element directly using React.createElement
            return React.createElement(
              prop,
              { ...rest, ref },
              children as React.ReactNode
            );
          }
        );
        MotionComponent.displayName = `motion.${prop}`;
        return MotionComponent;
      }
      return () => null;
    },
  }
) as Record<string, React.ForwardRefExoticComponent<MotionProps>>;

// Export other potential functions that might be used
export const useAnimation = () => ({ start: () => Promise.resolve() });
export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: () => {},
});
export const useTransform = () => 0;
