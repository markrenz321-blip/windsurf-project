'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, CreditCard, Package } from 'lucide-react'
import { STLAnalysis, MATERIALS, calculateRealisticPrintCosts } from '../lib/stl-parser'

interface CustomerData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  postalCode?: string
  city?: string
  country?: string
}

interface OrderFormProps {
  file: File
  analysis: STLAnalysis | null
  selectedMaterial: string
  quality: string
  infill: string
  calculatedCosts: any
}

export default function OrderForm({ file, analysis, selectedMaterial, quality, infill, calculatedCosts }: OrderFormProps) {
  // States für alle Eingabefelder
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Deutschland'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [orderId, setOrderId] = useState('')

  // Handler für Eingabefelder
  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Validierung
  const validateForm = (): boolean => {
    return (
      customerData.firstName?.trim() !== '' &&
      customerData.lastName?.trim() !== '' &&
      customerData.email?.trim() !== '' &&
      customerData.email?.includes('@') &&
      customerData.address?.trim() !== '' &&
      customerData.postalCode?.trim() !== '' &&
      customerData.city?.trim() !== ''
    )
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitMessage('Bitte füllen Sie alle Pflichtfelder aus.')
      return
    }

    if (!analysis || !calculatedCosts) {
      setSubmitMessage('Bitte laden Sie zuerst eine STL-Datei hoch.')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('Wird gesendet...')

    try {
      // Bestell-ID generieren
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const generatedOrderId = `ORDER-${timestamp}-${random}`
      setOrderId(generatedOrderId)

      const uploadForm = new FormData()
      uploadForm.append('file', file)

      const uploadRes = await fetch('/api/upload-stl', {
        method: 'POST',
        body: uploadForm
      })

      if (!uploadRes.ok) {
        let uploadErr = 'Upload fehlgeschlagen.'
        try {
          const json = await uploadRes.json()
          uploadErr = json?.details ? `${json?.error || uploadErr} ${json.details}` : (json?.error || uploadErr)
        } catch {}
        setSubmitMessage(uploadErr)
        setIsSubmitting(false)
        return
      }

      const uploadJson = await uploadRes.json()
      const stlFileUrl = uploadJson?.url
      const stlFileName = uploadJson?.filename

      // Daten an API senden
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          orderId: generatedOrderId,
          material: selectedMaterial,
          quality: quality,
          infill: infill,
          totalPrice: calculatedCosts.grossTotal,
          estimatedPrintTime: calculatedCosts.breakdown.printTime,
          weightGrams: calculatedCosts.breakdown.weight,
          printTimeMinutes: calculatedCosts.breakdown.printTime,
          stlFileUrl,
          stlFileName
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitMessage(`Deine Bestellung #${generatedOrderId} wurde erfolgreich empfangen!`)
        setIsSubmitting(false)
        
        // Optional: Weiterleitung oder weitere Aktionen
        setTimeout(() => {
          // window.location.href = `/bestellung/${generatedOrderId}`
        }, 3000)
      } else {
        setSubmitMessage(result.error || 'Fehler bei der Bestellung. Bitte versuchen Sie es später.')
        setIsSubmitting(false)
      }

    } catch (error) {
      console.error('Fehler bei Bestellung:', error)
      setSubmitMessage('Fehler bei der Bestellung. Bitte versuchen Sie es später.')
      setIsSubmitting(false)
    }
  }

  if (!analysis) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="text-center text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>Bitte laden Sie zuerst eine STL-Datei hoch, um eine Bestellung aufzugeben.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <User className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Kundendaten & Bestellung</h3>
      </div>

      {/* Zusammenfassung der Analyse */}
      {analysis && calculatedCosts && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-3">Zusammenfassung</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-300">
              <span className="text-white">Material:</span> {selectedMaterial}
            </div>
            <div className="text-gray-300">
              <span className="text-white">Qualität:</span> {quality}
            </div>
            <div className="text-gray-300">
              <span className="text-white">Füllung:</span> {infill === 'massive' ? 'Massiv (30%)' : 'Standard (15%)'}
            </div>
            <div className="text-gray-300">
              <span className="text-white">Gewicht:</span> {calculatedCosts.breakdown.weight}g
            </div>
            <div className="text-gray-300">
              <span className="text-white">Druckzeit:</span> {calculatedCosts.breakdown.printTime} Min.
            </div>
            <div className="text-gray-300">
              <span className="text-white">Gesamtpreis:</span> {calculatedCosts.customerBreakdown.total}
            </div>
          </div>
        </div>
      )}

      {/* Kundenformular */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Persönliche Daten */}
          <div>
            <h4 className="text-white font-medium mb-3">Persönliche Daten</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Vorname *</label>
                <input
                  type="text"
                  value={customerData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Max"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Nachname *</label>
                <input
                  type="text"
                  value={customerData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Mustermann"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">E-Mail *</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="max.mustermann@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Telefon</label>
                <input
                  type="tel"
                  value={customerData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+49 30 12345678"
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h4 className="text-white font-medium mb-3">Lieferadresse</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Straße *</label>
                <input
                  type="text"
                  value={customerData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Musterstraße 123"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">PLZ *</label>
                  <input
                    type="text"
                    value={customerData.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="10115"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Stadt *</label>
                  <input
                    type="text"
                    value={customerData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Berlin"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Land</label>
                <select
                  value={customerData.country || 'Deutschland'}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Deutschland">Deutschland</option>
                  <option value="Österreich">Österreich</option>
                  <option value="Schweiz">Schweiz</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-indigo-400 mr-2"></div>
                Wird gesendet...
              </span>
            ) : (
              'Bestellung aufgeben'
            )}
          </button>
        </div>

        {/* Status-Meldung */}
        {submitMessage && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            submitMessage.includes('erfolgreich') || submitMessage.includes('empfangen')
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {submitMessage}
          </div>
        )}
      </form>

      {/* CSS für Lade-Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
