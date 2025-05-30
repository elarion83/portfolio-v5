import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, Linkedin, Github, ArrowRight, MessageCircle, CheckCircle, AlertCircle, CalendarPlus2 } from 'lucide-react';
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

export const Contact: React.FC = () => {
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

  useEffect(() => {
    const title = language === 'fr' 
      ? 'Collaborer avec un Développeur Freelance – Contact Agences'
      : 'Collaborate with a Freelance Developer – Contact for Agencies';
    
    const description = language === 'fr'
      ? 'Contactez-moi pour discuter de votre projet : développement sur mesure, renfort ponctuel ou mission longue.'
      : 'Get in touch to discuss your project: custom development, short-term support, or long-term mission.';
    
    const ogTitle = language === 'fr'
      ? 'Besoin d\'un Développeur pour votre Agence ? Contactez-moi'
      : 'Need a Developer for Your Agency? Contact Me';
    
    const ogDescription = language === 'fr'
      ? 'Réactif, autonome, expérimenté. Disponible pour vos projets techniques en marque blanche.'
      : 'Responsive, independent, experienced. Available for white-label technical projects.';

    document.title = title;
    
    const metaTags = {
      'meta[name="description"]': description,
      'meta[property="og:title"]': ogTitle,
      'meta[property="og:description"]': ogDescription,
      'meta[property="twitter:title"]': ogTitle,
      'meta[property="twitter:description"]': ogDescription,
      'link[rel="canonical"]': 'https://nicolas-gruwe.fr/contact'
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
          email_user: import.meta.env.EMAIL_USER || ''
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
                      {t('contact.form.submit')} <ArrowRight className="w-5 h-5" />
                    </>
                  )}
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('contact.title')}{' '}
              <span className="text-[#e28d1d]">{t('contact.title.highlight')}</span>
            </h1>
            
            <p className="text-gray-300 mb-12 text-lg leading-relaxed">{t('contact.description')}</p>

            <div className="space-y-8 mb-12">
              <motion.a
                href={`mailto:${import.meta.env.EMAIL_USER}`}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 text-gray-300 hover:text-[#e28d1d] transition-colors"
              >
                <div className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-sm text-gray-400">{import.meta.env.EMAIL_USER}</p>
                </div>
              </motion.a>

              <motion.a
                href="https://calendly.com/gruwe-nicolas/30min"
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 text-gray-300 hover:text-[#e28d1d] transition-colors"
              >
                <div className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center">
                  <CalendarPlus2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Calendly</h3>
                  <p className="text-sm text-gray-400">https://calendly.com/gruwe-nicolas</p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 text-gray-300"
              >
                <div className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-sm text-gray-400">{t('contact.location')}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-4">
              <motion.a
                href="https://github.com/elarion83"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center text-gray-300 hover:text-[#e28d1d] transition-colors"
                title="Personal GitHub"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://github.com/gnicolas31"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center text-gray-300 hover:text-[#e28d1d] transition-colors"
                title="Professional GitHub"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/nicolas-gruwe-b4805587/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center text-gray-300 hover:text-[#e28d1d] transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href={`mailto:${import.meta.env.EMAIL_USER}`}
                whileHover={{ y: -5 }}
                className="w-12 h-12 bg-white/5 hexagon-shape flex items-center justify-center text-gray-300 hover:text-[#e28d1d] transition-colors"
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};