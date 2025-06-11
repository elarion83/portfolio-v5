'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface CommentSuccessAnimationProps {
  onComplete: () => void;
}

export function CommentSuccessAnimation({ onComplete }: CommentSuccessAnimationProps) {
  const { language } = useLanguage();

  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#261939]/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, times: [0, 0.8, 1] }}
          className="relative mb-8"
        >
          {/* Outer circle */}
          <svg width="120" height="120" viewBox="0 0 120 120">
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e28d1d"
              strokeWidth="2"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: -90 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>

          {/* Icon container */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MessageSquare className="w-12 h-12 text-[#e28d1d]" />
          </motion.div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#e28d1d] rounded-full"
              initial={{ 
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                y: Math.sin(i * 45 * Math.PI / 180) * 60,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1,
                delay: 0.2,
                repeat: 1,
                repeatDelay: 0.5
              }}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            {language === 'fr' ? 'Commentaire publié !' : 'Comment posted!'}
          </h3>
          <p className="text-gray-300">
            {language === 'fr' ? 'Merci pour votre contribution' : 'Thank you for your contribution'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
} 