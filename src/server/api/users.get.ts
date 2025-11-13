// server/api/users.get.ts
import { defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      throw new Error(error.message);
    }

    return { users: data }
  } catch (err: any) {
    throw new Error(err.statusMessage || err.message);
  }

})