const API_BASE = 'https://portfolio.deussearch.fr/wp-json/wp/v2'

export async function getPortfolioItems() {
  const options = process.env.NODE_ENV === 'production' ? {
    next: {
      revalidate: 60, // Temporairement réduit à 1 minute pour forcer la mise à jour
      tags: ['portfolio']
    }
  } : {}

  const res = await fetch(`${API_BASE}/portfolio?per_page=50`, {
    ...options,
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