'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ConstellationBackground } from '../ConstellationBackground'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { syne } from '@/app/fonts'

const ROTATING_TECHS = ['WordPress', 'ReactJS', 'PHP']
const ROTATE_INTERVAL_MS = 5000

const TECH_LOGOS: { name: string; href: string; src: string; invertOnDark?: boolean }[] = [
  { name: 'WordPress', href: 'https://wordpress.org', src: '/img/tech/wordpress.svg' },
  { name: 'WooCommerce', href: 'https://woocommerce.com', src: '/img/tech/woocommerce.svg' },
  { name: 'Elementor', href: 'https://elementor.com', src: '/img/tech/elementor.svg' },
  { name: 'React', href: 'https://react.dev', src: '/img/tech/react.svg' },
  { name: 'PHP', href: 'https://php.net', src: '/img/tech/php.svg' },
  { name: 'JavaScript', href: 'https://developer.mozilla.org/docs/Web/JavaScript', src: '/img/tech/javascript.svg' },
  { name: 'phpMyAdmin', href: 'https://www.phpmyadmin.net', src: '/img/tech/phpmyadmin.svg' },
  { name: 'Firebase', href: 'https://firebase.google.com', src: '/img/tech/firebase.svg' },
  { name: 'Vercel', href: 'https://vercel.com', src: '/img/tech/vercel.svg' },
  { name: 'Netlify', href: 'https://www.netlify.com', src: '/img/tech/netlify.svg' },
  { name: 'Google Analytics', href: 'https://analytics.google.com', src: '/img/tech/googleanalytics.svg' },
  { name: 'GitHub', href: 'https://github.com', src: '/img/tech/github.svg' },
]

function TechLogo({ name, href, src, invertOnDark }: { name: string; href: string; src: string; invertOnDark?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      className="hero-tech-logo group relative flex items-center justify-center flex-shrink-0 px-6 sm:px-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e28d1d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030507] rounded"
      aria-label={name}
    >
      <span
        className="hero-tech-tooltip pointer-events-none absolute left-1/2 top-full z-[100] mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-[#261939] px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-opacity duration-150 group-hover:opacity-100 opacity-0"
        role="tooltip"
      >
        <span className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-8 border-transparent border-b-[#261939]" aria-hidden />
        {name}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`h-10 sm:h-12 md:h-14 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity ${invertOnDark ? 'brightness-0 invert' : ''}`}
        style={{ minHeight: '2.5rem' }}
        width={56}
        height={56}
      />
    </a>
  )
}

export function HeroSection() {
  const { t } = useLanguage()
  const [techIndex, setTechIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setTechIndex((i) => (i + 1) % ROTATING_TECHS.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-deep-night-950">
      {/* Image de fond (comme sur les autres pages) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(/img/home.webp)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(3, 5, 7, 0.85)',
        }}
      />

      {/* Overlay gradient sombre */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-night-950/90 via-deep-night-950/70 to-deep-night-950 z-0" />

      {/* Constellation + jeu à débloquer */}
      <div className="absolute inset-0 z-[1]">
        <ConstellationBackground showAchievements={true} />
      </div>

      {/* Légère lueur orange au centre */}
      <div className="absolute inset-0 opacity-20 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(226,141,29,0.15),transparent_60%)]" />
      </div>

      {/* Grid Lines Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-8"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bold tracking-tight"
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl hero-name-color">Nicolas Gruwe</span>
            <span className={`block mt-4 text-lg sm:text-xl text-gray-300/95 font-light max-w-2xl mx-auto leading-snug tracking-tight ${syne.className}`}>
              {t('home.hero.solutionsPrefix')}
              <span className="relative inline-block h-[1.4em] min-w-[10ch] align-middle overflow-hidden">
                <span className="absolute inset-0 flex items-center -translate-y-[2px]" aria-hidden>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={techIndex}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="block w-full text-[#e28d1d] font-light leading-none"
                    >
                      {ROTATING_TECHS[techIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
              {t('home.hero.solutionsSuffix')}
            </span>
          </motion.h1>

          {/* Logos tech – défilement infini droite → gauche, disparition en dégradé transparent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-14 w-full overflow-hidden py-10 sm:py-12"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0, black 6rem, black calc(100% - 6rem), transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 6rem, black calc(100% - 6rem), transparent 100%)',
            }}
            aria-label="Technologies : WordPress, WooCommerce, Elementor, React, PHP, JavaScript, phpMyAdmin, Firebase, Vercel, Netlify, Google Analytics, GitHub"
          >
            <div className="relative flex w-max hero-marquee-track">
              {[...TECH_LOGOS, ...TECH_LOGOS].map((logo, i) => (
                <TechLogo key={`${logo.name}-${i}`} name={logo.name} href={logo.href} src={logo.src} invertOnDark={logo.invertOnDark} />
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {/* Primary CTA - Glow effect on hover */}
            <Link href="/contact" className="btn-primary">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                className="group relative font-semibold rounded-full overflow-visible"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('home.cta.startProject')}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </Link>

            {/* Secondary CTA - Ghost button */}
            <Link href="/portfolio" className="btn-secondary">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                className="font-semibold rounded-full"
              >
                {t('home.cta.discoverCreations')}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
