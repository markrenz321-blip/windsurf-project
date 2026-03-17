import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Grundlegender Verbindungstest ===')
    
    // Test 1: Einfache API-Verbindung ohne Token
    console.log('Test 1: API-Verbindung ohne Token')
    const basicResponse = await fetch('https://api.airtable.com/v0/meta/bases', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Basic Response:', {
      status: basicResponse.status,
      statusText: basicResponse.statusText,
      ok: basicResponse.ok
    })
    
    if (!basicResponse.ok) {
      return NextResponse.json({
        error: 'Airtable API nicht erreichbar',
        status: basicResponse.status,
        message: 'Grundlegende Verbindungsproblem zur Airtable API'
      })
    }
    
    const basicData = await basicResponse.json()
    console.log('Airtable erreichbar, verfügbare Bases:', basicData.bases?.length || 0)
    
    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID

    if (!apiKey || !baseId) {
      return NextResponse.json(
        {
          error: 'Env Vars fehlen. Benötigt: AIRTABLE_API_KEY, AIRTABLE_BASE_ID',
        },
        { status: 500 }
      )
    }

    // Test 2: Mit deinem Token auf Meta-API (sicherste Methode)
    console.log('Test 2: Mit Token auf Meta-API')
    const metaResponse = await fetch('https://api.airtable.com/v0/meta/bases', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Meta Response:', {
      status: metaResponse.status,
      statusText: metaResponse.statusText,
      ok: metaResponse.ok
    })
    
    if (!metaResponse.ok) {
      const errorText = await metaResponse.text()
      console.error('Meta API Error:', errorText)
      return NextResponse.json({
        error: 'Token-Authentifizierung fehlgeschlagen',
        status: metaResponse.status,
        details: errorText,
        message: 'Token ist ungültig oder hat keine Berechtigungen'
      })
    }
    
    const metaData = await metaResponse.json()
    console.log('Meta API erfolgreich, Base gefunden:', metaData.bases?.length || 0)
    
    // Test 3: Finde deine spezifische Base
    const yourBase = metaData.bases?.find((base: any) => base.id === baseId)
    console.log('Deine Base gefunden:', !!yourBase)
    
    if (!yourBase) {
      return NextResponse.json({
        error: 'Base nicht gefunden',
        availableBases: metaData.bases?.map((b: any) => ({ id: b.id, name: b.name })) || [],
        message: `Die Base ID ${baseId} existiert nicht oder du hast keinen Zugriff`
      })
    }
    
    console.log('Base Details:', {
      id: yourBase.id,
      name: yourBase.name,
      permissionLevel: yourBase.permissionLevel
    })
    
    return NextResponse.json({
      success: true,
      message: 'Grundlegender Test erfolgreich',
      results: {
        airtableReachable: basicResponse.ok,
        tokenValid: metaResponse.ok,
        baseExists: !!yourBase,
        baseDetails: {
          id: yourBase.id,
          name: yourBase.name,
          permissionLevel: yourBase.permissionLevel
        },
        nextSteps: [
          '1. Base existiert: ' + !!yourBase,
          '2. Token gültig: ' + metaResponse.ok,
          '3. Berechtigungen prüfen: ' + (yourBase.permissionLevel === 'create' ? 'Ja' : 'Nein')
        ]
      }
    })
    
  } catch (error) {
    console.error('Grundlegender Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
