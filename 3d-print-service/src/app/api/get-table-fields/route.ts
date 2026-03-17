import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Tabelle-Felder auslesen ===')
    
    // 1. Alle Tabellen in der Base abrufen
    const tablesUrl = `https://api.airtable.com/v0/meta/bases/${airtableConfig.baseId}/tables`
    console.log('Tables URL:', tablesUrl)
    
    const tablesResponse = await fetch(tablesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!tablesResponse.ok) {
      const errorText = await tablesResponse.text()
      console.error('Tables Error:', errorText)
      return NextResponse.json({
        error: 'Tabellen konnten nicht abgerufen werden',
        status: tablesResponse.status,
        details: errorText
      })
    }
    
    const tablesData = await tablesResponse.json()
    console.log('Gefundene Tabellen:', tablesData.tables?.length || 0)
    
    // 2. Unsere spezifische Tabelle finden
    const ourTable = tablesData.tables?.find((table: any) => table.id === airtableConfig.tableId)
    
    if (!ourTable) {
      return NextResponse.json({
        error: 'Unsere Tabelle nicht gefunden',
        availableTables: tablesData.tables?.map((t: any) => ({ 
          id: t.id, 
          name: t.name 
        })) || [],
        message: `Tabelle mit ID ${airtableConfig.tableId} nicht gefunden`
      })
    }
    
    console.log('Unsere Tabelle gefunden:', ourTable.name)
    
    // 3. Alle Felder unserer Tabelle ausgeben
    const fields = ourTable.fields || []
    console.log('Anzahl Felder:', fields.length)
    
    // 4. E-Mail-ähnliche Felder finden
    const emailRelatedFields = fields.filter((field: any) => {
      const fieldName = field.name.toLowerCase()
      return fieldName.includes('mail') || 
             fieldName.includes('email') || 
             fieldName.includes('e-mail') ||
             fieldName.includes('kunden') ||
             fieldName.includes('customer')
    })
    
    console.log('E-Mail-ähnliche Felder:', emailRelatedFields.map((f: any) => f.name))
    
    // 5. Alle Felder mit Details ausgeben
    const allFields = fields.map((field: any) => ({
      name: field.name,
      type: field.type,
      description: field.description || 'Keine Beschreibung',
      isEmailRelated: emailRelatedFields.some((f: any) => f.name === field.name),
      options: field.options || null
    }))
    
    return NextResponse.json({
      success: true,
      message: 'Tabelle-Felder erfolgreich ausgelesen',
      tableInfo: {
        id: ourTable.id,
        name: ourTable.name,
        fieldCount: fields.length
      },
      fields: allFields,
      emailFields: emailRelatedFields.map((f: any) => f.name),
      recommendations: [
        '1. Suche ein Feld mit "mail" oder "email" im Namen',
        '2. Prüfe die exakten Feldnamen in dieser Liste',
        '3. Kopiere den Feldnamen direkt aus dieser Ausgabe',
        '4. Achte auf Groß/Kleinschreibung und Sonderzeichen'
      ]
    })
    
  } catch (error) {
    console.error('Tabelle-Felder Error:', error)
    return NextResponse.json({
      error: 'Felder konnten nicht ausgelesen werden',
      details: error
    })
  }
}
