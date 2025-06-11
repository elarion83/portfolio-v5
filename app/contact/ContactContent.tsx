'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, Linkedin, Github, ArrowRight, MessageCircle, CheckCircle, AlertCircle, CalendarPlus, CalendarDays } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { EmailSuccessAnimation } from '../components/EmailSuccessAnimation';
import Link from 'next/link';
import { ConstellationBackground } from '../components/ConstellationBackground';

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
    <div className="min-h-screen relative">
      {/* Image de fond fixe */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: 'url(/img/contact.jpg)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(38, 25, 57, 0.95)'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#261939]/90 to-gray-900/90 z-0" />

      {/* Contenu */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne de gauche - Formulaire de contact */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
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

          {/* Colonne de droite - Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:pl-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Créons Quelque Chose{' '}
              <span className="text-[#e28d1d]">d'Extraordinaire</span>
            </h1>

            <p className="text-gray-300 mb-12 text-lg">
              Que vous ayez besoin d'un thème WordPress personnalisé, du développement de plugins ou d'une solution web complète, je suis là pour vous aider à concrétiser vos idées.
            </p>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-[#261939] hexagon-shape text-gray-300 hover:text-[#e28d1d] hover:bg-[#e28d1d] transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Email</h3>
                  <Link
                    href="mailto:gruwe.nicolas@hotmail.fr"
                    className="text-gray-300 hover:text-[#e28d1d] transition-colors"
                  >
                    gruwe.nicolas@hotmail.fr
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-[#261939] hexagon-shape text-gray-300 hover:text-[#e28d1d] hover:bg-[#e28d1d] transition-all duration-300">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Calendly</h3>
                  <Link 
                    href="https://calendly.com/gruwe-nicolas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#e28d1d] transition-colors"
                  >
                    https://calendly.com/gruwe-nicolas
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-[#261939] hexagon-shape text-gray-300 hover:text-[#e28d1d] hover:bg-[#e28d1d] transition-all duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Location</h3>
                  <p className="text-gray-300">À distance, mondial</p>
                </div>
              </motion.div>
            </div>

            {/* Réseaux sociaux */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 mt-12"
            >
              <Link
                href="https://github.com/elarion83"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 rounded-lg hexagon-shape text-gray-300 hover:text-[#e28d1d] hover:bg-[#261939] transition-all duration-300"
              >
                <Github className="w-6 h-6" />
              </Link>
              <Link
                href="https://github.com/gnicolas31"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 rounded-lg hexagon-shape text-gray-300 hover:text-[#e28d1d] hover:bg-[#261939] transition-all duration-300"
              >
                <Github className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/nicolas-gruwe-b4805587/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 rounded-lg hexagon-shape text-gray-300 hover:text-[#e28d1d] hover:bg-[#261939] transition-all duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <ConstellationBackground />

      <AnimatePresence>
        {showSuccessAnimation && (
          <EmailSuccessAnimation onComplete={() => setShowSuccessAnimation(false)} />
        )}
      </AnimatePresence>
    </div>
  );
} 