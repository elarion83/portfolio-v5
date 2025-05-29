import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin, ArrowLeftCircle, ArrowRightCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CommentList } from '../components/CommentList';
import { CommentForm } from '../components/CommentForm';
import type { BlogPost, Comment } from '../types';

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

export const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
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

        document.title = `${postData[0].title.rendered}`;
        
        const description = postData[0].excerpt.rendered.replace(/<[^>]*>/g, '');
        const imageUrl = postData[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.jpg';
        const url = `https://nicolas-gruwe.fr/blog/${postData[0].slug}`;
        
        const metaTags = {
          'meta[name="description"]': description,
          'meta[property="og:title"]': `${postData[0].title.rendered} | Blog - Nicolas Gruwe`,
          'meta[property="og:description"]': description,
          'meta[property="og:image"]': imageUrl,
          'meta[property="og:url"]': url,
          'meta[property="twitter:title"]': `${postData[0].title.rendered} | Blog - Nicolas Gruwe`,
          'meta[property="twitter:description"]': description,
          'meta[property="twitter:image"]': imageUrl
        };

        Object.entries(metaTags).forEach(([selector, value]) => {
          const element = document.querySelector(selector);
          if (element) element.setAttribute('content', value);
        });
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
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#261939]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'fr' ? 'Retour au blog' : 'Back to blog'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#261939] to-gray-900">
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
            <div className="flex items-center justify-center gap-4 text-gray-300">
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
          to="/blog"
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
          </div>
        </article>

        {/* Post Navigation */}
        <nav className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          {navigation.previous && (
            <Link
              to={`/blog/${navigation.previous.slug}`}
              className="group flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#e28d1d]/30 transition-colors"
            >
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-[#e28d1d] transition-colors mb-2">
                <ArrowLeftCircle className="w-5 h-5" />
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
              to={`/blog/${navigation.next.slug}`}
              className="group flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#e28d1d]/30 transition-colors text-right"
            >
              <div className="flex items-center justify-end gap-3 text-gray-400 group-hover:text-[#e28d1d] transition-colors mb-2">
                <span className="text-sm font-medium">
                  {language === 'fr' ? 'Article suivant' : 'Next Post'}
                </span>
                <ArrowRightCircle className="w-5 h-5" />
              </div>
              <h3 
                className="text-white group-hover:text-[#e28d1d] transition-colors line-clamp-2"
                dangerouslySetInnerHTML={{ __html: navigation.next.title }}
              />
            </Link>
          )}
        </nav>

        {/* Comments Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 text-2xl font-bold text-white mb-8">
            <MessageCircle className="w-7 h-7" />
            {language === 'fr' ? 'Commentaires' : 'Comments'}
            <span className="text-[#e28d1d]">({comments.length})</span>
          </div>

          <div className="space-y-12">
            <CommentList comments={comments} />
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">
                {language === 'fr' ? 'Laisser un commentaire' : 'Leave a comment'}
              </h3>
              <CommentForm postId={post.id} onCommentSubmitted={handleCommentSubmitted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};