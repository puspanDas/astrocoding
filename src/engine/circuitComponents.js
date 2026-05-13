// ============================================
// Circuit Design Lab — Components & Scenarios
// ============================================

// ——— Component Definitions ———
export const CIRCUIT_COMPONENTS = {
  // Sources
  'dc-source':     { label: 'DC Source',      icon: '🔋', color: '#EF4444', desc: 'DC voltage source', category: 'sources', defaultValue: '5V', pins: ['V+','V-'] },
  'ac-source':     { label: 'AC Source',       icon: '〰️', color: '#F59E0B', desc: 'AC voltage source', category: 'sources', defaultValue: '5Vpp 50Hz', pins: ['V+','V-'] },
  'ground':        { label: 'Ground',          icon: '⏚',  color: '#6B7280', desc: 'Circuit ground reference', category: 'sources', defaultValue: '0V', pins: ['GND'] },
  'current-src':   { label: 'Current Source',  icon: '⇡',  color: '#8B5CF6', desc: 'Constant current source', category: 'sources', defaultValue: '10mA', pins: ['I+','I-'] },

  // Passive
  'resistor':      { label: 'Resistor',        icon: '⊼',  color: '#10B981', desc: 'Limits current flow', category: 'passive', defaultValue: '1kΩ', pins: ['1','2'] },
  'capacitor':     { label: 'Capacitor',       icon: '⊥',  color: '#3B82F6', desc: 'Stores charge, blocks DC', category: 'passive', defaultValue: '100µF', pins: ['1','2'] },
  'inductor':      { label: 'Inductor',        icon: '⌇',  color: '#6366F1', desc: 'Stores energy in magnetic field', category: 'passive', defaultValue: '10mH', pins: ['1','2'] },
  'potentiometer': { label: 'Potentiometer',   icon: '⊗',  color: '#14B8A6', desc: 'Variable resistor', category: 'passive', defaultValue: '10kΩ', pins: ['1','W','2'] },

  // Active
  'diode':         { label: 'Diode',           icon: '▷|', color: '#F43F5E', desc: 'Allows current in one direction', category: 'active', defaultValue: '1N4007', pins: ['A','K'] },
  'led':           { label: 'LED',             icon: '💡', color: '#FBBF24', desc: 'Light emitting diode', category: 'active', defaultValue: 'Red 2V', pins: ['A','K'] },
  'zener':         { label: 'Zener Diode',     icon: '⚡',  color: '#EC4899', desc: 'Voltage regulator diode', category: 'active', defaultValue: '5.1V', pins: ['A','K'] },
  'npn':           { label: 'NPN Transistor',  icon: '🔺', color: '#8B5CF6', desc: 'NPN BJT for switching/amplifying', category: 'active', defaultValue: '2N2222', pins: ['B','C','E'] },
  'pnp':           { label: 'PNP Transistor',  icon: '🔻', color: '#A855F7', desc: 'PNP BJT', category: 'active', defaultValue: '2N2907', pins: ['B','C','E'] },
  'nmos':          { label: 'N-MOSFET',        icon: 'Ⓝ',  color: '#0EA5E9', desc: 'N-channel MOSFET', category: 'active', defaultValue: 'IRF540', pins: ['G','D','S'] },
  'opamp':         { label: 'Op-Amp',          icon: '△',  color: '#F97316', desc: 'Operational amplifier', category: 'active', defaultValue: 'LM741', pins: ['IN+','IN-','OUT','V+','V-'] },

  // ICs
  'ic-555':        { label: '555 Timer',       icon: '⏱️', color: '#EF4444', desc: 'Classic timer/oscillator IC', category: 'ics', defaultValue: 'NE555', pins: ['GND','TRIG','OUT','RST','CTRL','THR','DIS','VCC'] },
  'ic-7805':       { label: '7805 Regulator',  icon: '⚙️', color: '#10B981', desc: '5V voltage regulator', category: 'ics', defaultValue: '7805', pins: ['IN','GND','OUT'] },
  'ic-lm317':      { label: 'LM317',          icon: '🔧', color: '#6366F1', desc: 'Adjustable voltage regulator', category: 'ics', defaultValue: 'LM317', pins: ['IN','ADJ','OUT'] },

  // Instruments
  'voltmeter':     { label: 'Voltmeter',       icon: 'Ⓥ',  color: '#3B82F6', desc: 'Measures voltage', category: 'instruments', defaultValue: '', pins: ['V+','V-'] },
  'ammeter':       { label: 'Ammeter',         icon: 'Ⓐ',  color: '#EF4444', desc: 'Measures current', category: 'instruments', defaultValue: '', pins: ['I+','I-'] },
  'scope':         { label: 'Oscilloscope',    icon: '📊', color: '#10B981', desc: 'Displays waveforms', category: 'instruments', defaultValue: '', pins: ['CH1','GND'] },
}

