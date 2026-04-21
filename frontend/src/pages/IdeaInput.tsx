import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Layers, Brain, Zap, Loader2 } from 'lucide-react'
import { useSimulationStore } from '../stores'
import { isNotEmpty, minLength } from '../utils/validators'
import { motion } from 'framer-motion'
import NeuralLoadingModal from '../components/NeuralLoadingModal'

export default function IdeaInput() {
  const [idea, setIdea] = useState('A premium sushi delivery service for corporate office parks with a guaranteed 15-minute table-to-desk delivery time.')
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const navigate = useNavigate()
  const { createSimulation, isLoading, error } = useSimulationStore()

  const handleStartSimulation = async () => {
    try {
      const id = await createSimulation(idea)
      navigate(`/simulation/${id}`)
    } catch {
      setShowLoadingModal(false)
    }
  }

  const handleSubmit = async () => {
    if (!isNotEmpty(idea) || !minLength(idea, 10)) return
    setShowLoadingModal(true)
  }

  return (
    <div className="min-h-screen bg-void-black text-white selection:bg-cyan/30 font-sans overflow-hidden relative">
      {/* Bioluminescent Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] glow-blue pointer-events-none opacity-40" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] glow-cyan pointer-events-none opacity-20" />

      <header className="border-b border-white/5 bg-void-black/50 backdrop-blur-md relative z-20">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center brutalist-shadow">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold uppercase tracking-[0.2em] tight-heading">RealityForge</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-7xl font-bold text-white mb-6 tight-heading uppercase max-w-2xl">
            Test your idea <span className="text-cyan text-stroke-thin">before</span> you build
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed">
            Execute high-fidelity multi-agent simulations to validate system architecture,
            market friction, and operational risks in real-time.
          </p>
        </motion.div>

        <div className="bg-pure-black border border-white/10 rounded-lg brutalist-shadow overflow-hidden group focus-within:border-cyan/30 transition-peak">
          <div className="p-10">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-muted-smoke group-focus-within:text-cyan transition-colors">
                Simulation Input Vector
              </label>
              <div className="w-2 h-2 rounded-full bg-white/10 group-focus-within:bg-cyan shadow-sm transition-colors" />
            </div>
            
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Define your hypothesis (e.g. A decentralized logistics network for autonomous last-mile delivery...)"
              className="w-full h-48 bg-transparent text-white font-mono text-sm placeholder-white/20 resize-none focus:outline-none leading-relaxed"
            />
            
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-smoke">
                {idea.length > 0 ? (
                  <span className="text-cyan">{idea.length} points of interest detected</span>
                ) : (
                  'Awaiting high-resolution definition'
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!idea.trim() || isLoading}
                className="flex items-center gap-4 bg-white hover:bg-cyan text-black px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-xs transition-peak disabled:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed group/btn cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Initializing Matrix
                  </>
                ) : (
                  <>
                    Run Simulation
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-red-500 bg-red-500/10 p-3 border border-red-500/20 rounded">
                CRITICAL_FAILURE: {error}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          {[
            { icon: Brain, value: '4+', label: 'Neural Protocols', detail: 'Cross-functional debate' },
            { icon: Layers, value: 'RAG', label: 'Semantic Data', detail: 'Context-aware grounding' },
            { icon: Zap, value: 'Live', label: 'Real-time Link', detail: 'Instant risk synthesis' }
          ].map((stat, i) => (
            <div key={i} className="bg-pure-black border border-white/5 p-8 rounded-lg hover:border-white/20 transition-peak">
              <stat.icon className="w-4 h-4 text-white/30 mb-6" />
              <div className="font-mono text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">{stat.label}</div>
              <div className="text-[10px] font-mono text-muted-smoke uppercase tracking-tight">{stat.detail}</div>
            </div>
          ))}
        </div>
      </main>

      <NeuralLoadingModal 
        isOpen={showLoadingModal} 
        onComplete={handleStartSimulation} 
      />
    </div>
  )
}
