<template>
  <!-- Button to open modal -->
  <button @click="openModal(true)">
    <slot name="btn"></slot>
  </button>

  <!-- Teleport: Move modal to body -->
  <Teleport to="body">
    <!-- Overlay -->
    <div v-show="isModalOpen" id="modal_overlay" class="cursor-default fixed inset-0 bg-black/40 flex justify-center items-start md:items-center pt-10 md:pt-0 z-50">
      
      <!-- Modal -->
      <div id="modal" :class="modalClasses" class="text-gray-100  relative w-[70%] md:w-[90%]  md:max-h-[90%] !block !visible rounded shadow-lg transition-transform duration-300 overflow-y-auto">

        <!-- Close button -->
        <button 
          @click="openModal(false)"
          class="absolute -top-[-4px] -right-[-9px] bg-red-500 hover:bg-red-600 text-2xl w-10 h-10 rounded-full focus:outline-none text-black">
          &cross;
        </button>

        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200">
          <h2 class="text-xl font-semibold">{{ props.title }}</h2>
        </div>

        <!-- Body -->
        <div class="w-full p-3">
          <slot name="body"></slot>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 w-full flex justify-end items-center gap-3">
          <button @click="save" :class="`${props.showSave ? `` : `hidden`}`" class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white focus:outline-none">Save</button>
          <button 
            @click="openModal(false)"
            class="bg-red-500 hover:bg-red-400 px-4 py-2 rounded text-white focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: `title`,
  },
  bg: {
    type: String,
    default: `bg-gray-700`,
  },
  showSave: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(["save"])

function save() {
  emit("save")
}

const isModalOpen = ref(false)

const modalClasses = ref('opacity-0 transform -translate-y-full scale-150')

function openModal(value) {
  if (value) {
    isModalOpen.value = true
    setTimeout(() => {
      modalClasses.value = `${props.bg}`
    }, 100)
  } else {
    modalClasses.value = '-translate-y-full opacity-0 scale-150'
    setTimeout(() => {
      isModalOpen.value = false
    }, 300)
  }
}

defineExpose({
  openModal
});
</script>

<style scoped>
</style>

