'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/#home" className="flex items-center gap-3" aria-label="Zur Startseite">
          <span
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(37, 99, 235, 0.9))',
              boxShadow: '0 0 22px rgba(34, 211, 238, 0.22), 0 0 16px rgba(37, 99, 235, 0.18)',
            }}
          >
            <span className="h-4 w-4 rounded-[6px] bg-black/70 border border-white/10" />
          </span>

          <span className="text-white leading-none">
            <span className="text-base sm:text-lg font-extrabold tracking-tight">RENZ</span>
            <span className="ml-2 text-base sm:text-lg font-light tracking-tight text-gray-200">3D</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a href="/#service" className="group relative text-gray-200 hover:text-white transition-colors">
            <span>Service</span>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-0 bg-cyan-300/60 transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/#gallery" className="group relative text-gray-200 hover:text-white transition-colors">
            <span>Galerie</span>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-0 bg-cyan-300/60 transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="/#status" className="group relative text-gray-200 hover:text-white transition-colors">
            <span>Status</span>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-0 bg-cyan-300/60 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="/#service"
            className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30 transition-all"
          >
            Jetzt starten
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 text-cyan-200 hover:text-cyan-100 hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            <a
              href="/#service"
              onClick={() => setMobileOpen(false)}
              className="text-gray-200 hover:text-white transition-colors"
            >
              Service
            </a>
            <a
              href="/#gallery"
              onClick={() => setMobileOpen(false)}
              className="text-gray-200 hover:text-white transition-colors"
            >
              Galerie
            </a>
            <a
              href="/#status"
              onClick={() => setMobileOpen(false)}
              className="text-gray-200 hover:text-white transition-colors"
            >
              Status
            </a>
            <a
              href="/#service"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3 rounded-full text-center text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30 transition-all"
            >
              Jetzt starten
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
