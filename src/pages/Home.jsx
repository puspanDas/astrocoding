import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Rocket, Code2, MonitorPlay, Timer, Languages, Bot,
  Users, Gamepad2, Zap, ChevronRight, Star
} from 'lucide-react'
import StarField from '../components/StarField'
import FeatureCard from '../components/FeatureCard'
import FactionCard from '../components/FactionCard'
import './Home.css'

const features = [
  { icon: <MonitorPlay size={28} />, title: 'Split-Screen IDE', description: 'Code on the left, watch your robot come alive on the right. Real-time 3D execution of every line you write.' },
  { icon: <Timer size={28} />, title: 'Time-Travel Debugger', description: 'Made a mistake? Our debugger rewinds to the exact line that caused the crash and highlights it with a hint.' },
  { icon: <Languages size={28} />, title: '"Translate" Button', description: 'Write in Python, instantly see it in Java or C++. Understand how languages express the same ideas differently.' },
  { icon: <Bot size={28} />, title: 'Mentor AI Droid', description: 'An age-adaptive AI companion that explains errors in plain English and gives contextual hints — never the answer.' },
  { icon: <Users size={28} />, title: 'Co-Op Missions', description: 'Team up across ages & skill levels. Grandpa writes Java logic while the kid uses drag-and-drop Python!' },
  { icon: <Zap size={28} />, title: 'Adaptive Engine', description: 'Three UI modes scale from drag-and-drop blocks to full IDE — the same puzzle, tailored to your level.' },
]

const factions = [
  {
    name: 'Python Federation',
    icon: '🐍',
    color: 'green',
    description: 'Masters of AI, data science, and rapid exploration. Easy syntax, powerful results.',
    features: ['Fast exploration & prototyping', 'AI & biological research', 'Dynamic typing, clean syntax', 'Best for beginners'],
  },
  {
    name: 'Java Syndicate',
    icon: '☕',
    color: 'yellow',
    description: 'Builders of massive orbital structures and networked trade routes.',
    features: ['Object-oriented architecture', 'Massive scalable structures', 'Networked systems & APIs', 'Enterprise-grade code'],
  },
  {
    name: 'C++ Vanguard',
    icon: '⚡',
    color: 'red',
    description: 'Elite engineers of speed, optimization, and hyper-space defense systems.',
    features: ['High-performance engines', 'Memory management mastery', 'Defense & weapons systems', 'Maximum efficiency'],
  },
]

const personas = [
  { name: 'Leo', age: 7, emoji: '👦', desc: 'Loves Minecraft. Needs bright colors and instant visual feedback. Learning through drag-and-drop blocks.', mode: 'Blueprint Mode' },
  { name: 'Maya', age: 15, emoji: '👩‍💻', desc: 'Wants to build real games and apps. Types real code with smart autocomplete guiding the way.', mode: 'Scaffold Mode' },
  { name: 'Arthur', age: 55, emoji: '👨‍🔬', desc: 'Retired engineer keeping his mind sharp. Full IDE with efficiency points — no childish interfaces.', mode: 'Terminal Mode' },
]

