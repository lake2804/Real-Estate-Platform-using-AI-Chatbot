<template>
  <div v-if="config.public.dev" class="fixed z-50 p-2 text-xs text-white bg-red-600 rounded top-4 right-4">
    Layout: {{ $route.meta?.layout || 'default' }}
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
</script>