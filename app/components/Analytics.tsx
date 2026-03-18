 'use client'
 
 import { useEffect } from 'react'
 import { usePathname, useSearchParams } from 'next/navigation'
 import { pageview } from '../lib/gtag'
 
 export function Analytics() {
   const pathname = usePathname()
   const searchParams = useSearchParams()
 
   useEffect(() => {
     if (!pathname) return
     const qs = searchParams?.toString()
     const url = qs ? `${pathname}?${qs}` : pathname
     pageview(url)
   }, [pathname, searchParams])
 
   return null
 }

