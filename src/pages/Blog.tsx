import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader, Clock, Eye, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConstellationBackground } from '../components/ConstellationBackground';

interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  date: string;
  excerpt: {
    rendered: string;
  };
  slug: string;
  featured_image_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    document.title = language === 'fr' 
      ? 'Blog Dev Web pour Agences – WordPress & Optimisations'
      : 'Dev Blog for Agencies – WordPress & Optimization Tips';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', language === 'fr'
        ? 'Tutoriels et astuces pro pour améliorer vos sites WordPress : SEO, sécurité, perf, automatisation.'
        : 'Pro tips and tutorials to improve WordPress sites: SEO, security, performance, automation.'
      );
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', language === 'fr'
        ? 'Blog Technique WordPress – Pour Freelances & Agences'
        : 'Technical WordPress Blog – For Freelancers & Agencies'
      );
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', language === 'fr'
        ? 'Articles orientés développement WordPress, bonne pratiques, outils pour agences.'
        : 'Articles focused on WordPress development, best practices, and tools for agencies.'
      );
    }

    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', language === 'fr'
        ? 'Blog Technique WordPress – Pour Freelances & Agences'
        : 'Technical WordPress Blog – For Freelancers & Agencies'
      );
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', language === 'fr'
        ? 'Articles orientés développement WordPress, bonne pratiques, outils pour agences.'
        : 'Articles focused on WordPress development, best practices, and tools for agencies.'
      );
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://nicolas-gruwe.fr/blog');
    }
  }, [language]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/posts?_embed');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.map((post: BlogPost) => ({
          ...post,
          excerpt: {
            rendered: post.excerpt.rendered.replace(/<a class="more-link".*?<\/a>/g, '')
          }
        })));
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(language === 'fr' ? 'Erreur lors du chargement des articles' : 'Error loading posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return language === 'fr' ? `${minutes} min de lecture` : `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#261939] to-gray-900 py-16 px-4 relative">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const isFeature = index === 0;
            const isSecondary = index === 1 || index === 2;
            
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
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="relative h-full">
                    <div className="absolute inset-0">
                      <img
                        src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#261939] via-[#261939]/60 to-transparent" />
                    </div>
                    
                    <div className="relative h-full p-6 flex flex-col justify-end">
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#e28d1d]" />
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#e28d1d]" />
                          <span>{getReadTime(post.content.rendered)}</span>
                        </div>
                      </div>
                      
                      <h2 
                        className={`font-bold text-white mb-3 group-hover:text-[#e28d1d] transition-colors ${
                          isFeature ? 'text-3xl' : 'text-xl'
                        }`}
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      
                      {(isFeature || isSecondary) && (
                        <div 
                          className="text-gray-300 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                        />
                      )}
                      
                      <div className="flex items-center gap-2 text-[#e28d1d] group-hover:translate-x-2 transition-transform">
                        <span>{language === 'fr' ? 'Lire la suite' : 'Read more'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
};