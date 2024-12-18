<template>
  <div>
    <div v-if="pending" class="text-center py-12">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-center py-12 text-red-600">
      Error loading products
    </div>
    
    <div v-else-if="data?.products?.nodes?.length" 
         class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      <ProductsProductCard 
        v-for="product in data.products.nodes" 
        :key="product.id" 
        :product="product"
      />
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-gray-500">No products found</p>
    </div>
  </div>
</template>

<script setup>
const { data, pending, error } = await useAsyncGql('GetProducts', {
  first: 10
})

// Debug logging
console.log('ProductGrid - raw data:', data)
console.log('ProductGrid - products array:', data?.products?.nodes)
</script>