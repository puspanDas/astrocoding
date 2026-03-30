import { useState, useEffect, useRef } from 'react'
import { Bot, Send, X, Sparkles, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './AIAssistant.css'

const QUICK_QUESTIONS = [
  "How does the transpiler work?",
  "How do I play the game?",
  "Tell me about the Sandbox IDE",
  "What is AstroCode?"
]

function renderMarkdown(text) {
  if (typeof text !== 'string') return text

  // Split into code blocks vs everything else
  const blocks = text.split(/(```[\s\S]*?```)/g)

  return blocks.map((block, i) => {
    // Fenced code block
    if (block.startsWith('```') && block.endsWith('```')) {
      const code = block.slice(3, -3).replace(/^[\w]*\n/, '')
      return <pre key={i}><code>{code}</code></pre>
    }

    // Inline markdown — bold, inline code, headings
    const lines = block.split('\n')
    return (
      <span key={i}>
        {lines.map((line, j) => {
          // Heading ##
          if (line.startsWith('## ')) {
            return <h2 key={j}>{line.slice(3)}</h2>
          }
          if (line.startsWith('### ')) {
            return <h3 key={j}>{line.slice(4)}</h3>
          }

          // Process inline formatting
          const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g)
          const rendered = parts.map((p, k) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={k}>{p.slice(2, -2)}</strong>
            }
            if (p.startsWith('`') && p.endsWith('`')) {
              return <code key={k}>{p.slice(1, -1)}</code>
            }
            return p
          })

          return (
            <span key={j}>
              {rendered}
              {j < lines.length - 1 && <br />}
            </span>
          )
        })}
      </span>
    )
  })
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "👋 Hey Commander! I'm the **AstroCode AI Assistant** — powered by a local RAG engine.\n\nAsk me anything about the game, the code engine, the sandbox IDE, or how to write your missions!"
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(text) {
    if (!text.trim()) return

    const userMsg = text.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    try {
      const res = await fetch('http://localhost:8000/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const reply = data.explanation || 'No response generated.'

      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: `❌ **Connection Error:** Make sure \`python backend.py\` is running on port 8000.\n\n_${err.message}_`
        }
      ])
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="ai-fab"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            title="Open AI Assistant"
            aria-label="Open AI Assistant"
          >
            <div className="ai-fab__pulse" />
            <Bot size={26} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="ai-chat__header">
              <div className="ai-chat__avatar">🤖</div>
              <div className="ai-chat__header-text">
                <div className="ai-chat__title">AstroCode AI Assistant</div>
                <div className="ai-chat__subtitle">
                  <Sparkles size={10} style={{ display: 'inline', marginRight: 4 }} />
                  Powered by Local RAG Engine
                </div>
              </div>
              <button
                className="ai-chat__close"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="ai-chat__messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
                  {renderMarkdown(msg.text)}
                </div>
              ))}
              {isTyping && (
                <div className="ai-chat__typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only show when few messages) */}
            {messages.length <= 2 && (
              <div className="ai-chat__quick-actions">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    className="ai-quick-btn"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="ai-chat__input-area">
              <input
                type="text"
                className="ai-chat__input"
                placeholder="Ask me anything about AstroCode..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="ai-chat__send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
