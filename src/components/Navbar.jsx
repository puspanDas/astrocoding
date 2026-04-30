import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Rocket, Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeSwitcher from './ThemeSwitcher'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Rocket size={22} />
          </div>
          <span className="navbar__logo-text">AstroCode</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <a href="/#features" className="navbar__link">Features</a>
          <a href="/#factions" className="navbar__link">Factions</a>
          <a href="/#engine" className="navbar__link">Engine</a>
          <a href="/#personas" className="navbar__link">For Everyone</a>
          <Link to="/leaderboard" className="navbar__link">Hall of Fame</Link>
          <Link to="/sandbox" className="navbar__link">Sandbox IDE</Link>
          <Link to="/system-design" className="navbar__link">Design Lab</Link>
          <Link to="/qa-lab" className="navbar__link" style={{ color: '#f87171' }}>QA Lab</Link>
          <Link to="/profile" className="navbar__link navbar__link--profile">
            <User size={14} />
            <span>Profile</span>
          </Link>
          <ThemeSwitcher />
          <Link to="/play" className="btn-primary navbar__cta">
            <span>Launch Mission</span>
            <Rocket size={16} />
          </Link>
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  )
}
