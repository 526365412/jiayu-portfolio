import { useRef, useEffect, useCallback } from 'react'

export default function MouseSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number>(0)

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'

    mouseRef.current.x = lerp(mouseRef.current.x, targetRef.current.x, 0.08)
    mouseRef.current.y = lerp(mouseRef.current.y, targetRef.current.y, 0.08)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createRadialGradient(
      mouseRef.current.x,
      mouseRef.current.y,
      0,
      mouseRef.current.x,
      mouseRef.current.y,
      300
    )
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.01)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}