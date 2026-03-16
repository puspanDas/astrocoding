import { motion } from 'framer-motion'
import './FeatureCard.css'

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      className="feature-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>
    </motion.div>
  )
}
