/** URL de base de l'API WordPress (portfolio, posts, etc.) */
export const API_BASE = 'https://portfolio.deussearch.fr/wp-json/wp/v2'

/** URL complète des items portfolio. Le "type de business" (filtre) vient du champ `department_name` dans la réponse JSON ; si absent ou vide, l’app affiche "Other". Vérifier que la taxonomie/custom field est exposée dans l’API (ex. _embed ou register_rest_field). */
export const API_PORTFOLIO_URL = `${API_BASE}/portfolio`

export async function getPortfolioItems() {
  // Temporairement désactiver le cache pour forcer la mise à jour
  const res = await fetch(`${API_PORTFOLIO_URL}?per_page=50&_t=${Date.now()}`, {
    next: {
      revalidate: 0, // Pas de cache
    },
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'application/json',
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch portfolio items')
  }

  return res.json()
}

/** Format utilisé pour le slider de la home (5 derniers projets) */
export interface HomeProjectItem {
  id: string
  title: string
  slug: string
  description: string
  /** Extrait du contenu (HTML strippé, ~300 caractères) */
  contentExcerpt: string
  year: string
  imageUrl: string
  logoUrl?: string
  isDarkLogo?: boolean
  mainTechnology?: string
  department?: string
  pageSpeed: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  } | null
}

function decodeHtmlEntities(text: string): string {
  if (!text) return ''
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
    .replace(/&#8216;/g, "'")
}

const EXCERPT_MAX_LENGTH = 320

function excerptFromHtml(html: string, maxLen: number): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLen) return text
  const cut = text.slice(0, maxLen).lastIndexOf(' ')
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, maxLen)) + '…'
}

export async function getLatestProjectsForHome(limit = 5): Promise<HomeProjectItem[]> {
  const data = await getPortfolioItems()
  interface WPItem {
    id: number
    title: { rendered: string }
    excerpt?: { rendered: string }
    content?: { rendered: string }
    acf?: {
      annee?: string
      image_background?: string
      logo_url?: string
      logo_sombre?: boolean
      socle_technique?: string
      informations_pagespeed?: {
        performance?: string
        accessibilite?: string
        bonnes?: string
        seo?: string
      }
    }
    department_name?: string
    yoast_head_json?: { og_image?: Array<{ url?: string }> }
  }
  const formatted = (data as WPItem[]).map((item) => {
    const rawContent = item.content?.rendered || ''
    return {
      id: item.id.toString(),
      title: decodeHtmlEntities(item.title.rendered.replace(/\s*\(\d{4}\)$/, '')),
      slug: item.title.rendered
        .toLowerCase()
        .replace(/\s*\(\d{4}\)$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      description: item.excerpt?.rendered || '',
      contentExcerpt: excerptFromHtml(rawContent || item.excerpt?.rendered || '', EXCERPT_MAX_LENGTH),
      year: item.acf?.annee || 'N/A',
      imageUrl: item.acf?.image_background || item.yoast_head_json?.og_image?.[0]?.url || '/img/portfolio.webp',
      logoUrl: item.yoast_head_json?.og_image?.[0]?.url || item.acf?.logo_url || undefined,
      isDarkLogo: item.acf?.logo_sombre === true,
      mainTechnology: item.acf?.socle_technique || undefined,
      department: item.department_name || undefined,
      pageSpeed: item.acf?.informations_pagespeed
        ? {
            performance: parseInt(item.acf.informations_pagespeed.performance ?? '', 10) || 0,
            accessibility: parseInt(item.acf.informations_pagespeed.accessibilite ?? '', 10) || 0,
            bestPractices: parseInt(item.acf.informations_pagespeed.bonnes ?? '', 10) || 0,
            seo: parseInt(item.acf.informations_pagespeed.seo ?? '', 10) || 0,
          }
        : null,
    }
  })
  const sorted = formatted.sort((a, b) => {
    if (a.year === 'N/A') return 1
    if (b.year === 'N/A') return -1
    const yearA = parseInt(a.year.split(' ')[0], 10) || 0
    const yearB = parseInt(b.year.split(' ')[0], 10) || 0
    return yearB - yearA
  })
  return sorted.slice(0, limit)
}

export async function getBlogPosts() {
  const options = process.env.NODE_ENV === 'production' ? {
    next: { 
      revalidate: 3600, // 1h
      tags: ['blog']
    }
  } : {}
  
  const res = await fetch(`${API_BASE}/posts?per_page=100&_embed`, {
    ...options
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts')
  }

  return res.json()
}

export async function getPortfolioItem(slug: string) {
  const options = process.env.NODE_ENV === 'production' ? {
    next: { 
      revalidate: 86400,
      tags: ['portfolio']
    }
  } : {}
  
  const res = await fetch(`${API_BASE}/portfolio?slug=${slug}`, {
    ...options
  })

  if (!res.ok) {
    throw new Error('Failed to fetch portfolio item')
  }

  const items = await res.json()
  return items[0] || null
}

export async function getBlogPost(slug: string) {
  const options = process.env.NODE_ENV === 'production' ? {
    next: { 
      revalidate: 3600,
      tags: ['blog']
    }
  } : {}
  
  const res = await fetch(`${API_BASE}/posts?slug=${slug}&_embed`, {
    ...options
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog post')
  }

  const posts = await res.json()
  return posts[0] || null
}

export async function getTestimonials() {
  const options = process.env.NODE_ENV === 'production' ? {
    next: { 
      revalidate: 86400, // 24h
      tags: ['testimonials']
    }
  } : {}
  
  const res = await fetch(`${API_BASE}/temoignage?per_page=50`, {
    ...options
  })

  if (!res.ok) {
    throw new Error('Failed to fetch testimonials')
  }

  return res.json()
} 