export const CIRCUIT_COMPONENT_MAP = CIRCUIT_COMPONENTS

export const CIRCUIT_CATEGORIES = [
  { id: 'sources', label: '⚡ Sources', components: ['dc-source','ac-source','ground','current-src'].map(t => ({ type: t, ...CIRCUIT_COMPONENTS[t] })) },
  { id: 'passive', label: '🔩 Passive', components: ['resistor','capacitor','inductor','potentiometer'].map(t => ({ type: t, ...CIRCUIT_COMPONENTS[t] })) },
  { id: 'active', label: '🔺 Active', components: ['diode','led','zener','npn','pnp','nmos','opamp'].map(t => ({ type: t, ...CIRCUIT_COMPONENTS[t] })) },
  { id: 'ics', label: '🧮 ICs', components: ['ic-555','ic-7805','ic-lm317'].map(t => ({ type: t, ...CIRCUIT_COMPONENTS[t] })) },
  { id: 'instruments', label: '📏 Instruments', components: ['voltmeter','ammeter','scope'].map(t => ({ type: t, ...CIRCUIT_COMPONENTS[t] })) },
]

// ——— Scenarios ———
export const circuitScenarios = [
  {
    id: 'sandbox',
    title: 'Sandbox',
    icon: '🔧',
    description: 'Free-form circuit design. Place any components and wire them up. Use the AI assistant for guidance.',
    difficulty: 0,
    requiredComponents: [],
    requiredConnections: [],
    hints: [
      "Start by placing a DC voltage source and a ground.",
      "Add components between the source terminals.",
      "Use the wire tool to connect component pins.",
      "Click 'Simulate' to see current flow through your circuit.",
    ],
    expectedVoltages: {},
  },
  {
    id: 'led-driver',
    title: 'LED Driver',
    icon: '💡',
    description: 'Design a simple LED circuit with a current-limiting resistor. The most fundamental circuit in electronics.',
    difficulty: 1,
    requiredComponents: ['dc-source', 'resistor', 'led', 'ground'],
    requiredConnections: [['dc-source','resistor'],['resistor','led'],['led','ground']],
    hints: [
      "Step 1: Place a 5V DC source — this powers your circuit.",
      "Step 2: Add a resistor (330Ω recommended) — this limits current to protect the LED.",
      "Step 3: Place an LED — it lights up when current flows through it.",
      "Step 4: Add a ground — every circuit needs a return path.",
      "Step 5: Wire them in series: DC+ → Resistor → LED (Anode→Cathode) → Ground.",
      "💡 Ohm's Law: R = (Vsource - Vled) / I = (5V - 2V) / 0.02A = 150Ω minimum.",
    ],
    expectedVoltages: { 'led': '2V', 'resistor': '3V' },
  },
  {
    id: 'voltage-divider',
    title: 'Voltage Divider',
    icon: '⚡',
    description: 'Create a voltage divider using two resistors to produce a lower voltage from a higher source.',
    difficulty: 1,
    requiredComponents: ['dc-source', 'resistor', 'resistor', 'ground'],
    requiredConnections: [['dc-source','resistor'],['resistor','resistor'],['resistor','ground']],
    hints: [
      "Step 1: Place a DC source (e.g., 10V).",
      "Step 2: Place two resistors in series.",
      "Step 3: Connect: V+ → R1 → R2 → Ground.",
      "Step 4: The output voltage is taken from the junction between R1 and R2.",
      "💡 Formula: Vout = Vin × (R2 / (R1 + R2)). With equal resistors, Vout = Vin/2.",
    ],
    expectedVoltages: {},
  },
  {
    id: 'rc-filter',
    title: 'RC Low-Pass Filter',
    icon: '〰️',
    description: 'Build an RC filter that passes low frequencies and attenuates high frequencies.',
    difficulty: 2,
    requiredComponents: ['ac-source', 'resistor', 'capacitor', 'ground'],
    requiredConnections: [['ac-source','resistor'],['resistor','capacitor'],['capacitor','ground']],
    hints: [
      "Step 1: Place an AC source — this provides a time-varying signal.",
      "Step 2: Add a resistor (1kΩ).",
      "Step 3: Add a capacitor (1µF).",
      "Step 4: Wire in series: AC → Resistor → Capacitor → Ground.",
      "Step 5: Output is taken across the capacitor.",
      "💡 Cutoff frequency: fc = 1/(2π×R×C) ≈ 159 Hz for 1kΩ and 1µF.",
    ],
    expectedVoltages: {},
  },
  {
    id: 'ce-amplifier',
    title: 'Common Emitter Amp',
    icon: '🔺',
    description: 'Design a common-emitter amplifier using an NPN transistor with biasing resistors.',
    difficulty: 3,
    requiredComponents: ['dc-source', 'npn', 'resistor', 'resistor', 'resistor', 'capacitor', 'ground'],
    requiredConnections: [['dc-source','resistor'],['resistor','npn'],['npn','resistor'],['resistor','ground']],
    hints: [
      "Step 1: Place DC source (12V) and ground.",
      "Step 2: Add an NPN transistor — this is your amplifier.",
      "Step 3: Add collector resistor (Rc) from V+ to collector.",
      "Step 4: Add base bias resistors (voltage divider to set operating point).",
      "Step 5: Add emitter resistor (Re) for thermal stability.",
      "Step 6: Add coupling capacitor at input to block DC.",
      "💡 The transistor amplifies the small AC signal at the base into a larger signal at the collector.",
    ],
    expectedVoltages: {},
  },
  {
    id: 'timer-555',
    title: '555 Astable Timer',
    icon: '⏱️',
    description: 'Build an astable multivibrator using the 555 timer IC to generate a square wave.',
    difficulty: 3,
    requiredComponents: ['dc-source', 'ic-555', 'resistor', 'resistor', 'capacitor', 'ground'],
    requiredConnections: [['dc-source','ic-555'],['ic-555','resistor'],['resistor','capacitor'],['capacitor','ground']],
    hints: [
      "Step 1: Place the 555 IC and connect VCC (pin 8) to DC source, GND (pin 1) to ground.",
      "Step 2: Connect RST (pin 4) to VCC.",
      "Step 3: Add R1 between VCC and DIS (pin 7).",
      "Step 4: Add R2 between DIS (pin 7) and THR/TRIG (pins 6,2 connected together).",
      "Step 5: Add timing capacitor from THR/TRIG to ground.",
      "Step 6: Output square wave appears on OUT (pin 3).",
      "💡 Frequency = 1.44 / ((R1 + 2×R2) × C). Duty cycle depends on R1/R2 ratio.",
    ],
    expectedVoltages: {},
  },
  {
    id: 'vreg-7805',
    title: 'Voltage Regulator',
    icon: '⚙️',
    description: 'Build a regulated 5V power supply using the 7805 IC with input/output filter capacitors.',
    difficulty: 2,
    requiredComponents: ['dc-source', 'ic-7805', 'capacitor', 'capacitor', 'ground'],
    requiredConnections: [['dc-source','capacitor'],['capacitor','ic-7805'],['ic-7805','capacitor'],['ic-7805','ground']],
    hints: [
      "Step 1: Place a DC source (9-12V unregulated input).",
      "Step 2: Add input filter capacitor (0.33µF) close to the 7805 input pin.",
      "Step 3: Place the 7805 regulator IC.",
      "Step 4: Add output filter capacitor (0.1µF) at the output.",
      "Step 5: Connect GND pin of 7805 to ground.",
      "💡 The 7805 outputs a steady 5V regardless of input variations (7V-35V input range).",
    ],
    expectedVoltages: { 'ic-7805': '5V' },
  },
  {
    id: 'opamp-inverting',
    title: 'Inverting Amplifier',
    icon: '△',
    description: 'Design an inverting amplifier using an op-amp with input and feedback resistors.',
    difficulty: 3,
    requiredComponents: ['dc-source', 'dc-source', 'opamp', 'resistor', 'resistor', 'ground'],
    requiredConnections: [['resistor','opamp'],['opamp','resistor']],
    hints: [
      "Step 1: Place the op-amp and connect its power pins (V+ to +12V, V- to -12V).",
      "Step 2: Connect the non-inverting input (IN+) to ground.",
      "Step 3: Add input resistor (Rin, e.g., 1kΩ) to the inverting input (IN-).",
      "Step 4: Add feedback resistor (Rf, e.g., 10kΩ) from output to inverting input.",
      "Step 5: Apply input signal through Rin.",
      "💡 Gain = -Rf/Rin = -10kΩ/1kΩ = -10. The minus sign means the output is inverted.",
    ],
    expectedVoltages: {},
  },
]

