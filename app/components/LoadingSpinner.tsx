'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  fullScreen?: boolean
}

const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => {
  // Points pour créer un hexagone
  const size = 80
  const center = size / 2
  const radius = size * 0.4
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return `${x},${y}`
  })
  const hexagonPath = `M ${points.join(' L ')} Z`

  const containerClasses = fullScreen 
    ? "fixed inset-0 flex justify-center items-center bg-[#261939] z-50" 
    : "flex justify-center items-center py-12"

  return (
    <div className={containerClasses}>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <motion.path
          d={hexagonPath}
          stroke="#e28d1d"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: [0, 1, 0],
            stroke: [
              "#e28d1d",
              "#ff3d00",
              "#ff00d4",
              "#00ff00",
              "#e28d1d"
            ]
          }}
          transition={{
            pathLength: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            stroke: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          style={{
            filter: "drop-shadow(0 0 8px var(--stroke-color))",
            "--stroke-color": "currentColor"
          } as any}
        />
      </motion.svg>
    </div>
  )
}

export default LoadingSpinner 