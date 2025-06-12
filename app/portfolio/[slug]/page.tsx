import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Code, Briefcase, Eye, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import '@/app/styles/project.css'
import { BlurredTitle } from '@/app/components/BlurredTitle'

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
    imageUrl: item.acf?.image_background || '/img/portfolio.webp',
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
  const techMatch = project.content.match(/<li><a>(.*?)<\/a><\/li>/g)
  const technologies = techMatch ? techMatch.map(t => t.replace(/<li><a>(.*?)<\/a><\/li>/, '$1')) : []

  // Traiter le contenu
  const contentParts = project.content.split('<div class="span4 offset">');
  const mainContent = contentParts[0];

  // Extraire les images
  const imageMatches = project.content.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || [];
  const uniqueImages = Array.from(new Set(imageMatches
    .map(img => {
      const srcMatch = img.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : null;
    })
    .filter((src): src is string => src !== null)
  ));

  return (
    <div className="min-h-screen bg-[#261939]">
      {/* Hero Section */}
      <div className="project-hero pt-5 md:pt-0">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="project-hero-image"
        />
        <div className="project-hero-overlay" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex mt-6 flex-col justify-end px-4 py-12">
          <div className="max-w-7xl mt-6 mx-auto w-full">
            {/* Back Button */}
            <Link 
              href="/portfolio" 
              className="inline-flex items-center gap-2 px-4 py-2 mt-6 mb-6 bg-[#261939]/80 backdrop-blur-sm rounded-full text-white border-2 border-[#e28d1d] hover:bg-[#e28d1d] transition-all duration-300 md:text-base text-sm order-first md:order-none"
            >
              <ArrowLeft className="w-4 h-4 md:block hidden" />
              <span className="md:inline hidden">Retour au portfolio</span>
              <ArrowLeft className="w-4 h-4 md:hidden" />
            </Link>

            {/* Title and Logo */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-2 md:gap-0">
              <h1 className="project-title mb-0">
                <BlurredTitle title={project.title} />
              </h1>
              {project.logoUrl && (
                <img
                  src={project.logoUrl}
                  alt={`${project.title} logo`}
                  className={`w-[150px] h-auto object-contain ${project.isDarkLogo ? 'brightness-0 invert' : ''} hidden md:block`}
                />
              )}
            </div>

            {/* Project Meta + Back Button (mobile) */}
            <div className="flex flex-row items-center gap-2 md:mb-8 mt-2 md:mt-0 project-meta md:flex-wrap md:items-center md:gap-4">
              <div className="meta-badge text-[0.7rem] md:text-base px-1 py-0.5 md:px-3 md:py-1.5">
                <Calendar className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                <span className="text-white">{project.year}</span>
              </div>
              {project.mainTechnology && (
                <div className="meta-badge text-[0.7rem] md:text-base px-1 py-0.5 px-1 md:px-3 md:py-1.5">
                  <Code className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                  <span className="text-white">{project.mainTechnology}</span>
                </div>
              )}
              <div className="meta-badge text-[0.7rem] md:text-base px-1 py-0.5 md:px-3 md:py-1.5">
                <Briefcase className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                <span className="text-white">{project.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Project Description */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 mb-12 project-content">
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: mainContent }} />
              </div>
            </div>

            {/* Project Images */}
            {uniqueImages.length > 0 && (
              <div className="project-images">
                {uniqueImages.map((src, index) => (
                  <div key={`img-${src}-${index}`} className="project-image glass-card">
                    <img 
                      src={src} 
                      alt={`${project.title} screenshot ${index + 1}`} 
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-white text-sm font-medium">Vue {index + 1}</span>
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Project Link */}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button w-full py-4 px-6 flex items-center justify-center gap-2 text-white font-medium"
              >
                <span>Voir le projet</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            )}

            {/* PageSpeed Insights */}
            {project.pageSpeed && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-8">Performance</h2>
                <div className="space-y-6">
                  {Object.entries(project.pageSpeed).map(([key, value], index) => (
                    <div key={key} className="pagespeed-item">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400 capitalize">
                          {key === 'bestPractices' ? 'Best Practices' : key}
                        </span>
                        <span className="text-white font-medium">{value}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ '--score': `${value}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Technologies</h2>
                <div className="tech-grid">
                  {technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 