// ——— Validation ———
export function validateCircuit(scenario, components, connections) {
  if (scenario.requiredComponents.length === 0) {
    return { passed: true, score: 0, checks: [], feedback: 'Sandbox mode — no validation required.' }
  }

  const checks = []
  let score = 0

  // Check required component types
  const placedTypes = components.map(c => c.type)
  const requiredCounts = {}
  scenario.requiredComponents.forEach(t => { requiredCounts[t] = (requiredCounts[t] || 0) + 1 })

  let allComponentsPresent = true
  Object.entries(requiredCounts).forEach(([type, count]) => {
    const placed = placedTypes.filter(t => t === type).length
    const compDef = CIRCUIT_COMPONENTS[type]
    const ok = placed >= count
    checks.push({
      label: `${compDef?.label || type} (×${count})`,
      passed: ok,
    })
    if (ok) score += 10
    else allComponentsPresent = false
  })

  // Check connections exist
  const hasConnections = connections.length > 0
  checks.push({ label: 'Components are wired together', passed: hasConnections })
  if (hasConnections) score += 10

  // Check minimum connection count
  const minConns = scenario.requiredConnections.length
  const enoughConns = connections.length >= minConns
  checks.push({ label: `At least ${minConns} connections`, passed: enoughConns })
  if (enoughConns) score += 10

  // Check ground present
  const hasGround = placedTypes.includes('ground')
  checks.push({ label: 'Ground reference present', passed: hasGround })
  if (hasGround) score += 5

  // Check for source
  const hasSource = placedTypes.some(t => ['dc-source', 'ac-source'].includes(t))
  checks.push({ label: 'Power source present', passed: hasSource })
  if (hasSource) score += 5

  const passed = allComponentsPresent && hasConnections && enoughConns && hasGround && hasSource

  return {
    passed,
    score: passed ? Math.max(score, 50) : score,
    checks,
    feedback: passed
      ? '✅ Circuit design meets all requirements!'
      : '⚠️ Some requirements are not met. Check the list above.',
  }
}

