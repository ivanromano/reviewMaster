<template>
  <div 
    class="min-h-screen bg-cover bg-fixed bg-no-repeat bg-bottom-right"
    :style="business?.background ? { backgroundImage: `linear-gradient(rgba(0, 20, 40,0.4), rgba(0, 20, 40,0.9)), url(${business.background})` } : {}"
  >
    <!-- Contenido principal -->
    <div class="relative z-10">
      <!-- <div class="pt-20 pb-10">
        <div class="max-w-4xl mx-auto px-4">
          <div class="text-center">
            <img
              v-if="business?.logo_url"
              :src="business.logo_url"
              :alt="`Logo ${business.name}`"
              class="h-20 w-20 mx-auto mb-4 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <h1 class="text-3xl font-bold mb-2 text-white">{{ business?.name }}</h1>
          </div>
        </div>
      </div> -->

      <!-- Contenido de la aplicación -->
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 whitespace-pre-line">
              <div v-html="business?.gratitude_title">

              </div>
              
            </h2>
            <p class="text-lg text-gray-600 mb-2">
              {{ business?.gratitude }}
            </p>
            <p class="text-gray-500">
              ¿Cómo calificarías tu experiencia con nosotros?
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg shadow-cyan-100 p-8 mb-8">
            <div class="text-center mb-6">
              <div class="flex justify-center space-x-2 mb-4">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="handleStarClick(star)"
                  class="text-4xl hover:scale-110 transition-transform"
                >
                  <Icon
                    :name="selectedRating && star <= selectedRating ? 'heroicons:star-20-solid' : 'heroicons:star-20-solid'"
                    class="text-gray-300 hover:text-yellow-400"
                    :class="selectedRating && star <= selectedRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'"
                  />
                </button>
              </div>
              <p class="text-gray-600">
                {{ selectedRating 
                  ? selectedRating === 5 
                    ? '¡Perfecto! Te dirigimos a Google para tu reseña.'
                    : 'Nos gustaría conocer más detalles sobre tu experiencia.'
                  : 'Haz clic en las estrellas para calificar'
                }}
              </p>
            </div>
          </div>
        </div>


        <div v-if="selectedRating === 5" class="mt-6 text-center">
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-green-800 mb-2">
              ¡Excelente! Tu reseña nos ayuda mucho
            </h3>
            <p class="text-green-700 mb-4">
              Te estamos redirigiendo a Google Maps para que puedas dejar tu reseña de 5 estrellas.
            </p>
            <div class="animate-pulse">
              <div class="h-2 bg-green-200 rounded-full">
                <div class="h-2 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <IndexReviews :reviews="reviews" />

      </div>

      
      <!-- Footer -->
      <footer class="mt-12 py-6 border-t bg-white/80 backdrop-blur-sm">
        <div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 ReviewMaster. Todos los derechos reservados. Código propietario protegido.</p>
        </div>
      </footer>
    </div>

    <ModalsModal 
      ref="complaintModal"
      title="Ayúdanos a Mejorar" 
      :showSave="false"
      bg="bg-white"
    >
      <template #btn>
        <button style="display: none">Abrir Quejas</button>
      </template>

      <template #body>
        <div class="text-gray-900">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Ayúdanos a Mejorar
            </h1>
            <p class="text-gray-600">
              Tu opinión es muy importante para nosotros. Cuéntanos cómo podemos hacer tu experiencia mejor.
            </p>
          </div>

          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-green-800 mb-4">
              Te redirigiremos a WhatsApp para que puedas contactarnos directamente.
            </p>
            <button
              @click="handleWhatsAppRedirect"
              class="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </template>
    </ModalsModal>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const route = useRoute()
const slug = route.params.slug as string || "ReviewMaster"
const config = useRuntimeConfig()
const supabase = createClient(
  config.public.SUPABASE_URL,
  config.public.SUPABASE_SERVICE_ROLE_KEY
)

const business = ref<Business>()
const loading = ref(true)
const selectedRating = ref<number | null>(null)
const reviews = ref<Review[]>()
const complaintModal = ref()

onMounted(async () => {
  await fetchBusiness()
  await fetchReviews()
})

const fetchBusiness = async () => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error

    business.value = data
  } catch (error: any) {
    console.error('Error', error)
  } finally {
    loading.value = false
  }
}

const fetchReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('review')
      .select('*')
      .eq('business_id', business.value?.id) 
      .order('display_order', { ascending: true })

    console.log('review', data)

    if (error) throw error

    reviews.value = data
  } catch (error: any) {
    console.error('Error', error)
  } finally {
    loading.value = false
  }
}

const handleStarClick = async (rating: number) => {
  selectedRating.value = rating
  if (rating === 5) {
    if (business.value?.google_maps_url) {
      window.open(business.value.google_maps_url, '_blank')
    }
  } else if (rating <= 4) {
    complaintModal.value.openModal(true)
  }
}

const handleWhatsAppRedirect = () => {
  if (!business.value?.whatsapp_number) return

  const message = `Hola, me gustaría reportar un problema con mi experiencia. Calificación: ${selectedRating.value} estrellas.`
  const whatsappUrl = `https://wa.me/${business.value.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  complaintModal.value.openModal(false)
}
</script>

<!-- 
si te gusta ponele algo como cuando regreses siempre habra una mesa esperandote algo que haga sentir importante al cliente

onele un titulo como, tu buena vibra se queda aqui gracias por visitarnos.  como encabezado las estrellas y los comentarios que sean como un relleno para inspiracion pero no es importante ponele algo del perfil como una foto detras para personalizar el negocio ... este es el perfil que optimize 
-->