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
      { type: 'web-client', label: 'Web Client', icon: '🌐', color: '#60a5fa', desc: 'Browser-based frontend application (React/Vue)',
        whenToUse: 'When users access your app through a web browser on desktop or mobile web.',
        realWorldExample: 'Gmail, Twitter Web, Figma — all are SPAs communicating with backend APIs.',
        proTip: 'Modern web clients use React/Vue to build SPAs that minimize server round-trips and enable instant UI updates.' },
      { type: 'mobile-client', label: 'Mobile App', icon: '📱', color: '#818cf8', desc: 'Native mobile application (iOS/Android)',
        whenToUse: 'When you need push notifications, camera/GPS access, or offline-first experiences.',
        realWorldExample: 'Instagram, Uber, WhatsApp — native apps for performance-critical mobile experiences.',
        proTip: 'At scale, 60%+ of traffic comes from mobile. Always design your API to support both web and mobile clients.' },
    ]
  },
  {
    id: 'compute',
    label: 'Compute & Services',
    components: [
      { type: 'server', label: 'Web Server', icon: '🖥️', color: '#a78bfa', desc: 'Monolithic App Server',
        whenToUse: 'For MVPs and early-stage apps where simplicity matters more than scale.',
        realWorldExample: 'Early-stage startups often run a single Rails, Django, or Express server handling all logic.',
        proTip: 'A monolith is NOT bad — it\'s the fastest way to ship. Only break into microservices when you hit real scaling pain.' },
      { type: 'api-gateway', label: 'API Gateway', icon: '🚪', color: '#c084fc', desc: 'Kong/Nginx routing requests',
        whenToUse: 'When you have multiple backend services and need a single entry point for all API requests.',
        realWorldExample: 'Netflix Zuul, Amazon API Gateway, Kong — route millions of requests to the right microservice.',
        proTip: 'API Gateways handle rate limiting, auth verification, and request routing — keeping your services clean and focused.' },
      { type: 'auth-service', label: 'Auth Service', icon: '🔑', color: '#e879f9', desc: 'Account & Auth Service (Node/Go)',
        whenToUse: 'When you need dedicated authentication, authorization, and user account management.',
        realWorldExample: 'Auth0, Firebase Auth, or custom services like Uber\'s account service handling billions of auth checks.',
        proTip: 'Never roll your own crypto. Use battle-tested libraries (bcrypt, JWT) and isolate auth into its own service for security.' },
      { type: 'workspace-service', label: 'Workspace Service', icon: '📁', color: '#f472b6', desc: 'Core Workspace Service',
        whenToUse: 'When your app has collaborative workspaces, projects, or shared resources that need their own service.',
        realWorldExample: 'Notion, Slack, and Figma all have dedicated workspace services managing teams and permissions.',
        proTip: 'Workspace services often need their own cache + storage strategy since they handle the heaviest read/write traffic.' },
      { type: 'dispatch-service', label: 'Dispatch Service', icon: '🚕', color: '#fb923c', desc: 'Location matching service',
        whenToUse: 'When you need to match entities based on geographic proximity in real-time.',
        realWorldExample: 'Uber\'s dispatch matches riders to nearby drivers using geospatial indexes updated every 4 seconds.',
        proTip: 'Use geohashing to partition the world into grid cells — it turns O(N) proximity searches into O(1) lookups.' },
      { type: 'chat-server', label: 'Chat Server', icon: '💬', color: '#4ade80', desc: 'Erlang/Elixir WebSocket Server',
        whenToUse: 'When you need to handle millions of concurrent persistent connections for real-time messaging.',
        realWorldExample: 'WhatsApp runs on Erlang — a single server handles 2M+ concurrent connections.',
        proTip: 'Erlang/Elixir\'s BEAM VM is designed for millions of lightweight processes — perfect for chat at scale.' },
      { type: 'catalog-service', label: 'Catalog Service', icon: '🛍️', color: '#fbbf24', desc: 'E-commerce Catalog API',
        whenToUse: 'When you have a large product catalog that needs fast search, filtering, and browsing.',
        realWorldExample: 'Amazon\'s catalog service handles 350M+ products with sub-100ms response times.',
        proTip: 'Always cache your catalog reads in Redis — product pages are read 1000x more than they\'re written.' },
      { type: 'routing-service', label: 'Routing Service', icon: '🗺️', color: '#3b82f6', desc: 'Graph-based route calculation',
        whenToUse: 'When you need to calculate optimal paths through a network or geographic map.',
        realWorldExample: 'Google Maps calculates routes using Dijkstra/A* algorithms on a massive road graph.',
        proTip: 'Pre-compute and cache popular routes. Use graph partitioning (Contraction Hierarchies) for 1000x speedup.' },
      { type: 'serverless', label: 'Serverless Fn', icon: '⚡', color: '#fcd34d', desc: 'AWS Lambda / Cloud Functions',
        whenToUse: 'For event-driven tasks, burst workloads, or background processing that doesn\'t need a dedicated server.',
        realWorldExample: 'Netflix uses AWS Lambda to encode video, process thumbnails, and handle event-driven workflows.',
        proTip: 'Serverless is perfect for unpredictable burst traffic — you pay per invocation, not for idle servers.' },
    ]
  },
  {
    id: 'storage',
    label: 'Storage & DBs',
    components: [
      { type: 'postgresql', label: 'PostgreSQL', icon: '🐘', color: '#34d399', desc: 'Relational SQL Database',
        whenToUse: 'When you need ACID transactions, complex queries, and strong data consistency.',
        realWorldExample: 'Instagram, Stripe, and Reddit all use PostgreSQL as their primary database.',
        proTip: 'PostgreSQL can handle 10K+ TPS with proper indexing. Don\'t switch to NoSQL until you actually need to.' },
      { type: 'cassandra', label: 'Cassandra', icon: '🧊', color: '#6ee7b7', desc: 'Wide-column NoSQL DB',
        whenToUse: 'When you need extreme write throughput and can tolerate eventual consistency.',
        realWorldExample: 'Netflix stores 100+ petabytes in Cassandra for viewing history, recommendations, and metadata.',
        proTip: 'Cassandra shines for write-heavy workloads. Design your data model around your query patterns, not relationships.' },
      { type: 'mongodb', label: 'MongoDB', icon: '🍃', color: '#2dd4bf', desc: 'Document NoSQL DB',
        whenToUse: 'When your data is semi-structured, schema evolves frequently, or you need flexible document storage.',
        realWorldExample: 'Uber stores trip data in MongoDB. eBay uses it for product catalog search.',
        proTip: 'MongoDB is great for rapid prototyping — no schema migrations needed. But plan your indexes carefully for production.' },
      { type: 'aws-s3', label: 'AWS S3', icon: '🪣', color: '#14b8a6', desc: 'Object Storage',
        whenToUse: 'For storing large files: images, videos, backups, logs, or any binary data.',
        realWorldExample: 'Netflix, Airbnb, and Dropbox all store media files in S3 — it has 99.999999999% durability.',
        proTip: 'Always serve S3 content through a CDN. Direct S3 access is slow and expensive at scale.' },
      { type: 'redis', label: 'Redis Cache', icon: '💎', color: '#ef4444', desc: 'In-memory KV cache',
        whenToUse: 'When you need sub-millisecond reads for hot data like sessions, leaderboards, or rate limits.',
        realWorldExample: 'Twitter caches timelines in Redis. GitHub uses it for session storage and job queues.',
        proTip: 'Cache anything read more than 10x per write. A $50/mo Redis instance can save $5000/mo in database costs.' },
      { type: 'redis-geo', label: 'Redis Geospatial', icon: '📍', color: '#f87171', desc: 'Geospatial caching for coordinates',
        whenToUse: 'When you need fast proximity queries — finding nearby restaurants, drivers, or stores.',
        realWorldExample: 'Uber uses Redis GEOADD/GEORADIUS to find drivers within 5km of a rider in under 1ms.',
        proTip: 'Redis geospatial commands use sorted sets internally with geohash scoring — O(log N) for radius queries.' },
      { type: 'account-cache', label: 'Account Cache', icon: '🔐', color: '#fca5a5', desc: 'Dedicated Auth Cache (Redis)',
        whenToUse: 'When auth checks happen on every request and you can\'t afford database latency.',
        realWorldExample: 'Large platforms dedicate a separate Redis cluster for session tokens and auth data.',
        proTip: 'Isolate your auth cache from general-purpose caching. An auth cache failure shouldn\'t affect product caching.' },
      { type: 'workspace-cache', label: 'Workspace Cache', icon: '🗂️', color: '#fecaca', desc: 'Dedicated Workspace Cache (Redis)',
        whenToUse: 'When workspace data is read-heavy and needs its own caching layer to avoid polluting other caches.',
        realWorldExample: 'Notion and Figma use dedicated caches for workspace metadata to ensure instant loading.',
        proTip: 'Use cache-aside pattern: check cache first, on miss query DB and populate cache. Set appropriate TTLs.' },
    ]
  },
  {
    id: 'networking',
    label: 'Networking',
    components: [
      { type: 'load-balancer', label: 'AWS ALB', icon: '⚖️', color: '#fb923c', desc: 'Application Load Balancer',
        whenToUse: 'When you have multiple server instances and need to distribute traffic evenly across them.',
        realWorldExample: 'Every large-scale app uses load balancers. AWS ALB handles millions of requests/sec for Netflix.',
        proTip: 'Use health checks to automatically remove unhealthy servers. Round-robin is fine to start; switch to least-connections under heavy load.' },
      { type: 'cdn', label: 'CDN', icon: '🌍', color: '#fdba74', desc: 'Cloudflare / OpenConnect',
        whenToUse: 'When you serve static assets (images, CSS, JS, videos) to users across different geographic regions.',
        realWorldExample: 'Netflix\'s OpenConnect CDN serves 15% of all internet traffic. Cloudflare protects 20M+ websites.',
        proTip: 'CDNs reduce latency by 50-80% for static content. They also provide DDoS protection as a bonus.' },
      { type: 'dns', label: 'Route53 DNS', icon: '🔗', color: '#fca5a1', desc: 'Domain Name System routing',
        whenToUse: 'Essential for any production app — translates domain names to IP addresses.',
        realWorldExample: 'Route53 powers DNS for AWS. Cloudflare DNS handles 1.5+ trillion queries/month.',
        proTip: 'Use DNS-based load balancing for multi-region setups. Set low TTLs during migrations for quick failover.' },
    ]
  },
  {
    id: 'messaging',
    label: 'Messaging',
    components: [
      { type: 'rabbitmq', label: 'RabbitMQ', icon: '📨', color: '#f87171', desc: 'Message Queue / SQS',
        whenToUse: 'When you need to decouple services and process tasks asynchronously (emails, notifications, uploads).',
        realWorldExample: 'Instagram uses RabbitMQ to process image filters and send push notifications asynchronously.',
        proTip: 'Message queues ensure no work is lost if a service crashes. The queue holds messages until a worker processes them.' },
      { type: 'kafka', label: 'Apache Kafka', icon: '🌊', color: '#fb7185', desc: 'High-throughput Event Stream',
        whenToUse: 'When you need to process millions of events/sec for analytics, activity feeds, or real-time pipelines.',
        realWorldExample: 'LinkedIn processes 7 trillion messages/day through Kafka. Uber uses it for real-time pricing.',
        proTip: 'Kafka is NOT a traditional queue — it\'s a distributed log. Consumers can replay events, making it perfect for event sourcing.' },
      { type: 'websocket', label: 'WebSocket', icon: '🔌', color: '#f472b6', desc: 'Persistent real-time connection',
        whenToUse: 'When you need instant, bidirectional communication — chat, live updates, collaborative editing.',
        realWorldExample: 'Slack, Discord, and Google Docs all use WebSockets for real-time collaboration.',
        proTip: 'WebSockets keep a persistent TCP connection open. Use them for real-time features; use REST for everything else.' },
    ]
  },
  {
    id: 'monitoring',
    label: 'Observability',
    components: [
      { type: 'logging', label: 'ELK Stack', icon: '📋', color: '#a1a1aa', desc: 'Elasticsearch, Logstash, Kibana',
        whenToUse: 'When you need to search, analyze, and visualize logs from multiple services in one place.',
        realWorldExample: 'Netflix, LinkedIn, and Stack Overflow use ELK to process billions of log entries daily.',
        proTip: 'Structured logging (JSON) is 10x more useful than plain text. Always include request IDs for distributed tracing.' },
      { type: 'monitoring', label: 'Prometheus', icon: '📊', color: '#94a3b8', desc: 'Metrics and Grafana dashboards',
        whenToUse: 'When you need real-time metrics, alerting, and dashboards for system health monitoring.',
        realWorldExample: 'SoundCloud created Prometheus. It\'s now the industry standard used by Uber, DigitalOcean, and GitLab.',
        proTip: 'Monitor the 4 golden signals: latency, traffic, errors, and saturation. Set alerts on these, not vanity metrics.' },
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
  'web-client->server':        '🌐 User sends HTTP request to the web server',
  'web-client->load-balancer': '🌐 User request hits the AWS ALB (Load Balancer)',
  'web-client->cdn':           '🌐 Browser fetches static assets from the CDN',
  'web-client->dns':           '🌐 Browser resolves domain name via Route53 DNS',
  'web-client->api-gateway':   '🌐 Client sends API request to the Kong API Gateway',
  'web-client->websocket':     '🌐 Client opens persistent WebSocket connection',
  'mobile-client->api-gateway':'📱 Mobile app calls the API gateway',
  'mobile-client->cdn':        '📱 Mobile app loads media from CDN',
  'mobile-client->load-balancer':'📱 Mobile app request hits load balancer',
  'dns->load-balancer':        '🔗 DNS resolves to load balancer IP address',
  'load-balancer->server':     '⚖️ Load balancer forwards request to a healthy server',
  'load-balancer->api-gateway':'⚖️ Load balancer routes traffic to API gateway',
  'load-balancer->auth-service':'⚖️ Load balancer routes traffic to Auth Service',
  'load-balancer->dispatch-service':'⚖️ Load balancer routes traffic to Dispatch Service',
  'api-gateway->auth-service': '🚪 API Gateway routes request to Auth Service',
  'api-gateway->workspace-service': '🚪 API Gateway routes request to Workspace Service',
  'api-gateway->catalog-service': '🚪 API Gateway routes request to Catalog Service',
  'api-gateway->routing-service': '🚪 API Gateway routes request to Routing Service',
  'api-gateway->server':       '🚪 API Gateway forwards to application server',
  'server->postgresql':        '🖥️ Server queries the PostgreSQL database',
  'server->redis':             '🖥️ Server checks Redis cache for fast data retrieval',
  'server->rabbitmq':          '🖥️ Server publishes async task to RabbitMQ',
  'auth-service->account-cache':'🔑 Auth Service checks Account Cache (Redis)',
  'account-cache->postgresql': '🔐 Cache miss — falling back to PostgreSQL database query',
  'workspace-service->workspace-cache':'📁 Workspace Service checks Workspace Cache (Redis)',
  'workspace-cache->mongodb':  '🗂️ Cache miss — falling back to MongoDB query',
  'workspace-service->aws-s3': '📁 Workspace Service stores files in AWS S3',
  'workspace-service->rabbitmq':'📁 Workspace Service enqueues async job to RabbitMQ',
  'rabbitmq->serverless':      '📨 RabbitMQ triggers Serverless Function',
  'chat-server->rabbitmq':     '💬 Chat Server publishes message to RabbitMQ',
  'rabbitmq->postgresql':      '📨 RabbitMQ worker writes data to PostgreSQL',
  'dispatch-service->redis-geo':'🚕 Dispatch Service queries geospatial data in Redis',
  'redis-geo->postgresql':     '📍 Falling back to PostGIS database query',
  'catalog-service->redis':    '🛍️ Catalog Service checks Redis cache',
  'routing-service->cassandra':'🗺️ Routing Service fetches map data from Cassandra',
  'routing-service->kafka':    '🗺️ Routing Service reads live traffic from Kafka',
  'serverless->mongodb':       '⚡ Serverless function reads/writes MongoDB',
  'serverless->aws-s3':        '⚡ Serverless function accesses AWS S3',
  'cdn->aws-s3':               '🌍 CDN pulls origin content from AWS S3',
  'websocket->chat-server':    '🔌 WebSocket relays real-time message to Chat Server',
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
    id: 'reuters-news',
    title: 'Reuters Newspaper Company',
    icon: '📰',
    difficulty: 1,
    description: 'Design a global news platform like Reuters. Users read articles published by journalists. Think about what components you need to serve web pages and store text content.',
    hints: [
      '💡 Every web app starts with a client that users interact with.',
      '💡 You need somewhere to run your application logic (Web Server).',
      '💡 News articles need to be stored persistently (PostgreSQL).',
    ],
    requiredComponents: ['web-client', 'server', 'postgresql'],
    requiredConnections: [
      ['web-client', 'server'],
      ['server', 'postgresql'],
    ],
    techStack: 'Languages: Node.js, Python, or Ruby. Database: PostgreSQL.',
    complexity: 'Time: O(1) for direct lookups, O(log N) for complex queries. Space: O(N) where N is number of articles.',
    failureMessage: 'Your news architecture is missing essential components. Ensure you have a Web Client, a Web Server, and PostgreSQL to store articles.',
    scoring: {
      basePoints: 100,
      bonusComponents: { 'cdn': 25, 'redis': 30, 'dns': 15 },
      bonusLabel: 'Add CDN, Redis Cache, or DNS for bonus points!',
    },
    successMessage: '🎉 Great job! Your news architecture is solid. A simple client-server-database stack is the foundation of most content platforms.',
  },
  {
    id: 'uber-system',
    title: 'Uber Ride-Hailing System',
    icon: '🚕',
    difficulty: 2,
    description: 'Design a ride-hailing system like Uber. Riders request trips, and nearby drivers accept them. Location data is constantly updated.',
    hints: [
      '💡 You need mobile clients for both riders and drivers.',
      '💡 Location tracking requires high-throughput data handling.',
      '💡 Fast geospatial queries (finding nearby drivers) require a Dispatch Service and Redis Geospatial cache.',
    ],
    requiredComponents: ['mobile-client', 'dispatch-service', 'postgresql', 'redis-geo'],
    requiredConnections: [
      ['mobile-client', 'dispatch-service'],
      ['dispatch-service', 'redis-geo'],
      ['redis-geo', 'postgresql'],
    ],
    techStack: 'Languages: Go or Node.js for high throughput. DB: PostgreSQL (PostGIS). Cache: Redis (Geospatial).',
    complexity: 'Time: O(1) or O(log N) for geohash lookups in Redis. Space: O(D) for active drivers.',
    failureMessage: 'Your ride-hailing system is incomplete. You need a Dispatch Service, Redis Geospatial, and PostgreSQL.',
    scoring: {
      basePoints: 200,
      bonusComponents: { 'load-balancer': 35, 'websocket': 20, 'monitoring': 25 },
      bonusLabel: 'Add Load Balancer or WebSockets for extra credit!',
    },
    successMessage: '🎉 Excellent! Using a Cache (like Redis Geospatial) for driver locations ensures fast matching. This is core to Uber\'s architecture!',
  },
  {
    id: 'whatsapp-chat',
    title: 'WhatsApp Real-Time Chat',
    icon: '💬',
    difficulty: 3,
    description: 'Design a real-time messaging application like WhatsApp. Users send messages that appear instantly for all participants.',
    hints: [
      '💡 Real-time communication needs persistent connections — think WebSockets connecting to a Chat Server.',
      '💡 Messages need to be stored so users can see chat history (PostgreSQL).',
      '💡 A Message Queue (RabbitMQ) helps handle delivery to offline users and decouple components.',
    ],
    requiredComponents: ['mobile-client', 'websocket', 'chat-server', 'postgresql', 'rabbitmq'],
    requiredConnections: [
      ['mobile-client', 'websocket'],
      ['websocket', 'chat-server'],
      ['chat-server', 'rabbitmq'],
      ['rabbitmq', 'postgresql'],
    ],
    techStack: 'Languages: Erlang, Elixir, or Node.js. DB: PostgreSQL. Message Queue: RabbitMQ.',
    complexity: 'Time: O(1) for message delivery via WebSockets. Space: O(N*M) where N is users and M is messages.',
    failureMessage: 'Your chat app is missing real-time components. Use WebSockets, a Chat Server, RabbitMQ, and PostgreSQL.',
    scoring: {
      basePoints: 350,
      bonusComponents: { 'redis': 30, 'load-balancer': 35, 'mongodb': 30, 'web-client': 20 },
      bonusLabel: 'Add Redis, Load Balancer, or Web Client for bonus!',
    },
    successMessage: '🎉 Awesome! WebSockets + Erlang servers + message queues is the industry-standard pattern for real-time chat like WhatsApp. You\'re thinking like an architect!',
  },
  {
    id: 'amazon-ecommerce',
    title: 'Amazon/Flipkart E-Commerce',
    icon: '🛒',
    difficulty: 4,
    description: 'Design a scalable e-commerce platform like Amazon or Flipkart. Handle a massive product catalog, shopping cart, payments, and high traffic during sale events.',
    hints: [
      '💡 An API Gateway routes requests to different services like the Catalog Service.',
      '💡 A CDN serves product images fast from edge locations.',
      '💡 Order processing should be async — use RabbitMQ so the user doesn\'t wait.',
      '💡 Redis caches the product catalog to handle 1000s of reads per second.',
    ],
    requiredComponents: ['web-client', 'cdn', 'load-balancer', 'api-gateway', 'catalog-service', 'postgresql', 'redis', 'rabbitmq'],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'catalog-service'],
      ['catalog-service', 'redis'],
      ['catalog-service', 'rabbitmq'],
      ['rabbitmq', 'postgresql'],
    ],
    techStack: 'Languages: Java or Go. Gateway: Kong/Nginx. DB: PostgreSQL. Queue: RabbitMQ.',
    complexity: 'Time: O(1) for cached catalog reads. Async processing handles slow writes. Space: O(P+U) for products and users.',
    failureMessage: 'Your e-commerce platform needs an API Gateway routing to a Catalog Service, backed by Redis caching and RabbitMQ for async orders.',
    scoring: {
      basePoints: 500,
      bonusComponents: { 'mongodb': 30, 'monitoring': 35, 'kafka': 40, 'mobile-client': 25 },
      bonusLabel: 'Add MongoDB, Monitoring, or Kafka for bonus!',
    },
    successMessage: '🎉 Incredible! You\'ve designed a production-grade e-commerce architecture. Service decoupling + async processing is how Amazon and Flipkart work!',
  },
  {
    id: 'netflix-streaming',
    title: 'Netflix Video Streaming System',
    icon: '🎬',
    difficulty: 5,
    description: 'Design a video streaming platform like Netflix. Handle video uploads, transcoding to multiple qualities, storage, and delivery to millions of viewers worldwide.',
    hints: [
      '💡 Object storage (AWS S3) is ideal for storing large video files.',
      '💡 A CDN (OpenConnect) is critical — it pulls videos from S3 and caches them at edge locations.',
      '💡 Kafka can coordinate the upload → transcode → publish pipeline.',
      '💡 Metadata goes in Cassandra (NoSQL) for high availability.',
    ],
    requiredComponents: ['web-client', 'cdn', 'load-balancer', 'api-gateway', 'server', 'aws-s3', 'cassandra', 'kafka'],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['cdn', 'aws-s3'],
      ['web-client', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'server'],
      ['server', 'cassandra'],
      ['server', 'kafka'],
    ],
    techStack: 'Languages: C++/Rust (transcoding), Java/Node (API). Storage: AWS S3 & Cassandra. Stream: Kafka.',
    complexity: 'Time: Video delivery is bounded by network. Processing is O(S) where S is video size. Space: O(V*R) for videos and resolutions.',
    failureMessage: 'Your video platform is missing heavy data components. Ensure you use AWS S3, a CDN connected to S3, Cassandra, and Kafka.',
    scoring: {
      basePoints: 750,
      bonusComponents: { 'redis': 35, 'monitoring': 40, 'logging': 30, 'dns': 25, 'mobile-client': 30, 'serverless': 40 },
      bonusLabel: 'Add Monitoring, Logging, DNS, Serverless transcoding for bonus!',
    },
    successMessage: '🎉 Outstanding! You\'ve architected a Netflix-grade streaming platform. S3 + CDN + Kafka event-driven pipelines is exactly how the pros do it!',
  },
  {
    id: 'google-maps',
    title: 'Google Maps Navigation',
    icon: '🗺️',
    difficulty: 5,
    description: 'Design a navigation and mapping system like Google Maps. Handle massive map tile delivery, real-time traffic updates, and route calculation for millions of concurrent drivers.',
    hints: [
      '💡 Map tiles (images) are static and should be served globally via a CDN.',
      '💡 Real-time traffic data streams in from millions of phones — use Kafka to ingest this.',
      '💡 Route calculation is computationally heavy — decouple it using a Routing Service.',
      '💡 Store petabytes of map data in Cassandra.',
    ],
    requiredComponents: ['mobile-client', 'cdn', 'api-gateway', 'routing-service', 'cassandra', 'kafka'],
    requiredConnections: [
      ['mobile-client', 'cdn'],
      ['mobile-client', 'api-gateway'],
      ['api-gateway', 'routing-service'],
      ['routing-service', 'cassandra'],
      ['routing-service', 'kafka'],
    ],
    techStack: 'Languages: C++ (routing), Java/Go (API). Storage: Cassandra. Stream: Kafka.',
    complexity: 'Time: O(V + E) for shortest path, optimized by graph partitioning. Space: Petabytes of map data.',
    failureMessage: 'Your mapping system is missing components. You need a CDN, Routing Service, Cassandra, and Kafka for traffic data.',
    scoring: {
      basePoints: 700,
      bonusComponents: { 'postgresql': 25, 'monitoring': 30, 'websocket': 30, 'load-balancer': 20 },
      bonusLabel: 'Add WebSockets for live updates or Load Balancers for bonus!',
    },
    successMessage: '🎉 Brilliant! CDNs for map tiles and Event Streams (Kafka) for live traffic is the exact pattern used by Google Maps.',
  },

  // ——————————————————————————————————————————————
  // SCALING JOURNEY — From Scratch to 10M+ Users
  // ——————————————————————————————————————————————
  {
    id: 'scale-mvp',
    title: 'MVP Launch',
    icon: '🚀',
    difficulty: 2,
    track: 'scaling',
    scale: '1–100',
    scaleLabel: '1–100 Users',
    description: 'You just launched your app! You have a handful of early adopters. Design the simplest possible architecture to get your product in users\' hands. At this stage, a single machine running everything is perfectly fine — speed of iteration matters more than scale.',
    hints: [
      '💡 At MVP scale, simplicity is king. One server can handle everything.',
      '💡 Users need a frontend — start with a Web Client.',
      '💡 You need persistent storage — a SQL database stores your data reliably.',
      '💡 A single server runs your application logic, API, and serves pages.',
    ],
    requiredComponents: ['web-client', 'server', 'postgresql'],
    requiredConnections: [
      ['web-client', 'server'],
      ['server', 'postgresql'],
    ],
    techStack: 'Languages: Ruby on Rails, Django, or Laravel. DB: PostgreSQL.',
    complexity: 'Time: O(1) mostly. Space: O(U+D) where U is users, D is data.',
    failureMessage: 'Even an MVP needs a foundation. Make sure you have a Web Client, Web Server, and a PostgreSQL database.',
    scoring: {
      basePoints: 150,
      bonusComponents: { 'dns': 20, 'monitoring': 25 },
      bonusLabel: 'Add DNS or Monitoring for early best practices!',
    },
    successMessage: '🚀 Your MVP is live! A simple 3-tier stack (client → server → database) is how every great company started. Facebook, Twitter, Airbnb — all began on a single machine. Ship fast, learn faster!',
  },
  {
    id: 'scale-1k',
    title: 'First Growth',
    icon: '📈',
    difficulty: 3,
    track: 'scaling',
    scale: '1K',
    scaleLabel: '1,000 Users',
    description: 'Your app is gaining traction! With 1,000 active users, you\'re starting to notice slowdowns. Static assets (images, CSS, JS) are eating your server\'s bandwidth. It\'s time to add a CDN for static content and proper DNS resolution so users reach your app reliably.',
    hints: [
      '💡 A CDN serves static files (images, CSS, JS) from edge locations near users, reducing server load.',
      '💡 DNS resolves your domain name to your server\'s IP address — essential infrastructure.',
      '💡 Your server still handles all business logic — no need for microservices yet.',
      '💡 Keep the SQL database — it handles 1K users easily with proper indexing.',
    ],
    requiredComponents: ['web-client', 'dns', 'server', 'postgresql', 'cdn'],
    requiredConnections: [
      ['web-client', 'dns'],
      ['web-client', 'cdn'],
      ['web-client', 'server'],
      ['server', 'postgresql'],
    ],
    techStack: 'Same monolithic stack, adding Cloudflare (CDN/DNS) and scaling up the DB instance.',
    complexity: 'Time: O(1) for static assets via CDN. Server handles dynamic logic only.',
    failureMessage: 'To handle 1K users effectively, you need to offload static assets to a CDN and use DNS for proper routing.',
    scoring: {
      basePoints: 300,
      bonusComponents: { 'monitoring': 25, 'aws-s3': 30 },
      bonusLabel: 'Add monitoring or AWS S3 for bonus points!',
    },
    successMessage: '📈 Smart scaling! By offloading static assets to a CDN and setting up DNS, your server can focus on what matters — business logic. CDNs reduce latency by 50-80% for static content. You\'re thinking like an engineer now!',
  },
  {
    id: 'scale-10k',
    title: 'Going Viral',
    icon: '🔥',
    difficulty: 3,
    track: 'scaling',
    scale: '10K',
    scaleLabel: '10,000 Users',
    description: 'Your app just hit the front page! Traffic surged 10x overnight. A single server can\'t handle the load — you need to scale horizontally with multiple servers behind a load balancer. Hot data should be cached in memory to avoid hammering the database on every request.',
    hints: [
      '💡 A Load Balancer distributes incoming requests across multiple server instances.',
      '💡 A Cache (Redis) stores frequently accessed data in memory — 100x faster than disk.',
      '💡 Rule of thumb: cache anything that\'s read more than 10x for every 1 write.',
      '💡 Your database should still be the source of truth — cache is a performance layer on top.',
    ],
    requiredComponents: ['web-client', 'dns', 'cdn', 'load-balancer', 'server', 'postgresql', 'redis'],
    requiredConnections: [
      ['web-client', 'dns'],
      ['web-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['load-balancer', 'server'],
      ['server', 'postgresql'],
      ['server', 'redis'],
    ],
    techStack: 'Load Balancer: AWS ALB/Nginx. Cache: Redis. Monolithic servers scaled horizontally.',
    complexity: 'Time: O(1) for most read queries due to Cache. DB writes are still O(log N).',
    failureMessage: 'For 10K users, a single server will crash. You need a Load Balancer and a Redis Cache to reduce database strain.',
    scoring: {
      basePoints: 400,
      bonusComponents: { 'monitoring': 30, 'logging': 25, 'aws-s3': 25 },
      bonusLabel: 'Add monitoring, logging, or AWS S3 for production-readiness!',
    },
    successMessage: '🔥 You survived the traffic spike! Load balancing + caching is the #1 scaling pattern in the industry. Redis cache alone can serve 100K+ reads/second. When your DB says "ouch", cache says "I got you."',
  },
  {
    id: 'scale-100k',
    title: 'Scaling to 100K',
    icon: '⚡',
    difficulty: 4,
    track: 'scaling',
    scale: '100K',
    scaleLabel: '100,000 Users',
    description: 'At 100K users, your monolith is becoming a bottleneck. A single codebase handling auth, payments, search, and notifications is getting fragile. It\'s time to break into specific services with an API Gateway. Heavy tasks like email and image processing should be queued asynchronously.',
    hints: [
      '💡 An API Gateway routes requests to the right service — auth, catalog, etc.',
      '💡 Services let teams deploy independently. One service going down doesn\'t kill everything.',
      '💡 A Message Queue (RabbitMQ) handles async tasks: emails, notifications, image processing.',
      '💡 Use NoSQL (MongoDB) for flexible data like user profiles, sessions, or product catalogs.',
      '💡 Cache becomes critical — cache user sessions, product pages, search results.',
    ],
    requiredComponents: ['web-client', 'cdn', 'load-balancer', 'api-gateway', 'auth-service', 'postgresql', 'mongodb', 'redis', 'rabbitmq'],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'auth-service'],
      ['auth-service', 'postgresql'],
      ['auth-service', 'mongodb'],
      ['auth-service', 'redis'],
      ['auth-service', 'rabbitmq'],
    ],
    techStack: 'Services in Node/Go. API Gateway: Kong. Queue: RabbitMQ. DB: Postgres + MongoDB.',
    complexity: 'Time: Highly concurrent. Microservices allow O(1) scaling of specific bottlenecks.',
    failureMessage: 'At 100K users, a monolith is a bottleneck. You must use an API Gateway routing to an Auth Service, plus a RabbitMQ queue for async tasks.',
    scoring: {
      basePoints: 550,
      bonusComponents: { 'dns': 20, 'monitoring': 35, 'logging': 30, 'aws-s3': 25, 'mobile-client': 20 },
      bonusLabel: 'Add observability (monitoring + logging) and mobile support for bonus!',
    },
    successMessage: '⚡ You\'ve entered microservices territory! Companies like Netflix, Uber, and Amazon all made this exact transition. The API Gateway pattern decouples your frontend from backend complexity. Async queues mean users never wait for slow operations.',
  },
  {
    id: 'scale-1m',
    title: 'Million Users',
    icon: '🌍',
    difficulty: 5,
    track: 'scaling',
    scale: '1M',
    scaleLabel: '1,000,000 Users',
    description: 'One million users and growing globally. You need multi-platform support (web + mobile), event-driven architecture for real-time features, and full observability to catch issues before users report them. At this scale, you can\'t debug by reading logs manually — you need monitoring dashboards and alerts.',
    hints: [
      '💡 Mobile users are probably 60%+ of your traffic now — add a Mobile Client.',
      '💡 Event Streams (Kafka) power real-time features: feeds, notifications, analytics pipelines.',
      '💡 Monitoring (Prometheus/Grafana) and Logging (ELK) are non-negotiable at this scale.',
      '💡 DNS resolves to load balancers across multiple regions for reliability.',
    ],
    requiredComponents: ['web-client', 'mobile-client', 'dns', 'cdn', 'load-balancer', 'api-gateway', 'auth-service', 'server', 'postgresql', 'mongodb', 'redis', 'rabbitmq', 'kafka', 'monitoring'],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['mobile-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['mobile-client', 'load-balancer'],
      ['dns', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'auth-service'],
      ['auth-service', 'postgresql'],
      ['auth-service', 'mongodb'],
      ['auth-service', 'redis'],
      ['auth-service', 'rabbitmq'],
      ['auth-service', 'kafka'],
      ['monitoring', 'server'],
    ],
    techStack: 'Event Stream: Apache Kafka. Monitoring: Prometheus & Grafana. Multi-region deployments.',
    complexity: 'Data flows asynchronously. Eventual consistency is common to maintain O(1) perception to users.',
    failureMessage: '1 Million users require Mobile support, Event Streams (Kafka) for data pipelines, and strict Monitoring to detect failures early.',
    scoring: {
      basePoints: 700,
      bonusComponents: { 'logging': 40, 'aws-s3': 35, 'websocket': 40, 'serverless': 35 },
      bonusLabel: 'Add logging, AWS S3, WebSockets, or serverless functions for max score!',
    },
    successMessage: '🌍 One million users — you\'re building a platform, not just an app! Event-driven architecture, multi-platform support, and observability are what separate toy projects from production systems. This is how Spotify, Slack, and Stripe operate at scale.',
  },
  {
    id: 'scale-10m',
    title: '10M+ Hyperscale',
    icon: '🪐',
    difficulty: 5,
    track: 'scaling',
    scale: '10M+',
    scaleLabel: '10,000,000+ Users',
    description: 'Welcome to hyperscale. 10 million+ users across every continent, every timezone. Your system must handle 100K+ requests per second, survive entire datacenter failures, and process petabytes of data. This is Netflix, Uber, and Google-level architecture — every single component in your toolbox is needed.',
    hints: [
      '💡 At this scale, EVERY component type matters. Clients, compute, storage, networking, messaging, and monitoring.',
      '💡 Follow the new decoupled architecture: Account & Auth Service uses Account Cache + PostgreSQL.',
      '💡 The Core Workspace Service uses Workspace Cache + MongoDB + AWS S3 + RabbitMQ.',
      '💡 Serverless functions handle burst traffic via RabbitMQ queues.',
      '💡 Kafka powers real-time event analytics.',
    ],
    requiredComponents: [
      'web-client', 'mobile-client', 'dns', 'cdn', 'load-balancer',
      'api-gateway', 'auth-service', 'workspace-service', 'serverless',
      'postgresql', 'mongodb', 'aws-s3', 'account-cache', 'workspace-cache',
      'rabbitmq', 'kafka', 'websocket', 'monitoring', 'logging',
    ],
    requiredConnections: [
      ['web-client', 'cdn'],
      ['mobile-client', 'cdn'],
      ['web-client', 'load-balancer'],
      ['mobile-client', 'load-balancer'],
      ['dns', 'load-balancer'],
      ['load-balancer', 'api-gateway'],
      ['api-gateway', 'auth-service'],
      ['api-gateway', 'workspace-service'],
      ['api-gateway', 'serverless'],
      ['auth-service', 'postgresql'],
      ['workspace-service', 'mongodb'],
      ['auth-service', 'account-cache'],
      ['workspace-service', 'workspace-cache'],
      ['workspace-service', 'aws-s3'],
      ['workspace-service', 'rabbitmq'],
      ['workspace-service', 'kafka'],
      ['rabbitmq', 'serverless'],
      ['cdn', 'aws-s3'],
      ['web-client', 'websocket'],
    ],
    techStack: 'Cloud-native hyperscale. AWS/GCP managed services. Kubernetes. Distributed Tracing.',
    complexity: 'P99 latency must be under 200ms. O(1) scaling via auto-scaling groups and global CDNs.',
    failureMessage: 'Hyperscale means EVERYTHING is needed. You missed some core infrastructure required to handle petabytes of data and 100K+ RPS.',
    scoring: {
      basePoints: 900,
      bonusComponents: {},
      bonusLabel: 'Master challenge — all components are required!',
    },
    architecturalUpgrades: {
      title: "Here is a breakdown of the key architectural upgrades in the redesigned layout and why they are essential for scaling to 10M+ users:",
      items: [
        {
          title: "1. Strict Traffic Funneling (The Routing Layer)",
          description: "Instead of the Load Balancer throwing traffic at random servers and microservices, there is now a clear, unidirectional flow.\n\nThe Change: Traffic moves from the Client -> Load Balancer -> API Gateway.\n\nThe PM Value: This centralizes your security and traffic management. The API Gateway now acts as the single entry point, handling rate-limiting (preventing DDoS attacks), authentication verification, and routing requests to the correct internal services."
        },
        {
          title: "2. Domain-Driven Microservices (Decoupling)",
          description: "The massive central \"Microservice\" bottleneck has been shattered into distinct, isolated services based on business domains.\n\nThe Change: You now have an Account & Auth Service and a Core Workspace Service.\n\nThe PM Value: This reduces the \"blast radius.\" If the Workspace service crashes because users are uploading massive files, the Auth service stays up, meaning people can still log in and access their account settings. It also allows separate engineering teams to deploy updates independently without stepping on each other's toes."
        },
        {
          title: "3. Database-per-Service & Targeted Caching",
          description: "The tangled web of every service talking to every database has been resolved.\n\nThe Change: The Auth Service is mapped securely to an SQL Database (for rigid user data) via an Account Cache (Redis). The Workspace Service handles the heavy lifting with a NoSQL DB and Object Storage, shielded by its own Workspace Cache.\n\nThe PM Value: By giving each microservice its own dedicated database and cache, you prevent database connection pool exhaustion. Read-heavy operations hit the Redis caches instantly, dramatically reducing latency for the end user and saving expensive database compute costs."
        },
        {
          title: "4. Clean Asynchronous Processing",
          description: "The background tasks have been organized into a logical, event-driven pipeline.\n\nThe Change: The Workspace Service pushes heavy tasks to the Message Queue, which then specifically triggers the Serverless Functions to do the work.\n\nThe PM Value: This ensures your main application thread is never blocked. If a user uploads a huge asset, the Workspace service immediately tells the user \"Upload in progress,\" while the Serverless function quietly handles the actual processing in the background."
        }
      ],
      conclusion: "This structure moves the design from a fragile \"spaghetti\" prototype to an enterprise-grade, highly resilient architecture ready to handle massive traffic spikes."
    },
    successMessage: '🪐 HYPERSCALE ACHIEVED! You\'ve designed a planet-scale architecture handling 10M+ users. This is the exact topology used by Netflix (200M+ users), Uber (100M+ riders), and YouTube (2B+ monthly users). DNS → CDN → Load Balancer → API Gateway → Microservices → Databases + Caches + Queues + Streams + Serverless + Monitoring. You\'re ready for the real world! 🏆',
  },

  // ——————————————————————————————————————————————
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
    techStack: 'Any technology you prefer!',
    complexity: 'Depends on what you build.',
    failureMessage: 'This is free mode, so you cannot fail!',
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

