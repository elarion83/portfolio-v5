'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Briefcase, Award, Users, Coffee, CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Calendar, Building } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'

interface Testimonial {
  content: {
    rendered: string;
  };
  acf: {
    tem_auteurs: string;
    tem_note: string;
    tem_statut: string;
    tem_contenu_en: string;
    tem_post_title_en: string;
  };
}

const timeline = [
  {
    year: '2024',
    title: 'Fondateur',
    title_en: 'Founder',
    company: 'Play-it.fr',
    description: 'Développeur et fondateur d\'une application / site web android. Play-it est un lecteur multimédia permettant la synchronicité entre plusieurs utilisateurs sur une playlist commune à travers le monde entier.',
    description_en: 'Developer and founder of an android application / website. Play-it is a multimedia player that allows multiple users to synchronise on a common playlist across the world.'
  },
  {
    year: '2022 - 2024',
    title: 'Ingénieur de développement',
    title_en: 'Development engineer',
    company: 'Astek',
    description: 'Développeur WordPress FullStack au sein de BPCE-SI. En charge de portails web CMS tels que www.banquepopulaire.fr ou www.caisse-epargne.fr. Création d\'image Docker wordpress.',
    description_en: 'WordPress FullStack developer at BPCE-SI. In charge of CMS web portals such as www.banquepopulaire.fr or www.caisse-epargne.fr. Docker wordpress image creation.'
  },
  {
    year: '2021 - 2022',
    title: 'Ingénieur de développement',
    title_en: 'Development engineer',
    company: 'Alteca',
    description: 'Développeur JAVA au sein de BPCE-SI sur la section Crédits Moyens & Longs Termes destinée aux professionnels et aux particuliers.',
    description_en: 'JAVA developer within BPCE-SI on the Medium & Long Term Credit section for professionals and individuals.'
  },
  {
    year: 'Depuis 2020',
    title: 'Fondateur',
    title_en: 'Founder',
    company: 'Deussearch.fr',
    description: "Fondateur, Community manager, Développeur (Fullstack), Infographiste, Admin. Serveur, Rédacteur web et commercial d'une des plus grosse base de données de Jeu-vidéo en France. Développeur front (VueJS) et back (WordPress / Symfony).",
    description_en: 'Founder, Community manager, Developer (Fullstack), Graphic designer, Admin. Server, Web editor and sales representative for one of the biggest video game databases in France. Front-end developer (VueJS) and back-end developer (WordPress / Symfony).'
  },
  {
    year: '2020 - 2021',
    title: 'Développeur WordPress',
    title_en: 'WordPress Developer',
    company: 'National Scientific Research Center (Sedoo)',
    description: 'Développeur en binôme d\'usines à sites destinées aux laboratoires scientifiques travaillant avec le Sedoo (Centre de données du CNRS).',
    description_en: 'Joint developer of site factories for scientific laboratories working with Sedoo (CNRS data centre).'
  },
  {
    year: 'Depuis 2018',
    title: 'Développeur WordPress',
    title_en: 'WordPress Developer',
    company: 'Freelance',
    description: 'Développement de plugins et de sites WordPress sur mesure en freelance.',
    description_en: 'Freelance development of plugins and custom WordPress sites.'
  }
];

