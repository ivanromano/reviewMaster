
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  items: NavigationMenuItem[][]
}>()

</script>
<template>
  <div class="flex min-h-screen">
    <div>
      <UNavigationMenu
        orientation="vertical"
        content-orientation="vertical"
        :items="items"
        highlight-color="primary"
        class="data-[orientation=vertical]:border-b border-default data-[orientation=vertical]:w-48 "
      />
    </div>

    <div class="flex-1 p-6 overflow-auto">
      <slot />
    </div>
  </div>
</template>