// ——— Design Tier Definitions ———
const DESIGN_TIERS = [
  { name: 'Sketch',      minScore: 0,  maxScore: 19, icon: '✏️', color: '#94a3b8', desc: 'A rough sketch — just getting started.' },
  { name: 'Prototype',   minScore: 20, maxScore: 39, icon: '🧪', color: '#60a5fa', desc: 'A basic prototype — core pieces are in place.' },
  { name: 'Production',  minScore: 40, maxScore: 59, icon: '🚀', color: '#a78bfa', desc: 'Production-ready — solid fundamentals.' },
  { name: 'Enterprise',  minScore: 60, maxScore: 79, icon: '🏢', color: '#34d399', desc: 'Enterprise-grade — well-architected system.' },
  { name: 'Hyperscale',  minScore: 80, maxScore: 100, icon: '🪐', color: '#f472b6', desc: 'Hyperscale — planet-level architecture!' },
]

// ——— Architecture Pattern Rules ———
const STRENGTH_RULES = [
  { check: (types) => types.has('cdn'), msg: '🌍 CDN for global static asset delivery — reduces latency by 50-80%', category: 'networking' },
  { check: (types) => types.has('load-balancer'), msg: '⚖️ Load Balancer for horizontal scaling — handles traffic spikes gracefully', category: 'networking' },
  { check: (types) => types.has('redis') || types.has('account-cache') || types.has('workspace-cache'), msg: '💎 Caching layer — sub-millisecond reads for hot data', category: 'performance' },
  { check: (types) => types.has('rabbitmq'), msg: '📨 Message Queue for async processing — users never wait for slow operations', category: 'resilience' },
  { check: (types) => types.has('kafka'), msg: '🌊 Event streaming with Kafka — real-time data pipelines at scale', category: 'data' },
  { check: (types) => types.has('monitoring'), msg: '📊 Monitoring in place — you can detect issues before users report them', category: 'observability' },
  { check: (types) => types.has('logging'), msg: '📋 Logging infrastructure — essential for debugging distributed systems', category: 'observability' },
  { check: (types) => types.has('api-gateway'), msg: '🚪 API Gateway centralizes routing, auth, and rate-limiting', category: 'architecture' },
  { check: (types) => types.has('websocket'), msg: '🔌 WebSocket support — enables real-time bidirectional communication', category: 'real-time' },
  { check: (types) => types.has('dns'), msg: '🔗 DNS routing configured — essential production infrastructure', category: 'networking' },
  { check: (types) => types.has('serverless'), msg: '⚡ Serverless functions — cost-effective burst processing', category: 'compute' },
  { check: (types) => types.has('aws-s3'), msg: '🪣 Object storage (S3) — 99.999999999% durability for files and media', category: 'storage' },
  { check: (types, conns) => types.has('web-client') && types.has('mobile-client'), msg: '📱 Multi-platform support — reaching both web and mobile users', category: 'clients' },
  { check: (types) => types.has('auth-service'), msg: '🔑 Dedicated Auth Service — security isolated from business logic', category: 'security' },
]

