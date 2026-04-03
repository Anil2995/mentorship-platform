import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, User, Mail, Award, Sparkles, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const role = user.user_metadata.role || 'STUDENT'
  const fullName = user.user_metadata.full_name || 'User'
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  // Fetch session stats
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .or(`mentor_id.eq.${user.id},student_id.eq.${user.id}`)

  const totalSessions = sessions?.length || 0
  const completedSessions = sessions?.filter((s: any) => s.status === 'COMPLETED').length || 0
  const activeSessions = sessions?.filter((s: any) => s.status === 'ACTIVE').length || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-gray-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-4xl px-6 flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">MentorSpace</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-xl shadow-indigo-500/20">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black backdrop-blur-sm border border-white/20">
              {initials}
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">{fullName}</h1>
              <p className="text-indigo-200 text-sm">{user.email}</p>
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions', value: totalSessions, icon: Clock, color: 'indigo' },
            { label: 'Completed', value: completedSessions, icon: Award, color: 'emerald' },
            { label: 'Active Now', value: activeSessions, icon: Sparkles, color: 'purple' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 shadow-sm text-center">
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Account Info Card */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Account Information</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {[
              { icon: User, label: 'Full Name', value: fullName },
              { icon: Mail, label: 'Email', value: user.email || '' },
              { icon: Award, label: 'Role', value: role },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100 mt-0.5 truncate">{item.value}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions && sessions.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Sessions</h2>
              <Link href="/dashboard" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {sessions.slice(0, 5).map((session: any) => (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${
                    session.status === 'ACTIVE' ? 'bg-emerald-500' :
                    session.status === 'COMPLETED' ? 'bg-gray-400' : 'bg-indigo-500'
                  }`} />
                  <span className="flex-1 text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{session.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                    {session.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-6">
          <h2 className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Danger Zone</h2>
          <p className="text-xs text-red-600/70 dark:text-red-500/70 mb-4">These actions are irreversible. Please proceed with caution.</p>
          <form action="/api/auth/signout" method="POST">
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg border border-red-300 dark:border-red-500/30 bg-white dark:bg-transparent px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
            >
              Sign Out
            </Link>
          </form>
        </div>

      </main>
    </div>
  )
}
