import Hero from '@/components/Hero'
import FileUpload from '@/components/FileUpload'
import StatusCheck from '@/components/StatusCheck'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <FileUpload />
      <StatusCheck />
      <Footer />
    </main>
  )
}
