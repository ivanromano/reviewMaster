import { LazyEditModal } from '#components'
import { useOverlay } from '#imports'

// en consola solo tuve openEditModal.ts:25 Modal abierto: Editar Registro
export function openEditModal(data: Record<string, any>, title = 'Registro') {
  try {
    const overlay = useOverlay()
    const modal = overlay.create(LazyEditModal, {
      props: { data, title }
    })

    // ya no pasamos `open: true`
    const instance = modal.open()

    return instance.result as Promise<Record<string, any> | null>
  } catch (error) {
    console.error("Error al abrir el modal:", error)
    return Promise.resolve(null)
  }
}