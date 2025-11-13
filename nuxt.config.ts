// https://nuxt.com/docs/api/configuration/nuxt-config
import nitroPublic from "nitro-public-module";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  modules: [
    // '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@pinia/nuxt',
    // 'nuxt-auth-utils',
    'v-gsap-nuxt',
  ],

  nitro: {
    modules: [nitroPublic()],
    static: true,
    preset: 'vercel'
  },

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    redirectOptions : {
      login: '/login',
      callback: '/confirm',
      exclude : [
        '/**',
     ]  
  }
  },
  srcDir: 'src',
  css: ['~/assets/css/main.css'],
  runtimeConfig: {

    public: {
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      googleApiKey: process.env.GOOGLE_API_KEY,

      // API: 'http://localhost:8000/', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      // API: 'https://victishipsis.onrender.com/', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    },
    // grecaptcha: {
    //   hideBadge: true,
    //   mode: "base",
    //   siteKey: "",
    //   version: 3,
    // },
  },

  imports: {
    dirs: ["store", "composables", "constants", "components"],
  },

  routeRules: {
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/admin/**': { ssr: false },
  },

  vite: {
    esbuild: {
      drop: ['debugger'],
      // pure: ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace'],
    },
  },
  vgsap: { extraPlugins: ['ScrollTrigger'], clubPlugins: [], autoprefixer: true }


  
})