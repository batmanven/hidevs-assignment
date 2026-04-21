/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, Lightbulb, ArrowLeft, RefreshCw, Layers, CheckCircle2, XCircle, Brain, Gauge, ChevronRight, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useSimulationStore } from '../stores'

export default function ResultsPanel() { 
  const { id } = useParams()
  const navigate = useNavigate()
  const { results, fetchResults, isLoading, error } = useSimulationStore()

  useEffect(() => {
    if (id) {
      fetchResults(id).catch(() => { })
    }
  }, [id, fetchResults])

  const COLORS = ['#00ffff', '#0007cd', '#0089ff', '#444444', '#ffffff']

  const getSeverityStyle = (severity: string) => {
    const styles: Record<string, string> = {
      high: 'text-red-400 border-red-500/20 bg-red-500/10',
      medium: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      low: 'text-green-400 border-green-500/20 bg-green-500/10'
    }
    return styles[severity] || 'text-muted-smoke border-white/5 bg-white/5'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-16 h-16 border border-white/5 border-t-cyan rounded-full animate-spin mx-auto" />
            <Brain className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-muted-smoke font-mono text-[10px] uppercase tracking-[0.3em]">Synthesizing Neural Resultant Matrix...</p>
        </div>
      </div>
    )
  }

  if (!results || error) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="bg-pure-black border border-white/10 p-10 rounded-lg brutalist-shadow text-center max-w-md">
          <XCircle className="w-10 h-10 text-red-500 mx-auto mb-6" />
          <p className="text-white font-mono text-xs uppercase tracking-widest mb-4">{error || 'SIMULATION_NOT_FOUND'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-muted-smoke hover:text-white transition-peak font-mono text-[10px] uppercase tracking-[0.2em] underline"
          >
            Re-link to Command Center
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void-black text-white selection:bg-cyan/30 font-sans relative overflow-x-hidden">
      {/* Bioluminescent Glows */}
      <div className="fixed top-[-15%] right-[-10%] w-[50%] h-[50%] glow-blue pointer-events-none opacity-40" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] glow-cyan pointer-events-none opacity-20" />

      <header className="border-b border-white/5 bg-void-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center brutalist-shadow">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block tight-heading uppercase">RealityForge</span>
              <span className="text-[10px] font-mono text-muted-smoke tracking-wider uppercase">Intelligence Report: {id?.slice(0, 8)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-peak text-[10px] font-mono uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded border border-white/10 hover:border-white/20 brutalist-shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Initiate New Link
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5"
        >
          <div>
            <div className="flex items-center gap-3 text-cyan mb-4 uppercase tracking-[0.3em] text-[10px] font-mono">
              <Activity className="w-3 h-3" />
              Consensus Achieved
            </div>
            <h1 className="text-7xl font-bold text-white tight-heading uppercase tracking-tighter">Results Matrix <span className="text-cyan text-stroke-thin">Verified.</span></h1>
            <p className="text-muted-smoke mt-4 font-mono text-[10px] uppercase tracking-[0.2em]">Validated by Neural Protocols • End-to-End Encryption Enabled</p>
          </div>

          <div className="flex gap-6">
            <div className="bg-pure-black px-8 py-5 rounded border border-white/5 brutalist-shadow flex items-center gap-4">
              <Gauge className="w-5 h-5 text-cyan" />
              <div className="text-left">
                <span className="block text-[9px] text-muted-smoke font-bold uppercase tracking-[0.2em] mb-1">Market Sentiment</span>
                <span className="text-2xl font-bold text-white font-mono">{results.marketSentiment}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Success Probability', value: `${results.successProbability}%`, icon: TrendingUp, color: 'text-cyan' },
            { label: 'Neural Friction Points', value: results.risks.length, icon: AlertTriangle, color: 'text-red-500' },
            { label: 'Strategic Re-Routes', value: results.suggestions.length, icon: Lightbulb, color: 'text-cobalt' }
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-pure-black rounded border border-white/5 p-10 brutalist-shadow relative overflow-hidden group hover:border-white/20 transition-peak"
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`p-3 rounded bg-white/5 border border-white/10 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-smoke group-hover:text-white transition-peak" />
              </div>
              <div className="text-5xl font-bold text-white mb-3 tracking-tighter font-mono">{stat.value}</div>
              <div className="text-[10px] font-bold text-muted-smoke uppercase tracking-[0.2em] tight-heading">{stat.label}</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-peak group-hover:bg-cyan/5" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-8 flex flex-col gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-pure-black rounded border border-cyan/20 p-10 brutalist-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 glow-cyan/10 pointer-events-none" />
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-cyan/10 rounded border border-cyan/20">
                      <Brain className="w-4 h-4 text-cyan" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] tight-heading text-white">Critical Friction Synthesis</h2>
                  </div>
                  <p className="font-mono text-[14px] text-white/90 leading-relaxed italic border-l-2 border-cyan/30 pl-8 py-2">
                    "{results.criticalFriction}"
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-pure-black rounded border border-white/5 p-10 brutalist-shadow">
                    <h2 className="text-[10px] font-bold text-muted-smoke uppercase tracking-[0.2em] mb-10">Risk Vector distribution</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={results.risks.reduce((acc: any[], risk) => {
                              const severity = risk.severity || 'low'
                              const existing = acc.find(item => item.name === severity)
                              if (existing) {
                                existing.value += 1
                              } else {
                                acc.push({ name: severity, value: 1 })
                              }
                              return acc
                            }, [])}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            nameKey="name"
                            stroke="none"
                          >
                            {results.risks.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-pure-black rounded border border-white/5 p-10 brutalist-shadow">
                    <h2 className="text-[10px] font-bold text-muted-smoke uppercase tracking-[0.2em] mb-10">Protocol Failure Probability</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.failureScenarios}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="scenario" hide />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="JetBrains Mono" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                          />
                          <Bar dataKey="probability" fill="#00ffff" radius={[2, 2, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
            </div>

          <div className="lg:col-span-4 h-full">
            <div className="bg-pure-black rounded border border-white/5 brutalist-shadow h-full flex flex-col">
              <div className="px-10 py-6 border-b border-white/5 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white/40" />
                <h2 className="text-[10px] font-bold text-muted-smoke uppercase tracking-[0.3em] tight-heading">Strategic Pivots</h2>
              </div>
              <div className="p-10 space-y-10 flex-1">
                {results.suggestions.map((suggestion, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex gap-6 group"
                  >
                    <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-mono font-bold text-cyan group-hover:bg-cyan group-hover:text-black transition-peak">
                      0{index + 1}
                    </div>
                    <p className="text-[13px] font-mono text-white/70 leading-relaxed group-hover:text-white transition-peak tracking-tighter">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-24">
          <h2 className="text-xs font-bold text-muted-smoke mb-10 uppercase tracking-[0.3em] tight-heading px-2">Neural Vulnerability Deep-Dive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.risks.map((risk, index) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={index}
                className="bg-pure-black rounded border border-white/5 p-8 brutalist-shadow group hover:border-white/20 transition-peak"
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="text-[10px] font-bold text-muted-smoke uppercase tracking-[0.3em]">{risk.category}</span>
                  <span className={`text-[9px] px-3 py-1 rounded-sm border font-bold uppercase tracking-widest ${getSeverityStyle(risk.severity)}`}>
                    {risk.severity} risk
                  </span>
                </div>
                <p className="text-white/80 font-mono text-[12px] leading-relaxed tracking-tight">{risk.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <div className="bg-pure-black rounded border border-white/5 brutalist-shadow overflow-hidden">
            <div className="px-12 py-8 border-b border-white/5 bg-white/1 flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-[0.3em] tight-heading">Deployment Roadmap Projection</h2>
              <div className="flex items-center gap-3 text-muted-smoke font-mono text-[9px] uppercase tracking-[0.2em]">
                <RefreshCw className="w-3 h-3 animate-spin duration-10000" />
                Protocol Synchronized
              </div>
            </div>
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative">
                {results.timeline.map((phase, index) => (
                  <div key={index} className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                      <div className="w-14 h-14 rounded bg-white flex items-center justify-center brutalist-shadow">
                        <span className="font-bold text-black text-xl font-mono">0{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xs uppercase tracking-widest leading-tight block mb-2">{phase.phase}</h3>
                        <span className="text-cyan font-mono text-[10px] uppercase tracking-widest">{phase.duration}</span>
                      </div>
                    </div>
                    <ul className="space-y-6">
                      {phase.keyMilestones.map((milestone, mIndex) => (
                        <li key={mIndex} className="flex items-start gap-4 group">
                          <div className="w-1.5 h-1.5 bg-cyan rounded-full mt-2 shrink-0 group-hover:shadow-[0_0_8px_#00ffff] transition-peak" />
                          <span className="text-white/60 font-mono text-[11px] leading-relaxed group-hover:text-white transition-peak tracking-tighter">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-gradient py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 glow-blue/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-peak grayscale hover:grayscale-0">
            <Layers className="w-5 h-5 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">RealityForge Neural Stack v7.2.1</span>
          </div>
          <div className="text-[10px] font-mono text-muted-smoke uppercase tracking-[0.2em]">
            SYSTEM_STABLE: 99.9% Consensus achieved
          </div>
        </div>
      </footer>
    </div>
  )
}
