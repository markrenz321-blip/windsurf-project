import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum - 3D Print Service',
  description: 'Impressum und rechtliche Angaben gemäß § 5 TMG',
}

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center mb-6"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Impressum</h1>
          <p className="text-gray-400">
            Angaben gemäß § 5 TMG und § 2 VIG (Veranstalterinformationsgesetz)
          </p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          {/* Anbieter */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Anbieter</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">3D Print Service GmbH</strong></p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Vertretung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Vertreten durch</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">Geschäftsführung:</strong></p>
              <p>Max Mustermann</p>
              <p>Erika Mustermann</p>
            </div>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Kontakt</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">Telefon:</strong> +49 30 12345678</p>
              <p><strong className="text-white">Telefax:</strong> +49 30 12345679</p>
              <p><strong className="text-white">E-Mail:</strong> info@3dprint-service.de</p>
              <p><strong className="text-white">Website:</strong> www.3dprint-service.de</p>
            </div>
          </section>

          {/* Registereintrag */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Registereintrag</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">Handelsregister:</strong> Amtsgericht Charlottenburg</p>
              <p><strong className="text-white">Registernummer:</strong> HRB 123456 B</p>
              <p><strong className="text-white">Umsatzsteuer-Identifikationsnummer:</strong> DE123456789</p>
            </div>
          </section>

          {/* Aufsichtsbehörde */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Zuständige Aufsichtsbehörde</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">Gewerbeamt:</strong></p>
              <p>Bezirksamt Mitte von Berlin</p>
              <p>Karl-Marx-Allee 31</p>
              <p>10178 Berlin</p>
            </div>
          </section>

          {/* EU-Streitschlichtung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">EU-Streitschlichtung</h2>
            <div className="space-y-2 text-gray-300">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 ml-2"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Haftungsausschluss */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Haftung für Inhalte</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf rechtswidrige 
                Tätigkeiten hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach 
                den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist 
                jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. 
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte 
                umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Haftung für Links</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir 
                keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine 
                Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige 
                Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden 
                zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige 
                Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p>
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne 
                konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden 
                von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Urheberrecht</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen 
                Gebrauch gestattet.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, 
                werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter 
                als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung 
                aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden 
                von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </section>
        </div>

        {/* Hinweis */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Stand: {new Date().toLocaleDateString('de-DE')}<br />
            Quelle: Eigene Erstellung
          </p>
        </div>
      </div>
    </div>
  )
}
