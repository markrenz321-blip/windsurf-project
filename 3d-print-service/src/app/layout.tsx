import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Renz 3D Print',
  description: 'Dein Design, unser Druck - Professioneller 3D-Druck Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900">
          <header className="sticky top-0 z-50 backdrop-blur border-b border-white/5 bg-gray-900/70">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <a href="/" className="flex items-center">
                <img
                  src="/uploads/logo.png"
                  alt="Renz 3D Print"
                  className="h-8 w-auto object-contain"
                  loading="eager"
                />
              </a>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
