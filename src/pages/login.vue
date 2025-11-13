<script setup lang="ts">
import { reactive } from 'vue'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import useStore from '~/store/store'

const store = useStore()
const toast = useToast()
const client = useSupabaseClient()

const state = reactive<Credentials>({
  email: '',
  password: ''
})

function validate(): FormError[] {
  const errors: FormError[] = []

  if (!state.email || !state.email.includes('@')) {
    errors.push({ name: 'email', message: 'Email inválido' })
  }
  if (!state.password || state.password.length < 6) {
    errors.push({ name: 'password', message: 'La contraseña debe tener al menos 6 caracteres' })
  }

  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: event.data.email!,
      password: event.data.password!
    })

    if (error) {
      toast.add({ title: 'Error', description: error.message, color: 'error' })
      return
    }

    toast.add({ title: 'Bienvenido', description: 'Has iniciado sesión exitosamente', color: 'success' })
    window.location.href = '/'
  } catch {
    toast.add({ title: 'Error', description: 'Por favor revisá los datos ingresados.', color: 'error' })
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
    <h2 class="text-2xl font-bold text-white text-center mb-4">Iniciar sesión</h2>
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4 bg-white p-6 rounded-xl"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormField label="Email" name="email">
        <UInput v-model.trim="state.email" type="email" placeholder="email@dominio.com" />
      </UFormField>

      <UFormField label="Contraseña" name="password">
        <UInput v-model="state.password" type="password" placeholder="••••••••" />
      </UFormField>

      <UButton type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">
        Iniciar sesión
      </UButton>
    </UForm>
  </div>
</template>
