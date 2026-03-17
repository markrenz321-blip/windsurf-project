import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Finaler Test ===')

    const apiKey = process.env.AIRTABLE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'AIRTABLE_API_KEY fehlt. Bitte als Env-Variable setzen.',
        },
        { status: 500 }
      )
    }
    
    // Test 1: Versuche es als API Key statt Personal Access Token
    console.log('Test 1: API Key Format (ohne Bearer)')
    const apiKeyResponse = await fetch('https://api.airtable.com/v0/meta/bases', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log('API Key Response:', {
      status: apiKeyResponse.status,
      statusText: apiKeyResponse.statusText,
      ok: apiKeyResponse.ok
    })
    
    return NextResponse.json({
      success: apiKeyResponse.ok,
      message: apiKeyResponse.ok ? 'Token funktioniert' : 'Token funktioniert nicht',
      result: { name: 'AIRTABLE_API_KEY', status: apiKeyResponse.status, ok: apiKeyResponse.ok },
      recommendations: [
        '1. Prüfe ob der Token in Airtable noch aktiv ist',
        '2. Stelle sicher dass du einen Personal Access Token verwendest (keinen API Key)',
        '3. Prüfe ob der Token die richtigen Scopes hat',
        '4. Erstelle einen komplett neuen Token und kopiere ihn sofort'
      ]
    })
    
  } catch (error) {
    console.error('Finaler Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
