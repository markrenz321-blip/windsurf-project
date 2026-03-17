import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AGB - 3D Print Service',
  description: 'Allgemeine Geschäftsbedingungen für den 3D-Druck Service',
}

export default function AGB() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-gray-400">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 1 Geltungsbereich</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") der 3D Print Service GmbH 
                (nachfolgend "Anbieter") gelten für alle Verträge über die Lieferung von 3D-gedruckten 
                Produkten, die ein Verbraucher oder Unternehmer (nachfolgend "Kunde") mit dem Anbieter 
                über die Website des Anbieters abschließt.
              </p>
              <p>
                (2) Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, 
                die überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit 
                zugerechnet werden können. Unternehmer ist eine natürliche oder juristische Person oder eine 
                rechtsfähige Personengesellschaft, die bei Abschluss des Rechtsgeschäfts in Ausübung ihrer 
                gewerblichen oder selbstständigen beruflichen Tätigkeit handelt.
              </p>
              <p>
                (3) Gegenüber Unternehmern gelten diese AGB auch dann, wenn diese in Bezug auf eine 
                zukünftige Geschäftsbeziehung keine gesonderte Gegenbestätigung vornehmen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 2 Vertragsgegenstand</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Gegenstand des Vertrages ist die Erstellung und Lieferung von 3D-gedruckten Produkten 
                auf Grundlage der vom Kunden zur Verfügung gestellten 3D-Modelle (STL, OBJ oder andere 
                unterstützte Formate).
              </p>
              <p>
                (2) Der Anbieter behält sich das Recht vor, die Annahme von Aufträgen abzulehnen, wenn die 
                zur Verfügung gestellten Modelle gegen geltendes Recht verstoßen, technisch nicht umsetzbar 
                sind oder gegen die guten Sitten verstoßen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 3 Vertragsschluss</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Die Präsentation der Produkte auf der Website des Anbieters stellt kein rechtlich 
                bindendes Angebot dar, sondern dient zur Einholung eines unverbindlichen Angebots.
              </p>
              <p>
                (2) Der Kunde kann über das Online-Formular auf der Website des Anbieters ein unverbindliches 
                Angebot abgeben. Dieses Angebot wird vom Kunden durch Klick auf den Button "Bestellung absenden" 
                an den Anbieter übermittelt.
              </p>
              <p>
                (3) Der Anbieter kann das Angebot des Kunden innerhalb von 5 Werktagen annehmen. Die 
                Annahme erfolgt durch schriftliche Bestätigung (E-Mail) an den Kunden. Die Bestätigung 
                enthält eine detaillierte Auftragsbestätigung mit Preis, Lieferzeit und weiteren Bedingungen.
              </p>
              <p>
                (4) Die Vertragssprache ist Deutsch. Der Vertragstext wird vom Anbieter gespeichert und dem 
                Kunden auf Anfrage zugesendet.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 4 Preise und Zahlungsbedingungen</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Die Preise richten sich nach der jeweils gültigen Preisliste des Anbieters. Alle Preise 
                verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
              </p>
              <p>
                (2) Zusätzliche Kosten für Express-Druck, besondere Materialien oder Nachbearbeitung werden 
                separat ausgewiesen.
              </p>
              <p>
                (3) Die Zahlung erfolgt vorab per Kreditkarte, PayPal, Banküberweisung oder auf Rechnung 
                (nur für Geschäftskunden mit entsprechender Bonitätsprüfung).
              </p>
              <p>
                (4) Bei Zahlung auf Rechnung ist der Rechnungsbetrag innerhalb von 14 Tagen ab Rechnungsdatum 
                zur Zahlung fällig.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 5 Lieferbedingungen</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Die Lieferzeit beträgt in der Regel 3-7 Werktage nach Auftragsbestätigung. Bei 
                Express-Aufträgen verkürzt sich die Lieferzeit auf 1-2 Werktage.
              </p>
              <p>
                (2) Die Lieferung erfolgt per DHL oder einem anderen vom Anbieter ausgewählten 
                Versanddienstleister. Die Versandkosten werden separat berechnet.
              </p>
              <p>
                (3) Abholung durch den Kunden ist nach vorheriger Terminvereinbarung möglich.
              </p>
              <p>
                (4) Verzögert sich die Lieferung aus Gründen, die der Kunde zu vertreten hat, hat der 
                Anbieter Anspruch auf Ersatz der entstandenen Mehrkosten.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 6 Eigentumsvorbehalt</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Bis zur vollständigen Bezahlung des Kaufpreises bleibt die Ware Eigentum des Anbieters.
              </p>
              <p>
                (2) Bei Zahlungsverzug des Kunden ist der Anbieter berechtigt, die Ware zurückzufordern.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 7 Gewährleistung</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Die Gewährleistungsfrist beträgt 24 Monate ab Lieferdatum.
              </p>
              <p>
                (2) Der Kunde hat die Lieferung unverzüglich nach Erhalt auf Vollständigkeit, Richtigkeit 
                und auf mögliche Transportschäden zu überprüfen und festgestellte Mängel dem Anbieter 
                unverzüglich schriftlich mitzuteilen.
              </p>
              <p>
                (3) Bei berechtigten Mängelrügen leistet der Anbieter nach seiner Wahl Nacherfüllung 
                durch Nachdruck oder Lieferung eines mangelfreien Produkts.
              </p>
              <p>
                (4) Kleinere Abweichungen in Farbe und Oberflächenstruktur sind technisch bedingt und 
                stellen keinen Mangel dar.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 8 Haftung</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Die Haftung des Anbieters für Sach- und Vermögensschäden ist auf Vorsatz und grobe 
                Fahrlässigkeit beschränkt.
              </p>
              <p>
                (2) Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit nicht Schäden an 
                Leben, Körper oder Gesundheit betroffen sind.
              </p>
              <p>
                (3) Die Haftung für Folgeschäden und entgangenen Gewinn ist ausgeschlossen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 9 Urheberrechte</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Der Kunde versichert, dass er die zur Verfügung gestellten 3D-Modelle selbst erstellt 
                hat oder über die erforderlichen Nutzungsrechte verfügt.
              </p>
              <p>
                (2) Der Kunde stellt den Anbieter von allen Ansprüchen Dritter frei, die aus der Verletzung 
                von Urheber- oder sonstigen Schutzrechten resultieren.
              </p>
              <p>
                (3) Der Anbieter behält sich das Recht vor, Aufträge abzulehnen, wenn begründete Zweifel an 
                der Rechtmäßigkeit der zur Verfügung gestellten Modelle bestehen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 10 Widerrufsrecht (Verbraucher)</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Verbraucher haben ein Widerrufsrecht nach den gesetzlichen Bestimmungen.
              </p>
              <p>
                (2) Das Widerrufsrecht erlischt vorzeitig, wenn der Vertrag vom Anbieter auf ausdrücklichen 
                Wunsch des Verbrauchers vollständig erfüllt wurde, bevor dieser sein Widerrufsrecht ausgeübt hat.
              </p>
              <p>
                (3) Das Widerrufsrecht besteht nicht bei Verträgen über die Lieferung von Waren, die nicht 
                vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch 
                den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers 
                zugeschnitten sind.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 11 Datenschutz</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Der Anbieter erhebt, verarbeitet und nutzt personenbezogene Daten des Kunden gemäß der 
                geltenden Datenschutzgrundverordnung und der Datenschutzerklärung des Anbieters.
              </p>
              <p>
                (2) Die zur Verfügung gestellten 3D-Modelle werden ausschließlich zur Auftragsabwicklung 
                verwendet und nach Abschluss des Auftrags gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten 
                bestehen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§ 12 Schlussbestimmungen</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss internationalen 
                Privatrechts.
              </p>
              <p>
                (2) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin, soweit der Kunde 
                Unternehmer ist.
              </p>
              <p>
                (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der 
                übrigen Bestimmungen unberührt.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
