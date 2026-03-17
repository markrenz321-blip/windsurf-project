import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Alle Felder Test (Meta API) ===')

    const tablesUrl = `https://api.airtable.com/v0/meta/bases/${airtableConfig.baseId}/tables`
    const tablesResponse = await fetch(tablesUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!tablesResponse.ok) {
      const errorText = await tablesResponse.text()
      console.error('Meta API Error:', {
        status: tablesResponse.status,
        statusText: tablesResponse.statusText,
        errorText,
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Meta API Anfrage fehlgeschlagen',
          statusCode: tablesResponse.status,
          details: errorText,
        },
        { status: tablesResponse.status }
      )
    }

    const tablesData: any = await tablesResponse.json()
    const ourTable = (tablesData.tables || []).find((t: any) => t.id === airtableConfig.tableId)

    if (!ourTable) {
      return NextResponse.json({
        success: false,
        error: 'Tabelle nicht gefunden',
        baseId: airtableConfig.baseId,
        tableId: airtableConfig.tableId,
        availableTables: (tablesData.tables || []).map((t: any) => ({ id: t.id, name: t.name })),
      })
    }

    const fields = (ourTable.fields || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      options: f.options || null,
    }))

    const fieldNames = new Set<string>(fields.map((f: any) => f.name))

    const suggestedMapping = {
      customerNameField: fieldNames.has('Kundenname') ? 'Kundenname' : null,
      emailField: fieldNames.has('E-Mail') ? 'E-Mail' : null,
      weightField: fieldNames.has('Gewicht (g)') ? 'Gewicht (g)' : null,
      printTimeField: fieldNames.has('Druckzeit (min)') ? 'Druckzeit (min)' : null,
      stlField: fieldNames.has('STL-Datei') ? 'STL-Datei' : null,
      orderIdField: fieldNames.has('Bestell-ID') ? 'Bestell-ID' : null,
    }

    return NextResponse.json({
      success: true,
      table: {
        id: ourTable.id,
        name: ourTable.name,
      },
      fields,
      suggestedMapping,
      note:
        'Diese Route liest nur Meta-Daten (keine Schreibtests), daher sollte sie sofort laden. Nutze die Feldnamen aus `fields` 1:1 in /api/order.',
    })
    
  } catch (error) {
    console.error('Alle Felder Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
