<template>
    <div class="bg-white md:rounded-lg shadow-lg shadow-cyan-100 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Lo que dicen nuestros clientes:
    </h3>
    <div class="md:space-y-4">
        <div
        v-for="comment in reviews"
        :key="comment.id"
        class="border-b border-gray-200 pb-4 last:border-b-0"
        >
        <div class="flex items-center mb-2">
            <div class="flex">
            <Icon
                v-for="i in comment.rating"
                :key="i"
                name="heroicons:star-20-solid"
                class="h-4 w-4 text-yellow-400"
            />
            </div>
            <span class="ml-2 text-sm text-gray-500">
            {{ comment.name }} • {{ getDate(comment.date) }}
            </span>
        </div>
        <p class="text-gray-700">{{ comment.text }}</p>
        </div>
    </div>
    </div>

</template>

<script lang="ts" setup>
const props = defineProps({
  reviews: {
    type: Array as PropType<Review[]>,
  },
});


</script>