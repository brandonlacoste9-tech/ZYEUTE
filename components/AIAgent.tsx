'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, TrendingUp } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIAgentProps {
  dashboardData?: any
  portfolioData?: any
}

export function AIAgent({ dashboardData, portfolioData }: AIAgentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check for stablecoin de-pegs
  const hasDepegs = dashboardData?.stablecoins?.some((coin: any) =>
    parseFloat(coin.price.replace(/,/g, '')) < 0.99
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          dashboardData,
          portfolioData,
        }),
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error connecting to AI. Check your API key.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${
          hasDepegs
            ? 'bg-gradient-to-br from-red-600 to-orange-600 animate-pulse'
            : 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700'
        } text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all`}
        title={hasDepegs ? 'Stablecoin Alert!' : 'Ask Krypto Kings AI'}
      >
        {hasDepegs ? <TrendingUp className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className={`p-5 border-b ${hasDepegs ? 'border-red-500/30 bg-red-500/10' : 'border-purple-500/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${hasDepegs ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'} rounded-xl p-2.5`}>
              {hasDepegs ? <TrendingUp className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Krypto Kings AI</h3>
              <p className="text-xs text-gray-400">
                {hasDepegs ? '⚠️ Stablecoin Alert' : 'Built for Kings 👑'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-16 space-y-5">
            {hasDepegs ? (
              <>
                <div className="text-7xl">⚠️</div>
                <p className="text-xl font-bold text-red-400">De-Peg Alert!</p>
                <p className="text-sm text-gray-400">Stablecoin price off $1.00</p>
                <button
                  onClick={() => setInput('Why are stablecoins off peg?')}
                  className="mt-4 px-5 py-2.5 bg-red-500/20 border border-red-500 rounded-xl text-red-300 hover:bg-red-500/30 transition"
                >
                  Ask AI About It
                </button>
              </>
            ) : (
              <>
                <div className="text-7xl">👑</div>
                <p className="text-xl font-bold text-white">What&apos;s Good King?</p>
                <div className="mt-6 text-left bg-purple-900/20 border border-purple-500/20 rounded-xl p-4 space-y-2 text-sm text-gray-300">
                  <p className="font-semibold text-white mb-3">Try asking:</p>
                  <p>• &quot;Why is Solana moomin&apos;?&quot; 🚀</p>
                  <p>• &quot;Should I buy XRP now?&quot;</p>
                  <p>• &quot;Is my portfolio safe?&quot;</p>
                  <p>• &quot;Explain this market dump&quot;</p>
                </div>
              </>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                : 'bg-slate-800/80 border border-purple-500/20 text-gray-100'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className="text-[10px] mt-1.5 opacity-60">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-purple-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-300">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Ask about crypto..."
            disabled={loading}
            className="flex-1 bg-slate-800/60 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 p-3 rounded-xl transition-all hover:scale-105"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
