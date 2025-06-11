import { Metadata } from 'next'
import { ContactContent } from './ContactContent'

export const metadata: Metadata = {
  title: {
    default: 'Collaborer avec un Développeur Freelance – Contact Agences',
    template: '%s | Nicolas Gruwe'
  },
  description: 'Contactez-moi pour discuter de votre projet : développement sur mesure, renfort ponctuel ou mission longue.',
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

export default function Contact() {
  return <ContactContent />
} 