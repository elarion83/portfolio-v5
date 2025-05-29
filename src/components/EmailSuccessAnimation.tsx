import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EmailSuccessAnimationProps {
  onComplete: () => void;
}

export const EmailSuccessAnimation: React.FC<EmailSuccessAnimationProps> = ({ onComplete }) => {
  const { t } = useLanguage();

  React.useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#261939]/95 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, times: [0, 0.8, 1] }}
          className="relative"
        >
          <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e28d1d"
              strokeWidth="4"
              strokeDasharray="565.48"
              initial={{ strokeDashoffset: 565.48 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckCircle className="w-20 h-20 text-[#e28d1d]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 w-full"
        >
          <h2 className="text-2xl font-bold text-white mb-2">{t('email.success.title')}</h2>
          <p className="text-gray-300">{t('email.success.description')}</p>
        </motion.div>

        {/* Decorative particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#e28d1d]"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              x: Math.cos(i * 30 * Math.PI / 180) * 100,
              y: Math.sin(i * 30 * Math.PI / 180) * 100,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              delay: 0.5,
              duration: 1,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            style={{
              top: '50%',
              left: '50%',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};