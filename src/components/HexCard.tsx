import React from 'react';
import { motion } from 'framer-motion';

interface HexCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const HexCard: React.FC<HexCardProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      className={`hex-card ${className}`}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <div className="hex-card-content">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
};