<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Test Product Fetch</h2>
    <button 
      @click="fetchProducts" 
      class="bg-coastles-600 text-white px-4 py-2 rounded"
    >
      Fetch Products
    </button>
    
    <div v-if="loading" class="mt-4">
      Loading...
    </div>
    
    <div v-if="error" class="mt-4 text-red-600">
      {{ error }}
    </div>
    
    <pre v-if="data" class="mt-4 p-4 bg-gray-100 rounded overflow-auto">
      {{ JSON.stringify(data, null, 2) }}
    </pre>
  </div>
</template>

<script setup>
const loading = ref(false)
const error = ref(null)
const data = ref(null)

const fetchProducts = async () => {
  loading.value = true
  error.value = null
  data.value = null
  
  try {
    const response = await fetch('https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': '4e299f747bbee0bda43e552b6706e128'
      },
      body: JSON.stringify({
        query: `
          query {
            products(first: 3) {
              nodes {
                id
                title
                handle
                description
              }
            }
          }
        `
      })
    })
    
    const result = await response.json()
    data.value = result
    // console.log('Raw API Response:', result)
  } catch (e) {
    error.value = e.message
    console.error('Fetch error:', e)
  } finally {
    loading.value = false
  }
}
</script>
