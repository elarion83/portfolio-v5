'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from './contexts/LanguageContext'
import { Navigation } from './components/Navigation'
import { LanguageSwitch } from './components/LanguageSwitch'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <div className="relative overflow-x-hidden w-full">
          <Navigation />
          <LanguageSwitch />
          <main className="content-container">
            {children}
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
} 