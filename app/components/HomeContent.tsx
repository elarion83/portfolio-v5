'use client'

import { HeroSection } from './home/HeroSection'
import { ServicesSection } from './home/ServicesSection'
import { AvailabilitySection } from './home/AvailabilitySection'
import { TestimonialsSection } from './home/TestimonialsSection'
import { ProjectsSlider } from './home/ProjectsSlider'
import { ContactSection } from './home/ContactSection'
import { HomeFooter } from './home/HomeFooter'
import type { HomeProject } from './home/ProjectsSlider'

interface HomeContentProps {
  latestProjects: HomeProject[]
}

export function HomeContent({ latestProjects }: HomeContentProps) {
  return (
    <main className="relative">
      <HeroSection />
      <ServicesSection />
      <AvailabilitySection />
      <TestimonialsSection />
      <ProjectsSlider projects={latestProjects} />
      <ContactSection />
      <HomeFooter />
    </main>
  )
} 