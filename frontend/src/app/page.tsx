import Link from 'next/link'
import { Code2, Video, MessageSquare, Zap, Star, Shield, ArrowRight, Users, Clock, BookOpen, CheckCircle, ChevronRight } from 'lucide-react'

const stats = [
  { label: 'Active Mentors', value: '2,400+' },
  { label: 'Sessions Completed', value: '18,000+' },
  { label: 'Student Satisfaction', value: '98.5%' },
  { label: 'Countries Reached', value: '42' },
]

const features = [
  {
    icon: Code2,
    color: 'indigo',
    title: 'Real-Time Monaco Editor',
    description: 'Industry-grade VS Code-powered editor with live sync. Write JavaScript, Python, TypeScript, HTML and CSS side by side — with zero lag.',
  },
  {
    icon: Video,
    color: 'purple',
    title: 'P2P Video Calling',
    description: 'Direct WebRTC peer-to-peer video. No server relay. Ultra-low latency so your conversations feel natural and instant.',
  },
  {
    icon: MessageSquare,
    color: 'pink',
    title: 'Persistent Live Chat',
    description: 'Every message is stored securely in PostgreSQL. Pick up exactly where you left off — history is always available.',
  },
  {
    icon: Zap,
    color: 'amber',
    title: 'Instant Session Rooms',
    description: 'Mentors spin up a private room in seconds. Students join with a single ID — no long setup, no friction.',
  },
  {
    icon: Shield,
    color: 'emerald',
    title: 'Secure Auth & Roles',
    description: 'Supabase-powered authentication with distinct Mentor and Student roles. Your sessions are private and protected.',
  },
  {
    icon: BookOpen,
    color: 'sky',
    title: 'Session History',
    description: 'Full chronological history of past and active sessions for both mentors and students — always at your fingertips.',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Senior Engineer @ Google',
    avatar: 'PS',
    text: 'MentorSpace completely changed how I teach. The live code editor is better than anything I\'ve used in 6 years of 1-on-1 mentoring. My students get it faster than ever.',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Student → SDE @ Amazon',
    avatar: 'AM',
    text: 'I cracked my Amazon interview after 3 months of weekly sessions here. The video + code combo in one screen is unreal. No more switching between Zoom and Coderpad.',
    rating: 5,
  },
  {
    name: 'Layla Hassan',
    role: 'Full-Stack Mentor',
    avatar: 'LH',
    text: 'The session history is a game changer. I can review what we covered last week before each new session. Extremely polished product.',
    rating: 5,
  },
]

const plans = [
  {
    name: 'Student',
    price: 'Free',
    description: 'Perfect for learners who want to connect with a great mentor.',
    features: ['Join unlimited sessions', 'Live code collaboration', 'P2P video calling', 'Persistent chat history', 'Session history'],
    cta: 'Get Started Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Mentor Pro',
    price: '₹0',
    badge: 'Most Popular',
    description: 'For mentors who are serious about teaching at scale.',
    features: ['Create unlimited sessions', 'Everything in Student', 'Priority session listing', 'Custom session titles', 'Analytics dashboard (coming soon)'],
    cta: 'Start Mentoring',
    href: '/signup',
    highlight: true,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              MentorSpace
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
            >
              Get Started <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Launching: Real-time collaborative workspaces
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
            The elite platform for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              1-on-1 Mentorship.
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl leading-8 text-zinc-400 max-w-2xl mx-auto">
            Bridge the gap between learning and mastery. Connect over HD WebRTC video, collaborate in a VS Code-grade Monaco editor, and chat in real-time — all in one private workspace.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              Start for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-semibold text-zinc-200 hover:bg-white/10 transition-all hover:scale-105"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Social proof micro-tag */}
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-zinc-500">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((l, i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {l}
                </div>
              ))}
            </div>
            <span>Trusted by <strong className="text-zinc-300">2,400+</strong> mentors worldwide</span>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">{s.value}</div>
              <div className="mt-1 text-sm text-zinc-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-300 border border-purple-500/30 bg-purple-500/10 mb-4">
              Everything you need
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Built for serious learning.
            </h2>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
              Every feature is handcrafted for real mentorship situations — not generic video calls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              const colorMap: Record<string, string> = {
                indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
                purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
                pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400',
                amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
                emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
                sky: 'from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-400',
              }
              const c = colorMap[f.color]
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c} border flex items-center justify-center mb-5`}>
                    <Icon className={`h-5 w-5 ${c.split(' ').pop()}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 mb-4">
            3 simple steps
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-16">
            Start in under 60 seconds.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up as a Mentor or Student. Takes 30 seconds — no credit card required.' },
              { step: '02', title: 'Start or Join a Session', desc: 'Mentors create a private room instantly. Students join with a shared Session ID.' },
              { step: '03', title: 'Collaborate in Real-Time', desc: 'Code together, video call, and chat — all in one seamless workspace.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-white/5 mb-4">{item.step}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-pink-300 border border-pink-500/30 bg-pink-500/10 mb-4">
              Loved by thousands
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Real results, real people.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-sky-300 border border-sky-500/30 bg-sky-500/10 mb-4">
              Simple pricing
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              100% free to get started.
            </h2>
            <p className="mt-4 text-zinc-400">No hidden fees. No credit card required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-8 flex flex-col gap-6 ${
                  p.highlight
                    ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-600/10 to-purple-600/5 shadow-xl shadow-indigo-500/10'
                    : 'border-white/5 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-4xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                      {p.price}
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
                  </div>
                  {p.badge && (
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      {p.badge}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`inline-flex items-center justify-center rounded-xl py-3 text-sm font-bold transition-all hover:scale-105 ${
                    p.highlight
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
            Ready to level up?
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Join thousands of mentors and students building real skills — together.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">MentorSpace</span>
          </div>
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} MentorSpace. Built with ❤️ using Next.js, Supabase & WebRTC.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/login" className="hover:text-white transition">Login</Link>
            <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
