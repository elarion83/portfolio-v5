'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ImageLightboxProps {
  isOpen?: boolean
  imageUrl?: string
  onClose?: () => void
}

export function ImageLightbox({ isOpen = false, imageUrl = '', onClose = () => {} }: ImageLightboxProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <motion.img
          src={imageUrl}
          alt=""
          className="max-w-full max-h-[90vh] object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  )
} 