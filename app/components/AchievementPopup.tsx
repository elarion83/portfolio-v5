'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Award, Crown, Sparkles, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface AchievementPopupProps {
  achievementId: string
  isVisible: boolean
  level: number
  onClose: () => void
  onSecret?: () => void
}

export function AchievementPopup({ achievementId, isVisible, level, onClose, onSecret }: AchievementPopupProps) {
  const { language } = useLanguage()
  
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icon = level === 1 ? <Star className="w-5 h-5 text-white" /> :
              level === 2 ? <Trophy className="w-5 h-5 text-white" /> :
              level === 3 ? <Award className="w-5 h-5 text-white" /> :
              level === 4 ? <Crown className="w-5 h-5 text-white" /> :
              <Sparkles className="w-5 h-5 text-white" />

  const particles = Array.from({ length: level * 2 }, (_, i) => ({
    angle: (Math.PI * 2 * i) / (level * 2),
    delay: i * 0.1
  }))

  const getStarsCount = (achievementId: string): number => {
    switch (achievementId) {
      case 'star-explorer': return 15
      case 'star-voyager': return 30
      case 'star-commander': return 50
      case 'star-admiral': return 75
      case 'galactic-master': return 100
      default: return 0
    }
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2"
    >
      {/* Popup principale */}
      <div className="bg-[#261939]/90 backdrop-blur-sm rounded-lg border border-[#e28d1d]/20 shadow-xl">
        <div className="relative">
          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%", zIndex:9999 }}
            animate={{ width: "0%", zIndex:9999 }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 bg-[#e28d1d]"
          />
          
          <div className="p-3 flex items-start gap-2">
            <div className="relative flex-shrink-0 w-10 h-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d] to-[#e28d1d]/80 rounded-full" />
                <div className="relative z-10 flex items-center justify-center">
                  {icon}
                </div>
                
                {/* Particle effects */}
                {particles.map((particle, i) => (
                  <motion.div
                    key={`particle-${achievementId}-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.cos(particle.angle) * 20],
                      y: [0, Math.sin(particle.angle) * 20]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: particle.delay,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: `hsl(${(360 / level) * i}, 70%, 50%)`,
                      filter: 'blur(1px)'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-[#e28d1d] mb-0.5">
                {language === 'fr' ? 'Succès débloqué !' : 'Achievement Unlocked!'}
              </h3>
              <p className="text-white text-base font-bold leading-tight mb-0.5">
                {language === 'fr' ? 
                  achievementId === 'star-explorer' ? 'Explorateur d\'étoiles' :
                  achievementId === 'star-voyager' ? 'Voyageur stellaire' :
                  achievementId === 'star-commander' ? 'Commandant des étoiles' :
                  achievementId === 'star-admiral' ? 'Amiral galactique' :
                  'Maître de la galaxie'
                  :
                  achievementId === 'star-explorer' ? 'Star Explorer' :
                  achievementId === 'star-voyager' ? 'Star Voyager' :
                  achievementId === 'star-commander' ? 'Star Commander' :
                  achievementId === 'star-admiral' ? 'Star Admiral' :
                  'Galactic Master'
                }
              </p>
              <p className="text-[#e28d1d] text-xs">
                {language === 'fr' ? 
                  `${getStarsCount(achievementId)} étoiles connectées !` :
                  `${getStarsCount(achievementId)} stars connected!`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton Jouer sous la popup */}
      {onSecret && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#e28d1d] to-[#b86e0e] text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl hover:from-[#f29d2d] hover:to-[#c87e1e] transition-all transform hover:scale-105 active:scale-95 relative overflow-hidden group glow-animation"
          onClick={onSecret}
          aria-label={language === 'fr' ? 'Jouer au jeu de plateforme' : 'Play platform game'}
        >
          {/* Effet de lueur animée qui traverse le bouton */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1
            }}
            style={{
              transform: 'skewX(-20deg)',
              filter: 'blur(1px)'
            }}
          />
          
          {/* Contenu du bouton */}
          <motion.div 
            className="relative z-10 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Gamepad2 className="w-5 h-5" />
            {language === 'fr' ? 'JOUER AU JEU' : 'PLAY GAME'}
          </motion.div>
        </motion.button>
      )}
    </motion.div>
  )
} 