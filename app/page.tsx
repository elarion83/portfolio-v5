import { generateMetadata } from '@/app/utils/metadata'
import { HomeContent } from './components/HomeContent'

export const metadata = generateMetadata({
  title: {
    fr: 'Développeur Web Freelance pour Agences – WordPress, React, VueJS',
    en: 'Freelance Web Developer for Agencies – WordPress, React, VueJS'
  },
  description: {
    fr: 'Développeur freelance avec +13 ans d\'expérience. Spécialisé en WordPress, ReactJS, VueJS. Idéal pour renfort technique ou sous-traitance.',
    en: 'Freelance developer with 13+ years of experience. Specialized in WordPress, ReactJS, VueJS. Ideal for technical support or subcontracting.'
  }
})

export default function Home() {
  return <HomeContent />
} 