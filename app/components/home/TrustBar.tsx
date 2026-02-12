'use client'

import { motion } from 'framer-motion'
import { Zap, Code2, Workflow } from 'lucide-react'

const stats = [
  {
    label: '99.9% Performance Score',
    icon: Zap,
  },
  {
    label: '30+ Solutions Déployées',
    icon: Code2,
  },
  {
    label: 'Expertise Automation n8n/Make',
    icon: Workflow,
  },
]

export function TrustBar() {
  return (
    <section className="relative bg-deep-night-950 border-y border-deep-night-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="p-3 rounded-lg bg-deep-night-900/50 border border-deep-night-800/50">
                  <Icon className="w-6 h-6 text-[#e28d1d]" />
                </div>
                <p className="text-sm sm:text-base text-gray-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
