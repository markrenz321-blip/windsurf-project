// STL File Parser für Volumenberechnung
// Inspiriert von Bambu Studio und anderen 3D-Druck Slicern

export interface STLAnalysis {
  volume: number; // in cm³
  weight: number; // in Gramm
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  };
  triangleCount: number;
  estimatedPrintTime: number; // in Minuten
}

export interface Material {
  name: string;
  density: number; // g/cm³
  pricePerKg: number; // €/kg
  printSpeed: number; // mm/s
  nozzleTemp: number; // °C
  bedTemp: number; // °C
  color: string;
}

export const MATERIALS: Record<string, Material> = {
  PLA: {
    name: 'PLA',
    density: 1.24, // g/cm³
    pricePerKg: 20.00, // €/kg
    printSpeed: 50, // mm/s
    nozzleTemp: 210,
    bedTemp: 60,
    color: '#4CAF50'
  },
  PETG: {
    name: 'PETG',
    density: 1.27, // g/cm³
    pricePerKg: 20.00, // €/kg
    printSpeed: 40, // mm/s
    nozzleTemp: 240,
    bedTemp: 80,
    color: '#2196F3'
  },
  TPU: {
    name: 'TPU',
    density: 1.20, // g/cm³
    pricePerKg: 20.00, // €/kg
    printSpeed: 30, // mm/s
    nozzleTemp: 220,
    bedTemp: 60,
    color: '#9C27B0'
  }
};

export const REALISTIC_PRICING = {
  // Materialkosten: 0,020 € pro Gramm für Standard-PLA/PETG (entspricht 20 €/kg inkl. Verschnitt)
  materialCostPerGram: 0.020,
  
  // Stromkosten: 0,35 € pro kWh, moderner Drucker braucht ca. 0,12 kWh pro Stunde
  electricityCostPerKWh: 0.35,
  printerPowerConsumptionKWh: 0.12,
  
  // Maschinenverschleiß & Wartung: 0,50 € pro Druckstunde (für Nozzles, FEP-Folien, Lager)
  machineWearCostPerHour: 0.50,
  
  // Service-Pauschale: 5,00 € pro Auftrag (für Vorbereitung, Druckbett reinigen, Verpacken)
  serviceFee: 5.00,
  
  // Marge: 25% auf die Summe von (1-4), um profitabel zu sein
  marginPercentage: 0.25,
  
  // Steuern: 19% MwSt. am Ende
  vatPercentage: 0.19
};

/**
 * Erweiterte Zeitberechnung für realistische 3D-Druck-Schätzungen
 * Basierend auf Volumen, Komplexität und Infill
 */
export function calculateAdvancedPrintTime(
  volumeCm3: number, 
  weight: number,
  triangleCount: number,
  infill: 'standard' | 'massive' = 'standard'
): {
  baseTimeMinutes: number;
  complexityFactor: number;
  infillMultiplier: number;
  totalTimeMinutes: number;
} {
  // Basis-Rate: 15-20 Minuten pro 10 Gramm Material bei Standard-Einstellungen
  const baseRate = 1.75; // Minuten pro Gramm (17,5 Minuten pro 10g)
  
  // Komplexitäts-Faktor basierend auf Dreiecksanzahl
  const trianglesPerCm3 = triangleCount / volumeCm3;
  
  let complexityFactor: number;
  if (trianglesPerCm3 > 100) {
    // Viele kleine Details -> 30% mehr Zeit
    complexityFactor = 1.3;
  } else if (trianglesPerCm3 < 20) {
    // Groß und massiv -> 10% weniger Zeit
    complexityFactor = 0.9;
  } else {
    // Standard Komplexität
    complexityFactor = 1.0;
  }
  
  // Infill-Check
  const infillMultiplier = infill === 'massive' ? 2.0 : 1.0;
  
  // Basis-Druckzeit (ohne Aufwärmphase)
  const basePrintTime = weight * baseRate * complexityFactor * infillMultiplier;
  
  // Aufwärmphase: 10 Minuten für Bett und Düse
  const warmupTime = 10;
  
  // Gesamte Druckzeit
  const totalTimeMinutes = basePrintTime + warmupTime;
  
  return {
    baseTimeMinutes: Math.round(basePrintTime),
    complexityFactor,
    infillMultiplier,
    totalTimeMinutes: Math.round(totalTimeMinutes)
  };
}

export class STLParser {
  /**
   * Liest eine STL-Datei und berechnet Volumen und Gewicht
   */
  static async parseSTL(file: File): Promise<STLAnalysis> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const analysis = this.analyzeSTL(arrayBuffer);
          resolve(analysis);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Fehler beim Lesen der STL-Datei'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Analysiert die STL-Daten und berechnet Volumen
   */
  private static analyzeSTL(arrayBuffer: ArrayBuffer): STLAnalysis {
    const dataView = new DataView(arrayBuffer);
    
    // Prüfen ob ASCII oder Binary STL
    const isASCII = this.isASCIISTL(dataView);
    
    if (isASCII) {
      return this.parseASCIISTL(dataView);
    } else {
      return this.parseBinarySTL(dataView);
    }
  }

