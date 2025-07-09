import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPostContent } from './BlogPostContent'
import { decodeHtmlEntities } from '../../utils/textUtils'
import { BlogCTA } from '@/app/components/BlogCTA'
import { getBlogPosts, getBlogPost } from '../../lib/api'

interface BlogPost {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  modified: string
  slug: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
  }
}

export const revalidate = 3600 // Revalidate every hour

async function getPost(slug: string): Promise<BlogPost> {
  try {
    return await getBlogPost(slug)
  } catch (error) {
    notFound()
  }
}

async function getAllPosts() {
  return await getBlogPosts()
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  const postTitle = post.title.rendered
  const postDescription = post.excerpt.rendered.replace(/<[^>]*>/g, '')
  const postImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.jpg'
  const postUrl = `https://nicolas-gruwe.fr/blog/${post.slug}`

  return {
    title: `${postTitle} | Blog - Nicolas Gruwe`,
    description: postDescription,
    openGraph: {
      title: `${postTitle} | Blog - Nicolas Gruwe`,
      description: postDescription,
      url: postUrl,
      siteName: 'Nicolas Gruwe - Blog',
      type: 'article',
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: postTitle
        }
      ],
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ['Nicolas Gruwe']
    },
    twitter: {
      card: 'summary_large_image',
      title: `${postTitle} | Blog - Nicolas Gruwe`,
      description: postDescription,
      images: [postImage]
    },
    alternates: {
      canonical: postUrl
    }
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post: { slug: string }) => ({
    slug: post.slug
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <BlogPostContent params={params} />
} 