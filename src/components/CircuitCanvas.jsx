import { useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { CIRCUIT_COMPONENT_MAP } from '../engine/circuitComponents'

export default function CircuitCanvas({
  placedComponents, connections, selectedId, connectMode, connectFrom,
  zoomLevel, dragOver, simActiveConn, simActiveFromId, simActiveToId,
  faultyConns = [],
  onCanvasDrop, onCanvasDragOver, onCanvasDragLeave, onCanvasClick,
  onComponentMouseDown, onRemoveComponent, onRemoveConnection
}) {
  const canvasRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    const type = e.dataTransfer.getData('componentType')
    if (!type || !CIRCUIT_COMPONENT_MAP[type]) return
    const rect = canvasRef.current.getBoundingClientRect()
    const sL = canvasRef.current.scrollLeft
    const sT = canvasRef.current.scrollTop
    const x = Math.round(((e.clientX - rect.left + sL) / zoomLevel - 45) / 40) * 40
    const y = Math.round(((e.clientY - rect.top + sT) / zoomLevel - 30) / 40) * 40
    onCanvasDrop(type, Math.max(0, x), Math.max(0, y))
  }

  function getConnPath(conn) {
    const f = placedComponents.find(c => c.id === conn.from)
    const t = placedComponents.find(c => c.id === conn.to)
    if (!f || !t) return null
    const x1 = f.x + 45, y1 = f.y + 30, x2 = t.x + 45, y2 = t.y + 30
    const dx = x2 - x1, dy = y2 - y1
    const dist = Math.sqrt(dx * dx + dy * dy)
    const curv = Math.min(dist * 0.15, 50)
    const nx = dist > 0 ? (-dy / dist) * curv : 0
    const ny = dist > 0 ? (dx / dist) * curv : 0
    const cx = (x1 + x2) / 2 + nx, cy = (y1 + y2) / 2 + ny
    return { x1, y1, x2, y2, cx, cy, path: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}` }
  }

  // Only trigger canvas deselect if the click is on the background, not a component
  function handleCanvasClick(e) {
    if (e.target.closest('.circuit__component')) return
    onCanvasClick()
  }

  return (
    <div
      ref={canvasRef}
      className={`circuit__canvas ${dragOver ? 'circuit__canvas--drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; onCanvasDragOver() }}
      onDragLeave={onCanvasDragLeave}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      <div className="circuit__canvas-inner" style={{ transform: `scale(${zoomLevel})` }}>
        {/* SVG Wires */}
        <svg className="circuit__connections-svg" width="3000" height="2000">
          {connections.map((conn, i) => {
            const coords = getConnPath(conn)
            if (!coords) return null
            const isActive = i === simActiveConn
            const isFaulty = faultyConns.includes(i)
            return (
              <g key={i}>
                <path d={coords.path} className={`circuit__wire ${isActive ? 'circuit__wire--active' : ''} ${isFaulty ? 'circuit__wire--fault' : ''}`}
                  style={{ pointerEvents: 'stroke' }} onClick={(e) => { e.stopPropagation(); onRemoveConnection(i) }} />
                <circle cx={coords.cx} cy={coords.cy} r="6" className="circuit__wire-remove"
                  onClick={(e) => { e.stopPropagation(); onRemoveConnection(i) }} />
              </g>
            )
          })}
        </svg>

        {/* Components */}
        {placedComponents.map(comp => {
          const def = CIRCUIT_COMPONENT_MAP[comp.type]
          if (!def) return null
          const isSel = selectedId === comp.id
          const isSimFrom = simActiveFromId === comp.id
          const isSimTo = simActiveToId === comp.id
          const isConnFrom = connectFrom === comp.id
          return (
            <motion.div key={comp.id}
              className={`circuit__component ${isSel ? 'circuit__component--selected' : ''} ${(isSimFrom || isSimTo) ? 'circuit__component--sim-active' : ''} ${isConnFrom ? 'circuit__component--connect-from' : ''}`}
              style={{ left: comp.x, top: comp.y, cursor: connectMode ? 'pointer' : 'grab' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              onMouseDown={(e) => onComponentMouseDown(e, comp.id)}
              onClick={(e) => {
                // Backup click handler for connect mode — ensures wiring works reliably
                if (connectMode) { e.stopPropagation() }
              }}
            >
              <div className="circuit__component-body" style={{ borderColor: `${def.color}44` }}>
                <span className="circuit__component-icon">{def.icon}</span>
                <span className="circuit__component-label">{def.label}</span>
                {comp.value && <span className="circuit__component-value">{comp.value}</span>}
                <button className="circuit__component-delete" onClick={(e) => { e.stopPropagation(); onRemoveComponent(comp.id) }}>
                  <X size={10} />
                </button>
              </div>
            </motion.div>
          )
        })}

        {/* Empty state */}
        {placedComponents.length === 0 && (
          <div className="circuit__empty-state">
            <div className="circuit__empty-state-icon">⚡</div>
            <p>Drag components from the palette<br />onto the canvas to start designing</p>
          </div>
        )}
      </div>
    </div>
  )
}
