import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Activity, Clock, CheckCircle, Layers } from 'lucide-react'
import { useSimulationStore } from '../stores'
import { useSocket } from '../hooks'

export default function SimulationDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages, agents, status, progress, reset } = useSimulationStore()

  useSocket(id)

  useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => navigate(`/results/${id}`), 2000)
      return () => clearTimeout(timer)
    }
  }, [status, id, navigate])

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      customer: 'bg-blue-100 text-blue-700',
      competitor: 'bg-red-100 text-red-700',
      investor: 'bg-green-100 text-green-700',
      operations: 'bg-stone-100 text-stone-700'
    }
    return colors[role] || 'bg-stone-100 text-stone-700'
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-stone-900 tracking-tight">hidev</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-stone-600 font-medium capitalize">{status}</span>
            </div>
            <div className="w-40 bg-stone-200 rounded-full h-2">
              <div
                className="bg-stone-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-stone-600" />
                  <h2 className="text-lg font-semibold text-stone-900">Agent Activity</h2>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-stone-400 py-12">
                    Initializing simulation...
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                      <div className={`w-10 h-10 rounded-lg ${getRoleColor(msg.role || 'unknown')} flex items-center justify-center shrink-0 font-semibold`}>
                        {msg.role?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-stone-900 capitalize">{msg.role}</span>
                          <span className="text-stone-400 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-stone-700 leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-stone-600" />
                  <h2 className="text-lg font-semibold text-stone-900">Active Agents</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {agents.length === 0 ? (
                  <div className="text-center text-stone-400 py-4">
                    Loading agents...
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div key={agent.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${getRoleColor(agent.role)} flex items-center justify-center shrink-0 font-semibold text-sm`}>
                        {agent.role[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-stone-900 capitalize block">{agent.role}</span>
                        <p className="text-stone-500 text-sm leading-relaxed">{agent.persona}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <div className="font-semibold text-green-800">Simulation Complete</div>
                  <div className="text-green-600 text-sm">Redirecting to results...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
