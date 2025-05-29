import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import type { CommentFormData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CommentSuccessAnimation } from './CommentSuccessAnimation';

interface CommentFormProps {
  postId: number;
  onCommentSubmitted: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentSubmitted }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [errors, setErrors] = useState<Partial<CommentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CommentFormData> = {};
    
    if (!formData.author_name.trim()) {
      newErrors.author_name = language === 'fr' ? 'Le nom est requis' : 'Name is required';
    }
    
    if (!formData.author_email.trim()) {
      newErrors.author_email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.author_email)) {
      newErrors.author_email = language === 'fr' ? 'Email invalide' : 'Invalid email address';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = language === 'fr' ? 'Le commentaire est requis' : 'Comment is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          post: postId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }
      
      setFormData({
        author_name: '',
        author_email: '',
        content: ''
      });
      setShowSuccess(true);
      onCommentSubmitted();
    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmitError(
        language === 'fr'
          ? 'Une erreur est survenue lors de l\'envoi du commentaire'
          : 'An error occurred while submitting the comment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CommentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess && (
          <CommentSuccessAnimation onComplete={() => setShowSuccess(false)} />
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="author_name" className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'fr' ? 'Nom' : 'Name'}
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.author_name ? 'border-red-500' : 'border-white/10'
              } rounded-lg focus:outline-none focus:border-[#e28d1d] text-white placeholder-gray-500 transition-colors`}
              placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
            />
            {errors.author_name && (
              <p className="mt-1 text-sm text-red-500">{errors.author_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="author_email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="author_email"
              name="author_email"
              value={formData.author_email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.author_email ? 'border-red-500' : 'border-white/10'
              } rounded-lg focus:outline-none focus:border-[#e28d1d] text-white placeholder-gray-500 transition-colors`}
              placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
            />
            {errors.author_email && (
              <p className="mt-1 text-sm text-red-500">{errors.author_email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
            {language === 'fr' ? 'Commentaire' : 'Comment'}
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 bg-white/5 border ${
              errors.content ? 'border-red-500' : 'border-white/10'
            } rounded-lg focus:outline-none focus:border-[#e28d1d] text-white placeholder-gray-500 transition-colors resize-none`}
            placeholder={language === 'fr' ? 'Votre commentaire...' : 'Your comment...'}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{submitError}</span>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className={`w-full px-6 py-4 bg-gradient-to-r from-[#e28d1d] to-[#e28d1d]/80 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {language === 'fr' ? 'Envoyer le commentaire' : 'Submit comment'} 
              <Send className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>
    </>
  );
};