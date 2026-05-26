import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { HeroContent } from '../types'

interface HeroProps {
  content: HeroContent
}

export default function Hero({ content }: HeroProps) {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const video1Url = content.videoUrl || './videos/1.mp4'
  const video2Url = content.videoUrl2 || './videos/index.mp4'

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* 背景层 */}
      {isMobile ? (
        <>
          {/* 手机端：图片背景 + 磨玻璃 */}
          <div className="fixed inset-0 z-0">
            <img src="./bg-mobile.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="fixed inset-0 z-[1] bg-black/20 backdrop-blur-sm pointer-events-none" />
        </>
      ) : (
        <>
          <video
            className="fixed inset-0 w-full h-full object-cover z-0"
            src={video1Url}
            muted
            playsInline
            loop
            autoPlay
            style={{ opacity: activeVideo === 1 ? 1 : 0, transition: 'opacity 1.5s ease' }}
          />
          <video
            className="fixed inset-0 w-full h-full object-cover z-0"
            src={video2Url}
            muted
            playsInline
            loop
            autoPlay
            style={{ opacity: activeVideo === 2 ? 1 : 0, transition: 'opacity 1.5s ease' }}
          />
        </>
      )}

      <div className="fixed inset-0 z-[2] bg-black/30 pointer-events-none" />
      <div className="fixed inset-0 z-[2] bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Hero 文字 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-12 w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2, duration: 1.5 }}
          className="text-white/40 text-[10px] tracking-[0.5em] uppercase mb-6 md:mb-8 font-light"
        >
          PORTFOLIO
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
          style={{ maxWidth: '95vw' }}
        >
          <h1
            className="hero-heading font-instrument italic font-black uppercase"
            style={{
              fontSize: 'clamp(3rem, 13vw, 10rem)',
              letterSpacing: '0.02em',
              lineHeight: 1,
              padding: '0.15em 0.05em 0.2em'
            }}
          >
            {content.heading}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mt-6 md:mt-8 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
        >
          <p className="text-white/90 text-sm md:text-lg tracking-[0.1em] md:tracking-[0.15em] font-light text-center" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {content.subtitle}
          </p>
        </motion.div>

        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex items-center gap-3 mt-6"
          >
            <button onClick={() => setActiveVideo(1)} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeVideo === 1 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`} />
            <button onClick={() => setActiveVideo(2)} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeVideo === 2 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`} />
          </motion.div>
        )}
      </div>

      {/* 下滑指示 - 更明显 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-white/50 text-[10px] md:text-[11px] tracking-[0.3em] uppercase mb-2">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7 11L14 18L21 11" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-40">
            <path d="M5 8L10 13L15 8" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}