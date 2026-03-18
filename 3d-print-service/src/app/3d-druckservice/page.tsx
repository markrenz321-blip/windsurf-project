export default function DruckservicePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">3D-Druck Service</h1>
          <p className="mt-4 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Wir drucken nicht „einfach irgendwas“ – wir fertigen Teile, die passen, funktionieren und sauber aussehen.
            Egal ob Einzelstück oder Kleinserie: Du bekommst einen klaren Prozess, verlässliche Qualität und eine
            Kommunikation, die schnell zum Ergebnis führt.
          </p>
        </div>

        <section className="glass rounded-3xl p-6 md:p-10 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-white text-xl font-semibold">Privatkunden & Maker</h2>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Du brauchst ein Ersatzteil, eine Halterung oder ein individuelles Projekt? Wir drucken präzise,
                beraten bei Materialwahl und liefern Ergebnisse, die im Alltag standhalten.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Einzelteile, Reparaturen, Custom-Teile
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Saubere Optik + passgenaue Maße
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-white text-xl font-semibold">Startups & Produktteams</h2>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Von der ersten Idee bis zum Prototyp: Wir unterstützen schnelle Iterationen, testen Passformen und
                liefern Prototypen, die du intern oder beim Kunden wirklich zeigen kannst.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Prototyping, Gehäuse, Funktionsmuster
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Planungssicher durch klare Abstimmung
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-white text-xl font-semibold">Unternehmen & Serie</h2>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Für Kleinserien und Großaufträge liefern wir reproduzierbare Qualität, stabile Prozesse und termintreue
                Fertigung – ideal für Montagehilfen, Vorrichtungen oder Bauteile im laufenden Betrieb.
              </p>
              <div className="mt-4 grid gap-2">
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Kleinserien, Ersatzteile, Betriebsmittel
                </div>
                <div className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                  Konstante Ergebnisse über mehrere Läufe
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 px-6 py-4">
            <p className="text-gray-100 text-sm leading-relaxed">
              Du hast nur ein Foto oder eine Skizze? Kein Problem: Mit unserem CAD-Service machen wir daraus ein
              druckfertiges Modell – und wenn du 50, 200 oder 500 Stück brauchst, planen wir die Serie sauber durch.
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
