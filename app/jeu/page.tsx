'use client'

import React from 'react'
import PlatformerGame from '../components/PlatformerGame/PlatformerGame'
import '../styles/game-page.css'

// Désactive la génération statique/SSR pour cette page
export const dynamic = 'force-dynamic'

export default function JeuPage() {
  return (
    <div className="game-page w-full h-screen flex items-center justify-center bg-black">
      <PlatformerGame />
    </div>
  )
} 