import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Cpu, Database, Network, ShieldCheck, Zap } from 'lucide-react'

interface NeuralLoadingModalProps {
  isOpen: boolean
  onComplete: () => void
}

const steps = [
  { icon: Database, label: 'Initializing Knowledge Base Grounding...', duration: 4000 },
  { icon: Network, label: 'Synchronizing Multi-Agent Neural Protocols...', duration: 5000 },
  { icon: Cpu, label: 'Spinning up Dedicated Competitor Persona...', duration: 4000 },
  { icon: Brain, label: 'Running Monte Carlo Market Simulation...', duration: 6000 },
  { icon: ShieldCheck, label: 'Stress-testing Model Feasibility...', duration: 5000 },
  { icon: Zap, label: 'Synthesizing Final High-Fidelity Output...', duration: 6000 },
]

export default function NeuralLoadingModal({ isOpen, onComplete }: NeuralLoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0)
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(newProgress)

      // Update current step based on elapsed time
      let accumulatedTime = 0
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration
        if (elapsed < accumulatedTime) {
          setCurrentStep(i)
          break
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval)
        setTimeout(onComplete, 500)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-pure-black/95 backdrop-blur-xl p-6"
      >
        <div className="max-w-xl w-full">
          {/* Pulsing Neural Core */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-cyan rounded-full blur-[60px] opacity-30"
              />
              <div className="relative w-32 h-32 bg-pure-black border-2 border-cyan/30 rounded-full flex items-center justify-center brutalist-shadow">
                <Brain className="w-16 h-16 text-cyan" />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {React.createElement(steps[currentStep].icon, {
                  className: "w-5 h-5 text-cyan animate-pulse"
                })}
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                  {steps[currentStep].label}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan">{Math.round(progress)}%</span>
            </div>

            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan shadow-[0_0_20px_rgba(0,255,249,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Neural Log */}
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-3 transition-opacity duration-500 ${i <= currentStep ? 'opacity-100' : 'opacity-20'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${i < currentStep ? 'bg-cyan' : i === currentStep ? 'bg-white animate-ping' : 'bg-white/20'}`} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 truncate">
                    {step.label.split('...')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20 animate-pulse">
              RealityForge Deep Intelligence Link Active
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
