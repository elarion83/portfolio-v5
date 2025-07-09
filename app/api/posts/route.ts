import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, getBlogPost } from '../../lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const _embed = searchParams.get('_embed')
  const _fields = searchParams.get('_fields')

  try {
    if (slug) {
      // Récupérer un post spécifique
      const post = await getBlogPost(slug)
      return NextResponse.json([post]) // Retourner un tableau pour compatibilité
    } else {
      // Récupérer tous les posts
      const posts = await getBlogPosts()
      return NextResponse.json(posts)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
} 