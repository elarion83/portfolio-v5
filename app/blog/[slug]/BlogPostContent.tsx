'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin, MessageCircle, CalendarPlus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

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

interface PostNavigation {
  previous?: {
    title: string
    slug: string
  }
  next?: {
    title: string
    slug: string
  }
}

interface BlogPostContentProps {
  post: BlogPost
  navigation: PostNavigation
}

export function BlogPostContent({ post, navigation }: BlogPostContentProps) {
  const { language } = useLanguage()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = `https://nicolas-gruwe.fr/blog/${post.slug}`
    const text = post.title.rendered

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <>
      <div className="relative h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[3px]"
          style={{ 
            backgroundImage: `url(${post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.jpg'})`,
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-[#261939]/90 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-gray-400 hover:text-[#e28d1d] transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-400 hover:text-[#e28d1d] transition-colors"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-gray-400 hover:text-[#e28d1d] transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </Link>

        <article className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
          <div className="p-8">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-[#261939]/80 backdrop-blur-md rounded-xl border border-[#e28d1d]/20">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {language === 'fr' ? 'Besoin d\'aide pour votre projet ?' : 'Need help with your project?'}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {language === 'fr' 
                      ? 'Réservez un appel gratuit de 30 minutes pour discuter de vos besoins et découvrir comment je peux vous aider à atteindre vos objectifs.'
                      : 'Book a free 30-minute call to discuss your needs and discover how I can help you achieve your goals.'}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-[#e28d1d] rounded-full" />
                      {language === 'fr' ? 'Expertise technique approfondie' : 'Deep technical expertise'}
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-[#e28d1d] rounded-full" />
                      {language === 'fr' ? 'Solutions sur mesure' : 'Custom solutions'}
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-[#e28d1d] rounded-full" />
                      {language === 'fr' ? 'Accompagnement personnalisé' : 'Personalized support'}
                    </li>
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="https://calendly.com/gruwe-nicolas/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#e28d1d] text-white rounded-full font-semibold hover:bg-[#e28d1d]/90 transition-colors"
                  >
                    <CalendarPlus className="w-5 h-5" />
                    {language === 'fr' ? 'Réserver mon appel gratuit' : 'Book my free call'}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Post Navigation */}
        <nav className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          {navigation.previous && (
            <Link
              href={`/blog/${navigation.previous.slug}`}
              className="group flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#e28d1d]/30 transition-colors"
            >
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-[#e28d1d] transition-colors mb-2">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === 'fr' ? 'Article précédent' : 'Previous Post'}
                </span>
              </div>
              <h3 
                className="text-white group-hover:text-[#e28d1d] transition-colors line-clamp-2"
                dangerouslySetInnerHTML={{ __html: navigation.previous.title }}
              />
            </Link>
          )}
          
          {navigation.next && (
            <Link
              href={`/blog/${navigation.next.slug}`}
              className="group flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#e28d1d]/30 transition-colors text-right"
            >
              <div className="flex items-center justify-end gap-3 text-gray-400 group-hover:text-[#e28d1d] transition-colors mb-2">
                <span className="text-sm font-medium">
                  {language === 'fr' ? 'Article suivant' : 'Next Post'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 
                className="text-white group-hover:text-[#e28d1d] transition-colors line-clamp-2"
                dangerouslySetInnerHTML={{ __html: navigation.next.title }}
              />
            </Link>
          )}
        </nav>
      </div>
    </>
  )
} 