'use client'

import { ArrowDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-900 to-gray-900"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 fade-in">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="glass rounded-full p-6 glass-hover transition-all duration-300">
            <picture>
              <source srcSet="/uploads/logo-transparent.webp" type="image/webp" />
              <source srcSet="/uploads/logo-transparent.png" type="image/png" />
              <img
                src="/uploads/logo.png"
                alt="Renz 3D Print"
                className="h-16 sm:h-20 w-auto object-contain"
                loading="eager"
              />
            </picture>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Dein Design
        </h1>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
          unser Druck
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Professioneller 3D-Druck Service für deine Ideen. 
          Von der Konzeption bis zum fertigen Produkt.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button className="glass glass-hover px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105">
            Jetzt Hochladen
          </button>
          <button className="border border-indigo-500/50 px-8 py-4 rounded-full text-indigo-400 font-semibold transition-all duration-300 hover:bg-indigo-500/10 hover:scale-105">
            Mehr Erfahren
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  )
}
