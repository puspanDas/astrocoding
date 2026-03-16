import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, RotateCcw, Rocket, Cpu, Trophy, Gem,
  ChevronDown, Maximize2, Minimize2
} from 'lucide-react'
import MentorChat from '../components/MentorChat'
import StarField from '../components/StarField'
import './GameDemo.css'

const LANGUAGES = {
  python: {
    label: 'Python',
    faction: 'Python Federation',
    color: '#10b981',
    icon: '🐍',
    defaultCode: `# Mission: Navigate your rover out of the crater!
# Write code to make the rover climb upward.

def escape_crater(rover):
    for i in range(5):
        rover.move_forward()
        rover.thrust(power=i * 2)
    
    if rover.altitude > 10:
        rover.send_signal("ESCAPED!")
        return True
    return False

# Execute your solution
escape_crater(rover)
`,
  },
  java: {
    label: 'Java',
    faction: 'Java Syndicate',
    color: '#f59e0b',
    icon: '☕',
    defaultCode: `// Mission: Navigate your rover out of the crater!
// Write code to make the rover climb upward.

public class Mission {
    public static boolean escapeCrater(Rover rover) {
        for (int i = 0; i < 5; i++) {
            rover.moveForward();
            rover.thrust(i * 2);
        }
        
        if (rover.getAltitude() > 10) {
            rover.sendSignal("ESCAPED!");
            return true;
        }
        return false;
    }
}
`,
  },
  cpp: {
    label: 'C++',
    faction: 'C++ Vanguard',
    color: '#ef4444',
    icon: '⚡',
    defaultCode: `// Mission: Navigate your rover out of the crater!
// Write code to make the rover climb upward.

#include "rover.h"

bool escapeCrater(Rover& rover) {
    for (int i = 0; i < 5; i++) {
        rover.moveForward();
        rover.thrust(i * 2);
    }
    
    if (rover.getAltitude() > 10) {
        rover.sendSignal("ESCAPED!");
        return true;
    }
    return false;
}
`,
  },
}

const MODES = [
  { id: 'blueprint', label: 'Blueprint', ages: '6-9', icon: '🧩' },
  { id: 'scaffold', label: 'Scaffold', ages: '10-15', icon: '🔧' },
  { id: 'terminal', label: 'Terminal', ages: '16+', icon: '💻' },
]

