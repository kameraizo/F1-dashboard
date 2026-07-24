import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StandingsPage from './pages/StandingsPage'
import SeasonPage from './pages/SeasonPage'
import CircuitsPage from './pages/CircuitsPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/classements" element={<StandingsPage />} />
        <Route path="/saison" element={<SeasonPage />} />
        <Route path="/circuits" element={<CircuitsPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
