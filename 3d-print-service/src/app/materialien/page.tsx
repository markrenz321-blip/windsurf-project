export default function MaterialienPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Materialien</h1>
          <p className="mt-4 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Jedes Projekt ist anders – deshalb beginnt Qualität bei uns schon vor dem ersten Layer: mit einer
            Materialwahl, die zu Belastung, Optik und Einsatzzweck passt. Wir drucken bewusst mit einer fokussierten
            Auswahl, die sich im Alltag bewährt und reproduzierbare Ergebnisse liefert.
          </p>
        </div>

        <section className="glass rounded-3xl p-6 md:p-10 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-white text-xl font-semibold">PLA</h2>
                <span className="text-xs px-3 py-1 rounded-full border border-cyan-300/20 text-cyan-100 bg-cyan-500/10">
                  Präzise Optik
                </span>
              </div>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Ideal, wenn es auf saubere Kanten, feine Details und ein hochwertiges Erscheinungsbild ankommt. Perfekt
                für Prototypen, Gehäuse und Präsentationsmodelle.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Sehr glatte Oberflächen und exakte Passformen
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Schnelle Umsetzung – ideal für Iterationen
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Top Preis/Leistung für viele Projekte
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-white text-xl font-semibold">PETG</h2>
                <span className="text-xs px-3 py-1 rounded-full border border-cyan-300/20 text-cyan-100 bg-cyan-500/10">
                  Alltagstauglich
                </span>
              </div>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Wenn dein Teil „einfach funktionieren“ muss: PETG ist der robuste Allrounder für Halterungen, Adapter
                und Funktionsteile – stabil, zuverlässig und langlebig.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Hohe Belastbarkeit bei sauberem Finish
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Perfekt für Bauteile, die „im Einsatz“ sind
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Gute Wahl für Einzelteile und Serien
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-white text-xl font-semibold">TPU</h2>
                <span className="text-xs px-3 py-1 rounded-full border border-cyan-300/20 text-cyan-100 bg-cyan-500/10">
                  Flex & Grip
                </span>
              </div>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Für alles, was flexibel, griffig oder stoßdämpfend sein soll: TPU ist perfekt für Schutzelemente,
                Dichtungen, Clips oder rutschfeste Anwendungen.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Angenehme Haptik und hohe Rückstellkraft
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Ideal für Funktion + Komfort
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Langlebig bei wiederholter Belastung
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 px-6 py-4">
            <p className="text-gray-100 text-sm leading-relaxed">
              Du bist unsicher, welches Material ideal ist? Schick uns deine Datei oder Fotos – wir empfehlen dir die
              beste Option für Stabilität, Optik und Kosten. Bei Großaufträgen und Kleinserien stimmen wir Material,
              Einstellungen und Qualität so ab, dass du reproduzierbare Ergebnisse bekommst.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="/#service"
              className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30"
            >
              Jetzt Projekt starten
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
