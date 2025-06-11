'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Award, Crown, Sparkles } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Achievement {
  id: string
  threshold: number
  level: number
}

interface AchievementPopupProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const { language } = useLanguage()
  
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icon = achievement.level === 1 ? <Star className="w-6 h-6 text-white" /> :
              achievement.level === 2 ? <Trophy className="w-6 h-6 text-white" /> :
              achievement.level === 3 ? <Award className="w-6 h-6 text-white" /> :
              achievement.level === 4 ? <Crown className="w-6 h-6 text-white" /> :
              <Sparkles className="w-6 h-6 text-white" />

  const particles = Array.from({ length: achievement.level * 2 }, (_, i) => ({
    angle: (Math.PI * 2 * i) / (achievement.level * 2),
    delay: i * 0.1
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-[#261939]/90 backdrop-blur-sm rounded-lg border border-[#e28d1d]/20 shadow-xl">
        <div className="relative">
          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 bg-[#e28d1d]"
          />
          
          <div className="p-4 flex items-start gap-3">
            <div className="relative flex-shrink-0 w-12 h-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d] to-[#e28d1d]/80 rounded-full" />
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
                      background: `hsl(${(360 / achievement.level) * i}, 70%, 50%)`,
                      filter: 'blur(1px)'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[#e28d1d] mb-1">
                {language === 'fr' ? 'Succès débloqué !' : 'Achievement Unlocked!'}
              </h3>
              <p className="text-white text-lg font-bold">
                {language === 'fr' ? 
                  achievement.id === 'star-explorer' ? 'Explorateur d\'étoiles' :
                  achievement.id === 'star-voyager' ? 'Voyageur stellaire' :
                  achievement.id === 'star-commander' ? 'Commandant des étoiles' :
                  achievement.id === 'star-admiral' ? 'Amiral galactique' :
                  'Maître de la galaxie'
                  :
                  achievement.id === 'star-explorer' ? 'Star Explorer' :
                  achievement.id === 'star-voyager' ? 'Star Voyager' :
                  achievement.id === 'star-commander' ? 'Star Commander' :
                  achievement.id === 'star-admiral' ? 'Star Admiral' :
                  'Galactic Master'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 