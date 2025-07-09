// Version CommonJS de l'API pour next-sitemap
const API_BASE = 'https://portfolio.deussearch.fr/wp-json/wp/v2'

async function getPortfolioItems() {
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

async function getBlogPosts() {
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

module.exports = {
  getPortfolioItems,
  getBlogPosts
} 