import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GameDemo from './pages/GameDemo'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<GameDemo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
