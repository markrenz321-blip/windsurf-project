import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'

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
        <div className="min-h-screen bg-[#0f172a]">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}
