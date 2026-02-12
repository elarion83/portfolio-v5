'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Linkedin, Github, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/app/contexts/LanguageContext'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nicolas-gruwe-b4805587/', icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com/elarion83', icon: Github },
  { label: 'Calendly', href: 'https://calendly.com/gruwe-nicolas', icon: Calendar },
  { label: 'Email', href: 'mailto:gruwe.nicolas@hotmail.fr', icon: Mail },
]

export function ContactSection() {
  const { t } = useLanguage()
  return (
    <section className="relative py-24 overflow-hidden bg-[#0d0a12] section-bg-textured border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="rounded-xl border border-white/10 bg-[#261939]/50 backdrop-blur-sm p-8 sm:p-10 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 title-neon">
            {t('home.contact.title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            {t('home.contact.subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
            {links.map((item) => {
              const Icon = item.icon
              const isMail = item.href.startsWith('mailto:')
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:border-[#e28d1d]/40 hover:text-[#e28d1d] hover:bg-white/5 transition-all"
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              )
            })}
          </div>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#e28d1d] text-[#0d0a12] font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(226,141,29,0.4)] transition-all"
            >
              {t('home.contact.sendMessage')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
