<!-- 
Error: Nearby search returned zero results
-->

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

<!-- 
en django views.py tengo: 
def _extract_place_id_from_maps_url(url: str):
    m = re.search(r"place_id:([A-Za-z0-9_-]+)", url)
    if m:
        return m.group(1)
    m2 = re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", url)
    if m2:
        lat, lng = m2.group(1), m2.group(2)
        return f"__NEEDS_NEARBY__::{lat}::{lng}"
    return None

def _cors_response(data, status_code=200):
    resp = Response(data, status=status_code)
    resp["Access-Control-Allow-Origin"] = "*"
    resp["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp["Access-Control-Allow-Headers"] = "Content-Type"
    return resp

class GetReviewsView(APIView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ["post", "options"]

    def options(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        return _cors_response({}, status_code=204)

    def post(self, request: HttpRequest, format=None) -> Response:
        if not GOOGLE_API_KEY:
            return _cors_response({"error": "Falta GOOGLE_API_KEY en el servidor"}, status_code=500)

        payload = request.data or {}
        place_id = payload.get("placeId")
        maps_url = payload.get("mapsUrl")

        if not place_id and maps_url:
            extracted = _extract_place_id_from_maps_url(maps_url)
            if extracted:
                if extracted.startswith("__NEEDS_NEARBY__::"):
                    _, lat, lng = extracted.split("::")
                    nearby_url = (
                        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                        f"?location={lat},{lng}&radius=50&key={GOOGLE_API_KEY}"
                    )
                    try:
                        r = requests.get(nearby_url, timeout=10)
                        r.raise_for_status()
                        nearby_json = r.json()
                        results = nearby_json.get("results") or []
                        if len(results) == 0:
                            # intenta con mayor radio antes de fallar
                            r2 = requests.get(
                                f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=200&key={GOOGLE_API_KEY}",
                                timeout=10
                            )
                            r2.raise_for_status()
                            nearby_json2 = r2.json()
                            results2 = nearby_json2.get("results") or []
                            if len(results2) == 0:
                                return _cors_response({
                                    "error": "Nearby search returned zero results",
                                    "detail": f"No nearby places found at {lat},{lng}"
                                }, status_code=404)
                            place_id = results2[0].get("place_id")
                        else:
                            place_id = results[0].get("place_id")

                        if not place_id:
                            return _cors_response({
                                "error": "Nearby search returned results without place_id",
                                "detail": nearby_json
                            }, status_code=502)
                    except requests.RequestException as e:
                        return _cors_response({"error": "Nearby search error", "detail": str(e)}, status_code=502)
                else:
                    place_id = extracted

        if not place_id:
            return _cors_response({"error": "No se pudo obtener place_id"}, status_code=400)

        details_url = (
            "https://maps.googleapis.com/maps/api/place/details/json"
            f"?place_id={place_id}&fields=name,rating,reviews&key={GOOGLE_API_KEY}"
        )
        try:
            resp = requests.get(details_url, timeout=10)
            resp.raise_for_status()
            details_json = resp.json()
        except requests.RequestException as e:
            return _cors_response({"error": "Place Details request failed", "detail": str(e)}, status_code=502)

        if details_json.get("status") and details_json.get("status") != "OK":
            return _cors_response({
                "error": "Google Places API",
                "status": details_json.get("status"),
                "message": details_json.get("error_message")
            }, status_code=502)

        result = {
            "place": details_json.get("result", {}),
            "reviews": details_json.get("result", {}).get("reviews", [])
        }
        return _cors_response(result, status_code=200)
-->