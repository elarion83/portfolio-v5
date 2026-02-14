'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

const serviceKeys = [
  { key: 'dev' },
  { key: 'maintenance' },
  { key: 'optimization' },
  { key: 'headless' },
  { key: 'audit' },
] as const

const SERVICE_ITEMS_COUNT = 3

export function ServicesSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [flare, setFlare] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setFlare({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setFlare(null)
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="tech-landing-section py-24 md:py-32 relative"
    >
      {flare && (
        <div
          className="services-lens-flare"
          style={{ left: flare.x, top: flare.y }}
          aria-hidden
        />
      )}
      <div className="tech-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="tech-landing-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight">
            {t('home.services.title')}
          </h2>
          <p className="tech-landing-subtitle text-base sm:text-lg max-w-2xl mx-auto">
            {t('home.services.subtitle')}
          </p>
        </motion.div>

        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
          {serviceKeys.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="service-card tech-glass-card relative flex flex-col p-6 lg:p-7 overflow-hidden"
            >
              <div className="flex items-start gap-2.5 mb-2">
                <Zap className="w-4 h-4 tech-icon-violet flex-shrink-0 mt-0.5" aria-hidden />
                <h3 className="tech-card-title text-base lg:text-lg font-semibold text-white">
                  {t(`home.services.${item.key}.title`)}
                </h3>
              </div>
              <ul className="service-list tech-card-desc text-sm lg:text-[15px] space-y-2.5 list-disc pl-5 flex-1">
                {Array.from({ length: SERVICE_ITEMS_COUNT }, (_, i) => i + 1).map(
                  (n) => (
                    <li key={n} className="leading-snug">
                      {t(`home.services.${item.key}.item${n}`)}
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
