'use client'

import type { ReactNode } from 'react'
import { Code, Search, CheckCircle2, Ruler } from 'lucide-react'

type Step = {
  number: string
  title: string
  description: string
  icon: ReactNode
}

export default function ProcessSection() {
  const steps: Step[] = [
    {
      number: '01',
      title: 'Digitale Analyse & Optimierung',
      description:
        'Jedes Modell wird vor dem Druck digital auf Wandstärken, Geometrie und Stabilität geprüft. Wir optimieren die Slicing-Parameter für maximale Belastbarkeit.',
      icon: <Search className="h-6 w-6 text-cyan-300" />,
    },
    {
      number: '02',
      title: 'Präzisionsfertigung',
      description:
        'Wir setzen auf vollautomatisierte Fertigungssysteme mit aktiver Flusskontrolle und Vibrationskompensation. Dies garantiert ein sauberes Oberflächenfinish und Maßhaltigkeit.',
      icon: <Code className="h-6 w-6 text-cyan-300" />,
    },
    {
      number: '03',
      title: 'Qualitätssicherung & Finish',
      description:
        'Nach dem Druck wird jedes Teil manuell von Stützstrukturen befreit und einer finalen Sichtprüfung unterzogen, bevor es sicher verpackt den Versand antritt.',
      icon: <CheckCircle2 className="h-6 w-6 text-cyan-300" />,
    },
    {
      number: '04',
      title: 'Individuelle CAD-Konstruktion',
      description:
        'Keine druckfertige Datei? Kein Problem. Wir transformieren Ihre Skizzen, Fotos oder defekten Bauteile in präzise 3D-Modelle. Von der ersten Idee bis zum fertigen Prototyp.',
      icon: <Ruler className="h-6 w-6 text-cyan-300" />,
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Von der Idee bis zur Serie: Unser Prozess</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Strukturierte Abläufe für Einzelteile und Serienfertigung – zuverlässig, transparent und auf Maß.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.number} className="glass rounded-2xl p-6 border border-white/10 relative overflow-hidden">
              <div className="absolute -top-6 -right-3 text-7xl font-extrabold text-white/5 select-none">
                {s.number}
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl border border-cyan-300/20 bg-cyan-500/10 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg leading-snug">{s.title}</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="rounded-2xl border border-cyan-500/50 bg-cyan-500/5 px-6 py-4">
            <p className="text-gray-100 text-sm">
              Bereit für Serie: Wir realisieren auch Großaufträge und Kleinserien mit höchster Termintreue.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/#service"
            className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30"
          >
            Individuelles Angebot anfordern
          </a>
        </div>
      </div>
    </section>
  )
}