// ——— Simulation: generate flow steps ———
export function generateCircuitFlowSteps(components, connections) {
  if (connections.length === 0 || components.length === 0) return []

  const steps = []
  const visited = new Set()

  // Find source components
  const sources = components.filter(c => ['dc-source', 'ac-source', 'current-src'].includes(c.type))
  if (sources.length === 0) return []

  // BFS from sources through connections
  const queue = [...sources.map(s => s.id)]
  visited.add(queue[0])

  while (queue.length > 0) {
    const currentId = queue.shift()
    const current = components.find(c => c.id === currentId)
    if (!current) continue

    connections.forEach((conn, idx) => {
      let nextId = null
      if (conn.from === currentId && !visited.has(conn.to)) nextId = conn.to
      if (conn.to === currentId && !visited.has(conn.from)) nextId = conn.from

      if (nextId) {
        visited.add(nextId)
        const next = components.find(c => c.id === nextId)
        if (next) {
          const fromDef = CIRCUIT_COMPONENTS[current.type]
          const toDef = CIRCUIT_COMPONENTS[next.type]
          steps.push({
            connIndex: idx,
            fromId: currentId,
            toId: nextId,
            description: `Current flows: ${fromDef?.label} → ${toDef?.label}`,
          })
          queue.push(nextId)
        }
      }
    })
  }

  return steps
}

