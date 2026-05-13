import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, ChevronRight, CheckCircle, Circle, Sparkles, Lightbulb,
  Trash2, Link2, RotateCcw, Send, Award, Target, X,
  Play, Pause, Square, SkipForward, ZoomIn, ZoomOut, Maximize2,
  Undo2, Redo2, Download
} from 'lucide-react'
import {
  CIRCUIT_CATEGORIES, CIRCUIT_COMPONENT_MAP, circuitScenarios,
  validateCircuit, generateCircuitFlowSteps, analyzeCircuitDesign, testCircuitIntegrity
} from '../engine/circuitComponents'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import CircuitCanvas from '../components/CircuitCanvas'
import CircuitAIPanel from '../components/CircuitAIPanel'
import './CircuitLab.css'

let nextId = 1

export default function CircuitLab() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completed, setCompleted] = useState(() => {
    try { const r = localStorage.getItem('astro-circuit-progress'); return r ? new Set(JSON.parse(r)) : new Set() }
    catch { return new Set() }
  })

  const [placed, setPlaced] = useState([])
  const [conns, setConns] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [connectMode, setConnectMode] = useState(false)
  const [connectFrom, setConnectFrom] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const [validationResult, setValidationResult] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hintIndex, setHintIndex] = useState(-1)
  const [totalScore, setTotalScore] = useState(() => {
    try { return parseInt(localStorage.getItem('astro-circuit-score') || '0', 10) } catch { return 0 }
  })

  const [simulating, setSimulating] = useState(false)
  const [simPaused, setSimPaused] = useState(false)
  const [simSteps, setSimSteps] = useState([])
  const [simStep, setSimStep] = useState(-1)
  const [simActiveConn, setSimActiveConn] = useState(-1)
  const [simActiveFromId, setSimActiveFromId] = useState(null)
  const [simActiveToId, setSimActiveToId] = useState(null)
  const simTimer = useRef(null)

  const [zoomLevel, setZoomLevel] = useState(1)

  // Fault test state
  const [testResult, setTestResult] = useState(null)
  const [faultyConns, setFaultyConns] = useState([])

  // Undo/Redo
  const undoStack = useRef([])
  const redoStack = useRef([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const stateRef = useRef({ placed: [], conns: [] })

  const scenario = circuitScenarios[currentScenario]

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem('astro-circuit-progress', JSON.stringify([...completed]))
      localStorage.setItem('astro-circuit-score', String(totalScore))
    } catch {}
  }, [completed, totalScore])

  useEffect(() => { stateRef.current = { placed, conns } }, [placed, conns])

  // Live validation
  useEffect(() => {
    if (scenario.requiredComponents.length > 0 || placed.length > 0) {
      setValidationResult(validateCircuit(scenario, placed, conns))
    }
  }, [placed, conns, scenario])

  function saveSnap() {
    const c = stateRef.current
    undoStack.current.push({ placed: JSON.parse(JSON.stringify(c.placed)), conns: JSON.parse(JSON.stringify(c.conns)) })
    if (undoStack.current.length > 50) undoStack.current.shift()
    redoStack.current = []
    setCanUndo(true); setCanRedo(false)
  }

  function undo() {
    if (!undoStack.current.length) return
    const c = stateRef.current
    redoStack.current.push({ placed: JSON.parse(JSON.stringify(c.placed)), conns: JSON.parse(JSON.stringify(c.conns)) })
    const prev = undoStack.current.pop()
    setPlaced(prev.placed); setConns(prev.conns); stateRef.current = prev
    setCanUndo(undoStack.current.length > 0); setCanRedo(true)
  }

  function redo() {
    if (!redoStack.current.length) return
    const c = stateRef.current
    undoStack.current.push({ placed: JSON.parse(JSON.stringify(c.placed)), conns: JSON.parse(JSON.stringify(c.conns)) })
    const n = redoStack.current.pop()
    setPlaced(n.placed); setConns(n.conns); stateRef.current = n
    setCanUndo(true); setCanRedo(redoStack.current.length > 0)
  }

  function switchScenario(i) {
    stopSim()
    setCurrentScenario(i); setPlaced([]); setConns([]); setSelectedId(null)
    setConnectMode(false); setConnectFrom(null); setValidationResult(null)
    setShowSuccess(false); setHintIndex(-1)
    setTestResult(null); setFaultyConns([])
  }

  // Simulation
  function startSim() {
    const steps = generateCircuitFlowSteps(placed, conns)
    if (!steps.length) return
    setConnectMode(false); setConnectFrom(null)
    setSimSteps(steps); setSimStep(0); setSimulating(true); setSimPaused(false)
    setSimActiveConn(steps[0].connIndex); setSimActiveFromId(steps[0].fromId); setSimActiveToId(steps[0].toId)
  }

  function stopSim() {
    if (simTimer.current) clearTimeout(simTimer.current)
    setSimulating(false); setSimPaused(false); setSimSteps([]); setSimStep(-1)
    setSimActiveConn(-1); setSimActiveFromId(null); setSimActiveToId(null)
  }

  useEffect(() => {
    if (!simulating || simPaused || !simSteps.length) return
    simTimer.current = setTimeout(() => {
      setSimStep(p => (p + 1) >= simSteps.length ? 0 : p + 1)
    }, 1800)
    return () => { if (simTimer.current) clearTimeout(simTimer.current) }
  }, [simulating, simPaused, simStep, simSteps.length])

  useEffect(() => {
    if (simStep >= 0 && simStep < simSteps.length) {
      const s = simSteps[simStep]
      setSimActiveConn(s.connIndex); setSimActiveFromId(s.fromId); setSimActiveToId(s.toId)
    }
  }, [simStep, simSteps])

  // Drag from palette
  function handleDragStart(e, type) {
    e.dataTransfer.setData('componentType', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  function handleCanvasDrop(type, x, y) {
    saveSnap()
    const comp = { id: `ccomp-${nextId++}`, type, x, y, value: CIRCUIT_COMPONENT_MAP[type]?.defaultValue || '' }
    setPlaced(p => [...p, comp]); setSelectedId(comp.id); setDragOver(false)
  }

  // Move placed component
  function handleComponentMouseDown(e, compId) {
    // In connect mode, handle wiring via click — don't start drag
    if (connectMode) {
      e.stopPropagation()
      e.preventDefault()
      handleConnectionClick(compId)
      return
    }
    e.stopPropagation()
    e.preventDefault()
    setSelectedId(compId)
    const comp = placed.find(c => c.id === compId)
    if (!comp) return
    saveSnap()
    setDraggingId(compId)
    const handleMove = (me) => {
      setPlaced(p => p.map(c => {
        if (c.id !== compId) return c
        const canvas = document.querySelector('.circuit__canvas')
        if (!canvas) return c
        const rect = canvas.getBoundingClientRect()
        const sL = canvas.scrollLeft, sT = canvas.scrollTop
        const nx = Math.round(((me.clientX - rect.left + sL) / zoomLevel - 45) / 40) * 40
        const ny = Math.round(((me.clientY - rect.top + sT) / zoomLevel - 30) / 40) * 40
        return { ...c, x: Math.max(0, nx), y: Math.max(0, ny) }
      }))
    }
    const handleUp = () => { setDraggingId(null); window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp) }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  function handleConnectionClick(compId) {
    if (!connectMode) return
    if (!connectFrom) { setConnectFrom(compId) }
    else if (connectFrom !== compId) {
      const exists = conns.some(c => (c.from === connectFrom && c.to === compId) || (c.from === compId && c.to === connectFrom))
      if (!exists) { saveSnap(); setConns(p => [...p, { from: connectFrom, to: compId }]) }
      setConnectFrom(null)
    } else { setConnectFrom(null) }
  }

  function removeConn(i) { saveSnap(); setConns(p => p.filter((_, idx) => idx !== i)) }
  function removeComp(id) {
    saveSnap()
    setPlaced(p => p.filter(c => c.id !== id))
    setConns(p => p.filter(c => c.from !== id && c.to !== id))
    if (selectedId === id) setSelectedId(null)
    if (connectFrom === id) setConnectFrom(null)
  }

  function clearCanvas() {
    if (placed.length || conns.length) saveSnap()
    stopSim(); setPlaced([]); setConns([]); setSelectedId(null); setConnectFrom(null)
    setValidationResult(null); setShowSuccess(false); setHintIndex(-1)
    setTestResult(null); setFaultyConns([])
  }

  function handleTestCircuit() {
    const result = testCircuitIntegrity(placed, conns)
    setTestResult(result)
    setFaultyConns(result.faultyConnIndices || [])
  }

  function handleSubmit() {
    const result = validateCircuit(scenario, placed, conns)
    setValidationResult(result); setShowSuccess(true)
    if (result.passed && !completed.has(scenario.id)) {
      setCompleted(p => new Set([...p, scenario.id]))
      setTotalScore(p => p + result.score)
    }
  }

  function handleExport() {
    if (!placed.length) return
    let txt = `Circuit Design Export\n=====================\nScenario: ${scenario.title}\n\n--- COMPONENTS ---\n`
    placed.forEach((c, i) => { const d = CIRCUIT_COMPONENT_MAP[c.type]; txt += `${i + 1}. ${d?.label} (${c.value || d?.defaultValue || ''})\n` })
    txt += `\n--- CONNECTIONS ---\n`
    conns.forEach((c, i) => {
      const f = placed.find(p => p.id === c.from), t = placed.find(p => p.id === c.to)
      if (f && t) txt += `${i + 1}. ${CIRCUIT_COMPONENT_MAP[f.type]?.label} → ${CIRCUIT_COMPONENT_MAP[t.type]?.label}\n`
    })
    const blob = new Blob([txt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `circuit_${scenario.id}.txt`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  return (
    <div className="circuit-lab">
      {/* TOP BAR */}
      <div className="circuit__topbar">
        <div className="circuit__topbar-left">
          <Cpu size={16} className="circuit__topbar-icon" />
          <span className="circuit__topbar-title">{scenario.icon} {scenario.title}</span>
          {scenario.difficulty > 0 && (
            <div className="circuit__topbar-diff">
              {Array.from({ length: scenario.difficulty }, (_, i) => <Sparkles key={i} size={10} className="difficulty-star" />)}
            </div>
          )}
        </div>
        <div className="circuit__topbar-right">
          {placed.length > 0 && (
            <div className="circuit__live-counter">
              <span className="circuit__live-counter-item"><Cpu size={11} /><span>{placed.length}</span></span>
              <span className="circuit__live-counter-divider">·</span>
              <span className="circuit__live-counter-item"><Link2 size={11} /><span>{conns.length}</span></span>
            </div>
          )}
          <div className="circuit__score-badge"><Award size={14} /><span>{totalScore} pts</span></div>
        </div>
      </div>

      {/* MAIN */}
      <div className="circuit__main">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div className="circuit__sidebar" initial={{ width: 0, opacity: 0 }} animate={{ width: 210, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="circuit__sidebar-header"><Target size={14} /><span>Scenarios</span></div>
              <div className="circuit__sidebar-list">
                {circuitScenarios.map((s, i) => (
                  <button key={s.id}
                    className={`circuit__scenario-item ${currentScenario === i ? 'circuit__scenario-item--active' : ''} ${completed.has(s.id) ? 'circuit__scenario-item--complete' : ''}`}
                    onClick={() => switchScenario(i)}>
                    <span className="circuit__scenario-icon">{s.icon}</span>
                    <div className="circuit__scenario-info">
                      <span className="circuit__scenario-title">{s.title}</span>
                      <span className={`circuit__scenario-diff ${s.difficulty === 0 ? 'free' : ''}`}>
                        {s.difficulty === 0 ? 'Sandbox' : '★'.repeat(s.difficulty) + '☆'.repeat(5 - s.difficulty)}
                      </span>
                    </div>
                    {completed.has(s.id) && <CheckCircle size={14} className="circuit__scenario-check" />}
                  </button>
                ))}
              </div>
              <div className="circuit__sidebar-brief"><p>{scenario.description}</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="circuit__sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <ChevronRight size={14} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {/* WORKSPACE */}
        <div className="circuit__workspace">
          {/* Palette */}
          <div className="circuit__palette">
            <div className="circuit__palette-inner">
              {CIRCUIT_CATEGORIES.map(cat => (
                <div key={cat.id} className="circuit__palette-group">
                  <span className="circuit__palette-label">{cat.label}</span>
                  {cat.components.map(comp => (
                    <div key={comp.type} className="circuit__palette-item" draggable
                      onDragStart={(e) => handleDragStart(e, comp.type)} title={comp.desc}
                      style={{ borderColor: `${comp.color}33` }}>
                      <span className="circuit__palette-item-icon">{comp.icon}</span>
                      <span>{comp.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="circuit__toolbar">
            <button className={`circuit__tool-btn ${connectMode ? 'circuit__tool-btn--active' : ''}`}
              onClick={() => { setConnectMode(!connectMode); setConnectFrom(null) }}>
              <Link2 size={13} /> Wire
            </button>
            <div className="circuit__tool-divider" />
            <button className="circuit__tool-btn" onClick={undo} disabled={!canUndo}><Undo2 size={13} /></button>
            <button className="circuit__tool-btn" onClick={redo} disabled={!canRedo}><Redo2 size={13} /></button>
            <div className="circuit__tool-divider" />
            <button className="circuit__tool-btn" onClick={() => setZoomLevel(p => Math.min(p + 0.15, 2.5))}><ZoomIn size={13} /></button>
            <span className="circuit__zoom-label">{Math.round(zoomLevel * 100)}%</span>
            <button className="circuit__tool-btn" onClick={() => setZoomLevel(p => Math.max(p - 0.15, 0.3))}><ZoomOut size={13} /></button>
            <button className="circuit__tool-btn" onClick={() => setZoomLevel(1)}><Maximize2 size={13} /></button>
            <div className="circuit__tool-divider" />
            {!simulating ? (
              <button className="circuit__tool-btn" onClick={startSim} disabled={conns.length === 0}><Play size={13} /> Simulate</button>
            ) : (
              <>
                <button className="circuit__tool-btn" onClick={() => setSimPaused(p => !p)}>{simPaused ? <Play size={13} /> : <Pause size={13} />}</button>
                <button className="circuit__tool-btn" onClick={() => setSimStep(p => (p + 1) >= simSteps.length ? 0 : p + 1)}><SkipForward size={13} /></button>
                <button className="circuit__tool-btn circuit__tool-btn--danger" onClick={stopSim}><Square size={13} /> Stop</button>
              </>
            )}
            <div className="circuit__tool-divider" />
            <button className={`circuit__tool-btn ${testResult ? (testResult.passed ? 'circuit__tool-btn--success' : 'circuit__tool-btn--danger') : ''}`}
              onClick={handleTestCircuit} disabled={placed.length === 0}>
              <ShieldCheck size={13} /> Test Circuit
            </button>
            <div className="circuit__tool-divider" />
            <button className="circuit__tool-btn" onClick={handleExport} disabled={placed.length === 0}><Download size={13} /></button>
            <button className="circuit__tool-btn circuit__tool-btn--danger" onClick={clearCanvas}><Trash2 size={13} /> Clear</button>
            <div style={{ flex: 1 }} />
            {scenario.requiredComponents.length > 0 && (
              <button className="circuit__tool-btn circuit__tool-btn--success" onClick={handleSubmit}>
                <CheckCircle size={13} /> Submit
              </button>
            )}
          </div>

          {/* Canvas + AI Panel */}
          <div className="circuit__canvas-container">
            <CircuitCanvas
              placedComponents={placed} connections={conns} selectedId={selectedId}
              connectMode={connectMode} connectFrom={connectFrom} zoomLevel={zoomLevel}
              dragOver={dragOver} simActiveConn={simActiveConn} simActiveFromId={simActiveFromId}
              simActiveToId={simActiveToId} faultyConns={faultyConns}
              onCanvasDrop={handleCanvasDrop}
              onCanvasDragOver={() => setDragOver(true)} onCanvasDragLeave={() => setDragOver(false)}
              onCanvasClick={() => { setSelectedId(null); if (connectMode && connectFrom) setConnectFrom(null) }}
              onComponentMouseDown={handleComponentMouseDown}
              onRemoveComponent={removeComp} onRemoveConnection={removeConn}
            />
            <CircuitAIPanel
              scenario={scenario} placedComponents={placed} connections={conns}
              validationResult={validationResult} hintIndex={hintIndex}
              testResult={testResult}
              onRevealHint={(i) => setHintIndex(i)}
            />
          </div>

          {/* Sim bar */}
          {simulating && simStep >= 0 && simStep < simSteps.length && (
            <div className="circuit__sim-bar">
              <div className="circuit__sim-step">
                <strong>Step {simStep + 1}/{simSteps.length}:</strong> {simSteps[simStep].description}
              </div>
            </div>
          )}

          {/* Test Result Banner */}
          {testResult && (
            <div className={`circuit__test-banner ${testResult.passed ? 'circuit__test-banner--pass' : 'circuit__test-banner--fail'}`}>
              <div className="circuit__test-banner-header">
                <span className="circuit__test-banner-status">
                  {testResult.passed ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                  <strong>{testResult.status}</strong>
                </span>
                <button className="circuit__test-banner-close" onClick={() => { setTestResult(null); setFaultyConns([]) }}>✕</button>
              </div>
              {testResult.faults.length > 0 && (
                <div className="circuit__test-faults">
                  {testResult.faults.map((f, i) => (
                    <div key={i} className={`circuit__test-fault circuit__test-fault--${f.severity}`}>{f.message}</div>
                  ))}
                </div>
              )}
              {testResult.passed && testResult.faults.length === 0 && (
                <div className="circuit__test-fault circuit__test-fault--success">✅ All connections are valid. No faults detected. Circuit is ready to simulate!</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && validationResult && (
          <motion.div className="circuit__success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}>
            <motion.div className="circuit__success-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}>
              <div className="circuit__success-icon">{validationResult.passed ? '🎉' : '🔧'}</div>
              <h3>{validationResult.passed ? 'Circuit Complete!' : 'Keep Working'}</h3>
              <p>{validationResult.feedback}</p>
              <div className="circuit__success-score">{validationResult.score} pts</div>
              <button className="circuit__success-close" onClick={() => setShowSuccess(false)}>
                {validationResult.passed ? 'Continue' : 'Try Again'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
