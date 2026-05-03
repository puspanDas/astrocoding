import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, ChevronRight, CheckCircle, Circle, Sparkles,
  Lightbulb, Trash2, Link2, RotateCcw, Send, Award,
  Target, MousePointer2, X, Play, Pause, Square, SkipForward,
  Users, TrendingUp, Download, Wand2, ZoomIn, ZoomOut, Maximize2,
  Undo2, Redo2, Zap, BookOpen, ExternalLink
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

  // AI Auto-Architect state
  const [commandText, setCommandText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Simulation state
  const [simulating, setSimulating] = useState(false)
  const [simPaused, setSimPaused] = useState(false)
  const [simSteps, setSimSteps] = useState([])
  const [simCurrentStep, setSimCurrentStep] = useState(-1)
  const [simActiveConn, setSimActiveConn] = useState(-1)
  const [simActiveFromId, setSimActiveFromId] = useState(null)
  const [simActiveToId, setSimActiveToId] = useState(null)
  const simTimerRef = useRef(null)

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1)

  // Undo/Redo state
  const undoStackRef = useRef([])
  const redoStackRef = useRef([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const stateRef = useRef({ placedComponents: [], connections: [] })

  const canvasRef = useRef(null)
  const scenario = scenarios[currentScenario]

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem('astrocode-sysdesign-progress', JSON.stringify([...completedScenarios]))
      localStorage.setItem('astrocode-sysdesign-score', String(totalScore))
    } catch { /* noop */ }
  }, [completedScenarios, totalScore])

  // Keep state ref in sync
  useEffect(() => {
    stateRef.current = { placedComponents, connections }
  }, [placedComponents, connections])

  // Undo/Redo functions
  function saveSnapshot() {
    const cur = stateRef.current
    undoStackRef.current.push({
      placedComponents: JSON.parse(JSON.stringify(cur.placedComponents)),
      connections: JSON.parse(JSON.stringify(cur.connections))
    })
    if (undoStackRef.current.length > 50) undoStackRef.current.shift()
    redoStackRef.current = []
    setCanUndo(true)
    setCanRedo(false)
  }

  function undo() {
    if (undoStackRef.current.length === 0) return
    const cur = stateRef.current
    redoStackRef.current.push({
      placedComponents: JSON.parse(JSON.stringify(cur.placedComponents)),
      connections: JSON.parse(JSON.stringify(cur.connections))
    })
    const prev = undoStackRef.current.pop()
    setPlacedComponents(prev.placedComponents)
    setConnections(prev.connections)
    stateRef.current = prev
    setCanUndo(undoStackRef.current.length > 0)
    setCanRedo(true)
  }

  function redo() {
    if (redoStackRef.current.length === 0) return
    const cur = stateRef.current
    undoStackRef.current.push({
      placedComponents: JSON.parse(JSON.stringify(cur.placedComponents)),
      connections: JSON.parse(JSON.stringify(cur.connections))
    })
    const next = redoStackRef.current.pop()
    setPlacedComponents(next.placedComponents)
    setConnections(next.connections)
    stateRef.current = next
    setCanUndo(true)
    setCanRedo(redoStackRef.current.length > 0)
  }

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (undoStackRef.current.length > 0) {
          const cur = stateRef.current
          redoStackRef.current.push({ placedComponents: JSON.parse(JSON.stringify(cur.placedComponents)), connections: JSON.parse(JSON.stringify(cur.connections)) })
          const prev = undoStackRef.current.pop()
          setPlacedComponents(prev.placedComponents)
          setConnections(prev.connections)
          stateRef.current = prev
          setCanUndo(undoStackRef.current.length > 0)
          setCanRedo(true)
        }
      }
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault()
        if (redoStackRef.current.length > 0) {
          const cur = stateRef.current
          undoStackRef.current.push({ placedComponents: JSON.parse(JSON.stringify(cur.placedComponents)), connections: JSON.parse(JSON.stringify(cur.connections)) })
          const next = redoStackRef.current.pop()
          setPlacedComponents(next.placedComponents)
          setConnections(next.connections)
          stateRef.current = next
          setCanUndo(true)
          setCanRedo(redoStackRef.current.length > 0)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

    saveSnapshot()

    const rect = canvasRef.current.getBoundingClientRect()
    const scrollLeft = canvasRef.current.scrollLeft
    const scrollTop = canvasRef.current.scrollTop
    const x = Math.round(((e.clientX - rect.left + scrollLeft) / zoomLevel - 50) / 40) * 40
    const y = Math.round(((e.clientY - rect.top + scrollTop) / zoomLevel - 30) / 40) * 40

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

    saveSnapshot()

    dragOffset.current = {
      x: e.clientX - comp.x,
      y: e.clientY - comp.y,
    }
    setDraggingId(compId)

    const handleMouseMove = (moveEvent) => {
      const rect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop

      const newX = Math.round(((moveEvent.clientX - rect.left + scrollLeft) / zoomLevel - 50) / 40) * 40
      const newY = Math.round(((moveEvent.clientY - rect.top + scrollTop) / zoomLevel - 30) / 40) * 40

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
        saveSnapshot()
        setConnections(prev => [...prev, { from: connectFrom, to: compId }])
      }
      setConnectFrom(null)
    } else {
      setConnectFrom(null)
    }
  }

  function removeConnection(index) {
    saveSnapshot()
    setConnections(prev => prev.filter((_, i) => i !== index))
  }

  function removeComponent(compId) {
    saveSnapshot()
    setPlacedComponents(prev => prev.filter(c => c.id !== compId))
    setConnections(prev => prev.filter(c => c.from !== compId && c.to !== compId))
    if (selectedId === compId) setSelectedId(null)
    if (connectFrom === compId) setConnectFrom(null)
  }

  // ——— Clear canvas ———
  function handleClearCanvas() {
    if (placedComponents.length > 0 || connections.length > 0) saveSnapshot()
    stopSimulation()
    setPlacedComponents([])
    setConnections([])
    setSelectedId(null)
    setConnectFrom(null)
    setValidationResult(null)
    setShowSuccess(false)
    setHintIndex(-1)
  }

  // ——— Zoom controls ———
  function handleZoomIn() {
    setZoomLevel(prev => Math.min(prev + 0.15, 2.5))
  }
  function handleZoomOut() {
    setZoomLevel(prev => Math.max(prev - 0.15, 0.3))
  }
  function handleZoomReset() {
    setZoomLevel(1)
  }

  // ——— Submit design ———
  function handleSubmit() {
    const result = validateDesign(scenario, placedComponents, connections)
    setValidationResult(result)

    setShowSuccess(true)
    if (result.passed) {
      if (!completedScenarios.has(scenario.id)) {
        setCompletedScenarios(prev => new Set([...prev, scenario.id]))
        setTotalScore(prev => prev + result.score)
      }
    }
  }

  // ——— Get connection line coordinates (bezier) ———
  function getConnectionCoords(conn) {
    const fromComp = placedComponents.find(c => c.id === conn.from)
    const toComp = placedComponents.find(c => c.id === conn.to)
    if (!fromComp || !toComp) return null

    const x1 = fromComp.x + 50
    const y1 = fromComp.y + 30
    const x2 = toComp.x + 50
    const y2 = toComp.y + 30
    const dx = x2 - x1
    const dy = y2 - y1
    const dist = Math.sqrt(dx * dx + dy * dy)
    const curvature = Math.min(dist * 0.15, 50)
    const nx = dist > 0 ? (-dy / dist) * curvature : 0
    const ny = dist > 0 ? (dx / dist) * curvature : 0
    const cx = (x1 + x2) / 2 + nx
    const cy = (y1 + y2) / 2 + ny

    return { x1, y1, x2, y2, cx, cy, path: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}` }
  }

  // Canvas click deselect
  function handleCanvasClick(e) {
    if (e.target === canvasRef.current || e.target.closest('.sysdesign__connections-svg')) {
      setSelectedId(null)
      if (connectMode && connectFrom) setConnectFrom(null)
    }
  }

  // ——— AI Auto-Architect ———
  function handleAutoArchitect(e) {
    e.preventDefault()
    if (!commandText.trim()) return

    setIsGenerating(true)
    const lowerCmd = commandText.toLowerCase()
    
    // 1. Find matching scenario
    let bestMatch = null
    let maxScore = 0

    scenarios.forEach((s, idx) => {
      let score = 0
      const titleLower = s.title.toLowerCase()
      const descLower = s.description.toLowerCase()
      
      const words = lowerCmd.split(/\s+/)
      words.forEach(w => {
        if (w.length > 2) {
          if (titleLower.includes(w)) score += 3
          if (descLower.includes(w)) score += 1
          if (s.id.includes(w)) score += 2
        }
      })

      if (lowerCmd.includes("scale") && s.track === 'scaling') score += 2
      if (lowerCmd.includes(s.id.replace(/-/g, ' '))) score += 5
      if (titleLower.includes(lowerCmd)) score += 10
      
      if (score > maxScore) {
        maxScore = score
        bestMatch = idx
      }
    })

    if (bestMatch !== null && maxScore > 0) {
      setTimeout(() => {
        saveSnapshot()
        handleScenarioChange(bestMatch)
        const targetScenario = scenarios[bestMatch]

        if (targetScenario.requiredComponents && targetScenario.requiredComponents.length > 0) {
          const categoryMap = {}
          COMPONENT_CATEGORIES.forEach((cat, catIdx) => {
            cat.components.forEach(comp => {
              categoryMap[comp.type] = catIdx
            })
          })

          const grouped = {}
          targetScenario.requiredComponents.forEach(type => {
            const catIdx = categoryMap[type] !== undefined ? categoryMap[type] : 99
            if (!grouped[catIdx]) grouped[catIdx] = []
            grouped[catIdx].push(type)
          })

          const newComponents = []
          let tempNextId = nextComponentId
          
          const sortedKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b)
          
          sortedKeys.forEach((catIdx, colIdx) => {
            const types = grouped[catIdx]
            types.forEach((type, rowIdx) => {
              newComponents.push({
                id: `comp-${tempNextId++}`,
                type,
                x: 80 + colIdx * 180,
                y: 80 + rowIdx * 120
              })
            })
          })
          nextComponentId = tempNextId

          const newConnections = []
          if (targetScenario.requiredConnections) {
            targetScenario.requiredConnections.forEach(([fromType, toType]) => {
              const fromComp = newComponents.find(c => c.type === fromType)
              const toComp = newComponents.find(c => c.type === toType)
              if (fromComp && toComp) {
                newConnections.push({ from: fromComp.id, to: toComp.id })
              }
            })
          }

          setPlacedComponents(newComponents)
          setConnections(newConnections)
        }
        
        setIsGenerating(false)
        setCommandText('')
      }, 600)
    } else {
      setIsGenerating(false)
      alert("No matching architectural blueprint found for that prompt.")
    }
  }

  // ——— Export to TXT ———
  function handleExportTxt() {
    if (placedComponents.length === 0) return

    let content = `System Design Architecture Export\n`
    content += `===================================\n\n`
    content += `Scenario: ${scenario.title}\n`
    if (scenario.description) {
      content += `Description: ${scenario.description}\n`
    }
    content += `\n--- COMPONENTS ---\n`
    placedComponents.forEach((comp, idx) => {
      const def = COMPONENT_MAP[comp.type]
      if (def) {
        content += `${idx + 1}. [${def.label}] - ${def.desc}\n`
      }
    })
    
    content += `\n--- CONNECTIONS & DATA FLOW ---\n`
    const steps = generateFlowSteps(placedComponents, connections)
    if (steps.length > 0) {
      steps.forEach((step, idx) => {
        content += `Step ${idx + 1}: ${step.description}\n`
      })
    } else if (connections.length > 0) {
      connections.forEach((conn, idx) => {
        const fromComp = placedComponents.find(c => c.id === conn.from)
        const toComp = placedComponents.find(c => c.id === conn.to)
        if (fromComp && toComp) {
          const fromDef = COMPONENT_MAP[fromComp.type]
          const toDef = COMPONENT_MAP[toComp.type]
          content += `${idx + 1}. ${fromDef?.label || 'Unknown'} -> ${toDef?.label || 'Unknown'}\n`
        }
      })
    } else {
      content += `No connections established yet.\n`
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system_design_${scenario.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
          {placedComponents.length > 0 && (
            <div className="sysdesign__live-counter">
              <span className="sysdesign__live-counter-item">
                <Cpu size={11} />
                <span>{placedComponents.length}</span>
              </span>
              <span className="sysdesign__live-counter-divider">·</span>
              <span className="sysdesign__live-counter-item">
                <Link2 size={11} />
                <span>{connections.length}</span>
              </span>
            </div>
          )}
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
                {/* Section: Design Challenges */}
                <div className="sysdesign__sidebar-section">
                  <div className="sysdesign__sidebar-section-label">
                    <Target size={11} />
                    <span>Design Challenges</span>
                  </div>
                </div>
                {scenarios.filter(s => !s.track).map((s) => {
                  const i = scenarios.indexOf(s)
                  return (
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
                  )
                })}

                {/* Section: Scaling Journey */}
                <div className="sysdesign__sidebar-section sysdesign__sidebar-section--scaling">
                  <div className="sysdesign__sidebar-section-label">
                    <TrendingUp size={11} />
                    <span>Scaling Journey</span>
                  </div>
                  <div className="sysdesign__scaling-progress">
                    {(() => {
                      const scalingScenarios = scenarios.filter(s => s.track === 'scaling')
                      const completed = scalingScenarios.filter(s => completedScenarios.has(s.id)).length
                      const total = scalingScenarios.length
                      return (
                        <>
                          <div className="sysdesign__scaling-progress-bar">
                            <div
                              className="sysdesign__scaling-progress-fill"
                              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="sysdesign__scaling-progress-text">{completed}/{total}</span>
                        </>
                      )
                    })()}
                  </div>
                </div>
                {scenarios.filter(s => s.track === 'scaling').map((s) => {
                  const i = scenarios.indexOf(s)
                  return (
                    <button
                      key={s.id}
                      className={`sysdesign__scenario-item sysdesign__scenario-item--scaling ${currentScenario === i ? 'sysdesign__scenario-item--active' : ''} ${completedScenarios.has(s.id) ? 'sysdesign__scenario-item--complete' : ''}`}
                      onClick={() => handleScenarioChange(i)}
                    >
                      <span className="sysdesign__scenario-icon">{s.icon}</span>
                      <div className="sysdesign__scenario-info">
                        <span className="sysdesign__scenario-title">{s.title}</span>
                        <span className="sysdesign__scenario-scale-badge">
                          <Users size={9} />
                          <span>{s.scale}</span>
                        </span>
                      </div>
                      {completedScenarios.has(s.id) && (
                        <CheckCircle size={14} className="sysdesign__scenario-check" />
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="sysdesign__sidebar-brief">
                {scenario.track === 'scaling' && (
                  <div className="sysdesign__scale-header">
                    <div className="sysdesign__scale-header-badge">
                      <Users size={12} />
                      <span>{scenario.scaleLabel}</span>
                    </div>
                  </div>
                )}
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
              {/* Zoomable inner layer */}
              <div
                className="sysdesign__canvas-inner"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: '0 0',
                  width: `${100 / zoomLevel}%`,
                  height: `${100 / zoomLevel}%`,
                  minWidth: `${100 / zoomLevel}%`,
                  minHeight: `${100 / zoomLevel}%`,
                  position: 'relative',
                }}
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
                  <marker
                    id="arrowhead-active"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#c084fc" />
                  </marker>
                </defs>
                {connections.map((conn, i) => {
                  const coords = getConnectionCoords(conn)
                  if (!coords) return null
                  const isActive = simulating && simActiveConn === i
                  return (
                    <g key={i}>
                      <path
                        className="sysdesign__connection-hitbox"
                        d={coords.path}
                        fill="none"
                        onClick={(e) => { e.stopPropagation(); if (!simulating) removeConnection(i) }}
                      />
                      {/* Glow path when active */}
                      {isActive && (
                        <path
                          className="sysdesign__connection-glow"
                          d={coords.path}
                          fill="none"
                          stroke="#a855f7"
                        />
                      )}
                      {/* Animated flow dashes on all lines */}
                      <path
                        className={`sysdesign__connection-flow ${isActive ? 'sysdesign__connection-flow--active' : ''}`}
                        d={coords.path}
                        fill="none"
                        stroke={isActive ? '#c084fc' : 'rgba(168,85,247,0.15)'}
                        strokeWidth="2"
                        strokeDasharray="6 8"
                      />
                      <path
                        className={`sysdesign__connection-line ${isActive ? 'sysdesign__connection-line--active' : ''}`}
                        d={coords.path}
                        fill="none"
                        stroke={isActive ? '#c084fc' : '#a855f7'}
                        markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                      />
                      {/* Animated data packet */}
                      {isActive && (
                        <circle className="sysdesign__data-packet" r="6" fill="#c084fc">
                          <animateMotion
                            dur="1.2s"
                            repeatCount="indefinite"
                            path={coords.path}
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
              </div> {/* end sysdesign__canvas-inner */}
            </div>

            {/* AI Auto-Architect Prompt */}
            <form className="sysdesign__ai-prompt" onSubmit={handleAutoArchitect}>
              <div className="sysdesign__ai-prompt-inner">
                <Wand2 size={16} className="sysdesign__ai-icon" />
                <input
                  type="text"
                  className="sysdesign__ai-input"
                  placeholder="Ask AI to design an architecture... (e.g. 'e-commerce' or 'scale to 1m')"
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  className="sysdesign__ai-submit"
                  disabled={!commandText.trim() || isGenerating}
                >
                  {isGenerating ? <div className="sysdesign__spinner" /> : <Send size={14} />}
                </button>
              </div>
            </form>
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
                  className="sysdesign__canvas-tool"
                  onClick={handleExportTxt}
                  disabled={placedComponents.length === 0}
                  title="Export architecture to TXT"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
                <button
                  className="sysdesign__canvas-tool sysdesign__canvas-tool--danger"
                  onClick={handleClearCanvas}
                  title="Clear canvas"
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>
                <div className="sysdesign__toolbar-divider" />
                <button
                  className="sysdesign__canvas-tool"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={14} />
                </button>
                <button
                  className="sysdesign__canvas-tool"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 size={14} />
                </button>
                <div className="sysdesign__toolbar-divider" />
                <button
                  className="sysdesign__canvas-tool"
                  onClick={handleZoomIn}
                  title="Zoom in"
                >
                  <ZoomIn size={14} />
                </button>
                <span className="sysdesign__zoom-level">{Math.round(zoomLevel * 100)}%</span>
                <button
                  className="sysdesign__canvas-tool"
                  onClick={handleZoomOut}
                  title="Zoom out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  className="sysdesign__canvas-tool"
                  onClick={handleZoomReset}
                  title="Reset zoom"
                >
                  <Maximize2 size={14} />
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

      {/* ===== COMPONENT INSPECTOR PANEL ===== */}
      <AnimatePresence>
        {selectedId && (() => {
          const selectedComp = placedComponents.find(c => c.id === selectedId)
          if (!selectedComp) return null
          const def = COMPONENT_MAP[selectedComp.type]
          if (!def) return null
          const compConnections = connections.filter(
            c => c.from === selectedId || c.to === selectedId
          ).map(c => {
            const otherId = c.from === selectedId ? c.to : c.from
            const other = placedComponents.find(p => p.id === otherId)
            if (!other) return null
            const otherDef = COMPONENT_MAP[other.type]
            return otherDef ? { label: otherDef.label, icon: otherDef.icon, direction: c.from === selectedId ? 'outgoing' : 'incoming' } : null
          }).filter(Boolean)
          const category = COMPONENT_CATEGORIES.find(cat => cat.components.some(c => c.type === selectedComp.type))

          return (
            <motion.div
              className="sysdesign__inspector"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sysdesign__inspector-header">
                <div className="sysdesign__inspector-title-row">
                  <span className="sysdesign__inspector-icon" style={{ background: `${def.color}22`, borderColor: `${def.color}44` }}>
                    {def.icon}
                  </span>
                  <div>
                    <div className="sysdesign__inspector-name">{def.label}</div>
                    {category && <div className="sysdesign__inspector-category">{category.label}</div>}
                  </div>
                </div>
                <button className="sysdesign__inspector-close" onClick={() => setSelectedId(null)}>
                  <X size={14} />
                </button>
              </div>

              <div className="sysdesign__inspector-body">
                <div className="sysdesign__inspector-section">
                  <div className="sysdesign__inspector-section-label">
                    <BookOpen size={11} />
                    <span>What is it?</span>
                  </div>
                  <p className="sysdesign__inspector-text">{def.desc}</p>
                </div>

                {def.whenToUse && (
                  <div className="sysdesign__inspector-section">
                    <div className="sysdesign__inspector-section-label">
                      <Target size={11} />
                      <span>When to use</span>
                    </div>
                    <p className="sysdesign__inspector-text">{def.whenToUse}</p>
                  </div>
                )}

                {def.realWorldExample && (
                  <div className="sysdesign__inspector-section">
                    <div className="sysdesign__inspector-section-label">
                      <ExternalLink size={11} />
                      <span>Real-world example</span>
                    </div>
                    <p className="sysdesign__inspector-text sysdesign__inspector-text--highlight">{def.realWorldExample}</p>
                  </div>
                )}

                {compConnections.length > 0 && (
                  <div className="sysdesign__inspector-section">
                    <div className="sysdesign__inspector-section-label">
                      <Link2 size={11} />
                      <span>Connections ({compConnections.length})</span>
                    </div>
                    <div className="sysdesign__inspector-connections">
                      {compConnections.map((c, i) => (
                        <div key={i} className="sysdesign__inspector-conn-item">
                          <span className={`sysdesign__inspector-conn-dir sysdesign__inspector-conn-dir--${c.direction}`}>
                            {c.direction === 'outgoing' ? '→' : '←'}
                          </span>
                          <span>{c.icon} {c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {def.proTip && (
                  <div className="sysdesign__inspector-tip">
                    <Zap size={12} className="sysdesign__inspector-tip-icon" />
                    <p>{def.proTip}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ===== RESULT OVERLAY ===== */}
      <AnimatePresence>
        {showSuccess && validationResult && (
          <motion.div
            className="sysdesign__success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`sysdesign__success-card ${!validationResult.passed ? 'sysdesign__success-card--failed' : ''}`}
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {validationResult.passed ? (
                <>
                  <div className="sysdesign__success-emoji">🏆</div>
                  <h3>Architecture Approved!</h3>
                  <p>{scenario.successMessage}</p>

                  <div className="sysdesign__tech-insights">
                    <div className="sysdesign__tech-insight-item">
                      <strong>💻 Suggested Tech Stack:</strong> {scenario.techStack || 'Any standard stack.'}
                    </div>
                    <div className="sysdesign__tech-insight-item">
                      <strong>⏱️ Time & Space Complexity:</strong> {scenario.complexity || 'O(1) optimal setup.'}
                    </div>
                  </div>

                  {scenario.architecturalUpgrades && (
                    <div className="sysdesign__arch-upgrades">
                      <h4>{scenario.architecturalUpgrades.title}</h4>
                      <ol className="sysdesign__arch-upgrades-list">
                        {scenario.architecturalUpgrades.items.map((item, idx) => (
                          <li key={idx} className="sysdesign__arch-upgrade-item">
                            <strong>{item.title}</strong>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{item.description}</p>
                          </li>
                        ))}
                      </ol>
                      <p className="sysdesign__arch-upgrades-conclusion">
                        {scenario.architecturalUpgrades.conclusion}
                      </p>
                    </div>
                  )}

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
                </>
              ) : (
                <>
                  <div className="sysdesign__success-emoji">🚧</div>
                  <h3>Needs Modification</h3>
                  <p>{scenario.failureMessage || 'Your architecture is missing some core requirements.'}</p>
                  
                  <div className="sysdesign__missing-reqs">
                    <strong>Missing Requirements:</strong>
                    <ul>
                      {validationResult.checklist
                        .filter(item => item.required && !item.met)
                        .map((item, idx) => (
                          <li key={idx}>❌ {item.isConnection ? '🔗 ' : ''}{item.label}</li>
                        ))}
                    </ul>
                  </div>

                  <div className="sysdesign__success-actions">
                    <button
                      className="btn-primary"
                      onClick={() => setShowSuccess(false)}
                    >
                      <span>Fix Architecture</span>
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
