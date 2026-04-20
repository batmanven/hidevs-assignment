/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, Lightbulb, ArrowLeft, RefreshCw, Layers, CheckCircle2, XCircle, Brain, Gauge, ChevronRight, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useSimulationStore } from '../stores'
import '../styles/aesthetic.css'

export default function ResultsPanel() { 
  const { id } = useParams()
  const navigate = useNavigate()
  const { results, fetchResults, isLoading, error } = useSimulationStore()

  useEffect(() => {
    if (id) {
      fetchResults(id).catch(() => { })
    }
  }, [id, fetchResults])

  const COLORS = ['#60a5fa', '#f87171', '#4ade80', '#fbbf24', '#a78bfa']

  const getSeverityStyle = (severity: string) => {
    const styles: Record<string, string> = {
      high: 'text-red-400 border-red-500/20 bg-red-500/5',
      medium: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      low: 'text-green-400 border-green-500/20 bg-green-500/5'
    }
    return styles[severity] || 'text-stone-400 border-stone-500/20 bg-stone-500/5'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-stone-800 border-t-white rounded-full animate-spin mx-auto" />
            <Brain className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">Synthesizing Simulation Matrix...</p>
        </div>
      </div>
    )
  }

  if (!results || error) {
    return (
      <div className="min-h-screen mesh-background flex items-center justify-center">
        <div className="glass-morphism p-8 rounded-3xl text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">{error || 'Simulation results unavailable'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-stone-400 hover:text-white transition-colors text-sm"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mesh-background text-stone-100 selection:bg-stone-500/30">
      <header className="border-b border-white/10 glass-morphism sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
              <Layers className="w-6 h-6 text-stone-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white block">RealityForge Insights</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-all text-sm font-medium bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            New Simulation
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-2 uppercase tracking-[0.2em] text-[10px] font-bold">
              <Activity className="w-3 h-3" />
              Final Intelligence Report
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Simulation Optimized.</h1>
            <p className="text-stone-500 mt-2 font-medium">Verified by multi-agent consensus • Session ID: {id?.slice(0, 8)}</p>
          </div>

          <div className="flex gap-4">
            <div className="glass-morphism px-6 py-3 rounded-2xl border-white/5 premium-shadow flex items-center gap-3">
              <Gauge className="w-4 h-4 text-green-400" />
              <div className="text-left">
                <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-widest">Market Sentiment</span>
                <span className="text-lg font-bold text-white">{results.marketSentiment}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Success Probability', value: `${results.successProbability}%`, icon: TrendingUp, color: 'text-blue-400' },
            { label: 'Identified Vulnerabilities', value: results.risks.length, icon: AlertTriangle, color: 'text-amber-400' },
            { label: 'Strategic Pivots', value: results.suggestions.length, icon: Lightbulb, color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="glass-morphism rounded-3xl p-8 premium-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-stone-700 group-hover:text-white transition-colors" />
              </div>
              <div className="text-4xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">{stat.label}</div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-morphism rounded-3xl p-8 premium-shadow border-blue-500/20 bg-blue-500/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Critical Friction Analysis</h2>
              </div>
              <p className="text-stone-300 leading-relaxed text-lg italic pr-8">
                "{results.criticalFriction}"
              </p>
            </motion.div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-morphism rounded-3xl p-8 premium-shadow">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-8">Risk Landscape</h2>
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
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {results.risks.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-morphism rounded-3xl p-8 premium-shadow">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-8">Simulation Breakdowns</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.failureScenarios}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="scenario" hide />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="probability" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass-morphism rounded-3xl premium-shadow h-full">
              <div className="px-8 py-6 border-b border-white/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-stone-300" />
                <h2 className="text-lg font-bold text-white">Strategic Pivots</h2>
              </div>
              <div className="p-8 space-y-6">
                {results.suggestions.map((suggestion, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex gap-4 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed group-hover:text-stone-200 transition-colors">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-8 tracking-tighter px-2">Intelligence Deep-Dive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.risks.map((risk, index) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={index}
                className="glass-morphism rounded-3xl p-6 border-white/5 premium-shadow hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-[0.2em]">{risk.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${getSeverityStyle(risk.severity)}`}>
                    {risk.severity} risk
                  </span>
                </div>
                <p className="text-stone-200 text-sm leading-relaxed font-medium">{risk.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="glass-morphism rounded-[2.5rem] premium-shadow overflow-hidden">
            <div className="px-10 py-8 border-b border-white/10 bg-white/2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Execution Timeline Projection</h2>
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-widest">
                <RefreshCw className="w-3.5 h-3.5" />
                Updated Real-time
              </div>
            </div>
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
                {results.timeline.map((phase, index) => (
                  <div key={index} className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-white/10">
                        <span className="font-black text-stone-900 text-xl">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{phase.phase}</h3>
                        <span className="text-blue-400 text-xs font-black uppercase tracking-tighter">{phase.duration}</span>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {phase.keyMilestones.map((milestone, mIndex) => (
                        <li key={mIndex} className="flex items-start gap-3 group">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-stone-400 text-sm leading-snug group-hover:text-stone-200 transition-colors font-medium">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="hidden lg:block absolute top-6 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white/5 to-transparent -z-10" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex items-center justify-between opacity-30">
        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-700">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-tighter">RealityForge Intelligence Framework v4.2.0</span>
        </div>
      </footer>
    </div>
  )
}
