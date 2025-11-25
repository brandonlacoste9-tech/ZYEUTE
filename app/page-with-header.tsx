import { Header } from '@/components/Header'
import { AIAgent } from '@/components/AIAgent'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Your existing content */}

        {/* AI Agent */}
        <AIAgent />
      </main>
    </>
  )
}
