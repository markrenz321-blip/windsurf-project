import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Airtable Connection Test ===')
    console.log('API Config:', {
      baseId: airtableConfig.baseId,
      tableId: airtableConfig.tableId,
      apiKey: airtableConfig.apiKey ? 'Set' : 'Not set'
    })
    
    // Test 1: Basis-URL testen
    const baseUrl = `https://api.airtable.com/v0/${airtableConfig.baseId}`
    console.log('Base URL:', baseUrl)
    
    // Test 2: Einfache API-Abfrage ohne Auth
    const testResponse = await fetch(`${baseUrl}/tables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Test Response Status:', testResponse.status)
    console.log('Test Response Headers:', Object.fromEntries(testResponse.headers.entries()))
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text()
      console.error('Test Error:', errorText)
      return NextResponse.json({
        error: 'Airtable nicht erreichbar',
        details: errorText,
        status: testResponse.status
      })
    }
    
    const testData = await testResponse.json()
    console.log('Base Tables:', testData.tables?.length || 0)
    
    // Test 3: Mit Auth
    const authResponse = await fetch(`${baseUrl}/tables`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Auth Response Status:', authResponse.status)
    console.log('Auth Response Headers:', Object.fromEntries(authResponse.headers.entries()))
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error('Auth Error:', errorText)
      return NextResponse.json({
        error: 'Airtable Auth fehlgeschlagen',
        details: errorText,
        status: authResponse.status
      })
    }
    
    const authData = await authResponse.json()
    console.log('Auth Base Tables:', authData.tables?.length || 0)
    
    // Test 4: Unsere Tabelle suchen
    const ourTable = authData.tables?.find((table: any) => table.id === airtableConfig.tableId)
    console.log('Our Table Found:', !!ourTable)
    
    if (ourTable) {
      console.log('Our Table Name:', ourTable.name)
      console.log('Our Table Fields:', ourTable.fields?.length || 0)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Airtable Verbindung erfolgreich getestet',
      results: {
        baseReachable: testResponse.ok,
        authWorking: authResponse.ok,
        tableFound: !!ourTable,
        baseInfo: {
          name: testData.name,
          tableCount: testData.tables?.length || 0
        },
        authInfo: {
          tableCount: authData.tables?.length || 0,
          tableName: ourTable?.name || 'Not found'
        },
        tableInfo: ourTable ? {
          name: ourTable.name,
          fieldCount: ourTable.fields?.length || 0
        } : null
      }
    })
    
  } catch (error) {
    console.error('Connection Test Error:', error)
    return NextResponse.json({
      error: 'Verbindungstest fehlgeschlagen',
      details: error
    })
  }
}
