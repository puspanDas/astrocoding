import { motion } from 'framer-motion'
import './FactionCard.css'

export default function FactionCard({ name, icon, color, description, features, delay = 0 }) {
  return (
    <motion.div
      className={`faction-card glass-card faction-card--${color}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="faction-card__badge">{icon}</div>
      <h3 className="faction-card__name">{name}</h3>
      <p className="faction-card__desc">{description}</p>
      <ul className="faction-card__features">
        {features.map((f, i) => (
          <li key={i} className="faction-card__feature">
            <span className="faction-card__dot" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
