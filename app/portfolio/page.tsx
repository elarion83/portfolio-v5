import { Metadata } from 'next'
import { PortfolioContent } from '../components/PortfolioContent'

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
  
  interface WPResponse {
    id: number;
    title: {
      rendered: string;
    };
    excerpt?: {
      rendered: string;
    };
    content: {
      rendered: string;
    };
    acf?: {
      annee?: string;
      image_background?: string;
      logo_url?: string;
      logo_sombre?: boolean;
      socle_technique?: string;
      url_projet?: string;
      informations_pagespeed?: {
        performance: string;
        accessibilite: string;
        bonnes: string;
        seo: string;
      };
    };
    department_name?: string;
  }
  
  const formattedProjects = data.map((item: WPResponse) => ({
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

  return formattedProjects.sort((a: Project, b: Project) => {
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

export default async function PortfolioPage() {
  const projects = await getProjects()
  return <PortfolioContent initialProjects={projects} />
} 