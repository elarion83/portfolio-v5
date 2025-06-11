import { Metadata } from 'next'
import { ContactContent } from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact - Nicolas Gruwe',
  description: 'Contactez-moi pour discuter de vos projets de développement web, création de thèmes WordPress ou plugins personnalisés.',
  alternates: {
    canonical: 'https://nicolas-gruwe.fr/contact'
  },
  openGraph: {
    title: 'Besoin d\'un Développeur pour votre Agence ? Contactez-moi',
    description: 'Réactif, autonome, expérimenté. Disponible pour vos projets techniques en marque blanche.',
    url: 'https://nicolas-gruwe.fr/contact',
    siteName: 'Nicolas Gruwe - Développeur Freelance',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Besoin d\'un Développeur pour votre Agence ? Contactez-moi',
    description: 'Réactif, autonome, expérimenté. Disponible pour vos projets techniques en marque blanche.',
    creator: '@nicolas_gruwe',
  },
}

export default function ContactPage() {
  return <ContactContent />
} 