<script setup lang="ts">
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()

const mapsUrl: string = 'https://www.google.com/maps/place/YPF/@-34.9261808,-58.3831004,15z/data=!4m8!3m7!1s0x95bd2b872ee85c0b:0xbb5b94433ba3c833!8m2!3d-34.9238323!4d-58.3809096!9m1!1b1!16s%2Fg%2F11h75ktn1g?entry=ttu&g_ep=EgoyMDI1MTEwOS4wIKXMDSoASAFQAw%3D%3D'

const reviews = ref<any[]>([])
const err = ref<string | null>(null)
const loading = ref<boolean>(false)

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal, ...options })
    clearTimeout(id)
    return res
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

async function fetchReviews(): Promise<void> {
  err.value = null
  loading.value = true
  try {
    const bodyPayload = { mapsUrl }

    const res = await fetchWithTimeout("http://127.0.0.1:8000/contact/reviews", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload)
    }, 8000)

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      let parsed: any = null
      try { parsed = txt ? JSON.parse(txt) : null } catch { parsed = null }
      err.value = parsed?.error ?? parsed?.message ?? `HTTP ${res.status}`
      return
    }

    const data = await res.json()
    if (data.error) {
      err.value = data.error + (data.detail ? `: ${data.detail}` : '')
      return
    }

    reviews.value = data.reviews ?? []
  } catch (e: any) {
    if (e.name === 'AbortError') err.value = 'Timeout al contactar el servidor'
    else err.value = e?.message ?? String(e)
    console.error('fetchReviews error', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.clear()
  fetchReviews()
})
</script>

<template>
  <div>
    <div v-if="loading">Cargando reseñas…</div>
    <div v-if="err" class="error">Error: {{ err }}</div>
    <ul v-else>
      <li v-for="r in reviews" :key="r.time">
        <strong>{{ r.author_name }}</strong>: {{ r.text }}
      </li>
    </ul>
  </div>
</template>
