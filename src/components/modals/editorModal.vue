<template>
<ModalsModal @save="changeItem" :title="`Edit ${Object.keys(item).length ? 'Item' : 'N/A'}`">
  <template v-slot:btn>
    <button class="bg-amber-400 rounded-full py-2 px-3">
      <p>Edit</p>
    </button>
  </template>

  <template v-slot:body>
    <form @submit.prevent="changeItem" class="flex flex-col justify-center gap-2 my-2">
      <!-- Recorrer los valores del objeto actual -->
      <div v-for="(value, key) in item" :key="key" class="flex flex-col">
        <label class="block mb-1 text-sm" :for="key">Edit the {{ key }}</label>

        <!-- obtuve esto en el html
         
        content [ "content", "description" ] -->
        <!-- {{ key  }} {{ textareas }} -->
        <!-- Mostrar un select si el valor es un objeto -->
        <select v-if="typeof value === 'object' && !Array.isArray(value) " v-model="editedItem[key]" class="w-full border py-2 text-black rounded focus:border focus:border-blue-500 focus:shadow-outline outline-none">
          <option v-for="option in allItems" :key="option.id" :value="option" class="text-black">{{ option.hasOwnProperty('name') ? option.name : option.title }}</option>
        </select>
        
        <div v-else-if="textareas.includes(key)"  class="bg-white p-1 rounded-lg">
          <textarea 
          :title="value"
          v-model.trim="editedItem[key]"
          :id="key"
          :placeholder="`Edit ${value}`"
          :class="`focus:ring-sky-600 py-1 min-h-36 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:outline-none`" />
          <label :for="value"> </label>
        </div>

        <input v-else
          v-model.trim="editedItem[key]"
          :id="key"
          :type="getInputType(value)"
          :placeholder="`Edit ${value}`"
          class="w-full border px-4 py-2 text-black rounded focus:border focus:border-blue-500 focus:shadow-outline outline-none"
        />
      </div>
    </form>

    <button class="bg-red-400 rounded-full py-2 px-3" @click="deleteItem">Delete Item</button>
  </template>
</ModalsModal>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}), // Objeto actual
  },
  allItems: {
    type: Array, // Lista de todos los objetos
    default: () => [],
  },
});

const textareas = ["content", "description"]

const emit = defineEmits(["edit", "delete"]);

// Crear una referencia para el objeto que se edita
const editedItem = ref({ ...props.item });

// Función para cambiar el ítem
function changeItem() {
  emit('edit', editedItem.value);
}

// Función para eliminar el ítem
function deleteItem() {
  if (editedItem.value.hasOwnProperty('slug')) {
    emit("delete", editedItem.value.slug);
  } else {
    emit("delete", editedItem.value.id.toString() );
  }

}


// Función para determinar el tipo de input
function getInputType(value) {
  if (typeof value === 'boolean') {
    return 'checkbox';
  } else if (typeof value === 'number') {
    return 'number';
  } else {
    return 'text';
  }
}
</script>