const WARNING_RULES = [
  {
    check: (types, connSet, comps) => {
      const hasDb = types.has('postgresql') || types.has('cassandra') || types.has('mongodb')
      const hasCache = types.has('redis') || types.has('account-cache') || types.has('workspace-cache')
      return hasDb && !hasCache && comps.length > 4
    },
    msg: '⚠️ Database without caching — at scale, every read hits the DB. Add Redis to cache hot data.',
    severity: 'medium',
  },
  {
    check: (types, connSet, comps) => {
      const serviceCount = ['server', 'auth-service', 'workspace-service', 'catalog-service', 'dispatch-service', 'chat-server', 'routing-service'].filter(t => types.has(t)).length
      return serviceCount > 1 && !types.has('load-balancer')
    },
    msg: '⚠️ Multiple services without a Load Balancer — a single point of failure will crash everything.',
    severity: 'high',
  },
  {
    check: (types) => {
      return !types.has('web-client') && !types.has('mobile-client')
    },
    msg: '⚠️ No client entry point — users need a Web Client or Mobile App to access your system.',
    severity: 'high',
  },
  {
    check: (types, connSet, comps, conns) => {
      // Check for orphaned components (no connections)
      const connectedIds = new Set()
      conns.forEach(c => { connectedIds.add(c.from); connectedIds.add(c.to) })
      const orphans = comps.filter(c => !connectedIds.has(c.id))
      return orphans.length > 0 && comps.length > 1
    },
    msg: '⚠️ Disconnected components detected — some nodes have no connections. Use Connect mode to link them.',
    severity: 'medium',
  },
  {
    check: (types, connSet, comps) => {
      const hasClient = types.has('web-client') || types.has('mobile-client')
      const hasServer = types.has('server') || types.has('api-gateway') || types.has('auth-service')
      const hasDb = types.has('postgresql') || types.has('cassandra') || types.has('mongodb')
      return hasClient && hasDb && !hasServer
    },
    msg: '⚠️ Client connected directly to database — you need a server or API layer in between for security.',
    severity: 'high',
  },
  {
    check: (types) => {
      return types.has('cdn') && !types.has('aws-s3')
    },
    msg: '💡 CDN without origin storage — consider adding AWS S3 as the CDN\'s origin for static files.',
    severity: 'low',
  },
  {
    check: (types, connSet, comps) => {
      return comps.length >= 8 && !types.has('monitoring') && !types.has('logging')
    },
    msg: '⚠️ Large system without observability — add Monitoring (Prometheus) or Logging (ELK) to detect failures.',
    severity: 'medium',
  },
]

