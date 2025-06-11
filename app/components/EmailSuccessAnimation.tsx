'use client'

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EmailSuccessAnimationProps {
  onComplete: () => void;
}

export function EmailSuccessAnimation({ onComplete }: EmailSuccessAnimationProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 text-green-500"
        >
          <CheckCircle className="w-full h-full" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {language === 'fr' ? 'Message envoyé !' : 'Message sent!'}
        </h3>
        <p className="text-gray-400">
          {language === 'fr' 
            ? 'Je vous répondrai dans les plus brefs délais.'
            : 'I will get back to you as soon as possible.'
          }
        </p>
      </motion.div>
    </motion.div>
  );
} 