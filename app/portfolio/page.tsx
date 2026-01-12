import { Metadata } from 'next'
import { PortfolioContent } from '../components/PortfolioContent'

// Force SSR pour cette page
export const dynamic = 'force-dynamic'

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

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'");
}

import { getPortfolioItems } from '../lib/api'

async function getProjects() {
  const data = await getPortfolioItems()
  
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
    yoast_head_json?: {
      og_image?: Array<{
        url?: string;
      }>;
    };
  }
  
  const formattedProjects = data.map((item: WPResponse) => ({
    id: item.id.toString(),
    title: decodeHtmlEntities(item.title.rendered.replace(/\s*\(\d{4}\)$/, '')),
    slug: item.title.rendered
      .toLowerCase()
      .replace(/\s*\(\d{4}\)$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: item.excerpt?.rendered || '',
    content: item.content.rendered,
    year: item.acf?.annee || 'N/A',
    imageUrl: item.acf?.image_background || '/img/portfolio.webp',
    logoUrl: item.yoast_head_json?.og_image?.[0]?.url || item.acf?.logo_url || '',
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
    images: [
      {
        url: 'https://www.nicolas-gruwe.fr/img/portfolio.webp',
        width: 1200,
        height: 630,
        alt: 'Portfolio de Nicolas Gruwe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Nicolas Gruwe',
    description: 'Découvrez mes projets de développement WordPress et web sur mesure. Portfolio de Nicolas Gruwe, développeur freelance spécialisé en WordPress et React.',
  },
}

// Force la revalidation des données
export const revalidate = 0

export default async function PortfolioPage() {
  const projects = await getProjects()
  return <PortfolioContent initialProjects={projects} />
} 