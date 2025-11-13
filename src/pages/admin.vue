<template>
  <Sidebar :items="items">
    <NuxtPage/>
  </Sidebar>
    
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
definePageMeta({
    middleware: "admin-protect"
})

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Home',
      icon: 'material-symbols:home-work-rounded',
      to: '/admin',
    },
    {
      label: 'users',
      icon: 'material-symbols:manage-accounts',
      children: [
        {
          label: 'Edit Users',
          icon: 'material-symbols:person-edit',
          description: 'Define shortcuts for your application.',
          to: '/admin/users'
        },
      ]
    },

  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      badge: '0k',
      to: 'https://github.com/ivanromano/factory',
      target: '_blank'
    },
  ]
])











useHead({
    title: 'Admin Dashboard'
    })
</script>

<style>

</style>