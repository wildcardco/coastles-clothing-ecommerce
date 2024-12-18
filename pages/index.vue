<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-coastles-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
          <span class="block">Welcome to Coastles</span>
          <span class="block text-coastles-400">Premium Clothing</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-coastles-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover our collection of premium clothing designed for comfort and style.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <NuxtLink
              to="/products"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-coastles-600 hover:bg-coastles-700 md:py-4 md:text-lg md:px-10"
            >
              Shop Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Products Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Latest Products</h2>
      <ProductsProductGrid v-if="products" :products="products.nodes" class="mt-6" />
    </div>
  </div>
</template>

<script setup>
const { getLatestProducts } = useProducts()
const { data: products } = await getLatestProducts()
</script>