  /**
   * Prüft ob es sich um eine ASCII STL-Datei handelt
   */
  private static isASCIISTL(dataView: DataView): boolean {
    const header = new TextDecoder().decode(dataView.buffer.slice(0, 5));
    return header.toLowerCase().startsWith('solid');
  }

  /**
   * Parst eine ASCII STL-Datei
   */
  private static parseASCIISTL(dataView: DataView): STLAnalysis {
    const text = new TextDecoder().decode(dataView.buffer);
    const lines = text.split('\n');
    
    let volume = 0;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    let triangleCount = 0;
    
    const vertices: number[][] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('vertex')) {
        const coords = line.split(/\s+/).slice(1).map(Number);
        vertices.push(coords);
        
        // Bounding Box aktualisieren
        minX = Math.min(minX, coords[0]);
        minY = Math.min(minY, coords[1]);
        minZ = Math.min(minZ, coords[2]);
        maxX = Math.max(maxX, coords[0]);
        maxY = Math.max(maxY, coords[1]);
        maxZ = Math.max(maxZ, coords[2]);
      }
      
      if (line === 'endfacet') {
        triangleCount++;
        // Dreiecksvolumen berechnen (vereinfachte Methode)
        if (vertices.length >= 3) {
          const v1 = vertices[vertices.length - 3];
          const v2 = vertices[vertices.length - 2];
          const v3 = vertices[vertices.length - 1];
          volume += this.calculateTriangleVolume(v1, v2, v3);
        }
      }
    }
    
    const boundingBox = {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
      size: { 
        x: maxX - minX, 
        y: maxY - minY, 
        z: maxZ - minZ 
      }
    };
    
    // Durchschnittliches Material (PLA) für Gewichtsberechnung
    const avgDensity = MATERIALS.PLA.density;
    const weight = (volume / 1000) * avgDensity; // Volumen in cm³ umrechnen
    
    // Geschätzte Druckzeit basierend auf Volumen und Größe
    const estimatedPrintTime = STLParser.estimatePrintTime(volume, boundingBox.size);
    
    return {
      volume: Math.abs(volume), // in cm³ (umrechnen von mm³)
      weight: Math.abs(weight), // in Gramm
      boundingBox,
      triangleCount,
      estimatedPrintTime
    };
  }

  /**
   * Parst eine Binary STL-Datei
   */
  private static parseBinarySTL(dataView: DataView): STLAnalysis {
    // Header (80 Bytes) überspringen
    let offset = 80;
    
    // Anzahl der Dreiecke lesen
    const triangleCount = dataView.getUint32(offset, true);
    offset += 4;
    
    let volume = 0;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    // Jedes Dreieck lesen (50 Bytes pro Dreieck)
    for (let i = 0; i < triangleCount; i++) {
      // Normal Vector (12 Bytes) - überspringen
      offset += 12;
      
      // 3 Vertices (jeweils 12 Bytes)
      const vertices: number[][] = [];
      for (let j = 0; j < 3; j++) {
        const x = dataView.getFloat32(offset, true);
        const y = dataView.getFloat32(offset + 4, true);
        const z = dataView.getFloat32(offset + 8, true);
        
        vertices.push([x, y, z]);
        
        // Bounding Box aktualisieren
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
        
        offset += 12;
      }
      
      // Attribute Byte Count (2 Bytes) - überspringen
      offset += 2;
      
      // Dreiecksvolumen berechnen
      volume += this.calculateTriangleVolume(vertices[0], vertices[1], vertices[2]);
    }
    
    const boundingBox = {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
      size: { 
        x: maxX - minX, 
        y: maxY - minY, 
        z: maxZ - minZ 
      }
    };
    
    // Durchschnittliches Material (PLA) für Gewichtsberechnung
    const avgDensity = MATERIALS.PLA.density;
    const weight = (volume / 1000) * avgDensity; // Volumen in cm³ umrechnen
    
    // Geschätzte Druckzeit basierend auf Volumen und Größe
    const estimatedPrintTime = STLParser.estimatePrintTime(volume, boundingBox.size);
    
    return {
      volume: Math.abs(volume), // in cm³
      weight: Math.abs(weight), // in Gramm
      boundingBox,
      triangleCount,
      estimatedPrintTime
    };
  }

  /**
   * Berechnet das Volumen eines Dreiecks mit der Determante-Methode
   */
  private static calculateTriangleVolume(v1: number[], v2: number[], v3: number[]): number {
    // Volumen des Tetraeders (Dreieck + Ursprung) berechnen
    // V = |det(v1, v2, v3)| / 6
    const det = 
      v1[0] * (v2[1] * v3[2] - v2[2] * v3[1]) -
      v1[1] * (v2[0] * v3[2] - v2[2] * v3[0]) +
      v1[2] * (v2[0] * v3[1] - v2[1] * v3[0]);
    
    return Math.abs(det) / 6; // mm³
  }

  /**
   * Schätzt die Druckzeit basierend auf Volumen und Abmessungen
   */
  private static estimatePrintTime(volume: number, size: { x: number; y: number; z: number }): number {
    // Vereinfachte Berechnung basierend auf Bambu Studio Algorithmen
    const volumeCm3 = volume / 1000; // mm³ zu cm³
    
    // Basiszeit basierend auf Volumen (Minuten pro cm³)
    let baseTime = volumeCm3 * 8; // ca. 8 Minuten pro cm³
    
    // Zusatzzeit für große Objekte (Schicht-für-Schicht)
    const layerHeight = 0.2; // Standard Schichthöhe
    const layerCount = size.z / layerHeight;
    const layerTime = layerCount * 0.5; // 0.5 Minuten pro Schicht
    
    // Zusatzzeit für komplexe Geometrien (mehr Dreiecke = komplexer)
    const complexityFactor = Math.min(2, 1 + (volumeCm3 * 0.1));
    
    // Gesamte Zeit
    const totalTime = (baseTime + layerTime) * complexityFactor;
    
    return Math.max(5, totalTime); // Mindestens 5 Minuten
  }
}

