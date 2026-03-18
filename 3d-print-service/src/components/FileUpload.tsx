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
  const [activeTab, setActiveTab] = useState<'direct' | 'photo'>('direct')

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
      const analysis = await STLParser.parseSTL(file)
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, analysis }
            : f
        )
      )
    } catch (error) {
      console.error('Fehler beim Parsen der STL-Datei:', error)
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
    } catch (error) {
      console.error('Fehler beim Laden der STL-Mesh:', error)
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-bold text-white mb-4">
            Deine Dateien Hochladen
          </h2>
          <p className="text-gray-300 text-lg">
            Unterstützte Formate: STL, OBJ
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="glass rounded-full p-1 inline-flex">
            <button
              type="button"
              onClick={() => {
                setActiveTab('direct')
                setSelectedFile(null)
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'direct'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-200 hover:bg-white/5'
              }`}
            >
              Direkt-Druck (STL/OBJ)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('photo')
                setSelectedFile({
                  file: new File([], 'photo-request', { type: 'application/octet-stream' }),
                  id: 'photo-request',
                  uploadProgress: 100,
                  status: 'success',
                  selectedMaterial: 'PLA',
                  quality: 'standard',
                  infill: 'standard',
                })
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'photo'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-200 hover:bg-white/5'
              }`}
            >
              Anfrage mit Foto (Ersatzteil/Idee)
            </button>
          </div>
        </div>

        {activeTab === 'direct' && (
          <div
            className={`
              glass rounded-2xl p-12 text-center transition-all duration-300
              ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 rounded-full bg-indigo-500/20">
                <Upload className="w-12 h-12 text-indigo-400" />
              </div>
              
              <div>
                <p className="text-xl text-white font-medium mb-2">
                  {isDragging ? 'Loslassen zum Hochladen' : 'Dateien hier ablegen'}
                </p>
                <p className="text-gray-400 mb-4">oder</p>
                <label className="cursor-pointer">
                  <span className="glass glass-hover px-6 py-3 rounded-full text-white font-medium transition-all duration-300 inline-block">
                    Dateien Auswählen
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

        {activeTab === 'photo' && (
          <div className="glass rounded-2xl p-8 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white">Anfrage mit Foto</h3>
              <p className="text-gray-300 mt-2">
                Lade bis zu 5 Bilder hoch und beschreibe kurz dein Ersatzteil oder deine Idee.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Preis nach Prüfung • Angebot folgt
              </p>
            </div>
          </div>
        )}

        {/* Uploaded files list */}
        {activeTab === 'direct' && uploadedFiles.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Hochgeladene Dateien</h3>
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 rounded-lg bg-indigo-500/20">
                      <FileIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <p className="text-white font-medium">{uploadedFile.file.name}</p>
                        {uploadedFile.analysis && (
                          <button
                            onClick={() => handleFileSelect(uploadedFile)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              selectedFile?.id === uploadedFile.id
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Preis berechnen
                          </button>
                        )}
                        {uploadedFile.stlMesh && (
                          <button
                            onClick={() => handleFileSelect(uploadedFile)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              selectedFile?.id === uploadedFile.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            3D Scan
                          </button>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        {uploadedFile.analysis && (
                          <span className="ml-2">
                            • {uploadedFile.analysis.weight.toFixed(1)}g • 
                            {Math.round(uploadedFile.analysis.estimatedPrintTime)}min
                          </span>
                        )}
                      </p>
                      
                      {/* Progress bar */}
                      {uploadedFile.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadedFile.uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            {Math.round(uploadedFile.uploadProgress)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {uploadedFile.status === 'success' && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {uploadedFile.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                    
                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3D Scanner */}
        {activeTab === 'direct' && selectedFile && selectedFile.stlMesh && (
          <div className="mt-8">
            <Scanner3D 
              file={selectedFile.file}
              onAnalysisComplete={(stlMesh) => {
                console.log('3D Scan abgeschlossen:', stlMesh)
              }}
            />
          </div>
        )}

        {/* Price Calculator */}
        {activeTab === 'direct' && selectedFile && selectedFile.analysis && (
          <div className="mt-8">
            <PriceCalculator 
              analysis={selectedFile.analysis}
              onCostUpdate={(costs) => {
                setSelectedFile(prev => prev ? { ...prev, costs } : null)
              }}
            />
          </div>
        )}

        {/* Order Form */}
        {selectedFile && (
          <div className="mt-8">
            <OrderForm
              orderType={activeTab}
              stlFile={activeTab === 'direct' && selectedFile.analysis ? selectedFile.file : undefined}
              analysis={selectedFile.analysis || null}
              selectedMaterial={selectedFile.selectedMaterial || 'PLA'}
              quality={selectedFile.quality || 'standard'}
              infill={selectedFile.infill || 'standard'}
              calculatedCosts={selectedFile.costs}
            />
          </div>
        )}
      </div>
    </section>
  )
}
