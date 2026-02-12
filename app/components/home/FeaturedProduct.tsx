'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export function FeaturedProduct() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <section ref={ref} className="relative bg-deep-night-950 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-[#e28d1d]/10 border border-[#e28d1d]/20 text-[#e28d1d] text-sm font-medium">
              Product Spotlight
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              WP Admin UI : Redéfinir l&apos;expérience WordPress.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Un plugin premium qui transforme l&apos;admin classique en une interface moderne 
              et intuitive pour les agences et clients exigeants.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 px-6 py-3 border border-gray-700 text-white rounded-lg hover:border-[#e28d1d] hover:bg-[#e28d1d]/10 transition-all duration-300"
            >
              En savoir plus
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Visual - Mockup Dashboard */}
          <motion.div
            style={{ y, opacity }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-deep-night-900 border border-deep-night-800/50 p-6 shadow-2xl">
              {/* Mockup Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-deep-night-800/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 h-8 bg-deep-night-800/50 rounded ml-4" />
              </div>

              {/* Mockup Content */}
              <div className="space-y-4">
                <div className="h-12 bg-deep-night-800/50 rounded" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded border border-purple-500/30" />
                  <div className="h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded border border-blue-500/30" />
                  <div className="h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded border border-orange-500/30" />
                </div>
                <div className="h-32 bg-deep-night-800/30 rounded border border-deep-night-700/50" />
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-[#e28d1d]/10 blur-2xl rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
