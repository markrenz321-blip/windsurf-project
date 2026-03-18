'use client'

import React, { useMemo, useState } from 'react'
import { User, Mail, Phone, MapPin, CreditCard, Package } from 'lucide-react'
import { STLAnalysis, MATERIALS, calculateRealisticPrintCosts } from '../lib/stl-parser'
import { upload } from '@vercel/blob/client'

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
  orderType: 'direct' | 'photo'
  stlFile?: File
  analysis: STLAnalysis | null
  selectedMaterial: string
  quality: string
  infill: string
  calculatedCosts?: any
}

export default function OrderForm({ orderType, stlFile, analysis, selectedMaterial, quality, infill, calculatedCosts }: OrderFormProps) {
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
  const [comment, setComment] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [needsCadHelp, setNeedsCadHelp] = useState(false)

  const photoPreviews = useMemo(() => {
    return photoFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
  }, [photoFiles])

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

  const addPhotoFiles = (newFiles: File[]) => {
    const existingCount = photoFiles.length
    const remainingSlots = Math.max(0, 5 - existingCount)
    if (remainingSlots === 0) {
      setSubmitMessage('Maximal 5 Fotos möglich.')
      return
    }

    const filtered = newFiles
      .filter((f) => f.type?.startsWith('image/'))
      .filter((f) => f.size <= 5 * 1024 * 1024)
      .slice(0, remainingSlots)

    const rejectedTooLarge = newFiles.some((f) => f.type?.startsWith('image/') && f.size > 5 * 1024 * 1024)
    if (rejectedTooLarge) {
      setSubmitMessage('Ein oder mehrere Bilder sind größer als 5MB und wurden nicht hinzugefügt.')
    }

    if (filtered.length === 0) return
    setPhotoFiles((prev) => [...prev, ...filtered])
  }

  const removePhotoAt = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitMessage('Bitte füllen Sie alle Pflichtfelder aus.')
      return
    }

    if (orderType === 'direct') {
      if (!analysis || !calculatedCosts || !stlFile) {
        setSubmitMessage('Bitte laden Sie eine STL/OBJ-Datei hoch, um die Sofort-Kalkulation zu nutzen.')
        return
      }
    }

    if (orderType === 'photo') {
      if (photoFiles.length === 0 && comment.trim() === '') {
        setSubmitMessage('Bitte fügen Sie mindestens ein Foto hinzu oder beschreiben Sie Ihre Anfrage im Kommentar.')
        return
      }
    }

    setIsSubmitting(true)
    setSubmitMessage('Wird gesendet...')

    try {
      // Bestell-ID generieren
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const generatedOrderId = `ORDER-${timestamp}-${random}`
      setOrderId(generatedOrderId)

      let stlFileUrl: string | undefined
      let stlFileName: string | undefined

      if (orderType === 'direct' && stlFile) {
        const safeName = (stlFile.name || 'model.stl').replace(/[^a-zA-Z0-9._-]/g, '_')
        const pathname = `stl/${Date.now()}_${safeName}`
        const newBlob = await upload(pathname, stlFile, {
          access: 'public',
          handleUploadUrl: '/api/upload-stl',
        })
        stlFileUrl = newBlob?.url
        stlFileName = stlFile.name
      }

      let projectPhotos:
        | Array<{ url: string; filename?: string }>
        | undefined

      if (orderType === 'photo' && photoFiles.length > 0) {
        const uploaded = await Promise.all(
          photoFiles.map(async (file) => {
            const safePhotoName = (file.name || 'foto').replace(/[^a-zA-Z0-9._-]/g, '_')
            const photoPath = `project-photos/${Date.now()}_${safePhotoName}`
            const photoBlob = await upload(photoPath, file, {
              access: 'public',
              handleUploadUrl: '/api/upload-stl',
            })

            return {
              url: String(photoBlob?.url),
              filename: file.name ? String(file.name) : 'foto',
            }
          })
        )
        projectPhotos = uploaded.filter((p) => Boolean(p.url))
      }

      // Daten an API senden
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          orderId: generatedOrderId,
          orderType,
          material: selectedMaterial,
          quality: quality,
          infill: infill,
          totalPrice: orderType === 'direct' ? (calculatedCosts?.grossTotal ?? 0) : 0,
          estimatedPrintTime: orderType === 'direct' ? (calculatedCosts?.breakdown?.printTime ?? 0) : 0,
          weightGrams: orderType === 'direct' ? (calculatedCosts?.breakdown?.weight ?? 0) : 0,
          printTimeMinutes: orderType === 'direct' ? (calculatedCosts?.breakdown?.printTime ?? 0) : 0,
          stlFileUrl,
          stlFileName,
          projectPhotos,
          customerNote: comment,
          needsCadHelp
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

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <User className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Kundendaten & Bestellung</h3>
      </div>

      {/* Zusammenfassung */}
      {orderType === 'direct' && (analysis && calculatedCosts) && (
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

      {orderType === 'photo' && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-3">Zusammenfassung</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-300">
              <span className="text-white">Gesamtpreis:</span> Preis nach Prüfung
            </div>
            <div className="text-gray-300">
              <span className="text-white">Status:</span> Angebot folgt
            </div>
          </div>
        </div>
      )}

      {orderType === 'photo' && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-3">Anfrage mit Foto</h4>
          <div className="space-y-3">
            <div
              className="w-full px-3 py-6 bg-gray-700 border border-dashed border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              onDragOver={(e) => {
                e.preventDefault()
              }}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files)
                addPhotoFiles(files)
              }}
            >
              <div className="text-center text-sm text-gray-200">
                Fotos hier ablegen (max 5, je 5MB) oder
              </div>
              <div className="mt-3 flex justify-center">
                <label className="cursor-pointer">
                  <span className="glass glass-hover px-4 py-2 rounded-full text-white font-medium transition-all duration-300 inline-block">
                    Fotos auswählen
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => addPhotoFiles(Array.from(e.target.files || []))}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {photoPreviews.map((p, idx) => (
                  <div key={`${p.file.name}-${idx}`} className="relative">
                    <img
                      src={p.url}
                      alt={p.file.name}
                      className="w-full h-16 object-cover rounded-md border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removePhotoAt(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900/80 text-white text-xs border border-gray-600"
                      aria-label="Foto entfernen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Beschreibung / Maße / Wünsche</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="z.B. Maße: 120x80x30mm, bitte in schwarz, Oberfläche matt ..."
              />
            </div>

            <label className="flex items-center space-x-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={needsCadHelp}
                onChange={(e) => setNeedsCadHelp(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Ich benötige CAD-Konstruktionshilfe (Reverse Engineering)</span>
            </label>
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
