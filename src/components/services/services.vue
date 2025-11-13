<template>
  <div class="bg-blue-500 w-full py-16 px-4 md:px-8">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="(service, index) in services" 
        :key="index"
        class="group relative overflow-hidden rounded-lg shadow-lg"
        :style="`transform: translateY(${yPosition}px)`"
      >
        <!-- Frente de la tarjeta -->
        <div class="front bg-white p-6 h-48 flex flex-col justify-center transition-all duration-300 group-hover:opacity-0 group-hover:h-0">
          <h3 class="text-xl font-bold text-blue-700 mb-2">{{ service.title }}</h3>
          <p class="text-gray-600">{{ service.description }}</p>
        </div>
        
        <!-- Reverso de la tarjeta -->
        <div class="back bg-blue-700 text-white p-6 h-48 flex flex-col justify-center absolute inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-full">
          <h3 class="text-xl font-bold mb-2">{{ service.backTitle }}</h3>
          <p>{{ service.backDescription }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  services: Object,
});
const yPosition = ref(0)

</script>

<style>

</style>