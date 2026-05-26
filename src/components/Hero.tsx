import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import type { HeroContent } from '../types'

interface HeroProps {
  content: HeroContent
}

export default function Hero({ content }: HeroProps) {
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1)
  const opacity1Ref = useRef(0)
  const opacity2Ref = useRef(0)
  const animFrame1Ref = useRef<number>(0)
  const animFrame2Ref = useRef<number>(0)
  const isPlaying1Ref = useRef(false)
  const isPlaying2Ref = useRef(false)
  const initialized2Ref = useRef(false)

  const animateOpacity = useCallback((frameRef: React.MutableRefObject<number>, opacityRef: React.MutableRefObject<number>, videoRef: React.RefObject<HTMLVideoElement | null>, target: number, duration: number) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    const video = videoRef.current
    if (!video) return
    const startOpacity = opacityRef.current
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
      const current = startOpacity + (target - startOpacity) * eased
      video.style.opacity = String(current)
      opacityRef.current = current
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    const video = video1Ref.current
    if (!video || !content.videoUrl) return

    const handleTimeUpdate = () => {
      if (!isPlaying1Ref.current) return
      const remaining = video.duration - video.currentTime
      if (remaining <= 3 && remaining > 0) animateOpacity(animFrame1Ref, opacity1Ref, video1Ref, 0, 3000)
    }

    const handleEnded = () => {
      isPlaying1Ref.current = false
      video.style.opacity = '0'
      opacity1Ref.current = 0
      setTimeout(() => {
        video.currentTime = 0
        video.play().then(() => {
          isPlaying1Ref.current = true
          animateOpacity(animFrame1Ref, opacity1Ref, video1Ref, 1, 3000)
        })
      }, 300)
    }

    const handleCanPlay = () => {
      if (!isPlaying1Ref.current) {
        video.play().then(() => {
          isPlaying1Ref.current = true
          animateOpacity(animFrame1Ref, opacity1Ref, video1Ref, 1, 3000)
        }).catch(() => {})
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('canplay', handleCanPlay)
      if (animFrame1Ref.current) cancelAnimationFrame(animFrame1Ref.current)
    }
  }, [animateOpacity, content.videoUrl])

  useEffect(() => {
    const video = video2Ref.current
    if (!video || !content.videoUrl2) return

    const handleTimeUpdate = () => {
      if (!isPlaying2Ref.current) return
      const remaining = video.duration - video.currentTime
      if (remaining <= 3 && remaining > 0) animateOpacity(animFrame2Ref, opacity2Ref, video2Ref, 0, 3000)
    }

    const handleEnded = () => {
      isPlaying2Ref.current = false
      video.style.opacity = '0'
      opacity2Ref.current = 0
      setTimeout(() => {
        video.currentTime = 0
        video.play().then(() => {
          isPlaying2Ref.current = true
          animateOpacity(animFrame2Ref, opacity2Ref, video2Ref, 1, 3000)
        })
      }, 300)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      if (animFrame2Ref.current) cancelAnimationFrame(animFrame2Ref.current)
    }
  }, [animateOpacity, content.videoUrl2])

  const switchVideo = (num: 1 | 2) => {
    if (num === activeVideo) return
    setActiveVideo(num)

    if (num === 2) {
      animateOpacity(animFrame1Ref, opacity1Ref, video1Ref, 0, 1500)
      const video2 = video2Ref.current
      if (video2) {
        if (!initialized2Ref.current) {
          video2.currentTime = 0
          initialized2Ref.current = true
        }
        setTimeout(() => {
          video2.play().then(() => {
            isPlaying2Ref.current = true
            animateOpacity(animFrame2Ref, opacity2Ref, video2Ref, 1, 1500)
          }).catch(() => {})
        }, 500)
      }
    } else {
      isPlaying2Ref.current = false
      animateOpacity(animFrame2Ref, opacity2Ref, video2Ref, 0, 1500)
      setTimeout(() => animateOpacity(animFrame1Ref, opacity1Ref, video1Ref, 1, 1500), 500)
    }
  }

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {content.videoUrl && (
        <video ref={video1Ref} className="fixed inset-0 w-full h-full object-cover z-0" src={content.videoUrl} muted playsInline style={{ opacity: 0 }} />
      )}
      {content.videoUrl2 && (
        <video ref={video2Ref} className="fixed inset-0 w-full h-full object-cover z-[1]" src={content.videoUrl2} muted playsInline style={{ opacity: 0 }} />
      )}

      <div className="fixed inset-0 z-[2] bg-black/30 pointer-events-none" />
      <div className="fixed inset-0 z-[2] bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-12 w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2, duration: 1.5 }}
          className="text-white/40 text-[10px] tracking-[0.5em] uppercase mb-8 font-light"
        >
          PORTFOLIO
        </motion.p>

        {/* 标题 - 放大2倍，不裁切 */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
          style={{ maxWidth: '100%' }}
        >
          <h1
            className="hero-heading font-instrument italic font-black uppercase"
            style={{
              fontSize: 'min(12vw, 10rem)',
              letterSpacing: '0.02em',
              lineHeight: 1,
              padding: '0.15em 0.1em 0.2em'
            }}
          >
            {content.heading}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mt-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
        >
          <p className="text-white/90 text-base md:text-lg tracking-[0.15em] font-light text-center" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {content.subtitle}
          </p>
        </motion.div>

        {content.videoUrl2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex items-center gap-3 mt-6"
          >
            <button
              onClick={() => switchVideo(1)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeVideo === 1 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
              aria-label="视频 1"
            />
            <button
              onClick={() => switchVideo(2)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeVideo === 2 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
              aria-label="视频 2"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-6"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-white/30 text-[9px] tracking-[0.4em] uppercase">{content.scrollText}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  )
}