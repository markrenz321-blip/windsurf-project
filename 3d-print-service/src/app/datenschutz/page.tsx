import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutz - 3D Print Service',
  description: 'Datenschutzerklärung gemäß DSGVO und BDSG',
}

export default function Datenschutz() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Datenschutzerklärung</h1>
          <p className="text-gray-400">
            Gemäß Art. 13 DSGVO informieren wir Sie über die Verarbeitung Ihrer personenbezogenen Daten.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          {/* Verantwortliche Stelle */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Verantwortliche Stelle</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">3D Print Service GmbH</strong></p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
              <p>Deutschland</p>
              <p>E-Mail: info@3dprint-service.de</p>
              <p>Telefon: +49 30 12345678</p>
            </div>
          </section>

          {/* Übersicht der Verarbeitungen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Übersicht der Verarbeitungen</h2>
            <p className="text-gray-300 mb-4">
              Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung 
              zusammen und verweist auf die betroffenen Personen.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Arten der verarbeiteten Daten</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Bestandsdaten</li>
                  <li>• Kontaktdaten</li>
                  <li>• Inhaltsdaten</li>
                  <li>• Vertragsdaten</li>
                  <li>• Nutzungsdaten</li>
                  <li>• Meta-, Kommunikations- und Verfahrensdaten</li>
                </ul>
              </div>
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Kategorien betroffener Personen</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Kunden</li>
                  <li>• Interessenten</li>
                  <li>• Kommunikationspartner</li>
                  <li>• Nutzer</li>
                  <li>• Geschäfts- und Vertragspartner</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Zwecke der Verarbeitung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Zwecke der Verarbeitung</h2>
            <div className="glass rounded-xl p-4">
              <ul className="space-y-2 text-gray-300">
                <li>• Erbringung vertraglicher Leistungen und Kundenservice</li>
                <li>• Kontaktanfragen und Kommunikation</li>
                <li>• Sicherheitsmaßnahmen</li>
                <li>• Reichweitenmessung und Webanalyse</li>
                <li>• Büro- und Organisationsverfahren</li>
                <li>• Feedback und Verbesserung unserer Dienste</li>
              </ul>
            </div>
          </section>

          {/* Rechtsgrundlagen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Rechtsgrundlagen der Verarbeitung</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Wir verarbeiten personenbezogene Daten auf Grundlage folgender Rechtsgrundlagen:
              </p>
              <div className="glass rounded-xl p-4 space-y-2">
                <p><strong className="text-white">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong></p>
                <p className="text-sm">Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen bestimmten Zweck gegeben.</p>
                
                <p><strong className="text-white">Art. 6 Abs. 1 lit. b DSGVO (Vertrag):</strong></p>
                <p className="text-sm">Die Verarbeitung ist zur Erfüllung eines Vertrags erforderlich, dessen Vertragspartei die betroffene Person ist.</p>
                
                <p><strong className="text-white">Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):</strong></p>
                <p className="text-sm">Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der wir unterliegen.</p>
                
                <p><strong className="text-white">Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</strong></p>
                <p className="text-sm">Die Verarbeitung ist zur Wahrung unserer berechtigten Interessen erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person überwiegen.</p>
              </div>
            </div>
          </section>

          {/* Cookies und Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies und Tracking-Technologien</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Unsere Website verwendet Cookies und ähnliche Tracking-Technologien. Cookies sind kleine Textdateien, 
                die auf Ihrem Gerät gespeichert werden und bestimmte Informationen über Ihre Nutzung unserer Website enthalten.
              </p>
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Arten von Cookies</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong className="text-white">Notwendige Cookies:</strong> Diese Cookies sind für die Funktionsweise der Website unerlässlich.</li>
                  <li><strong className="text-white">Funktionale Cookies:</strong> Diese Cookies ermöglichen verbesserte Funktionalität und Personalisierung.</li>
                  <li><strong className="text-white">Analyse-Cookies:</strong> Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen.</li>
                </ul>
              </div>
              <p>
                Sie können Cookies in Ihren Browsereinstellungen deaktivieren oder verwalten. Bitte beachten Sie, 
                dass dies die Funktionalität unserer Website beeinträchtigen kann.
              </p>
            </div>
          </section>

          {/* Datenübermittlung in Drittstaaten */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Datenübermittlung in Drittstaaten</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Wir übermitteln oder verarbeiten Daten nur innerhalb der EU/EWR. Eine Übermittlung in Drittstaaten 
                (Länder außerhalb der EU/EWR) findet nur statt, wenn dies nach Art. 49 DSGVO zulässig ist.
              </p>
              <p>
                Beispiele für zulässige Übermittlungen sind:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Die Übermittlung erfolgt auf Grundlage eines Angemessenheitsbeschlusses</li>
                <li>Es wurden geeignete Garantien (z.B. Standardvertragsklauseln) vereinbart</li>
                <li>Es liegt eine Einwilligung der betroffenen Person vor</li>
              </ul>
            </div>
          </section>

          {/* Speicherdauer */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Speicherdauer</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Die Speicherdauer personenbezogener Daten richtet sich nach der jeweiligen Rechtsgrundlage 
                und dem Zweck der Verarbeitung. Grundsätzlich speichern wir Daten nur so lange, wie es für 
                den Zweck erforderlich ist.
              </p>
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Beispiele für Speicherdauern</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong className="text-white">Vertragsdaten:</strong> 10 Jahre (gesetzliche Aufbewahrungsfristen)</li>
                  <li><strong className="text-white">Kontaktanfragen:</strong> 3 Jahre nach Abschluss der Anfrage</li>
                  <li><strong className="text-white">Website-Nutzungsdaten:</strong> 30 Tage (Logfiles)</li>
                  <li><strong className="text-white">Newsletter-Daten:</strong> Bis zum Widerruf der Einwilligung</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Betroffenenrechte */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Ihre Rechte als betroffene Person</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Ihnen stehen gemäß DSGVO folgende Rechte zu:
              </p>
              <div className="glass rounded-xl p-4 space-y-3">
                <div>
                  <h4 className="text-lg font-semibold text-white">Auskunftsrecht (Art. 15 DSGVO)</h4>
                  <p className="text-sm">Sie können Auskunft über die von uns verarbeiteten personenbezogenen Daten verlangen.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Recht auf Berichtigung (Art. 16 DSGVO)</h4>
                  <p className="text-sm">Sie können die Berichtigung unrichtiger personenbezogener Daten verlangen.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Recht auf Löschung (Art. 17 DSGVO)</h4>
                  <p className="text-sm">Sie können die Löschung Ihrer personenbezogenen Daten verlangen.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</h4>
                  <p className="text-sm">Sie können die Einschränkung der Verarbeitung verlangen.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h4>
                  <p className="text-sm">Sie haben das Recht, Ihre Daten in einem strukturierten Format zu erhalten.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Widerspruchsrecht (Art. 21 DSGVO)</h4>
                  <p className="text-sm">Sie können der Verarbeitung Ihrer Daten widersprechen.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Beschwerderecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Beschwerderecht bei Aufsichtsbehörde</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
                personenbezogenen Daten durch uns zu beschweren.
              </p>
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Zuständige Aufsichtsbehörde</h3>
                <p className="text-sm">
                  Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />
                  Friedrichstraße 219<br />
                  10969 Berlin<br />
                  Telefon: +49 30 13889 0<br />
                  E-Mail: mailbox@datenschutz-berlin.de
                </p>
              </div>
            </div>
          </section>

          {/* Aktualisierung der Datenschutzerklärung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Aktualisierung dieser Datenschutzerklärung</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung gelegentlich anzupassen, um sie an 
                rechtliche Änderungen oder Änderungen unserer Dienstleistungen anzupassen. Die jeweils 
                aktuelle Version finden Sie auf unserer Website.
              </p>
            </div>
          </section>
        </div>

        {/* Hinweis */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Stand: {new Date().toLocaleDateString('de-DE')}<br />
            Diese Datenschutzerklärung wurde mit dem Datenschutz-Generator erstellt.
          </p>
        </div>
      </div>
    </div>
  )
}
