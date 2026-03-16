import { useTheme } from '../context/ThemeContext'
import { Moon, Monitor, Sun } from 'lucide-react'
import './ThemeSwitcher.css'

const modes = [
  { key: 'dark', icon: Moon, label: 'Dark' },
  { key: 'system', icon: Monitor, label: 'System' },
  { key: 'light', icon: Sun, label: 'Light' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const activeIndex = modes.findIndex((m) => m.key === theme)

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Theme switcher">
      <div
        className="theme-switcher__indicator"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {modes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          className={`theme-switcher__btn ${theme === key ? 'theme-switcher__btn--active' : ''}`}
          onClick={() => setTheme(key)}
          role="radio"
          aria-checked={theme === key}
          aria-label={label}
          title={label}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  )
}
