import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Gem, Star, Rocket, Shield, Crown } from 'lucide-react'
import StarField from '../components/StarField'
import './Leaderboard.css'

// Mock Data for the Leaderboard
const MOCK_LEADERBOARD = [
  { id: 1, name: 'NovaKnight', rank: 1, scrap: 15420, cores: 84, language: 'javascript', avatar: '🦁' },
  { id: 2, name: 'CosmicCoder', rank: 2, scrap: 14200, cores: 79, language: 'python', avatar: '🐱' },
  { id: 3, name: 'StarWeaver', rank: 3, scrap: 13850, cores: 72, language: 'java', avatar: '🦄' },
  { id: 4, name: 'ByteWalker', rank: 4, scrap: 12100, cores: 65, language: 'cpp', avatar: '🦊' },
  { id: 5, name: 'AstroPioneer', rank: 5, scrap: 11500, cores: 61, language: 'javascript', avatar: '🐼' },
  { id: 6, name: 'NebulaNinja', rank: 6, scrap: 10800, cores: 58, language: 'python', avatar: '🥷' },
  { id: 7, name: 'OrbitRider', rank: 7, scrap: 9400, cores: 52, language: 'cpp', avatar: '🐙' },
  { id: 8, name: 'QuantumQ', rank: 8, scrap: 8900, cores: 48, language: 'java', avatar: '🦅' },
  { id: 9, name: 'SpaceSquid', rank: 9, scrap: 8200, cores: 44, language: 'javascript', avatar: '🦑' },
  { id: 10, name: 'LunarLander', rank: 10, scrap: 7500, cores: 39, language: 'python', avatar: '🦉' },
  { id: 11, name: 'GalacticGamer', rank: 11, scrap: 6800, cores: 35, language: 'java', avatar: '🎮' },
  { id: 12, name: 'VoidVoyager', rank: 12, scrap: 6200, cores: 31, language: 'cpp', avatar: '🕳️' },
]

const LANG_COLORS = {
  javascript: '#f7df1e',
  python: '#10b981',
  java: '#f59e0b',
  cpp: '#ef4444'
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('global') // global, friends
  const [sortBy, setSortBy] = useState('scrap') // scrap, cores

  // Sort logic for the table
  const sortedData = useMemo(() => {
    return [...MOCK_LEADERBOARD].sort((a, b) => b[sortBy] - a[sortBy])
  }, [sortBy])

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  // Helper to render Top 3 uniquely
  const top3 = sortedData.slice(0, 3)
  const restList = sortedData.slice(3)

  return (
    <div className="leaderboard-page">
      <StarField />
      
      <div className="container">
        <motion.div 
          className="leaderboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="leaderboard-header__title-group">
            <Trophy size={32} className="leaderboard-header__icon" />
            <h1 className="leaderboard-header__title">Galactic Hall of Fame</h1>
          </div>
          <p className="leaderboard-header__subtitle">The top cadets across the universe. Are you on the list?</p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div 
          className="podium"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 2nd Place */}
          {top3[1] && (
            <div className="podium-item podium-item--second">
              <div className="podium-avatar">{top3[1].avatar}</div>
              <div className="podium-name">{top3[1].name}</div>
              <div className="podium-stats">
                {sortBy === 'scrap' ? <><Gem size={14}/> {top3[1].scrap}</> : <><Trophy size={14}/> {top3[1].cores}</>}
              </div>
              <div className="podium-base">
                <span className="podium-rank">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="podium-item podium-item--first">
              <Crown size={28} className="podium-crown" />
              <div className="podium-avatar">{top3[0].avatar}</div>
              <div className="podium-name">{top3[0].name}</div>
              <div className="podium-stats">
                {sortBy === 'scrap' ? <><Gem size={14}/> {top3[0].scrap}</> : <><Trophy size={14}/> {top3[0].cores}</>}
              </div>
              <div className="podium-base">
                <span className="podium-rank">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="podium-item podium-item--third">
              <div className="podium-avatar">{top3[2].avatar}</div>
              <div className="podium-name">{top3[2].name}</div>
              <div className="podium-stats">
                {sortBy === 'scrap' ? <><Gem size={14}/> {top3[2].scrap}</> : <><Trophy size={14}/> {top3[2].cores}</>}
              </div>
              <div className="podium-base">
                <span className="podium-rank">3</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* List Section */}
        <div className="leaderboard-content glass-card">
          <div className="leaderboard-controls">
            <div className="leaderboard-tabs">
              <button 
                className={`leaderboard-tab ${activeTab === 'global' ? 'active' : ''}`}
                onClick={() => setActiveTab('global')}
              >
                Global
              </button>
              <button 
                className={`leaderboard-tab ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
            </div>
            
            <div className="leaderboard-filters">
              <span className="filter-label">Sort By:</span>
              <button 
                className={`filter-btn ${sortBy === 'scrap' ? 'active' : ''}`}
                onClick={() => setSortBy('scrap')}
              >
                <Gem size={14} /> Scrap
              </button>
              <button 
                className={`filter-btn ${sortBy === 'cores' ? 'active' : ''}`}
                onClick={() => setSortBy('cores')}
              >
                <Trophy size={14} /> Cores
              </button>
            </div>
          </div>

          <div className="leaderboard-list-header">
            <div className="col-rank">Rank</div>
            <div className="col-user">Cadet</div>
            <div className="col-scrap">Scrap</div>
            <div className="col-cores">Cores</div>
          </div>

          <motion.div 
            className="leaderboard-list"
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            {restList.map((user, index) => (
              <motion.div key={user.id} className="leaderboard-row" variants={rowVariants}>
                <div className="col-rank">#{index + 4}</div>
                <div className="col-user">
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.name}</span>
                  <div 
                    className="user-lang-dot" 
                    title={user.language}
                    style={{ backgroundColor: LANG_COLORS[user.language] }}
                  />
                </div>
                <div className="col-scrap"><Gem size={14}/> {user.scrap.toLocaleString()}</div>
                <div className="col-cores"><Trophy size={14}/> {user.cores}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Current User Static Row */}
          <div className="leaderboard-active-user glass-card">
            <div className="col-rank">#42</div>
            <div className="col-user">
              <span className="user-avatar">🚀</span>
              <span className="user-name">You (Cadet)</span>
            </div>
            <div className="col-scrap"><Gem size={14}/> 450</div>
            <div className="col-cores"><Trophy size={14}/> 2</div>
          </div>
        </div>

      </div>
    </div>
  )
}
