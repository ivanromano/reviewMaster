import { createClient } from '@supabase/supabase-js'

export default async function useUpdateUser(id: string, newUserData:User) {
  if (!id) throw new Error('ID is required')



  // const body = await readBody<{
  //   // email?: string
  //   user_metadata?: Record<string, any>
  // }>(event)

  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.SUPABASE_URL,
    config.public.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase.auth.admin.updateUserById(id, {
      // email: newUserData.email,
      user_metadata: {
        first_name: newUserData.first_name,
        identifier: newUserData.identifier,
        is_admin: newUserData.is_admin,
        is_editor: newUserData.is_editor
      }
    })

  // if (error) {
  //   event.res.statusCode = 500
  //   console.log(error.message);
  //   return { error: error.message }
  // }
  
  return { user: data }




  // const res = await $fetch<{user: SupabaseUser}>(`/api/users/${id}`, {
  //   method: 'PATCH',
  //   body: {
  //     email: newUserData.email,
  //     user_metadata: {
  //       first_name: newUserData.first_name,
  //       identifier: newUserData.identifier,
  //       is_admin: newUserData.is_admin,
  //       is_editor: newUserData.is_editor
  //     }
  //   }
  // })
  

}





//     const { data, error } = await supabase.auth.admin.listUsers()
//     if (error) {
//       throw new Error(error.message);
//     }

//     store.users = data.users 
//     return store.users




// export default defineEventHandler(async (event) => {
//   const { id } = event.context.params!

// })
