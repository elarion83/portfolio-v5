import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="w-16 h-16 relative">
        <svg width="64" height="64" viewBox="0 0 64 64">
          {/* Hexagon path (very faint outline) */}
          <path
            d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z"
            fill="none"
            stroke="rgba(226, 141, 29, 0.1)"
            strokeWidth="1"
          />
          
          {/* Animated trail */}
          <motion.path
            d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z"
            fill="none"
            stroke="#e28d1d"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ 
              pathLength: 0.4,
              pathOffset: [0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
      </div>
    </div>
  );
};