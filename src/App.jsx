import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GameDemo from './pages/GameDemo'
import Sandbox from './pages/Sandbox'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<GameDemo />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
