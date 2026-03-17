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

    const fileBody = await file.arrayBuffer()

    const blob = await put(uniqueName, fileBody, {
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

    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Upload fehlgeschlagen.', details },
      { status: 500 }
    )
  }
}
