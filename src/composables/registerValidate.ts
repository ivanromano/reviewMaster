import type { FormError } from '@nuxt/ui'

const useRegisterValidate = (state:Credentials, uniqueIdentifiers:string[]):FormError[] => {
  const errors:SingUpError[] = []
  if (state.identifier && uniqueIdentifiers.includes(state.identifier)) {
    errors.push({ name: 'identifier', message: 'Identifier already exists' })
  }
  
  if (!state.first_name) errors.push({ name: 'first_name', message: 'Required' })
  if (!state.identifier) errors.push({ name: 'identifier', message: 'Required' })
  if (state.identifier && state.identifier.length < 3) {
    errors.push({ name: 'identifier', message: 'Must be at least 3 characters' })
  }

  if (state.identifier && !/^[a-zA-Z0-9_]+$/.test(state.identifier)) {
    errors.push({ name: 'identifier', message: 'Identifier can only contain letters, numbers, and underscores' })
  }
  
  if (state.identifier && state.identifier.length > 50) {
    errors.push({ name: 'identifier', message: 'Identifier must be less than 50 characters' })
  }
 
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  if (state.password && state.password.length < 6) {
    errors.push({ name: 'password', message: 'Must be at least 6 characters' })
  }
  if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Invalid email address' })
  }
  if (state.email && state.email.length > 100) {
    errors.push({ name: 'email', message: 'Email must be less than 100 characters' })
  }
  if (state.password && state.password.length > 50) {
    errors.push({ name: 'password', message: 'Password must be less than 50 characters' })
  }
  if (state.password && !/[A-Z]/.test(state.password)) {
    errors.push({ name: 'password', message: 'Password must contain at least one uppercase letter' })
  }
  if (state.password && !/[a-z]/.test(state.password)) {
    errors.push({ name: 'password', message: 'Password must contain at least one lowercase letter' })
  }
  if (state.password && !/[0-9]/.test(state.password)) {
    errors.push({ name: 'password', message: 'Password must contain at least one number' })
  }
  if (state.password && !/[!@#$%^&*(),.?":{}|<>]/.test(state.password)) {
    errors.push({ name: 'password', message: 'Password must contain at least one special character' })
  } 

  if (state.repassword && state.password !== state.repassword) {
    errors.push({ name: 'repassword', message: 'Passwords do not match' })
  }
  return errors
}

export default useRegisterValidate