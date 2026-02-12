'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0a0d] via-[#261939]/50 to-[#0a0a0d]">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white title-neon">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Discutons de votre projet et découvrons comment transformer vos idées en solutions performantes.
          </p>
          
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 bg-[#e28d1d] text-deep-night-950 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(226,141,29,0.6)] text-lg"
            >
              <span className="relative z-10 flex items-center gap-3">
                On en discute ?
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#f5a742] to-[#e28d1d]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
