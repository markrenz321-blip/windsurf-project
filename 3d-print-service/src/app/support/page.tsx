'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle, Clock, CheckCircle, HelpCircle, Package, CreditCard, Truck, FileText } from 'lucide-react'

// FAQ Daten
const faqCategories = [
  {
    id: 'general',
    title: 'Allgemeine Fragen',
    icon: HelpCircle,
    questions: [
      {
        question: 'Welche Dateiformate werden unterstützt?',
        answer: 'Wir unterstützen STL und OBJ Dateien. STL ist das am weitesten verbreitete Format für 3D-Druck. OBJ-Dateien werden ebenfalls akzeptiert, können aber längere Verarbeitungszeiten benötigen.'
      },
      {
        question: 'Wie lange dauert der Druck?',
        answer: 'Die Druckzeit hängt von der Größe und Komplexität des Modells ab. Kleine Teile (unter 5cm) benötigen typischerweise 2-4 Stunden, größere Teile können 12-24 Stunden oder mehr benötigen.'
      },
      {
        question: 'Welche Materialien stehen zur Verfügung?',
        answer: 'Wir bieten PLA, PETG, ABS und TPU an. PLA ist ideal für Prototypen, PETG für funktionale Teile, ABS für hitzebeständige Anwendungen und TPU für flexible Teile.'
      },
      {
        question: 'Was ist die maximale Druckgröße?',
        answer: 'Unsere Standard-Drucker haben eine maximale Bauvolumen von 220 x 220 x 250 mm. Für größere Projekte bieten wir auch industrielle 3D-Druckdienste an.'
      }
    ]
  },
  {
    id: 'pricing',
    title: 'Preise & Bezahlung',
    icon: CreditCard,
    questions: [
      {
        question: 'Wie werden die Preise berechnet?',
        answer: 'Unsere Preise basieren auf Materialverbrauch, Druckzeit und Post-Processing. Sie erhalten vor der Bestellung eine detaillierte Kostenaufschlüsselung.'
      },
      {
        question: 'Welche Zahlungsmethoden werden akzeptiert?',
        answer: 'Wir akzeptieren Kreditkarte, PayPal, Banküberweisung und Rechnung für Geschäftskunden.'
      },
      {
        question: 'Gibt es Mengenrabatte?',
        answer: 'Ja! Für Bestellungen ab 10 Teile bieten wir bis zu 20% Rabatt. Für größere Projekte kontaktieren Sie uns bitte direkt für ein individuelles Angebot.'
      },
      {
        question: 'Was ist bei nicht zufriedenstellenden Ergebnissen?',
        answer: 'Wir bieten eine 100%ige Zufriedenheitsgarantie. Wenn Sie mit dem Ergebnis nicht zufrieden sind, drucken wir es erneut oder erstatten den vollen Preis.'
      }
    ]
  },
  {
    id: 'shipping',
    title: 'Versand & Lieferung',
    icon: Truck,
    questions: [
      {
        question: 'Wie lange dauert der Versand?',
        answer: 'Standardversand innerhalb Deutschlands dauert 2-3 Werktage nach Abschluss des Drucks. Expressversand (1 Werktag) ist gegen Aufpreis verfügbar.'
      },
      {
        question: 'Kann ich meine Bestellung abholen?',
        answer: 'Ja, Sie können Ihre Bestellung in unserem Werkstatt in Berlin abholen. Bitte vereinbaren Sie vorher einen Termin.'
      },
      {
        question: 'Wird international versandt?',
        answer: 'Wir versenden in die gesamte EU. Internationaler Versand dauert 5-10 Werktage und wird nach Gewicht und Zielgebiet berechnet.'
      },
      {
        question: 'Wie werden die Teile verpackt?',
        answer: 'Alle Teile werden sorgfältig in recycelbarem Material verpackt, um Beschädigungen während des Transports zu vermeiden.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technische Unterstützung',
    icon: Package,
    questions: [
      {
        question: 'Wie bereite ich meine 3D-Datei vor?',
        answer: 'Stellen Sie sicher, dass Ihre Datei wasserdicht (watertight) ist, eine angemessene Wandstärke hat (mindestens 0.8mm) und keine überhängenden Teile über 45° hat, es sei denn, Sie benötigen Stützstrukturen.'
      },
      {
        question: 'Was ist die empfohlene Auflösung?',
        answer: 'Für STL-Dateien empfehlen wir eine Auflösung von 0.1-0.2mm für optimale Ergebnisse. Höhere Auflösungen erhöhen die Dateigröße ohne merkliche Qualitätsverbesserung.'
      },
      {
        question: 'Können Sie meine Datei korrigieren?',
        answer: 'Ja, wir bieten einen Reparaturservice für fehlerhafte 3D-Dateien an. Die Kosten richten sich nach dem Aufwand der erforderlichen Korrekturen.'
      },
      {
        question: 'Was sind Stützstrukturen?',
        answer: 'Stützstrukturen sind temporäre Strukturen, die überhängende Teile während des Drucks stützen. Sie werden nach dem Druck entfernt und können kleine Spuren auf der Oberfläche hinterlassen.'
      }
    ]
  }
]

export default function Support() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('general')
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    setExpandedQuestion(null)
  }

  const toggleQuestion = (questionIndex: number) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        orderNumber: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center mb-6"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Kundenservice</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Wir sind hier, um Ihnen zu helfen. Finden Sie Antworten auf häufig gestellte Fragen oder kontaktieren Sie uns direkt.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Telefon</h3>
            <p className="text-gray-300 mb-2">Mo-Fr: 9:00-18:00</p>
            <a href="tel:+493012345678" className="text-indigo-400 hover:text-indigo-300">
              +49 30 12345678
            </a>
          </div>

          <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">E-Mail</h3>
            <p className="text-gray-300 mb-2">Antwort innerhalb 24h</p>
            <a href="mailto:support@3dprint-service.de" className="text-indigo-400 hover:text-indigo-300">
              support@3dprint-service.de
            </a>
          </div>

          <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-gray-300 mb-2">Mo-Fr: 9:00-17:00</p>
            <button className="text-indigo-400 hover:text-indigo-300">
              Chat starten
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Häufig gestellte Fragen</h2>
            
            <div className="space-y-4">
              {faqCategories.map((category) => {
                const Icon = category.icon
                const isExpanded = expandedCategory === category.id
                
                return (
                  <div key={category.id} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-indigo-400" />
                        <span className="text-white font-semibold">{category.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-4 space-y-3">
                        {category.questions.map((item, index) => (
                          <div key={index} className="border-l-2 border-gray-700 pl-4">
                            <button
                              onClick={() => toggleQuestion(index)}
                              className="w-full text-left"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-gray-300 font-medium">{item.question}</p>
                                {expandedQuestion === index ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                            {expandedQuestion === index && (
                              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                                {item.answer}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Kontaktformular</h2>
            
            <div className="glass rounded-2xl p-8">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nachricht gesendet!</h3>
                  <p className="text-gray-300">
                    Wir haben Ihre Nachricht erhalten und melden uns so schnell wie möglich bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Ihr Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">E-Mail *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="ihre@email.de"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Bestellnummer (optional)</label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="z.B. ORD-001"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Betreff *</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="general">Allgemeine Anfrage</option>
                      <option value="order">Bestellfrage</option>
                      <option value="technical">Technische Unterstützung</option>
                      <option value="pricing">Preisanfrage</option>
                      <option value="complaint">Beschwerde</option>
                      <option value="other">Sonstiges</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Nachricht *</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Beschreiben Sie Ihre Anfrage so detailliert wie möglich..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full glass glass-hover px-6 py-4 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                  </button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-8 glass rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Antwortzeiten</h3>
                  <div className="space-y-1 text-gray-300 text-sm">
                    <p>• E-Mail: Innerhalb von 24 Stunden</p>
                    <p>• Telefon: Mo-Fr 9:00-18:00</p>
                    <p>• Live Chat: Mo-Fr 9:00-17:00</p>
                    <p>• Dringende Fälle: Rufen Sie uns direkt an</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Integration Point Comment */}
        {/* 
          TODO: API Integration für Kundenservice
          - Kontaktformular an CRM-System senden
          - FAQ-Content aus CMS laden
          - Live-Chat mit externem Service integrieren
          - Ticket-System für Support-Anfragen
          
          Beispiel:
          const submitSupportRequest = async (data: SupportRequest) => {
            const response = await fetch('/api/support', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            
            return response.json()
          }
        */}
      </div>
    </div>
  )
}
