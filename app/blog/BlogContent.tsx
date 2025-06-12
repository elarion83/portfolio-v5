'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { ConstellationBackground } from '@/app/components/ConstellationBackground'

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
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
  }
}

interface BlogContentProps {
  initialPosts: BlogPost[]
}

export function BlogContent({ initialPosts }: BlogContentProps) {
  const { language } = useLanguage()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return language === 'fr' ? `${minutes} min de lecture` : `${minutes} min read`
  }

  return (
    <>
      <div className="fixed inset-0 z-0">
        <ConstellationBackground />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-12 title-neon text-center"
        >
          Blog
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialPosts.map((post, index) => {
            const isFeature = index === 0
            const isSecondary = index === 1 || index === 2

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-xl border border-white/10 ${
                  isFeature ? 'md:col-span-2 md:row-span-2' : ''
                } ${isSecondary ? 'md:col-span-1 md:row-span-1' : ''}`}
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="absolute inset-0">
                    <img
                      src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.webp'}
                      alt={post.title.rendered}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#261939] via-[#261939]/80 to-transparent" />
                  </div>

                  <div className="relative h-full p-6 flex flex-col justify-end">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#261939]/80 backdrop-blur-sm rounded-full text-sm">
                        <Calendar className="w-4 h-4 text-[#e28d1d]" />
                        <time dateTime={post.date} className="text-gray-300">{formatDate(post.date)}</time>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#261939]/80 backdrop-blur-sm rounded-full text-sm">
                        <Clock className="w-4 h-4 text-[#e28d1d]" />
                        <span className="text-gray-300">{getReadTime(post.content.rendered)}</span>
                      </div>
                    </div>

                    <h2 
                      className={`font-bold text-white mb-3 group-hover:text-[#e28d1d] transition-colors ${
                        isFeature ? 'text-3xl' : 'text-xl'
                      }`}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    <div 
                      className="text-gray-300 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />

                    <div className="flex items-center gap-2 text-[#e28d1d] group-hover:translate-x-2 transition-transform">
                      <span>{language === 'fr' ? 'Lire la suite' : 'Read more'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </>
  )
} 