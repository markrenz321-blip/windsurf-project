import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Airtable Write Test ===')
    
    // Test-Daten für eine Test-Zeile
    const testRecord = {
      fields: {
        'Bestell-ID': `TEST-${Date.now()}`,
        'Status': 'pending',
        'Kunden-E-Mail': 'test@example.com',
        'Vorname': 'Test',
        'Nachname': 'User',
        'Telefon': '+49 30 12345678',
        'Straße': 'Teststraße 123',
        'PLZ': '10115',
        'Stadt': 'Berlin',
        'Land': 'Deutschland',
        'Material': 'PLA',
        'Qualität': 'standard',
        'Füllung': 'standard',
        'Gesamtpreis': 25.50,
        'Druckzeit': 120,
        'Erstellt am': new Date().toISOString(),
        'Test-Zeile': true
      }
    }

    console.log('Test Record:', testRecord)
    
    const airtableUrl = `https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableId}`
    console.log('Write Test URL:', airtableUrl)
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [testRecord]
      }),
    })

    console.log('Write Test Response Status:', response.status)
    console.log('Write Test Response Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Write Test Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      })
      
      return NextResponse.json({
        error: 'Test-Schreiben fehlgeschlagen',
        statusCode: response.status,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    const recordId = data.records[0].id

    console.log('✅ Test-Record erfolgreich erstellt:', {
      recordId,
      record: data.records[0]
    })

    return NextResponse.json({
      success: true,
      message: 'Test-Zeile erfolgreich in Airtable geschrieben',
      recordId: recordId,
      testRecord: testRecord
    })

  } catch (error) {
    console.error('Write Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    }, { status: 500 })
  }
}
