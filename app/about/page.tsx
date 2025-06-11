import { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: {
    default: 'Profil Développeur Freelance pour Agences Web',
    template: '%s | Nicolas Gruwe'
  },
  description: '+13 ans d\'expérience en développement web. Capable de prendre en charge des projets WordPress ou JS de A à Z, en toute autonomie.',
  openGraph: {
    title: 'Développeur Web Freelance – Autonome & Expérimenté',
    description: 'Profil technique complet : WordPress, VueJS, React. Habitué à travailler seul ou intégré à une équipe technique.',
    url: 'https://nicolas-gruwe.fr/about',
    siteName: 'Nicolas Gruwe - Développeur Web Freelance',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nicolas-gruwe.fr/about'
  }
}

export default function AboutPage() {
  return <AboutContent />
} 