"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";

export function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Wait for next tick to ensure hydration is complete
    const timeout = setTimeout(() => {
      const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.scrollTop > 100) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      };

      // Find the scrollable container
      const scrollContainer = document.querySelector('.h-\\[calc\\(100vh-4rem\\)\\]');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
      }

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleScrollToTop = () => {
    const scrollContainer = document.querySelector('.h-\\[calc\\(100vh-4rem\\)\\]');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Don't render anything during SSR
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-[9999]"
        >
          <Button
            onClick={handleScrollToTop}
            variant="success"
            size="sm"
            className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <ArrowUp className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Top</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 