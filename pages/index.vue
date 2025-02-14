<template>
  <div>
    <HeroSection />
    
    <!-- Latest Products Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-3xl font-heading font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
        Latest Products
      </h2>
      <div v-if="pending" class="text-center py-12">
        <LoadingSpinner />
      </div>
      <div v-else-if="error" class="text-center py-12 text-red-600">
        Error loading products
      </div>
      <div v-else-if="data?.products?.nodes?.length" 
           class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductsProductCard 
          v-for="product in data.products.nodes" 
          :key="product.id" 
          :product="product"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const { data, pending, error } = await useAsyncGql('GetProducts', {
  first: 6
})

// Debug logging
console.log('Latest Products - raw data:', data)
console.log('Latest Products - products array:', data?.products?.nodes)
</script>