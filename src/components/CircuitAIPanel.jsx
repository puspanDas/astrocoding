import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Sparkles, Lightbulb, CheckCircle, Circle, ShieldCheck } from 'lucide-react'
import { CIRCUIT_COMPONENT_MAP } from '../engine/circuitComponents'

const QUICK_ACTIONS = [
  "What should I add next?",
  "Check my circuit",
  "Explain this scenario",
  "Show all hints"
]

export default function CircuitAIPanel({ scenario, placedComponents, connections, validationResult, hintIndex, testResult, onRevealHint }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  // Reset messages on scenario change
  useEffect(() => {
    setMessages([{
      role: 'bot',
      text: `🔧 **Circuit AI Assistant**\n\nYou're working on: **${scenario.title}**\n\n${scenario.description}\n\nAsk me for hints, explanations, or circuit analysis!`
    }])
  }, [scenario.id])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  // Auto-post test results into chat
  useEffect(() => {
    if (!testResult) return
    const statusLine = testResult.passed ? '✅ **Circuit Test: PASSED**' : '⛔ **Circuit Test: FAILED**'
    const faultLines = testResult.faults.map(f => `• ${f.message}`).join('\n')
    const msg = faultLines ? `${statusLine}\n\n${faultLines}` : `${statusLine}\n\nAll connections are valid — no faults detected!`
    setMessages(p => [...p, { role: 'bot', text: msg }])
  }, [testResult])

  function handleSend(text) {
    const q = (text || input).trim()
    if (!q) return
    setInput('')
    setMessages(p => [...p, { role: 'user', text: q }])
    setIsTyping(true)

    setTimeout(() => {
      const reply = generateResponse(q, scenario, placedComponents, connections)
      setIsTyping(false)
      setMessages(p => [...p, { role: 'bot', text: reply }])
    }, 600)
  }

  function generateResponse(query, scen, comps, conns) {
    const q = query.toLowerCase()
    const types = comps.map(c => c.type)

    // Hints
    if (q.includes('hint') || q.includes('step') || q.includes('show all')) {
      if (scen.hints.length === 0) return "This is sandbox mode — no guided hints. Try building any circuit you like!"
      if (q.includes('all') || q.includes('show')) {
        return "**All Steps:**\n\n" + scen.hints.map((h, i) => `${i + 1}. ${h}`).join('\n\n')
      }
      const nextHint = Math.min((hintIndex || 0) + 1, scen.hints.length - 1)
      if (onRevealHint) onRevealHint(nextHint)
      return `**Step ${nextHint + 1}:** ${scen.hints[nextHint]}`
    }

    // Next step
    if (q.includes('next') || q.includes('what should')) {
      if (scen.requiredComponents.length === 0) {
        return "In sandbox mode, try building a basic LED circuit:\n1. Add a **DC Source**\n2. Add a **Resistor** (330Ω)\n3. Add an **LED**\n4. Add **Ground**\n5. Wire them in series!"
      }
      const missing = []
      const reqCounts = {}
      scen.requiredComponents.forEach(t => { reqCounts[t] = (reqCounts[t] || 0) + 1 })
      Object.entries(reqCounts).forEach(([type, count]) => {
        const placed = types.filter(t => t === type).length
        if (placed < count) {
          const def = CIRCUIT_COMPONENT_MAP[type]
          missing.push(`${def?.label || type} (need ${count - placed} more)`)
        }
      })
      if (missing.length === 0) {
        if (conns.length < scen.requiredConnections.length)
          return "All components placed! Now **wire them together** using the Connect tool. You need at least " + scen.requiredConnections.length + " connections."
        return "✅ Looks complete! Hit **Submit** to validate your design."
      }
      return `**Missing components:**\n\n${missing.map(m => `• ${m}`).join('\n')}\n\nDrag these from the palette onto the canvas.`
    }

    // Check circuit
    if (q.includes('check') || q.includes('analyze') || q.includes('review')) {
      const issues = []
      if (!types.some(t => ['dc-source', 'ac-source'].includes(t))) issues.push("⚠️ No power source — add a DC or AC source.")
      if (!types.includes('ground')) issues.push("⚠️ No ground — every circuit needs a ground reference.")
      if (comps.length > 1 && conns.length === 0) issues.push("⚠️ Components aren't wired — use the Connect tool.")

      const connectedIds = new Set()
      conns.forEach(c => { connectedIds.add(c.from); connectedIds.add(c.to) })
      const floating = comps.filter(c => !connectedIds.has(c.id))
      if (floating.length > 0 && comps.length > 1) {
        issues.push(`⚠️ ${floating.length} floating component(s) not connected.`)
      }

      if (issues.length === 0) return "✅ **Circuit looks good!** All components are connected with proper power and ground. Try running the simulation!"
      return "**Circuit Analysis:**\n\n" + issues.join('\n')
    }

    // Explain scenario
    if (q.includes('explain') || q.includes('what is') || q.includes('about')) {
      return `**${scen.title}**\n\n${scen.description}\n\n**Difficulty:** ${'★'.repeat(scen.difficulty)}${'☆'.repeat(Math.max(0, 5 - scen.difficulty))}\n\n**Required:** ${scen.requiredComponents.length > 0 ? scen.requiredComponents.map(t => CIRCUIT_COMPONENT_MAP[t]?.label || t).join(', ') : 'Free-form design'}`
    }

    // Component explanation
    const compTypes = Object.entries(CIRCUIT_COMPONENT_MAP)
    for (const [type, def] of compTypes) {
      if (q.includes(def.label.toLowerCase()) || q.includes(type)) {
        return `**${def.icon} ${def.label}**\n\n${def.desc}\n\n• Default value: \`${def.defaultValue || 'N/A'}\`\n• Pins: ${def.pins.join(', ')}\n• Category: ${def.category}`
      }
    }

    // Fallback
    return "I can help with:\n• **\"What should I add next?\"** — guidance on missing components\n• **\"Check my circuit\"** — analyze for issues\n• **\"Show all hints\"** — step-by-step walkthrough\n• **\"Explain [component]\"** — learn about any component\n\nTry asking one of these!"
  }

  return (
    <div className="circuit__ai-panel">
      <div className="circuit__ai-header">
        <div className="circuit__ai-avatar">🤖</div>
        <div className="circuit__ai-header-text">
          <div className="circuit__ai-title">Circuit AI Assistant</div>
          <div className="circuit__ai-subtitle"><Sparkles size={9} style={{ display: 'inline', marginRight: 3 }} /> Scenario-Aware Guidance</div>
        </div>
      </div>

      <div className="circuit__ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`circuit__ai-msg circuit__ai-msg--${msg.role}`}>
            {renderText(msg.text)}
          </div>
        ))}
        {isTyping && <div className="circuit__ai-typing"><span /><span /><span /></div>}
        <div ref={endRef} />
      </div>

      {messages.length <= 2 && (
        <div className="circuit__ai-quick">
          {QUICK_ACTIONS.map((q, i) => (
            <button key={i} className="circuit__ai-quick-btn" onClick={() => handleSend(q)}>{q}</button>
          ))}
        </div>
      )}

      {/* Validation checklist */}
      {validationResult && validationResult.checks && validationResult.checks.length > 0 && (
        <div className="circuit__validation">
          <div className="circuit__validation-title">
            <CheckCircle size={13} /> Requirements
          </div>
          {validationResult.checks.map((ch, i) => (
            <div key={i} className={`circuit__validation-check ${ch.passed ? 'circuit__validation-check--pass' : 'circuit__validation-check--fail'}`}>
              {ch.passed ? <CheckCircle size={12} /> : <Circle size={12} />}
              <span>{ch.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hints */}
      {scenario.hints.length > 0 && hintIndex >= 0 && (
        <div className="circuit__hints">
          <div className="circuit__hints-title"><Lightbulb size={13} /> Hints</div>
          {scenario.hints.slice(0, hintIndex + 1).map((h, i) => (
            <div key={i} className="circuit__hint-item">
              <span className="circuit__hint-step">#{i + 1}</span> {h}
            </div>
          ))}
        </div>
      )}

      <div className="circuit__ai-input-area">
        <input className="circuit__ai-input" placeholder="Ask about your circuit..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend() } }} />
        <button className="circuit__ai-send" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}

function renderText(text) {
  if (typeof text !== 'string') return text
  const blocks = text.split(/(```[\s\S]*?```)/g)
  return blocks.map((block, i) => {
    if (block.startsWith('```') && block.endsWith('```')) {
      return <pre key={i}><code>{block.slice(3, -3).replace(/^[\w]*\n/, '')}</code></pre>
    }
    const lines = block.split('\n')
    return (
      <span key={i}>
        {lines.map((line, j) => {
          if (line.startsWith('## ')) return <h2 key={j}>{line.slice(3)}</h2>
          const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g)
          const rendered = parts.map((p, k) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={k}>{p.slice(2, -2)}</strong>
            if (p.startsWith('`') && p.endsWith('`')) return <code key={k}>{p.slice(1, -1)}</code>
            return p
          })
          return <span key={j}>{rendered}{j < lines.length - 1 && <br />}</span>
        })}
      </span>
    )
  })
}
