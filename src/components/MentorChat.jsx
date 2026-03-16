import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './MentorChat.css'

const HINT_RESPONSES = [
  { trigger: 'help', response: "🤖 Beep-boop! Try breaking the problem into smaller steps. What does your rover need to do first?" },
  { trigger: 'stuck', response: "🔧 No worries, Commander! Look at the mission objective again. You need a loop to repeat the movement." },
  { trigger: 'loop', response: "💡 A `for` loop repeats code a set number of times. Try: `for i in range(5): rover.move()` to move 5 times!" },
  { trigger: 'error', response: "🔍 Errors are just clues! Check line numbers — usually it's a missing colon `:` or wrong indentation." },
  { trigger: 'variable', response: "📦 Variables store data! Think of them as labeled boxes. `speed = 10` creates a box called 'speed' with 10 inside." },
  { trigger: 'function', response: "⚙️ Functions are reusable code recipes! Define with `def my_function():` and call with `my_function()`." },
  { trigger: 'default', response: "🚀 I'm your Mentor Droid! Ask me about loops, variables, functions, or type 'help' if you're stuck!" },
]

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

  function getResponse(text) {
    const lower = text.toLowerCase()
    for (const hint of HINT_RESPONSES) {
      if (lower.includes(hint.trigger)) return hint.response
    }
    return HINT_RESPONSES[HINT_RESPONSES.length - 1].response
  }

  function handleSend() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'droid', text: getResponse(userMsg) }])
    }, 800 + Math.random() * 600)
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
              {msg.text}
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
