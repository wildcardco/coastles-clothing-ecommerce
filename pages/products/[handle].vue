<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div v-if="product" class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
      <div class="lg:col-span-1">
        <img 
          :src="product.images.nodes[0].url" 
          :alt="product.title" 
          class="rounded-lg w-full h-auto"
        >
      </div>
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
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script setup>
const route = useRoute()
const { getProduct } = useProducts()
const { data: { product } } = await getProduct(route.params.handle)

const formattedPrice = computed(() => {
  return useFormatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  )
})
</script>