import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Facebook, Twitter, Linkedin, ExternalLink, Calendar, Code, Briefcase } from 'lucide-react'
import Link from 'next/link'
import '@/app/styles/project.css'

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

async function getAllProjects() {
  const res = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio?per_page=50', {
    next: { revalidate: 3600 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data = await res.json()
  
  return data.map((item: any) => ({
    id: item.id.toString(),
    title: item.title.rendered.replace(/\s*\(\d{4}\)$/, ''),
    slug: item.title.rendered
      .toLowerCase()
      .replace(/\s*\(\d{4}\)$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: item.excerpt?.rendered.replace(/<[^>]*>/g, '') || '',
    content: item.content.rendered,
    year: item.acf?.annee || 'N/A',
    imageUrl: item.acf?.image_background || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    logoUrl: item.acf?.logo_url || '',
    isDarkLogo: item.acf?.logo_sombre === true,
    department: item.department_name || 'Other',
    mainTechnology: item.acf?.socle_technique || '',
    projectUrl: item.acf?.url_projet || '',
    pageSpeed: item.acf?.informations_pagespeed ? {
      performance: parseInt(item.acf.informations_pagespeed.performance) || 'n.a',
      accessibility: parseInt(item.acf.informations_pagespeed.accessibilite) || 'n.a',
      bestPractices: parseInt(item.acf.informations_pagespeed.bonnes) || 'n.a',
      seo: parseInt(item.acf.informations_pagespeed.seo) || 'n.a'
    } : null
  }))
}

async function getProject(slug: string): Promise<Project | null> {
  const projects = await getAllProjects()
  return projects.find((p: Project) => p.slug === slug) || null
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  
  return projects.map((project: Project) => ({
    slug: project.slug
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: 'Projet non trouvé | Portfolio - Nicolas Gruwe',
      description: 'Ce projet n\'existe pas ou n\'est plus disponible.',
    }
  }

  const title = `${project.title} | Portfolio - Nicolas Gruwe`
  const description = project.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://nicolas-gruwe.fr/portfolio/${project.slug}`,
      siteName: 'Nicolas Gruwe',
      images: [
        {
          url: project.imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ],
      locale: 'fr_FR',
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['Nicolas Gruwe'],
      tags: [project.mainTechnology, project.department, 'Portfolio', 'Développement Web'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.imageUrl],
      creator: '@nicolasgruwe',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://nicolas-gruwe.fr/portfolio/${project.slug}`,
    },
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  // Extract technologies from content
  const techMatches = project.content.match(/<li><a>([^<]+)<\/a><\/li>/g)
  const technologies = techMatches ? techMatches.map(match => match.replace(/<li><a>|<\/a><\/li>/g, '')) : []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="project-hero">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="project-hero-image"
        />
        <div className="project-hero-overlay" />
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end px-4 py-12 max-w-7xl mx-auto">
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-4">
            <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm text-white rounded-lg font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {project.year}
            </div>
            {project.mainTechnology && (
              <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm text-white rounded-lg font-medium flex items-center gap-2">
                <Code className="w-4 h-4" />
                {project.mainTechnology}
              </div>
            )}
            <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm text-white rounded-lg font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {project.department}
            </div>
          </div>

          {/* Social Links */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <a href="#" className="p-2 bg-background/80 backdrop-blur-sm text-white rounded-full hover:bg-primary/80 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-background/80 backdrop-blur-sm text-white rounded-full hover:bg-primary/80 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-background/80 backdrop-blur-sm text-white rounded-full hover:bg-primary/80 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Project Logo */}
          {project.logoUrl && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={project.logoUrl}
                alt={`${project.title} logo`}
                className={`h-32 ${project.isDarkLogo ? 'brightness-0 invert' : ''}`}
              />
            </div>
          )}

          {/* Title and CTA */}
          <div className="flex items-end justify-between">
            <h1 className="project-title text-5xl font-bold text-white mb-0">
              {project.title}
            </h1>
            {project.projectUrl && (
              <a 
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-meta flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span>Voir le projet</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* PageSpeed Scores */}
        {project.pageSpeed && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="pagespeed-item flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full progress-circle">
                  <circle
                    className="progress-circle-bg"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="progress-circle-value"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                    strokeDasharray="364.4"
                    strokeDashoffset={364.4 * (1 - project.pageSpeed.performance / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{project.pageSpeed.performance}</span>
                </div>
              </div>
              <span className="mt-4 text-lg font-medium">Performance</span>
            </div>
            <div className="pagespeed-item flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full progress-circle">
                  <circle
                    className="progress-circle-bg"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="progress-circle-value"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                    strokeDasharray="364.4"
                    strokeDashoffset={364.4 * (1 - project.pageSpeed.accessibility / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{project.pageSpeed.accessibility}</span>
                </div>
              </div>
              <span className="mt-4 text-lg font-medium">Accessibility</span>
            </div>
            <div className="pagespeed-item flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full progress-circle">
                  <circle
                    className="progress-circle-bg"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="progress-circle-value"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                    strokeDasharray="364.4"
                    strokeDashoffset={364.4 * (1 - project.pageSpeed.bestPractices / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{project.pageSpeed.bestPractices}</span>
                </div>
              </div>
              <span className="mt-4 text-lg font-medium">Best Practices</span>
            </div>
            <div className="pagespeed-item flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full progress-circle">
                  <circle
                    className="progress-circle-bg"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="progress-circle-value"
                    strokeWidth="8"
                    r="58"
                    cx="64"
                    cy="64"
                    strokeDasharray="364.4"
                    strokeDashoffset={364.4 * (1 - project.pageSpeed.seo / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{project.pageSpeed.seo}</span>
                </div>
              </div>
              <span className="mt-4 text-lg font-medium">SEO</span>
            </div>
          </div>
        )}

        {/* Project Description */}
        <div className="project-content prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ 
            __html: project.content.replace(
              /<div class="span4[^>]*>[\s\S]*?<\/div>/g,
              ''
            )
          }} />
        </div>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Technologies utilisées</h2>
            <div className="tech-tag-container">
              {technologies.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Gallery */}
        <div className="project-gallery">
          {project.content.match(/<img[^>]+src="([^"]+)"[^>]*>/g)?.map((img, index) => {
            const src = img.match(/src="([^"]+)"/)?.[1]
            if (!src) return null
            return (
              <div key={index} className="gallery-item">
                <img src={src} alt={`${project.title} screenshot ${index + 1}`} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 