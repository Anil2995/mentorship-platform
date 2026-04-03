import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { Zap, Code2, Video, MessageSquare } from 'lucide-react'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const resolvedParams = await searchParams
  const errorMessage = resolvedParams?.message

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">

      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-950 via-[#0a0a0f] to-indigo-950 items-center justify-center p-12">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/30">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            Join{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              MentorSpace
            </span>
            {' '}today.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
            Whether you're a seasoned professional wanting to give back, or a learner ready to grow — there's a seat for you here.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Code2, label: 'Real-time collaborative Monaco editor' },
              { icon: Video, label: 'P2P WebRTC video calling — no middleman' },
              { icon: MessageSquare, label: 'Persistent chat saved to your history' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  {item.label}
                </div>
              )
            })}
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
            <h2 className="text-3xl font-black tracking-tight text-white">Create account</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Already have one?{' '}
              <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <form action={signup} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Anil Kumar"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

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
                placeholder="Min. 6 characters"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Role selector as visual cards */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                I am joining as a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input type="radio" name="role" value="STUDENT" defaultChecked className="peer sr-only" />
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 hover:bg-white/8">
                    <div className="text-2xl mb-1">🎓</div>
                    <div className="text-sm font-bold text-white">Student</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">I want to learn</div>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input type="radio" name="role" value="MENTOR" className="peer sr-only" />
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500/10 hover:bg-white/8">
                    <div className="text-2xl mb-1">👨‍💻</div>
                    <div className="text-sm font-bold text-white">Mentor</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">I want to teach</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Create Free Account
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
