// server/api/users/[id].patch.ts
import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody<{
    // email?: string
    user_metadata?: Record<string, any>
  }>(event)

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.auth.admin.updateUserById(id, body)

  if (error) {
    event.res.statusCode = 500
    console.log(error.message);
    return { error: error.message }
  }
  
  return { user: data }
})
