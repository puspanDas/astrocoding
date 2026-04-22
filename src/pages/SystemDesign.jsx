import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, ChevronRight, CheckCircle, Circle, Sparkles,
  Lightbulb, Trash2, Link2, RotateCcw, Send, Award,
  Target, MousePointer2, X, Play, Pause, Square, SkipForward
} from 'lucide-react'
import StarField from '../components/StarField'
import {
  COMPONENT_CATEGORIES, COMPONENT_MAP,
  scenarios, validateDesign, generateFlowSteps
} from '../engine/systemDesignScenarios'
import './SystemDesign.css'

let nextComponentId = 1

export default function SystemDesign() {
  // Scenario state
  const [currentScenario, setCurrentScenario] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedScenarios, setCompletedScenarios] = useState(() => {
    try {
      const raw = localStorage.getItem('astrocode-sysdesign-progress')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
  })

  // Canvas state
  const [placedComponents, setPlacedComponents] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [connectMode, setConnectMode] = useState(false)
  const [connectFrom, setConnectFrom] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  // Dragging placed component
  const [draggingId, setDraggingId] = useState(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Validation state
  const [validationResult, setValidationResult] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hintIndex, setHintIndex] = useState(-1)
  const [totalScore, setTotalScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('astrocode-sysdesign-score') || '0', 10)
    } catch { return 0 }
  })

  // Simulation state
  const [simulating, setSimulating] = useState(false)
  const [simPaused, setSimPaused] = useState(false)
  const [simSteps, setSimSteps] = useState([])
  const [simCurrentStep, setSimCurrentStep] = useState(-1)
  const [simActiveConn, setSimActiveConn] = useState(-1)
  const [simActiveFromId, setSimActiveFromId] = useState(null)
  const [simActiveToId, setSimActiveToId] = useState(null)
  const simTimerRef = useRef(null)

  const canvasRef = useRef(null)
  const scenario = scenarios[currentScenario]

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem('astrocode-sysdesign-progress', JSON.stringify([...completedScenarios]))
      localStorage.setItem('astrocode-sysdesign-score', String(totalScore))
    } catch { /* noop */ }
  }, [completedScenarios, totalScore])

  // Live validation (update checklist as user builds)
  useEffect(() => {
    if (scenario.requiredComponents.length > 0 || placedComponents.length > 0) {
      setValidationResult(validateDesign(scenario, placedComponents, connections))
    }
  }, [placedComponents, connections, scenario])

  // ——— Scenario switching ———
  function handleScenarioChange(index) {
    stopSimulation()
    setCurrentScenario(index)
    setPlacedComponents([])
    setConnections([])
    setSelectedId(null)
    setConnectMode(false)
    setConnectFrom(null)
    setValidationResult(null)
    setShowSuccess(false)
    setHintIndex(-1)
  }

  // ——— Simulation logic ———
  function startSimulation() {
    const steps = generateFlowSteps(placedComponents, connections)
    if (steps.length === 0) return

    setConnectMode(false)
    setConnectFrom(null)
    setSimSteps(steps)
    setSimCurrentStep(0)
    setSimulating(true)
    setSimPaused(false)

    // Highlight the first step immediately
    const first = steps[0]
    setSimActiveConn(first.connIndex)
    setSimActiveFromId(first.fromId)
    setSimActiveToId(first.toId)
  }

  function stopSimulation() {
    if (simTimerRef.current) clearTimeout(simTimerRef.current)
    setSimulating(false)
    setSimPaused(false)
    setSimSteps([])
    setSimCurrentStep(-1)
    setSimActiveConn(-1)
    setSimActiveFromId(null)
    setSimActiveToId(null)
  }

  function togglePauseSimulation() {
    setSimPaused(prev => !prev)
  }

  function advanceSimStep() {
    setSimCurrentStep(prev => {
      const next = prev + 1
      if (next >= simSteps.length) {
        // Loop back to start
        return 0
      }
      return next
    })
  }

  // Auto-advance simulation steps
  useEffect(() => {
    if (!simulating || simPaused || simSteps.length === 0) return

    simTimerRef.current = setTimeout(() => {
      setSimCurrentStep(prev => {
        const next = prev + 1
        if (next >= simSteps.length) return 0
        return next
      })
    }, 1800) // 1.8s per step

    return () => { if (simTimerRef.current) clearTimeout(simTimerRef.current) }
  }, [simulating, simPaused, simCurrentStep, simSteps.length])

  // Update highlighted components when step changes
  useEffect(() => {
    if (simCurrentStep >= 0 && simCurrentStep < simSteps.length) {
      const step = simSteps[simCurrentStep]
      setSimActiveConn(step.connIndex)
      setSimActiveFromId(step.fromId)
      setSimActiveToId(step.toId)
    }
  }, [simCurrentStep, simSteps])

  // ——— Drag from palette onto canvas ———
  function handleDragStart(e, componentType) {
    e.dataTransfer.setData('componentType', componentType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  function handleCanvasDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOver(true)
  }

  function handleCanvasDragLeave() {
    setDragOver(false)
  }

  function handleCanvasDrop(e) {
    e.preventDefault()
    setDragOver(false)

    const componentType = e.dataTransfer.getData('componentType')
    if (!componentType || !COMPONENT_MAP[componentType]) return

    const rect = canvasRef.current.getBoundingClientRect()
    const scrollLeft = canvasRef.current.scrollLeft
    const scrollTop = canvasRef.current.scrollTop
    const x = Math.round((e.clientX - rect.left + scrollLeft - 50) / 40) * 40
    const y = Math.round((e.clientY - rect.top + scrollTop - 30) / 40) * 40

    const newComp = {
      id: `comp-${nextComponentId++}`,
      type: componentType,
      x: Math.max(0, x),
      y: Math.max(0, y),
    }

    setPlacedComponents(prev => [...prev, newComp])
    setSelectedId(newComp.id)
  }

  // ——— Drag placed component to reposition ———
  function handleComponentMouseDown(e, compId) {
    if (connectMode) {
      handleConnectionClick(compId)
      return
    }

    e.stopPropagation()
    e.preventDefault()
    setSelectedId(compId)

    const comp = placedComponents.find(c => c.id === compId)
    if (!comp) return

    dragOffset.current = {
      x: e.clientX - comp.x,
      y: e.clientY - comp.y,
    }
    setDraggingId(compId)

    const handleMouseMove = (moveEvent) => {
      const rect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop

      const newX = Math.round((moveEvent.clientX - rect.left + scrollLeft - 50) / 40) * 40
      const newY = Math.round((moveEvent.clientY - rect.top + scrollTop - 30) / 40) * 40

      setPlacedComponents(prev =>
        prev.map(c => c.id === compId ? { ...c, x: Math.max(0, newX), y: Math.max(0, newY) } : c)
      )
    }

    const handleMouseUp = () => {
      setDraggingId(null)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // ——— Connection mode ———
  function handleConnectionClick(compId) {
    if (!connectMode) return

    if (!connectFrom) {
      setConnectFrom(compId)
    } else if (connectFrom !== compId) {
      // Check for duplicate connection
      const exists = connections.some(
        c => (c.from === connectFrom && c.to === compId) || (c.from === compId && c.to === connectFrom)
      )
      if (!exists) {
        setConnections(prev => [...prev, { from: connectFrom, to: compId }])
      }
      setConnectFrom(null)
    } else {
      setConnectFrom(null)
    }
  }

  function removeConnection(index) {
    setConnections(prev => prev.filter((_, i) => i !== index))
  }

  function removeComponent(compId) {
    setPlacedComponents(prev => prev.filter(c => c.id !== compId))
    setConnections(prev => prev.filter(c => c.from !== compId && c.to !== compId))
    if (selectedId === compId) setSelectedId(null)
    if (connectFrom === compId) setConnectFrom(null)
  }

  // ——— Clear canvas ———
  function handleClearCanvas() {
    stopSimulation()
    setPlacedComponents([])
    setConnections([])
    setSelectedId(null)
    setConnectFrom(null)
    setValidationResult(null)
    setShowSuccess(false)
    setHintIndex(-1)
  }

  // ——— Submit design ———
  function handleSubmit() {
    const result = validateDesign(scenario, placedComponents, connections)
    setValidationResult(result)

    if (result.passed) {
      setShowSuccess(true)
      if (!completedScenarios.has(scenario.id)) {
        setCompletedScenarios(prev => new Set([...prev, scenario.id]))
        setTotalScore(prev => prev + result.score)
      }
    }
  }

  // ——— Get connection line coordinates ———
  function getConnectionCoords(conn) {
    const fromComp = placedComponents.find(c => c.id === conn.from)
    const toComp = placedComponents.find(c => c.id === conn.to)
    if (!fromComp || !toComp) return null

    return {
      x1: fromComp.x + 50,
      y1: fromComp.y + 30,
      x2: toComp.x + 50,
      y2: toComp.y + 30,
    }
  }

  // Canvas click deselect
  function handleCanvasClick(e) {
    if (e.target === canvasRef.current || e.target.closest('.sysdesign__connections-svg')) {
      setSelectedId(null)
      if (connectMode && connectFrom) setConnectFrom(null)
    }
  }

  return (
    <div className="sysdesign">
      <StarField />

      {/* ===== TOP BAR ===== */}
      <div className="sysdesign__topbar">
        <div className="sysdesign__topbar-left">
          <Cpu size={16} className="sysdesign__topbar-icon" />
          <span className="sysdesign__topbar-title">
            {scenario.icon} {scenario.title}
          </span>
          {scenario.difficulty > 0 && (
            <div className="sysdesign__topbar-diff">
              {Array.from({ length: scenario.difficulty }, (_, i) => (
                <Sparkles key={i} size={10} className="difficulty-star" />
              ))}
            </div>
          )}
        </div>
        <div className="sysdesign__topbar-right">
          <div className="sysdesign__score-badge">
            <Award size={14} />
            <span>{totalScore} pts</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="sysdesign__main">

        {/* Scenario Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="sysdesign__sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sysdesign__sidebar-header">
                <Target size={14} />
                <span>Scenarios</span>
              </div>
              <div className="sysdesign__sidebar-list">
                {scenarios.map((s, i) => (
                  <button
                    key={s.id}
                    className={`sysdesign__scenario-item ${currentScenario === i ? 'sysdesign__scenario-item--active' : ''} ${completedScenarios.has(s.id) ? 'sysdesign__scenario-item--complete' : ''}`}
                    onClick={() => handleScenarioChange(i)}
                  >
                    <span className="sysdesign__scenario-icon">{s.icon}</span>
                    <div className="sysdesign__scenario-info">
                      <span className="sysdesign__scenario-title">{s.title}</span>
                      {s.difficulty > 0 ? (
                        <span className="sysdesign__scenario-diff">
                          {'★'.repeat(Math.min(s.difficulty, 5))}{'☆'.repeat(Math.max(0, 5 - s.difficulty))}
                        </span>
                      ) : (
                        <span className="sysdesign__scenario-diff free">Sandbox</span>
                      )}
                    </div>
                    {completedScenarios.has(s.id) && (
                      <CheckCircle size={14} className="sysdesign__scenario-check" />
                    )}
                  </button>
                ))}
              </div>
              <div className="sysdesign__sidebar-brief">
                <p>{scenario.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle */}
        <button
          className="sysdesign__sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Hide scenarios' : 'Show scenarios'}
        >
          <ChevronRight size={14} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {/* ===== WORKSPACE ===== */}
        <div className="sysdesign__workspace">

          {/* Component Palette */}
          <div className="sysdesign__palette">
            <div className="sysdesign__palette-inner">
              {COMPONENT_CATEGORIES.map(cat => (
                <div key={cat.id} className="sysdesign__palette-group">
                  <span className="sysdesign__palette-label">{cat.label}</span>
                  {cat.components.map(comp => (
                    <div
                      key={comp.type}
                      className="sysdesign__palette-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, comp.type)}
                      title={comp.desc}
                      style={{ borderColor: `${comp.color}33` }}
                    >
                      <span className="sysdesign__palette-item-icon">{comp.icon}</span>
                      <span>{comp.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="sysdesign__canvas-area">
            <div
              ref={canvasRef}
              className={`sysdesign__canvas ${dragOver ? 'sysdesign__canvas--drag-over' : ''}`}
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
              onDrop={handleCanvasDrop}
              onClick={handleCanvasClick}
            >
              {/* Empty state */}
              {placedComponents.length === 0 && (
                <div className="sysdesign__canvas-empty">
                  <div className="sysdesign__canvas-empty-icon">🏗️</div>
                  <div className="sysdesign__canvas-empty-text">Drag components here to start designing</div>
                  <div className="sysdesign__canvas-empty-hint">
                    Pick components from the palette above and drop them on the canvas
                  </div>
                </div>
              )}

              {/* SVG Connections */}
              <svg className="sysdesign__connections-svg">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
                  </marker>
                </defs>
                {connections.map((conn, i) => {
                  const coords = getConnectionCoords(conn)
                  if (!coords) return null
                  const isActive = simulating && simActiveConn === i
                  return (
                    <g key={i}>
                      <line
                        className="sysdesign__connection-hitbox"
                        x1={coords.x1} y1={coords.y1}
                        x2={coords.x2} y2={coords.y2}
                        onClick={(e) => { e.stopPropagation(); if (!simulating) removeConnection(i) }}
                      />
                      {/* Glow line underneath when active */}
                      {isActive && (
                        <line
                          className="sysdesign__connection-glow"
                          x1={coords.x1} y1={coords.y1}
                          x2={coords.x2} y2={coords.y2}
                          stroke="#a855f7"
                        />
                      )}
                      <line
                        className={`sysdesign__connection-line ${isActive ? 'sysdesign__connection-line--active' : ''}`}
                        x1={coords.x1} y1={coords.y1}
                        x2={coords.x2} y2={coords.y2}
                        stroke={isActive ? '#c084fc' : '#a855f7'}
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Animated data packet */}
                      {isActive && (
                        <circle className="sysdesign__data-packet" r="6" fill="#c084fc">
                          <animateMotion
                            dur="1.2s"
                            repeatCount="indefinite"
                            path={`M${coords.x1},${coords.y1} L${coords.x2},${coords.y2}`}
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Placed Components */}
              {placedComponents.map(comp => {
                const def = COMPONENT_MAP[comp.type]
                if (!def) return null
                const isSimActive = simulating && (simActiveFromId === comp.id || simActiveToId === comp.id)
                return (
                  <motion.div
                    key={comp.id}
                    className={`sysdesign__component ${selectedId === comp.id ? 'sysdesign__component--selected' : ''} ${connectMode ? 'sysdesign__component--connecting' : ''} ${connectFrom === comp.id ? 'sysdesign__component--selected' : ''} ${isSimActive ? 'sysdesign__component--sim-active' : ''}`}
                    style={{
                      left: comp.x,
                      top: comp.y,
                      borderColor: def.color,
                      '--comp-color': def.color,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                    onMouseDown={(e) => { if (!simulating) handleComponentMouseDown(e, comp.id) }}
                  >
                    {!simulating && (
                      <button
                        className="sysdesign__component-remove"
                        onClick={(e) => { e.stopPropagation(); removeComponent(comp.id) }}
                        title="Remove component"
                      >
                        <X size={10} />
                      </button>
                    )}
                    <span className="sysdesign__component-icon">{def.icon}</span>
                    <span className="sysdesign__component-label">{def.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Canvas Toolbar */}
          <div className="sysdesign__canvas-toolbar">
            {!simulating ? (
              <>
                <button
                  className="sysdesign__canvas-tool"
                  onClick={() => { setConnectMode(false); setConnectFrom(null) }}
                  title="Select & Move"
                >
                  <MousePointer2 size={14} />
                  <span>Select</span>
                </button>
                <button
                  className={`sysdesign__canvas-tool ${connectMode ? 'sysdesign__canvas-tool--active' : ''}`}
                  onClick={() => { setConnectMode(!connectMode); setConnectFrom(null) }}
                  title="Connect components"
                >
                  <Link2 size={14} />
                  <span>Connect{connectFrom ? ' (pick target)' : ''}</span>
                </button>
                <button
                  className={`sysdesign__canvas-tool sysdesign__canvas-tool--simulate`}
                  onClick={startSimulation}
                  disabled={connections.length === 0}
                  title="Simulate data flow through your architecture"
                >
                  <Play size={14} />
                  <span>Simulate</span>
                </button>
                <button
                  className="sysdesign__canvas-tool sysdesign__canvas-tool--danger"
                  onClick={handleClearCanvas}
                  title="Clear canvas"
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="sysdesign__canvas-tool sysdesign__canvas-tool--active"
                  onClick={togglePauseSimulation}
                  title={simPaused ? 'Resume' : 'Pause'}
                >
                  {simPaused ? <Play size={14} /> : <Pause size={14} />}
                  <span>{simPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  className="sysdesign__canvas-tool"
                  onClick={advanceSimStep}
                  title="Next step"
                >
                  <SkipForward size={14} />
                  <span>Next</span>
                </button>
                <button
                  className="sysdesign__canvas-tool sysdesign__canvas-tool--danger"
                  onClick={stopSimulation}
                  title="Stop simulation"
                >
                  <Square size={14} />
                  <span>Stop</span>
                </button>
              </>
            )}
          </div>

          {/* Simulation Narration Panel */}
          <AnimatePresence>
            {simulating && simCurrentStep >= 0 && simCurrentStep < simSteps.length && (
              <motion.div
                className="sysdesign__narration"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="sysdesign__narration-header">
                  <div className="sysdesign__narration-badge">
                    <Play size={10} />
                    <span>Live Flow Simulation</span>
                  </div>
                  <span className="sysdesign__narration-step">
                    Step {simCurrentStep + 1} / {simSteps.length}
                  </span>
                </div>
                <motion.div
                  key={simCurrentStep}
                  className="sysdesign__narration-body"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="sysdesign__narration-flow">
                    <span className="sysdesign__narration-comp sysdesign__narration-comp--from">
                      {COMPONENT_MAP[simSteps[simCurrentStep].from.type]?.icon} {COMPONENT_MAP[simSteps[simCurrentStep].from.type]?.label}
                    </span>
                    <span className="sysdesign__narration-arrow">→</span>
                    <span className="sysdesign__narration-comp sysdesign__narration-comp--to">
                      {COMPONENT_MAP[simSteps[simCurrentStep].to.type]?.icon} {COMPONENT_MAP[simSteps[simCurrentStep].to.type]?.label}
                    </span>
                  </div>
                  <div className="sysdesign__narration-desc">
                    {simSteps[simCurrentStep].description}
                  </div>
                </motion.div>
                <div className="sysdesign__narration-progress">
                  {simSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`sysdesign__narration-dot ${i === simCurrentStep ? 'sysdesign__narration-dot--active' : ''} ${i < simCurrentStep ? 'sysdesign__narration-dot--done' : ''}`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== VALIDATION PANEL ===== */}
        <div className="sysdesign__validation">
          <div className="sysdesign__validation-header">
            <CheckCircle size={14} />
            <span>Requirements</span>
          </div>

          <div className="sysdesign__checklist">
            {validationResult && (
              <>
                {/* Required items */}
                <div className="sysdesign__checklist-section">
                  <div className="sysdesign__checklist-title">Required</div>
                  {validationResult.checklist
                    .filter(item => item.required)
                    .map((item, i) => (
                      <div
                        key={i}
                        className={`sysdesign__checklist-item ${item.met ? 'sysdesign__checklist-item--met' : ''}`}
                      >
                        {item.met
                          ? <CheckCircle size={13} className="sysdesign__check-icon" />
                          : <Circle size={13} className="sysdesign__check-icon" />
                        }
                        <span>{item.isConnection ? '🔗 ' : ''}{item.label}</span>
                      </div>
                    ))
                  }
                </div>

                {/* Bonus items */}
                {validationResult.checklist.some(item => !item.required) && (
                  <div className="sysdesign__checklist-section">
                    <div className="sysdesign__checklist-title">Bonus</div>
                    {validationResult.checklist
                      .filter(item => !item.required)
                      .map((item, i) => (
                        <div
                          key={i}
                          className={`sysdesign__checklist-item sysdesign__checklist-item--bonus ${item.met ? 'sysdesign__checklist-item--met' : ''}`}
                        >
                          {item.met
                            ? <CheckCircle size={13} className="sysdesign__check-icon" />
                            : <Circle size={13} className="sysdesign__check-icon" />
                          }
                          <span>{item.label}</span>
                          {item.bonus && <span className="sysdesign__bonus-pts">+{item.bonus}</span>}
                        </div>
                      ))
                    }
                  </div>
                )}
              </>
            )}

            {!validationResult && scenario.requiredComponents.length > 0 && (
              <div className="sysdesign__checklist-section">
                <div className="sysdesign__checklist-title">Required Components</div>
                {scenario.requiredComponents.map((type, i) => {
                  const comp = COMPONENT_MAP[type]
                  return (
                    <div key={i} className="sysdesign__checklist-item">
                      <Circle size={13} className="sysdesign__check-icon" />
                      <span>{comp?.icon} {comp?.label}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {scenario.requiredComponents.length === 0 && !validationResult && (
              <div style={{ padding: '20px 8px', color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', lineHeight: '1.6' }}>
                🎨 Free Design Mode<br />
                No requirements — build anything you like!
              </div>
            )}
          </div>

          {/* Hints */}
          <div className="sysdesign__hints">
            <button
              className="sysdesign__hint-btn"
              onClick={() => setHintIndex(prev => Math.min(prev + 1, scenario.hints.length - 1))}
              disabled={hintIndex >= scenario.hints.length - 1}
            >
              <Lightbulb size={14} />
              <span>Get Hint ({Math.min(hintIndex + 2, scenario.hints.length)}/{scenario.hints.length})</span>
            </button>
            {hintIndex >= 0 && scenario.hints.slice(0, hintIndex + 1).map((hint, i) => (
              <div key={i} className="sysdesign__hint-text">{hint}</div>
            ))}
          </div>

          {/* Submit */}
          <div className="sysdesign__submit-area">
            <button
              className="sysdesign__submit-btn"
              onClick={handleSubmit}
              disabled={placedComponents.length === 0}
            >
              <Send size={14} />
              <span>Validate Design</span>
            </button>
            <button className="sysdesign__reset-btn" onClick={handleClearCanvas}>
              <RotateCcw size={13} />
              <span>Reset Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== SUCCESS OVERLAY ===== */}
      <AnimatePresence>
        {showSuccess && validationResult && (
          <motion.div
            className="sysdesign__success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sysdesign__success-card"
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div className="sysdesign__success-emoji">🏆</div>
              <h3>Architecture Approved!</h3>
              <p>{scenario.successMessage}</p>
              <div className="sysdesign__success-score">
                <Award size={18} />
                <span>{validationResult.score} / {validationResult.maxScore === Infinity ? '∞' : validationResult.maxScore} pts</span>
              </div>
              <div className="sysdesign__success-actions">
                {currentScenario < scenarios.length - 1 && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setShowSuccess(false)
                      handleScenarioChange(currentScenario + 1)
                    }}
                  >
                    <span>Next Scenario</span>
                    <ChevronRight size={16} />
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => setShowSuccess(false)}
                >
                  Keep Designing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
