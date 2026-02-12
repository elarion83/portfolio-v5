'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, Code, Briefcase } from 'lucide-react'
import Link from 'next/link'
import '@/app/styles/project.css'
import { useLanguage } from '@/app/contexts/LanguageContext'

export interface HomeProject {
  id: string
  title: string
  slug: string
  description: string
  contentExcerpt?: string
  year: string
  imageUrl: string
  logoUrl?: string
  isDarkLogo?: boolean
  mainTechnology?: string
  department?: string
  pageSpeed?: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  } | null
}

interface ProjectsSliderProps {
  projects: HomeProject[]
}

const PAGESPEED_KEYS = ['performance', 'accessibility', 'bestPractices', 'seo'] as const

export function ProjectsSlider({ projects }: ProjectsSliderProps) {
  const { t } = useLanguage()
  const [current, setCurrent] = useState(0)
  const count = projects.length

  if (count === 0) return null

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent((i) => (i - 1 + count) % count)
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent((i) => (i + 1) % count)
  }
  const goTo = (e: React.MouseEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrent(i)
  }

  const project = projects[current]
  const excerpt = project.contentExcerpt || project.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  const hasPageSpeed = project.pageSpeed && Object.values(project.pageSpeed).some((v) => v > 0)

  return (
    <section className="relative py-24 overflow-hidden bg-[#261939] section-bg-textured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 title-neon">
            {t('home.projects.title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('home.projects.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          <div className="relative min-h-[420px] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Link href={`/portfolio/${project.slug}`} className="block h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full min-h-[420px]">
                    {/* Zone image type project-hero */}
                    <div className="relative lg:col-span-2 h-56 sm:h-72 lg:h-full min-h-[240px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.imageUrl || '/img/portfolio.webp'}
                        alt={project.title}
                        className="project-hero-image absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="project-hero-overlay absolute inset-0" />
                      {/* Logo projet en haut à gauche */}
                      {project.logoUrl && (
                        <div className="absolute top-4 left-4 z-10 h-8 w-20 sm:h-9 sm:w-24 md:h-10 md:w-28 flex items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.logoUrl}
                            alt={`${project.title} logo`}
                            className={`max-h-full w-auto max-w-full object-contain object-left ${project.isDarkLogo ? 'brightness-0 invert' : ''}`}
                          />
                        </div>
                      )}
                      {/* Meta badges sur l'image (comme page projet) */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center gap-2 project-meta">
                        <div className="meta-badge text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e28d1d]" />
                          <span className="text-white">{project.year}</span>
                        </div>
                        {project.mainTechnology && (
                          <div className="meta-badge text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
                            <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e28d1d]" />
                            <span className="text-white">{project.mainTechnology}</span>
                          </div>
                        )}
                        {project.department && (
                          <div className="meta-badge text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5">
                            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e28d1d]" />
                            <span className="text-white">{project.department}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Zone contenu : extrait + PageSpeed (fond pour ancrer le texte) */}
                    <div className="lg:col-span-3 flex flex-col lg:flex-row gap-4 p-4 sm:p-6 bg-[#261939]/95 backdrop-blur-sm border-l border-white/10 min-h-[200px]">
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 project-title" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: 1.2 }}>
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-4 mb-4">
                          {excerpt}
                        </p>
                        <span className="inline-flex items-center gap-2 text-[#e28d1d] font-medium text-sm mt-auto">
                          {t('home.projects.viewProject')}
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </span>
                      </div>

                      {/* PageSpeed (reprend le bloc de la page projet) */}
                      {hasPageSpeed && project.pageSpeed && (
                        <div className="glass-card p-4 sm:p-6 flex-shrink-0 w-full lg:w-56">
                          <h4 className="text-lg font-bold text-white mb-4">{t('home.projects.performance')}</h4>
                          <div className="space-y-3">
                            {Object.entries(project.pageSpeed).map(([key, value]) => (
                              <div key={key} className="pagespeed-item">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-400">
                                    {PAGESPEED_KEYS.includes(key as typeof PAGESPEED_KEYS[number]) ? t(`home.projects.perf.${key}`) : key}
                                  </span>
                                  <span className="text-white font-medium text-sm">{value}%</span>
                                </div>
                                <div className="progress-bar">
                                  <div
                                    className="progress-fill"
                                    style={{ ['--score' as string]: `${Math.min(100, value)}%` } as React.CSSProperties}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation (en dehors du lien) */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={prev}
              aria-label={t('home.projects.prev')}
              className="p-3 rounded-full border border-white/20 text-white hover:border-[#e28d1d] hover:bg-[#e28d1d]/10 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => goTo(e, i)}
                  aria-label={`${t('home.projects.title')} ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? 'w-8 bg-[#e28d1d]'
                      : 'w-2 bg-white/20 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label={t('home.projects.next')}
              className="p-3 rounded-full border border-white/20 text-white hover:border-[#e28d1d] hover:bg-[#e28d1d]/10 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[#e28d1d] font-medium hover:underline"
          >
            {t('home.projects.viewAll')}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
