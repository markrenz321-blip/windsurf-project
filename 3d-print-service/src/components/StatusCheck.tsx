'use client'

import { useState } from 'react'
import { Search, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'

// Dummy-Daten für Bestellstatus
const mockOrders = [
  {
    id: 'ORD-001',
    status: 'queue' as const,
    statusText: 'In Warteschlange',
    description: 'Ihre Bestellung wurde erhalten und wartet auf Bearbeitung',
    estimatedTime: '2-3 Stunden',
    progress: 10
  },
  {
    id: 'ORD-002',
    status: 'printing' as const,
    statusText: 'Druckt',
    description: 'Ihr 3D-Druck wird derzeit erstellt',
    estimatedTime: '1-2 Stunden',
    progress: 45
  },
  {
    id: 'ORD-003',
    status: 'quality' as const,
    statusText: 'Qualitätskontrolle',
    description: 'Ihr Druck wird auf Qualität geprüft',
    estimatedTime: '30 Minuten',
    progress: 75
  },
  {
    id: 'ORD-004',
    status: 'shipped' as const,
    statusText: 'Versendet',
    description: 'Ihre Bestellung wurde versendet',
    estimatedTime: 'Lieferung in 1-2 Tagen',
    progress: 100
  }
]

type OrderStatus = 'queue' | 'printing' | 'quality' | 'shipped' | 'not_found'

const statusConfig = {
  queue: { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
  printing: { icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
  quality: { icon: CheckCircle, color: 'text-purple-500', bgColor: 'bg-purple-500/20' },
  shipped: { icon: Truck, color: 'text-green-500', bgColor: 'bg-green-500/20' },
  not_found: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/20' }
}

export default function StatusCheck() {
  const [orderId, setOrderId] = useState('')
  const [searchResult, setSearchResult] = useState<typeof mockOrders[0] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!orderId.trim()) return

    setIsSearching(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const result = mockOrders.find(order => 
        order.id.toLowerCase() === orderId.toLowerCase()
      )
      
      setSearchResult(result || null)
      setIsSearching(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getStatusDisplay = (status: OrderStatus) => {
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <div className={`p-4 rounded-xl ${config.bgColor} border border-gray-700`}>
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 ${config.color}`} />
          <div>
            <p className={`font-semibold ${config.color}`}>
              {status === 'not_found' ? 'Nicht gefunden' : (mockOrders.find(o => o.status === status)?.statusText || '')}
            </p>
            <p className="text-gray-400 text-sm">
              {status === 'not_found' 
                ? 'Keine Bestellung mit dieser Nummer gefunden'
                : (mockOrders.find(o => o.status === status)?.description || '')
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bestellstatus Prüfen
          </h2>
          <p className="text-gray-300 text-lg">
            Geben Sie Ihre Bestellnummer ein, um den aktuellen Status zu sehen
          </p>
        </div>

        {/* Search input */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Bestellnummer eingeben (z.B. ORD-001)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !orderId.trim()}
              className="glass glass-hover px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {isSearching ? 'Suchen...' : 'Status Prüfen'}
            </button>
          </div>
        </div>

        {/* Search results */}
        {searchResult && (
          <div className="space-y-6 fade-in">
            {/* Order info */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Bestellung {searchResult.id}
                </h3>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Geschätzte Zeit</p>
                  <p className="text-white font-semibold">{searchResult.estimatedTime}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Fortschritt</span>
                  <span>{searchResult.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${searchResult.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status timeline */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Status-Verlauf</h4>
                
                {/* Current status */}
                {getStatusDisplay(searchResult.status)}

                {/* Previous statuses (completed) */}
                {searchResult.status === 'printing' && getStatusDisplay('queue')}
                {searchResult.status === 'quality' && (
                  <>
                    {getStatusDisplay('printing')}
                    {getStatusDisplay('queue')}
                  </>
                )}
                {searchResult.status === 'shipped' && (
                  <>
                    {getStatusDisplay('quality')}
                    {getStatusDisplay('printing')}
                    {getStatusDisplay('queue')}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No results */}
        {searchResult === null && orderId && !isSearching && (
          <div className="glass rounded-2xl p-8 text-center fade-in">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Bestellung nicht gefunden
            </h3>
            <p className="text-gray-400 mb-4">
              Bitte überprüfen Sie Ihre Bestellnummer und versuchen Sie es erneut.
            </p>
            <p className="text-gray-500 text-sm">
              Beispiel-Bestellnummern: ORD-001, ORD-002, ORD-003, ORD-004
            </p>
          </div>
        )}

        {/* Sample orders hint */}
        {!orderId && (
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm">
              Testen Sie mit Beispiel-Bestellnummern: ORD-001, ORD-002, ORD-003, ORD-004
            </p>
          </div>
        )}

        {/* API Integration Point Comment */}
        {/* 
          TODO: API Integration für Status-Check
          - Bestellnummer an Backend-Service senden
          - Echtzeit-Status von Datenbank abrufen
          - Fortschritt und geschätzte Lieferzeit zurückgeben
          
          Beispiel:
          const getOrderStatus = async (orderId: string) => {
            const response = await fetch(`/api/orders/${orderId}/status`)
            
            if (!response.ok) {
              throw new Error('Order not found')
            }
            
            return response.json()
          }
        */}
      </div>
    </section>
  )
}
