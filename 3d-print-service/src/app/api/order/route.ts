import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Debug-Informationen ausgeben
    console.log('API Config:', {
      baseId: airtableConfig.baseId,
      tableId: airtableConfig.tableId,
      apiKey: airtableConfig.apiKey ? 'Set' : 'Not set'
    })

    if (!airtableConfig.baseId || !airtableConfig.tableId || !airtableConfig.apiKey) {
      return NextResponse.json(
        {
          error: 'Airtable Konfiguration fehlt. Bitte AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID und AIRTABLE_API_KEY setzen.',
        },
        { status: 500 }
      )
    }
    
    // Validierung der Pflichtfelder
    const {
      firstName,
      lastName,
      email,
      address,
      postalCode,
      city,
      country,
      phone,
      orderId,
      orderType,
      material,
      quality,
      infill,
      totalPrice,
      estimatedPrintTime,
      weightGrams,
      printTimeMinutes,
      stlFileUrl,
      stlFileName,
      photoUrl,
      photoName,
      comment,
      projectPhotos,
      customerNote,
      needsCadHelp,
    } = body
    
    // Logging der empfangenen Daten
    console.log('Empfangene Bestelldaten:', {
      firstName,
      lastName,
      email,
      address,
      postalCode,
      city,
      country,
      phone,
      orderId,
      material,
      quality,
      infill,
      totalPrice: typeof totalPrice,
      estimatedPrintTime: typeof estimatedPrintTime
    })
    
    // Zahlen sicher in Numbers umwandeln
    const numericTotalPrice = Number(totalPrice) || 0
    const numericEstimatedPrintTime = Number(estimatedPrintTime) || 0
    const numericWeightGrams = Number(weightGrams) || 0
    const numericPrintTimeMinutes = Number(printTimeMinutes ?? estimatedPrintTime) || 0
    
    console.log('Konvertierte Zahlen:', {
      totalPrice: numericTotalPrice,
      estimatedPrintTime: numericEstimatedPrintTime,
      weightGrams: numericWeightGrams,
      printTimeMinutes: numericPrintTimeMinutes,
      isNaN: {
        totalPrice: isNaN(numericTotalPrice),
        estimatedPrintTime: isNaN(numericEstimatedPrintTime),
        weightGrams: isNaN(numericWeightGrams),
        printTimeMinutes: isNaN(numericPrintTimeMinutes)
      }
    })
    
    if (!firstName || !lastName || !email || !address || !postalCode || !city || !orderId) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus' },
        { status: 400 }
      )
    }

    const normalizedOrderType: 'direct' | 'photo' =
      orderType === 'photo' || orderType === 'series' || orderType === 'cad' ? 'photo' : 'direct'

    // Airtable API aufrufen
    const airtableUrl = `https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableId}`
    console.log('Airtable URL:', airtableUrl)
    console.log(
      'Authorization Header:',
      airtableConfig.apiKey ? `Bearer ${airtableConfig.apiKey.substring(0, 20)}...` : 'Not set'
    )
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            // 'Bestell-ID': orderId,  // Entfernt - computed field
            'Kundenname': `${firstName ?? ''} ${lastName ?? ''}`.trim(),
            'E-Mail': email,
            ...(stlFileUrl
              ? {
                  'STL-Datei': [
                    {
                      url: String(stlFileUrl),
                      filename: stlFileName ? String(stlFileName) : 'model.stl',
                    },
                  ],
                }
              : {}),
            ...(photoUrl
              ? {
                  'Foto': [
                    {
                      url: String(photoUrl),
                      filename: photoName ? String(photoName) : 'foto',
                    },
                  ],
                }
              : {}),
            ...(comment
              ? {
                  'Kommentar': String(comment),
                }
              : {}),
            ...(customerNote
              ? {
                  'Kunden-Notiz': String(customerNote),
                }
              : {}),
            ...(Array.isArray(projectPhotos) && projectPhotos.length > 0
              ? {
                  'Projekt-Fotos': projectPhotos
                    .filter((p: any) => p && p.url)
                    .map((p: any) => ({
                      url: String(p.url),
                      ...(p.filename ? { filename: String(p.filename) } : {}),
                    })),
                }
              : {}),
            ...(typeof needsCadHelp === 'boolean'
              ? {
                  'CAD-Konstruktionshilfe': needsCadHelp,
                }
              : {}),
            ...(normalizedOrderType === 'photo'
              ? {
                  'Status': '🔍 Prüfung',
                }
              : {
                  'Status': 'Eingegangen',
                }),
            'Gewicht (g)': numericWeightGrams,
            'Druckzeit (min)': numericPrintTimeMinutes
          }
        }]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Airtable API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        url: airtableUrl
      })
      
      // Detaillierte Fehlermeldung von Airtable
      let parsedError = null
      try {
        parsedError = JSON.parse(errorText)
        console.log('Parsed Airtable Error:', JSON.stringify(parsedError, null, 2))
      } catch (e) {
        console.log('Raw Airtable Error Text:', errorText)
      }
      
      // Detaillierte Fehlermeldung mit exaktem Fehler-Code
      let errorMessage = 'Fehler bei der Bestellung. Bitte versuchen Sie es später.'
      let errorType = 'unknown'
      
      switch (response.status) {
        case 400:
          errorMessage = 'Ungültige Anfrage. Bitte überprüfen Sie die Daten.'
          errorType = 'bad_request'
          break
        case 401:
          errorMessage = 'API-Key ungültig oder abgelaufen. Bitte überprüfen Sie den Token.'
          errorType = 'unauthorized'
          break
        case 403:
          errorMessage = 'Keine Berechtigung für diese Aktion. Fehlende Scopes im Token.'
          errorType = 'forbidden'
          break
        case 404:
          errorMessage = 'Base oder Table nicht gefunden. Bitte überprüfen Sie Base ID und Table ID.'
          errorType = 'not_found'
          break
        case 422:
          errorMessage = 'Validierungsfehler. Bitte überprüfen Sie die Felddaten.'
          errorType = 'validation_error'
          break
        case 429:
          errorMessage = 'Zu viele Anfragen. Bitte versuchen Sie es später.'
          errorType = 'rate_limit'
          break
        case 500:
        case 502:
        case 503:
          errorMessage = 'Airtable Serverfehler. Bitte versuchen Sie es später.'
          errorType = 'server_error'
          break
      }
      
      return NextResponse.json({
        error: errorMessage,
        errorType: errorType,
        statusCode: response.status,
        details: errorText,
        parsedError: parsedError
      }, { status: response.status })
    }

    const data = await response.json()
    const airtableRecordId = data.records[0].id

    console.log('✅ Bestellung erfolgreich erstellt:', {
      orderId,
      airtableRecordId,
      record: data.records[0]
    })

    return NextResponse.json({
      success: true,
      orderId: orderId,
      airtableRecordId: airtableRecordId,
      message: `Bestellung #${orderId} wurde erfolgreich empfangen!`
    })

  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
