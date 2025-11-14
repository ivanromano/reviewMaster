<template>
  <ModalsModal ref="modal" @save="apply" :showSave="focusedFdp !== null " :title="`${props.title} `" >
    <!-- quiero que cuando la pantalla sea chica, en lugar de tener que hacer hover, que haya un boton para activar  -->
    <template v-slot:btn >
      <div class="h-28 relative hidden overflow-hidden rounded-full lg:block">
        <UserFdp ref="userFdp" :fdp="focusedFdp" />
        <main class="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100">
          <span>Change</span>
          <span class="sr-only">user photo</span>
        </main>
      </div>
    </template>

    <template v-slot:body >
      <nav v-for="(item, index) in props.items" :key="index" class="inline-block mx-2">
        <UserFdp class="h-[70px]" :fdp="item.name" @focus="setFocusedFdp(item.name)" :isFocused="focusedFdp === item.name"/>
      </nav>
    </template>
  </ModalsModal>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: `user photo`,
  },
  fdp: {
    type: String,
    default: `ace`,
  },
  items: Object,
});

const modal = ref(null);
const userFdp = ref(null);
const focusedFdp = ref(props.fdp); 

const setFocusedFdp = (fdp) => {
  focusedFdp.value = fdp;
};

const emit = defineEmits(["save"]);

function apply() {
  emit("save", focusedFdp.value);
  modal.value.openModal(false);
  userFdp.value.setFdp(focusedFdp.value)
}

function openModal() {
  modal.value.openModal(true);
  
}

defineExpose({openModal})
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>

