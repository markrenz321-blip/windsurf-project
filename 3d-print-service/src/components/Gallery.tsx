'use client'

import { useMemo, useState } from 'react'

type GalleryItem = {
  id: string
  title: string
  subtitle?: string
  tag?: string
}

export default function Gallery() {
  const items = useMemo<GalleryItem[]>(
    () => [
      { id: 'p1', title: 'Ersatzteil (Beispiel)', subtitle: 'PETG • Funktionsteil', tag: 'Ersatzteil' },
      { id: 'p2', title: 'Gehäuse (Beispiel)', subtitle: 'PLA • Prototyp', tag: 'Prototyp' },
      { id: 'p3', title: 'Halterung (Beispiel)', subtitle: 'ABS • Stabil', tag: 'Halterung' },
      { id: 'p4', title: 'Zahnrad (Beispiel)', subtitle: 'PA • Belastbar', tag: 'Mechanik' },
      { id: 'p5', title: 'Cover (Beispiel)', subtitle: 'PLA • Clean', tag: 'Design' },
      { id: 'p6', title: 'Adapter (Beispiel)', subtitle: 'PETG • Passgenau', tag: 'Adapter' },
      { id: 'p7', title: 'Clip (Beispiel)', subtitle: 'PLA • Schnell', tag: 'Kleinserie' },
      { id: 'p8', title: 'Mockup (Beispiel)', subtitle: 'Resin • Detail', tag: 'Fein' },
    ],
    []
  )

  const [activeId, setActiveId] = useState<string | null>(null)

  const activeItem = useMemo(() => items.find((i) => i.id === activeId) ?? null, [items, activeId])

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Beispielprojekte</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hier siehst du eine Auswahl an Beispielprojekten. Bald ersetzen wir die Platzhalter durch echte Fotos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className="glass glass-hover rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-500/20 via-gray-800 to-gray-900 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20" />
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  {item.tag && (
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-200 whitespace-nowrap">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.subtitle && <p className="text-sm text-gray-400">{item.subtitle}</p>}
              </div>
            </button>
          ))}
        </div>

        {activeItem && (
          <div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveId(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="glass rounded-2xl w-full max-w-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white text-xl font-bold">{activeItem.title}</h3>
                  {activeItem.subtitle && <p className="text-gray-400 mt-1">{activeItem.subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="px-3 py-2 rounded-lg border border-white/10 text-gray-200 hover:bg-white/5 transition-colors"
                >
                  Schließen
                </button>
              </div>

              <div className="mt-5 aspect-video rounded-xl bg-gradient-to-br from-indigo-500/20 via-gray-800 to-gray-900 border border-white/5 flex items-center justify-center">
                <div className="w-28 h-28 rounded-3xl bg-indigo-500/10 border border-indigo-500/20" />
              </div>

              <div className="mt-4 text-sm text-gray-400">
                Platzhalter-Vorschau. Sobald echte Bilder vorhanden sind, zeigen wir hier das Projektfoto in groß.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
