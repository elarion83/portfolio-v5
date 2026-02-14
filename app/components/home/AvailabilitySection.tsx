'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

const availabilityKeys = [
  { key: 'long' },
  { key: 'short' },
  { key: 'advisory' },
] as const

export function AvailabilitySection() {
  const { t } = useLanguage()
  return (
    <section className="tech-landing-section py-24 md:py-32">
      <div className="tech-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="tech-landing-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight">
            {t('home.availability.title')}
          </h2>
          <p className="tech-landing-subtitle text-base sm:text-lg max-w-2xl mx-auto">
            {t('home.availability.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
          {availabilityKeys.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="tech-glass-card relative flex flex-col p-6 lg:p-7 overflow-hidden"
            >
              <h3 className="tech-card-title text-base lg:text-lg mb-2">
                {t(`home.availability.${item.key}.title`)}
              </h3>
              <p className="tech-card-desc flex items-start gap-2.5 text-sm lg:text-[15px] flex-1">
                <Zap className="w-4 h-4 tech-icon-cyan flex-shrink-0 mt-0.5" aria-hidden />
                <span>{t(`home.availability.${item.key}.desc`)}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
