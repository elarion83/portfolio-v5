'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AchievementPopup } from './AchievementPopup'

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  id: string
  distanceToMouse?: number
}

interface Achievement {
  id: string
  threshold: number
  level: number
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'star-explorer',
    threshold: 15,
    level: 1
  },
  {
    id: 'star-voyager',
    threshold: 30,
    level: 2
  },
  {
    id: 'star-commander',
    threshold: 50,
    level: 3
  },
  {
    id: 'star-admiral',
    threshold: 75,
    level: 4
  },
  {
    id: 'galactic-master',
    threshold: 100,
    level: 5
  }
]

interface ConstellationBackgroundProps {
  showAchievements?: boolean
}

export function ConstellationBackground({ showAchievements = true }: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isMouseInCanvas = useRef(false)
  const connectedStarsRef = useRef(new Set<string>())
  const [achievement, setAchievement] = useState<Achievement | null>(null)
  const achievedRef = useRef(new Set<string>())

  const checkAchievement = (count: number) => {
    const nextAchievement = ACHIEVEMENTS
      .filter(a => count >= a.threshold && !achievedRef.current.has(a.id))
      .sort((a, b) => b.threshold - a.threshold)[0]

    if (nextAchievement) {
      achievedRef.current.add(nextAchievement.id)
      setAchievement(nextAchievement)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (!isMouseInCanvas.current) {
        mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true })
    resizeCanvas()

    const getNumPoints = () => {
      const width = window.innerWidth
      if (width < 640) return 40
      if (width < 1024) return 60
      return 100
    }

    const points: Point[] = []
    const numPoints = getNumPoints()
    const maxDistance = window.innerWidth < 640 ? 100 : 150
    const pointRadius = window.innerWidth < 640 ? 1.5 : 2
    const pointSpeed = 0.5

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * pointSpeed,
        vy: (Math.random() - 0.5) * pointSpeed,
        id: `star-${i}`
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      mouseRef.current = {
        x: x * scaleX,
        y: y * scaleY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      mouseRef.current = {
        x: x * scaleX,
        y: y * scaleY
      }
    }

    const handleMouseEnter = () => {
      isMouseInCanvas.current = true
    }

    const handleMouseLeave = () => {
      isMouseInCanvas.current = false
      mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
    }

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    canvas.addEventListener('touchstart', () => isMouseInCanvas.current = true, { passive: true })
    canvas.addEventListener('touchend', () => {
      isMouseInCanvas.current = false
      setTimeout(() => {
        if (!isMouseInCanvas.current) {
          mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
        }
      }, 50)
    }, { passive: true })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      points.forEach(point => {
        point.x += point.vx
        point.y += point.vy

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1

        point.x = Math.max(0, Math.min(canvas.width, point.x))
        point.y = Math.max(0, Math.min(canvas.height, point.y))

        const dx = point.x - mouseRef.current.x
        const dy = point.y - mouseRef.current.y
        point.distanceToMouse = Math.sqrt(dx * dx + dy * dy)

        ctx.beginPath()
        ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2)
        ctx.fillStyle = window.innerWidth < 640 
          ? 'rgba(226, 141, 29, 0.3)' 
          : 'rgba(226, 141, 29, 0.5)'
        ctx.fill()
      })

      points.forEach((point, i) => {
        points.slice(i + 1).forEach(otherPoint => {
          const dx = point.x - otherPoint.x
          const dy = point.y - otherPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = window.innerWidth < 640 
              ? (1 - distance / maxDistance) * 0.2 
              : (1 - distance / maxDistance) * 0.3
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(otherPoint.x, otherPoint.y)
            ctx.strokeStyle = `rgba(226, 141, 29, ${opacity})`
            ctx.stroke()
          }
        })
      })

      if (isMouseInCanvas.current) {
        const closestPoints = [...points]
          .sort((a, b) => (a.distanceToMouse || Infinity) - (b.distanceToMouse || Infinity))
          .slice(0, 3)
        
        closestPoints.forEach(point => {
          if (!connectedStarsRef.current.has(point.id)) {
            connectedStarsRef.current.add(point.id)
            checkAchievement(connectedStarsRef.current.size)
          }

          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
          ctx.strokeStyle = window.innerWidth < 640 
            ? 'rgba(226, 141, 29, 0.2)' 
            : 'rgba(226, 141, 29, 0.3)'
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(point.x, point.y, pointRadius * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = window.innerWidth < 640 
            ? 'rgba(226, 141, 29, 0.6)' 
            : 'rgba(226, 141, 29, 0.8)'
          ctx.fill()
        })
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', () => isMouseInCanvas.current = true)
      canvas.removeEventListener('touchend', () => {
        isMouseInCanvas.current = false
        mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
      })
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent', zIndex: 1 }}
      />
      {showAchievements && (
        <AchievementPopup
          achievementId={achievement?.id || ''}
          isVisible={!!achievement}
          onClose={() => setAchievement(null)}
          level={achievement?.level || 1}
        />
      )}
    </>
  )
} 