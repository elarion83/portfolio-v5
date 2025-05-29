import React from 'react';
import { motion } from 'framer-motion';

export const HexBackground: React.FC = () => {
  return (
    <>
      <div className="hexagon-grid" />
      <div className="hexagon-pattern" />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(226, 141, 29, 0.1), transparent 70%)',
            'radial-gradient(circle at 70% 70%, rgba(226, 141, 29, 0.1), transparent 70%)',
            'radial-gradient(circle at 30% 30%, rgba(226, 141, 29, 0.1), transparent 70%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </>
  );
};