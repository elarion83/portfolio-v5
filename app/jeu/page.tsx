import React from 'react'
import { Metadata } from 'next'
import PlatformerGame from '../components/PlatformerGame/PlatformerGame'
import '../styles/game-page.css'

export const metadata: Metadata = {
  title: 'Jeu de Plateforme | Nicolas Gruwe - Développeur Web',
  description: 'Explorez mon portfolio de manière interactive ! Collectez mes projets dans un jeu de plateforme 2D et découvrez mon travail en vous amusant.',
  keywords: ['jeu', 'portfolio interactif', 'plateforme', 'Nicolas Gruwe', 'développeur web', 'projets'],
  openGraph: {
    title: 'Jeu de Plateforme Interactive | Nicolas Gruwe',
    description: 'Explorez mon portfolio de manière interactive ! Collectez mes projets dans un jeu de plateforme 2D.',
    url: 'https://www.nicolas-gruwe.fr/jeu',
    type: 'website',
    images: [
      {
        url: 'https://www.nicolas-gruwe.fr/img/portfolio.webp',
        width: 1200,
        height: 630,
        alt: 'Jeu de plateforme portfolio interactif',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeu de Plateforme Interactive | Nicolas Gruwe',
    description: 'Explorez mon portfolio de manière interactive dans un jeu de plateforme 2D !',
    images: ['https://www.nicolas-gruwe.fr/img/portfolio.webp'],
  },
}

export default function JeuPage() {
  return (
    <div className="game-page w-full h-screen flex items-center justify-center bg-black">
      <PlatformerGame />
    </div>
  )
} 