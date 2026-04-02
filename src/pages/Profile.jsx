import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gem, Trophy, Rocket, Target, Code, Star, Zap, Award, CheckCircle, Lock } from 'lucide-react'
import StarField from '../components/StarField'
import missions from '../engine/missions'
import './Profile.css'

const LANGUAGES = {
  javascript: { label: 'JavaScript', icon: 'JS', color: '#f7df1e' },
  python:     { label: 'Python',     icon: '🐍', color: '#10b981' },
  java:       { label: 'Java',       icon: '☕', color: '#f59e0b' },
  cpp:        { label: 'C++',        icon: '⚡', color: '#ef4444' },
}

const BADGES = [
  {
    id: 'first-launch',
    icon: '🚀',
    title: 'First Launch',
    desc: 'Complete your first mission',
    unlocked: (p) => p.completedMissions.length >= 1,
    color: '#a855f7',
  },
  {
    id: 'scrap-collector',
    icon: '💎',
    title: 'Scrap Collector',
    desc: 'Earn 100+ scrap',
    unlocked: (p) => p.scrap >= 100,
    color: '#06b6d4',
  },
  {
    id: 'core-master',
    icon: '🏆',
    title: 'Core Master',
    desc: 'Earn 5+ cores',
    unlocked: (p) => p.cores >= 5,
    color: '#f59e0b',
  },
  {
    id: 'polyglot',
    icon: '🌐',
    title: 'Polyglot',
    desc: 'Play in 2+ languages',
    unlocked: (p) => p.languagesUsed >= 2,
    color: '#10b981',
  },
  {
    id: 'mission-ace',
    icon: '🎯',
    title: 'Mission Ace',
    desc: 'Complete 3+ missions',
    unlocked: (p) => p.completedMissions.length >= 3,
    color: '#3b82f6',
  },
  {
    id: 'completionist',
    icon: '⭐',
    title: 'Completionist',
    desc: 'Complete all missions',
    unlocked: (p) => p.completedMissions.length >= missions.filter(m => m.difficulty > 0).length,
    color: '#f97316',
  },
]

function loadProgress() {
  try {
    const raw = localStorage.getItem('astrocode-progress')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function Profile() {
  const progress = useMemo(() => loadProgress(), [])

  const scrap = progress.scrap || 0
  const cores = progress.cores || 0
  const completedMissions = progress.completedMissions || []
  const language = progress.language || 'javascript'
  const lastSaved = progress.lastSaved ? new Date(progress.lastSaved).toLocaleDateString() : 'Never'
  const totalMissions = missions.filter(m => m.difficulty > 0).length
  const completionPct = Math.round((completedMissions.length / totalMissions) * 100)

  // Derive languages used from saved language + completed missions (approximation)
  const languagesUsed = progress.languagesUsed || 1

  const profileData = { scrap, cores, completedMissions, languagesUsed }

  const unlockedBadges = BADGES.filter(b => b.unlocked(profileData))
  const lockedBadges = BADGES.filter(b => !b.unlocked(profileData))

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
  }

  return (
    <div className="profile-page">
      <StarField />

      <div className="container">
        {/* Header */}
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-avatar">
            <Rocket size={36} />
          </div>
          <div className="profile-header__info">
            <h1 className="profile-header__name">Cadet Profile</h1>
            <p className="profile-header__meta">
              <span>Preferred Language: <strong>{LANGUAGES[language]?.label || 'JavaScript'}</strong></span>
              <span className="profile-header__dot">·</span>
              <span>Last Active: <strong>{lastSaved}</strong></span>
            </p>
          </div>
          <Link to="/play" className="btn-primary profile-header__cta">
            <Rocket size={15} />
            <span>Continue Mission</span>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <div className="profile-stats">
          {[
            { icon: <Gem size={22} />, value: scrap, label: 'Scrap Earned', color: '#a855f7' },
            { icon: <Trophy size={22} />, value: cores, label: 'Cores Earned', color: '#f59e0b' },
            { icon: <Target size={22} />, value: `${completedMissions.length}/${totalMissions}`, label: 'Missions Done', color: '#10b981' },
            { icon: <Award size={22} />, value: unlockedBadges.length, label: 'Badges Earned', color: '#06b6d4' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="profile-stat-card glass-card"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="profile-stat-card__icon" style={{ color: stat.color }}>{stat.icon}</div>
              <div className="profile-stat-card__value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="profile-stat-card__label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          className="profile-progress glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="profile-progress__header">
            <div className="profile-progress__title">
              <Zap size={16} /> Mission Progress
            </div>
            <span className="profile-progress__pct">{completionPct}%</span>
          </div>
          <div className="profile-progress__bar">
            <motion.div
              className="profile-progress__fill"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="profile-progress__sub">{completedMissions.length} of {totalMissions} missions completed</p>
        </motion.div>

        <div className="profile-grid">
          {/* Missions */}
          <motion.div
            className="profile-section glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="profile-section__title"><Target size={16} /> Missions</h2>
            <div className="mission-list">
              {missions.map((m) => {
                const done = completedMissions.includes(m.id)
                return (
                  <div key={m.id} className={`mission-row ${done ? 'mission-row--done' : ''}`}>
                    <span className="mission-row__icon">{m.icon}</span>
                    <div className="mission-row__info">
                      <span className="mission-row__title">{m.title}</span>
                      <span className="mission-row__diff">
                        {m.difficulty === 0 ? 'Free Play' : '★'.repeat(m.difficulty) + '☆'.repeat(4 - m.difficulty)}
                      </span>
                    </div>
                    <div className="mission-row__reward">
                      {done ? (
                        <>
                          <CheckCircle size={14} className="mission-row__check" />
                          <span className="mission-row__earned">+{m.reward.scrap} <Gem size={11} /></span>
                        </>
                      ) : (
                        <span className="mission-row__pending">{m.reward.scrap} <Gem size={11} /></span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            className="profile-section glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="profile-section__title"><Star size={16} /> Badges</h2>
            <div className="badges-grid">
              {[...unlockedBadges, ...lockedBadges].map((badge, i) => {
                const earned = badge.unlocked(profileData)
                return (
                  <motion.div
                    key={badge.id}
                    className={`badge-card ${earned ? 'badge-card--earned' : 'badge-card--locked'}`}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    style={earned ? { '--badge-color': badge.color } : {}}
                    title={badge.desc}
                  >
                    <div className="badge-card__icon">
                      {earned ? badge.icon : <Lock size={18} />}
                    </div>
                    <div className="badge-card__title">{badge.title}</div>
                    <div className="badge-card__desc">{badge.desc}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Rewards Summary */}
        <motion.div
          className="profile-section glass-card profile-rewards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <h2 className="profile-section__title"><Code size={16} /> Earned Rewards</h2>
          <div className="rewards-list">
            {missions.filter(m => completedMissions.includes(m.id)).length === 0 ? (
              <p className="rewards-empty">No rewards yet — complete missions to earn scrap and cores!</p>
            ) : (
              missions.filter(m => completedMissions.includes(m.id)).map(m => (
                <div key={m.id} className="reward-row">
                  <span className="reward-row__icon">{m.icon}</span>
                  <span className="reward-row__title">{m.title}</span>
                  <div className="reward-row__items">
                    <span className="reward-chip reward-chip--scrap"><Gem size={12} /> {m.reward.scrap} Scrap</span>
                    {m.reward.cores > 0 && (
                      <span className="reward-chip reward-chip--core"><Trophy size={12} /> {m.reward.cores} Core</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
