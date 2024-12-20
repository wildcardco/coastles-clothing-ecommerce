<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div v-if="pending" class="text-center py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-center py-12 text-red-600">
      Error loading product: {{ error.message }}
    </div>

    <div v-else-if="product" class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
      <!-- Product Image -->
      <div class="lg:col-span-1">
        <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img 
            :src="product.images.nodes[0].url" 
            :alt="product.title" 
            class="h-full w-full object-cover object-center"
          >
        </div>
      </div>

      <!-- Product Details -->
      <div class="lg:col-span-1">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {{ product.title }}
        </h1>
        <div class="mt-4">
          <p class="text-3xl tracking-tight text-gray-900">
            {{ formattedPrice }}
          </p>
        </div>
        <div class="mt-6">
          <h3 class="sr-only">Description</h3>
          <div 
            class="space-y-6 text-base text-gray-700" 
            v-html="product.description"
          ></div>
        </div>
        <div class="mt-8">
          <button
            type="button"
            class="w-full bg-coastles-600 text-white py-3 px-4 rounded-md hover:bg-coastles-700 focus:outline-none focus:ring-2 focus:ring-coastles-500 focus:ring-offset-2"
            @click="handleAddToCart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Debug section -->
    <div v-if="config.public.dev" class="mt-8 p-4 bg-gray-100 rounded">
      <pre class="overflow-auto">{{ JSON.stringify(product, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
const route = useRoute()
const config = useRuntimeConfig()
const { addToCart } = useCart()

const { data, pending, error } = await useAsyncGql('GetProducts', {
  first: 10
})

// Find the specific product from the products array
const product = computed(() => {
  return data.value?.products?.nodes?.find(
    p => p.handle === route.params.handle
  )
})

const formattedPrice = computed(() => {
  if (!product.value) return ''
  return useFormatPrice(
    product.value.priceRange.minVariantPrice.amount,
    product.value.priceRange.minVariantPrice.currencyCode
  )
})

const handleAddToCart = () => {
  if (product.value && product.value.variants.nodes[0]) {
    addToCart(product.value.variants.nodes[0].id)
  }
}

// Debug logging
console.log('Product page - route handle:', route.params.handle)
console.log('Product page - found product:', product.value)
</script>