// Fonction utilitaire pour injecter les liens dans la description
function linkifyDescription(description: string) {
  const parts = description.split(/(www\.banquepopulaire\.fr|www\.caisse-epargne\.fr)/g)
  return parts.map((part, i) => {
    if (part === 'www.caisse-epargne.fr') {
      return <Link key={i} href="/portfolio/caisse-d-rsquo-epargne" className="text-[#e28d1d] underline hover:text-[#fff] transition-colors">{part}</Link>
    }
    if (part === 'www.banquepopulaire.fr') {
      return <Link key={i} href="/portfolio/banque-populaire" className="text-[#e28d1d] underline hover:text-[#fff] transition-colors">{part}</Link>
    }
    return part
  })
}

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/temoignage?per_page=50')
        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setIsLoadingTestimonials(false)
      }
    }

    fetchTestimonials()
  }, [])

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const renderTestimonialsSection = () => (
    <div className="py-20 px-4 bg-[#261939]/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4 title-neon">{t('about.testimonials.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('about.testimonials.description')}
          </p>
        </motion.div>

        {isLoadingTestimonials ? (
          <LoadingSpinner />
        ) : testimonials.length > 0 ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-[#261939]/50 rounded-xl p-8 backdrop-blur-sm"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(parseInt(testimonials[activeTestimonial].acf.tem_note))].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#e28d1d] fill-[#e28d1d]" />
                  ))}
                </div>
                <div 
                  className="text-gray-300 text-lg text-center mb-6"
                  dangerouslySetInnerHTML={{ 
                    __html: language == 'en' ? testimonials[activeTestimonial].acf.tem_contenu_en : testimonials[activeTestimonial].content.rendered 
                  }}
                />
                <div className="text-center">
                  <h4 className="text-white font-semibold">
                    {testimonials[activeTestimonial].acf.tem_auteurs}
                  </h4>
                  <p className="text-[#e28d1d]">
                    {language == 'en' ? testimonials[activeTestimonial].acf.tem_post_title_en : testimonials[activeTestimonial].acf.tem_statut}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 text-white hover:text-[#e28d1d] transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 text-white hover:text-[#e28d1d] transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400">No testimonials available</div>
        )}

        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeTestimonial ? 'bg-[#e28d1d]' : 'bg-gray-600'
              }`}
              aria-label={`Voir le témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#261939] about-page pt-0">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/img/about.webp)',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {t('about.title')} <span className="text-[#e28d1d]">{t('about.title.highlight')}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              {t('about.description')}
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-[#e28d1d] rounded-full text-white font-semibold flex items-center gap-2 mx-auto"
              >
                {t('about.cta.button')} <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      {renderTestimonialsSection()}

      {/* Stats Section */}
      <div className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/img/about3.webp)',
            filter: 'brightness(0.2)'
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d]/20 to-[#261939]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="bg-white/5 backdrop-blur-sm p-6 relative z-10 border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="text-[#e28d1d] mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Coffee className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-[#e28d1d] transition-colors">500+</div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">{t('about.stats.tea')}</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d]/20 to-[#261939]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="bg-white/5 backdrop-blur-sm p-6 relative z-10 border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="text-[#e28d1d] mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-[#e28d1d] transition-colors">30+</div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">{t('about.stats.clients')}</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d]/20 to-[#261939]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="bg-white/5 backdrop-blur-sm p-6 relative z-10 border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="text-[#e28d1d] mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-[#e28d1d] transition-colors">10+</div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">{t('about.stats.experience')}</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d]/20 to-[#261939]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="bg-white/5 backdrop-blur-sm p-6 relative z-10 border border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="text-[#e28d1d] mb-2 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-[#e28d1d] transition-colors">98%</div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">{t('about.stats.success')}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} 
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('about.cta.title')}
              </h2>
              <p className="text-gray-300 mb-8">
                {t('about.cta.description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-[#e28d1d]" />
                  <span>{t('about.cta.features.tailored')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-[#e28d1d]" />
                  <span>{t('about.cta.features.agile')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-[#e28d1d]" />
                  <span>{t('about.cta.features.support')}</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 bg-[#e28d1d] rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('about.cta.button')} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <p className="text-center text-gray-400 mt-4 text-sm">
                  {t('about.cta.note')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Professional Journey Section */}
      <div className="py-20 px-4 bg-[#261939]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">{t('about.journey.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('about.journey.description')}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-[#e28d1d]/20" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-start md:items-center relative mb-8 ${
                  index % 2 === 0 ? 'md:justify-end' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-[-8px] md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-[#e28d1d] rounded-full shadow-lg z-10" />
                
                {/* Content container */}
                <div className={`w-full pl-8 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-xl backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e28d1d]/5 to-[#261939]/5" />
                    <div className="absolute inset-0 backdrop-blur-[8px]" />
                    <div className="relative bg-[#261939]/30 p-6 border border-white/10">
                      <div className={`flex items-center gap-2 mb-2 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        <Calendar className="w-5 h-5 text-[#e28d1d]" />
                        <span className="text-[#e28d1d] font-bold">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{language == 'en' ? item.title_en : item.title}</h3>
                      <div className={`flex items-center gap-2 mb-2 text-gray-400 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        <Building className="w-4 h-4" />
                        <span>{item.company}</span>
                      </div>
                      <p className="text-gray-400">
                        {language == 'en'
                          ? item.description_en
                          : linkifyDescription(item.description)}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing-Focused CTA Section */}
      <div className="relative py-24 px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/img/about3.webp)',
            filter: 'brightness(0.2)'
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 title-neon">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10"
            >
              <div className="text-[#e28d1d] mb-4">
                <Code className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('about.cta.features.tailored')}
              </h3>
              <p className="text-gray-400">
                Solutions adaptées à vos besoins spécifiques, conçues pour maximiser votre ROI.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10"
            >
              <div className="text-[#e28d1d] mb-4">
                <Briefcase className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('about.cta.features.agile')}
              </h3>
              <p className="text-gray-400">
                Développement itératif avec feedback continu pour des résultats optimaux.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10"
            >
              <div className="text-[#e28d1d] mb-4">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('about.cta.features.support')}
              </h3>
              <p className="text-gray-400">
                Support technique continu et maintenance proactive pour votre tranquillité.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="https://calendly.com/gruwe-nicolas/30min">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-[#e28d1d] rounded-full text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {t('about.cta.calendly')}
              </motion.button>
            </Link>
            <p className="text-gray-400 mt-4">
              {t('about.cta.note')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 