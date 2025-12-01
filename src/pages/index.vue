<template>
  <div 
    class="min-h-screen bg-cover bg-fixed bg-no-repeat bg-bottom-right"
    :style="business?.background ? { backgroundImage: `linear-gradient(rgba(0, 20, 40,0.4), rgba(0, 20, 40,0.9)), url(${business.background})` } : {}"
  >
    <div class="relative z-10">
      <div class="md:max-w-4xl mx-auto md:px-4 md:py-8">
        <div class="bg-white/40 backdrop-blur-sm md:rounded-lg shadow-lg p-8 mb-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 whitespace-pre-line">
              <div v-html="business?.gratitude_title"></div>
            </h2>
            <p class="text-lg text-gray-700 mb-2">
              {{ business?.gratitude }}
            </p>
            <p class="text-gray-700">
              {{ texts[0]["How_would_you_rate_your_experience_with_us?"] }}
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md shadow-cyan-900/50 p-8 mb-8">
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
                    class="text-gray-500 hover:text-yellow-400"
                    :class="selectedRating && star <= selectedRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'"
                  />
                </button>
              </div>
              <p class="text-gray-600">
                {{ selectedRating 
                  ? selectedRating === 5 
                    ? texts[1]["We_will_direct_you_to_Google_for_your_review"]
                    : texts[2]["We_would_like_to_know_more_details_about_your_experience"]
                  : texts[3]["Click_on_the_stars_to_rate"]
                }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="selectedRating === 5" class="mt-6 text-center">
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-green-800 mb-2">
              {{ texts[1]["We_will_direct_you_to_Google_for_your_review"] }}
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

      <Footer />
    </div>

    <ModalsModal 
      ref="complaintModal"
      :title="texts[4]['Help_us_improve']" 
      :showSave="false"
      bg="bg-white"
    >
      <template #btn>
        <button style="display: none">{{ texts[4]['Help_us_improve'] }}</button>
      </template>

      <template #body>
        <div class="text-gray-900">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ texts[4]['Help_us_improve'] }}
            </h1>
            <p class="text-gray-600">
              {{ texts[5]['Your_opinion_is_very_important_to_us'] }}
            </p>
          </div>

          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-green-800 mb-4">
              {{ texts[6]['We_will_redirect_you_to_WhatsApp'] }}
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

const targetLang = ref()


interface Text {
  [key: string]: string;
}

const texts = ref<Text[]>([
  {"How_would_you_rate_your_experience_with_us?": "¿Cómo calificarías tu experiencia con nosotros?"},
  {"We_will_direct_you_to_Google_for_your_review": "¡Perfecto! Te dirigimos a Google para tu reseña"},
  {"We_would_like_to_know_more_details_about_your_experience": "Nos gustaría conocer más detalles sobre tu experiencia."},
  {"Click_on_the_stars_to_rate": "Haz clic en las estrellas para calificar"},
  {"Help_us_improve": "Ayúdanos a Mejorar"},
  {"Your_opinion_is_very_important_to_us": "Tu opinión es muy importante para nosotros. Cuéntanos cómo podemos hacer tu experiencia mejor."},
  {"We_will_redirect_you_to_WhatsApp": "Te redirigiremos a WhatsApp para que puedas contactarnos directamente."},
  {"Redirecting_to_Google_Maps": "Te estamos redirigiendo a Google Maps para que puedas dejar tu reseña de 5 estrellas."},
  {"Contact_on_WhatsApp": "Contactar por WhatsApp"},
  {"Excellent_your_review_helps_us_a_lot": "¡Excelente! Tu reseña nos ayuda mucho"}
])

onMounted(async () => {
  await fetchBusiness()
  await fetchReviews()

  targetLang.value = navigator.language.split("-")[0]
  
  if (targetLang.value !== 'es') {
    for (const text of texts.value) {
      const key:string = Object.keys(text)[0]
      text[key] = await tr(text[key])
    }
  }

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

    business.value!.gratitude_title = await tr(business.value!.gratitude_title)
    business.value!.gratitude = await tr(business.value!.gratitude)
    
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

    if (error) throw error

    reviews.value = data
    reviews.value!.forEach(async (review) => {
      review.text = await tr(review.text)
    })

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

// useHead({
//   title: slug,
//   meta: [
//     { name: 'description', content: 'My amazing site.' },
//   ],
// })

</script>
