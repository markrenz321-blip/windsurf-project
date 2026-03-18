'use client'

import { useState, useCallback } from 'react'
import { Upload, File as FileIcon, X, CheckCircle, AlertCircle } from 'lucide-react'
import { STLParser, STLAnalysis } from '../lib/stl-parser'
import { STLLoader, STLMesh } from '../lib/stl-loader'
import PriceCalculator from './PriceCalculator'
import Scanner3D from './Scanner3D'
import OrderForm from './OrderForm'

interface UploadedFile {
  file: File
  id: string
  uploadProgress: number
  status: 'uploading' | 'success' | 'error'
  analysis?: STLAnalysis
  stlMesh?: STLMesh
  costs?: any
  selectedMaterial?: string
  quality?: string
  infill?: string
}

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [requestType, setRequestType] = useState<'direct' | 'photo' | 'series' | 'cad'>('direct')
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1)
  const [analysisStatus, setAnalysisStatus] = useState<Record<string, { step: string; progress: number }>>({})

  const [inquiryNote, setInquiryNote] = useState('')
  const [inquiryPhotoFiles, setInquiryPhotoFiles] = useState<File[]>([])
  const [seriesQuantity, setSeriesQuantity] = useState<string>('')
  const [seriesTimeframe, setSeriesTimeframe] = useState<string>('')
  const [seriesRequirements, setSeriesRequirements] = useState<string>('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }, [])

  const handleFiles = (files: File[]) => {
    if (requestType !== 'direct') return
    const validFiles = files.filter(file => {
      const extension = file.name.toLowerCase().split('.').pop()
      return extension === 'stl' || extension === 'obj'
    })

    validFiles.forEach(file => {
      const newFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        uploadProgress: 0,
        status: 'uploading'
      }

      setUploadedFiles(prev => [...prev, newFile])

      // Simulate upload progress
      simulateUpload(newFile.id)
      
      // Parse STL file for price calculation
      parseSTLFile(file, newFile.id)
      
      // Load STL mesh for 3D scanning
      loadSTLMesh(file, newFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, uploadProgress: 100, status: 'success' }
              : f
          )
        )
      } else {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, uploadProgress: progress }
              : f
          )
        )
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const parseSTLFile = async (file: File, fileId: string) => {
    try {
      setAnalysisStatus((prev) => ({
        ...prev,
        [fileId]: { step: 'Analysiere Geometrie...', progress: 25 },
      }))

      const stepTimer = setTimeout(() => {
        setAnalysisStatus((prev) => ({
          ...prev,
          [fileId]: { step: 'Berechne Volumen...', progress: 60 },
        }))
      }, 450)

      const analysis = await STLParser.parseSTL(file)

      clearTimeout(stepTimer)
      setAnalysisStatus((prev) => ({
        ...prev,
        [fileId]: { step: 'Analyse abgeschlossen', progress: 100 },
      }))

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, analysis }
            : f
        )
      )

      setSelectedFile((prev) => (prev && prev.id === fileId ? { ...prev, analysis } : prev))
    } catch (error) {
      console.error('Fehler beim Parsen der STL-Datei:', error)
      setAnalysisStatus((prev) => ({
        ...prev,
        [fileId]: { step: 'Analyse fehlgeschlagen', progress: 100 },
      }))
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' }
            : f
        )
      )
    }
  }

  const handleFileSelect = (file: UploadedFile) => {
    setSelectedFile({
      ...file,
      selectedMaterial: file.selectedMaterial || 'PLA',
      quality: file.quality || 'standard',
      infill: file.infill || 'standard'
    })
  }

  const resetWizardForType = (nextType: 'direct' | 'photo' | 'series' | 'cad') => {
    setRequestType(nextType)
    setWizardStep(2)

    setInquiryNote('')
    setInquiryPhotoFiles([])
    setSeriesQuantity('')
    setSeriesTimeframe('')
    setSeriesRequirements('')

    setSelectedFile(null)
    setUploadedFiles([])
    setIsDragging(false)
  }

  const addInquiryPhotos = (newFiles: File[]) => {
    const existingCount = inquiryPhotoFiles.length
    const remainingSlots = Math.max(0, 5 - existingCount)
    if (remainingSlots === 0) return

    const filtered = newFiles
      .filter((f) => f.type?.startsWith('image/'))
      .filter((f) => f.size <= 5 * 1024 * 1024)
      .slice(0, remainingSlots)

    if (filtered.length === 0) return
    setInquiryPhotoFiles((prev) => [...prev, ...filtered])
  }

  const removeInquiryPhotoAt = (index: number) => {
    setInquiryPhotoFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const seriesPrefillNote = () => {
    const lines: string[] = []
    lines.push('Anfrage: Serienfertigung / Kleinserie')
    if (seriesQuantity.trim()) lines.push(`Stückzahl: ${seriesQuantity.trim()}`)
    if (seriesTimeframe.trim()) lines.push(`Zeitrahmen: ${seriesTimeframe.trim()}`)
    if (seriesRequirements.trim()) lines.push(`Anforderungen: ${seriesRequirements.trim()}`)
    if (inquiryNote.trim()) lines.push(`Zusatzinfo: ${inquiryNote.trim()}`)
    return lines.join('\n')
  }

  const canProceedFromDetails = () => {
    if (requestType === 'direct') {
      return uploadedFiles.length > 0 && Boolean(selectedFile?.analysis)
    }

    if (requestType === 'series') {
      return seriesQuantity.trim() !== ''
    }

    return true
  }

  const loadSTLMesh = async (file: File, fileId: string) => {
    try {
      const stlMesh = await STLLoader.loadSTL(file)
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, stlMesh }
            : f
        )
      )

      setSelectedFile((prev) => (prev && prev.id === fileId ? { ...prev, stlMesh } : prev))
    } catch (error) {
      console.error('Fehler beim Laden der STL-Mesh:', error)
    }
  }

  return (
    <div>
      <div className="text-center mb-10 fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Service</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Schritt-für-Schritt zum Ergebnis: wähle die passende Anfrage und sende alles in einem sauberen Prozess.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={`px-3 py-1 rounded-full text-xs border ${wizardStep >= 1 ? 'border-cyan-300/30 text-cyan-100 bg-cyan-500/10' : 'border-white/10 text-gray-300'}`}>
          1. Auswahl
        </div>
        <div className={`px-3 py-1 rounded-full text-xs border ${wizardStep >= 2 ? 'border-cyan-300/30 text-cyan-100 bg-cyan-500/10' : 'border-white/10 text-gray-300'}`}>
          2. Details
        </div>
        <div className={`px-3 py-1 rounded-full text-xs border ${wizardStep >= 3 ? 'border-cyan-300/30 text-cyan-100 bg-cyan-500/10' : 'border-white/10 text-gray-300'}`}>
          3. Absenden
        </div>
      </div>

      {wizardStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => resetWizardForType('direct')}
            className="glass glass-hover rounded-2xl p-6 text-left border border-white/10"
          >
            <div className="text-white font-semibold text-lg">Sofort-Kalkulation</div>
            <div className="text-gray-300 text-sm mt-1">STL/OBJ hochladen, Analyse & Preis sofort.</div>
          </button>

          <button
            type="button"
            onClick={() => resetWizardForType('photo')}
            className="glass glass-hover rounded-2xl p-6 text-left border border-white/10"
          >
            <div className="text-white font-semibold text-lg">Foto-Anfrage</div>
            <div className="text-gray-300 text-sm mt-1">Bilder + Kommentar, wir prüfen manuell und melden uns.</div>
          </button>

          <button
            type="button"
            onClick={() => resetWizardForType('series')}
            className="glass glass-hover rounded-2xl p-6 text-left border border-white/10"
          >
            <div className="text-white font-semibold text-lg">Serienfertigung</div>
            <div className="text-gray-300 text-sm mt-1">Stückzahl, Zeitrahmen, Anforderungen – Angebot nach Prüfung.</div>
          </button>

          <button
            type="button"
            onClick={() => resetWizardForType('cad')}
            className="glass glass-hover rounded-2xl p-6 text-left border border-white/10"
          >
            <div className="text-white font-semibold text-lg">CAD-Service</div>
            <div className="text-gray-300 text-sm mt-1">Skizze/Foto → druckfertiges Modell inkl. Beratung.</div>
          </button>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-300">
              <span className="text-white font-semibold">Auswahl:</span>{' '}
              {requestType === 'direct'
                ? 'Sofort-Kalkulation (STL/OBJ)'
                : requestType === 'photo'
                  ? 'Foto-Anfrage'
                  : requestType === 'series'
                    ? 'Serienfertigung'
                    : 'CAD-Service'}
            </div>
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="text-sm text-cyan-200 hover:text-cyan-100 transition-colors"
            >
              ändern
            </button>
          </div>

          {requestType === 'direct' && (
            <div
              className={
                `glass rounded-2xl p-10 text-center transition-all duration-300 border border-white/10 ` +
                (isDragging ? 'border-cyan-300/40 bg-cyan-500/10' : '')
              }
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 rounded-full bg-cyan-500/10 border border-cyan-300/20">
                  <Upload className="w-12 h-12 text-cyan-200" />
                </div>
                <div>
                  <p className="text-xl text-white font-medium mb-2">
                    {isDragging ? 'Loslassen zum Hochladen' : 'STL/OBJ hier ablegen'}
                  </p>
                  <p className="text-gray-400 mb-4">oder</p>
                  <label className="cursor-pointer">
                    <span className="glass glass-hover px-6 py-3 rounded-full text-white font-medium transition-all duration-300 inline-block">
                      Datei auswählen
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".stl,.obj"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {requestType !== 'direct' && (
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="text-white font-semibold text-lg">Kurzbeschreibung</div>
              <p className="text-gray-300 text-sm mt-2">
                Je mehr Kontext du gibst, desto schneller können wir ein passendes Angebot erstellen. Optional kannst du
                auch Bilder direkt im nächsten Schritt hinzufügen.
              </p>

              {requestType === 'series' && (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Stückzahl</label>
                    <input
                      type="number"
                      min={1}
                      value={seriesQuantity}
                      onChange={(e) => setSeriesQuantity(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="z.B. 50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Zeitrahmen</label>
                    <select
                      value={seriesTimeframe}
                      onChange={(e) => setSeriesTimeframe(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="Express (1-3 Tage)">Express (1-3 Tage)</option>
                      <option value="Standard (1-2 Wochen)">Standard (1-2 Wochen)</option>
                      <option value="Planbar (2-4 Wochen)">Planbar (2-4 Wochen)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Anforderungen</label>
                    <input
                      type="text"
                      value={seriesRequirements}
                      onChange={(e) => setSeriesRequirements(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="z.B. Maßhaltigkeit / Finish"
                    />
                  </div>
                </div>
              )}

              <div className="mt-5">
                <label className="block text-gray-300 mb-1 text-sm">Hinweis / Maße / Wünsche</label>
                <textarea
                  value={inquiryNote}
                  onChange={(e) => setInquiryNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="z.B. Einsatzgebiet, Maße, gewünschtes Material, Stückzahl, Toleranzen, Deadline ..."
                />
              </div>

              <div className="mt-5">
                <label className="block text-gray-300 mb-2 text-sm">Projekt-Fotos (optional)</label>
                <div
                  className="w-full px-3 py-6 bg-gray-700 border border-dashed border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    addInquiryPhotos(Array.from(e.dataTransfer.files))
                  }}
                >
                  <div className="text-center text-sm text-gray-200">Fotos hier ablegen (max 5, je 5MB) oder</div>
                  <div className="mt-3 flex justify-center">
                    <label className="cursor-pointer">
                      <span className="glass glass-hover px-4 py-2 rounded-full text-white font-medium transition-all duration-300 inline-block">
                        Fotos auswählen
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => addInquiryPhotos(Array.from(e.target.files || []))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {inquiryPhotoFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {inquiryPhotoFiles.map((file, idx) => {
                      const url = URL.createObjectURL(file)
                      return (
                        <div key={`${file.name}-${idx}`} className="relative">
                          <img
                            src={url}
                            alt={file.name}
                            className="w-full h-16 object-cover rounded-md border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeInquiryPhotoAt(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900/80 text-white text-xs border border-gray-600"
                            aria-label="Foto entfernen"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {requestType === 'direct' && uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Hochgeladene Dateien</h3>
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="glass rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-300/20">
                        <FileIcon className="w-6 h-6 text-cyan-200" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <p className="text-white font-medium">{uploadedFile.file.name}</p>
                          {uploadedFile.analysis && (
                            <button
                              onClick={() => handleFileSelect(uploadedFile)}
                              className={`px-2 py-1 rounded text-xs transition-colors ${
                                selectedFile?.id === uploadedFile.id
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              Auswählen
                            </button>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          {uploadedFile.analysis && (
                            <span className="ml-2">
                              • {uploadedFile.analysis.weight.toFixed(1)}g • {Math.round(uploadedFile.analysis.estimatedPrintTime)}min
                            </span>
                          )}
                        </p>

                        {analysisStatus[uploadedFile.id] && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-300">
                              <span>{analysisStatus[uploadedFile.id].step}</span>
                              <span>{analysisStatus[uploadedFile.id].progress}%</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-700/70 rounded-full h-2">
                              <div
                                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${analysisStatus[uploadedFile.id].progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                      aria-label="Datei entfernen"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="px-5 py-3 rounded-full border border-white/10 text-gray-200 hover:bg-white/5 transition-colors"
            >
              Zurück
            </button>

            <button
              type="button"
              onClick={() => setWizardStep(3)}
              disabled={!canProceedFromDetails()}
              className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
          </div>

          {!canProceedFromDetails() && (
            <div className="text-center text-sm text-gray-300">
              {requestType === 'direct'
                ? 'Bitte STL/OBJ hochladen und eine Datei auswählen.'
                : requestType === 'series'
                  ? 'Bitte mindestens die Stückzahl angeben.'
                  : ''}
            </div>
          )}
        </div>
      )}

      {wizardStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-300">
              <span className="text-white font-semibold">Letzter Schritt:</span> Kundendaten & Absenden
            </div>
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="text-sm text-cyan-200 hover:text-cyan-100 transition-colors"
            >
              zurück
            </button>
          </div>

          {requestType === 'direct' && selectedFile?.analysis && (
            <div>
              <PriceCalculator
                analysis={selectedFile.analysis}
                onCostUpdate={(costs) => {
                  setSelectedFile((prev) => (prev ? { ...prev, costs } : null))
                }}
              />
            </div>
          )}

          {requestType === 'direct' && selectedFile && (
            <div>
              <Scanner3D
                file={selectedFile.file}
                onAnalysisComplete={(stlMesh) => {
                  console.log('3D Scan abgeschlossen:', stlMesh)
                }}
              />
            </div>
          )}

          <OrderForm
            key={`${requestType}-${requestType === 'series' ? seriesQuantity : ''}-${requestType === 'series' ? seriesTimeframe : ''}`}
            orderType={requestType}
            stlFile={requestType === 'direct' && selectedFile?.analysis ? selectedFile.file : undefined}
            analysis={requestType === 'direct' ? selectedFile?.analysis ?? null : null}
            selectedMaterial={selectedFile?.selectedMaterial || 'PLA'}
            quality={selectedFile?.quality || 'standard'}
            infill={selectedFile?.infill || 'standard'}
            calculatedCosts={selectedFile?.costs}
            prefillPhotoFiles={requestType === 'direct' ? undefined : inquiryPhotoFiles}
            prefillCustomerNote={
              requestType === 'series'
                ? seriesPrefillNote()
                : inquiryNote
            }
            prefillNeedsCadHelp={requestType === 'cad' ? true : undefined}
          />
        </div>
      )}
    </div>
  )
}
