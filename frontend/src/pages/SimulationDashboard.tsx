/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Activity, Clock, CheckCircle, Layers, Shield, ChevronRight, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '../stores'
import { useSocket } from '../hooks'
import '../styles/aesthetic.css'

export default function SimulationDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages, agents, status, progress, reset } = useSimulationStore()
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  useSocket(id)

  useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => navigate(`/results/${id}`), 3000)
      return () => clearTimeout(timer)
    }
  }, [status, id, navigate])

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  
  useEffect(() => {
    if (messages.length > 0) {
      setSelectedMessageId(messages[messages.length - 1].id)
    }
  
  }, [messages.length])

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      customer: 'agent-gradient-blue text-white',
      competitor: 'agent-gradient-red text-white',
      investor: 'agent-gradient-green text-white',
      operations: 'agent-gradient-stone text-white'
    }
    return colors[role] || 'bg-stone-900 text-white'
  }

  const selectedMessage = messages.find(m => m.id === selectedMessageId)

  return (
    <div className="min-h-screen mesh-background text-stone-100 selection:bg-stone-500/30">
      <header className="border-b border-white/10 glass-morphism sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
              <Layers className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">hidev simulation</span>
              <span className="text-xs text-stone-400 font-medium">Session ID: {id?.slice(0, 8)}...</span>
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm font-semibold capitalize text-white">{status}</span>
              </div>
              <div className="w-48 bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-white h-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <section className="glass-morphism rounded-3xl overflow-hidden premium-shadow">
              <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Users className="w-5 h-5 text-stone-300" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Live Intelligence Feed</h2>
                </div>
                <div className="text-xs text-stone-400 font-medium uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  Real-time
                </div>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-stone-400 gap-4"
                    >
                      <div className="w-12 h-12 border-2 border-stone-700 border-t-white rounded-full animate-spin" />
                      <p className="font-medium animate-pulse">Initializing Neural Agents...</p>
                    </motion.div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        key={msg.id}
                        onClick={() => setSelectedMessageId(msg.id)}
                        className={`flex gap-5 p-6 rounded-2xl border transition-all cursor-pointer group ${selectedMessageId === msg.id
                            ? 'bg-white/10 border-white/20 shadow-xl'
                            : 'bg-white/3 border-white/5 hover:bg-white/5'
                          }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl ${getRoleColor(msg.role || 'unknown')} flex items-center justify-center shrink-0 font-bold text-xl shadow-lg group-hover:scale-105 transition-transform`}>
                          {msg.role?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white text-lg capitalize">{msg.role} Agent</span>
                              <div className="h-1 w-1 bg-stone-500 rounded-full" />
                              <span className="text-stone-400 text-xs font-medium flex items-center gap-1.5 uppercase tracking-tighter">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-stone-500 transition-transform ${selectedMessageId === msg.id ? 'rotate-90 text-white' : ''}`} />
                          </div>
                          <p className="text-stone-300 leading-relaxed text-base wrap-break-word">
                            {msg.content}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="glass-morphism rounded-3xl premium-shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-stone-300" />
                <h3 className="font-bold text-white">Active Intelligence</h3>
              </div>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className={`w-8 h-8 rounded-lg ${getRoleColor(agent.role)} flex items-center justify-center shrink-0 text-xs font-bold`}>
                      {agent.role[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-white capitalize block">{agent.role}</span>
                      <p className="text-[10px] text-stone-500 truncate">{agent.persona}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMessageId || 'empty'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-morphism rounded-3xl premium-shadow p-8 min-h-[400px]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Info className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white">RAG Evidence</h3>
                </div>

                {selectedMessage && selectedMessage.evidence ? (
                  <div className="space-y-6">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">Sources retrieved for this response:</p>
                    <div className="space-y-4 bg-stone-900/30 p-4 rounded-2xl border border-white/5">
                      {selectedMessage.evidence.split('\n\n').map((chunk, i) => (
                        <div key={i} className="text-sm text-stone-400 leading-relaxed italic border-l-2 border-blue-500/30 pl-4 py-1">
                          "{chunk.replace(/^\[Context \d+\]: /, '')}"
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase tracking-tighter">
                        <span>Reliability Score</span>
                        <span className="text-blue-400">92%</span>
                      </div>
                      <div className="mt-2 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[92%]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <Layers className="w-10 h-10 text-stone-700" />
                    <p className="text-stone-500 text-sm">Select an agent message to view retrieved market intelligence.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-morphism px-8 py-4 rounded-2xl border border-green-500/30 flex items-center gap-4 z-50 bg-green-500/10"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg">Simulation Matrix Stabilized</div>
            <div className="text-green-400 text-xs font-medium uppercase tracking-widest">Finalizing insights engine...</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