export default function Home() {
  return (
    <div className="home">
      <StarField />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__nebula" />
        <div className="hero__content container">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Star size={14} /> Now in Early Access
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Code Your Way
            <br />
            <span className="hero__gradient">Across the Galaxy</span>
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Learn Python, Java, and C++ through epic space missions.
            Program robots, automate space stations, and explore galaxies
            — whether you're 6 or 60.
          </motion.p>

          <motion.div
            className="hero__buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/play" className="btn-primary">
              <span>Start Your Mission</span>
              <Rocket size={18} />
            </Link>
            <a href="#features" className="btn-secondary">
              <Gamepad2 size={18} />
              <span>Explore Features</span>
            </a>
          </motion.div>

          <motion.div
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="hero__stat">
              <span className="hero__stat-number">3</span>
              <span className="hero__stat-label">Languages</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">6-60</span>
              <span className="hero__stat-label">Age Range</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">∞</span>
              <span className="hero__stat-label">Galaxies</span>
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
            Every feature is designed to make coding feel like an epic adventure, not a chore.
          </p>
          <div className="features-grid">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADAPTIVE SYNTAX ENGINE ===== */}
      <section id="engine" className="engine-section">
        <div className="container">
          <h2 className="section-title">The Adaptive Syntax Engine</h2>
          <p className="section-subtitle">
            Three UI modes that seamlessly scale from visual block-coding
            to a full professional IDE — all on the same puzzle.
          </p>
          <EngineDemo />
        </div>
      </section>

      {/* ===== FACTIONS ===== */}
      <section id="factions" className="factions-section">
        <div className="container">
          <h2 className="section-title">Choose Your Faction</h2>
          <p className="section-subtitle">
            Languages aren't dropdowns — they're civilizations. Each faction
            has its own missions, aesthetics, and specialties.
          </p>
          <div className="factions-grid">
            {factions.map((f, i) => (
              <FactionCard key={i} {...f} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PERSONAS ===== */}
      <section id="personas" className="personas-section">
        <div className="container">
          <h2 className="section-title">Built for Everyone</h2>
          <p className="section-subtitle">
            From a 7-year-old Minecraft fan to a 55-year-old retired engineer
            — AstroCode adapts to every kind of learner.
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
                <h3 className="persona-card__name">{p.name}, Age {p.age}</h3>
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
            <h2 className="cta-box__title">Ready to Explore the Galaxy?</h2>
            <p className="cta-box__subtitle">
              Start your first mission today — no signup needed. <br />
              Learn real code through real adventure.
            </p>
            <Link to="/play" className="btn-primary cta-box__btn">
              <span>Launch Your First Mission</span>
              <Rocket size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="navbar__logo">
              <div className="navbar__logo-icon"><Rocket size={18} /></div>
              <span className="navbar__logo-text">AstroCode</span>
            </div>
            <p className="footer__tagline">Coding for everyone, from 6 to 60.</p>
          </div>
          <div className="footer__links">
            <a href="#features">Features</a>
            <a href="#factions">Factions</a>
            <a href="#engine">Engine</a>
            <Link to="/play">Play</Link>
          </div>
          <div className="footer__copy">
            © 2026 AstroCode. The Galactic Developer.
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ======= Inline Engine Demo Component ======= */
function EngineDemo() {
  const navigate = React.useCallback((path) => {
    window.location.href = path
  }, [])

  const modes = [
    {
      id: 'blueprint',
      label: 'Blueprint',
      ages: 'Ages 6-9',
      color: '#10b981',
      code: (
        <div className="engine-demo__blocks">
          <div className="code-block code-block--green">🔁 repeat 5 times</div>
          <div className="code-block code-block--blue" style={{ marginLeft: 24 }}>🤖 rover.move_forward()</div>
          <div className="code-block code-block--purple" style={{ marginLeft: 24 }}>🔄 rover.turn_right()</div>
        </div>
      ),
      desc: 'Drag-and-drop blocks that show actual code syntax. Visual, tactile, instant feedback.',
    },
    {
      id: 'scaffold',
      label: 'Scaffold',
      ages: 'Ages 10-15',
      color: '#f59e0b',
      code: (
        <div className="engine-demo__code">
          <code>
            <span className="code-kw">for</span> i <span className="code-kw">in</span> <span className="code-fn">range</span>(5):{'\n'}
            {'    '}rover.<span className="code-fn">move_forward</span>(){'\n'}
            {'    '}rover.<span className="code-fn">turn_right</span>()
          </code>
        </div>
      ),
      desc: 'Real text coding with boilerplate hidden behind "Shields." Smart autocomplete included.',
    },
    {
      id: 'terminal',
      label: 'Terminal',
      ages: 'Ages 16+',
      color: '#ef4444',
      code: (
        <div className="engine-demo__code engine-demo__code--terminal">
          <code>
            <span className="code-comment"># Full IDE — earn efficiency points</span>{'\n'}
            <span className="code-kw">def</span> <span className="code-fn">navigate_crater</span>(rover, depth):{'\n'}
            {'    '}<span className="code-kw">for</span> i <span className="code-kw">in</span> <span className="code-fn">range</span>(depth):{'\n'}
            {'        '}rover.<span className="code-fn">thrust</span>(power=i*<span className="code-num">2</span>){'\n'}
            {'        '}<span className="code-kw">if</span> rover.altitude {'>'} depth:{'\n'}
            {'            '}<span className="code-kw">break</span>{'\n'}
            {'    '}<span className="code-kw">return</span> rover.status
          </code>
        </div>
      ),
      desc: 'Full professional IDE experience. Write everything from scratch. Bonus points for clean code.',
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
            to={`/play?mode=${current.id}`}
            className="engine-demo__try-btn"
            style={{ '--mode-color': current.color }}
          >
            <span>Try {current.label} Mode</span>
            <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Need React import for useState in EngineDemo
import React from 'react'
