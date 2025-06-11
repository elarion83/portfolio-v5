'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HexagonProps {
  children: React.ReactNode
  className?: string
  isActive?: boolean
}

export function Hexagon({ children, className = '', isActive = false }: HexagonProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-12 h-12 ${isActive ? 'text-[#e28d1d]' : 'text-white'}`}
      >
        <polygon
          points="50 1 95 25 95 75 50 99 5 75 5 25"
          fill="currentColor"
          className="transition-colors"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  )
} 