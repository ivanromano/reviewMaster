<template>
    <div class="space-y-6 max-w-xl animate-fade-in-up">
      <h1 class="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-300 tracking-tight">
        ¿Aún no nos conocemos?
      </h1>
      <p class="text-base md:text-lg text-gray-600 dark:text-gray-300">
        Registrate aquí
      </p>
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        class="transition-all duration-300 hover:scale-105"
        icon="i-heroicons-arrow-right-on-rectangle"
      >
        <NuxtLink to="/register" class="flex items-center justify-center gap-2">
          Registrarse
        </NuxtLink>
      </UButton>
    </div>

    <div class="space-y-6 max-w-xl animate-fade-in-up">
      <h1 class="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-300 tracking-tight">
        ¿Ya tenés una cuenta?
      </h1>
      <p class="text-base md:text-lg text-gray-600 dark:text-gray-300">
        Iniciá sesión aquí
      </p>
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        class="transition-all duration-300 hover:scale-105"
        icon="i-heroicons-arrow-right-on-rectangle"
      >
        <NuxtLink to="/login" class="flex items-center justify-center gap-2">
          Iniciar sesión
        </NuxtLink>
      </UButton>
    </div>    
</template>

<script lang="ts" setup>

</script>

<style>

</style>