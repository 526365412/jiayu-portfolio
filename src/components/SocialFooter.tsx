import { ArrowUp, ExternalLink } from 'lucide-react'
import type { FooterContent } from '../types'

interface SocialFooterProps {
  content: FooterContent
}

export default function SocialFooter({ content }: SocialFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative py-32 px-6 overflow-hidden bg-transparent">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          <div>
            <h3 className="text-4xl text-white mb-4 font-instrument italic" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {content.name}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">{content.tagline}</p>
          </div>

          <div>
            <h4 className="text-white/60 text-[10px] tracking-[0.3em] uppercase font-bold mb-6">联系方式</h4>
            <div className="space-y-3">
              <a href={`mailto:${content.email}`} className="block text-white/50 hover:text-white text-sm transition-colors">
                {content.email}
              </a>
              <p className="text-white/50 text-sm">TEL: {content.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="text-white/60 text-[10px] tracking-[0.3em] uppercase font-bold mb-6">社媒主页</h4>
            <div className="space-y-4 text-xs">
              {content.socialLinks.xiaohongshu && (
                <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider">小红书</span>
                  <span className="text-white font-medium">{content.socialLinks.xiaohongshu}</span>
                </div>
              )}
              {content.socialLinks.xinpianchang && (
                <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider">新片场</span>
                  <a href={content.socialLinks.xinpianchang} target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:underline flex items-center gap-1">
                    <span>JiangJiaYu</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              )}
              {content.socialLinks.douyin && (
                <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider">抖音</span>
                  <span className="text-white font-medium">{content.socialLinks.douyin}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.25em]">
          <span>JIAYU // PORTFOLIO DESIGNED WITH MASTERCLASS</span>
          <span>{content.copyright}</span>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={scrollToTop}
            className="w-14 h-14 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-white/5 backdrop-blur-sm"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  )
}