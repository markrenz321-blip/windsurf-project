import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Alle möglichen Status-Werte für Airtable
    const statusValues = {
      // Haupt-Status
      pending: {
        name: 'pending',
        display: 'Ausstehend',
        description: 'Bestellung wurde empfangen und wartet auf Bearbeitung',
        color: '#F59E0B',
        icon: '⏳'
      },
      
      processing: {
        name: 'processing',
        display: 'In Bearbeitung',
        description: 'Bestellung wird aktuell bearbeitet (Druck läuft)',
        color: '#3B82F6',
        icon: '🖨️'
      },
      
      completed: {
        name: 'completed',
        display: 'Abgeschlossen',
        description: 'Bestellung wurde erfolgreich abgeschlossen',
        color: '#10B981',
        icon: '✅'
      },
      
      cancelled: {
        name: 'cancelled',
        display: 'Storniert',
        description: 'Bestellung wurde vom Kunden storniert',
        color: '#EF4444',
        icon: '❌'
      },
      
      error: {
        name: 'error',
        display: 'Fehler',
        description: 'Bei der Bearbeitung ist ein Fehler aufgetreten',
        color: '#DC2626',
        icon: '⚠️'
      },
      
      // Zusätzliche Status (optional)
      on_hold: {
        name: 'on_hold',
        display: 'Pausiert',
        description: 'Bestellung ist vorübergehend pausiert',
        color: '#8B5CF6',
        icon: '⏸️'
      },
      
      shipped: {
        name: 'shipped',
        display: 'Versendet',
        description: 'Bestellung wurde versendet',
        color: '#6366F1',
        icon: '📦'
      },
      
      delivered: {
        name: 'delivered',
        display: 'Zugestellt',
        description: 'Bestellung wurde zugestellt',
        color: '#059669',
        icon: '📬'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status-Werte für Airtable',
      data: {
        statusValues,
        usage: {
          fieldUpdate: 'PATCH /api/airtable/update-status',
          fieldQuery: 'GET /api/airtable/status/{orderId}',
          prompt: 'Verwende diese Werte als Prompt für Airtable-Automatisierung'
        },
        airtableFormat: {
          singleSelectOptions: statusValues,
          defaultStatus: 'pending',
          fieldName: 'Status'
        }
      }
    })

  } catch (error) {
    console.error('Status Values Error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Status-Werte' },
      { status: 500 }
    )
  }
}
