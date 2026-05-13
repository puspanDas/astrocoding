import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Code2, MonitorPlay, Timer, Languages, Bot,
  Users, Layers, Zap, ChevronRight, Cpu
} from 'lucide-react'
import FeatureCard from '../components/FeatureCard'
import './Home.css'

const features = [
  { icon: <MonitorPlay size={28} />, title: 'Split-Screen IDE', description: 'Code on the left, watch your application render live on the right. Real-time execution.' },
  { icon: <Timer size={28} />, title: 'Advanced Debugger', description: 'Step through your code to pinpoint exactly where errors occur with contextual hints.' },
  { icon: <Languages size={28} />, title: 'Multi-Language Support', description: 'Write in Python, instantly see it in Java or C++. Understand how languages express the same ideas.' },
  { icon: <Bot size={28} />, title: 'AI Code Assistant', description: 'An intelligent companion that explains errors in plain English and gives contextual hints.' },
  { icon: <Users size={28} />, title: 'Collaborative Projects', description: 'Work together in real-time. Share your sandbox environment with team members.' },
  { icon: <Zap size={28} />, title: 'Adaptive Environments', description: 'Scale from visual blocks for beginners to a full professional IDE for seasoned developers.' },
  { icon: <Cpu size={28} />, title: 'System Design Lab', description: 'Architect real systems with drag-and-drop components — from microservices to distributed platforms.' },
]

const languages = [
  {
    name: 'Python',
    icon: '🐍',
    color: 'green',
    description: 'Masters of AI, data science, and rapid exploration. Easy syntax, powerful results.',
    features: ['Fast exploration & prototyping', 'AI & data analysis', 'Dynamic typing, clean syntax'],
  },
  {
    name: 'Java',
    icon: '☕',
    color: 'yellow',
    description: 'Builders of enterprise architecture and networked applications.',
    features: ['Object-oriented architecture', 'Massive scalable structures', 'Enterprise-grade code'],
  },
  {
    name: 'C++',
    icon: '⚡',
    color: 'red',
    description: 'Elite engineers of speed, optimization, and system-level performance.',
    features: ['High-performance engines', 'Memory management mastery', 'Maximum efficiency'],
  },
]

const personas = [
  { name: 'Anika', role: 'Student', emoji: '🎓', desc: 'Building her first web app. Uses visual blocks to grasp concepts, then transitions to real code.', mode: 'Visual Mode' },
  { name: 'Maya', role: 'Graduate', emoji: '👩‍💻', desc: 'Prepping for technical interviews. Guided templates help her focus on problem-solving patterns.', mode: 'Guided Mode' },
  { name: 'James', role: 'Professional', emoji: '💼', desc: 'Learning Python for data science. Full IDE with efficiency tracking and powerful tools.', mode: 'Pro Mode' },
]

