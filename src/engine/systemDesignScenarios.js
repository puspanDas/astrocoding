// ============================================
// System Design Lab — Scenarios & Component Definitions
// ============================================

// ——— Component Definitions ———
// Each component type the user can drag onto the canvas.
export const COMPONENT_CATEGORIES = [
  {
    id: 'clients',
    label: 'Clients',
    components: [
      { type: 'web-client',    label: 'Web Client',    icon: '🌐', color: '#60a5fa', desc: 'Browser-based frontend application' },
      { type: 'mobile-client', label: 'Mobile App',    icon: '📱', color: '#818cf8', desc: 'Native mobile application (iOS/Android)' },
    ]
  },
  {
    id: 'compute',
    label: 'Compute',
    components: [
      { type: 'server',        label: 'Server',        icon: '🖥️', color: '#a78bfa', desc: 'Application server handling business logic' },
      { type: 'api-gateway',   label: 'API Gateway',   icon: '🚪', color: '#c084fc', desc: 'Entry point that routes requests to services' },
      { type: 'microservice',  label: 'Microservice',  icon: '⚙️', color: '#e879f9', desc: 'Small, independent service for a specific domain' },
      { type: 'serverless',    label: 'Serverless Fn',  icon: '⚡', color: '#f472b6', desc: 'Function-as-a-service for event-driven tasks' },
    ]
  },
  {
    id: 'storage',
    label: 'Storage',
    components: [
      { type: 'sql-db',        label: 'SQL Database',   icon: '🗄️', color: '#34d399', desc: 'Relational database (PostgreSQL, MySQL)' },
      { type: 'nosql-db',      label: 'NoSQL DB',       icon: '📦', color: '#6ee7b7', desc: 'Document/key-value store (MongoDB, DynamoDB)' },
      { type: 'object-storage',label: 'Object Storage', icon: '☁️', color: '#2dd4bf', desc: 'Blob storage for files, images, videos (S3)' },
      { type: 'cache',         label: 'Cache',          icon: '💎', color: '#fbbf24', desc: 'In-memory cache for fast reads (Redis, Memcached)' },
    ]
  },
  {
    id: 'networking',
    label: 'Networking',
    components: [
      { type: 'load-balancer', label: 'Load Balancer',  icon: '⚖️', color: '#fb923c', desc: 'Distributes traffic across multiple servers' },
      { type: 'cdn',           label: 'CDN',            icon: '🌍', color: '#fdba74', desc: 'Content Delivery Network for static assets' },
      { type: 'dns',           label: 'DNS',            icon: '🔗', color: '#fca5a1', desc: 'Domain Name System for resolving URLs' },
    ]
  },
  {
    id: 'messaging',
    label: 'Messaging',
    components: [
      { type: 'message-queue', label: 'Message Queue',  icon: '📨', color: '#f87171', desc: 'Async message broker (RabbitMQ, SQS)' },
      { type: 'event-stream',  label: 'Event Stream',   icon: '🌊', color: '#fb7185', desc: 'Real-time event streaming (Kafka)' },
      { type: 'websocket',     label: 'WebSocket',      icon: '🔌', color: '#f472b6', desc: 'Persistent bidirectional connection' },
    ]
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    components: [
      { type: 'logging',       label: 'Log Service',    icon: '📋', color: '#a1a1aa', desc: 'Centralized logging (ELK, CloudWatch)' },
      { type: 'monitoring',    label: 'Monitoring',     icon: '📊', color: '#94a3b8', desc: 'Metrics and alerting (Prometheus, Grafana)' },
    ]
  },
]

// Flat lookup for component definitions
export const COMPONENT_MAP = {}
COMPONENT_CATEGORIES.forEach(cat => {
  cat.components.forEach(comp => {
    COMPONENT_MAP[comp.type] = comp
  })
})

