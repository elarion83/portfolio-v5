/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.nicolas-gruwe.fr',
  generateRobotsTxt: false, // On a déjà créé notre robots.txt personnalisé
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: [
    '/_next/*',
    '/404',
    '/500',
  ],
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    // Ajout des routes dynamiques du portfolio et du blog
    const result = []

    // Portfolio
    try {
      const portfolioRes = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio?per_page=50')
      const portfolioItems = await portfolioRes.json()
      
      for (const item of portfolioItems) {
        result.push({
          loc: `/portfolio/${item.slug}`,
          changefreq: 'monthly',
          priority: 0.8,
          lastmod: item.modified ? new Date(item.modified).toISOString() : new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du portfolio:', error)
    }

    // Blog
    try {
      const blogRes = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/posts?per_page=50')
      const blogPosts = await blogRes.json()
      
      for (const post of blogPosts) {
        result.push({
          loc: `/blog/${post.slug}`,
          changefreq: 'monthly',
          priority: 0.8,
          lastmod: post.modified ? new Date(post.modified).toISOString() : new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error)
    }

    return result
  }
} 