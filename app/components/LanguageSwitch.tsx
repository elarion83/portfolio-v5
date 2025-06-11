'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-4 left-4 z-50 flex gap-2"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-[#e28d1d] text-white'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-[#e28d1d] text-white'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        aria-label="Passer en français"
      >
        FR
      </button>
    </motion.div>
  )
} 