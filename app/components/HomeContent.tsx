'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { ConstellationBackground } from './ConstellationBackground'
import '../styles/critical.css'

export function HomeContent() {
  const { t, language } = useLanguage()
  const h1Ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Animation des éléments non critiques
    const elements = document.querySelectorAll('.animate-on-mount')
    elements.forEach((el, index) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.classList.add('animate-in')
        }, index * 100) // Délai progressif
      })
    })
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Image de fond préchargée avec priorité */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/img/home.webp)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(38, 25, 57, 0.95)'
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#261939]/80 via-transparent to-[#261939]/80" />
      
      <div className="text-center relative max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto py-8" style={{ zIndex: 2 }}>
        {/* H1 optimisé pour le LCP */}
        <h1 
          ref={h1Ref}
          className="critical-h1"
        >
          {t('home.title')}
        </h1>

        {/* Sous-titre avec animation légèrement différée */}
        <p className="animate-on-mount opacity-0 text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium text-shadow title-neon-subtle transition-opacity duration-500">
          {t('home.subtitle')}
        </p>

        <div className="animate-on-mount opacity-0 flex justify-center mb-3 sm:mb-4 transition-opacity duration-500 delay-100">
          <Icons.Code className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#e28d1d]" aria-hidden="true" />
        </div>

        <p className="animate-on-mount opacity-0 text-sm sm:text-base md:text-lg text-white mb-4 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed bg-[#261939]/30 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl text-shadow transition-opacity duration-500 delay-200">
          {t('home.description')}
        </p>

        <div className="animate-on-mount opacity-0 flex flex-wrap justify-center gap-4 mb-8 transition-opacity duration-500 delay-300">
          <div className="flex items-center gap-1.5 text-white bg-[#261939]/30 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
            <Icons.Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e28d1d]" aria-hidden="true" />
            <span className="text-shadow">500+ {t('about.stats.tea')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white bg-[#261939]/30 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
            <Icons.Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e28d1d]" aria-hidden="true" />
            <span className="text-shadow">30+ {t('about.stats.clients')}</span>
          </div>
        </div>

        <div className="animate-on-mount opacity-0 flex flex-wrap justify-center gap-4 transition-opacity duration-500 delay-400">
          <Link href="/about">
            <button className="text-shadow px-5 sm:px-6 py-2 sm:py-2.5 bg-[#e28d1d] text-shadow-ng rounded-full text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow text-sm">
              {t('home.cta.work')} <Icons.ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </Link>
          <Link href="/portfolio">
            <button className="px-5 sm:px-6 py-2 sm:py-2.5 border-2 border-[#e28d1d] text-[#e28d1d] rounded-full font-semibold hover:bg-[#e28d1d] hover:text-white transition-colors text-sm">
              {language === 'fr' ? 'Voir mes projets' : 'View My Work'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 