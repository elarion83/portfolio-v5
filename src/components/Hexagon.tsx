import React from 'react';
import { motion } from 'framer-motion';

interface HexagonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  backgroundImage?: string;
}

export const Hexagon: React.FC<HexagonProps> = ({ 
  children, 
  className = '', 
  onClick, 
  isActive,
  backgroundImage 
}) => {
  return (
    <motion.div
      className={`relative w-16 md:w-24 h-20 md:h-28 cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
    >
      <div 
        className={`hexagon-shape absolute inset-0 bg-gradient-to-br from-primary to-secondary 
          transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-90'}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};