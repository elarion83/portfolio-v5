// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GKXF35YJ15'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
  }: {
    event_category?: string
    event_label?: string
    value?: number
  }
) => {
  if (typeof window !== 'undefined') {
    window.gtag('event', action, {
      event_category,
      event_label,
      value,
    })
  }
}

// Type definition for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: {
        page_path?: string
        event_category?: string
        event_label?: string
        value?: number
      }
    ) => void
  }
} 