import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('post')
  const order = searchParams.get('order') || 'desc'

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://portfolio.deussearch.fr/wp-json/wp/v2/comments?post=${postId}&order=${order}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments')
    }

    const comments = await response.json()
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit comment')
    }

    const comment = await response.json()
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error submitting comment:', error)
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 })
  }
} 