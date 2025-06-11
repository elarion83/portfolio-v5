'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-4 left-4 z-50 flex gap-2"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-primary text-white'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-primary text-white'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        FR
      </button>
    </motion.div>
  )
} 