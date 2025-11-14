<template>
<ModalsModal :title="`edit ${user.first_name} `" >
  <template v-slot:btn >
    <button class="bg-amber-400 rounded-full py-2 px-3">
      <p> edit </p>
    </button>
  </template>
  <template v-slot:body >
    <form @submit.prevent="(changeUser)" class="flex flex-col justify-center gap-1 my-2">
      <label class="block mb-1 text-sm" :for="`${user.first_name}`"> edit the name “ {{ user.first_name }} ” </label>
      <input :id="`${user.first_name}`" v-model.trim="name" class="w-full  border px-4 py-2 rounded focus:border focus:border-blue-500 focus:shadow-outline outline-none"  :placeholder="`${user.first_name}`" />
      
    </form>
    

    <button class="bg-red-400 rounded-full py-2 px-3" > delete user </button>

  </template>
</ModalsModal>
</template>

<script lang="ts" setup>
const props = defineProps({
user: {
    type: Object,
    default: {} ,
  },
});

const user:Ref<User> = ref<User>( props.user )
  
const name:Ref<string> = ref<string> (user.value.first_name! )


function changeUser() {
    
}

</script>