const SUGGESTION_RULES = [
  {
    check: (types) => !types.has('redis') && !types.has('account-cache') && !types.has('workspace-cache'),
    msg: 'Add a Redis Cache to speed up frequently accessed data (sessions, hot queries).',
    icon: '💎',
  },
  {
    check: (types) => !types.has('load-balancer') && (types.has('server') || types.has('api-gateway')),
    msg: 'Add a Load Balancer (AWS ALB) in front of your servers for horizontal scaling.',
    icon: '⚖️',
  },
  {
    check: (types) => !types.has('cdn') && (types.has('web-client') || types.has('mobile-client')),
    msg: 'Add a CDN to serve static assets (images, JS, CSS) from edge locations near users.',
    icon: '🌍',
  },
  {
    check: (types) => !types.has('rabbitmq') && !types.has('kafka'),
    msg: 'Consider adding a Message Queue (RabbitMQ) for async processing like emails and notifications.',
    icon: '📨',
  },
  {
    check: (types) => !types.has('monitoring'),
    msg: 'Add Prometheus monitoring — track latency, errors, traffic, and saturation (the 4 golden signals).',
    icon: '📊',
  },
  {
    check: (types) => !types.has('api-gateway') && (types.has('auth-service') || types.has('workspace-service') || types.has('catalog-service')),
    msg: 'Add an API Gateway to route requests to your microservices — centralizes auth and rate-limiting.',
    icon: '🚪',
  },
  {
    check: (types) => types.has('postgresql') && !types.has('mongodb') && !types.has('cassandra'),
    msg: 'Consider adding a NoSQL database (MongoDB/Cassandra) for flexible or write-heavy data needs.',
    icon: '🍃',
  },
]

