'use client'

import Link from 'next/link'
import { Filter, Calendar, Code, Briefcase } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  year: string
  imageUrl: string
  logoUrl: string
  isDarkLogo: boolean
  department: string
  mainTechnology: string
  projectUrl: string
  pageSpeed: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  } | null
}

export function PortfolioContent({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState('all')
  const { t, language } = useLanguage()

  // Get unique departments and their counts
  const departments = initialProjects.reduce((acc, project) => {
    const dept = project.department || 'Other'
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const filteredProjects = initialProjects.filter(project => 
    filter === 'all' || project.department === filter
  )

  return (
    <div className="min-h-screen bg-[#261939] relative">
      <div className="py-12 px-4 relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 title-neon">
            Portfolio
          </h1>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-[#e28d1d]' : 'bg-[#261939] border border-gray-600/30'} text-white flex items-center gap-2 transition-colors duration-300`}
            >
              <Filter className="w-4 h-4" />
              {t('portfolio.filter.all')}
              <span className="bg-white/20 px-2 rounded-full">{initialProjects.length}</span>
            </button>
            {Object.entries(departments).map(([dept, count]) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-4 py-2 rounded-full ${filter === dept ? 'bg-[#e28d1d]' : 'bg-[#261939] border border-gray-600/30'} text-white flex items-center gap-2 transition-colors duration-300`}
              >
                {dept}
                <span className="bg-white/20 px-2 rounded-full">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project: Project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="relative group bg-[#261939] rounded-lg overflow-hidden block"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {/* Voile sur toute la carte */}
                      <div className={`absolute inset-0 z-10 ${project.isDarkLogo ? 'bg-white/60' : 'bg-[#261939]/60'}`} />
                      
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        width={600}
                        height={315}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Technology Badge */}
                      <div className="absolute top-4 left-4 z-30">
                        <div className="px-3 py-1.5 bg-[#261939]/80 backdrop-blur-sm text-white tech-badge-clip flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-[#e28d1d]" />
                          <span className="text-xs font-medium">{project.mainTechnology}</span>
                        </div>
                      </div>

                      {/* Year Badge */}
                      <div className="absolute top-4 right-4 z-30">
                        <div className="px-3 py-1.5 bg-[#261939]/80 backdrop-blur-sm text-white rounded-full flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{project.year}</span>
                        </div>
                      </div>

                      {/* Logo */}
                      {project.logoUrl && (
                        <div className="absolute top-[calc(50%-25px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full flex items-center justify-center">
                          <img
                            src={project.logoUrl}
                            alt={`${project.title} logo`}
                            className="w-48 h-24 object-contain"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h2 className="text-xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] text-shadow">
                          {project.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-[#e28d1d] rounded-full text-white text-sm font-medium flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            {project.department}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 