import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Token Format Test ===')

    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID

    if (!apiKey || !baseId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Env Vars fehlen. Benötigt: AIRTABLE_API_KEY, AIRTABLE_BASE_ID',
        },
        { status: 500 }
      )
    }

    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    })
    
  } catch (error) {
    console.error('Token Format Test Error:', error)
    return NextResponse.json({
      error: 'Test fehlgeschlagen',
      details: error
    })
  }
}
