import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import type { Work } from '../types'
import WorkModal from './WorkModal'

interface WorkGridProps {
  works: Work[]
}

export default function WorkGrid({ works }: WorkGridProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (works.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-white/20 text-sm">暂无作品，可通过后台管理添加</p>
      </div>
    )
  }

  const duplicatedWorks = [...works, ...works, ...works]

  return (
    <>
      <div
        ref={containerRef}
        className={`relative transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="overflow-hidden py-12">
          <motion.div
            className="flex gap-6 items-end"
            animate={{
              x: ['0%', `-${100 / 3}%`]
            }}
            transition={{
              x: {
                duration: works.length * 8,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            style={{ width: 'max-content' }}
          >
            {duplicatedWorks.map((work, index) => (
              <CarouselCard
                key={`${work.id}-${index}`}
                work={work}
                onClick={() => setSelectedWork(work)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {selectedWork && (
        <WorkModal work={selectedWork} onClose={() => setSelectedWork(null)} />
      )}
    </>
  )
}

interface CarouselCardProps {
  work: Work
  onClick: () => void
}

function CarouselCard({ work, onClick }: CarouselCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const isPortrait = work.orientation === 'portrait'
  const placeholderCover = `https://picsum.photos/seed/${work.id}/${isPortrait ? '540/960' : '960/540'}`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className={`flex-shrink-0 cursor-pointer group ${
        isPortrait ? 'w-[280px] md:w-[320px]' : 'w-[450px] md:w-[550px]'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
        <div className={`overflow-hidden ${isPortrait ? 'aspect-[3/4]' : 'aspect-video'}`}>
          <img
            src={work.cover || placeholderCover}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] text-white bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-[0.15em] font-medium">
              {work.client || work.category}
            </span>
            {work.date && (
              <span className="text-[10px] text-white/40 font-mono">{work.date}</span>
            )}
          </div>

          <h3
            className="text-lg md:text-xl text-white mb-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {work.title}
          </h3>

          {work.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {work.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-3 group-hover:translate-x-0">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}