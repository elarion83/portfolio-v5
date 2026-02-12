'use client'

import { motion } from 'framer-motion'
import { Code2, Wrench, Gauge } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

const serviceKeys = [
  { key: 'dev', icon: Code2 },
  { key: 'maintenance', icon: Wrench },
  { key: 'optimization', icon: Gauge },
] as const

export function ServicesSection() {
  const { t } = useLanguage()
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#261939] to-[#0a0a0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 title-neon">
            {t('home.services.title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('home.services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceKeys.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-8 rounded-xl bg-[#261939]/50 border border-white/10 backdrop-blur-sm hover:border-[#e28d1d]/30 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-[#261939] border border-white/10">
                    <Icon className="w-6 h-6 text-[#e28d1d]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {t(`home.services.${item.key}.title`)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t(`home.services.${item.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
