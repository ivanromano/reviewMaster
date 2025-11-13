<template>
  <section
    v-gsap.timeline.pinned="{
      start: 'top top',
      end: '+=3000',
      scrub: true
    }"
    class="relative h-screen bg-gray-900 overflow-hidden"
  >
    <div class="absolute inset-0 flex items-center justify-center px-4">
      <p
        v-gsap.add.from="{ opacity: 0, y: 50 }"
        v-gsap.add.to="{ opacity: 0, y: -50 }"
        v-gsap.add.at="0"
        class="absolute text-4xl md:text-6xl font-bold text-white text-center"
      >
        Buscas mejorar tu pagina web?
      </p>

      <p
        v-gsap.add.from="{ opacity: 0, y: 50 }"
        v-gsap.add.to="{ opacity: 0, y: -50 }"
        v-gsap.add.at="1"
        class="absolute text-4xl md:text-6xl font-bold text-indigo-300 text-center"
      >
        Buscas atraer más clientes?
      </p>

      <p
        v-gsap.add.from="{ opacity: 0, y: 50 }"
        v-gsap.add.to="{ opacity: 0, y: -50 }"
        v-gsap.add.at="2"
        class="absolute text-4xl md:text-6xl font-bold text-purple-300 text-center"
      >
        Tenemos todo lo que necesitas!
      </p>
    </div>

    <div class="h-[300vh]"></div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
section::before {
  content: '';
  position: absolute;
  top: -30%;
  left: -30%;
  width: 160%;
  height: 160%;
  background: conic-gradient(from 0deg, #5b21b6, #4f46e5, #3b82f6, #5b21b6);
  animation: rotate-bg 20s linear infinite;
  z-index: 0;
}

@keyframes rotate-bg {
  to { transform: rotate(360deg); }
}

div.absolute > p {
  position: relative;
  z-index: 1;
}
</style>
