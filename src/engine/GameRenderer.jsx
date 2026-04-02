import { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './GameRenderer.css'

/**
 * GameRenderer — Canvas-based game world that animates rover commands.
 * Receives commands from CodeSandbox results and plays them sequentially.
 */
const GameRenderer = forwardRef(function GameRenderer({ terrain, onCommandsComplete }, ref) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    rover: { x: 60, y: 300, color: '#a855f7', angle: 0 },
    particles: [],
    projectiles: [],
    crystals: [],
    signals: [],
    trail: [],
    phase: 'idle', // idle | running | success | error
    commandQueue: [],
    commandIndex: 0,
    animProgress: 0,
    asteroids: [],
    finishLine: 0,
    score: 0,
  })
  const animFrameRef = useRef(null)
  const [statusText, setStatusText] = useState('Write code and press ▶ Execute')
  const [showSuccess, setShowSuccess] = useState(false)

  // Initialize terrain-specific objects
  const initTerrain = useCallback((terrainType) => {
    const state = stateRef.current
    state.crystals = []
    state.asteroids = []
    state.finishLine = 0

    if (terrainType === 'crystals') {
      // Scatter crystals
      for (let i = 0; i < 8; i++) {
        state.crystals.push({
          x: 100 + Math.random() * 350,
          y: 80 + Math.random() * 300,
          collected: false,
          size: 6 + Math.random() * 4,
          hue: 180 + Math.random() * 60,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    } else if (terrainType === 'asteroids') {
      for (let i = 0; i < 12; i++) {
        state.asteroids.push({
          x: 100 + i * 35 + Math.random() * 20,
          y: 60 + Math.random() * 320,
          size: 12 + Math.random() * 20,
          speed: 0.3 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2,
        })
      }
    } else if (terrainType === 'race') {
      state.finishLine = 400
    }
  }, [])

  // Reset the game state
  const reset = useCallback((terrainType) => {
    const state = stateRef.current
    state.rover = { x: 60, y: 300, color: '#a855f7', angle: 0 }
    state.particles = []
    state.projectiles = []
    state.signals = []
    state.trail = []
    state.phase = 'idle'
    state.commandQueue = []
    state.commandIndex = 0
    state.animProgress = 0
    state.score = 0
    initTerrain(terrainType || terrain)
    setShowSuccess(false)
    setStatusText('Write code and press ▶ Execute')
  }, [terrain, initTerrain])

  // Play a sequence of commands
  const playCommands = useCallback((commands, finalState) => {
    const state = stateRef.current
    state.commandQueue = commands
    state.commandIndex = 0
    state.animProgress = 0
    state.phase = 'running'
    state.rover = { x: 60, y: 300, color: '#a855f7', angle: 0 }
    state.particles = []
    state.projectiles = []
    state.signals = []
    state.trail = []
    state.score = 0
    setShowSuccess(false)
    setStatusText('⚡ Executing your code...')

    // Store final state for validation
    state._finalState = finalState
  }, [])

  // Jump renderer to a specific step snapshot (for time-travel debugger)
  const jumpToStep = useCallback((snapshot, commands, stepIndex) => {
    const state = stateRef.current
    state.phase = 'paused'
    state.rover = {
      x: snapshot.x,
      y: snapshot.y,
      color: snapshot.color,
      angle: 0,
    }
    // Rebuild trail up to this step
    state.trail = []
    let tx = 60, ty = 300
    for (let i = 0; i <= stepIndex; i++) {
      const cmd = commands[i]
      if (!cmd) break
      if (cmd.type === 'move' || cmd.type === 'thrust') {
        tx += (cmd.dx || 0)
        ty += (cmd.dy || 0) - (cmd.lift || 0)
        state.trail.push({ x: tx, y: ty, age: 0 })
      }
    }
    state.particles = []
    state.signals = []
    state.projectiles = []
    state.score = snapshot.score || 0
    setStatusText(`🕐 Step ${stepIndex + 1} of ${commands.length}`)
  }, [])

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    reset,
    playCommands,
    jumpToStep,
  }), [reset, playCommands, jumpToStep])

  // Initialize on terrain change
  useEffect(() => {
    reset(terrain)
  }, [terrain, reset])

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let lastTime = performance.now()

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    function spawnParticles(x, y, count, color, speed) {
      const state = stateRef.current
      for (let i = 0; i < count; i++) {
        state.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          life: 1,
          decay: 0.01 + Math.random() * 0.02,
          size: 2 + Math.random() * 3,
          color,
        })
      }
    }

    function processCommand(state, dt) {
      if (state.commandIndex >= state.commandQueue.length) {
        if (state.phase === 'running') {
          state.phase = 'done'
          setStatusText('✅ Code execution complete!')
          if (onCommandsComplete) {
            onCommandsComplete(state._finalState)
          }
        }
        return
      }

      state.animProgress += dt * 3 // speed of animation

      if (state.animProgress >= 1) {
        // Apply the current command
        const cmd = state.commandQueue[state.commandIndex]
        const r = state.rover

        switch (cmd.type) {
          case 'move':
            r.x += cmd.dx
            r.y += cmd.dy
            state.trail.push({ x: r.x, y: r.y, age: 0 })
            if (state.trail.length > 50) state.trail.shift()
            break
          case 'thrust':
            r.y -= cmd.lift
            state.trail.push({ x: r.x, y: r.y, age: 0 })
            spawnParticles(r.x, r.y + 15, 8, '#f59e0b', 3)
            break
          case 'boost':
            spawnParticles(r.x, r.y, 12, '#60a5fa', 4)
            break
          case 'turn':
            r.angle += cmd.direction === 'right' ? 90 : -90
            break
          case 'collect': {
            let collected = false
            state.crystals.forEach(c => {
              if (!c.collected) {
                const dist = Math.hypot(c.x - r.x, c.y - r.y)
                if (dist < 60) {
                  c.collected = true
                  state.score++
                  collected = true
                  spawnParticles(c.x, c.y, 10, `hsl(${c.hue}, 80%, 60%)`, 3)
                }
              }
            })
            if (collected) {
              // Update score in the command system for final state
              if (state._finalState) state._finalState.score = state.score
            }
            break
          }
          case 'shoot':
            state.projectiles.push({
              x: r.x + 20,
              y: r.y,
              vx: 6,
              vy: 0,
              life: 1,
            })
            spawnParticles(r.x + 15, r.y, 4, '#ef4444', 2)
            break
          case 'signal':
            state.signals.push({
              text: cmd.message,
              x: r.x,
              y: r.y - 30,
              life: 3,
            })
            break
          case 'setColor':
            r.color = cmd.color
            break
          case 'log':
            // Logs are handled in the console panel, not the canvas
            break
          case 'error':
            state.phase = 'error'
            setStatusText(`❌ Error: ${cmd.error.message}`)
            break
          default:
            break
        }

        // Clamp rover position
        r.x = Math.max(15, Math.min(r.x, canvas.width - 15))
        r.y = Math.max(15, Math.min(r.y, canvas.height - 15))

        state.commandIndex++
        state.animProgress = 0
      }
    }

    function drawStars(w, h) {
      for (let i = 0; i < 80; i++) {
        const x = (i * 137.508 + 17) % w
        const y = (i * 97.123 + 31) % h
        const s = (i % 3) + 0.5
        const twinkle = 0.3 + Math.sin(performance.now() * 0.001 + i) * 0.3
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`
        ctx.beginPath()
        ctx.arc(x, y, s, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawTerrain(w, h, terrainType, time) {
      if (terrainType === 'crater') {
        const craterY = h * 0.65
        ctx.fillStyle = '#1a1040'
        ctx.beginPath()
        ctx.moveTo(0, craterY)
        ctx.quadraticCurveTo(w * 0.15, craterY - 20, w * 0.25, craterY + 30)
        ctx.quadraticCurveTo(w * 0.4, craterY + 80, w * 0.5, craterY + 60)
        ctx.quadraticCurveTo(w * 0.6, craterY + 80, w * 0.75, craterY + 30)
        ctx.quadraticCurveTo(w * 0.85, craterY - 20, w, craterY)
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fill()

        // Surface glow
        ctx.strokeStyle = 'rgba(108, 60, 224, 0.15)'
        ctx.lineWidth = 1
        for (let i = 0; i < 8; i++) {
          ctx.beginPath()
          ctx.arc(w * 0.1 + i * w * 0.1, craterY + 40 + (i % 3) * 15, 4 + (i % 4) * 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      } else if (terrainType === 'asteroids') {
        const state = stateRef.current
        state.asteroids.forEach(a => {
          a.y += Math.sin(time * 0.001 + a.angle) * a.speed
          ctx.fillStyle = '#2a1852'
          ctx.beginPath()
          ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = 'rgba(108, 60, 224, 0.3)'
          ctx.lineWidth = 1
          ctx.stroke()
        })
      } else if (terrainType === 'crystals') {
        const state = stateRef.current
        // Ground
        ctx.fillStyle = '#0f0d2e'
        ctx.fillRect(0, h * 0.82, w, h * 0.18)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)'
        ctx.lineWidth = 1
        for (let i = 0; i < w; i += 40) {
          ctx.beginPath()
          ctx.moveTo(i, h * 0.82)
          ctx.lineTo(i + 20, h)
          ctx.stroke()
        }

        // Draw uncollected crystals
        state.crystals.forEach(c => {
          if (c.collected) return
          const pulse = Math.sin(time * 0.003 + c.pulse) * 2
          ctx.fillStyle = `hsla(${c.hue}, 80%, 60%, 0.8)`
          ctx.shadowColor = `hsla(${c.hue}, 80%, 60%, 0.6)`
          ctx.shadowBlur = 10 + pulse
          // Diamond shape
          ctx.beginPath()
          ctx.moveTo(c.x, c.y - c.size - pulse)
          ctx.lineTo(c.x + c.size * 0.7, c.y)
          ctx.lineTo(c.x, c.y + c.size + pulse)
          ctx.lineTo(c.x - c.size * 0.7, c.y)
          ctx.closePath()
          ctx.fill()
          ctx.shadowBlur = 0
        })
      } else if (terrainType === 'race') {
        // Race track lines
        ctx.strokeStyle = 'rgba(108, 60, 224, 0.15)'
        ctx.lineWidth = 1
        for (let i = 0; i < h; i += 30) {
          ctx.beginPath()
          ctx.moveTo(0, i)
          ctx.lineTo(w, i)
          ctx.stroke()
        }

        // Finish line
        const finishX = 400
        if (finishX < w) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'
          ctx.fillRect(finishX - 2, 0, 4, h)
          ctx.fillStyle = 'rgba(16, 185, 129, 0.7)'
          ctx.font = 'bold 12px Orbitron, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('🏁 FINISH', finishX, 25)
        }

        // Start line
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)'
        ctx.fillRect(58, 0, 2, h)
      } else {
        // Free play — minimal grid
        ctx.strokeStyle = 'rgba(108, 60, 224, 0.06)'
        ctx.lineWidth = 1
        for (let x = 0; x < w; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
          ctx.stroke()
        }
        for (let y = 0; y < h; y += 50) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }
      }
    }

    function drawRover(r, time) {
      ctx.save()
      ctx.translate(r.x, r.y)

      // Trail glow — coords are absolute, draw before translate
      const state = stateRef.current
      if (state.trail.length > 1) {
        ctx.save()
        ctx.restore() // restore translate before drawing trail
      }
      ctx.restore()
      // Draw trail in absolute coords (outside translate)
      if (state.trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(state.trail[0].x, state.trail[0].y)
        state.trail.forEach(t => {
          ctx.lineTo(t.x, t.y)
          t.age += 0.01
        })
        ctx.strokeStyle = `${r.color}33`
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.save()
      ctx.translate(r.x, r.y)

      // Wheels
      ctx.fillStyle = '#444'
      ctx.beginPath()
      ctx.arc(-12, 12, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(12, 12, 5, 0, Math.PI * 2)
      ctx.fill()

      // Body
      ctx.fillStyle = r.color
      ctx.shadowColor = r.color
      ctx.shadowBlur = 12
      ctx.fillRect(-15, -5, 30, 15)
      ctx.shadowBlur = 0

      // Cabin
      ctx.fillStyle = shiftColor(r.color, 30)
      ctx.fillRect(-10, -14, 20, 12)

      // Eyes/windows
      ctx.fillStyle = '#fff'
      ctx.globalAlpha = 0.8 + Math.sin(time * 0.005) * 0.2
      ctx.fillRect(-6, -11, 5, 4)
      ctx.fillRect(2, -11, 5, 4)
      ctx.globalAlpha = 1

      // Antenna
      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -14)
      ctx.lineTo(0, -24)
      ctx.stroke()
      ctx.fillStyle = '#ef4444'
      const antennaGlow = Math.sin(time * 0.008) * 2
      ctx.beginPath()
      ctx.arc(0, -24, 3 + antennaGlow * 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Thruster flame when running
      if (state.phase === 'running') {
        ctx.fillStyle = `rgba(245, 158, 11, ${0.4 + Math.random() * 0.4})`
        ctx.beginPath()
        ctx.moveTo(-7, 15)
        ctx.lineTo(7, 15)
        ctx.lineTo(0, 22 + Math.random() * 12)
        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()
    }

    function drawParticles(dt) {
      const state = stateRef.current
      state.particles = state.particles.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0) return false
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        return true
      })
    }

    function drawProjectiles() {
      const state = stateRef.current
      state.projectiles = state.projectiles.filter(p => {
        p.x += p.vx
        p.life -= 0.01
        if (p.life <= 0 || p.x > canvas.width) return false
        ctx.fillStyle = '#ef4444'
        ctx.shadowColor = '#ef4444'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        // Trail
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'
        ctx.beginPath()
        ctx.arc(p.x - 8, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
        return true
      })
    }

    function drawSignals(dt) {
      const state = stateRef.current
      state.signals = state.signals.filter(s => {
        s.life -= dt
        s.y -= dt * 15
        if (s.life <= 0) return false
        ctx.globalAlpha = Math.min(s.life, 1)
        ctx.fillStyle = '#10b981'
        ctx.font = 'bold 13px Inter, sans-serif'
        ctx.textAlign = 'center'
        // Background pill
        const m = ctx.measureText(s.text)
        const px = 10, py = 4
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'
        ctx.beginPath()
        ctx.roundRect(s.x - m.width / 2 - px, s.y - 10 - py, m.width + px * 2, 20 + py * 2, 8)
        ctx.fill()
        ctx.fillStyle = '#34d399'
        ctx.fillText(s.text, s.x, s.y + 4)
        ctx.globalAlpha = 1
        return true
      })
    }

    function drawScoreOverlay() {
      const state = stateRef.current
      if (state.crystals.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.beginPath()
        ctx.roundRect(canvas.width - 90, 10, 80, 28, 6)
        ctx.fill()
        ctx.fillStyle = '#06b6d4'
        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(`💎 ${state.score}/${state.crystals.length}`, canvas.width - 18, 29)
      }
    }

    function render(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const w = canvas.width
      const h = canvas.height

      // Clear
      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, w, h)

      // Background
      drawStars(w, h)
      drawTerrain(w, h, terrain, time)

      // Process commands
      const state = stateRef.current
      if (state.phase === 'running') {
        processCommand(state, dt)
      }

      // Draw entities
      drawParticles(dt)
      drawProjectiles()
      drawRover(state.rover, time)
      drawSignals(dt)
      drawScoreOverlay()

      // Idle hint text
      if (state.phase === 'idle') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.font = '12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Press ▶ Execute to start the mission', w / 2, h - 20)
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    resize()
    animFrameRef.current = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [terrain, onCommandsComplete])

  return (
    <div className="game-renderer">
      <canvas ref={canvasRef} className="game-renderer__canvas" />
      <div className="game-renderer__status">{statusText}</div>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="game-renderer__success-overlay"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            🎉 Mission Complete!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

// Lighten/darken a hex color
function shiftColor(hex, amount) {
  try {
    hex = hex.replace('#', '')
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount)
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount)
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount)
    return `rgb(${r}, ${g}, ${b})`
  } catch {
    return '#c084fc'
  }
}

export default GameRenderer
