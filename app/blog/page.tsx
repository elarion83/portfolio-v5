import { Metadata } from 'next'
import { BlogContent } from './BlogContent'

interface BlogPost {
  id: number
  title: {
    rendered: string
  }
  date: string
  excerpt: {
    rendered: string
  }
  content: {
    rendered: string
  }
  slug: string
  featured_image_url?: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
  }
}

export const revalidate = 3600 // Revalidate every hour

async function getPosts() {
  const res = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/posts?_embed', {
    next: { revalidate: 3600 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  const posts = await res.json()
  return posts.map((post: BlogPost) => ({
    ...post,
    excerpt: {
      rendered: post.excerpt.rendered.replace(/<a class="more-link".*?<\/a>/g, '')
    }
  }))
}

export const metadata: Metadata = {
  title: 'Blog Dev Web pour Agences – WordPress & Optimisations',
  description: 'Tutoriels et astuces pro pour améliorer vos sites WordPress : SEO, sécurité, perf, automatisation.',
  openGraph: {
    title: 'Blog Technique WordPress – Pour Freelances & Agences',
    description: 'Articles orientés développement WordPress, bonne pratiques, outils pour agences.',
    url: 'https://nicolas-gruwe.fr/blog',
    siteName: 'Nicolas Gruwe - Blog',
    type: 'website'
  },
  twitter: {
    title: 'Blog Technique WordPress – Pour Freelances & Agences',
    description: 'Articles orientés développement WordPress, bonne pratiques, outils pour agences.',
    card: 'summary_large_image'
  },
  alternates: {
    canonical: 'https://nicolas-gruwe.fr/blog'
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#261939] to-gray-900 py-16 px-4 relative">
      <BlogContent initialPosts={posts} />
    </div>
  )
} 