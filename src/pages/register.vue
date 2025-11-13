<script setup lang="ts">
import { reactive } from 'vue'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import useRegisterValidate from '~/composables/registerValidate'
import useStore from '~/store/store'

const store = useStore()
const state = reactive<Credentials>({
  first_name: '',
  identifier: '',
  email: '',
  password: '',
  repassword: ''
})

const users = ref<SupabaseUser[]>(await getUsers())
const uniqueIdentifiers = ref<string[]>([])

function getuniqueIdentifiers(): string[] {
  if (uniqueIdentifiers.value.length > 0) {
    return uniqueIdentifiers.value
  }

  uniqueIdentifiers.value = users.value.map( (user:SupabaseUser) => user.user_metadata?.identifier)
  return uniqueIdentifiers.value
}

function validate(aCredentials:Credentials):FormError[] {
  return useRegisterValidate(aCredentials, getuniqueIdentifiers())
}

const client = useSupabaseClient()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  try {
    const { data, error } = await client.auth.signUp({
      email: event.data.email!,
      password: event.data.password!,
      options: {
        data: {
          first_name: event.data.first_name!,
          identifier: event.data.identifier!,
          is_admin: false,
          is_editor: false
        }
      }
    })

    if (error) {
      toast.add({ title: 'Error', description: error.message, color: 'error' })
      return
    }

    toast.add({ title: 'Success', description: '¡Registro completado con éxito!', color: 'success' })
    // console.log(data, event.data)
    window.location.href = '/checkEmail'
  } catch {
    toast.add({ title: 'Error', description: 'Please fix the errors in the form.', color: 'error' })
  }
}

function onError(event: FormErrorEvent) {
  const err = event.errors?.[0]
  if (err?.id) {
    const el = document.getElementById(err.id)
    el?.focus()
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

</script>

<template>
  <div class="max-w-md mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 my-6 p-6 rounded-2xl shadow-xl">
    <h2 class="text-2xl font-bold text-white text-center mb-4">Crear Cuenta</h2>
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4 bg-white p-6 rounded-xl"
      @submit="onSubmit"
      @error="onError"
    >
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Nombre" name="first_name">
          <UInput v-model.trim="state.first_name" placeholder="John" />
        </UFormField>
        <UFormField label="Nombre unico" name="identifier">
          <UInput v-model.trim="state.identifier" placeholder="john_doe" />
        </UFormField>
      </div>

      <UFormField label="Email" name="email">
        <UInput v-model.trim="state.email" type="email" placeholder="email@dominio.com" />
      </UFormField>

      <UFormField label="Contraseña" name="password">
        <UInput v-model="state.password" type="password" placeholder="••••••••" />
      </UFormField>

      <UFormField label="Repetir Contraseña" name="repassword">
        <UInput v-model="state.repassword" type="password" placeholder="••••••••" />
      </UFormField>

      <UButton type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">
        Registrarse
      </UButton>
    </UForm>
  </div>
</template>
