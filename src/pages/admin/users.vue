<template>
  <div class="container mx-auto p-6 space-y-8">
<!-- 
    
-->
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold">Gestion de Usuarios</h1>
      <p class="text-gray-700 max-w-2xl">
        Bienvenido al centro de control de los usuarios. Desde aca podes gestionar a todos los usuarios del sitio web
        y obtener una vista general de ellos, asi como poder editar su informacion, como los roles (administrador, editor o usuario normal)
        o saber el horario de la creacion de su cuenta, o editar su nombre de usuario.
        En este panel tambien se puede eliminar a los usuarios, sin embargo, esta funcion la tengo en desarrollo
      </p>
    </header>
  </div>
  <AdminList @edit="handleEdit" @delete="deleteUser" :obj="usersData" />
</template>

<script setup lang="ts">
import { getSimpleUsersData } from '#imports';

const usersData = ref<SimpleUserData[]>( await getSimpleUsersData() );

function handleEdit(aItem: Record<string, any>) {
  const item:SimpleUserData = aItem as SimpleUserData

  updateUser(item.id, {
    id: item.id,
    email: item.email,
    first_name: item.name,
    identifier: item.identifier,
    is_admin: item.role === "admin",
    is_editor: item.role === "editor",
    created_at: item.created_at,
    updated_at: item.updated_at,
  })

  window.location.reload()
}

function deleteUser(item: Record<string, any>) {

  console.log('Eliminar usuario:', item)
}
</script>
