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
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 md:inset-4 lg:inset-8 z-10 bg-[#111] md:rounded-[2rem] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* 关闭按钮 - 始终可见 */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 md:absolute md:top-6 md:right-6 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
          >
            <X size={18} />
          </button>

          {/* 媒体区域 */}
          <div className="relative bg-black">
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
                <img src={images[imageIndex]} alt={work.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setImageIndex((imageIndex - 1 + images.length) % images.length) }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/10">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setImageIndex((imageIndex + 1) % images.length) }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/10">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center py-20">
                <p className="text-white/20">暂无预览</p>
              </div>
            )}
          </div>

          {/* 信息面板 - 手机端在下方，始终可见 */}
          <div className="p-5 md:p-8 lg:hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-white bg-white/10 px-3 py-1 rounded-full uppercase tracking-[0.15em]">{work.client || work.category}</span>
              {work.date && <span className="text-xs text-white/50 font-mono">{work.date}</span>}
            </div>
            <h2 className="text-2xl text-white mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>{work.title}</h2>
            {work.description && <p className="text-white/70 text-sm leading-relaxed mb-4">{work.description}</p>}
            {work.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {work.tags.map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-xs border border-white/10">{tag}</span>)}
              </div>
            )}
            <div className="pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Role // {work.client ? '导演 / 摄像 / 后期' : '创作者'}</span>
            </div>
          </div>

          {/* 电脑端信息面板 */}
          <div className="hidden lg:flex border-t border-white/5">
            <div className="w-2/3 bg-black">
              {/* 媒体已在上方 */}
            </div>
            <div className="w-1/3 p-8 flex flex-col border-l border-white/5 bg-[#0a0a0a]">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] text-white bg-white/10 px-3 py-1 rounded-full uppercase tracking-[0.2em]">{work.client || work.category}</span>
                  {work.date && <span className="text-xs text-white/50 font-mono">[{work.date}]</span>}
                </div>
                <h2 className="text-3xl text-white mb-5" style={{ fontFamily: "'Instrument Serif', serif" }}>{work.title}</h2>
                {work.description && <p className="text-white/60 text-sm leading-relaxed mb-6">{work.description}</p>}
                {work.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {work.tags.map(tag => <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-xs border border-white/10">{tag}</span>)}
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-white/5">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Role // {work.client ? '导演 / 摄像 / 后期' : '创作者'}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}