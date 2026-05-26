import type { Work } from '../types'

interface WorkCardProps {
  work: Work
  onClick: () => void
}

export default function WorkCard({ work, onClick }: WorkCardProps) {
  const placeholderCover = `https://picsum.photos/seed/${work.id}/640/360`

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer text-left"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={work.cover || placeholderCover}
          alt={work.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex items-center gap-2 mb-3">
          {work.client && (
            <span className="text-white/60 text-xs tracking-wider uppercase">{work.client}</span>
          )}
          {work.date && (
            <>
              <span className="text-white/30">·</span>
              <span className="text-white/40 text-xs">{work.date}</span>
            </>
          )}
        </div>

        <h3
          className="text-white text-xl md:text-2xl mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {work.title}
        </h3>

        {work.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            {work.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  )
}