'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin, MessageCircle, CalendarPlus, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { CommentList } from '@/app/components/CommentList'
import { CommentForm } from '@/app/components/CommentForm'
import type { BlogPost, Comment } from '@/app/types'
import { BlogCTA } from '@/app/components/BlogCTA'

interface PostNavigation {
  previous?: {
    title: string;
    slug: string;
  };
  next?: {
    title: string;
    slug: string;
  };
}

export function BlogPostContent({ params }: { params: { slug: string } }) {
  const postId = params.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [navigation, setNavigation] = useState<PostNavigation>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && postId) {
      canonicalLink.setAttribute('href', `https://nicolas-gruwe.fr/blog/${postId}`);
    }
  }, [postId]);

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`https://portfolio.deussearch.fr/wp-json/wp/v2/comments?post=${postId}&order=desc`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postResponse, allPostsResponse] = await Promise.all([
          fetch(`https://portfolio.deussearch.fr/wp-json/wp/v2/posts?slug=${postId}&_embed`),
          fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/posts?per_page=100&_fields=title,slug')
        ]);

        if (!postResponse.ok || !allPostsResponse.ok) {
          throw new Error('Post not found');
        }

        const [postData, allPosts] = await Promise.all([
          postResponse.json(),
          allPostsResponse.json()
        ]);

        if (postData.length === 0) {
          throw new Error('Post not found');
        }

        setPost(postData[0]);
        fetchComments(postData[0].id);
        
        // Set up navigation
        const currentIndex = allPosts.findIndex((p: any) => p.slug === postId);
        if (currentIndex !== -1) {
          const nav: PostNavigation = {};
          if (currentIndex > 0) {
            nav.previous = {
              title: allPosts[currentIndex - 1].title.rendered,
              slug: allPosts[currentIndex - 1].slug
            };
          }
          if (currentIndex < allPosts.length - 1) {
            nav.next = {
              title: allPosts[currentIndex + 1].title.rendered,
              slug: allPosts[currentIndex + 1].slug
            };
          }
          setNavigation(nav);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!post) return;

    const url = `https://nicolas-gruwe.fr/blog/${post.slug}`;
    const text = post.title.rendered;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCommentSubmitted = () => {
    if (post) {
      fetchComments(post.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#261939]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'fr' ? 'Retour au blog' : 'Back to blog'}
          </Link>
        </div>
      </div>
    );
  }

  const postTitle = post.title.rendered;
  const postDescription = post.excerpt.rendered.replace(/<[^>]*>/g, '');
  const postImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.jpg';
  const postUrl = `https://nicolas-gruwe.fr/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#261939] to-gray-900">
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-700 ease-out hover:scale-110"
          style={{ 
            backgroundImage: `url(${post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.jpg'})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#261939]/70 via-[#261939]/80 to-[#261939]" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full mx-auto text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight mt-10 md:mt-0"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-6 text-gray-300"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-[#e28d1d]" />
                <time dateTime={post.date} className="text-sm font-medium">{formatDate(post.date)}</time>
              </div>
              <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-1.5 text-gray-400 hover:text-[#e28d1d] transition-all hover:scale-110"
                  title="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-1.5 text-gray-400 hover:text-[#e28d1d] transition-all hover:scale-110"
                  title="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-1.5 text-gray-400 hover:text-[#e28d1d] transition-all hover:scale-110"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-all hover:translate-x-[-4px] mb-6 md:mb-12 group text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">{language === 'fr' ? 'Retour au blog' : 'Back to blog'}</span>
        </Link>

        <article className="prose prose-invert prose-lg max-w-none">
          <style jsx global>{`
            .prose {
              color: #e5e7eb;
            }
            .prose h2 {
              color: white;
              font-size: 2rem;
              margin-top: 2.5rem;
              margin-bottom: 1.5rem;
              font-weight: 700;
              line-height: 1.3;
              letter-spacing: -0.025em;
            }
            .prose h3 {
              color: white;
              font-size: 1.5rem;
              margin-top: 2rem;
              margin-bottom: 1rem;
              font-weight: 600;
            }
            .prose p {
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
              line-height: 1.8;
            }
            .prose p:first-child {
              margin-top: 0;
            }
            .prose h2:first-child {
              margin-top: 0;
            }
            .prose a {
              color: #e28d1d;
              text-decoration: none;
              transition: all 0.2s;
            }
            .prose a:hover {
              color: #f4a340;
            }
            .prose strong {
              color: white;
              font-weight: 600;
            }
            .prose blockquote {
              border-left-color: #e28d1d;
              background-color: rgba(255, 255, 255, 0.05);
              padding: 1rem 1.5rem;
              margin: 2rem 0;
              border-radius: 0.5rem;
            }
            .prose blockquote p {
              margin: 0;
              font-style: italic;
              color: #e5e7eb;
            }
            .prose ul, .prose ol {
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
              padding-left: 1.5rem;
            }
            .prose li {
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
            }
            .prose img {
              border-radius: 0.75rem;
              margin: 2rem auto;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .prose code {
              background-color: rgba(255, 255, 255, 0.1);
              color: #e28d1d;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-size: 0.875em;
            }
            .prose pre {
              background-color: #1a1a1a !important;
              border-radius: 0.75rem;
              padding: 1.5rem !important;
              margin: 2rem 0;
              overflow-x: auto;
            }
            .prose pre code {
              background-color: transparent;
              color: inherit;
              padding: 0;
              font-size: 0.875em;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          
          <BlogCTA />
        </article>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {navigation.previous && (
              <Link
                href={`/blog/${navigation.previous.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:translate-x-[-4px] max-w-[300px]"
                title={`Article précédent : ${navigation.previous.title}`}
              >
                <ArrowLeft className="w-5 h-5 text-[#e28d1d] transition-transform group-hover:scale-110" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">{language === 'fr' ? 'Article précédent' : 'Previous article'}</div>
                  <div className="text-white font-medium line-clamp-1">{navigation.previous.title}</div>
                </div>
              </Link>
            )}
            {navigation.next && (
              <Link
                href={`/blog/${navigation.next.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:translate-x-[4px] ml-auto max-w-[300px]"
                title={`Article suivant : ${navigation.next.title}`}
              >
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">{language === 'fr' ? 'Article suivant' : 'Next article'}</div>
                  <div className="text-white font-medium line-clamp-1">{navigation.next.title}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#e28d1d] transition-transform group-hover:scale-110" />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-[#e28d1d]" />
            {language === 'fr' ? 'Commentaires' : 'Comments'}
          </h2>
          <CommentList comments={comments} />
          <CommentForm postId={post.id} onCommentSubmitted={handleCommentSubmitted} />
        </div>
      </div>
    </div>
  );
} 