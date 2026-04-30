import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, RotateCcw, Bug, ChevronDown, BookOpen,
  CheckCircle, AlertCircle, Save, Clock
} from 'lucide-react'
import StarField from '../components/StarField'
import GameRenderer from '../engine/GameRenderer'
import useCodeSandbox from '../engine/CodeSandbox'
import qaMissions from '../engine/qaMissions'
import { transpileToJS } from '../engine/transpiler'
import './QAFeatureLab.css'

const LANGUAGES = {
  javascript: { label: 'JavaScript', icon: 'JS' },
  python: { label: 'Python', icon: '🐍' }
}

export default function QAFeatureLab() {
  const mission = qaMissions[0] // Load the buggy tester scenario
  
  const [language, setLanguage] = useState('javascript')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [code, setCode] = useState(mission.starterCode['javascript'])
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState([])
  const [missionResult, setMissionResult] = useState(null)
  const [showMissionComplete, setShowMissionComplete] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const rendererRef = useRef(null)
  const consoleEndRef = useRef(null)
  const { execute, ready } = useCodeSandbox()

  // Auto-scroll console
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [consoleOutput])

  function handleLanguageChange(lang) {
    setLanguage(lang)
    setCode(mission.starterCode[lang])
    setResetKey(prev => prev + 1)
    setShowLangDropdown(false)
    setConsoleOutput([])
    setMissionResult(null)
    setShowMissionComplete(false)
    if (rendererRef.current) {
      rendererRef.current.reset(mission.terrain)
    }
  }

  async function handleRun() {
    if (isRunning || !ready) return
    setIsRunning(true)
    setConsoleOutput([{ type: 'system', text: '⚙ Compiling QA code...' }])
    setMissionResult(null)
    setShowMissionComplete(false)

    await new Promise(r => setTimeout(r, 300))

    const jsCode = transpileToJS(code, language)
    const result = await execute(jsCode)

    const output = [{ type: 'system', text: '⚙ Compiling QA code...' }]

    if (result.error) {
      output.push({ type: 'error', text: `❌ Error: ${result.error.message}` })
    }

    const commandTypes = result.commands.reduce((acc, cmd) => {
      if (cmd.type !== 'log' && cmd.type !== 'error') {
        acc[cmd.type] = (acc[cmd.type] || 0) + 1
      }
      return acc
    }, {})

    if (Object.keys(commandTypes).length > 0) {
      output.push({ type: 'system', text: '⚡ Executing commands...' })
    }

    result.logs.forEach(log => {
      output.push({ type: 'log', text: `> ${log}` })
    })

    setConsoleOutput(output)

    if (rendererRef.current && result.commands.length > 0) {
      rendererRef.current.reset(mission.terrain)
      setTimeout(() => {
        rendererRef.current.playCommands(result.commands, result.finalState)
      }, 100)
    }

    const animDuration = result.commands.length * 55 + 800
    setTimeout(() => {
      if (!result.error && mission.validateSuccess(result.finalState)) {
        setMissionResult('success')
        setShowMissionComplete(true)
        setConsoleOutput(prev => [...prev, { type: 'success', text: mission.successMessage }])
      } else if (result.error) {
        setMissionResult('fail')
        setConsoleOutput(prev => [...prev,
          { type: 'error', text: 'QA Test Failed: Check the error message.' }
        ])
      } else {
        setConsoleOutput(prev => [...prev,
          { type: 'error', text: 'QA Test Failed: Objective not completed.' }
        ])
      }
      setIsRunning(false)
    }, animDuration)
  }

  function handleReset() {
    setCode(mission.starterCode[language])
    setResetKey(prev => prev + 1)
    setConsoleOutput([])
    setMissionResult(null)
    setShowMissionComplete(false)
    if (rendererRef.current) {
      rendererRef.current.reset(mission.terrain)
    }
  }

  return (
    <div className="qa-lab">
      <StarField />

      <div className="qa-lab__topbar">
        <div className="qa-lab__title">
          <Bug size={18} className="text-red-400" />
          <span>QA Feature Lab - Testers Only</span>
        </div>
      </div>

      <div className="qa-lab__main">
        {/* Left: Code Editor */}
        <div className="qa-lab__editor-panel">
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
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="editor-header__actions">
              <button
                className="editor-btn editor-btn--run"
                onClick={handleRun}
                disabled={isRunning || !ready}
              >
                <Play size={14} />
                <span>{isRunning ? 'Running Test...' : 'Run QA Test'}</span>
              </button>
              <button className="editor-btn" onClick={handleReset} title="Reset code">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="editor-body qa-editor-body">
            <Editor
              height="100%"
              key={`qa-editor-${language}-${resetKey}`}
              defaultLanguage={language}
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
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Console Output */}
          <div className={`game-console ${consoleOutput.length > 0 ? 'game-console--visible' : ''}`}>
            <div className="game-console__header">
              <span>QA Output Logs</span>
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
                <div key={i} className={`game-console__line game-console__line--${line.type}`}>
                  {line.type === 'error' && <AlertCircle size={11} />}
                  {line.type === 'success' && <CheckCircle size={11} />}
                  {line.text}
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Game Environment */}
        <div className="qa-lab__game-panel">
          <div className="qa-panel-header">
            <span>Test Environment: {mission.terrain}</span>
          </div>
          
          <div className="qa-canvas-wrapper">
            <GameRenderer
              ref={rendererRef}
              terrain={mission.terrain}
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
                  <div className="mission-complete__icon">✅</div>
                  <h3>QA Test Passed!</h3>
                  <p>{mission.successMessage}</p>
                  <div className="mission-complete__actions">
                    <button
                      className="btn-primary"
                      onClick={() => setShowMissionComplete(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