// ——— Next-Step Guidance Rules ———
// Context-aware rules that suggest what users should do next
const NEXT_STEP_RULES = [
  // Step 1: Need a client
  {
    priority: 1,
    check: (types) => !types.has('web-client') && !types.has('mobile-client'),
    msg: 'Start by adding a **Web Client** or **Mobile App** — this is where users interact with your system.',
    action: 'add',
    component: 'web-client',
  },
  // Step 2: Need compute
  {
    priority: 2,
    check: (types) => (types.has('web-client') || types.has('mobile-client')) && !types.has('server') && !types.has('api-gateway') && !types.has('auth-service'),
    msg: 'Add a **Web Server** or **API Gateway** — your client needs a backend to process requests.',
    action: 'add',
    component: 'server',
  },
  // Step 3: Need storage
  {
    priority: 3,
    check: (types) => {
      const hasCompute = types.has('server') || types.has('api-gateway') || types.has('auth-service')
      const hasDb = types.has('postgresql') || types.has('cassandra') || types.has('mongodb')
      return hasCompute && !hasDb
    },
    msg: 'Add a **database** (PostgreSQL, MongoDB, or Cassandra) — your server needs persistent storage for data.',
    action: 'add',
    component: 'postgresql',
  },
  // Step 4: Connect client to server
  {
    priority: 4,
    check: (types, connSet) => {
      const hasClient = types.has('web-client') || types.has('mobile-client')
      const hasCompute = types.has('server') || types.has('api-gateway') || types.has('load-balancer')
      if (!hasClient || !hasCompute) return false
      // Check if client is connected to any compute
      const clientTypes = ['web-client', 'mobile-client']
      const computeTypes = ['server', 'api-gateway', 'load-balancer']
      for (const c of clientTypes) {
        for (const s of computeTypes) {
          if (types.has(c) && types.has(s) && (connSet.has(`${c}->${s}`) || connSet.has(`${s}->${c}`))) return false
        }
      }
      return true
    },
    msg: '🔗 **Connect your client to the server** — click "Connect" in the toolbar, then click the client → server.',
    action: 'connect',
  },
  // Step 5: Connect server to database
  {
    priority: 5,
    check: (types, connSet) => {
      const computeTypes = ['server', 'api-gateway', 'auth-service', 'catalog-service', 'workspace-service']
      const dbTypes = ['postgresql', 'cassandra', 'mongodb']
      const hasCompute = computeTypes.some(t => types.has(t))
      const hasDb = dbTypes.some(t => types.has(t))
      if (!hasCompute || !hasDb) return false
      for (const c of computeTypes) {
        for (const d of dbTypes) {
          if (types.has(c) && types.has(d) && (connSet.has(`${c}->${d}`) || connSet.has(`${d}->${c}`))) return false
        }
      }
      return true
    },
    msg: '🔗 **Connect your server to the database** — your server needs to read/write data.',
    action: 'connect',
  },
  // Scaling: Add load balancer
  {
    priority: 6,
    check: (types) => {
      const hasClient = types.has('web-client') || types.has('mobile-client')
      const hasServer = types.has('server') || types.has('api-gateway')
      const hasDb = types.has('postgresql') || types.has('mongodb') || types.has('cassandra')
      return hasClient && hasServer && hasDb && !types.has('load-balancer')
    },
    msg: 'Scale up: Add a **Load Balancer (AWS ALB)** between clients and servers to handle more traffic.',
    action: 'add',
    component: 'load-balancer',
  },
  // Caching
  {
    priority: 7,
    check: (types) => {
      const hasDb = types.has('postgresql') || types.has('mongodb') || types.has('cassandra')
      const hasCache = types.has('redis') || types.has('account-cache') || types.has('workspace-cache')
      return hasDb && !hasCache
    },
    msg: 'Performance boost: Add **Redis Cache** — cache hot data for 100x faster reads than hitting the database.',
    action: 'add',
    component: 'redis',
  },
  // CDN
  {
    priority: 8,
    check: (types) => {
      const hasClient = types.has('web-client') || types.has('mobile-client')
      return hasClient && !types.has('cdn')
    },
    msg: 'Add a **CDN** to serve static assets (images, CSS, JS) from edge locations worldwide.',
    action: 'add',
    component: 'cdn',
  },
  // Async processing
  {
    priority: 9,
    check: (types) => {
      const hasServer = types.has('server') || types.has('api-gateway') || types.has('auth-service')
      return hasServer && !types.has('rabbitmq') && !types.has('kafka')
    },
    msg: 'Add a **Message Queue** (RabbitMQ) for async tasks — emails, notifications, image processing.',
    action: 'add',
    component: 'rabbitmq',
  },
  // Observability
  {
    priority: 10,
    check: (types, connSet, comps) => {
      return comps.length >= 5 && !types.has('monitoring') && !types.has('logging')
    },
    msg: 'Add **Monitoring** (Prometheus) — track system health and catch issues before users report them.',
    action: 'add',
    component: 'monitoring',
  },
  // API Gateway for microservices
  {
    priority: 11,
    check: (types) => {
      const serviceCount = ['auth-service', 'workspace-service', 'catalog-service', 'dispatch-service', 'chat-server', 'routing-service'].filter(t => types.has(t)).length
      return serviceCount >= 1 && !types.has('api-gateway')
    },
    msg: 'Add an **API Gateway** to route requests to your microservices — centralizes auth and rate-limiting.',
    action: 'add',
    component: 'api-gateway',
  },
  // DNS
  {
    priority: 12,
    check: (types) => {
      return types.has('load-balancer') && !types.has('dns')
    },
    msg: 'Add **DNS (Route53)** — translates your domain name to the load balancer IP for users.',
    action: 'add',
    component: 'dns',
  },
]

