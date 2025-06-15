import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageSwitch } from './components/LanguageSwitch'
import { Navigation } from './components/Navigation'
import GoogleAnalytics from './components/GoogleAnalytics'
import PageTracker from './components/PageTracker'
import './globals.css'
import './styles/custom.css'
import './styles/pages.css'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
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
    type: 'website',
    images: [
      {
        url: 'https://www.nicolas-gruwe.fr/img/home.webp',
        width: 1200,
        height: 630,
        alt: 'Nicolas Gruwe - Développeur WordPress & Full Stack',
      },
    ],
  },
  twitter: {
    title: 'Renfort Technique pour Agences – Développeur Freelance Web',
    description: 'Besoin d\'un renfort fiable pour vos projets clients ? Sites performants, respect des délais, livrables pro.',
    card: 'summary_large_image'
  },
  icons: {
    icon: 'https://portfolio.deussearch.fr/wp-content/themes/portfolio/images/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="https://portfolio.deussearch.fr/wp-content/themes/portfolio/images/favicon.ico" />
      </head>
      <body className={`${inter.className} ${poppins.variable} bg-background text-foreground`}>
        <GoogleAnalytics />
        <LanguageProvider>
          <PageTracker />
          <div className="relative overflow-x-hidden w-full">
            <LanguageSwitch />
            <Navigation />
            <main className="content-container">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
} 