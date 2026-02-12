'use client'

import { motion } from 'framer-motion'
import { Linkedin, Github, Mail, Calendar } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

const links = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nicolas-gruwe-b4805587/',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/elarion83',
    icon: Github,
  },
  {
    label: 'Calendly',
    href: 'https://calendly.com/gruwe-nicolas',
    icon: Calendar,
  },
  {
    label: 'Email',
    href: 'mailto:gruwe.nicolas@hotmail.fr',
    icon: Mail,
  },
]

export function HomeFooter() {
  const { t } = useLanguage()
  return (
    <footer className="relative bg-[#0a0a0d] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Nicolas Gruwe — {t('home.footer.tagline')}
          </p>
          <nav className="flex items-center gap-6" aria-label={t('home.footer.navLabel')}>
            {links.map((item) => {
              const Icon = item.icon
              const isMail = item.href.startsWith('mailto:')
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-2 text-gray-400 hover:text-[#e28d1d] transition-colors"
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              )
            })}
          </nav>
        </motion.div>
      </div>
    </footer>
  )
}
