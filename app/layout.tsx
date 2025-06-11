import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageSwitch } from './components/LanguageSwitch'
import { Navigation } from './components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Nicolas Gruwe - Développeur WordPress & Full Stack Expert',
  description: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS. Idéal pour renfort technique ou sous-traitance.',
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
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${poppins.variable} bg-background text-foreground`}>
        <LanguageProvider>
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