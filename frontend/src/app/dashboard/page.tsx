import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, Plus, LogIn, Link2, Sparkles, Video, Terminal, MessageSquare, ArrowRight, UserCircle } from 'lucide-react'
import { createSession, joinSession } from './actions'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const role = user.user_metadata.role || 'STUDENT'

  // Fetch active / previous sessions for this user
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .or(`mentor_id.eq.${user.id},student_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const activeSessions = sessions?.filter(s => s.status === 'ACTIVE') || []
  const pastSessions = sessions?.filter(s => s.status === 'COMPLETED') || []

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50 selection:bg-indigo-500/30">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none -z-10 dark:from-indigo-900/20 dark:via-purple-900/10" />

      {/* Glassmorphic Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-gray-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight ml-1">
                Mentorship
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 placeholder-wave">
                  {user.user_metadata.full_name || 'User'}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {role}
                </span>
              </div>
              <Link
                href="/profile"
                className="flex h-9 items-center gap-2 rounded-full border border-gray-200/80 bg-white/50 px-4 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <UserCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex h-9 items-center gap-2 rounded-full border border-gray-200/80 bg-white/50 px-4 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Welcome Banner */}
        <section className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user.user_metadata.full_name?.split(' ')[0] || 'Friend'}</span>
            </h1>
            <p className="text-base text-gray-500 dark:text-zinc-400">
              Ready to dive into your real-time collaborative workspace?
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
             <div className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{sessions?.length || 0}</div>
                <div className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">Total Sessions</div>
             </div>
             <div className="px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{activeSessions.length}</div>
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-500 uppercase tracking-wider mt-0.5">Active Now</div>
             </div>
          </div>
        </section>

        {/* Action Row - Glassmorphic Call to action */}
        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-indigo-100/40 border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-indigo-200/40">
          
          {/* Animated gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-transparent opacity-50 dark:from-indigo-500/5 dark:to-transparent" />
          
          <div className="relative flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {role === 'MENTOR' ? <Plus className="h-4 w-4"/> : <LogIn className="h-4 w-4"/>}
                {role === 'MENTOR' ? 'Start a Mentorship Session' : 'Join a Mentorship Session'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {role === 'MENTOR' ? 'Spin up a private workspace.' : 'Access your live classroom.'}
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-sm leading-relaxed">
                Experience zero-latency code syncing, integrated video calling, and live chat within milliseconds. 
              </p>
            </div>
            
            <div className="w-full max-w-md shrink-0">
              {role === 'MENTOR' ? (
                <form action={createSession} className="flex flex-col gap-3 p-5 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Class Name</label>
                  <div className="flex gap-2">
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. Advanced React Patterns"
                      className="flex-1 rounded-xl border-0 py-3 px-4 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-zinc-700 transition-all outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Start Free Let's Go
                    </button>
                  </div>
                </form>
              ) : (
                <form action={joinSession} className="flex flex-col gap-3 p-5 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Session Link ID</label>
                  <div className="flex gap-2">
                    <input
                      name="sessionId"
                      type="text"
                      required
                      placeholder="Paste ID exactly"
                      className="flex-1 rounded-xl border-0 py-3 px-4 font-mono text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-900 dark:text-white dark:ring-zinc-700 transition-all outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Connect
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Sessions History Layout */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Workspace History</h3>
          </div>
          
          {sessions && sessions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session: any) => (
                <Link key={session.id} href={`/session/${session.id}`} className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-indigo-500/50 relative overflow-hidden">
                  
                  {/* Subtle Top glow on hover */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex justify-between items-start mb-4">
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        session.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          : session.status === 'COMPLETED'
                          ? 'bg-gray-50 text-gray-500 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
                      }`}>
                        {session.status}
                    </div>
                    <div className="flex gap-1 text-gray-400 dark:text-zinc-600">
                      <Terminal className="h-4 w-4"/>
                      <Video className="h-4 w-4"/>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 dark:text-zinc-100 line-clamp-1 mb-1">
                    {session.title}
                  </h4>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <p className="flex items-center text-xs font-medium text-gray-500 dark:text-zinc-400 gap-1.5 focus:outline-none">
                        <Link2 className="h-3 w-3" />
                        <span className="font-mono">{session.id.split('-')[0]}</span>
                     </p>
                     {/* Hydration-safe date rendering using string split */}
                     <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                        {session.created_at.split('T')[0]}
                     </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 py-20 px-6 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
              <div className="rounded-full bg-gray-100 p-4 dark:bg-zinc-800">
                <UserCircle className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">No sessions created</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400 max-w-sm">
                Get started by creating a new session from the banner above. You'll generate a code to share with your student immediately.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
