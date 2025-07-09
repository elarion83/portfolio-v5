import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page non trouvée | Nicolas Gruwe',
  description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#261939] to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[#e28d1d] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-400 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e28d1d] text-white rounded-lg hover:bg-[#e28d1d]/80 transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>

          <div className="text-sm text-gray-500">
            <p>Vous pouvez aussi :</p>
            <div className="mt-2 space-y-2">
              <Link
                href="/portfolio"
                className="block text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
              >
                Voir mon portfolio
              </Link>
              <Link
                href="/blog"
                className="block text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
              >
                Lire mon blog
              </Link>
              <Link
                href="/contact"
                className="block text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 