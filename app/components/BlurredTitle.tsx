'use client'

import { blurSensitiveWord } from '@/app/utils/textUtils'

interface BlurredTitleProps {
  title: string
}

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'");
}

export function BlurredTitle({ title }: BlurredTitleProps) {
  const decodedTitle = decodeHtmlEntities(title);
  return <span dangerouslySetInnerHTML={{ __html: blurSensitiveWord(decodedTitle) }} />
} 