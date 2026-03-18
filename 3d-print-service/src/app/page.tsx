import Hero from '@/components/Hero'
import ProcessSection from '@/components/ProcessSection'
import Gallery from '@/components/Gallery'
import FileUpload from '@/components/FileUpload'
import StatusCheck from '@/components/StatusCheck'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a]">
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      <section className="scroll-mt-24">
        <ProcessSection />
      </section>

      <section id="service" className="scroll-mt-24 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/30">
            <FileUpload />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24">
        <Gallery />
      </section>

      <section id="status" className="scroll-mt-24">
        <StatusCheck />
      </section>

      <Footer />
    </main>
  )
}
