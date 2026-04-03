'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSession(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'MENTOR') {
    throw new Error('Only mentors can create sessions.')
  }

  const title = formData.get('title') as string

  const { data: session, error } = await supabase
    .from('sessions')
    .insert([
      { title, mentor_id: user.id }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating session', error)
    throw new Error('Failed to create session')
  }

  revalidatePath('/dashboard')
  // Redirect mentor straight to their new room
  redirect(`/session/${session.id}`)
}

export async function joinSession(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Must be logged in to join.')
  }

  const sessionId = formData.get('sessionId') as string

  // First check if it's already assigned
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (!session) throw new Error('Session not found.')

  if (session.student_id === null && user.user_metadata.role === 'STUDENT') {
    // Assign student to session
    const { error } = await supabase
      .from('sessions')
      .update({ student_id: user.id })
      .eq('id', sessionId)

    if (error) throw new Error('Failed to join session')
  }

  revalidatePath('/dashboard')
  redirect(`/session/${sessionId}`)
}

export async function endSession(sessionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sessions')
    .update({ status: 'COMPLETED', ended_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) {
    console.error('Error ending session', error)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
