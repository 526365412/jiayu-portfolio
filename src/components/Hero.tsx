import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { HeroContent } from '../types'

interface HeroProps {
  content: HeroContent
}

export default function Hero({ content }: HeroProps) {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1)

  const video1Url = content.videoUrl || './videos/1.mp4'
  const video2Url = content.videoUrl2 || './videos/index.mp4'

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* 视频1 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src={video1Url}
        muted
        playsInline
        loop
        autoPlay
        style={{ opacity: activeVideo === 1 ? 1 : 0, transition: 'opacity 1.5s ease' }}
      />
      {/* 视频2 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src={video2Url}
        muted
        playsInline
        loop
        autoPlay
        style={{ opacity: activeVideo === 2 ? 1 : 0, transition: 'opacity 1.5s ease' }}
      />

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center gap-3 mt-6"
        >
          <button
            onClick={() => setActiveVideo(1)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeVideo === 1 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
          />
          <button
            onClick={() => setActiveVideo(2)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeVideo === 2 ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
          />
        </motion.div>

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