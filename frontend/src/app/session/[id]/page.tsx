import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import SessionWorkspace from '@/components/workspace/SessionWorkspace'
import { endSession } from '@/app/dashboard/actions'

interface SessionPageProps {
  params: { id: string }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const sessionId = resolvedParams.id;

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <h1 className="text-xl">Session not found or has been deleted.</h1>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-950">
      {/* Session Header */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="rounded p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-tight">
              {session.title}
            </h1>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Mentorship Session
            </span>
          </div>
          <span className={`rounded-xl px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            session.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
          }`}>
            {session.status}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            ← Back
          </Link>
          <form action={endSession.bind(null, sessionId)}>
            <button
              type="submit"
              className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/20 transition-all"
            >
              End Session
            </button>
          </form>
        </div>
      </header>

      {/* Interactive Main Workspace */}
      <SessionWorkspace sessionId={sessionId} sessionTitle={session.title} />
    </div>
  )
}
