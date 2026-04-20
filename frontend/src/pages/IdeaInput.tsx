import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Layers, Brain, Zap, Loader2 } from 'lucide-react'
import { useSimulationStore } from '../stores'
import { isNotEmpty, minLength } from '../utils/validators'

export default function IdeaInput() {
  const [idea, setIdea] = useState('')
  const navigate = useNavigate()
  const { createSimulation, isLoading, error } = useSimulationStore()

  const handleSubmit = async () => {
    if (!isNotEmpty(idea) || !minLength(idea, 10)) return

    try {
      const id = await createSimulation(idea)
      navigate(`/simulation/${id}`)
    } catch {
      // Error handled in store
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-stone-900 tracking-tight">hidev</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-stone-900 mb-3 tracking-tight">
            Test your idea before you build
          </h1>
          <p className="text-lg text-stone-500">
            Run multi-agent simulations to validate concepts and uncover risks early
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl shadow-sm">
          <div className="p-6">
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Describe your idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="A subscription service that delivers fresh ingredients to remote workers..."
              className="w-full h-40 border border-stone-300 rounded-lg p-4 text-stone-900 placeholder-stone-400 resize-none focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-stone-400">
                {idea.length > 0 ? `${idea.length} characters` : 'Be specific for better results'}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!idea.trim() || isLoading}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    Run Simulation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center mb-3">
              <Brain className="w-5 h-5 text-stone-700" />
            </div>
            <div className="text-2xl font-semibold text-stone-900 mb-1">4+</div>
            <div className="text-sm text-stone-500">Specialized agents</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center mb-3">
              <Layers className="w-5 h-5 text-stone-700" />
            </div>
            <div className="text-2xl font-semibold text-stone-900 mb-1">RAG</div>
            <div className="text-sm text-stone-500">Knowledge powered</div>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-stone-700" />
            </div>
            <div className="text-2xl font-semibold text-stone-900 mb-1">Real-time</div>
            <div className="text-sm text-stone-500">Live simulation</div>
          </div>
        </div>
      </main>
    </div>
  )
}
