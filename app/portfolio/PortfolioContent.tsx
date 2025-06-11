'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Filter, Briefcase, Calendar, Share2, Facebook, Twitter, 
  Linkedin, Folder, ExternalLink, Gauge, Code
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { AchievementPopup } from '@/components/AchievementPopup'

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

interface Achievement {
  id: string
  threshold: number
  level: number
}

const PORTFOLIO_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'portfolio-novice',
    threshold: 1,
    level: 1
  },
  {
    id: 'portfolio-explorer',
    threshold: 3,
    level: 2
  },
  {
    id: 'portfolio-enthusiast',
    threshold: 5,
    level: 3
  },
  {
    id: 'portfolio-connoisseur',
    threshold: 10,
    level: 4
  },
  {
    id: 'portfolio-master',
    threshold: 20,
    level: 5
  }
]

const renderYearBadge = (year: string) => (
  <span className="px-2 py-1 bg-background text-foreground rounded-full text-xs font-medium inline-flex items-center border border-border">
    <Calendar className="w-3 h-3 mr-1" />
    {year}
  </span>
)

const renderTechBadge = (project: Project, isSelected: boolean = false) => {
  if (!project.mainTechnology) return null

  return (
    <div className={`absolute ${isSelected ? 'bottom-4' : 'top-4'} left-4 z-30`}>
      <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm text-foreground tech-badge-clip flex items-center gap-1.5 hover:border-primary/30 transition-colors shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3)]">
        <Code className="w-3.5 h-3.5 text-primary tech-badge-icon" />
        <span className="text-xs font-medium">{project.mainTechnology}</span>
      </div>
    </div>
  )
}

interface PortfolioContentProps {
  initialProjects: Project[]
}

export function PortfolioContent({ initialProjects }: PortfolioContentProps) {
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCompanyFilterOpen, setIsCompanyFilterOpen] = useState(false)
  const [achievement, setAchievement] = useState<Achievement | null>(null)
  const viewedProjectsRef = useRef(new Set<string>())
  const achievedRef = useRef(new Set<string>())
  const { t, language } = useLanguage()

  const departments = Array.from(
    new Set(
      initialProjects
        .map(p => p.department)
        .filter(Boolean)
    )
  ).sort()

  const checkAchievement = (count: number) => {
    const nextAchievement = PORTFOLIO_ACHIEVEMENTS
      .filter(a => count >= a.threshold && !achievedRef.current.has(a.id))
      .sort((a, b) => b.threshold - a.threshold)[0]

    if (nextAchievement) {
      achievedRef.current.add(nextAchievement.id)
      setAchievement(nextAchievement)
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    if (!viewedProjectsRef.current.has(project.id)) {
      viewedProjectsRef.current.add(project.id)
      checkAchievement(viewedProjectsRef.current.size)
    }
  }

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!selectedProject) return

    const url = `https://nicolas-gruwe.fr/portfolio/${selectedProject.slug}`
    const text = `${selectedProject.title} | Portfolio - Nicolas Gruwe`

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank')
        break
    }
  }

  const getDepartmentCount = (department: string) => {
    return initialProjects.filter(p => 
      department === 'all' ? true : p.department === department
    ).length
  }

  const renderCountBadge = (count: number, isActive: boolean) => (
    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
      isActive ? 'bg-primary text-white' : 'bg-background text-foreground'
    }`}>
      {count}
    </span>
  )

  const renderPageSpeedMetric = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{value}</span>
        </div>
        <svg className="transform -rotate-90" width="48" height="48">
          <circle
            className="text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="24"
            cy="24"
          />
          <circle
            className={`text-primary transition-all duration-1000 ease-out`}
            strokeWidth="4"
            strokeDasharray={`${value * 1.25}, 125`}
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="24"
            cy="24"
          />
        </svg>
      </div>
      <span className="text-xs text-foreground mt-1">{label}</span>
    </div>
  )

  const filteredProjects = initialProjects.filter(project => 
    companyFilter === 'all' ? true : project.department === companyFilter
  )

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 title-neon">
          {t('portfolio.title')}
        </h1>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="relative">
          <button
            onClick={() => setIsCompanyFilterOpen(!isCompanyFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border text-foreground hover:bg-background transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">
              {companyFilter === 'all' 
                ? t('portfolio.company.all')
                : companyFilter}
            </span>
            {renderCountBadge(getDepartmentCount(companyFilter), true)}
          </button>

          <AnimatePresence>
            {isCompanyFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg z-50"
              >
                <div className="p-2">
                  <button
                    onClick={() => {
                      setCompanyFilter('all')
                      setIsCompanyFilterOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
                      companyFilter === 'all'
                        ? 'bg-primary text-white'
                        : 'hover:bg-background/80 text-foreground'
                    }`}
                  >
                    <span>{t('portfolio.company.all')}</span>
                    {renderCountBadge(getDepartmentCount('all'), companyFilter === 'all')}
                  </button>
                  {departments.map((department) => (
                    <button
                      key={department}
                      onClick={() => {
                        setCompanyFilter(department)
                        setIsCompanyFilterOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
                        companyFilter === department
                          ? 'bg-primary text-white'
                          : 'hover:bg-background/80 text-foreground'
                      }`}
                    >
                      <span>{department}</span>
                      {renderCountBadge(getDepartmentCount(department), companyFilter === department)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`project-${project.id}`}
              onClick={() => handleProjectClick(project)}
              className="relative group cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {renderTechBadge(project)}
                {renderYearBadge(project.year)}

                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-300">
                      {project.department}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-12">
              <div className="relative max-w-5xl mx-auto bg-background rounded-xl overflow-hidden">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-50 p-2 bg-background/80 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative aspect-video">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {renderTechBadge(selectedProject, true)}
                  {renderYearBadge(selectedProject.year)}

                  {selectedProject.logoUrl && (
                    <div className="absolute bottom-4 right-4">
                      <img
                        src={selectedProject.logoUrl}
                        alt={`${selectedProject.title} logo`}
                        className={`h-12 ${selectedProject.isDarkLogo ? 'brightness-0 invert' : ''}`}
                      />
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        {selectedProject.title}
                      </h2>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Briefcase className="w-4 h-4" />
                        <span>{selectedProject.department}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div 
                    className="prose prose-invert max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: selectedProject.content }}
                  />

                  {selectedProject.pageSpeed && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Gauge className="w-5 h-5" />
                        PageSpeed Insights
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderPageSpeedMetric(selectedProject.pageSpeed.performance, 'Performance')}
                        {renderPageSpeedMetric(selectedProject.pageSpeed.accessibility, 'Accessibility')}
                        {renderPageSpeedMetric(selectedProject.pageSpeed.bestPractices, 'Best Practices')}
                        {renderPageSpeedMetric(selectedProject.pageSpeed.seo, 'SEO')}
                      </div>
                    </div>
                  )}

                  {selectedProject.projectUrl && (
                    <a
                      href={selectedProject.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('portfolio.viewLive')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AnimatePresence>
        {achievement && (
          <AchievementPopup
            achievement={achievement}
            onClose={() => setAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 