<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  data: Record<string, any>
  title: string
}>()

const emit = defineEmits<{ close: [Record<string, any> | null] }>()

const form = reactive({ ...props.data })

function submit() {
  emit('close', { ...form })
}

function cancel() {
  emit('close', null)
}
</script>

<template>
  <UModal :close="{ onClick: cancel }" :title="title">
    <template #body>
      <form @submit.prevent="submit" class="space-y-4">
        <div v-for="(value, key) in form" :key="key" class="flex flex-col">
          <label class="text-sm font-medium mb-1">{{ key }}</label>
          <UInput v-model="form[key]" />
        </div>
        <button type="submit" class="sr-only">Guardar</button>
      </form>
    </template>

    <template #footer>
      <UButton @click="cancel" color="neutral" label="Cancelar" />
      <UButton @click="submit" color="primary" label="Guardar" />
    </template>
  </UModal>
</template>
