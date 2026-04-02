import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkipBack, SkipForward, StepBack, StepForward, Play, Pause, Clock, X } from 'lucide-react'
import './TimeTravelDebugger.css'

const CMD_ICONS = {
  move:     '➡️',
  thrust:   '🚀',
  boost:    '⚡',
  collect:  '💎',
  shoot:    '🔫',
  signal:   '📡',
  setColor: '🎨',
  turn:     '↩️',
  log:      '📝',
  error:    '❌',
}

function describeCmd(cmd) {
  switch (cmd.type) {
    case 'move':
      if (cmd.dx > 0) return `moveForward(${cmd.dx})`
      if (cmd.dy < 0) return `moveUp(${Math.abs(cmd.dy)})`
      if (cmd.dy > 0) return `moveDown(${cmd.dy})`
      return 'move'
    case 'thrust':   return `thrust(power → lift ${cmd.lift})`
    case 'boost':    return 'boost()'
    case 'collect':  return `collect() at (${cmd.atX}, ${cmd.atY})`
    case 'shoot':    return 'shoot()'
    case 'signal':   return `sendSignal("${cmd.message}")`
    case 'setColor': return `setColor("${cmd.color}")`
    case 'turn':     return `turnRight()`
    case 'log':      return `log: ${cmd.message}`
    case 'error':    return `error: ${cmd.error?.message}`
    default:         return cmd.type
  }
}

export default function TimeTravelDebugger({ commands, snapshots, onStep, onClose, language }) {
  const [step, setStep] = useState(-1)   // -1 = initial state (before any command)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef(null)
  const listRef = useRef(null)

  const total = commands.length

  const goToStep = useCallback((s) => {
    const clamped = Math.max(-1, Math.min(s, total - 1))
    setStep(clamped)
    onStep(clamped)
  }, [total, onStep])

  // Auto-scroll active step into view
  useEffect(() => {
    if (!listRef.current) return
    const active = listRef.current.querySelector('.ttd-step--active')
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [step])

  // Playback
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep(prev => {
          const next = prev + 1
          if (next >= total) {
            setPlaying(false)
            onStep(total - 1)
            return total - 1
          }
          onStep(next)
          return next
        })
      }, 600)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, total, onStep])

  const snapshot = step >= 0 ? snapshots[step] : { x: 60, y: 300, color: '#a855f7', score: 0, signalsSent: 0 }

  return (
    <motion.div
      className="ttd"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="ttd__header">
        <div className="ttd__title">
          <Clock size={14} />
          <span>Time-Travel Debugger</span>
          <span className="ttd__lang-badge">{language === 'python' ? '🐍 Python' : 'JS JavaScript'}</span>
        </div>
        <button className="ttd__close" onClick={onClose}><X size={14} /></button>
      </div>

      {/* State snapshot */}
      <div className="ttd__state">
        <div className="ttd__state-item"><span>Step</span><strong>{step === -1 ? 'Start' : `${step + 1} / ${total}`}</strong></div>
        <div className="ttd__state-item"><span>X</span><strong>{snapshot.x}</strong></div>
        <div className="ttd__state-item"><span>Y</span><strong>{snapshot.y}</strong></div>
        <div className="ttd__state-item"><span>Score</span><strong>{snapshot.score}</strong></div>
        <div className="ttd__state-item">
          <span>Color</span>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="ttd__color-dot" style={{ background: snapshot.color }} />
            {snapshot.color}
          </strong>
        </div>
      </div>

      {/* Scrubber */}
      <div className="ttd__scrubber">
        <input
          type="range"
          min={-1}
          max={total - 1}
          value={step}
          onChange={e => { setPlaying(false); goToStep(Number(e.target.value)) }}
          className="ttd__slider"
        />
      </div>

      {/* Controls */}
      <div className="ttd__controls">
        <button className="ttd__btn" onClick={() => { setPlaying(false); goToStep(-1) }} title="Jump to start"><SkipBack size={15} /></button>
        <button className="ttd__btn" onClick={() => { setPlaying(false); goToStep(step - 1) }} disabled={step <= -1} title="Previous step"><StepBack size={15} /></button>
        <button className="ttd__btn ttd__btn--play" onClick={() => { if (step >= total - 1) goToStep(-1); setPlaying(p => !p) }} title={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="ttd__btn" onClick={() => { setPlaying(false); goToStep(step + 1) }} disabled={step >= total - 1} title="Next step"><StepForward size={15} /></button>
        <button className="ttd__btn" onClick={() => { setPlaying(false); goToStep(total - 1) }} title="Jump to end"><SkipForward size={15} /></button>
      </div>

      {/* Command list */}
      <div className="ttd__list" ref={listRef}>
        <div
          className={`ttd-step ttd-step--init ${step === -1 ? 'ttd-step--active' : ''}`}
          onClick={() => { setPlaying(false); goToStep(-1) }}
        >
          <span className="ttd-step__num">0</span>
          <span className="ttd-step__icon">🏁</span>
          <span className="ttd-step__desc">Initial state</span>
        </div>
        {commands.map((cmd, i) => (
          <div
            key={i}
            className={`ttd-step ${i === step ? 'ttd-step--active' : ''} ${i < step ? 'ttd-step--done' : ''} ttd-step--${cmd.type}`}
            onClick={() => { setPlaying(false); goToStep(i) }}
          >
            <span className="ttd-step__num">{i + 1}</span>
            <span className="ttd-step__icon">{CMD_ICONS[cmd.type] || '▸'}</span>
            <span className="ttd-step__desc">{describeCmd(cmd)}</span>
            {i === step && (
              <span className="ttd-step__cursor">◀</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
