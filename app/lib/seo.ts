// Configuration SEO centralisée
export const siteConfig = {
  name: 'Nicolas Gruwe',
  description: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS.',
  url: 'https://nicolas-gruwe.fr',
  ogImage: 'https://www.nicolas-gruwe.fr/img/home.webp',
  links: {
    twitter: 'https://twitter.com/nicolasgruwe',
    github: 'https://github.com/nicolasgruwe',
    linkedin: 'https://linkedin.com/in/nicolasgruwe',
  },
}

export const defaultMetadata = {
  metadataBase: new URL('https://nicolas-gruwe.fr'),
  title: {
    default: 'Nicolas Gruwe - Développeur WordPress & Full Stack Expert',
    template: '%s | Nicolas Gruwe',
  },
  description: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS. Idéal pour renfort technique ou sous-traitance.',
  keywords: [
    'développeur web',
    'développeur WordPress',
    'développeur React',
    'développeur VueJS',
    'freelance',
    'renfort technique',
    'sous-traitance',
    'développement web',
    'agence web',
  ],
  authors: [{ name: 'Nicolas Gruwe' }],
  creator: 'Nicolas Gruwe',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://nicolas-gruwe.fr',
    title: 'Nicolas Gruwe - Développeur WordPress & Full Stack Expert',
    description: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS.',
    siteName: 'Nicolas Gruwe',
    images: [
      {
        url: 'https://www.nicolas-gruwe.fr/img/home.webp',
        width: 1200,
        height: 630,
        alt: 'Nicolas Gruwe - Développeur WordPress & Full Stack Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nicolas Gruwe - Développeur WordPress & Full Stack Expert',
    description: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS.',
    images: ['https://www.nicolas-gruwe.fr/img/home.webp'],
    creator: '@nicolasgruwe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
} 