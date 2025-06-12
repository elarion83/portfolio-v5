import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageSwitch } from './components/LanguageSwitch'
import { Navigation } from './components/Navigation'
import './globals.css'
import './styles/custom.css'
import './styles/pages.css'
import './styles/critical.css'

// Optimisation des polices
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Nicolas Gruwe - Développeur WordPress & Full Stack Expert',
  description: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS. Idéal pour renfort technique ou sous-traitance.',
  metadataBase: new URL('https://nicolas-gruwe.fr'),
  openGraph: {
    title: 'Renfort Technique pour Agences – Développeur Freelance Web',
    description: 'Besoin d\'un renfort fiable pour vos projets clients ? Sites performants, respect des délais, livrables pro.',
    url: 'https://nicolas-gruwe.fr',
    siteName: 'Nicolas Gruwe - Développeur WordPress & Full Stack',
    type: 'website'
  },
  twitter: {
    title: 'Renfort Technique pour Agences – Développeur Freelance Web',
    description: 'Besoin d\'un renfort fiable pour vos projets clients ? Sites performants, respect des délais, livrables pro.',
    card: 'summary_large_image'
  },
  icons: {
    icon: 'https://portfolio.deussearch.fr/wp-content/themes/portfolio/images/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${poppins.variable} font-sans`}>
      <head>
        {/* Préchargement des ressources critiques */}
        <link 
          rel="preload" 
          href="/img/home.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        <link 
          rel="preload" 
          href="/styles/critical.css" 
          as="style"
        />
        <link 
          rel="preconnect" 
          href="https://portfolio.deussearch.fr"
        />
        
        {/* Style critique injecté directement */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Styles critiques pour éviter le FOUC */
          .critical-h1 {
            opacity: 0;
            transform: translateY(20px);
          }
          @media (prefers-reduced-motion: no-preference) {
            .critical-h1 {
              animation: fadeInUp 0.6s ease-out forwards;
            }
          }
        `}} />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <Navigation />
          {children}
          <LanguageSwitch />
        </LanguageProvider>
      </body>
    </html>
  )
} 