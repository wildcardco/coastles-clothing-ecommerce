<template>
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="w-full py-6 flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-coastles-600">Coastles</span>
          </NuxtLink>
        </div>
        <div class="ml-10 space-x-8">
          <NuxtLink to="/" class="text-base font-medium text-gray-500 hover:text-gray-900">
            Home
          </NuxtLink>
          <NuxtLink to="/products" class="text-base font-medium text-gray-500 hover:text-gray-900">
            Products
          </NuxtLink>
          <button class="text-base font-medium text-gray-500 hover:text-gray-900">
            <ShoppingBagIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
</script>