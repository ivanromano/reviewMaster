<template>
  <div class="bg-white md:rounded-lg shadow-md shadow-cyan-800/50 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ mainText }}
    </h3>
    
    <!-- Contenedor de la lista animada -->
    <div class="relative h-80 md:h-96 overflow-hidden">
      <transition-group
        name="comment-list"
        tag="div"
        class="absolute inset-0"
      >
        <div
          v-for="comment in displayedReviews"
          :key="comment.id"
          class="absolute w-full p-4 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 comment-item"
          :style="{ 
            top: `${comment.position * 110}px`,
            zIndex: 10 - comment.position
          }"
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
              {{ comment.name }} • {{ getDate(comment.date) }}
            </span>
          </div>
          <p class="text-gray-700 text-sm md:text-base">{{ comment.text }}</p>
        </div>
      </transition-group>
    </div>
    

  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  reviews: {
    type: Array,
    default: () => []
  }
})

const mainText = ref("Lo que dicen nuestros clientes:")
const currentIndex = ref(0)
const isPaused = ref(false)
const interval = ref(4000) // 4 segundos
const displayCount = ref(3) // Número de comentarios visibles a la vez
let rotationTimer: NodeJS.Timeout | null = null

// Preparamos las reviews para mostrar con posición
const displayedReviews = computed(() => {
  if (!props.reviews || props.reviews.length === 0) return []
  
  const result = []
  
  // Tomamos los próximos N comentarios para mostrar
  for (let i = 0; i < Math.min(displayCount.value, props.reviews.length); i++) {
    const reviewIndex = (currentIndex.value + i) % props.reviews.length
    result.push({
      ...props.reviews[reviewIndex],
      position: i, // 0: más abajo (nuevo), 2: más arriba (próximo a salir)
      isActive: i === 0 // El de abajo es el "activo" o nuevo
    })
  }
  
  return result
})



// Función para avanzar al siguiente comentario
const nextComment = () => {
  if (!props.reviews || props.reviews.length === 0) return
  
  // Animación de salida para el comentario superior
  const topComment = document.querySelector('.comment-item:nth-child(1)')
  if (topComment) {
    topComment.classList.add('exiting')
  }
  
  // Esperar un poco para la animación y luego avanzar
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % props.reviews.length
  }, 300)
}

// Pausar/reanudar rotación
const pauseRotation = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    stopRotation()
  } else {
    startRotation()
  }
}

// Control de rotación automática
const startRotation = () => {
  if (rotationTimer) clearInterval(rotationTimer)
  
  if (props.reviews && props.reviews.length > displayCount.value && !isPaused.value) {
    rotationTimer = setInterval(nextComment, interval.value)
  }
}

const stopRotation = () => {
  if (rotationTimer) {
    clearInterval(rotationTimer)
    rotationTimer = null
  }
}

// Iniciar rotación al montar
onMounted(async() => {
  mainText.value = await tr(mainText.value)

  if (props.reviews && props.reviews.length > displayCount.value) {
    startRotation()
  }
})

// Limpiar al desmontar
onUnmounted(() => {
  stopRotation()
})

// Reiniciar rotación si cambian las reviews
watch(() => props.reviews, () => {
  if (props.reviews && props.reviews.length > displayCount.value && !isPaused.value) {
    startRotation()
  } else {
    stopRotation()
  }
})
</script>

<style scoped>
/* Animaciones para la lista */
.comment-list-enter-active,
.comment-list-leave-active {
  transition: all 0.5s ease;
}

.comment-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.comment-list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.comment-list-leave-active {
  position: absolute;
  width: 100%;
}

/* Animación personalizada para el efecto de cola */
.comment-item {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Cuando un comentario está "saliendo" */
.comment-item.exiting {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

/* Efecto de gradiente para los comentarios según posición */
.comment-item:nth-child(1) {
  opacity: 0.9;
  filter: brightness(0.95);
}

.comment-item:nth-child(2) {
  opacity: 1;
}

.comment-item:nth-child(3) {
  opacity: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animación sutil de flotación para el comentario activo */
@keyframes subtleFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.comment-item:nth-child(3) {
  animation: subtleFloat 3s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .h-80 {
    height: 280px;
  }
  
  .comment-item {
    font-size: 0.9rem;
  }
}
</style>