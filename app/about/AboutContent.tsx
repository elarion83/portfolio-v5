'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Briefcase, Award, Users, Coffee, CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Calendar, Building } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LoadingSpinner } from '@/app/components/LoadingSpinner'

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

export function AboutContent() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#261939] to-gray-900">
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
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 title-neon">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('about.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
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

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex items-start"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-[#e28d1d] rounded-full">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-6">
                  <span className="text-[#e28d1d] text-sm font-semibold">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {language === 'fr' ? item.title : item.title_en}
                  </h3>
                  <div className="flex items-center text-gray-400 mt-1">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{item.company}</span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    {language === 'fr' ? item.description : item.description_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
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
                    <h4 className="text-white font-semibold">
                      {testimonials[activeTestimonial].acf.tem_auteurs}
                    </h4>
                    <p className="text-[#e28d1d]">
                      {language === 'en' ? testimonials[activeTestimonial].acf.tem_post_title_en : testimonials[activeTestimonial].acf.tem_statut}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 