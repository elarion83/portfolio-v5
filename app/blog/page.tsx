import { Metadata } from 'next'
import { BlogContent } from './BlogContent'
import { getBlogPosts } from '../lib/api'
import { decodeHtmlEntities } from '../utils/textUtils'
import '../styles/pages.css'

// Force SSR pour cette page
export const dynamic = 'force-dynamic'

interface BlogPost {
  id: number
  title: {
    rendered: string
  }
  date: string
  excerpt?: {
    rendered: string
  }
  content?: {
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
  const posts = await getBlogPosts()
  return posts.map((post: BlogPost) => ({
    ...post,
    excerpt: {
      rendered: post.excerpt?.rendered?.replace(/<a class="more-link".*?<\/a>/g, '') || ''
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
    type: 'website',
    images: [
      {
        url: 'https://www.nicolas-gruwe.fr/img/portfolio.webp',
        width: 1200,
        height: 630,
        alt: 'Blog de Nicolas Gruwe',
      },
    ],
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
    <div className="min-h-screen bg-[#261939] blog-page flex-1">
      <BlogContent initialPosts={posts} />
    </div>
  )
} 