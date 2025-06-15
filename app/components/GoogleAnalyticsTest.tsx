'use client'

import { event } from '../lib/gtag'

export default function GoogleAnalyticsTest() {
  const handleTestClick = () => {
    // Test d'événement Google Analytics
    event('test_button_click', {
      event_category: 'test',
      event_label: 'ga_verification',
      value: 1
    })
    
    console.log('✅ Événement Google Analytics envoyé: test_button_click')
    
    // Vérification que gtag est bien chargé
    if (typeof window !== 'undefined' && 'gtag' in window) {
      console.log('✅ Google Analytics (gtag) est chargé')
    } else {
      console.log('❌ Google Analytics (gtag) n\'est pas chargé')
    }
  }

  const handlePageViewTest = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-479398117', {
        page_path: '/test-page-view',
      })
      console.log('✅ Page view test envoyé pour /test-page-view')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">🔍 Test Google Analytics</h3>
      <div className="space-y-2">
        <button 
          onClick={handleTestClick}
          className="block w-full bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded text-sm"
        >
          Test Événement
        </button>
        <button 
          onClick={handlePageViewTest}
          className="block w-full bg-green-500 hover:bg-green-700 px-3 py-1 rounded text-sm"
        >
          Test Page View
        </button>
        <p className="text-xs mt-2">
          Ouvrez la console (F12) pour voir les logs
        </p>
      </div>
    </div>
  )
} 