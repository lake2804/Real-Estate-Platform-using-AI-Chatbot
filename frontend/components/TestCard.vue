<!-- filepath: d:\FS\FE\Real Estate Nuxt\frontend\components\TestCard.vue -->
<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="mb-4 text-lg font-semibold">{{ title }}</h3>
    
    <button
      @click="$emit('test')"
      :disabled="loading || disabled"
      :class="[
        'w-full py-2 px-4 rounded font-medium transition-colors mb-4',
        buttonClasses
      ]"
    >
      {{ loading ? 'Testing...' : buttonText }}
    </button>
    
    <div v-if="disabled && !loading" class="mb-2 text-sm text-gray-500">
      {{ title.includes('Protected') ? 'Authentication required' : 'Prerequisites not met' }}
    </div>
    
    <div v-if="result" class="p-3 mt-4 overflow-auto text-sm bg-gray-100 rounded max-h-40">
      <div v-if="result.success" class="mb-2 font-medium text-green-600">✅ Success</div>
      <div v-else class="mb-2 font-medium text-red-600">❌ {{ result.expected ? 'Expected Error' : 'Failed' }}</div>
      <div class="mb-1 text-xs text-gray-600">{{ result.url }}</div>
      <pre class="text-xs">{{ JSON.stringify(result.data || result.error, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  loading: boolean
  result: any
  disabled?: boolean
  buttonText: string
  buttonColor: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

defineEmits<{
  test: []
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'disabled:opacity-50 disabled:cursor-not-allowed'
  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white',
    pink: 'bg-pink-500 hover:bg-pink-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    teal: 'bg-teal-500 hover:bg-teal-600 text-white',
    cyan: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    lime: 'bg-lime-500 hover:bg-lime-600 text-white',
    slate: 'bg-slate-500 hover:bg-slate-600 text-white'
  }
  
  return `${baseClasses} ${colors[props.buttonColor] || colors.blue}`
})
</script>