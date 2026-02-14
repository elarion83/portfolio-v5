'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

const testimonials = [
  {
    id: 'caroline-miras',
    author: 'Caroline Miras',
    role: 'Cliente',
    date: '5 novembre 2024',
    source: 'Google',
    stars: 5,
    text: 'Développeur web très talentueux, pro, réactif et efficace ! Nicolas a su concevoir mon site et trouver les solutions nécessaires pour un fonctionnement optimal. En plus d\'être sympa il sait se rendre disponible et rassurant. Je le recommande fortement et serais plus que ravie de collaborer de nouveau avec lui !',
  },
  {
    id: 'julien-dubois',
    author: 'Julien Dubois',
    role: 'Client',
    date: '5 novembre 2024',
    source: 'Google',
    stars: 5,
    text: 'Excellente collaboration avec Nicolas. Attentif au besoin réactif et disponible. Je recommande à 100%.',
  },
  {
    id: 'pierre-bonnouvrier',
    author: 'Pierre Bonnouvrier',
    role: 'Client',
    date: '21 octobre 2024',
    source: 'Google',
    stars: 5,
    text: 'Toujours un plaisir de travailler avec Nicolas, qui a su faire preuve de professionnalisme, d\'autonomie, et de force de proposition lors de deux projets en JS et PHP. Je recommande !',
  },
  {
    id: 'corentin-magnier',
    author: 'Corentin Magnier',
    role: 'Client',
    date: '3 novembre 2023',
    source: 'Google',
    stars: 5,
    text: 'Merci à Nicolas d\'avoir tenu ses engagements pour la conception de mon site e-commerce ! Le rendu est très pro, il respecte mes goûts et besoins, et en plus il est assez disponible en cas de problème ou de besoin de changement.',
  },
  {
    id: 'mathilde-noailhac',
    author: 'Mathilde Noailhac',
    role: 'Spécialiste des démarches administratives photovoltaïques',
    date: '22 novembre 2024',
    source: 'Recommandation',
    stars: 5,
    text: 'Nicolas a répondu à ma demande de création de site internet dans un temps record (4 jours), il m\'a apporté son expertise et ses précieux conseils. Grâce à lui, mon aventure entrepreneuriale peut enfin commencer. Je le recommande à 10000 % ! Il a fait preuve de réactivité et d\'une disponibilité exemplaire, il a su s\'adapter à mes exigences et nous avons construit ensemble une vraie relation de confiance. Merci Nicolas !',
  },
  {
    id: 'rudy-meresse',
    author: 'Rudy Meresse',
    role: 'Chef de projets au Futuroscope',
    date: '18 novembre 2024',
    source: 'Ancien manager',
    stars: 5,
    text: 'J\'ai eu la chance de travailler avec Nicolas lorsqu\'il était consultant, j\'ai donc pu observer son professionnalisme, son engagement et ses compétences sur de nombreux projets. Nicolas a une capacité à comprendre rapidement les enjeux d\'un client et à proposer des solutions adaptées. Il a également un excellent relationnel, ce qui lui permet de collaborer efficacement avec d\'autres équipes. Je l\'ai également vu développer de nouvelles technologies quand le projet le nécessitait, il a une forte capacité d\'adaptation. Je suis convaincu qu\'il apportera une vraie valeur ajoutée à chacun des projets qu\'il prendra en charge, je le recommande à toute entreprise qui cherche un collaborateur pour développer un site internet efficace, n\'hésitez pas à le contacter !',
  },
  {
    id: 'valerie-servant',
    author: 'Valérie Servant',
    role: 'Photographe',
    date: '29 juin 2015',
    source: 'Cliente',
    stars: 5,
    text: 'Nicolas a travaillé à la refonte de mon site internet ! Il a fait un travail formidable, il a toujours été à l\'écoute et est toujours parvenu à répondre à chacune de mes exigences. Malgré le fait que nous ne parlions pas le même langage (je suis photographe, je parle image, visuel et lui webmaster parle code...), il a sans problème su traduire chacune de mes demandes. Aujourd\'hui je peux affirmer que j\'ai un site qui correspond exactement à ce que je souhaitais, mais encore, je suis heureuse d\'avoir rencontré Nicolas qui est un garçon non seulement talentueux mais en plus toujours souriant ! Merci pour tout Nicolas !',
  },
]

function StarRating({ count, ariaLabel }: { count: number; ariaLabel: string }) {
  return (
    <div className="flex gap-0.5" aria-label={ariaLabel}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-[#e28d1d] text-[#e28d1d]"
          aria-hidden
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  const [current, setCurrent] = useState(0)
  const count = testimonials.length

  const prev = () => setCurrent((i) => (i - 1 + count) % count)
  const next = () => setCurrent((i) => (i + 1) % count)
  const testimonial = testimonials[current]

  return (
    <section className="relative py-24 overflow-hidden bg-[#0d0a12] section-bg-textured border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 title-neon">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="home-block-card relative p-6 sm:p-8 lg:p-10 min-h-[280px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.article
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                <Quote className="w-10 h-10 text-[#e28d1d]/40 mb-4" aria-hidden />
                <StarRating count={testimonial.stars} ariaLabel={`${testimonial.stars} ${t('home.testimonials.stars')}`} />
                <blockquote className="mt-4 text-gray-300 leading-relaxed flex-1">
                  « {testimonial.text} »
                </blockquote>
                <footer className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full bg-[#261939] border border-white/10 flex items-center justify-center text-[#e28d1d] font-bold text-lg"
                      aria-hidden
                    >
                      {testimonial.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                        {testimonial.source !== testimonial.role && (
                          <> · {testimonial.source}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <time
                    className="text-sm text-gray-500"
                    dateTime={testimonial.date}
                  >
                    {testimonial.date}
                  </time>
                </footer>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={prev}
              aria-label={t('home.testimonials.prev')}
              className="p-3 rounded-full border border-white/20 text-white hover:border-[#e28d1d] hover:bg-[#e28d1d]/10 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={t('home.testimonials.item').replace('{n}', String(i + 1))}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? 'w-8 bg-[#e28d1d]'
                      : 'w-2 bg-white/20 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label={t('home.testimonials.next')}
              className="p-3 rounded-full border border-white/20 text-white hover:border-[#e28d1d] hover:bg-[#e28d1d]/10 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