/**
 * Analyzes a sandbox (free-design) architecture and returns intelligent feedback.
 * Enhanced with live guidance: next steps, viability, design health, and missing connections.
 * @param {Array} placedComponents - Array of { id, type, x, y }
 * @param {Array} connections - Array of { from, to }
 * @returns {Object} Full analysis result
 */
export function analyzeSandboxDesign(placedComponents, connections) {
  if (placedComponents.length === 0) {
    return {
      score: 0,
      tier: DESIGN_TIERS[0],
      closestMatch: null,
      strengths: [],
      warnings: [],
      suggestions: [],
      categoryBreakdown: COMPONENT_CATEGORIES.map(cat => ({
        label: cat.label, placed: 0, total: cat.components.length, used: false,
      })),
      stats: { components: 0, connections: 0, categories: 0, totalCategories: COMPONENT_CATEGORIES.length },
      nextSteps: [{ msg: 'Start by dragging a **Web Client** 🌐 or **Mobile App** 📱 onto the canvas.', action: 'add', component: 'web-client', priority: 0 }],
      designHealth: { status: 'empty', label: 'Empty Canvas', color: '#64748b', icon: '⬜' },
      viability: { viable: false, reason: 'No components placed yet. Add components to start designing.', percentage: 0 },
      missingConnections: [],
    }
  }

  const placedTypes = new Set(placedComponents.map(c => c.type))

  // Build connection type set for pattern checking
  const idToType = {}
  placedComponents.forEach(c => { idToType[c.id] = c.type })
  const connTypeSet = new Set()
  connections.forEach(conn => {
    const fromType = idToType[conn.from]
    const toType = idToType[conn.to]
    if (fromType && toType) {
      connTypeSet.add(`${fromType}->${toType}`)
      connTypeSet.add(`${toType}->${fromType}`)
    }
  })

  // ——— 1. Pattern Match ———
  let bestMatch = null
  let bestSimilarity = 0

  scenarios.forEach(s => {
    if (!s.requiredComponents || s.requiredComponents.length === 0) return
    
    const scenarioTypes = new Set(s.requiredComponents)
    const intersection = [...scenarioTypes].filter(t => placedTypes.has(t)).length
    const union = new Set([...scenarioTypes, ...placedTypes]).size
    const similarity = union > 0 ? intersection / union : 0

    let connSimilarity = 0
    if (s.requiredConnections && s.requiredConnections.length > 0) {
      const matchedConns = s.requiredConnections.filter(([from, to]) => 
        connTypeSet.has(`${from}->${to}`)
      ).length
      connSimilarity = matchedConns / s.requiredConnections.length
    }

    const totalSim = similarity * 0.7 + connSimilarity * 0.3

    if (totalSim > bestSimilarity && totalSim > 0.15) {
      bestSimilarity = totalSim
      bestMatch = {
        id: s.id,
        title: s.title,
        icon: s.icon,
        similarity: Math.round(totalSim * 100),
        techStack: s.techStack,
        difficulty: s.difficulty,
        missingComponents: s.requiredComponents.filter(t => !placedTypes.has(t)),
        missingConnections: s.requiredConnections
          ? s.requiredConnections.filter(([from, to]) => !connTypeSet.has(`${from}->${to}`))
          : [],
      }
    }
  })

  // ——— 2. Category diversity ———
  const usedCategories = new Set()
  COMPONENT_CATEGORIES.forEach(cat => {
    if (cat.components.some(c => placedTypes.has(c.type))) {
      usedCategories.add(cat.id)
    }
  })

  // ——— 3. Strengths ———
  const strengths = STRENGTH_RULES
    .filter(rule => rule.check(placedTypes, connTypeSet))
    .map(rule => ({ msg: rule.msg, category: rule.category }))

  // ——— 4. Warnings ———
  const warnings = WARNING_RULES
    .filter(rule => rule.check(placedTypes, connTypeSet, placedComponents, connections))
    .map(rule => ({ msg: rule.msg, severity: rule.severity }))

  // ——— 5. Suggestions ———
  const suggestions = SUGGESTION_RULES
    .filter(rule => rule.check(placedTypes))
    .slice(0, 4)
    .map(rule => ({ msg: rule.msg, icon: rule.icon }))

  // ——— 6. Next Steps (top 2 most relevant) ———
  const nextSteps = NEXT_STEP_RULES
    .filter(rule => rule.check(placedTypes, connTypeSet, placedComponents))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 2)
    .map(rule => ({ msg: rule.msg, action: rule.action, component: rule.component, priority: rule.priority }))

  // ——— 7. Architecture Score (0–100) ———
  let score = 0
  score += Math.min(placedComponents.length * 3, 20)

  const connectedIds = new Set()
  connections.forEach(c => { connectedIds.add(c.from); connectedIds.add(c.to) })
  const connectionRatio = placedComponents.length > 0
    ? connectedIds.size / placedComponents.length
    : 0
  score += Math.round(connectionRatio * 20)
  score += Math.round((usedCategories.size / COMPONENT_CATEGORIES.length) * 20)
  score += Math.min(strengths.length * 4, 25)

  const warningPenalty = warnings.reduce((sum, w) => {
    if (w.severity === 'high') return sum + 5
    if (w.severity === 'medium') return sum + 3
    return sum + 1
  }, 0)
  score -= Math.min(warningPenalty, 15)

  if (bestMatch) {
    score += Math.round(bestMatch.similarity * 0.15)
  }

  score = Math.max(0, Math.min(100, score))

  // ——— 8. Design Tier ———
  const tier = DESIGN_TIERS.find(t => score >= t.minScore && score <= t.maxScore) || DESIGN_TIERS[0]

  // ——— 9. Category breakdown ———
  const categoryBreakdown = COMPONENT_CATEGORIES.map(cat => {
    const placed = cat.components.filter(c => placedTypes.has(c.type)).length
    return {
      label: cat.label,
      placed,
      total: cat.components.length,
      used: placed > 0,
    }
  })

  // ——— 10. Viability Check — "Will this design actually work?" ———
  const hasClient = placedTypes.has('web-client') || placedTypes.has('mobile-client')
  const hasCompute = placedTypes.has('server') || placedTypes.has('api-gateway') || placedTypes.has('auth-service') || placedTypes.has('workspace-service')
  const hasStorage = placedTypes.has('postgresql') || placedTypes.has('mongodb') || placedTypes.has('cassandra')
  const hasClientToCompute = (() => {
    const clientTypes = ['web-client', 'mobile-client']
    const computeTypes = ['server', 'api-gateway', 'load-balancer', 'auth-service']
    for (const c of clientTypes) {
      for (const s of computeTypes) {
        if (connTypeSet.has(`${c}->${s}`)) return true
      }
    }
    return false
  })()
  const hasComputeToStorage = (() => {
    const computeTypes = ['server', 'api-gateway', 'auth-service', 'workspace-service', 'catalog-service']
    const dbTypes = ['postgresql', 'mongodb', 'cassandra']
    for (const c of computeTypes) {
      for (const d of dbTypes) {
        if (connTypeSet.has(`${c}->${d}`)) return true
      }
    }
    return false
  })()

  let viabilityPercentage = 0
  let viabilityReason = ''
  const viabilityChecks = []

  // Check 1: Has client entry point (25%)
  viabilityChecks.push({ label: 'User entry point (Client)', met: hasClient, weight: 25 })
  // Check 2: Has compute/server (25%)
  viabilityChecks.push({ label: 'Application logic (Server)', met: hasCompute, weight: 25 })
  // Check 3: Has persistent storage (25%)
  viabilityChecks.push({ label: 'Data persistence (Database)', met: hasStorage, weight: 25 })
  // Check 4: End-to-end connected (25%)
  const isConnected = hasClientToCompute && hasComputeToStorage
  viabilityChecks.push({ label: 'End-to-end data flow', met: isConnected, weight: 25 })

  viabilityPercentage = viabilityChecks.reduce((sum, c) => sum + (c.met ? c.weight : 0), 0)

  const viable = viabilityPercentage >= 75
  if (viabilityPercentage === 100) {
    viabilityReason = '✅ This design is viable! Data can flow from users through your servers to the database and back.'
  } else if (viabilityPercentage >= 75) {
    viabilityReason = '🟡 Almost there! Your core architecture works, but connect all layers for full data flow.'
  } else if (viabilityPercentage >= 50) {
    viabilityReason = '🟠 Partially viable — you have some pieces, but critical layers are missing.'
  } else if (viabilityPercentage > 0) {
    viabilityReason = '🔴 Not yet viable — a working system needs a Client, Server, and Database all connected.'
  } else {
    viabilityReason = '⬜ Add components to start building your architecture.'
  }

  // ——— 11. Design Health Status ———
  const highWarnings = warnings.filter(w => w.severity === 'high').length
  let designHealth
  if (viabilityPercentage === 0) {
    designHealth = { status: 'empty', label: 'Empty Canvas', color: '#64748b', icon: '⬜' }
  } else if (highWarnings >= 2 || viabilityPercentage < 50) {
    designHealth = { status: 'critical', label: 'Critical Issues', color: '#ef4444', icon: '🔴' }
  } else if (highWarnings >= 1 || warnings.length >= 3 || viabilityPercentage < 75) {
    designHealth = { status: 'warning', label: 'Needs Attention', color: '#f59e0b', icon: '🟡' }
  } else if (score >= 60 && viabilityPercentage === 100) {
    designHealth = { status: 'excellent', label: 'Excellent Design', color: '#22c55e', icon: '🟢' }
  } else if (viabilityPercentage >= 75) {
    designHealth = { status: 'healthy', label: 'On Track', color: '#34d399', icon: '🟢' }
  } else {
    designHealth = { status: 'warning', label: 'Needs Work', color: '#f59e0b', icon: '🟡' }
  }

  // ——— 12. Missing Connections for closest match ———
  const missingConnections = bestMatch && bestMatch.missingConnections
    ? bestMatch.missingConnections.slice(0, 3).map(([from, to]) => {
        const fromComp = COMPONENT_MAP[from]
        const toComp = COMPONENT_MAP[to]
        return {
          from: fromComp?.label || from,
          fromIcon: fromComp?.icon || '❓',
          to: toComp?.label || to,
          toIcon: toComp?.icon || '❓',
        }
      })
    : []

  return {
    score,
    tier,
    closestMatch: bestMatch,
    strengths,
    warnings,
    suggestions,
    categoryBreakdown,
    stats: {
      components: placedComponents.length,
      connections: connections.length,
      categories: usedCategories.size,
      totalCategories: COMPONENT_CATEGORIES.length,
    },
    nextSteps,
    designHealth,
    viability: { viable, reason: viabilityReason, percentage: viabilityPercentage, checks: viabilityChecks },
    missingConnections,
  }
}
