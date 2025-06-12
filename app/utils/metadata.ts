import type { Metadata } from 'next'

interface LocalizedText {
  fr: string;
  en: string;
}

interface MetadataConfig {
  title: LocalizedText;
  description: LocalizedText;
}

export function generateMetadata(config: MetadataConfig): Metadata {
  return {
    title: {
      default: config.title.fr,
      template: `%s | ${config.title.fr}`,
      absolute: config.title.fr,
    },
    description: config.description.fr,
    openGraph: {
      title: config.title.fr,
      description: config.description.fr,
      type: 'website',
      locale: 'fr_FR',
      alternateLocale: 'en_US',
      siteName: 'Nicolas Gruwe',
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
      title: config.title.fr,
      description: config.description.fr,
      card: 'summary_large_image',
      creator: '@nicolasgruwe',
      images: ['https://www.nicolas-gruwe.fr/img/home.webp'],
    },
    alternates: {
      canonical: 'https://nicolas-gruwe.fr',
      languages: {
        'fr-FR': 'https://nicolas-gruwe.fr',
        'en-US': 'https://nicolas-gruwe.fr/en',
      },
    },
  }
} 