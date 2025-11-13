<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const mapsUrl = 'https://www.google.com/maps/place/YPF/@-34.9261808,-58.3831004,15z/data=!4m8!3m7!1s0x95bd2b872ee85c0b:0xbb5b94433ba3c833!8m2!3d-34.9238323!4d-58.3809096!9m1!1b1!16s%2Fg%2F11h75ktn1g?entry=ttu&g_ep=EgoyMDI1MTEwOS4wIKXMDSoASAFQAw%3D%3D'

const reviews = ref<any[]>([])
const err = ref<string | null>(null)

const placeId = 'ChIJM0fnz_Dh0pURBz6K7vlB4Xo'

async function fetchReviews(): Promise<void> {
  try {

    const supabase = createClient(
      config.public.SUPABASE_URL,
      config.public.SUPABASE_SERVICE_ROLE_KEY
    )

    console.log("start");
    
    // invoke devuelve un Response-like; pasar body como string evita headers raros
const res = await useSupabaseClient().functions.invoke('get-reviews', {
  method: 'POST',
  body: mapsUrl,           // string plano
  headers: { 'Content-Type': 'text/plain' } // simple -> NO preflight
})


    console.log("star222");
    // seguro para distintas versiones: intentamos parsear
    let text: string
    
    try {

      text = await res.text()
    } catch {
      // algunas versiones devuelven un objeto con .data
      if ((res as any).data) {
        const d = (res as any).data
        if (typeof d === 'string') text = d
        else {
          if (d.error) throw new Error(d.error)
          reviews.value = d.reviews || []
          return
        }
      } else {
        throw new Error('Respuesta inesperada de invoke')
      }
    }

    const data = text ? JSON.parse(text) : {}
    if (data.error) {
      err.value = data.error
      return
    }
    reviews.value = data.reviews || []
  } catch (e:any) {
    err.value = e?.message || String(e)
    console.log('fetchReviews error', e)
  }
}

onMounted(async () => {
  console.clear()
  await fetchReviews()
})
</script>

<template>
    neh
  <div>
    <div v-if="err">Error: {{ err }}</div>
    <ul v-else>
      <li v-for="r in reviews" :key="r.time">
        <strong>{{ r.author_name }}</strong>: {{ r.text }}
      </li>
    </ul>
  </div>
</template>

<!-- 
en el supabase invocatios obtuve este error: 
{
  "event_message": "OPTIONS | 504 | https://xidkrvunseheiannjrqp.supabase.co/functions/v1/get-reviews",
  "id": "90167729-0caa-4af7-9ab1-6867cef32f1a",
  "metadata": [
    {
      "deployment_id": "xidkrvunseheiannjrqp_5af6ca13-430f-4fda-aee0-23b2460790db_6",
      "execution_id": "ab40fada-8fbe-4e83-b076-4446d46e5d79",
      "execution_time_ms": 150415,
      "function_id": "5af6ca13-430f-4fda-aee0-23b2460790db",
      "project_ref": "xidkrvunseheiannjrqp",
      "request": [
        {
          "headers": [
            {
              "accept": "*/*",
              "accept_encoding": "gzip, br",
              "connection": "Keep-Alive",
              "content_length": null,
              "cookie": null,
              "host": "xidkrvunseheiannjrqp.supabase.co",
              "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
              "x_client_info": null
            }
          ],
          "host": "xidkrvunseheiannjrqp.supabase.co",
          "method": "OPTIONS",
          "pathname": "/functions/v1/get-reviews",
          "port": null,
          "protocol": "https:",
          "sb": [],
          "search": null,
          "url": "https://xidkrvunseheiannjrqp.supabase.co/functions/v1/get-reviews"
        }
      ],
      "response": [
        {
          "headers": [
            {
              "content_length": "0",
              "content_type": null,
              "date": "Thu, 13 Nov 2025 21:11:29 GMT",
              "sb_request_id": "019a7f0c-d55e-7810-84c4-674a0c766e2c",
              "server": "cloudflare",
              "vary": "Accept-Encoding",
              "x_envoy_upstream_service_time": null,
              "x_sb_compute_multiplier": null,
              "x_sb_edge_region": "sa-east-1",
              "x_sb_resource_multiplier": null,
              "x_served_by": "supabase-edge-runtime"
            }
          ],
          "status_code": 504
        }
      ],
      "version": "6"
    }
  ],
  "timestamp": 1763068289261000
}


en el supabase/functions/get-reviews/index.ts
export default async function handler(req) {
  const CORS = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type'
  };
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS
    });
  }
  try {
    const mapsUrl = await req.text() || '';
    let placeId = '';
    const apiKey = Deno.env.get('GOOGLE_API_KEY') || Deno.env.get('googleApiKey') || Deno.env.get('GOOGLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'Falta GOOGLE_API_KEY en secrets'
      }), {
        status: 500,
        headers: CORS
      });
    }
    const pidMatch = mapsUrl.match(/place_id:([A-Za-z0-9_-]+)/);
    if (pidMatch) {
      placeId = pidMatch[1];
    } else {
      const atMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        const lat = atMatch[1];
        const lng = atMatch[2];
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(()=>ctrl.abort(), 10000);
          const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${apiKey}`;
          const r = await fetch(nearbyUrl, {
            signal: ctrl.signal
          });
          clearTimeout(timer);
          const json = await r.json();
          placeId = json?.results?.[0]?.place_id || '';
        } catch (err) {
          return new Response(JSON.stringify({
            error: 'Nearby search timeout o error',
            detail: String(err)
          }), {
            status: 502,
            headers: CORS
          });
        }
      }
    }
    if (!placeId) {
      return new Response(JSON.stringify({
        error: 'No se pudo obtener place_id'
      }), {
        status: 400,
        headers: CORS
      });
    }
    const fields = 'name,rating,reviews';
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&key=${apiKey}`;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(()=>ctrl.abort(), 10000);
      const r = await fetch(detailsUrl, {
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const json = await r.json();
      if (json.status && json.status !== 'OK') {
        return new Response(JSON.stringify({
          error: 'Google Places API',
          status: json.status,
          message: json.error_message
        }), {
          status: 502,
          headers: CORS
        });
      }
      return new Response(JSON.stringify({
        place: json.result,
        reviews: json.result?.reviews || []
      }), {
        status: 200,
        headers: CORS
      });
    } catch (err) {
      return new Response(JSON.stringify({
        error: 'Place Details timeout o error',
        detail: String(err)
      }), {
        status: 502,
        headers: CORS
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      error: String(err)
    }), {
      status: 500,
      headers: CORS
    });
  }
}



-->