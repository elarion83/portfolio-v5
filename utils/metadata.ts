interface MetadataConfig {
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
}

export function generateMetadata(config: MetadataConfig) {
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
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title.fr,
      description: config.description.fr,
    },
    alternates: {
      canonical: '/',
      languages: {
        'fr-FR': '/fr',
        'en-US': '/en',
      },
    },
  }
} 