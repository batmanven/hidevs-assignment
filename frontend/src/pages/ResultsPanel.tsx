import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, Lightbulb, ArrowLeft, RefreshCw, Layers, CheckCircle2, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

  const COLORS = ['#1c1917', '#78716c', '#a8a29e', '#d6d3d1', '#e7e5e4']

  const getSeverityStyle = (severity: string) => {
    const styles: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    }
    return styles[severity] || 'bg-stone-100 text-stone-700 border-stone-200'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-stone-400 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results || error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-stone-600">{error || 'Failed to load results'}</p>
        </div>
      </div>
    )
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
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">Simulation Results</h1>
          <p className="text-stone-500">Analysis complete • ID: {id}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Success Probability</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-stone-900">{results.successProbability}</span>
              <span className="text-2xl text-stone-500">%</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Risks Identified</span>
            </div>
            <div className="text-4xl font-semibold text-stone-900">{results.risks.length}</div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Suggestions</span>
            </div>
            <div className="text-4xl font-semibold text-stone-900">{results.suggestions.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Risk Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.risks}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {results.risks.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '8px' }}
                    itemStyle={{ color: '#1c1917' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Failure Scenarios</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.failureScenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="scenario" stroke="#a8a29e" fontSize={12} />
                  <YAxis stroke="#a8a29e" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '8px' }}
                    itemStyle={{ color: '#1c1917' }}
                  />
                  <Bar dataKey="probability" fill="#1c1917" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-900">Risk Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {results.risks.map((risk, index) => (
                <div key={index} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-stone-900">{risk.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getSeverityStyle(risk.severity)}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-900">Recommendations</h2>
            </div>
            <div className="p-6 space-y-4">
              {results.suggestions.map((suggestion, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center shrink-0 text-sm font-semibold text-stone-700">
                    {index + 1}
                  </div>
                  <p className="text-stone-700 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-900">Timeline Projection</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {results.timeline.map((phase, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-stone-900" />
                    {index < results.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-stone-200 mt-2 min-h-[40px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-stone-900">{phase.phase}</h3>
                      <span className="text-stone-400 text-sm">{phase.duration}</span>
                    </div>
                    <ul className="space-y-1">
                      {phase.keyMilestones.map((milestone, mIndex) => (
                        <li key={mIndex} className="flex items-start gap-2 text-stone-600 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
