import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Keine Datei empfangen.' }, { status: 400 })
    }

    const safeName = (file.name || 'model.stl').replace(/[^a-zA-Z0-9._-]/g, '_')
    const uniqueName = `stl/${Date.now()}_${safeName}`

    // Requires env var: BLOB_READ_WRITE_TOKEN (configured in Vercel project settings)
    const blob = await put(uniqueName, file, {
      access: 'public',
      contentType: file.type || 'application/octet-stream',
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: file.name,
      storedAs: uniqueName,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('upload-stl error:', error)
    return NextResponse.json(
      { error: 'Upload fehlgeschlagen. Prüfe BLOB_READ_WRITE_TOKEN auf Vercel.' },
      { status: 500 }
    )
  }
}
