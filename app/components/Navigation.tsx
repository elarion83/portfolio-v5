'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, User, Briefcase, Menu, X, Mail, BookOpen } from 'lucide-react'
import { Hexagon } from './Hexagon'

const menuItems = [
  {
    path: '/',
    icon: Home,
    label: 'Home',
    bgImage: '/img/home.webp'
  },
  {
    path: '/about',
    icon: User,
    label: 'About',
    bgImage: '/img/about.avif'
  },
  {
    path: '/portfolio',
    icon: Briefcase,
    label: 'Portfolio',
    bgImage: '/img/portfolio.webp'
  },
  {
    path: '/blog',
    icon: BookOpen,
    label: 'Blog',
    bgImage: '/img/blog.webp'
  },
  {
    path: '/contact',
    icon: Mail,
    label: 'Contact',
    bgImage: '/img/contact.jpg'
  }
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-[#261939] rounded-full md:hidden"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#e28d1d]" />
        ) : (
          <Menu className="w-5 h-5 text-[#e28d1d]" />
        )}
      </button>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? '0%' : '100%' }}
        className="fixed inset-y-0 right-0 z-40 w-full bg-[#261939]/80 backdrop-blur-md md:hidden"
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-row items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                pathname === item.path
                  ? 'text-[#e28d1d] scale-110'
                  : 'text-white hover:text-[#e28d1d] hover:scale-105'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Desktop Menu */}
      <nav className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <motion.div
              key={item.path}
              onHoverStart={() => setHoveredPath(item.path)}
              onHoverEnd={() => setHoveredPath(null)}
              whileHover={{ scale: 1.1 }}
            >
              <Hexagon 
                isActive={pathname === item.path}
                backgroundImage={item.bgImage}
                className={hoveredPath === item.path ? 'transform rotate-12 transition-transform' : ''}
              >
                <Link href={item.path} className="p-4 flex flex-col items-center" aria-label={item.label}>
                  <motion.div
                    animate={{
                      scale: hoveredPath === item.path ? 1.2 : 1,
                      rotate: hoveredPath === item.path ? 360 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-7 h-7" aria-hidden="true" />
                  </motion.div>
                  <motion.span
                    className="text-base font-medium mt-1 menu-item-text"
                    animate={{
                      y: hoveredPath === item.path ? -2 : 0,
                      opacity: hoveredPath === item.path ? 1 : 0.8
                    }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </Hexagon>
            </motion.div>
          ))}
        </div>
      </nav>
    </>
  )
} 