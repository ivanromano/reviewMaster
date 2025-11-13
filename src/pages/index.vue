<!-- <template>
  <div class="min-h-screen bg-gray-50">

    <div 
      class="relative"
      :style="{ backgroundColor: business?.primary_color }"
    >
    <NuxtPage/>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center text-white">
          <img
            v-if="business?.logo_url"
            :src="business.logo_url"
            :alt="`Logo ${business.name}`"
            class="h-20 w-20 mx-auto mb-4 rounded-full object-cover"
          />
          <h1 class="text-3xl font-bold mb-2">{{ business?.name }}</h1>
          <p class="text-lg opacity-90">{{ business?.google_maps_url }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          ¡Gracias por visitarnos!
        </h2>
        <p class="text-lg text-gray-600 mb-2">
          Tu opinión es muy valiosa para nosotros
        </p>
        <p class="text-gray-500">
          ¿Cómo calificarías tu experiencia con nosotros?
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
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

      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Lo que dicen nuestros clientes:
        </h3>
        <div class="space-y-4">
          <div
            v-for="comment in mockComments"
            :key="comment.id"
            class="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div class="flex items-center mb-2">
              <div class="flex">
                <Icon
                  v-for="i in comment.rating"
                  :key="i"
                  name="heroicons:star-20-solid"
                  class="h-4 w-4 text-yellow-400"
                />
              </div>
              <span class="ml-2 text-sm text-gray-500">
                {{ comment.name }} • {{ comment.date }}
              </span>
            </div>
            <p class="text-gray-700">{{ comment.text }}</p>
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
    </div>

    <footer class="mt-12 py-6 border-t bg-white">
      <div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>© 2025 ReviewMaster. Todos los derechos reservados. Código propietario protegido.</p>
      </div>
    </footer>

    <div v-if="showComplaintForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Ayúdanos a Mejorar
          </h1>
          <p class="text-gray-600">
            Tu opinión es muy importante para nosotros. Cuéntanos cómo podemos hacer tu experiencia mejor.
          </p>
        </div>

        <div >
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-green-800 mb-4">
              Te redirigiremos a WhatsApp para que puedas contactarnos directamente.
            </p>
            <button
              @click="handleWhatsAppRedirect"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Contactar por WhatsApp
            </button>
          </div>
        </div>


      </div>
    </div>
  </div>
</template> -->

<template>
index
    <NuxtPage/>

</template>

<script setup lang="ts">
interface Comment {
  id: number
  name: string
  text: string
  rating: number
  date: string
}

const route = useRoute()
const slug = route.params.slug as string || "ReviewMaster"

const business = ref<Business | null>(null)
const loading = ref(true)
const selectedRating = ref<number | null>(null)
const showComplaintForm = ref(false)
const submittingComplaint = ref(false)

const complaintData = ref({
  name: '',
  email: '',
  phone: '',
  comment: ''
})

const mockComments: Comment[] = [
  {
    id: 1,
    name: "María González",
    text: "¡Excelente servicio! Muy recomendado, la atención fue personalizada y el producto de calidad.",
    rating: 5,
    date: "2 días atrás"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    text: "Muy buena experiencia. El local está bien ubicado y el personal es muy profesional.",
    rating: 5,
    date: "1 semana atrás"
  },
  {
    id: 3,
    name: "Ana Martínez",
    text: "Llevo años viniendo aquí y siempre me voy contenta. Súper recomendado para todos.",
    rating: 5,
    date: "2 semanas atrás"
  },
  {
    id: 4,
    name: "Luis Fernández",
    text: "Buen lugar, precios justos y excelente atención al cliente. Definitivamente volveré.",
    rating: 5,
    date: "3 semanas atrás"
  },
  {
    id: 5,
    name: "Sofía López",
    text: "Me encantó la experiencia. El ambiente es muy acogedor y el servicio excepcional.",
    rating: 5,
    date: "1 mes atrás"
  }
]

onMounted(() => {
    // fetchBusiness().then(() => {
    //   console.log("terminando fetch");
    // });
  
})

const fetchBusiness = async () => {
  try {
    const { data, error } = await useSupabaseClient()
      .from('Businesses')
      .select('*')
      .eq('slug', "ReviewMaster")
      .single()

    
    // console.log('success', data)

    if (error) throw error

    business.value = data
  } catch (error: any) {
    console.error('Error', error)
  } finally {
    loading.value = false
  }
}


const trackEvent = async (eventType: string, metadata?: any) => {
  if (business.value == null) return
  
  try {
    await useSupabaseClient().functions.invoke('track-analytics', {
      body: {
        business_id: business.value.id,
        event_type: eventType,
        metadata: metadata || {},
        landing_page_url: window.location.href
      }
    })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

const handleStarClick = async (rating: number) => {
  selectedRating.value = rating
  await trackEvent('star_click', { rating })
  if (rating === 5) {
      const client = useSupabaseClient()

    await trackEvent('positive_redirect')

    if (business.value?.google_maps_url) {
      window.open(business.value.google_maps_url, '_blank')
    }
  } else {
    showComplaintForm.value = true
    await trackEvent('negative_redirect', { rating })
  }
}

// Ninguna sobrecarga coincide con esta llamada.
//   La sobrecarga 1 de 2, "(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<never, never, never, null, "complaints", never, "POST">", dio el error siguiente.
//     No se puede asignar un argumento de tipo "{ business_id: string; customer_name: string; customer_email: string; customer_phone: string; rating: number | null; comment: string; }" al parámetro de tipo "never".
//   La sobrecarga 2 de 2, "(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<never, never, never, null, "complaints", never, "POST">", dio el error siguiente.
//     El literal de objeto solo puede especificar propiedades conocidas y 'business_id' no existe en el tipo 'never[]'.ts-plugin(2769)

const handleComplaintSubmit = async () => {
  if (!business.value) return

  submittingComplaint.value = true
  
  try {
    const { error } = await useSupabaseClient()
      .from('complaints').insert({
        business_id: business.value.id,
        customer_name: complaintData.value.name,
        customer_email: complaintData.value.email,
        customer_phone: complaintData.value.phone,
        rating: selectedRating.value,
        comment: complaintData.value.comment
      })

    if (error) throw error

    await useSupabaseClient().functions.invoke('send-complaint-notification', {
      body: {
        business_id: business.value.id,
        customer_name: complaintData.value.name,
        customer_email: complaintData.value.email,
        customer_phone: complaintData.value.phone,
        rating: selectedRating.value,
        comment: complaintData.value.comment
      }
    })

    await trackEvent('complaint_submitted', complaintData.value)
    
    // Aquí podrías usar un toast de Nuxt
    showComplaintForm.value = false
    
  } catch (error: any) {
    console.error('Error submitting complaint:', error)
    // Aquí podrías usar un toast de Nuxt
  } finally {
    submittingComplaint.value = false
  }
}

const handleWhatsAppRedirect = () => {
  if (!business.value?.whatsapp_number) return

  const message = `Hola, me gustaría reportar un problema con mi experiencia. Calificación: ${selectedRating.value} estrellas.`
  const whatsappUrl = `https://wa.me/${business.value.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

watch(business, (newBusiness) => {
  if (newBusiness) {
    trackEvent('qr_scan')
  }
})
</script>

<!-- <template>
  <div class="antialiased bg-gray-50">
    <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-8 shadow-lg">
      <div class="container mx-auto text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
          <span class="text-yellow-300">Review</span> Master
        </h1>
        <p class="text-lg md:text-xl font-light opacity-90">
          Tu socio estratégico para dominar la presencia digital local.
        </p>
      </div>
    </header>

    <section class="py-12 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4 md:px-8 max-w-4xl">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Descubre cómo impulsamos tu negocio
        </h2>
        <VideoEmbed videoId="gilGy7lMTsM" />
      </div>
    </section>

    <section class="py-12 md:py-16 bg-white">
      <div class="container mx-auto px-4 md:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
          Nuestros Servicios Digitales
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            v-for="service in services"
            :key="service.title"
            :icon="service.icon"
            :title="service.title"
            :description="service.description"
            :color="service.color"
          />
        </div>
      </div>
    </section>

    <section class="py-12 md:py-16 bg-gray-50 text-center">
      <div class="container mx-auto px-4 md:px-8 max-w-2xl">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          ¿Quieres saber más?
        </h2>
        <p class="text-lg text-gray-700 mb-8 leading-relaxed">
          Descarga nuestro PDF explicativo y descubre cómo estas herramientas digitales
          pueden transformar la presencia de tu negocio y atraer más clientes.
        </p>
        <a 
          href="https://drive.google.com/file/d/1wuyaE4F2-XxemR7Q0LyXaje9jtbT9mgj/view?usp=sharing" 
          download 
          class="inline-flex items-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 text-lg transform hover:scale-105"
        >
          <i class="fas fa-download mr-3"></i> Descargar PDF Explicativo
        </a>
        <p class="text-sm text-gray-500 mt-4">
          Recuerda reemplazar el enlace del PDF.
        </p>
      </div>
    </section>

    <WhatsAppButton />
  </div>
</template>

<script setup>
const services = [
  {
    icon: 'material-symbols:kid-star',
    title: 'Sistema de Reseñas Inteligente',
    description: 'Gestiona y optimiza tus reseñas de Google para construir una reputación online impecable. Filtra comentarios negativos y potencia los positivos.',
    color: 'blue'
  },
  {
    icon: 'ic:baseline-location-on',
    title: 'Posicionamiento Local en Google Maps',
    description: 'Asegura que tu negocio sea encontrado por clientes cercanos en Google Maps. Dominamos el SEO local para tu visibilidad.',
    color: 'green'
  },
  {
    icon: 'solar:global-linear',
    title: 'Creación de Páginas Web Atractivas',
    description: 'Diseñamos y desarrollamos páginas web modernas, responsivas y optimizadas para convertir visitantes en clientes fieles.',
    color: 'purple'
  }
]

useHead({
  title: 'EEG - Encuentrame en Google',
  meta: [{ name: 'description', content: 'EGG' }],
  link: [{ rel: 'icon', type: 'image/jpeg', href: '../assets/favicon.jpeg' }],
})

</script> -->

<!-- 
📋 PROMPT MAESTRO PARA REPLICAR LA APLICACIÓN SaaS DE RESEÑAS
Quiero una aplicación SaaS (Software as a Service) completa para la gestión y filtrado de reseñas de Google Maps para comercios, implementada con Supabase (para backend, base de datos, almacenamiento y Edge Functions) y React/Next.js/Vite (para frontend).El objetivo es maximizar las reseñas positivas en Google Maps y capturar las negativas para gestionarlas internamente.

1. 🎯 Funcionalidad CentralLa aplicación debe cumplir con el siguiente flujo inteligente:QR Code Único: Cada comercio genera un QR único desde su panel de administración.Redirección a Landing Page: El QR lleva a una landing page de filtro específica para ese negocio (/review/[slug-del-negocio]).
Sistema de Filtro (5 Estrellas):5 Estrellas (Positivo): Redirecciona al cliente directamente al enlace de reseñas de Google Maps del comercio.1-4 Estrellas (Negativo/Neutral): Redirecciona al cliente a un formulario interno o a un chat de WhatsApp del comercio (el comerciante debe poder elegir la opción).Gestión de Negativas: El cliente redirigido debe recibir un mensaje como "¿Cómo podemos mejorar?" o "Cuéntanos tu problema". El sistema debe capturar esta queja para su tratamiento interno y envío de promociones de recuperación.

2. 💰 Monetización y Modelo de Negocio
El modelo de negocio es por suscripción mensual (SaaS). Pasarela de Pago: El sistema debe usar Hotmart como pasarela de pago para soportar transacciones nacionales (Argentina) e internacionales. Implementar 3 Edge Functions para Hotmart: hotmart-webhook (para procesar pagos), hotmart-subscribe y validate-hotmart-subscription.Los planes de suscripción son:Plan Básico: $9.99 USD/mesPlan Premium: $19.99 USD/mesPlan Enterprise: $39.99 USD/mesPublicidad: Debe haber espacio para integrar publicidad de Adsterra en las landing pages para generar ingresos adicionales.Protección Legal: Incluir cláusulas de Derechos Reservados (copyright notice) y protección anti-copia básica en el frontend y footer para proteger la propiedad intelectual del sistema.

3. 🖥️ Componentes del Frontend (Panel y Landing)Panel de Administración (Comerciante):Dashboard con métricas y analíticas de scans de QR y quejas capturadas.Página de Configuración de Negocio:Campos para datos del negocio (Nombre, Dirección, Enlace de Google Maps, WhatsApp, Email).Opción para personalización de marca (paleta de colores, logo, estilo visual) para adaptarse a diferentes tipos de negocios (ej: verde para verdulería, serio para abogado).Opción para elegir el destino de las quejas (Formulario interno o WhatsApp).Generación de QR: Botón para generar/regenerar y descargar el código QR automáticamente.Página de Suscripción: Muestra los 3 planes de Hotmart con un call-to-action para suscribirse.Landing Page de Filtro (/review/[slug]):Diseño muy atractivo y profesional con un sistema interactivo de 5 estrellas.Persuasión: Debe tener comentarios ficticios positivos y creíbles del negocio para alentar al usuario a dejar 5 estrellas.Debe ser 100% responsive.

4. ⚙️ Componentes del Backend (Edge Functions y BD)El sistema debe usar las siguientes Edge Functions de Supabase (Deno) y corregir los errores de la versión anterior:FunciónPropósitoCorrección Vitalgenerate-qr-codeGenera la imagen QR para la landing page.Usar la URL real de la aplicación en lugar de cualquier placeholder (tu-dominio.com).hotmart-webhookProcesa los eventos de pago de Hotmart.Debe ser robusto para registrar suscripciones y cancelaciones.track-analyticsRegistra los scans del QR y las interacciones.Debe registrar la fecha, hora y origen del escaneo.send-complaint-notificationEnvía la queja capturada al comerciante (por Email o WhatsApp).Debe funcionar correctamente.

5. ✅ Soluciones Integradas (Evitando Errores Pasados)Cualquier agente debe implementar las siguientes correcciones desde el inicio:Corrección de QR URL: La función generate-qr-code DEBE usar una variable de entorno o una constante para definir la URL base de la aplicación, evitando placeholders incorrectos.Corrección de Pegado (Paste): En los formularios del frontend (ej: BusinessSetupPage), los campos de texto (type="url", type="email", type="tel") que usan validaciones HTML5 estrictas deben ser reemplazados por componentes personalizados (type="text") para garantizar que el usuario pueda pegar contenido sin ser bloqueado.CORS: Asegurar que todas las Edge Functions de Supabase incluyan las cabeceras CORS correctas (como en el ejemplo de Deno inicial) para permitir llamadas seguras desde el frontend...... como extra te dare una conversacion anterior donde hay mas informacion que nesesites https://agent.minimax.io/share/331398161862823?chat_type=0 y luego corregi erroresen esta conversacion https://agent.minimax.io/share/332032698818750?chat_type=0 junta toda la informacion y dame el codigo fuente de todo el proyecto finalizado y sin errores
Thinking Process
1.58s
-->