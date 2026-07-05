"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, X } from "lucide-react";

interface CloudGuideProps {
  message: string;
  position?: "left" | "right";
}

export const CloudGuide: React.FC<CloudGuideProps> = ({ message, position = "right" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDismissed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setIsVisible(true), 600);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isDismissed]);

  useEffect(() => {
    if (isVisible && !isDismissed) {
      const autoHide = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(autoHide);
    }
  }, [isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const positionClass = position === "left" ? "left-4 md:left-8" : "right-4 md:right-8";

  return (
    <div ref={ref} className={`absolute top-6 ${positionClass} z-30`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-[260px]"
          >
            {/* Cloud bubble */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 relative">
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Dismiss guide"
              >
                <X size={12} className="text-gray-500" />
              </button>
              <div className="flex items-start gap-2.5">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#4996D2] rounded-full flex items-center justify-center"
                >
                  <Cloud size={16} className="text-white" />
                </motion.div>
                <p className="text-sm text-[#5B7186] leading-relaxed">{message}</p>
              </div>
            </div>
            {/* Tail */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
