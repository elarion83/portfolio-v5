'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Navigation } from '@/components/Navigation'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { ImageLightbox } from '@/components/ImageLightbox'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <div className="relative overflow-x-hidden w-full">
          <LanguageSwitch />
          <Navigation />
          <main className="content-container">
            {children}
          </main>
          <ImageLightbox />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
} 