// ——— Sandbox analysis for AI advisor ———
export function analyzeCircuitDesign(components, connections) {
  const types = components.map(c => c.type)
  const issues = []
  const suggestions = []
  let score = 0

  if (components.length === 0) {
    return { score: 0, grade: '—', issues: [], suggestions: ['Start by placing a DC source and ground.'], tips: [] }
  }

  // Check for power source
  if (!types.some(t => ['dc-source', 'ac-source'].includes(t))) {
    issues.push('No power source — every circuit needs a voltage or current source.')
    suggestions.push('Add a DC or AC voltage source.')
  } else { score += 20 }

  // Check for ground
  if (!types.includes('ground')) {
    issues.push('No ground reference — voltages are undefined without a ground.')
    suggestions.push('Add a ground symbol to define the 0V reference point.')
  } else { score += 15 }

  // Check connections
  if (connections.length === 0 && components.length > 1) {
    issues.push('No wires — components are not connected.')
    suggestions.push('Use the wire tool to connect component pins together.')
  } else if (connections.length > 0) {
    score += 15
  }

  // Check for floating components
  const connectedIds = new Set()
  connections.forEach(c => { connectedIds.add(c.from); connectedIds.add(c.to) })
  const floating = components.filter(c => !connectedIds.has(c.id))
  if (floating.length > 0 && components.length > 1) {
    issues.push(`${floating.length} component(s) not connected to anything.`)
  }

  // Positive feedback
  if (types.includes('resistor') && types.includes('led')) {
    suggestions.push('Good — you have a current-limiting resistor for the LED.')
    score += 10
  }
  if (types.includes('capacitor')) {
    suggestions.push('Capacitors are great for filtering and energy storage.')
    score += 5
  }

  // Complexity bonus
  score += Math.min(components.length * 3, 20)
  score += Math.min(connections.length * 2, 15)
  score = Math.min(score, 100)

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F'

  return { score, grade, issues, suggestions, tips: [] }
}

