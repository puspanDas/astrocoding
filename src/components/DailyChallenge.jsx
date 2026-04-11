import { motion } from 'framer-motion'
import { Rocket, Clock, Code, Award, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './DailyChallenge.css'

export default function DailyChallenge() {
  const navigate = useNavigate()

  // In a real app, this would be fetched from a backend and change daily.
  // For now, we mock a daily challenge.
  const challenge = {
    title: "The Fibonacci Nebula",
    description: "Your navigation computer is malfunctioning! Write a function to generate the first 10 numbers of the Fibonacci sequence to recalibrate the sensors.",
    rewardScrap: 150,
    rewardCores: 1,
    timeRemaining: "14h 22m", // Mock remaining time
    difficulty: "Medium",
    language: "Python" // Or "Any"
  }

  const handleLaunch = () => {
    // Navigate to sandbox with pre-filled code (simulate via state or query params in a real app)
    // For this demo, we just go to the sandbox.
    navigate('/sandbox')
  }

  return (
    <motion.div 
      className="daily-challenge glass-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="daily-challenge__sidebar">
        <div className="daily-challenge__icon-wrapper">
          <Rocket size={24} className="daily-challenge__icon" />
          <div className="daily-challenge__pulse"></div>
        </div>
        <div className="daily-challenge__badge">Daily Mission</div>
      </div>

      <div className="daily-challenge__content">
        <div className="daily-challenge__header">
          <h3 className="daily-challenge__title">{challenge.title}</h3>
          <div className="daily-challenge__timer">
            <Clock size={14} />
            <span>Resets in: <strong>{challenge.timeRemaining}</strong></span>
          </div>
        </div>

        <p className="daily-challenge__desc">{challenge.description}</p>

        <div className="daily-challenge__meta">
          <span className="daily-challenge__tag tag--diff">Difficulty: {challenge.difficulty}</span>
          <span className="daily-challenge__tag tag--lang"><Code size={12}/> {challenge.language}</span>
          <div className="daily-challenge__rewards">
            <Award size={14} />
            <span>Rewards: <strong>+{challenge.rewardScrap} Scrap, +{challenge.rewardCores} Core</strong></span>
          </div>
        </div>
      </div>

      <div className="daily-challenge__action">
        <button className="btn-primary daily-challenge__btn" onClick={handleLaunch}>
          <span>Launch Sandbox</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}
