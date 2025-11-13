import useStore from "~/store/store"

export default function getUser(): User | null {
  const user = useSupabaseUser().value
  
  if (!user) {
    return null
  }

  const data:User = {
    id: user.id,
    email: user.email!,
    first_name: user.user_metadata.first_name || '',
    identifier: user.user_metadata.identifier || '',
    is_admin: user.user_metadata.is_admin,
    is_editor: user.user_metadata.is_editor,
    created_at: user.created_at,
    updated_at: user.updated_at || ''
  }
  

  return data
}

