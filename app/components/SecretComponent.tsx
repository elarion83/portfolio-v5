import React from 'react'
import PlatformerGame from './PlatformerGame/PlatformerGame'
import { X } from 'lucide-react'

export default function SecretComponent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-8 z-50 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
          aria-label="Quitter le jeu"
        >
          <X className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </button>
      )}
      <PlatformerGame />
    </div>
  )
} 