export default function GameDemo() {
  const [language, setLanguage] = useState('python')
  const [mode, setMode] = useState('scaffold')
  const [code, setCode] = useState(LANGUAGES.python.defaultCode)
  const [isRunning, setIsRunning] = useState(false)
  const [roverState, setRoverState] = useState({ phase: 'idle', step: 0 })
  const [scrap, setScrap] = useState(0)
  const [cores, setCores] = useState(0)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(true)
  const [consoleOutput, setConsoleOutput] = useState([])
  const canvasRef = useRef(null)

  // Draw game environment
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animFrame

    function resize() {
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
    }

    function drawScene() {
      const w = canvas.width
      const h = canvas.height

      // Clear
      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (let i = 0; i < 60; i++) {
        const x = (i * 137.508) % w
        const y = (i * 97.123) % h
        const size = (i % 3) + 1
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 5) * 0.14})`
        ctx.beginPath()
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Planet surface (crater)
      const craterY = h * 0.65
      ctx.fillStyle = '#1a1040'
      ctx.beginPath()
      ctx.moveTo(0, craterY)
      // crater shape
      ctx.quadraticCurveTo(w * 0.15, craterY - 20, w * 0.25, craterY + 30)
      ctx.quadraticCurveTo(w * 0.4, craterY + 80, w * 0.5, craterY + 60)
      ctx.quadraticCurveTo(w * 0.6, craterY + 80, w * 0.75, craterY + 30)
      ctx.quadraticCurveTo(w * 0.85, craterY - 20, w, craterY)
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      // Surface details
      ctx.strokeStyle = 'rgba(108, 60, 224, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        ctx.beginPath()
        const sx = w * 0.1 + i * w * 0.1
        const sy = craterY + 40 + (i % 3) * 15
        ctx.arc(sx, sy, 4 + (i % 4) * 3, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Rover
      const roverProgress = roverState.phase === 'running' ? roverState.step / 5 : 0
      const roverEscaped = roverState.phase === 'success'
      let roverX, roverY

      if (roverEscaped) {
        roverX = w * 0.5
        roverY = h * 0.15 + Math.sin(Date.now() * 0.003) * 10
      } else {
        roverX = w * 0.3 + roverProgress * w * 0.25
        roverY = craterY + 50 - roverProgress * (craterY * 0.5)
      }

      // Rover body
      ctx.save()
      ctx.translate(roverX, roverY)

      // wheels
      ctx.fillStyle = '#444'
      ctx.beginPath()
      ctx.arc(-12, 12, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(12, 12, 5, 0, Math.PI * 2)
      ctx.fill()

      // body
      ctx.fillStyle = '#6c3ce0'
      ctx.fillRect(-15, -5, 30, 15)
      ctx.fillStyle = '#a855f7'
      ctx.fillRect(-10, -12, 20, 10)

      // antenna
      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -12)
      ctx.lineTo(0, -22)
      ctx.stroke()
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(0, -22, 3, 0, Math.PI * 2)
      ctx.fill()

      // Thruster effect when running
      if (roverState.phase === 'running' || roverEscaped) {
        ctx.fillStyle = `rgba(245, 158, 11, ${0.5 + Math.random() * 0.5})`
        ctx.beginPath()
        ctx.moveTo(-8, 15)
        ctx.lineTo(8, 15)
        ctx.lineTo(0, 25 + Math.random() * 15)
        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()

      // Mission text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'center'

      if (roverState.phase === 'idle') {
        ctx.fillText('Press ▶ Execute to start the mission', w / 2, h - 30)
      } else if (roverState.phase === 'running') {
        ctx.fillStyle = '#f59e0b'
        ctx.fillText(`Executing... Step ${roverState.step}/5`, w / 2, h - 30)
      } else if (roverState.phase === 'success') {
        ctx.fillStyle = '#10b981'
        ctx.font = 'bold 14px Orbitron, sans-serif'
        ctx.fillText('🎉 MISSION COMPLETE!', w / 2, h - 30)
      }

      animFrame = requestAnimationFrame(drawScene)
    }

    resize()
    drawScene()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [roverState])

  function handleRun() {
    if (isRunning) return
    setIsRunning(true)
    setConsoleOutput([])
    setRoverState({ phase: 'running', step: 0 })

    const logs = [
      '> Compiling solution...',
      '> Initializing rover systems...',
      '> rover.move_forward() ✓',
      '> rover.thrust(power=0) ✓',
      '> rover.move_forward() ✓',
      '> rover.thrust(power=2) ✓',
      '> rover.move_forward() ✓',
      '> rover.thrust(power=4) ✓',
      '> Altitude check: 12 > 10 ✓',
      '> Signal sent: "ESCAPED!"',
      '> ✅ Mission Complete! +50 Scrap, +1 Cosmic Core',
    ]

    logs.forEach((log, i) => {
      setTimeout(() => {
        setConsoleOutput(prev => [...prev, log])
        if (i < 5) {
          setRoverState({ phase: 'running', step: Math.min(i + 1, 5) })
        }
      }, (i + 1) * 400)
    })

    setTimeout(() => {
      setRoverState({ phase: 'success', step: 5 })
      setScrap(prev => prev + 50)
      setCores(prev => prev + 1)
      setIsRunning(false)
    }, logs.length * 400 + 200)
  }

  function handleReset() {
    setRoverState({ phase: 'idle', step: 0 })
    setConsoleOutput([])
  }

  function handleLanguageChange(lang) {
    setLanguage(lang)
    setCode(LANGUAGES[lang].defaultCode)
    setShowLangDropdown(false)
    handleReset()
  }

  const langConfig = LANGUAGES[language]
  const monacoLang = language === 'cpp' ? 'cpp' : language

  return (
    <div className="game-demo">
      <StarField />

      {/* Top Bar */}
      <div className="game-demo__topbar">
        <div className="game-demo__mission">
          <Rocket size={16} className="game-demo__mission-icon" />
          <span className="game-demo__mission-text">
            Mission: Escape the Crater
          </span>
        </div>

        <div className="game-demo__controls">
          {/* Mode Switcher */}
          <div className="mode-switcher">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`mode-switcher__btn ${mode === m.id ? 'mode-switcher__btn--active' : ''}`}
                onClick={() => setMode(m.id)}
                title={`${m.label} (Ages ${m.ages})`}
              >
                <span className="mode-switcher__icon">{m.icon}</span>
                <span className="mode-switcher__label">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Rewards */}
          <div className="game-demo__rewards">
            <div className="reward-badge reward-badge--scrap">
              <Gem size={14} />
              <span>{scrap}</span>
            </div>
            <div className="reward-badge reward-badge--core">
              <Trophy size={14} />
              <span>{cores}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="game-demo__main">
        {/* Left: Code Editor */}
        <div className="game-demo__editor-panel">
          <div className="editor-header">
            <div className="lang-selector" onClick={() => setShowLangDropdown(!showLangDropdown)}>
              <span className="lang-selector__icon">{langConfig.icon}</span>
              <span className="lang-selector__label">{langConfig.label}</span>
              <ChevronDown size={14} />

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    className="lang-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {Object.entries(LANGUAGES).map(([key, val]) => (
                      <button
                        key={key}
                        className={`lang-dropdown__item ${language === key ? 'lang-dropdown__item--active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleLanguageChange(key) }}
                      >
                        <span>{val.icon}</span>
                        <span>{val.label}</span>
                        <span className="lang-dropdown__faction">{val.faction}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="editor-header__actions">
              <button
                className="editor-btn editor-btn--run"
                onClick={handleRun}
                disabled={isRunning}
              >
                <Play size={14} />
                <span>{isRunning ? 'Running...' : 'Execute'}</span>
              </button>
              <button className="editor-btn" onClick={handleReset}>
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="editor-body">
            {mode === 'blueprint' ? (
              <BlueprintEditor language={language} />
            ) : (
              <Editor
                height="100%"
                language={monacoLang}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  lineNumbers: mode === 'terminal' ? 'on' : 'off',
                  glyphMargin: false,
                  folding: mode === 'terminal',
                  renderLineHighlight: 'gutter',
                  overviewRulerBorder: false,
                  automaticLayout: true,
                }}
              />
            )}
          </div>

          {/* Console Output */}
          {consoleOutput.length > 0 && (
            <motion.div
              className="game-console"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
            >
              <div className="game-console__header">
                <Cpu size={12} />
                <span>Console Output</span>
              </div>
              <div className="game-console__body">
                {consoleOutput.map((line, i) => (
                  <motion.div
                    key={i}
                    className="game-console__line"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Game Environment */}
        <div className="game-demo__game-panel">
          <div className="game-panel-header">
            <span>🌌 Space Environment</span>
            <button className="game-panel-expand" title="Fullscreen (coming soon)">
              <Maximize2 size={14} />
            </button>
          </div>
          <div className="game-canvas-wrapper">
            <canvas ref={canvasRef} className="game-canvas" />
          </div>

          {/* Mentor Chat */}
          <div className={`game-demo__chat ${chatExpanded ? '' : 'game-demo__chat--collapsed'}`}>
            <button
              className="game-demo__chat-toggle"
              onClick={() => setChatExpanded(!chatExpanded)}
            >
              {chatExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>Mentor Droid</span>
            </button>
            {chatExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="game-demo__chat-body"
              >
                <MentorChat />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* Blueprint Mode - Drag & Drop blocks */
function BlueprintEditor({ language }) {
  const blocks = language === 'python'
    ? [
      { text: '🔁 for i in range(5):', color: 'green', indent: 0 },
      { text: '🤖 rover.move_forward()', color: 'blue', indent: 1 },
      { text: '🚀 rover.thrust(power=i*2)', color: 'purple', indent: 1 },
      { text: '❓ if rover.altitude > 10:', color: 'yellow', indent: 0 },
      { text: '📡 rover.send_signal("ESCAPED!")', color: 'cyan', indent: 1 },
    ]
    : language === 'java'
    ? [
      { text: '🔁 for (int i = 0; i < 5; i++)', color: 'green', indent: 0 },
      { text: '🤖 rover.moveForward()', color: 'blue', indent: 1 },
      { text: '🚀 rover.thrust(i * 2)', color: 'purple', indent: 1 },
      { text: '❓ if (rover.getAltitude() > 10)', color: 'yellow', indent: 0 },
      { text: '📡 rover.sendSignal("ESCAPED!")', color: 'cyan', indent: 1 },
    ]
    : [
      { text: '🔁 for (int i = 0; i < 5; i++)', color: 'green', indent: 0 },
      { text: '🤖 rover.moveForward()', color: 'blue', indent: 1 },
      { text: '🚀 rover.thrust(i * 2)', color: 'purple', indent: 1 },
      { text: '❓ if (rover.getAltitude() > 10)', color: 'yellow', indent: 0 },
      { text: '📡 rover.sendSignal("ESCAPED!")', color: 'cyan', indent: 1 },
    ]

  return (
    <div className="blueprint-editor">
      <p className="blueprint-editor__hint">
        🧩 Blueprint Mode — Drag blocks to build your solution
      </p>
      <div className="blueprint-editor__blocks">
        {blocks.map((block, i) => (
          <motion.div
            key={i}
            className={`bp-block bp-block--${block.color}`}
            style={{ marginLeft: block.indent * 32 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            draggable
          >
            {block.text}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
