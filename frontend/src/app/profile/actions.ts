'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const full_name = formData.get('full_name') as string

  await supabase.auth.updateUser({
    data: { full_name }
  })

  revalidatePath('/profile')
}
