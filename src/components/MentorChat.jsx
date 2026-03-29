import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './MentorChat.css'

function formatText(text) {
  if (typeof text !== 'string') return text;
  // Simplistic markdown formatter for bold and code blocks
  const parts = text.split(/(```[\s\S]*?```|\*\*.*?\*\*|`.*?`)/);
  
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      return <pre key={i} className="mentor-chat__pre"><code>{part.slice(3, -3).replace(/^[\w]+\n/, '')}</code></pre>;
    } else if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="mentor-chat__code">{part.slice(1, -1)}</code>;
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
  });
}

export default function MentorChat() {
  const [messages, setMessages] = useState([
    { role: 'droid', text: "👋 Welcome, Space Commander! I'm your Mentor Droid. Ask me anything about code, or type 'help' if you're stuck!" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function getResponse(text) {
    try {
      const res = await fetch('http://localhost:8000/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      });
      if (!res.ok) throw new Error('Server returned HTTP ' + res.status);
      const data = await res.json();
      return data.explanation || "No response generated.";
    } catch (err) {
      return `❌ **Error connecting to AI Backend:** Make sure \`backend.py\` is running on port 8000.\n\n_Details: ${err.message}_`;
    }
  }

  async function handleSend() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    const reply = await getResponse(userMsg)
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'droid', text: reply }])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mentor-chat">
      <div className="mentor-chat__header">
        <div className="mentor-chat__avatar">
          <Bot size={18} />
        </div>
        <span className="mentor-chat__name">Mentor Droid</span>
        <Sparkles size={14} className="mentor-chat__sparkle" />
      </div>

      <div className="mentor-chat__messages">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`mentor-chat__msg mentor-chat__msg--${msg.role}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatText(msg.text)}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="mentor-chat__msg mentor-chat__msg--droid mentor-chat__typing">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mentor-chat__input-row">
        <input
          type="text"
          className="mentor-chat__input"
          placeholder="Ask your Mentor Droid..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="mentor-chat__send" onClick={handleSend} aria-label="Send message">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
