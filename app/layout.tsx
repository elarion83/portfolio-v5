import type { Metadata } from 'next'
import Script from 'next/script'
import { inter, poppins } from './fonts'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageSwitch } from './components/LanguageSwitch'
import { Navigation } from './components/Navigation'
import { Analytics } from './components/Analytics'
import './globals.css'
import './styles/custom.css'
import './styles/pages.css'

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GKXF35YJ15"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GKXF35YJ15');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${poppins.variable} bg-background text-foreground`}>
        <LanguageProvider>
          <div className="relative overflow-x-hidden w-full">
            <LanguageSwitch />
            <Navigation />
            <Analytics />
            <main className="content-container">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
} 