import { NextRequest, NextResponse } from 'next/server'
import { airtableConfig } from '@/lib/airtable-api'

type StatusStage = {
  stage: 'queue' | 'printing' | 'quality' | 'shipped' | 'not_found'
  statusText: string
  description: string
  progress: number
}

function mapAirtableStatusToStage(statusRaw: string | undefined): StatusStage {
  const status = String(statusRaw || '').trim().toLowerCase()

  if (!status) {
    return {
      stage: 'queue',
      statusText: 'Eingegangen',
      description: 'Deine Anfrage wurde empfangen und wird vorbereitet.',
      progress: 10,
    }
  }

  if (status.includes('versend') || status.includes('shipped')) {
    return {
      stage: 'shipped',
      statusText: 'Versendet',
      description: 'Dein Auftrag ist auf dem Weg zu dir.',
      progress: 100,
    }
  }

  if (status.includes('qualität') || status.includes('kontroll') || status.includes('finish')) {
    return {
      stage: 'quality',
      statusText: 'Qualitätskontrolle',
      description: 'Wir prüfen Maßhaltigkeit und Finish.',
      progress: 80,
    }
  }

  if (status.includes('druck') || status.includes('printing') || status.includes('produktion')) {
    return {
      stage: 'printing',
      statusText: 'In Produktion',
      description: 'Dein Auftrag wird aktuell gefertigt.',
      progress: 50,
    }
  }

  if (status.includes('prüfung') || status.includes('review') || status.includes('angebot')) {
    return {
      stage: 'queue',
      statusText: 'In Prüfung',
      description: 'Wir prüfen deine Daten und erstellen ein Angebot.',
      progress: 20,
    }
  }

  if (status.includes('eingegangen') || status.includes('neu') || status.includes('open')) {
    return {
      stage: 'queue',
      statusText: 'Eingegangen',
      description: 'Dein Auftrag ist im System und wird bearbeitet.',
      progress: 10,
    }
  }

  return {
    stage: 'queue',
    statusText: statusRaw ? String(statusRaw) : 'Eingegangen',
    description: 'Status wird aktualisiert.',
    progress: 15,
  }
}

export async function GET(_request: NextRequest, { params }: { params: { recordId: string } }) {
  try {
    const recordId = String(params.recordId || '').trim()

    if (!recordId) {
      return NextResponse.json({ error: 'recordId fehlt' }, { status: 400 })
    }

    if (!airtableConfig.baseId || !airtableConfig.tableId || !airtableConfig.apiKey) {
      return NextResponse.json(
        {
          error: 'Airtable Konfiguration fehlt. Bitte AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID und AIRTABLE_API_KEY setzen.',
        },
        { status: 500 }
      )
    }

    const airtableUrl = `https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableId}/${encodeURIComponent(recordId)}`

    const response = await fetch(airtableUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${airtableConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (response.status === 404) {
      return NextResponse.json({ found: false }, { status: 200 })
    }

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Airtable Status konnte nicht geladen werden', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const statusRaw = data?.fields?.Status
    const mapped = mapAirtableStatusToStage(statusRaw)

    return NextResponse.json({
      found: true,
      recordId,
      statusRaw: statusRaw ?? null,
      ...mapped,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
