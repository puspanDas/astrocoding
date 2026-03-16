import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GameDemo from './pages/GameDemo'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<GameDemo />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
