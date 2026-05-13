import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Sandbox from './pages/Sandbox'
import SystemDesign from './pages/SystemDesign'
import CircuitLab from './pages/CircuitLab'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/circuit-lab" element={<CircuitLab />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
