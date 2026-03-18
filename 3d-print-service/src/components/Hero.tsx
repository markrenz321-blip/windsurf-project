'use client'

import { ArrowDown, Shield, Clock, Package } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-[#050505] to-[#050505]"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[560px] h-[560px] bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-28 -right-24 w-[680px] h-[680px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating side gallery (desktop only) */}
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
        }}
      >
        <div className="absolute left-8 top-24 w-[360px]">
          <div className="relative">
            <div className="absolute -left-3 top-0 w-56 aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/40 opacity-40 blur-sm anim-float-1 rotate-[-3deg]" />
            <div className="absolute left-16 top-28 w-72 aspect-[16/10] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/40 opacity-30 blur-sm anim-float-2 rotate-[2deg]" />
            <div className="absolute left-6 top-60 w-60 aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/40 opacity-25 blur-sm anim-float-3 rotate-[1deg]" />
          </div>
        </div>

        <div className="absolute right-8 top-28 w-[360px]">
          <div className="relative">
            <div className="absolute right-8 top-2 w-64 aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/40 opacity-35 blur-sm anim-float-2 rotate-[3deg]" />
            <div className="absolute right-20 top-36 w-72 aspect-[16/10] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/40 opacity-25 blur-sm anim-float-3 rotate-[-2deg]" />
            <div className="absolute right-4 top-72 w-56 aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/40 opacity-20 blur-sm anim-float-1 rotate-[1deg]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 fade-in">
        {/* Main heading */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white"
          style={{ textShadow: '0 0 42px rgba(34, 211, 238, 0.20), 0 0 22px rgba(59, 130, 246, 0.22)' }}
        >
          Dein Design
        </h1>
        <h2
          className="mt-2 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
          style={{ textShadow: '0 0 38px rgba(59, 130, 246, 0.20), 0 0 18px rgba(34, 211, 238, 0.16)' }}
        >
          unser Druck
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Professioneller 3D-Druck Service für deine Ideen. 
          Von der Konzeption bis zum fertigen Produkt.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#service"
            className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30"
          >
            Jetzt starten
          </a>
          <a
            href="/#gallery"
            className="border border-cyan-300/30 px-8 py-4 rounded-full text-cyan-100 font-semibold transition-all duration-300 hover:bg-white/5 hover:scale-105"
          >
            Beispielprojekte
          </a>
        </div>

        {/* Three pillar info bar */}
        <div className="mt-10 w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 glass rounded-2xl px-5 py-4 border border-white/10">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Shield className="w-5 h-5 text-cyan-300" />
              <span className="text-sm text-gray-200 font-medium">Industrie-Qualität</span>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Clock className="w-5 h-5 text-cyan-300" />
              <span className="text-sm text-gray-200 font-medium">24h Express-Start</span>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Package className="w-5 h-5 text-cyan-300" />
              <span className="text-sm text-gray-200 font-medium">Versandfertig in 2-3 Tagen</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="/#service"
          className="mt-10 inline-flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Zum Service scrollen"
        >
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
