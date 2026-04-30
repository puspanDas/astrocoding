import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GameDemo from './pages/GameDemo'
import Sandbox from './pages/Sandbox'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import SystemDesign from './pages/SystemDesign'
import QAFeatureLab from './pages/QAFeatureLab'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<GameDemo />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/qa-lab" element={<QAFeatureLab />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
