import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AchievementPopupProps {
  achievementId: string;
  isVisible: boolean;
  onClose: () => void;
  level: number;
  icon?: React.ReactNode;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievementId,
  isVisible,
  onClose,
  level,
  icon = <Star className="w-5 h-5 text-white" />
}) => {
  const { t } = useLanguage();

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) * (Math.PI / 180),
    delay: i * 0.1
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 z-50 bg-[#261939]/90 backdrop-blur-sm border border-[#e28d1d]/20 rounded-lg shadow-lg max-w-xs overflow-hidden"
        >
          <div className="relative">
            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-0.5 bg-accent"
            />
            
            <div className="p-4 flex items-start gap-3">
              <div className="relative flex-shrink-0 w-12 h-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80 rounded-full" />
                  <div className="relative z-10 flex items-center justify-center">
                    {icon}
                  </div>
                  
                  {/* Particle effects */}
                  {particles.map((particle, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.cos(particle.angle) * 24],
                        y: [0, Math.sin(particle.angle) * 24]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                      style={{
                        background: `hsl(${(360 / level) * i}, 70%, 50%)`,
                        filter: 'blur(1px)'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <motion.h3 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-accent font-bold text-sm"
                >
                  {t('achievement.unlocked')}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 font-medium text-sm mt-0.5"
                >
                  {t(`achievement.${achievementId}.title`)}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300/80 text-xs mt-1"
                >
                  {t(`achievement.${achievementId}.description`)}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};