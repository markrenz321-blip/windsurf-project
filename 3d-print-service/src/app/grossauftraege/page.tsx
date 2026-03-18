export default function GrossauftraegePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Großaufträge & Kleinserien</h1>
          <p className="mt-4 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Wenn es nicht nur um ein Teil geht, sondern um Planung, Verlässlichkeit und reproduzierbare Qualität:
            Wir setzen Großaufträge und Kleinserien sauber auf – mit klarer Abstimmung, konstanten Einstellungen und
            stabiler Lieferlogik.
          </p>
        </div>

        <section className="glass rounded-3xl p-6 md:p-10 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-white text-xl font-semibold">Planung & Reproduzierbarkeit</h2>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Für Serien ist Konsistenz entscheidend. Wir definieren Material, Qualität, Toleranzen und Finish so,
                dass jedes Teil in deinen Prozess passt – über mehrere Läufe hinweg.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Gleichbleibende Qualität über alle Stückzahlen
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Saubere Abstimmung von Passungen & Anforderungen
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-white text-xl font-semibold">Termintreue & Durchsatz</h2>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Wir planen deine Serie so, dass du verbindliche Meilensteine bekommst. Besonders für Unternehmen zählt:
                Lieferzusagen, die halten – ohne Überraschungen.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Verlässliche Zeitplanung und klare Kommunikation
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Skalierbar von 10 bis 500+ Stück
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-white text-xl font-semibold">Qualitätssicherung</h2>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Jede Serie braucht eine klare Qualitätslinie. Wir prüfen Maße, Sichtflächen und Funktion – und liefern
                auf Wunsch mit Chargenlogik, damit du Sicherheit in deiner Produktion hast.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Sichtprüfung, Entgratung/Support-Removal
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Fokus auf Maßhaltigkeit & Funktion
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 px-6 py-4">
            <p className="text-gray-100 text-sm leading-relaxed">
              Für Serien und Großaufträge kalkulieren wir immer individuell: Stückzahl, Material, Qualitätsstufe,
              Nachbearbeitung, Verpackung und Versand werden sauber abgestimmt. So bekommst du ein Angebot, das wirklich
              zu deinem Einsatz passt – und eine Produktion, die sich zuverlässig wiederholen lässt.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="/#service"
              className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30"
            >
              Individuelles Angebot anfordern
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
