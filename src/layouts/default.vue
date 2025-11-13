<template>
  <ToastProvider>
  <!-- <CustomCursor /> -->

  <!-- <Sidebar /> -->
    <div class="">
      <UApp>
        <slot />
      </UApp>

    </div>
  </ToastProvider>
</template>

<script lang="ts" setup>
import { ToastProvider } from 'reka-ui'


useHead({
    titleTemplate: '%s - Volt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { hid: 'description', name: 'description' }
    ],
    link: [{ rel: 'icon', type: 'image/png', href: 'https://i.imgur.com/mgUFI05.png' },
      
    ],
    script: [
        {
            src: "https://cdn.jsdelivr.net/npm/alpinejs@2.8.2",
        }
    ],

})
</script>