// ——— Flow Descriptions for Simulation ———
// Describes what happens when data flows between two component types.
export const FLOW_DESCRIPTIONS = {
  'web-client->server':        '🌐 User sends HTTP request to the application server',
  'web-client->load-balancer': '🌐 User request hits the load balancer',
  'web-client->cdn':           '🌐 Browser fetches static assets from the CDN',
  'web-client->dns':           '🌐 Browser resolves domain name via DNS',
  'web-client->api-gateway':   '🌐 Client sends API request to the gateway',
  'web-client->websocket':     '🌐 Client opens persistent WebSocket connection',
  'mobile-client->api-gateway':'📱 Mobile app calls the API gateway',
  'mobile-client->cdn':        '📱 Mobile app loads media from CDN',
  'mobile-client->load-balancer':'📱 Mobile app request hits load balancer',
  'dns->load-balancer':        '🔗 DNS resolves to load balancer IP address',
  'load-balancer->server':     '⚖️ Load balancer forwards request to a healthy server',
  'load-balancer->api-gateway':'⚖️ Load balancer routes traffic to API gateway',
  'api-gateway->microservice': '🚪 API Gateway routes request to the appropriate microservice',
  'api-gateway->server':       '🚪 API Gateway forwards to application server',
  'api-gateway->serverless':   '🚪 API Gateway triggers serverless function',
  'server->sql-db':            '🖥️ Server queries the SQL database',
  'server->nosql-db':          '🖥️ Server reads/writes to NoSQL database',
  'server->cache':             '🖥️ Server checks cache for fast data retrieval',
  'server->message-queue':     '🖥️ Server publishes async task to message queue',
  'server->object-storage':    '🖥️ Server uploads/retrieves files from object storage',
  'server->event-stream':      '🖥️ Server publishes event to the stream',
  'microservice->sql-db':      '⚙️ Microservice queries relational database',
  'microservice->nosql-db':    '⚙️ Microservice reads/writes NoSQL store',
  'microservice->cache':       '⚙️ Microservice checks in-memory cache',
  'microservice->message-queue':'⚙️ Microservice enqueues async job',
  'microservice->object-storage':'⚙️ Microservice stores/retrieves files',
  'microservice->event-stream':'⚙️ Microservice publishes to event stream',
  'microservice->microservice':'⚙️ Microservice calls another microservice (inter-service)',
  'message-queue->microservice':'📨 Queue delivers job to worker microservice',
  'message-queue->server':     '📨 Queue delivers message to consumer server',
  'message-queue->serverless': '📨 Queue triggers serverless function',
  'message-queue->event-stream':'📨 Queue feeds events into the stream pipeline',
  'event-stream->microservice':'🌊 Event stream delivers to consuming microservice',
  'event-stream->serverless':  '🌊 Event stream triggers serverless processor',
  'websocket->server':         '🔌 WebSocket relays real-time message to server',
  'cdn->object-storage':       '🌍 CDN pulls origin content from object storage',
  'cache->sql-db':             '💎 Cache miss — falling back to database query',
  'serverless->sql-db':        '⚡ Serverless function queries database',
  'serverless->nosql-db':      '⚡ Serverless function accesses NoSQL store',
  'serverless->object-storage':'⚡ Serverless function processes stored files',
  'monitoring->server':        '📊 Monitoring collects metrics from server',
  'logging->server':           '📋 Log service aggregates server logs',
}

/**
 * Generates a simulation flow order from the user's connections.
 * Uses BFS starting from client-type nodes to traverse the architecture.
 * @param {Array} placedComponents
 * @param {Array} connections
 * @returns {Array<{ connIndex: number, from: Object, to: Object, description: string }>}
 */
