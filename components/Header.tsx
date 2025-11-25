import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-0.5 group-hover:scale-110 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
              <Image
                src="/kk-logo.png"
                alt="Krypttrac Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Krypttrac
            </h1>
            <p className="text-xs text-gray-400">Built for Kings 👑</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            href="/portfolio"
            className="text-gray-300 hover:text-white transition"
          >
            Portfolio
          </Link>
          <Link
            href="/watchlist"
            className="text-gray-300 hover:text-white transition"
          >
            Watchlist
          </Link>
          <Link
            href="/alerts"
            className="text-gray-300 hover:text-white transition"
          >
            Alerts
          </Link>
        </nav>

        {/* CTA */}
        <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all hover:scale-105">
          Connect Wallet
        </button>
      </div>
    </header>
  )
}
