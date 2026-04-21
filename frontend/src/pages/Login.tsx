import { useState } from 'react'
import { Lock, Mail, Layers, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks'
import { isValidEmail, isValidPassword } from '../utils/validators'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const { login, register, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationError(null)

    if (!isValidEmail(email)) {
      setValidationError('INVALID_EMAIL_FORMAT')
      return
    }

    if (!isLogin) {
      const passwordCheck = isValidPassword(password)
      if (!passwordCheck.valid) {
        setValidationError(`INSECURE_PASSWORD: ${passwordCheck.errors.join(', ')}`)
        return
      }
    }

    if (isLogin) {
      await login(email, password)
    } else {
      await register(email, password)
    }
  }

  return (
    <div className="min-h-screen bg-void-black text-white flex items-center justify-center p-6 selection:bg-cyan/30 relative overflow-hidden">
      {/* Bioluminescent Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] glow-blue pointer-events-none opacity-40" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] glow-cyan pointer-events-none opacity-20" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center brutalist-shadow">
              <Layers className="w-7 h-7 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-[0.2em] tight-heading mb-3">
            {isLogin ? 'Access System' : 'Initialize Node'}
          </h1>
          <p className="text-muted-smoke font-mono text-[10px] uppercase tracking-[0.2em] font-medium">
            {isLogin ? 'Authenticate to realityforge link' : 'Register new neural operator'}
          </p>
        </div>

        <div className="bg-pure-black border border-white/10 rounded p-10 brutalist-shadow">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-muted-smoke mb-3">Identity Vector (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@realityforge.ai"
                  className="w-full bg-void-black/50 border border-white/5 rounded py-4 pl-12 pr-4 text-white font-mono text-xs placeholder-white/10 focus:outline-none focus:border-cyan/30 focus:ring-1 focus:ring-cyan/30 transition-peak"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-muted-smoke mb-3">Access Cipher (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-void-black/50 border border-white/5 rounded py-4 pl-12 pr-4 text-white font-mono text-xs placeholder-white/10 focus:outline-none focus:border-cyan/30 focus:ring-1 focus:ring-cyan/30 transition-peak"
                  required
                />
              </div>
            </div>

            {(error || validationError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
                <p className="font-mono text-[9px] uppercase tracking-widest text-red-500">{error || validationError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-cyan text-black py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs transition-peak flex items-center justify-center gap-3 disabled:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed brutalist-shadow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isLogin ? 'TRANSMITTING...' : 'INITIALIZING...'}
                </>
              ) : (
                <>{isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}</>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-smoke hover:text-white transition-peak underline underline-offset-4"
            >
              {isLogin ? "Request New Neural ID" : 'Return to AUTH_NODE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}