export function generateFlowSteps(placedComponents, connections) {
  if (connections.length === 0) return []

  const idToComp = {}
  placedComponents.forEach(c => { idToComp[c.id] = c })

  // Build adjacency list
  const adj = {}
  placedComponents.forEach(c => { adj[c.id] = [] })
  connections.forEach((conn, idx) => {
    if (adj[conn.from]) adj[conn.from].push({ to: conn.to, idx })
  })

  // Find client/entry nodes (web-client, mobile-client, dns)
  const entryTypes = new Set(['web-client', 'mobile-client', 'dns'])
  const entryNodes = placedComponents.filter(c => entryTypes.has(c.type))

  // If no entry nodes, just use the first component connected as "from"
  if (entryNodes.length === 0 && connections.length > 0) {
    const firstFrom = placedComponents.find(c => c.id === connections[0].from)
    if (firstFrom) entryNodes.push(firstFrom)
  }

  // BFS to build ordered flow
  const visited = new Set()
  const steps = []
  const queue = [...entryNodes.map(n => n.id)]

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (visited.has(currentId)) continue
    visited.add(currentId)

    const neighbors = adj[currentId] || []
    for (const { to, idx } of neighbors) {
      const fromComp = idToComp[currentId]
      const toComp = idToComp[to]
      if (!fromComp || !toComp) continue

      const fromType = fromComp.type
      const toType = toComp.type
      const key = `${fromType}->${toType}`
      const reverseKey = `${toType}->${fromType}`

      const description = FLOW_DESCRIPTIONS[key]
        || FLOW_DESCRIPTIONS[reverseKey]
        || `${COMPONENT_MAP[fromType]?.icon || '❓'} ${COMPONENT_MAP[fromType]?.label} sends data to ${COMPONENT_MAP[toType]?.icon || '❓'} ${COMPONENT_MAP[toType]?.label}`

      steps.push({
        connIndex: idx,
        fromId: currentId,
        toId: to,
        from: fromComp,
        to: toComp,
        description,
      })

      if (!visited.has(to)) {
        queue.push(to)
      }
    }
  }

  // Add any connections not reached by BFS (disconnected subgraphs)
  connections.forEach((conn, idx) => {
    if (!steps.some(s => s.connIndex === idx)) {
      const fromComp = idToComp[conn.from]
      const toComp = idToComp[conn.to]
      if (fromComp && toComp) {
        const key = `${fromComp.type}->${toComp.type}`
        steps.push({
          connIndex: idx,
          fromId: conn.from,
          toId: conn.to,
          from: fromComp,
          to: toComp,
          description: FLOW_DESCRIPTIONS[key] || `${COMPONENT_MAP[fromComp.type]?.label} → ${COMPONENT_MAP[toComp.type]?.label}`,
        })
      }
    }
  })

  return steps
}

