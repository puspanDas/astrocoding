import { useState, useRef, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, RotateCcw, Rocket, Cpu, Trophy, Gem, BookOpen,
  ChevronDown, ChevronRight, Maximize2, Minimize2,
  Lightbulb, CheckCircle, AlertCircle, Sparkles, Target, Blocks, Code
} from 'lucide-react'
import MentorChat from '../components/MentorChat'
import AIAssistant from '../components/AIAssistant'
import StarField from '../components/StarField'
import BlocklyEditor from '../components/BlocklyEditor'
import { gameToolbox } from '../engine/blocks'
import GameRenderer from '../engine/GameRenderer'
import useCodeSandbox from '../engine/CodeSandbox'
import missions from '../engine/missions'
import { transpileToJS } from '../engine/transpiler'
import './GameDemo.css'

const LANGUAGES = {
  javascript: { label: 'JavaScript', icon: 'JS', faction: 'Core System' },
  python: { label: 'Python', icon: '🐍', faction: 'Python Federation' },
  java: { label: 'Java', icon: '☕', faction: 'Java Syndicate' },
  cpp: { label: 'C++', icon: '⚡', faction: 'C++ Vanguard' }
}

export default function GameDemo() {
  const [currentMission, setCurrentMission] = useState(0)
  const [language, setLanguage] = useState('javascript')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [codingMode, setCodingMode] = useState('text') // 'text' | 'blocks'
  const [blockCode, setBlockCode] = useState('')
  const [code, setCode] = useState(missions[0].starterCode.javascript)
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState([])
  const [scrap, setScrap] = useState(0)
  const [cores, setCores] = useState(0)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [missionSidebar, setMissionSidebar] = useState(true)
  const [hintIndex, setHintIndex] = useState(-1)
  const [missionResult, setMissionResult] = useState(null) // null | 'success' | 'fail'
  const [showMissionComplete, setShowMissionComplete] = useState(false)
  const [completedMissions, setCompletedMissions] = useState(new Set())
  const [showApiRef, setShowApiRef] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const rendererRef = useRef(null)
  const consoleEndRef = useRef(null)
  const { execute, ready } = useCodeSandbox()

  const mission = missions[currentMission]

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [consoleOutput])

  // Handle mission change
  function handleMissionChange(index) {
    setCurrentMission(index)
    setCode(missions[index].starterCode[language])
    setConsoleOutput([])
    setHintIndex(-1)
    setMissionResult(null)
    setShowMissionComplete(false)
    if (rendererRef.current) {
      rendererRef.current.reset(missions[index].terrain)
    }
  }

  // Handle language change
  function handleLanguageChange(lang) {
    setLanguage(lang)
    setCode(mission.starterCode[lang])
    setShowLangDropdown(false)
    setConsoleOutput([])
    setHintIndex(-1)
    setMissionResult(null)
    setShowMissionComplete(false)
    if (rendererRef.current) {
      rendererRef.current.reset(mission.terrain)
    }
  }

  // Handle code execution
  async function handleRun() {
    if (isRunning || !ready) return
    setIsRunning(true)
    setConsoleOutput([{ type: 'system', text: '⚙ Compiling your code...' }])
    setMissionResult(null)
    setShowMissionComplete(false)

    // Small delay for UX feel
    await new Promise(r => setTimeout(r, 300))

    const codeToRun = codingMode === 'blocks' ? blockCode : code;
    const jsCode = transpileToJS(codeToRun, language)
    const result = await execute(jsCode)

    // Build console output
    const output = [{ type: 'system', text: '⚙ Compiling your code...' }]

    if (result.error) {
      output.push({ type: 'error', text: `❌ Error: ${result.error.message}` })
      if (result.error.line) {
        output.push({ type: 'error', text: `   at line ${result.error.line}` })
      }
    }

    // Show command summary
    const commandTypes = result.commands.reduce((acc, cmd) => {
      if (cmd.type !== 'log' && cmd.type !== 'error') {
        acc[cmd.type] = (acc[cmd.type] || 0) + 1
      }
      return acc
    }, {})

    if (Object.keys(commandTypes).length > 0) {
      output.push({ type: 'system', text: '⚡ Executing commands...' })
      Object.entries(commandTypes).forEach(([type, count]) => {
        output.push({ type: 'info', text: `  ▸ ${type} × ${count}` })
      })
    }

    // Show console.log outputs
    result.logs.forEach(log => {
      output.push({ type: 'log', text: `> ${log}` })
    })

    setConsoleOutput(output)

    // Play animation on game renderer
    if (rendererRef.current && result.commands.length > 0) {
      rendererRef.current.reset(mission.terrain)
      setTimeout(() => {
        rendererRef.current.playCommands(result.commands, result.finalState)
      }, 100)
    }

    // Check mission success after animation completes
    setTimeout(() => {
      if (!result.error && mission.validateSuccess(result.finalState)) {
        setMissionResult('success')
        setShowMissionComplete(true)
        setConsoleOutput(prev => [...prev, { type: 'success', text: mission.successMessage }])

        if (!completedMissions.has(mission.id)) {
          setScrap(prev => prev + mission.reward.scrap)
          setCores(prev => prev + mission.reward.cores)
          setCompletedMissions(prev => new Set([...prev, mission.id]))
        }
      } else if (result.error) {
        setMissionResult('fail')
        setConsoleOutput(prev => [...prev,
          { type: 'hint', text: '💡 Tip: Check the error message above and fix your code!' }
        ])
      } else {
        setConsoleOutput(prev => [...prev,
          { type: 'info', text: '🔄 Mission objective not yet complete. Read the hints and try again!' }
        ])
      }
      setIsRunning(false)
    }, result.commands.length * 350 + 500)
  }

  // Reset to starter code
  function handleReset() {
    setCode(mission.starterCode[language])
    setResetKey(prev => prev + 1)
    setConsoleOutput([])
    setMissionResult(null)
    setHintIndex(-1)
    setShowMissionComplete(false)
    if (rendererRef.current) {
      rendererRef.current.reset(mission.terrain)
    }
  }

  // Show next hint
  function handleShowHint() {
    setHintIndex(prev => Math.min(prev + 1, mission.hints.length - 1))
  }

  const handleCommandsComplete = useCallback((finalState) => {
    // This is called when the renderer finishes playing all commands
  }, [])

  return (
    <div className="game-demo">
      <StarField />

      {/* ===== TOP BAR ===== */}
      <div className="game-demo__topbar">
        <div className="game-demo__mission-info">
          <Rocket size={16} className="game-demo__mission-icon" />
          <span className="game-demo__mission-title">{mission.icon} {mission.title}</span>
          {mission.difficulty > 0 && (
            <div className="game-demo__difficulty">
              {Array.from({ length: mission.difficulty }, (_, i) => (
                <Sparkles key={i} size={10} className="difficulty-star" />
              ))}
            </div>
          )}
        </div>

        <div className="game-demo__controls">
          {/* Concept Tags */}
          <div className="game-demo__concepts">
            {mission.concepts.map((c, i) => (
              <span key={i} className="concept-tag">{c}</span>
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

      {/* ===== MAIN LAYOUT ===== */}
      <div className="game-demo__main">

        {/* Mission Sidebar */}
        <AnimatePresence>
          {missionSidebar && (
            <motion.div
              className="mission-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mission-sidebar__header">
                <Target size={14} />
                <span>Missions</span>
              </div>
              <div className="mission-sidebar__list">
                {missions.map((m, i) => (
                  <button
                    key={m.id}
                    className={`mission-item ${currentMission === i ? 'mission-item--active' : ''} ${completedMissions.has(m.id) ? 'mission-item--complete' : ''}`}
                    onClick={() => handleMissionChange(i)}
                  >
                    <span className="mission-item__icon">{m.icon}</span>
                    <div className="mission-item__info">
                      <span className="mission-item__title">{m.title}</span>
                      {m.difficulty > 0 && (
                        <span className="mission-item__diff">
                          {'★'.repeat(m.difficulty)}{'☆'.repeat(4 - m.difficulty)}
                        </span>
                      )}
                      {m.difficulty === 0 && (
                        <span className="mission-item__diff free">Free Play</span>
                      )}
                    </div>
                    {completedMissions.has(m.id) && (
                      <CheckCircle size={14} className="mission-item__check" />
                    )}
                  </button>
                ))}
              </div>

              {/* Mission Brief */}
              <div className="mission-sidebar__brief">
                <p>{mission.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setMissionSidebar(!missionSidebar)}
          title={missionSidebar ? 'Hide missions' : 'Show missions'}
        >
          <ChevronRight size={14} style={{ transform: missionSidebar ? 'rotate(180deg)' : 'none' }} />
        </button>

        {/* Left: Code Editor */}
        <div className="game-demo__editor-panel">
          <div className="editor-header">
            <div className="editor-header__left">
              <div className="lang-selector" onClick={() => setShowLangDropdown(!showLangDropdown)}>
                <span className="lang-selector__icon">{LANGUAGES[language].icon}</span>
                <span className="lang-selector__label">{LANGUAGES[language].label}</span>
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
              <button
                className="editor-btn editor-btn--ref"
                onClick={() => setShowApiRef(!showApiRef)}
                title="API Reference"
              >
                <BookOpen size={13} />
                <span>API</span>
              </button>
              <button
                className={`editor-btn ${codingMode === 'blocks' ? 'active' : ''}`}
                onClick={() => setCodingMode(codingMode === 'blocks' ? 'text' : 'blocks')}
                title="Toggle Block Coding"
                style={{ marginLeft: '8px', background: codingMode === 'blocks' ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}
              >
                <Blocks size={13} />
                <span style={{ color: codingMode === 'blocks' ? '#a855f7' : '' }}>Blocks Mode</span>
              </button>
            </div>

            <div className="editor-header__actions">
              <button
                className="editor-btn editor-btn--hint"
                onClick={handleShowHint}
                disabled={hintIndex >= mission.hints.length - 1}
                title="Get a hint"
              >
                <Lightbulb size={14} />
                <span>Hint</span>
              </button>
              <button
                className="editor-btn editor-btn--run"
                onClick={handleRun}
                disabled={isRunning || !ready}
              >
                <Play size={14} />
                <span>{isRunning ? 'Running...' : 'Execute'}</span>
              </button>
              <button className="editor-btn" onClick={handleReset} title="Reset code">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* API Reference Dropdown */}
          <AnimatePresence>
            {showApiRef && (
              <motion.div
                className="api-reference"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="api-reference__content">
                  <div className="api-ref-group">
                    <h4>🤖 Movement</h4>
                    <code>rover.moveForward(distance)</code>
                    <code>rover.moveUp(distance)</code>
                    <code>rover.moveDown(distance)</code>
                    <code>rover.turnRight()</code>
                  </div>
                  <div className="api-ref-group">
                    <h4>🚀 Actions</h4>
                    <code>rover.thrust(power)</code>
                    <code>rover.boost()</code>
                    <code>rover.shoot()</code>
                    <code>rover.collect()</code>
                  </div>
                  <div className="api-ref-group">
                    <h4>📡 Info</h4>
                    <code>rover.getX() / getY()</code>
                    <code>rover.getScore()</code>
                    <code>rover.sendSignal(msg)</code>
                    <code>rover.setColor(hex)</code>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hints */}
          <AnimatePresence>
            {hintIndex >= 0 && (
              <motion.div
                className="hint-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {mission.hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <div key={i} className="hint-panel__item">{hint}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor Body */}
          <div className="editor-body">
            {codingMode === 'blocks' ? (
              <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <BlocklyEditor
                    toolbox={gameToolbox}
                    language={language}
                    onChange={setBlockCode}
                  />
                </div>
                <div style={{ width: '35%', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
                  <div style={{ padding: '8px 12px', fontSize: '0.75rem', color: '#a1a1aa', borderBottom: '1px solid var(--glass-border)', background: 'rgba(10, 14, 39, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Code size={14} /> Generated Code</div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280', fontStyle: 'italic' }}>Click "Execute" to run</div>
                  </div>
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language}
                    value={blockCode}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily: "'Fira Code', 'Courier New', monospace",
                      scrollBeyondLastLine: false,
                      padding: { top: 16 },
                      wordWrap: 'on'
                    }}
                  />
                </div>
              </div>
            ) : (
              <Editor
                height="100%"
                key={`editor-${currentMission}-${language}-${resetKey}`}
                defaultLanguage={language === 'cpp' ? 'cpp' : language}
                defaultValue={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  lineNumbers: 'on',
                  glyphMargin: false,
                  folding: true,
                  renderLineHighlight: 'gutter',
                  overviewRulerBorder: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                }}
              />
            )}
          </div>

          {/* Console Output */}
          <div className={`game-console ${consoleOutput.length > 0 ? 'game-console--visible' : ''}`}>
            <div className="game-console__header">
              <Cpu size={12} />
              <span>Console Output</span>
              {consoleOutput.length > 0 && (
                <button
                  className="game-console__clear"
                  onClick={() => setConsoleOutput([])}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="game-console__body">
              {consoleOutput.map((line, i) => (
                <motion.div
                  key={i}
                  className={`game-console__line game-console__line--${line.type}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {line.type === 'error' && <AlertCircle size={11} />}
                  {line.type === 'success' && <CheckCircle size={11} />}
                  {line.text}
                </motion.div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Game Environment */}
        <div className="game-demo__game-panel">
          <div className="game-panel-header">
            <span>🌌 Space Environment</span>
            <span className="game-panel-header__terrain">{mission.terrain}</span>
          </div>
          <div className="game-canvas-wrapper">
            <GameRenderer
              ref={rendererRef}
              terrain={mission.terrain}
              onCommandsComplete={handleCommandsComplete}
            />
          </div>

          {/* Mission Complete Overlay */}
          <AnimatePresence>
            {showMissionComplete && (
              <motion.div
                className="mission-complete-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="mission-complete-card"
                  initial={{ scale: 0.5, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <div className="mission-complete__icon">🎉</div>
                  <h3>Mission Complete!</h3>
                  <p>{mission.successMessage}</p>
                  <div className="mission-complete__rewards">
                    <span className="reward-earn"><Gem size={16} /> +{mission.reward.scrap} Scrap</span>
                    {mission.reward.cores > 0 && (
                      <span className="reward-earn reward-earn--core"><Trophy size={16} /> +{mission.reward.cores} Core</span>
                    )}
                  </div>
                  <div className="mission-complete__actions">
                    {currentMission < missions.length - 1 && (
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setShowMissionComplete(false)
                          handleMissionChange(currentMission + 1)
                        }}
                      >
                        Next Mission <ChevronRight size={16} />
                      </button>
                    )}
                    <button
                      className="btn-secondary"
                      onClick={() => setShowMissionComplete(false)}
                    >
                      Keep Playing
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
      <AIAssistant />
    </div>
  )
}
