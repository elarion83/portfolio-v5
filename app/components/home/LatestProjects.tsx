'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

const projects = [
  {
    title: 'WHISE Integration',
    description: 'Synchronisation automatisée de parcs immobiliers via API.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    href: '/portfolio/whise-integration',
  },
  {
    title: 'E-Invoicing Tool',
    description: 'Outil de conformité fiscale 2026 (ERP/SAP vers Administration).',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    href: '/portfolio/e-invoicing',
  },
  {
    title: 'Automation Workflows',
    description: 'Gains de productivité massifs via n8n.',
    gradient: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
    href: '/portfolio/automation',
  },
]

export function LatestProjects() {
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
            Projets Récents
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Des solutions concrètes pour des défis complexes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={project.title} href={project.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${project.gradient} border ${project.borderColor} backdrop-blur-sm hover:border-opacity-60 transition-all duration-300 h-full cursor-pointer overflow-hidden`}
              >
                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-deep-night-900/60 group-hover:bg-deep-night-900/80 transition-colors duration-300"
                  initial={false}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4 h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white group-hover:text-[#e28d1d] transition-colors">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#e28d1d] transition-colors opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <p className="text-gray-400 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  
                  {/* Reveal effect on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-deep-night-800/50"
                  >
                    <span className="text-sm text-[#e28d1d] font-medium">
                      Voir le projet →
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
