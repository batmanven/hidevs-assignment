import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IdeaInput from './pages/IdeaInput'
import SimulationDashboard from './pages/SimulationDashboard'
import ResultsPanel from './pages/ResultsPanel'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <IdeaInput />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/simulation/:id" 
          element={
            <ProtectedRoute>
              <SimulationDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results/:id" 
          element={
            <ProtectedRoute>
              <ResultsPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
