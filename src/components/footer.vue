<template>
  <footer class="w-full bg-amber-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="py-10 flex justify-between items-center flex-col gap-8 xl:flex-row">
        <div class="flex items-center flex-col xl:flex-row">
          <a href="https://x.com/home" class="flex justify-center mb-8 xl:mb-0">
            <img src="../assets/icon.png" class="w-40 h-40"/>
          </a>
          <ul class="text-lg flex items-center flex-col md:flex-row py-8 gap-6 md:gap-12 xl:border-l border-gray-200 xl:ml-11 xl:pl-11">
            <li v-for="link in links" :key="link.text">
              <a :href="link.href" class="text-gray-800 hover:text-indigo-600">{{ link.text }}</a>
            </li>
          </ul>
        </div>
        <div class="flex space-x-4">
          <a v-for="social in socials" :key="social.name" :href="social.href" 
             class="group w-9 h-9 rounded-full border border-gray-300 flex justify-center items-center hover:border-indigo-600">
            <!-- <component :is="social.icon" class="text-gray-700 group-hover:text-indigo-600" /> -->
             <Icon  :name="social.icon"/>
          </a>
        </div>
      </div>
      <div class="py-7 border-t border-gray-200">
        <div class="flex items-center justify-center">
          <span class="text-gray-400">©<a href="https://x.com/home">Volt</a> 2024, All rights reserved.</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

const links = [
  // { text: 'Pagedone', href: '#' },
  // { text: 'Products', href: '#' },
  // { text: 'Resources', href: '#' },
  // { text: 'Blog', href: '#' },
  // { text: 'Support', href: '#' }
]

const socials = [
  { name: 'Github', href: 'https://github.com/ivanromano', icon: "pajamas:github" },
  { name: 'Twitter', href: 'https://x.com/home', icon: "skill-icons:twitter" },
  { name: 'Steam', href: 'https://store.steampowered.com/app/3798630/Bereshipsis/', icon: "simple-icons:steam" },
  { name: 'YouTube', href: 'https://www.youtube.com/@republicavictinera', icon: "logos:youtube-icon" }
]
</script>