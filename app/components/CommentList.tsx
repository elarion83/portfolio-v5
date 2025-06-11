'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'
import type { Comment } from '@/app/types'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e28d1d] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">{comment.author_name}</h4>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <time dateTime={comment.date}>{formatDate(comment.date)}</time>
              </div>
            </div>
          </div>
          <div 
            className="text-gray-300 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
          />
        </motion.div>
      ))}
    </div>
  );
} 