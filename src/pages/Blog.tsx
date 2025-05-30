import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader } from 'lucide-react';
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
    const title = language === 'fr' 
      ? 'Blog Dev Web pour Agences – WordPress & Optimisations'
      : 'Dev Blog for Agencies – WordPress & Optimization Tips';
    
    const description = language === 'fr'
      ? 'Tutoriels et astuces pro pour améliorer vos sites WordPress : SEO, sécurité, perf, automatisation.'
      : 'Pro tips and tutorials to improve WordPress sites: SEO, security, performance, automation.';
    
    const ogTitle = language === 'fr'
      ? 'Blog Technique WordPress – Pour Freelances & Agences'
      : 'Technical WordPress Blog – For Freelancers & Agencies';
    
    const ogDescription = language === 'fr'
      ? 'Articles orientés développement WordPress, bonne pratiques, outils pour agences.'
      : 'Articles focused on WordPress development, best practices, and tools for agencies.';

    document.title = title;
    
    const metaTags = {
      'meta[name="description"]': description,
      'meta[property="og:title"]': ogTitle,
      'meta[property="og:description"]': ogDescription,
      'meta[property="twitter:title"]': ogTitle,
      'meta[property="twitter:description"]': ogDescription,
      'link[rel="canonical"]': 'https://nicolas-gruwe.fr/blog'
    };

    Object.entries(metaTags).forEach(([selector, content]) => {
      const element = document.querySelector(selector);
      if (element) {
        if (selector === 'link[rel="canonical"]') {
          element.setAttribute('href', content);
        } else {
          element.setAttribute('content', content);
        }
      }
    });
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
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-12 title-neon text-center"
        >
          Blog
        </motion.h1>

        <div className="grid gap-8">
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                {(post.featured_image_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url) && (
                  <img
                    src={post.featured_image_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={post.title.rendered}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[#e28d1d] mb-4">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <h2 
                    className="text-2xl font-bold text-white mb-4 hover:text-[#e28d1d] transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div 
                    className="text-gray-300 mb-6"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div
                    className="inline-flex items-center gap-2 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
                  >
                    {language === 'fr' ? 'Lire la suite' : 'Read more'} 
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};