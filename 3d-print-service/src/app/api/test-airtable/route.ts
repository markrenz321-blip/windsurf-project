import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Airtable Test ===')
    console.log('Base ID:', airtableConfig.baseId)
    console.log('Table ID:', airtableConfig.tableId)
    console.log('API Key:', airtableConfig.apiKey ? 'Set' : 'Not set')
    
    // Test 1: Base Info abrufen
    const baseInfoUrl = `https://api.airtable.com/v0/meta/bases/${airtableConfig.baseId}`
    console.log('Base Info URL:', baseInfoUrl)
    
    const baseResponse = await fetch(baseInfoUrl, {
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Base Response Status:', baseResponse.status)
    
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
    console.log('Base Data:', baseData)
    
    // Test 2: Table Info abrufen
    const tableInfoUrl = `https://api.airtable.com/v0/meta/bases/${airtableConfig.baseId}/tables`
    console.log('Table Info URL:', tableInfoUrl)
    
    const tableResponse = await fetch(tableInfoUrl, {
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Table Response Status:', tableResponse.status)
    
    if (!tableResponse.ok) {
      const errorText = await tableResponse.text()
      console.error('Table Error:', errorText)
      return NextResponse.json({
        error: 'Table nicht gefunden',
        details: errorText,
        status: tableResponse.status
      })
    }
    
    const tableData = await tableResponse.json()
    console.log('Table Data:', tableData)
    
    // Finde unsere Tabelle
    const ourTable = tableData.tables.find((table: any) => table.id === airtableConfig.tableId)
    console.log('Our Table:', ourTable)
    
    if (!ourTable) {
      return NextResponse.json({
        error: 'Table ID nicht in Base gefunden',
        availableTables: tableData.tables.map((t: any) => ({ id: t.id, name: t.name }))
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Airtable Konfiguration ist korrekt',
      base: baseData,
      table: ourTable
    })
    
  } catch (error) {
    console.error('Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
