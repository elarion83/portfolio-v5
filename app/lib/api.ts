const API_BASE = 'https://portfolio.deussearch.fr/wp-json/wp/v2'

export async function getPortfolioItems() {
  const res = await fetch(`${API_BASE}/portfolio?per_page=50`, {
    next: { 
      revalidate: 86400, // 24h
      tags: ['portfolio'] 
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

export async function getBlogPosts() {
  const res = await fetch(`${API_BASE}/posts?per_page=100&_fields=title,slug,excerpt,date`, {
    next: { 
      revalidate: 3600, // 1h
      tags: ['blog']
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts')
  }

  return res.json()
}

export async function getPortfolioItem(slug: string) {
  const res = await fetch(`${API_BASE}/portfolio?slug=${slug}`, {
    next: { 
      revalidate: 86400,
      tags: ['portfolio']
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch portfolio item')
  }

  const items = await res.json()
  return items[0] || null
}

export async function getBlogPost(slug: string) {
  const res = await fetch(`${API_BASE}/posts?slug=${slug}&_fields=title,slug,excerpt,date,content`, {
    next: { 
      revalidate: 3600,
      tags: ['blog']
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog post')
  }

  const posts = await res.json()
  return posts[0] || null
}

export async function getTestimonials() {
  const res = await fetch(`${API_BASE}/temoignage?per_page=50`, {
    next: { 
      revalidate: 86400, // 24h
      tags: ['testimonials']
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch testimonials')
  }

  return res.json()
} 