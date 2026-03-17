import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function POST(request: NextRequest) {
  try {
    // Einfacher Test mit minimalem Record
    const testRecord = {
      fields: {
        'Name': 'Test User',
        'Email': 'test@example.com',
        'Preis': 25.50,
        'Status': '🆕 Eingegangen'
      }
    }

    console.log('Simple Test Record:', testRecord)
    
    const response = await fetch(`https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [testRecord]
      }),
    })

    console.log('Simple Test Status:', response.status)
    console.log('Simple Test Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Simple Test Error:', errorText)
      return NextResponse.json({
        error: 'Simple Test fehlgeschlagen',
        details: errorText,
        status: response.status
      })
    }

    const data = await response.json()
    console.log('Simple Test Success:', data)

    return NextResponse.json({
      success: true,
      message: 'Einfacher Test erfolgreich',
      recordId: data.records?.[0]?.id,
      record: data.records?.[0]
    })

  } catch (error) {
    console.error('Simple Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
