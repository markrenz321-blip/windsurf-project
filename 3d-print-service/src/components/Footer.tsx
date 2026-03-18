import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Printer } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Printer className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">3D Print Service</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Professioneller 3D-Druck Service für Ihre Ideen. 
              Von der Konzeption bis zum fertigen Produkt.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dienstleistungen</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/3d-druckservice" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  3D-Druck Service
                </Link>
              </li>
              <li>
                <Link href="/materialien" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Materialien
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Preisrechner
                </Link>
              </li>
              <li>
                <Link href="#design" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  3D-Design Service
                </Link>
              </li>
              <li>
                <Link href="/grossauftraege" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Großaufträge
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Kundenservice
                </Link>
              </li>
              <li>
                <Link href="/support#faq" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support#contact" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="#status" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Bestellstatus
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Technische Hilfe
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Rechtliches & Kontakt</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Link href="/impressum" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Widerrufsbelehrung
                </Link>
              </li>
            </ul>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+49 30 12345678</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>info@3dprint-service.de</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Berlin, Deutschland</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} 3D Print Service GmbH. Alle Rechte vorbehalten.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/cookies" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Cookie-Einstellungen
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Sitemap
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Zahlmethoden:</span>
                <div className="flex space-x-1">
                  <span className="text-gray-300">💳</span>
                  <span className="text-gray-300">📱</span>
                  <span className="text-gray-300">🏦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
