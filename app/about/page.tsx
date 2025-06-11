import { Metadata } from 'next'
import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: 'Profil Développeur Freelance pour Agences Web',
  description: '+13 ans d\'expérience en développement web. Capable de prendre en charge des projets WordPress ou JS de A à Z, en toute autonomie.',
  openGraph: {
    title: 'Développeur Web Freelance – Autonome & Expérimenté',
    description: 'Profil technique complet : WordPress, VueJS, React. Habitué à travailler seul ou intégré à une équipe technique.',
  },
  twitter: {
    title: 'Développeur Web Freelance – Autonome & Expérimenté',
    description: 'Profil technique complet : WordPress, VueJS, React. Habitué à travailler seul ou intégré à une équipe technique.',
  },
}

export default function AboutPage() {
  return <AboutContent />
} 