/**
 * Berechnet realistische Gesamtkosten für einen 3D-Druck nach professionellem Schema
 */
export function calculateRealisticPrintCosts(
  analysis: STLAnalysis, 
  material: string = 'PLA',
  quality: 'draft' | 'standard' | 'high' = 'standard',
  infill: 'standard' | 'massive' = 'standard'
): {
  materialCost: number;
  electricityCost: number;
  machineWearCost: number;
  serviceFee: number;
  subtotal: number;
  margin: number;
  netTotal: number;
  vat: number;
  grossTotal: number;
  breakdown: {
    weight: number;
    printTime: number;
    materialPricePerGram: number;
    printTimeHours: number;
  };
  customerBreakdown: {
    material: string;
    electricity: string;
    machineWear: string;
    service: string;
    total: string;
  };
} {
  const pricing = REALISTIC_PRICING;
  const mat = MATERIALS[material];
  
  if (!mat) {
    throw new Error(`Material ${material} nicht gefunden`);
  }
  
  // Qualität faktoren
  const qualityFactors = {
    draft: { speed: 1.5, layerHeight: 1.5, infill: 0.7 },
    standard: { speed: 1.0, layerHeight: 1.0, infill: 1.0 },
    high: { speed: 0.6, layerHeight: 0.6, infill: 1.2 }
  };
  
  const qFactor = qualityFactors[quality];
  
  // Erweiterte Zeitberechnung verwenden
  const timeCalculation = calculateAdvancedPrintTime(
    analysis.volume,
    analysis.weight,
    analysis.triangleCount,
    infill
  );
  
  const printTimeHours = timeCalculation.totalTimeMinutes / 60;
  
  // 1. Materialkosten: 0,020 € pro Gramm
  const materialCost = analysis.weight * pricing.materialCostPerGram * qFactor.infill;
  
  // 2. Stromkosten: 0,35 € pro kWh, 0,12 kWh pro Stunde
  const electricityCost = printTimeHours * pricing.printerPowerConsumptionKWh * pricing.electricityCostPerKWh;
  
  // 3. Maschinenverschleiß: 0,50 € pro Druckstunde
  const machineWearCost = printTimeHours * pricing.machineWearCostPerHour;
  
  // 4. Service-Pauschale: 5,00 € pro Auftrag
  const serviceFee = pricing.serviceFee;
  
  // Zwischensumme (1-4)
  const subtotal = materialCost + electricityCost + machineWearCost + serviceFee;
  
  // 5. Marge: 25% auf Zwischensumme
  const margin = subtotal * pricing.marginPercentage;
  
  // Nettosumme
  const netTotal = subtotal + margin;
  
  // 6. MwSt: 19% auf Nettosumme
  const vat = netTotal * pricing.vatPercentage;
  
  // Bruttosumme
  const grossTotal = netTotal + vat;
  
  return {
    materialCost: Math.round(materialCost * 100) / 100,
    electricityCost: Math.round(electricityCost * 100) / 100,
    machineWearCost: Math.round(machineWearCost * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    margin: Math.round(margin * 100) / 100,
    netTotal: Math.round(netTotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    grossTotal: Math.round(grossTotal * 100) / 100,
    breakdown: {
      weight: Math.round(analysis.weight * 10) / 10,
      printTime: timeCalculation.totalTimeMinutes,
      materialPricePerGram: pricing.materialCostPerGram,
      printTimeHours: Math.round(printTimeHours * 100) / 100
    },
    customerBreakdown: {
      material: `${Math.round(materialCost * 100) / 100}€`,
      electricity: `${Math.round(electricityCost * 100) / 100}€`,
      machineWear: `${Math.round(machineWearCost * 100) / 100}€`,
      service: `${Math.round(serviceFee * 100) / 100}€`,
      total: `${Math.round(grossTotal * 100) / 100}€`
    }
  };
}
