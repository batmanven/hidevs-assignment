import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IdeaInput from './pages/IdeaInput'
import SimulationDashboard from './pages/SimulationDashboard'
import ResultsPanel from './pages/ResultsPanel'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<IdeaInput />} />
        <Route path="/simulation/:id" element={<SimulationDashboard />} />
        <Route path="/results/:id" element={<ResultsPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
