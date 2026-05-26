import { useRef, useEffect, useState } from 'react'
import type { SectionContent } from '../types'

interface SectionTitleProps {
  content: SectionContent
}

export default function SectionTitle({ content }: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={content.id}
      className={`pt-32 pb-16 px-6 text-center scroll-mt-24 transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4 font-bold">{content.subtitle}</p>
        <h2 className="hero-heading font-black uppercase tracking-tight text-4xl sm:text-6xl md:text-7xl leading-none mb-4">
          {content.title}
        </h2>
        <p className="text-white/40 text-xs sm:text-sm font-light mt-3 max-w-xl mx-auto">{content.description}</p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-8" />
      </div>
    </div>
  )
}