/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Activity, Clock, CheckCircle, Layers, Shield, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulationStore } from '../stores'
import { useSocket } from '../hooks'
import '../styles/aesthetic.css'

export default function SimulationDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages, agents, status, progress, reset, startSimulation } = useSimulationStore()
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  useSocket(id)

  useEffect(() => {
    if (id && messages.length === 0 && status !== 'completed') {
      startSimulation(id)
    }
  }, [id, startSimulation, messages.length, status])

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
    const defaultStyles = "border border-mist-10 shadow-sm"
    const colors: Record<string, string> = {
      customer: `bg-[#0007cd]/20 border-cobalt/30 text-cyan`,
      competitor: `bg-red-500/20 border-red-500/30 text-red-400`,
      investor: `bg-green-500/20 border-green-500/30 text-green-400`,
      operations: `bg-stone-500/20 border-stone-500/30 text-stone-400`
    }
    return `${colors[role] || 'bg-white/5 text-white'} ${defaultStyles}`
  }

  const selectedMessage = messages.find(m => m.id === selectedMessageId)

  return (
    <div className="min-h-screen bg-void-black text-white selection:bg-cyan/30 font-sans overflow-x-hidden relative">
      {/* Bioluminescent Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] glow-blue pointer-events-none opacity-50" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-cyan pointer-events-none opacity-30" />

      <header className="border-b border-white/5 bg-void-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center brutalist-shadow">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block tight-heading uppercase">RealityForge</span>
              <span className="text-[10px] font-mono text-muted-smoke tracking-wider uppercase">Neural Link Established: {id?.slice(0, 8)}</span>
            </div>
          </motion.div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan animate-pulse" />
                <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-cyan/80">{status}</span>
              </div>
              <div className="w-48 bg-white/5 rounded-full h-1 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-cyan h-full shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <section className="bg-pure-black border border-white/10 rounded-lg overflow-hidden brutalist-shadow">
              <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/5 rounded">
                    <Users className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] tight-heading">Live Intelligence Feed</h2>
                </div>
                <div className="text-[10px] font-mono text-cyan uppercase tracking-[0.3em] bg-cyan/10 px-3 py-1 rounded border border-cyan/20">
                  Secure Stream
                </div>
              </div>

              <div className="p-8 space-y-6 max-h-[72vh] overflow-y-auto scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-24 text-muted-smoke gap-6"
                    >
                      <div className="w-8 h-8 border border-white/10 border-t-cyan rounded-full animate-spin" />
                      <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Initializing simulation matrix...</p>
                    </motion.div>
                  ) : (
                    messages
                      .filter(m => m.role && m.timestamp && m.content) // Defensive filtering
                      .map((msg) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={msg.id}
                          onClick={() => setSelectedMessageId(msg.id)}
                          className={`flex gap-6 p-6 rounded transition-peak cursor-pointer border ${selectedMessageId === msg.id
                              ? 'bg-white/5 border-cyan/30 brutalist-shadow'
                              : 'bg-transparent border-white/5 hover:border-white/20'
                            }`}
                        >
                          <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 font-mono text-sm font-bold ${getRoleColor(msg.role || 'unknown')}`}>
                            {msg.role ? msg.role[0].toUpperCase() : 'P'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-white text-xs uppercase tracking-widest">{msg.role} Protocol</span>
                                <div className="h-1 w-1 bg-muted-smoke rounded-full" />
                                <span className="text-muted-smoke font-mono text-[10px] flex items-center gap-1.5 uppercase tracking-widest">
                                  <Clock className="w-3 h-3" />
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}
                                </span>
                              </div>
                              {selectedMessageId === msg.id && (
                                <div className="w-2 h-2 bg-cyan rounded-full shadow-[0_0_8px_#00ffff]" />
                              )}
                            </div>
                            <p className="font-mono text-[13px] text-white/80 leading-relaxed tracking-tight whitespace-pre-wrap wrap-break-word">
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

          <div className="col-span-4 space-y-8">
            <div className="bg-pure-black border border-white/10 rounded-lg p-8 brutalist-shadow">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-4 h-4 text-white/50" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] tight-heading">Active Protocols</h3>
              </div>
              <div className="space-y-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-[10px] font-bold ${getRoleColor(agent.role || 'unknown')}`}>
                      {agent.role ? agent.role[0].toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white uppercase tracking-widest block mb-1">{agent.role}</span>
                      <p className="text-[11px] text-muted-smoke line-clamp-2 leading-relaxed">{agent.persona}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMessageId || 'empty'}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-pure-black border border-white/10 rounded-lg p-8 min-h-[380px] relative overflow-hidden"
              >
                {/* Internal Glow for RAG box */}
                <div className="absolute top-0 right-0 w-32 h-32 glow-cyan/10 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-signal/10 rounded border border-signal/20">
                    <Info className="w-4 h-4 text-signal" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] tight-heading">Neural Evidence</h3>
                </div>

                {selectedMessage && selectedMessage.evidence ? (
                  <div className="space-y-8">
                    <p className="text-[10px] font-mono text-muted-smoke uppercase tracking-widest">Grounding context retrieved:</p>
                    <div className="space-y-6 border-l border-signal/30 pl-6">
                      {selectedMessage.evidence.split('\n\n').slice(0, 3).map((chunk, i) => (
                        <div key={i} className="font-mono text-[11px] text-white/60 leading-relaxed italic">
                          "{chunk.replace(/^\[Context \d+\]: /, '')}"
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-3">
                        <span className="text-muted-smoke">Retained Confidence</span>
                        <span className="text-cyan">94%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-cyan h-full w-[94%] shadow-[0_0_5px_#00ffff]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 grayscale opacity-30">
                    <Layers className="w-10 h-10 text-white" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">Awaiting protocol selection</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-green-500 text-black px-10 py-5 rounded brutalist-shadow flex items-center gap-6 z-50"
        >
          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm uppercase tracking-[0.2em] tight-heading">Simulation Matrix Stabilized</div>
            <div className="text-black/70 font-mono text-[10px] uppercase tracking-widest">Generating ultimate synthesis...</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
