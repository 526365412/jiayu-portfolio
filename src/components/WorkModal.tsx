import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Work } from '../types'

interface WorkModalProps {
  work: Work
  onClose: () => void
}

function getVideoEmbed(url: string): string {
  if (!url) return ''
  if (url.includes('bilibili.com')) {
    const match = url.match(/\/BV[\w]+/)
    if (match) return `https://player.bilibili.com/player.html?bvid=${match[0].slice(1)}`
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }
  return url
}

export default function WorkModal({ work, onClose }: WorkModalProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const images = work.cover ? [work.cover] : []
  const isDirectVideo = work.videoUrl && !work.videoUrl.includes('bilibili') && !work.videoUrl.includes('youtube') && !work.videoUrl.includes('youtu.be')
  const embedUrl = work.videoUrl ? getVideoEmbed(work.videoUrl) : ''

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[2rem] bg-[#111] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          onClick={e => e.stopPropagation()}
        >
          {/* Top bar - monitor style */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-white/40 text-xs font-mono ml-4">JIAYU // PORTFOLIO VIEWER</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Media area */}
            <div className="lg:w-2/3 relative bg-black">
              {work.category === 'film' && work.videoUrl ? (
                <div className="aspect-video w-full">
                  {isDirectVideo ? (
                    <video src={work.videoUrl} controls className="w-full h-full" />
                  ) : (
                    <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
                  )}
                </div>
              ) : images.length > 0 ? (
                <div className="relative aspect-video">
                  <img
                    src={images[imageIndex]}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors border border-white/10"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() => setImageIndex((imageIndex + 1) % images.length)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors border border-white/10"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center">
                  <p className="text-white/20">暂无预览</p>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="lg:w-1/3 p-8 flex flex-col border-l border-white/5 bg-[#0a0a0a]">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] text-white bg-white/10 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    {work.client || work.category}
                  </span>
                  {work.date && (
                    <span className="text-xs text-white/50 font-mono">[{work.date}]</span>
                  )}
                </div>

                <h2
                  className="text-3xl md:text-4xl text-white mb-5"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {work.title}
                </h2>

                {work.description && (
                  <p className="text-white/60 text-sm leading-relaxed mb-6">{work.description}</p>
                )}

                {work.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {work.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-xs border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  Role // {work.client ? '导演 / 摄像 / 后期' : '创作者'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}