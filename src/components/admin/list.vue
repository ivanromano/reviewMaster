<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <div>
        Buscador
        <UInput
          v-model="globalFilter"
          class="max-w-sm min-w-[12ch]"
          placeholder="Search…"
          name="h"
        />
      </div>


      <UDropdownMenu
        :items="table?.tableApi
          ?.getAllColumns()
          .filter(col => col.getCanHide())
          .map(col => ({
            label: col.id.charAt(0).toUpperCase() + col.id.slice(1),
            type: 'checkbox' as const,
            checked: col.getIsVisible(),
            onUpdateChecked: (v: boolean) => col.toggleVisibility(!!v),
            onSelect: (e?: Event) => e?.preventDefault()
          })) "
        :content="{ align: 'end' }"
      >
        <UButton
          label="Columns"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          class="ml-auto"
          aria-label="Columns select dropdown"
        />
      </UDropdownMenu>
    </div>

    <UTable ref="table" :data="obj" :columns="columns" sticky class="h-96" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

const props = defineProps<{ obj: Record<string, any>[] }>()



const toast = useToast()

const UInput = resolveComponent('UInput')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const emit = defineEmits<{
  (e: 'edit', item: Record<string, any>): void
  (e: 'delete', item: Record<string, any>): void
}>()

const globalFilter = ref<string>('')

watch(globalFilter, (val) => {
  table.value?.tableApi?.setGlobalFilter(val)
})

const columns = computed<TableColumn<any>[]>(() => {
  if (!props.obj.length) return []
  const keys = Object.keys(props.obj[0])
  const dataCols = keys.map(key => ({
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    enableHiding: true
  }))

  return [
    ...dataCols,
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      cell: ({ row }: { row: Row<any> }) =>
        h(
          'div', { class: 'text-right' },
          h(UDropdownMenu, {
            content: { align: 'end' },
            items: [
              { type: 'label', label: 'Actions' },
              { label: 'Edit',    onSelect: () => handleEdit(row.original)},
              { label: 'Delete',  onSelect: () => emit('delete', row.original) },
            ],
            'aria-label': 'Actions dropdown'
          }, () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
          )
        )
    }
  ]
})

async function handleEdit(item: Record<string, any>) {

  try {
    const result = await openEditModal(item, 'Editar Registro')
    
    if (result) {
      emit('edit', result)
      
      toast.add({
        title: 'Cambios guardados',
        description: 'Los datos se actualizaron correctamente',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Edición cancelada',
        description: 'No se realizaron cambios',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Ocurrió un error al editar el registro',
      color: 'error'
    })
    console.error('Error editing item:', error)
  }
}

const table = useTemplateRef('table')
</script>

