'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Briefcase, Menu, X, Mail, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const menuItems = [
  {
    path: '/',
    icon: Home,
    translationKey: 'nav.home',
    bgImage: '/img/home.webp'
  },
  {
    path: '/about',
    icon: User,
    translationKey: 'nav.about',
    bgImage: '/img/about.webp'
  },
  {
    path: '/portfolio',
    icon: Briefcase,
    translationKey: 'nav.portfolio',
    bgImage: '/img/portfolio.webp'
  },
  {
    path: '/blog',
    icon: BookOpen,
    translationKey: 'nav.blog',
    bgImage: '/img/blog.webp'
  },
  {
    path: '/contact',
    icon: Mail,
    translationKey: 'nav.contact',
    bgImage: '/img/contact.jpg'
  }
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={false}
        animate={{ rotate: isMenuOpen ? 180 : 0 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-background rounded-full text-primary md:hidden"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-background/95 z-40 flex items-center justify-center md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-6"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredPath(item.path)}
                  onHoverEnd={() => setHoveredPath(null)}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="relative flex items-center gap-4 px-8 py-4 rounded-full transition-colors"
                    aria-label={t(item.translationKey)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-primary rounded-full"
                      initial={false}
                      animate={{
                        opacity: pathname === item.path || hoveredPath === item.path ? 1 : 0,
                        scale: pathname === item.path || hoveredPath === item.path ? 1 : 0.8
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <item.icon className="w-7 h-7 relative z-10 text-white" aria-hidden="true" />
                    <span className="text-2xl font-medium relative z-10 text-white">
                      {t(item.translationKey)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <nav className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <motion.div
              key={item.path}
              onHoverStart={() => setHoveredPath(item.path)}
              onHoverEnd={() => setHoveredPath(null)}
              whileHover={{ scale: 1.1 }}
            >
              <div 
                className={`relative p-4 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border border-border transition-colors ${
                  pathname === item.path ? 'bg-primary/20' : ''
                }`}
              >
                <Link 
                  href={item.path} 
                  className="flex flex-col items-center" 
                  aria-label={t(item.translationKey)}
                >
                  <motion.div
                    animate={{
                      scale: hoveredPath === item.path ? 1.2 : 1,
                      rotate: hoveredPath === item.path ? 360 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-7 h-7 text-foreground" aria-hidden="true" />
                  </motion.div>
                  <motion.span
                    className="text-base font-medium mt-1 text-foreground"
                    animate={{
                      y: hoveredPath === item.path ? -2 : 0,
                      opacity: hoveredPath === item.path ? 1 : 0.8
                    }}
                  >
                    {t(item.translationKey)}
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </nav>
    </>
  )
} 