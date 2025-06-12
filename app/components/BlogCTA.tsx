'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export function BlogCTA() {
  const { language } = useLanguage()

  const content = {
    fr: {
      title: "Prêt à transformer vos idées en réalité ?",
      description: "Avec plus de 10 ans d'expertise en développement web, je peux vous aider à concrétiser votre projet digital. Discutons-en !",
      cta: "Démarrons la discussion",
      subtext: "Réponse garantie sous 24h"
    },
    en: {
      title: "Ready to turn your ideas into reality?",
      description: "With over 10 years of web development expertise, I can help bring your digital project to life. Let's talk about it!",
      cta: "Let's start the conversation",
      subtext: "Response guaranteed within 24h"
    }
  }

  const t = content[language as keyof typeof content]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#261939]/30 to-[#e28d1d]/30 blur-3xl" />
      
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e28d1d]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#261939]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#e28d1d]" />
            <span className="text-[#e28d1d] font-medium tracking-wide text-sm">EXPERTISE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t.title}
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 max-w-2xl">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-[#e28d1d] rounded-xl text-white font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                {t.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <p className="text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#e28d1d]" />
              {t.subtext}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 