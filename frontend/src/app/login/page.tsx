import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  const errorMessage = searchParams?.message

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-[#0a0a0f] to-purple-950 items-center justify-center p-12">
        
        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-sm text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Welcome back to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              MentorSpace
            </span>
          </h1>
          <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
            Your collaborative workspace is waiting. Code, call, and connect with your mentor or student instantly.
          </p>
          
          {/* Key Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { val: '18k+', label: 'Sessions Completed' },
              { val: '98.5%', label: 'Satisfaction Rate' },
              { val: '2,400+', label: 'Active Mentors' },
              { val: '42', label: 'Countries' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 border border-white/5 p-4">
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">MentorSpace</span>
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Sign in</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition">
                Create one free
              </Link>
            </p>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
