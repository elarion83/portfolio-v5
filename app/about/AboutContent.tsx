'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Briefcase, Award, Users, Coffee, CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Calendar, Building } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/contexts/LanguageContext'
import LoadingSpinner from '@/app/components/LoadingSpinner'

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

const AboutContent = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true)
  const { t, language } = useLanguage()

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
          <h2 className="text-4xl font-bold text-white mb-4 title-neon">
            {t('about.testimonials.title')}
          </h2>
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
                    __html: language === 'en' ? testimonials[activeTestimonial].acf.tem_contenu_en : testimonials[activeTestimonial].content.rendered 
                  }}
                />
                <div className="text-center">
                  <h3 className="text-white font-semibold text-lg">
                    {testimonials[activeTestimonial].acf.tem_auteurs}
                  </h3>
                  <p className="text-[#e28d1d]">
                    {language === 'en' ? testimonials[activeTestimonial].acf.tem_post_title_en : testimonials[activeTestimonial].acf.tem_statut}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/50 hover:text-white transition-colors"
              aria-label={language === 'fr' ? 'Témoignage précédent' : 'Previous testimonial'}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/50 hover:text-white transition-colors"
              aria-label={language === 'fr' ? 'Témoignage suivant' : 'Next testimonial'}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#261939] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Timeline section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 title-neon">
              {t('about.timeline.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('about.timeline.description')}
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-24 text-[#e28d1d] font-medium">
                  {item.year}
                </div>
                <div className="flex-grow">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {language === 'en' ? item.title_en : item.title} - {item.company}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'en' ? item.description_en : item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials section */}
        {renderTestimonialsSection()}
      </div>
    </div>
  )
}

export default AboutContent 