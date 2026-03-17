'use client'

import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Scan, Box as BoxIcon, Ruler, Move3D, Maximize2, RotateCw } from 'lucide-react'
import { STLLoader, STLMesh } from '../lib/stl-loader'

interface Scanner3DProps {
  file: File
  onAnalysisComplete?: (analysis: STLMesh) => void
}

// 3D Modell Komponente
function Model({ url, stlMesh }: { url: string; stlMesh: STLMesh | null }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  useFrame((state, delta) => {
    if (meshRef.current && autoRotate && !hovered) {
      meshRef.current.rotation.y += delta * 0.3
      meshRef.current.rotation.x += delta * 0.1 // Leichte X-Rotation für 3D-Effekt
    }
  })

  const handlePointerOver = () => {
    setHovered(true)
    setAutoRotate(false)
  }

  const handlePointerOut = () => {
    setHovered(false)
    setAutoRotate(true)
  }

  if (!stlMesh) return null

  return (
    <mesh
      ref={meshRef}
      geometry={stlMesh.geometry}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.05 : 1}
    >
      <meshPhysicalMaterial 
        color={hovered ? '#6366f1' : '#4a5568'}
        metalness={0.1}
        roughness={0.3}
        clearcoat={0.1}
        clearcoatRoughness={0.2}
        reflectivity={0.5}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

// Bounding Box Visualisierung
function BoundingBox({ stlMesh }: { stlMesh: STLMesh }) {
  if (!stlMesh) return null

  const { min, max } = stlMesh.boundingBox
  const size = stlMesh.dimensions

  // Bounding Box Linien
  const edges: [number, number, number][] = [
    // Untere Kante
    [min.x, min.y, min.z], [max.x, min.y, min.z],
    [max.x, min.y, min.z], [max.x, min.y, max.z],
    [max.x, min.y, max.z], [min.x, min.y, max.z],
    [min.x, min.y, max.z], [min.x, min.y, min.z],
    // Obere Kante
    [min.x, max.y, min.z], [max.x, max.y, min.z],
    [max.x, max.y, min.z], [max.x, max.y, max.z],
    [max.x, max.y, max.z], [min.x, max.y, max.z],
    [min.x, max.y, max.z], [min.x, max.y, min.z],
    // Vertikale Kanten
    [min.x, min.y, min.z], [min.x, max.y, min.z],
    [max.x, min.y, min.z], [max.x, max.y, min.z],
    [max.x, min.y, max.z], [max.x, max.y, max.z],
    [min.x, min.y, max.z], [min.x, max.y, max.z]
  ]

  return (
    <>
      {edges.map((edge, index) => (
        <Line
          key={index}
          points={edge}
          color="#10b981"
          lineWidth={2}
          opacity={0.8}
          transparent
        />
      ))}
    </>
  )
}

// Dimensions-Anzeige
function DimensionLabels({ stlMesh }: { stlMesh: STLMesh }) {
  if (!stlMesh) return null

  const { dimensions } = stlMesh

  return (
    <>
      {/* Breite */}
      <Text3D
        position={[0, stlMesh.boundingBox.min.y - 8, 0]}
        text={`${dimensions.width.toFixed(1)}mm`}
        color="#e2e8f0"
        size={0.8}
      />
      
      {/* Höhe */}
      <Text3D
        position={[stlMesh.boundingBox.max.x + 8, 0, 0]}
        text={`${dimensions.height.toFixed(1)}mm`}
        color="#e2e8f0"
        size={0.8}
      />
      
      {/* Tiefe */}
      <Text3D
        position={[0, 0, stlMesh.boundingBox.max.z + 8]}
        text={`${dimensions.depth.toFixed(1)}mm`}
        color="#e2e8f0"
        size={0.8}
      />
    </>
  )
}

// Einfache 3D Text Komponente
function Text3D({ position, text, color, size }: { 
  position: [number, number, number]
  text: string
  color: string
  size: number
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[text.length * size * 0.6, size]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  )
}

export default function Scanner3D({ file, onAnalysisComplete }: Scanner3DProps) {
  const [stlMesh, setStlMesh] = useState<STLMesh | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDimensions, setShowDimensions] = useState(true)
  const [showBoundingBox, setShowBoundingBox] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    const loadSTL = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const mesh = await STLLoader.loadSTL(file)
        setStlMesh(mesh)
        onAnalysisComplete?.(mesh)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der STL-Datei')
      } finally {
        setLoading(false)
      }
    }

    loadSTL()
  }, [file, onAnalysisComplete])

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center justify-center space-x-4">
          <Scan className="w-8 h-8 text-indigo-400 animate-pulse" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Scanne 3D-Modell...</h3>
            <p className="text-gray-400">Analysiere Geometrie und berechne Abmessungen</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center space-x-4 text-red-400">
          <BoxIcon className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Scan fehlgeschlagen</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stlMesh) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              <Scan className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">3D-Scanner</h3>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBoundingBox(!showBoundingBox)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                showBoundingBox 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                showDimensions 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Ruler className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                autoRotate 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Visualisierung */}
        <div className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 rounded-xl overflow-hidden" style={{ height: '400px' }}>
          <Canvas 
            camera={{ position: [60, 60, 60], fov: 45 }}
            gl={{ 
              antialias: true, 
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            }}
          >
            {/* Professionelle Beleuchtung */}
            <ambientLight intensity={0.4} color="#f0f9ff" />
            <directionalLight 
              position={[100, 100, 50]} 
              intensity={0.8} 
              color="#ffffff"
              castShadow
            />
            <pointLight 
              position={[-50, 50, 50]} 
              intensity={0.6} 
              color="#60a5fa"
            />
            <pointLight 
              position={[50, -50, -50]} 
              intensity={0.4} 
              color="#f472b6"
            />
            <spotLight 
              position={[0, 100, 0]} 
              angle={0.3} 
              penumbra={0.5} 
              intensity={0.5} 
              color="#fbbf24"
            />
            
            <Suspense fallback={null}>
              <Model url="" stlMesh={stlMesh} />
              {showBoundingBox && <BoundingBox stlMesh={stlMesh} />}
              {showDimensions && <DimensionLabels stlMesh={stlMesh} />}
            </Suspense>
            
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              enableDamping={true}
              dampingFactor={0.05}
              minDistance={10}
              maxDistance={300}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              minAzimuthAngle={-Math.PI}
              maxAzimuthAngle={Math.PI}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
            />
            <Grid 
              args={[300, 30]} 
              cellSize={10} 
              cellThickness={0.5} 
              cellColor="#1e293b" 
              sectionSize={50} 
              sectionThickness={1} 
              sectionColor="#334155"
              fadeDistance={150}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
            />
          </Canvas>
        </div>
      </div>

      {/* Scan-Ergebnisse */}
      <div className="glass rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Scan-Ergebnisse</h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Abmessungen */}
          <div className="glass rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Move3D className="w-4 h-4" />
              <span className="text-sm">Abmessungen</span>
            </div>
            <div className="space-y-1 text-white">
              <p className="text-sm">B: {stlMesh.dimensions.width.toFixed(1)}mm</p>
              <p className="text-sm">H: {stlMesh.dimensions.height.toFixed(1)}mm</p>
              <p className="text-sm">T: {stlMesh.dimensions.depth.toFixed(1)}mm</p>
            </div>
          </div>

          {/* Volumen */}
          <div className="glass rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <BoxIcon className="w-4 h-4" />
              <span className="text-sm">Volumen</span>
            </div>
            <p className="text-white font-semibold">
              {(stlMesh.volume / 1000).toFixed(2)} cm³
            </p>
            <p className="text-gray-400 text-xs">
              {stlMesh.volume.toFixed(0)} mm³
            </p>
          </div>

          {/* Oberfläche */}
          <div className="glass rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm">Oberfläche</span>
            </div>
            <p className="text-white font-semibold">
              {(stlMesh.surfaceArea / 100).toFixed(1)} cm²
            </p>
            <p className="text-gray-400 text-xs">
              {stlMesh.surfaceArea.toFixed(0)} mm²
            </p>
          </div>

          {/* Dreiecke */}
          <div className="glass rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Scan className="w-4 h-4" />
              <span className="text-sm">Dreiecke</span>
            </div>
            <p className="text-white font-semibold">
              {stlMesh.geometry.attributes.position.count / 3}
            </p>
            <p className="text-gray-400 text-xs">
              Faces
            </p>
          </div>
        </div>

        {/* Zusatzinformationen */}
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h5 className="text-white font-medium mb-2">3D-Scanner Analyse</h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Zentrumpunkt:</p>
              <p className="text-white">
                X: {stlMesh.center.x.toFixed(1)}, 
                Y: {stlMesh.center.y.toFixed(1)}, 
                Z: {stlMesh.center.z.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Materialschätzung (PLA):</p>
              <p className="text-white">
                {(stlMesh.volume / 1000 * 1.24).toFixed(1)}g
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
