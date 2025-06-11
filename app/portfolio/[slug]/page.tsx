import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <article className="max-w-5xl mx-auto py-20 px-4">
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <img
            src={project.imageUrl}
            alt={project.title}
            width={1200}
            height={630}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {project.logoUrl && (
            <div className="absolute bottom-4 right-4">
              <img
                src={project.logoUrl}
                alt={`${project.title} logo`}
                className={`h-12 ${project.isDarkLogo ? 'brightness-0 invert' : ''}`}
              />
            </div>
          )}
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-foreground/80">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-background rounded-full text-xs font-medium border border-border">
                {project.year}
              </span>
              <span className="px-2 py-1 bg-background rounded-full text-xs font-medium border border-border">
                {project.department}
              </span>
              {project.mainTechnology && (
                <span className="px-2 py-1 bg-background rounded-full text-xs font-medium border border-border">
                  {project.mainTechnology}
                </span>
              )}
            </div>
          </div>
        </header>

        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />

        {project.pageSpeed && (
          <div className="mt-12 p-6 bg-background/50 rounded-xl border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              PageSpeed Insights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${project.pageSpeed.performance}, 100`}
                      className="text-primary"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {project.pageSpeed.performance}
                  </span>
                </div>
                <span className="text-sm text-foreground/80 mt-2">Performance</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${project.pageSpeed.accessibility}, 100`}
                      className="text-primary"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {project.pageSpeed.accessibility}
                  </span>
                </div>
                <span className="text-sm text-foreground/80 mt-2">Accessibilité</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${project.pageSpeed.bestPractices}, 100`}
                      className="text-primary"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {project.pageSpeed.bestPractices}
                  </span>
                </div>
                <span className="text-sm text-foreground/80 mt-2">Bonnes pratiques</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${project.pageSpeed.seo}, 100`}
                      className="text-primary"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {project.pageSpeed.seo}
                  </span>
                </div>
                <span className="text-sm text-foreground/80 mt-2">SEO</span>
              </div>
            </div>
          </div>
        )}

        {project.projectUrl && (
          <div className="mt-8">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span>Voir le projet</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </article>
    </div>
  )
} 