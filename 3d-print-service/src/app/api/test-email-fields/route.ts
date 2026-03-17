import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function GET(request: NextRequest) {
  try {
    console.log('=== E-Mail Felder Test ===')
    
    // Teste verschiedene mögliche E-Mail-Feldnamen
    const emailFieldVariants = [
      'Email',
      'email', 
      'E-Mail',
      'e-mail',
      'EMail',
      'Kunden-E-Mail',
      'Kunden Email',
      'Customer Email',
      'CustomerEmail',
      'Mail',
      'mail_address',
      'email_address'
    ]
    
    const baseId = airtableConfig.baseId
    const tableId = airtableConfig.tableId
    
    for (let i = 0; i < emailFieldVariants.length; i++) {
      const fieldName = emailFieldVariants[i]
      console.log(`Teste E-Mail Feld ${i + 1}: "${fieldName}"`)
      
      const testRecord = {
        fields: {
          [fieldName]: 'test@example.com',
          'Name': 'Test User',
          'Preis': 25.50
        }
      }
      
      const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [testRecord]
        }),
      })
      
      console.log(`Feld "${fieldName}" Response:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          message: `E-Mail Feld "${fieldName}" funktioniert!`,
          workingField: fieldName,
          recordId: data.records?.[0]?.id,
          testedFields: emailFieldVariants.map((field, idx) => ({
            field: field,
            status: idx === i ? 'WORKING' : 'TESTED'
          }))
        })
      } else {
        const errorText = await response.text()
        console.error(`Feld "${fieldName}" Error:`, errorText)
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Kein E-Mail-Feld funktioniert',
      testedFields: emailFieldVariants.length,
      allFailed: true,
      recommendations: [
        '1. Prüfe die exakten Feldnamen in deiner Airtable-Tabelle',
        '2. Achte auf Groß/Kleinschreibung',
        '3. Achte auf Umlaute und Sonderzeichen',
        '4. Kopiere die Feldnamen direkt aus Airtable'
      ]
    })
    
  } catch (error) {
    console.error('E-Mail Felder Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
