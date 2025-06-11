import { Metadata } from 'next'
import Link from 'next/link'
import { Filter, Calendar, Code } from 'lucide-react'

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

async function getProjects() {
  const res = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio?per_page=50', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data = await res.json()
  
  const formattedProjects = data.map((item: any) => ({
    id: item.id.toString(),
    title: item.title.rendered.replace(/\s*\(\d{4}\)$/, ''),
    slug: item.title.rendered
      .toLowerCase()
      .replace(/\s*\(\d{4}\)$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: item.excerpt?.rendered || '',
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

  return formattedProjects.sort((a, b) => {
    if (a.year === 'N/A') return 1
    if (b.year === 'N/A') return -1
    
    const yearA = parseInt(a.year.split(' ')[0])
    const yearB = parseInt(b.year.split(' ')[0])
    
    return yearB - yearA
  })
}

export const metadata: Metadata = {
  title: 'Portfolio - Nicolas Gruwe',
  description: 'Découvrez mes projets de développement WordPress et web sur mesure. Portfolio de Nicolas Gruwe, développeur freelance spécialisé en WordPress et React.',
  openGraph: {
    title: 'Portfolio - Nicolas Gruwe',
    description: 'Découvrez mes projets de développement WordPress et web sur mesure. Portfolio de Nicolas Gruwe, développeur freelance spécialisé en WordPress et React.',
    url: 'https://nicolas-gruwe.fr/portfolio',
    siteName: 'Nicolas Gruwe',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Nicolas Gruwe',
    description: 'Découvrez mes projets de développement WordPress et web sur mesure. Portfolio de Nicolas Gruwe, développeur freelance spécialisé en WordPress et React.',
  },
}

function renderYearBadge(year: string) {
  return (
    <span className="px-2 py-1 bg-background text-foreground rounded-full text-xs font-medium inline-flex items-center border border-border">
      <Calendar className="w-3 h-3 mr-1" />
      {year}
    </span>
  )
}

function renderTechBadge(project: Project) {
  if (!project.mainTechnology) return null

  return (
    <div className="absolute top-4 left-4 z-30">
      <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm text-foreground tech-badge-clip flex items-center gap-1.5 hover:border-primary/30 transition-colors shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3)]">
        <Code className="w-3.5 h-3.5 text-primary tech-badge-icon" />
        <span className="text-xs font-medium">{project.mainTechnology}</span>
      </div>
    </div>
  )
}

export default async function PortfolioPage() {
  const projects = await getProjects()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="py-20 px-4">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 title-neon">
            Portfolio
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Découvrez mes projets de développement WordPress et web sur mesure.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="relative group"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    width={600}
                    height={315}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {renderTechBadge(project)}
                  {renderYearBadge(project.year)}

                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">
                        {project.department}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 