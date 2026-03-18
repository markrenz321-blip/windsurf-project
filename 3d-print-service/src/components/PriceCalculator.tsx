'use client'

import React, { useState } from 'react'
import { Calculator, DollarSign, Clock, Zap, Package, Settings } from 'lucide-react'
import { STLAnalysis, MATERIALS, calculateRealisticPrintCosts } from '../lib/stl-parser'

interface PriceCalculatorProps {
  analysis: STLAnalysis | null
  onCostUpdate?: (costs: any) => void
}

export default function PriceCalculator({ analysis, onCostUpdate }: PriceCalculatorProps) {
  const [selectedMaterial, setSelectedMaterial] = useState('PLA')
  const [quality, setQuality] = useState<'draft' | 'standard' | 'high'>('standard')
  const [infill, setInfill] = useState<'standard' | 'massive'>('standard')
  const [costs, setCosts] = useState<any>(null)

  // Berechne Kosten wenn sich Material oder Qualität ändert
  React.useEffect(() => {
    if (analysis) {
      const calculatedCosts = calculateRealisticPrintCosts(analysis, selectedMaterial, quality, infill)
      setCosts(calculatedCosts)
      onCostUpdate?.(calculatedCosts)
    }
  }, [analysis, selectedMaterial, quality, infill])

  if (!analysis || !costs) {
    return null
  }

  const material = MATERIALS[selectedMaterial as keyof typeof MATERIALS]

  const allowedMaterials = ['PLA', 'TPU', 'PETG'] as const

  const materialBenefits: Record<(typeof allowedMaterials)[number], { headline: string; bullets: string[] }> = {
    PLA: {
      headline: 'Perfekt für Prototypen & saubere Optik',
      bullets: [
        'Sehr präzise Details und glatte Oberflächen',
        'Ideal für Gehäuse, Deko, Prototypen und Passformen',
        'Schnell startklar und kosteneffizient',
      ],
    },
    TPU: {
      headline: 'Flexibel, stoßdämpfend, langlebig',
      bullets: [
        'Ideal für Clips, Dichtungen, Griffe und Schutzelemente',
        'Hohe Abriebfestigkeit und gute Rückstellkraft',
        'Angenehme Haptik – perfekt für funktionale Teile',
      ],
    },
    PETG: {
      headline: 'Robust & alltagstauglich',
      bullets: [
        'Gute Stabilität bei gleichzeitig sauberer Optik',
        'Widerstandsfähiger gegen Alltagseinflüsse als Standard-PLA',
        'Top Wahl für Halterungen, Adapter und Funktionsteile',
      ],
    },
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <Calculator className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Preisberechnung</h3>
      </div>

      {/* Materialauswahl */}
      <div>
        <label className="block text-gray-300 mb-3 text-sm font-medium">Material</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allowedMaterials.map((key) => {
            const mat = MATERIALS[key]
            return (
            <button
              key={key}
              onClick={() => setSelectedMaterial(key)}
              className={`p-3 rounded-lg border transition-all ${
                selectedMaterial === key
                  ? 'border-indigo-500 bg-indigo-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: mat.color }}
                ></div>
                <span className="text-white text-sm font-medium">{mat.name}</span>
                <span className="text-gray-400 text-xs">€{mat.pricePerKg}/kg</span>
              </div>
            </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-gray-800/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-white font-semibold">{selectedMaterial}</div>
              <div className="text-gray-300 text-sm mt-1">
                {materialBenefits[selectedMaterial as (typeof allowedMaterials)[number]].headline}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-300">
              <span className="px-2 py-1 rounded-full border border-white/10 bg-black/20">Stabil</span>
              <span className="px-2 py-1 rounded-full border border-white/10 bg-black/20">Sauber</span>
              <span className="px-2 py-1 rounded-full border border-white/10 bg-black/20">Präzise</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {materialBenefits[selectedMaterial as (typeof allowedMaterials)[number]].bullets.map((b) => (
              <div key={b} className="text-sm text-gray-200/90 border border-white/10 bg-black/20 rounded-lg px-3 py-2">
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualitätsoptionen */}
      <div>
        <label className="block text-gray-300 mb-3 text-sm font-medium">Qualität</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'draft', label: 'Schnell', desc: '0.3mm Schicht, 70% Füllung' },
            { value: 'standard', label: 'Standard', desc: '0.2mm Schicht, 100% Füllung' },
            { value: 'high', label: 'Hoch', desc: '0.12mm Schicht, 120% Füllung' }
          ].map((q) => (
            <button
              key={q.value}
              onClick={() => setQuality(q.value as any)}
              className={`p-3 rounded-lg text-left transition-colors ${
                quality === q.value 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-white text-sm font-medium">{q.label}</div>
              <div className="text-gray-400 text-xs">{q.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Infill-Option */}
      <div>
        <label className="block text-gray-300 mb-3 text-sm font-medium">Füllung</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'standard', label: 'Standard (15%)', desc: 'Normale Füllung für schnelle Prints' },
            { value: 'massive', label: 'Massiv (30%)', desc: 'Doppelte Druckzeit' }
          ].map((i) => (
            <button
              key={i.value}
              onClick={() => setInfill(i.value as any)}
              className={`p-3 rounded-lg text-left transition-colors ${
                infill === i.value 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-white text-sm font-medium">{i.label}</div>
              <div className="text-gray-400 text-xs">{i.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Zusammenfassung */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Preisübersicht</h4>
        
        {/* Kundenfreundliche Aufschlüsselung */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Material</span>
            </div>
            <span className="text-white font-semibold">{costs.customerBreakdown.material}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">Strom</span>
            </div>
            <span className="text-white font-semibold">{costs.customerBreakdown.electricity}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">Maschinenverschleiß</span>
            </div>
            <span className="text-white font-semibold">{costs.customerBreakdown.machineWear}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Service & Handling</span>
            </div>
            <span className="text-white font-semibold">{costs.customerBreakdown.service}</span>
          </div>
          
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Gesamtpreis</span>
              <span className="text-indigo-400 font-bold text-xl">{costs.customerBreakdown.total}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">inkl. 19% MwSt. zzgl. Versand</p>
          </div>
        </div>

        {/* Zusatzinfo */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Material: {costs.breakdown.weight}g {selectedMaterial}</p>
          <p>• Druckzeit: ca. {costs.breakdown.printTime} Minuten</p>
          <p>• Preis pro Gramm: {costs.breakdown.materialPricePerGram}€</p>
          <p>• Lieferzeit: ca. {Math.ceil(costs.breakdown.printTime / 60)} Werktage</p>
        </div>
      </div>
    </div>
  )
}
