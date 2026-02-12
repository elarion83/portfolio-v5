'use client'

import { motion } from 'framer-motion'
import { Code, Plug, Layers } from 'lucide-react'

const expertiseItems = [
  {
    title: 'Custom WP',
    description: 'Développement de thèmes et plugins de zéro.',
    icon: Code,
    gradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    title: 'API & Integrations',
    description: 'Connexion fluide avec des outils tiers (CRM, WHISE, SAP).',
    icon: Plug,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    title: 'Architecture Full-stack',
    description: 'Applications modernes avec React et PHP robuste.',
    icon: Layers,
    gradient: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
  },
]

export function BentoGrid() {
  return (
    <section className="relative bg-deep-night-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            L&apos;Expertise
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Des solutions sur mesure pour transformer vos besoins en réalité
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expertiseItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.borderColor} backdrop-blur-sm hover:border-opacity-60 transition-all duration-300 group`}
              >
                <div className="absolute inset-0 bg-deep-night-900/40 rounded-2xl group-hover:bg-deep-night-900/60 transition-colors duration-300" />
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-deep-night-800/50">
                    <Icon className="w-6 h-6 text-[#e28d1d]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
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