export default function Home() {
  return (
    <div className="home">

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__nebula" />
        <div className="hero__content container">

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Professional Coding
            <br />
            <span className="hero__gradient">Platform</span>
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Master Python, Java, and C++ through real engineering projects.
            Build applications, architect systems, and solve complex challenges
            in a premium developer environment.
          </motion.p>

          <motion.div
            className="hero__buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/sandbox" className="btn-primary">
              <span>Start Coding</span>
              <Code2 size={18} />
            </Link>
            <a href="#features" className="btn-secondary">
              <Layers size={18} />
              <span>Explore Features</span>
            </a>
          </motion.div>

          <motion.div
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="hero__stat">
              <span className="hero__stat-number">3+</span>
              <span className="hero__stat-label">Languages</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">3</span>
              <span className="hero__stat-label">Environments</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">Pro</span>
              <span className="hero__stat-label">Tools</span>
            </div>
          </motion.div>
        </div>

        <div className="hero__scroll-indicator">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Powered by Innovation</h2>
          <p className="section-subtitle">
            Every feature is engineered to accelerate your development process and enhance learning through hands-on practice.
          </p>
          <div className="features-grid">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADAPTIVE SYNTAX ENGINE ===== */}
      <section id="environments" className="engine-section">
        <div className="container">
          <h2 className="section-title">Adaptive Environments</h2>
          <p className="section-subtitle">
            Three coding environments that scale with your project requirements —
            from visual scaffolding to a full professional IDE.
          </p>
          <EngineDemo />
        </div>
      </section>

      {/* ===== LANGUAGES ===== */}
      <section id="languages" className="languages-section">
        <div className="container">
          <h2 className="section-title">Supported Languages</h2>
          <p className="section-subtitle">
            Master the industry standards. Each language environment is fully equipped with advanced linting and debugging tools.
          </p>
          <div className="languages-grid">
            {languages.map((lang, i) => (
              <div key={i} className="language-card glass-card">
                <div className="language-card__header" style={{ '--lang-color': `var(--${lang.color}-primary)` }}>
                  <span className="language-card__icon">{lang.icon}</span>
                  <h3 className="language-card__name">{lang.name}</h3>
                </div>
                <p className="language-card__desc">{lang.description}</p>
                <ul className="language-card__features">
                  {lang.features.map((feature, j) => (
                    <li key={j}><ChevronRight size={14} /> {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PERSONAS ===== */}
      <section id="personas" className="personas-section">
        <div className="container">
          <h2 className="section-title">Built for Every Developer</h2>
          <p className="section-subtitle">
            From students learning the basics to seasoned professionals architecting complex systems
            — AstroCode adapts to your workflow.
          </p>
          <div className="personas-grid">
            {personas.map((p, i) => (
              <motion.div
                key={i}
                className="persona-card glass-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="persona-card__emoji">{p.emoji}</div>
                <h3 className="persona-card__name">{p.name}, {p.role}</h3>
                <p className="persona-card__desc">{p.desc}</p>
                <div className="persona-card__mode">
                  <Code2 size={14} />
                  <span>{p.mode}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-box"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-box__title">Ready to Start Building?</h2>
            <p className="cta-box__subtitle">
              Open the Sandbox today — no signup needed. <br />
              Experience a premium development environment.
            </p>
            <Link to="/sandbox" className="btn-primary cta-box__btn">
              <span>Launch Sandbox</span>
              <Code2 size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="navbar__logo">
              <div className="navbar__logo-icon"><Code2 size={18} /></div>
              <span className="navbar__logo-text">AstroCode</span>
            </div>
            <p className="footer__tagline">The Professional Developer Platform.</p>
          </div>
          <div className="footer__links">
            <a href="#features">Features</a>
            <a href="#languages">Languages</a>
            <a href="#environments">Environments</a>
            <Link to="/sandbox">Sandbox</Link>
          </div>
          <div className="footer__copy">
            © 2026 AstroCode.
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ======= Inline Engine Demo Component ======= */
function EngineDemo() {

  const modes = [
    {
      id: 'visual',
      label: 'Visual',
      ages: 'Beginner',
      color: '#10b981',
      code: (
        <div className="engine-demo__blocks">
          <div className="code-block code-block--green">🔁 for (item in list)</div>
          <div className="code-block code-block--blue" style={{ marginLeft: 24 }}>⚙️ process(item)</div>
          <div className="code-block code-block--purple" style={{ marginLeft: 24 }}>💾 save(item)</div>
        </div>
      ),
      desc: 'Snap-together blocks that map to real code syntax. Perfect for building intuition before typing.',
    },
    {
      id: 'guided',
      label: 'Guided',
      ages: 'Intermediate',
      color: '#f59e0b',
      code: (
        <div className="engine-demo__code">
          <code>
            <span className="code-kw">for</span> item <span className="code-kw">in</span> <span className="code-fn">get_data</span>():{'\n'}
            {'    '}<span className="code-fn">process</span>(item){'\n'}
            {'    '}<span className="code-fn">save_to_db</span>(item)
          </code>
        </div>
      ),
      desc: 'Write real code with smart autocomplete and boilerplate handled for you. Focus on the logic.',
    },
    {
      id: 'pro',
      label: 'Pro',
      ages: 'Advanced',
      color: '#ef4444',
      code: (
        <div className="engine-demo__code engine-demo__code--terminal">
          <code>
            <span className="code-comment"># Full IDE Setup</span>{'\n'}
            <span className="code-kw">def</span> <span className="code-fn">pipeline</span>(data_source):{'\n'}
            {'    '}results = []{'\n'}
            {'    '}<span className="code-kw">for</span> item <span className="code-kw">in</span> data_source:{'\n'}
            {'        '}processed = <span className="code-fn">process</span>(item){'\n'}
            {'        '}results.<span className="code-fn">append</span>(processed){'\n'}
            {'    '}<span className="code-kw">return</span> results
          </code>
        </div>
      ),
      desc: 'Full professional IDE. Write everything from scratch with advanced linting and AI assistance.',
    },
  ]

  const [active, setActive] = React.useState(0)
  const current = modes[active]

  return (
    <motion.div
      className="engine-demo glass-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="engine-demo__tabs">
        {modes.map((m, i) => (
          <button
            key={m.id}
            className={`engine-demo__tab ${active === i ? 'engine-demo__tab--active' : ''}`}
            style={{ '--tab-color': m.color }}
            onClick={() => setActive(i)}
          >
            <span className="engine-demo__tab-label">{m.label}</span>
            <span className="engine-demo__tab-ages">{m.ages}</span>
          </button>
        ))}
      </div>
      <div className="engine-demo__body">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="engine-demo__content"
        >
          {current.code}
          <p className="engine-demo__desc">{current.desc}</p>
          <Link
            to={`/sandbox?mode=${current.id}`}
            className="engine-demo__try-btn"
            style={{ '--mode-color': current.color }}
          >
            <span>Open Sandbox</span>
            <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

import React from 'react'
