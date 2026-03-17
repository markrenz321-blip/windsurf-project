import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug: Airtable Felder abrufen ===')
    
    // 1. Base-Informationen abrufen
    const baseInfoUrl = `https://api.airtable.com/v0/meta/bases/${airtableConfig.baseId}`
    console.log('Base Info URL:', baseInfoUrl)
    
    const baseResponse = await fetch(baseInfoUrl, {
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!baseResponse.ok) {
      const errorText = await baseResponse.text()
      console.error('Base Error:', errorText)
      return NextResponse.json({
        error: 'Base nicht gefunden',
        details: errorText,
        status: baseResponse.status
      })
    }
    
    const baseData = await baseResponse.json()
    console.log('Base Name:', baseData.name)
    
    // 2. Tabellen-Informationen abrufen
    const tableInfoUrl = `https://api.airtable.com/v0/meta/bases/${airtableConfig.baseId}/tables`
    console.log('Table Info URL:', tableInfoUrl)
    
    const tableResponse = await fetch(tableInfoUrl, {
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!tableResponse.ok) {
      const errorText = await tableResponse.text()
      console.error('Table Error:', errorText)
      return NextResponse.json({
        error: 'Tabellen nicht gefunden',
        details: errorText,
        status: tableResponse.status
      })
    }
    
    const tableData = await tableResponse.json()
    
    // Unsere Tabelle finden
    const ourTable = tableData.tables.find((table: any) => table.id === airtableConfig.tableId)
    
    if (!ourTable) {
      return NextResponse.json({
        error: 'Unsere Tabelle nicht gefunden',
        availableTables: tableData.tables.map((t: any) => ({ id: t.id, name: t.name }))
      })
    }
    
    console.log('Our Table:', ourTable.name)
    console.log('Our Table ID:', ourTable.id)
    
    // Alle verfügbaren Felder unserer Tabelle
    const fields = ourTable.fields || []
    console.log('Available Fields:', fields.map((f: any) => ({ 
      name: f.name, 
      type: f.type,
      description: f.description || 'Keine Beschreibung'
    })))
    
    // Prüfen, ob unsere erwarteten Felder existieren
    const expectedFields = [
      'Bestell-ID',
      'Status', 
      'Kunden-E-Mail',
      'Vorname',
      'Nachname',
      'Telefon',
      'Straße',
      'PLZ',
      'Stadt',
      'Land',
      'Material',
      'Qualität',
      'Füllung',
      'Gesamtpreis',
      'Druckzeit',
      'Erstellt am'
    ]
    
    const missingFields = expectedFields.filter(fieldName => 
      !fields.find((f: any) => f.name === fieldName)
    )
    
    const existingFields = expectedFields.filter(fieldName => 
      fields.find((f: any) => f.name === fieldName)
    )
    
    return NextResponse.json({
      success: true,
      tableName: ourTable.name,
      tableId: ourTable.id,
      fields: {
        all: fields.map((f: any) => ({ 
          name: f.name, 
          type: f.type,
          description: f.description || 'Keine Beschreibung'
        })),
        expected: expectedFields,
        existing: existingFields,
        missing: missingFields,
        summary: {
          total: expectedFields.length,
          found: existingFields.length,
          missingCount: missingFields.length
        }
      }
    })
    
  } catch (error) {
    console.error('Debug Error:', error)
    return NextResponse.json({
      error: 'Debug fehlgeschlagen',
      details: error
    })
  }
}