// ——— Scenario Definitions ———
export const scenarios = [
  {
    id: 'personal-blog',
    title: 'Personal Blog',
    icon: '📝',
    difficulty: 1,
    description: 'Design a simple personal blog where users can read articles. Think about what components you need to serve web pages and store content.',
    hints: [
      '💡 Every web app starts with a client that users interact with.',
      '💡 You need somewhere to run your application logic.',
      '💡 Blog posts need to be stored persistently — think database.',
    ],
    requiredComponents: ['web-client', 'server', 'sql-db'],
    requiredConnections: [
      ['web-client', 'server'],
      ['server', 'sql-db'],
    ],
    scoring: {
      basePoints: 100,
      bonusComponents: { 'cdn': 25, 'cache': 30, 'dns': 15 },
      bonusLabel: 'Add CDN, Cache, or DNS for bonus points!',
    },
    successMessage: '🎉 Great job! Your blog architecture is solid. A simple client-server-database stack is the foundation of most web apps.',
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    icon: '🔗',
    difficulty: 2,
    description: 'Design a URL shortening service like bit.ly. Users submit long URLs and get short links back. When someone visits the short link, they get redirected.',
    hints: [
      '💡 You need an API to handle create and redirect requests.',
      '💡 Short URLs need to be stored and looked up quickly.',
      '💡 Millions of redirects happen — a cache can speed up lookups enormously.',
    ],
    requiredComponents: ['web-client', 'server', 'sql-db', 'cache'],
    requiredConnections: [
      ['web-client', 'server'],
      ['server', 'sql-db'],
      ['server', 'cache'],
    ],
    scoring: {
      basePoints: 200,
      bonusComponents: { 'load-balancer': 35, 'cdn': 20, 'monitoring': 25 },
      bonusLabel: 'Add Load Balancer or Monitoring for extra credit!',
    },
    successMessage: '🎉 Excellent! Caching short URLs in Redis makes redirects blazing fast. This is a classic system design interview question!',
  },
  {
    id: 'chat-app',
    title: 'Real-Time Chat App',
    icon: '💬',
    difficulty: 3,
    description: 'Design a real-time messaging application like Slack or WhatsApp Web. Users send messages that appear instantly for all participants.',
    hints: [
      '💡 Real-time communication needs persistent connections — think WebSockets.',
      '💡 Messages need to be stored so users can see chat history.',
      '💡 A message queue helps handle delivery to offline users and decouple components.',
    ],
    requiredComponents: ['web-client', 'server', 'sql-db', 'websocket', 'message-queue'],
    requiredConnections: [
      ['web-client', 'websocket'],
      ['websocket', 'server'],
      ['server', 'sql-db'],
      ['server', 'message-queue'],
    ],
    scoring: {
      basePoints: 350,
      bonusComponents: { 'cache': 30, 'load-balancer': 35, 'nosql-db': 30, 'mobile-client': 20 },
      bonusLabel: 'Add caching, load balancing, or mobile client for bonus!',
    },
    successMessage: '🎉 Awesome! WebSockets + message queues is the industry-standard pattern for real-time chat. You\'re thinking like an architect!',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    icon: '🛒',
    difficulty: 4,
    description: 'Design a scalable e-commerce platform with product catalog, shopping cart, payments, and order processing. Think about how to handle high traffic during sales events.',
    hints: [
      '💡 An API Gateway routes requests to different microservices (catalog, cart, payments).',
      '💡 A CDN serves product images fast from edge locations.',
      '💡 Order processing should be async — use a message queue so the user doesn\'t wait.',
      '💡 A load balancer distributes traffic during peak shopping periods.',
    ],
    requiredComponents: ['web-client', 'cdn', 'load-balancer', 'api-gateway', 'microservice', 'sql-db', 'cache', 'message-queue'],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'microservice'],
      ['microservice', 'sql-db'],
      ['microservice', 'cache'],
      ['microservice', 'message-queue'],
    ],
    scoring: {
      basePoints: 500,
      bonusComponents: { 'nosql-db': 30, 'monitoring': 35, 'event-stream': 40, 'mobile-client': 25 },
      bonusLabel: 'Add NoSQL for sessions, monitoring, or event streams for bonus!',
    },
    successMessage: '🎉 Incredible! You\'ve designed a production-grade e-commerce architecture. Microservices + async processing is how Amazon-scale platforms work!',
  },
  {
    id: 'video-streaming',
    title: 'Video Streaming Service',
    icon: '🎬',
    difficulty: 5,
    description: 'Design a video streaming platform like YouTube or Netflix. Handle video uploads, transcoding to multiple qualities, storage, and delivery to millions of viewers worldwide.',
    hints: [
      '💡 Uploaded videos need to be transcoded into multiple resolutions (360p, 720p, 1080p, 4K).',
      '💡 Object storage (like S3) is ideal for storing large video files.',
      '💡 A CDN is critical — it caches videos at edge locations close to viewers.',
      '💡 An event stream (Kafka) can coordinate the upload → transcode → publish pipeline.',
      '💡 Metadata (titles, thumbnails, user data) goes in a database separate from video files.',
    ],
    requiredComponents: ['web-client', 'cdn', 'load-balancer', 'api-gateway', 'microservice', 'sql-db', 'object-storage', 'cache', 'message-queue', 'event-stream'],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'microservice'],
      ['microservice', 'sql-db'],
      ['microservice', 'object-storage'],
      ['microservice', 'cache'],
      ['microservice', 'message-queue'],
      ['message-queue', 'event-stream'],
    ],
    scoring: {
      basePoints: 750,
      bonusComponents: { 'nosql-db': 35, 'monitoring': 40, 'logging': 30, 'dns': 25, 'mobile-client': 30, 'serverless': 40 },
      bonusLabel: 'Add monitoring, logging, DNS, serverless transcoding for bonus!',
    },
    successMessage: '🎉 Outstanding! You\'ve architected a Netflix-grade streaming platform. Object storage + CDN + event-driven pipelines is exactly how the pros do it!',
  },
  {
    id: 'free-design',
    title: 'Free Design (Sandbox)',
    icon: '🎨',
    difficulty: 0,
    description: 'No rules, no constraints. Build any system architecture you can imagine. Use this sandbox to practice, experiment, or design your own app idea.',
    hints: [
      '💡 Start with the user-facing clients, then work your way to the backend.',
      '💡 Think about data flow: where does data originate, where is it stored, how is it retrieved?',
      '💡 Consider failure scenarios: what happens if a server goes down?',
    ],
    requiredComponents: [],
    requiredConnections: [],
    scoring: {
      basePoints: 0,
      bonusComponents: {},
      bonusLabel: 'Free mode — build whatever you like!',
    },
    successMessage: '🎨 Creative freedom! Your design has been saved. Keep experimenting and iterating!',
  },
]

