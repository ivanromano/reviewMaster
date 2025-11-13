<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
    <div
      v-for="(service, index) in servicesWithStats"
      :key="index"
      :ref="el => { if (el && (el as HTMLElement).getBoundingClientRect) cardRefs[index] = el as HTMLElement }"
    >
      <UCard
        class="hover:shadow-xl transition-all my-8 max-w-[18rem] mx-auto"
        :ui="{ body: 'flex-1', footer: 'mt-auto' }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon :name="service.icon" class="text-2xl" :class="`text-${service.color}-500`" />
            <h3 class="text-xl font-bold">{{ service.title }}</h3>
          </div>
        </template>

        <p class="text-gray-600 mb-4">{{ service.description }}</p>

        <div class="space-y-4 mt-4">
          <div v-for="(stat, statIndex) in Object.values(service.stats)" :key="statIndex">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ stat.label }}</span>
              <span :class="`text-${service.color}-500 font-medium`">{{ stat.value }}%</span>
            </div>
            <UProgress :model-value="currentValues[index]?.[statIndex] || 0" :color="service.color" size="sm" />
            <p
              v-if="stat.value > 100 && currentValues[index]?.[statIndex] === 100"
              class="text-xs text-gray-400 mt-1"
            >
              +{{ stat.value - 100 }}% sobre la meta
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between mt-6">
            <div>
              <span class="text-2xl font-bold">{{ service.price }}</span>
              <span class="text-gray-400 text-sm">/mensual</span>
            </div>
            <UButton :color="service.color" variant="solid" label="Contratar" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const props = defineProps({
  servicesWithStats: Object,
});
const normalizeProgressValue = (value: number): number => Math.min(value, 100)

const servicesWithStats = ref<Service[]>(props.servicesWithStats as Service[])

const currentValues = ref<number[][]>([])
const hasAnimated = ref<boolean[][]>([])
const cardRefs = ref<(HTMLElement | null)[]>([])

servicesWithStats.value.forEach((service, i) => {
  const statsCount = Object.values(service.stats).length
  currentValues.value[i] = Array(statsCount).fill(0)
  hasAnimated.value[i] = Array(statsCount).fill(false)
  cardRefs.value[i] = null
})

let observer: IntersectionObserver | null = null

const animateValue = (cardIndex: number, statIndex: number, target: number) => {
  const duration = 3000
  const start = currentValues.value[cardIndex][statIndex]
  const change = target - start
  const startTime = performance.now()
  hasAnimated.value[cardIndex][statIndex] = true

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const fraction = Math.min(elapsed / duration, 1)
    currentValues.value[cardIndex][statIndex] = Math.round(start + change * fraction)
    if (fraction < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

const handleScroll = () => {
  if (!observer) return
  cardRefs.value.forEach((card, index) => {
    if (!card) return
    const rect = card.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0

    Object.values(servicesWithStats.value[index].stats).forEach((stat, statIndex) => {
      if (isVisible) {
        if (!hasAnimated.value[index][statIndex]) {
          animateValue(index, statIndex, normalizeProgressValue(stat.value))
        }
      } else {
        currentValues.value[index][statIndex] = 0
        hasAnimated.value[index][statIndex] = false
      }
    })
  })
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const target = entry.target as HTMLElement
      const idx = cardRefs.value.findIndex(r => r === target)
      if (idx === -1) return

      Object.values(servicesWithStats.value[idx].stats).forEach((stat, statIndex) => {
        if (entry.isIntersecting) {
          if (!hasAnimated.value[idx][statIndex]) {
            animateValue(idx, statIndex, normalizeProgressValue(stat.value))
          }
        } else {
          currentValues.value[idx][statIndex] = 0
          hasAnimated.value[idx][statIndex] = false
        }
      })
    })
  }, { threshold: 0.1 })

  cardRefs.value.forEach(card => {
    if (card) observer?.observe(card)
  })
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', handleScroll)
})
</script>