// ——— Circuit Integrity Test (Fault Detection) ———
export function testCircuitIntegrity(components, connections) {
  const faults = []          // { type, severity, message, connIndex? }
  const faultyConnIndices = new Set()
  const types = components.map(c => c.type)

  if (components.length === 0) {
    return { passed: false, faults: [{ type: 'empty', severity: 'error', message: 'No components placed on the canvas.' }], faultyConnIndices: [], status: 'NO CIRCUIT' }
  }

  // 1) No power source
  const hasPower = types.some(t => ['dc-source', 'ac-source', 'current-src'].includes(t))
  if (!hasPower) {
    faults.push({ type: 'no-power', severity: 'error', message: '🔴 FAULT: No power source — circuit has no energy to operate.' })
  }

  // 2) No ground
  if (!types.includes('ground')) {
    faults.push({ type: 'no-ground', severity: 'error', message: '🔴 FAULT: No ground reference — voltages are undefined. Every circuit needs a ground.' })
  }

  // 3) Open circuit — components not connected
  const connectedIds = new Set()
  connections.forEach(c => { connectedIds.add(c.from); connectedIds.add(c.to) })
  const floating = components.filter(c => !connectedIds.has(c.id))
  if (floating.length > 0 && components.length > 1) {
    floating.forEach(fc => {
      const def = CIRCUIT_COMPONENTS[fc.type]
      faults.push({ type: 'floating', severity: 'warning', message: `🟡 OPEN: ${def?.label || fc.type} is not connected — it will not function.` })
    })
  }

  // 4) No connections at all
  if (connections.length === 0 && components.length > 1) {
    faults.push({ type: 'no-wires', severity: 'error', message: '🔴 FAULT: No wires — components are completely disconnected. Circuit is open.' })
  }

  // 5) Short circuit — source directly connected to ground
  connections.forEach((conn, idx) => {
    const fromComp = components.find(c => c.id === conn.from)
    const toComp = components.find(c => c.id === conn.to)
    if (!fromComp || !toComp) return

    const pair = [fromComp.type, toComp.type]
    const isSourceToGround = (
      (pair.includes('dc-source') || pair.includes('ac-source') || pair.includes('current-src')) &&
      pair.includes('ground')
    )
    if (isSourceToGround) {
      faults.push({ type: 'short', severity: 'critical', message: `🔴 SHORT CIRCUIT: ${CIRCUIT_COMPONENTS[fromComp.type]?.label} directly connected to ${CIRCUIT_COMPONENTS[toComp.type]?.label} — this will cause infinite current and component damage!`, connIndex: idx })
      faultyConnIndices.add(idx)
    }
  })

  // 6) Source-to-source direct connection
  connections.forEach((conn, idx) => {
    const fromComp = components.find(c => c.id === conn.from)
    const toComp = components.find(c => c.id === conn.to)
    if (!fromComp || !toComp) return
    const sources = ['dc-source', 'ac-source', 'current-src']
    if (sources.includes(fromComp.type) && sources.includes(toComp.type)) {
      faults.push({ type: 'source-clash', severity: 'critical', message: `🔴 FAULT: ${CIRCUIT_COMPONENTS[fromComp.type]?.label} connected directly to ${CIRCUIT_COMPONENTS[toComp.type]?.label} — conflicting sources will fight each other!`, connIndex: idx })
      faultyConnIndices.add(idx)
    }
  })

  // 7) LED without current-limiting resistor
  const hasLed = types.includes('led')
  const hasResistor = types.includes('resistor')
  if (hasLed && !hasResistor) {
    faults.push({ type: 'led-no-resistor', severity: 'warning', message: '🟡 WARNING: LED placed without a current-limiting resistor — the LED will likely burn out!' })
  }

  // 8) LED connected directly to source (no resistor in path)
  if (hasLed && hasPower) {
    connections.forEach((conn, idx) => {
      const fromComp = components.find(c => c.id === conn.from)
      const toComp = components.find(c => c.id === conn.to)
      if (!fromComp || !toComp) return
      const pair = [fromComp.type, toComp.type]
      if (pair.includes('led') && (pair.includes('dc-source') || pair.includes('ac-source'))) {
        faults.push({ type: 'led-direct', severity: 'warning', message: '🟡 WARNING: LED wired directly to power source — add a resistor in series to limit current.', connIndex: idx })
        faultyConnIndices.add(idx)
      }
    })
  }

  // 9) Ground-to-ground connection (redundant but not harmful)
  connections.forEach((conn, idx) => {
    const fromComp = components.find(c => c.id === conn.from)
    const toComp = components.find(c => c.id === conn.to)
    if (!fromComp || !toComp) return
    if (fromComp.type === 'ground' && toComp.type === 'ground') {
      faults.push({ type: 'gnd-loop', severity: 'info', message: 'ℹ️ INFO: Two ground symbols connected together — redundant but harmless.', connIndex: idx })
    }
  })

  // 10) Incomplete loop — source exists but no path back to ground
  if (hasPower && types.includes('ground') && connections.length > 0) {
    const sourceComps = components.filter(c => ['dc-source', 'ac-source', 'current-src'].includes(c.type))
    const groundComps = components.filter(c => c.type === 'ground')

    // BFS from any source to see if ground is reachable
    let groundReachable = false
    const visited = new Set()
    const queue = sourceComps.map(s => s.id)
    queue.forEach(id => visited.add(id))

    while (queue.length > 0) {
      const cur = queue.shift()
      if (groundComps.some(g => g.id === cur)) { groundReachable = true; break }
      connections.forEach(conn => {
        let next = null
        if (conn.from === cur && !visited.has(conn.to)) next = conn.to
        if (conn.to === cur && !visited.has(conn.from)) next = conn.from
        if (next) { visited.add(next); queue.push(next) }
      })
    }

    if (!groundReachable) {
      faults.push({ type: 'open-loop', severity: 'error', message: '🔴 OPEN LOOP: No complete path from power source to ground — current cannot flow. Check your wiring.' })
    }
  }

  // Determine overall status
  const hasCritical = faults.some(f => f.severity === 'critical')
  const hasError = faults.some(f => f.severity === 'error')
  const hasWarning = faults.some(f => f.severity === 'warning')
  const passed = !hasCritical && !hasError

  let status = 'PASS ✅'
  if (hasCritical) status = 'CRITICAL FAULT ⛔'
  else if (hasError) status = 'FAIL ❌'
  else if (hasWarning) status = 'PASS WITH WARNINGS ⚠️'

  return { passed, faults, faultyConnIndices: [...faultyConnIndices], status }
}