// ——— Validation Logic ———

/**
 * Validates a user's design against a scenario's requirements.
 * @param {Object} scenario - The scenario definition
 * @param {Array} placedComponents - Array of { id, type, x, y } placed on canvas
 * @param {Array} connections - Array of { from: componentId, to: componentId }
 * @returns {{ passed: boolean, score: number, maxScore: number, checklist: Array }}
 */
export function validateDesign(scenario, placedComponents, connections) {
  if (!scenario.requiredComponents.length) {
    // Free design mode — always passes
    const componentCount = placedComponents.length
    const connectionCount = connections.length
    return {
      passed: true,
      score: componentCount * 10 + connectionCount * 15,
      maxScore: Infinity,
      checklist: [
        { label: `${componentCount} components placed`, met: true },
        { label: `${connectionCount} connections made`, met: true },
      ],
    }
  }

  const placedTypes = new Set(placedComponents.map(c => c.type))
  const checklist = []
  let score = 0

  // Check required components
  const requiredMet = scenario.requiredComponents.every(type => {
    const met = placedTypes.has(type)
    const comp = COMPONENT_MAP[type]
    checklist.push({
      label: `${comp?.icon || '❓'} ${comp?.label || type}`,
      met,
      required: true,
    })
    return met
  })

  // Check required connections
  // Build a lookup: for each placed component, its type
  const idToType = {}
  placedComponents.forEach(c => { idToType[c.id] = c.type })

  // Build a set of "type->type" connections that exist
  const connTypeSet = new Set()
  connections.forEach(conn => {
    const fromType = idToType[conn.from]
    const toType = idToType[conn.to]
    if (fromType && toType) {
      connTypeSet.add(`${fromType}->${toType}`)
      connTypeSet.add(`${toType}->${fromType}`) // bidirectional check
    }
  })

  let connectionsMet = true
  scenario.requiredConnections.forEach(([fromType, toType]) => {
    const met = connTypeSet.has(`${fromType}->${toType}`)
    const fromComp = COMPONENT_MAP[fromType]
    const toComp = COMPONENT_MAP[toType]
    checklist.push({
      label: `${fromComp?.label || fromType} → ${toComp?.label || toType}`,
      met,
      required: true,
      isConnection: true,
    })
    if (!met) connectionsMet = false
  })

  const passed = requiredMet && connectionsMet
  if (passed) score += scenario.scoring.basePoints

  // Check bonus components
  Object.entries(scenario.scoring.bonusComponents).forEach(([type, points]) => {
    const met = placedTypes.has(type)
    const comp = COMPONENT_MAP[type]
    checklist.push({
      label: `${comp?.icon || '❓'} ${comp?.label || type} (bonus)`,
      met,
      required: false,
      bonus: points,
    })
    if (met) score += points
  })

  const maxScore = scenario.scoring.basePoints +
    Object.values(scenario.scoring.bonusComponents).reduce((a, b) => a + b, 0)

  return { passed, score, maxScore, checklist }
}
