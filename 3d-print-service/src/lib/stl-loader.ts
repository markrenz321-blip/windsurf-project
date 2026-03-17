import * as THREE from 'three'

export interface STLMesh {
  geometry: THREE.BufferGeometry
  boundingBox: THREE.Box3
  volume: number
  surfaceArea: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  center: THREE.Vector3
}

export class STLLoader {
  /**
   * Lädt eine STL-Datei und erstellt ein Three.js Mesh
   */
  static async loadSTL(file: File): Promise<STLMesh> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          const mesh = this.parseSTL(arrayBuffer)
          resolve(mesh)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Fehler beim Lesen der STL-Datei'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Parst STL-Daten und erstellt Three.js Geometrie
   */
  private static parseSTL(arrayBuffer: ArrayBuffer): STLMesh {
    const dataView = new DataView(arrayBuffer)
    
    // Prüfen ob ASCII oder Binary STL
    const isASCII = this.isASCIISTL(dataView)
    
    let geometry: THREE.BufferGeometry
    
    if (isASCII) {
      geometry = this.parseASCIISTL(dataView)
    } else {
      geometry = this.parseBinarySTL(dataView)
    }
    
    // Geometrie optimieren
    geometry.computeVertexNormals()
    geometry.center()
    
    // Bounding Box berechnen
    geometry.computeBoundingBox()
    const boundingBox = geometry.boundingBox!
    
    // Abmessungen berechnen
    const size = new THREE.Vector3()
    boundingBox.getSize(size)
    
    // Zentrum berechnen
    const center = new THREE.Vector3()
    boundingBox.getCenter(center)
    
    // Volumen berechnen
    const volume = this.calculateVolume(geometry)
    
    // Oberfläche berechnen
    const surfaceArea = this.calculateSurfaceArea(geometry)
    
    return {
      geometry,
      boundingBox,
      volume,
      surfaceArea,
      dimensions: {
        width: size.x,
        height: size.y,
        depth: size.z
      },
      center
    }
  }

  /**
   * Prüft ob es sich um eine ASCII STL-Datei handelt
   */
  private static isASCIISTL(dataView: DataView): boolean {
    const header = new TextDecoder().decode(dataView.buffer.slice(0, 5))
    return header.toLowerCase().startsWith('solid')
  }

  /**
   * Parst eine ASCII STL-Datei
   */
  private static parseASCIISTL(dataView: DataView): THREE.BufferGeometry {
    const text = new TextDecoder().decode(dataView.buffer)
    const lines = text.split('\n')
    
    const vertices: number[] = []
    const normals: number[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('vertex')) {
        const coords = line.split(/\s+/).slice(1).map(Number)
        vertices.push(...coords)
      }
      
      if (line.startsWith('facet normal')) {
        const coords = line.split(/\s+/).slice(2).map(Number)
        // Normale für jeden Vertex des Dreiecks hinzufügen
        normals.push(...coords, ...coords, ...coords)
      }
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    
    if (normals.length === vertices.length) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    }
    
    return geometry
  }

  /**
   * Parst eine Binary STL-Datei
   */
  private static parseBinarySTL(dataView: DataView): THREE.BufferGeometry {
    // Header (80 Bytes) überspringen
    let offset = 80
    
    // Anzahl der Dreiecke lesen
    const triangleCount = dataView.getUint32(offset, true)
    offset += 4
    
    const vertices: number[] = []
    const normals: number[] = []
    
    // Jedes Dreieck lesen (50 Bytes pro Dreieck)
    for (let i = 0; i < triangleCount; i++) {
      // Normal Vector (12 Bytes)
      const normal = [
        dataView.getFloat32(offset, true),
        dataView.getFloat32(offset + 4, true),
        dataView.getFloat32(offset + 8, true)
      ]
      offset += 12
      
      // 3 Vertices (jeweils 12 Bytes)
      for (let j = 0; j < 3; j++) {
        vertices.push(
          dataView.getFloat32(offset, true),
          dataView.getFloat32(offset + 4, true),
          dataView.getFloat32(offset + 8, true)
        )
        // Normale für jeden Vertex hinzufügen
        normals.push(...normal)
        offset += 12
      }
      
      // Attribute Byte Count (2 Bytes) - überspringen
      offset += 2
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    
    return geometry
  }

  /**
   * Berechnet das Volumen der Geometrie
   */
  private static calculateVolume(geometry: THREE.BufferGeometry): number {
    const positions = geometry.getAttribute('position')
    const vertices = []
    
    for (let i = 0; i < positions.count; i++) {
      vertices.push(new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      ))
    }
    
    let volume = 0
    
    // Volumen durch Dreiecksberechnung
    for (let i = 0; i < vertices.length; i += 3) {
      const v1 = vertices[i]
      const v2 = vertices[i + 1]
      const v3 = vertices[i + 2]
      
      // Volumen des Tetraeders (Dreieck + Ursprung) berechnen
      volume += v1.dot(v2.cross(v3)) / 6
    }
    
    return Math.abs(volume) // in mm³
  }

  /**
   * Berechnet die Oberfläche der Geometrie
   */
  private static calculateSurfaceArea(geometry: THREE.BufferGeometry): number {
    const positions = geometry.getAttribute('position')
    const vertices = []
    
    for (let i = 0; i < positions.count; i++) {
      vertices.push(new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      ))
    }
    
    let surfaceArea = 0
    
    // Oberfläche durch Dreiecksberechnung
    for (let i = 0; i < vertices.length; i += 3) {
      const v1 = vertices[i]
      const v2 = vertices[i + 1]
      const v3 = vertices[i + 2]
      
      // Fläche des Dreiecks berechnen
      const edge1 = new THREE.Vector3().subVectors(v2, v1)
      const edge2 = new THREE.Vector3().subVectors(v3, v1)
      const area = edge1.cross(edge2).length() / 2
      
      surfaceArea += area
    }
    
    return surfaceArea // in mm²
  }

  /**
   * Erstellt ein Mesh für die Visualisierung
   */
  static createVisualizationMesh(stlMesh: STLMesh, material: THREE.Material = new THREE.MeshPhongMaterial({ 
    color: 0x888888,
    shininess: 100,
    side: THREE.DoubleSide
  })): THREE.Mesh {
    return new THREE.Mesh(stlMesh.geometry, material)
  }

  /**
   * Erstellt Bounding Box Visualisierung
   */
  static createBoundingBoxVisualization(stlMesh: STLMesh): THREE.LineSegments {
    const box = new THREE.Box3Helper(stlMesh.boundingBox, 0x00ff00)
    return box
  }

  /**
   * Erstellt Grid-Hilfslinien für die Abmessungen
   */
  static createDimensionHelpers(stlMesh: STLMesh): THREE.Group {
    const helpers = new THREE.Group()
    
    // Grid für die Grundfläche
    const gridHelper = new THREE.GridHelper(
      Math.max(stlMesh.dimensions.width, stlMesh.dimensions.depth) * 2,
      10,
      0x444444,
      0x222222
    )
    gridHelper.position.y = stlMesh.boundingBox.min.y
    helpers.add(gridHelper)
    
    return helpers
  }
}
