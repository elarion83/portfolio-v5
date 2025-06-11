'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, Linkedin, Github, ArrowRight, MessageCircle, CheckCircle, AlertCircle, CalendarPlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { EmailSuccessAnimation } from '../components/EmailSuccessAnimation';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactContent() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = language === 'fr' ? 'Le nom est requis' : 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'Email invalide' : 'Invalid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = language === 'fr' ? 'Le message est requis' : 'Message is required';
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
    setSubmitStatus(null);
    
    try {
      const response = await fetch('https://api.deussearch.fr/portfolio_sendemail.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ...formData,
          email_user: process.env.NEXT_PUBLIC_EMAIL_USER || ''
        }).toString()
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      setSubmitStatus('success');
      setShowSuccessAnimation(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-8"
      style={{ 
        backgroundImage: 'url(/img/contact.jpg)',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(38, 25, 57, 0.95)'
      }}
    >
      <AnimatePresence>
        {showSuccessAnimation && (
          <EmailSuccessAnimation onComplete={() => setShowSuccessAnimation(false)} />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 md:order-1"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-2 title-neon">{t('contact.form.title')}</h2>
              <p className="text-gray-400 mb-8">{t('contact.form.description')}</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    {t('contact.form.name')}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.name ? 'border-red-500' : 'border-white/10'
                    } rounded-lg focus:outline-none focus:border-[#e28d1d] text-white placeholder-gray-500 transition-colors`}
                    placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    } rounded-lg focus:outline-none focus:border-[#e28d1d] text-white placeholder-gray-500 transition-colors`}
                    placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.message ? 'border-red-500' : 'border-white/10'
                    } rounded-lg focus:outline-none focus:border-[#e28d1d] text-white placeholder-gray-500 transition-colors resize-none`}
                    placeholder={language === 'fr' ? 'Votre message...' : 'Your message...'}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>{language === 'fr' ? 'Erreur lors de l\'envoi. Veuillez réessayer.' : 'Error sending message. Please try again.'}</span>
                  </motion.div>
                )}
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#e28d1d] text-white rounded-lg font-semibold hover:bg-[#e28d1d]/90 transition-colors ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting 
                    ? (language === 'fr' ? 'Envoi en cours...' : 'Sending...')
                    : (language === 'fr' ? 'Envoyer le message' : 'Send message')
                  }
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-1 md:order-2"
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 title-neon">{t('contact.info.title')}</h2>
                <p className="text-gray-400">{t('contact.info.description')}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#e28d1d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{t('contact.info.email.title')}</h3>
                    <p className="text-gray-400">{t('contact.info.email.description')}</p>
                    <a href="mailto:contact@nicolas-gruwe.fr" className="text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors">
                      contact@nicolas-gruwe.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#e28d1d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{t('contact.info.location.title')}</h3>
                    <p className="text-gray-400">{t('contact.info.location.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-[#e28d1d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{t('contact.info.chat.title')}</h3>
                    <p className="text-gray-400 mb-2">{t('contact.info.chat.description')}</p>
                    <div className="flex gap-4">
                      <a
                        href="https://www.linkedin.com/in/nicolas-gruwe/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#e28d1d] transition-colors"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                      <a
                        href="https://github.com/nicolas-gruwe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#e28d1d] transition-colors"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">{t('contact.info.schedule.title')}</h3>
                <p className="text-gray-400 mb-6">{t('contact.info.schedule.description')}</p>
                <a
                  href="https://calendly.com/gruwe-nicolas/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#e28d1d] text-white rounded-lg font-semibold hover:bg-[#e28d1d]/90 transition-colors"
                >
                  <CalendarPlus className="w-5 h-5" />
                  {t('contact.info.schedule.button')}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 