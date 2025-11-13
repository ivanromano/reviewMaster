export async function handler(req) {
  try {
    const config = useRuntimeConfig();
    const body = await req.json().catch(()=>({}));
    const apiKey = config.public.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'Falta GOOGLE_API_KEY en secrets'
      }), {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    let placeId = body.placeId;
    // Intento simple de extraer place_id desde mapsUrl si no viene placeId
    if (!placeId && body.mapsUrl) {
      const url = body.mapsUrl;
      const pidMatch = url.match(/place_id:([A-Za-z0-9_-]+)/);
      if (pidMatch) placeId = pidMatch[1];
      else {
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) {
          const lat = atMatch[1], lng = atMatch[2];
          const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${apiKey}`;
          const nearbyRes = await fetch(nearbyUrl);
          const nearbyJson = await nearbyRes.json();
          placeId = nearbyJson?.results?.[0]?.place_id;
        }
      }
    }
    if (!placeId) {
      return new Response(JSON.stringify({
        error: 'No se pudo obtener place_id'
      }), {
        status: 400,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    const fields = 'name,rating,reviews';
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsJson = await detailsRes.json();
    if (detailsJson.status && detailsJson.status !== 'OK') {
      return new Response(JSON.stringify({
        error: 'Google Places API',
        status: detailsJson.status,
        message: detailsJson.error_message
      }), {
        status: 502,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    const result = {
      place: detailsJson.result,
      reviews: detailsJson.result?.reviews ?? []
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // controla CORS según necesites; en producción limita el origen
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: String(err)
    }), {
      status: 500,
      headers: {
        'content-type': 'application/json'
      }
    });
  }
}


/* 
esta es la edge function llamada get-reviews
export async function handler(req) {
  try {
    const body = await req.json().catch(()=>({}));
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'Falta GOOGLE_API_KEY en secrets'
      }), {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    let placeId = body.placeId;
    // Intento simple de extraer place_id desde mapsUrl si no viene placeId
    if (!placeId && body.mapsUrl) {
      const url = body.mapsUrl;
      const pidMatch = url.match(/place_id:([A-Za-z0-9_-]+)/);
      if (pidMatch) placeId = pidMatch[1];
      else {
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) {
          const lat = atMatch[1], lng = atMatch[2];
          const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${apiKey}`;
          const nearbyRes = await fetch(nearbyUrl);
          const nearbyJson = await nearbyRes.json();
          placeId = nearbyJson?.results?.[0]?.place_id;
        }
      }
    }
    if (!placeId) {
      return new Response(JSON.stringify({
        error: 'No se pudo obtener place_id'
      }), {
        status: 400,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    const fields = 'name,rating,reviews';
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsJson = await detailsRes.json();
    if (detailsJson.status && detailsJson.status !== 'OK') {
      return new Response(JSON.stringify({
        error: 'Google Places API',
        status: detailsJson.status,
        message: detailsJson.error_message
      }), {
        status: 502,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    const result = {
      place: detailsJson.result,
      reviews: detailsJson.result?.reviews ?? []
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // controla CORS según necesites; en producción limita el origen
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: String(err)
    }), {
      status: 500,
      headers: {
        'content-type': 'application/json'
      }
    });
  }
}



en la seccion de "invocations" el ultimo me dio este raw:
{
  "event_message": "OPTIONS | 504 | https://xidkrvunseheiannjrqp.supabase.co/functions/v1/get-reviews",
  "id": "d489562a-2e22-41c9-89f1-b20063cc5a0d",
  "metadata": [
    {
      "deployment_id": "xidkrvunseheiannjrqp_5af6ca13-430f-4fda-aee0-23b2460790db_1",
      "execution_id": "59735687-533f-4aff-a32f-c40a1c7a2aee",
      "execution_time_ms": 150324,
      "function_id": "5af6ca13-430f-4fda-aee0-23b2460790db",
      "project_ref": "xidkrvunseheiannjrqp",
      "request": [
        {
          "headers": [
            {
              "accept": "*",
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
              "date": "Wed, 12 Nov 2025 23:32:42 GMT",
              "sb_request_id": "019a7a67-c307-7f6a-ba37-5b4d24b7ca46",
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
      "version": "1"
    }
  ],
  "timestamp": 1762990362171000
}




este es mi codigo nuxt
<script setup lang="ts">
const config = useRuntimeConfig()
const mapsUrl = 'https://www.google.com/maps/place/YPF/@-34.9261808,-58.3831004,15z/data=!4m8!3m7!1s0x95bd2b872ee85c0b:0xbb5b94433ba3c833!8m2!3d-34.9238323!4d-58.3809096!9m1!1b1!16s%2Fg%2F11h75ktn1g?entry=ttu&g_ep=EgoyMDI1MTEwOS4wIKXMDSoASAFQAw%3D%3D'

const reviews = ref<any[]>([])
const err = ref<string | null>(null)

const placeId = 'ChIJM0fnz_Dh0pURBz6K7vlB4Xo'

async function fetchReviews() {
  try {
    const res = await useSupabaseClient().functions.invoke('get-reviews', {
      body: JSON.stringify({ mapsUrl })
    })

    console.clear()
    console.log("rew ", res.data)
    let data: any
    try { data = await res.json() } catch { data = res }
    if (data.error) {
      err.value = data.error
      return
    }
    reviews.value = data.reviews || []
  } catch (e:any) {
    err.value = e.message || String(e)
    console.error(e)
  }
}

onMounted(fetchReviews)

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



*/