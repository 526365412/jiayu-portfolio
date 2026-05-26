import { useState, useEffect } from 'react'
import { Globe, Menu, X } from 'lucide-react'

const navItems = [
  { label: '影视', href: '#film-section' },
  { label: '设计', href: '#design-section' },
  { label: 'AIGC', href: '#aigc-section' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 text-white group">
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Globe size={14} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-instrument italic text-lg capitalize">Jiayu</span>
              <span className="text-white/40 font-bold">/</span>
              <span className="text-[9px] bg-white/15 px-2.5 py-1 rounded-full tracking-wider font-mono text-white">DIRECTOR</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-white/70 hover:text-white text-sm font-light tracking-wider transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/50 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-white/80 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-8">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-white text-2xl font-light tracking-[0.3em] hover:text-white/50 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}