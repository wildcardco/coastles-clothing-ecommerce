<template>
  <header class="bg-white shadow-sm relative">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="w-full py-6 flex items-center justify-between">
        <div class="flex items-center">
          <UiLogo />
        </div>
        <div class="ml-10 space-x-8 flex items-center">
          <NuxtLink to="/" class="text-base font-medium text-gray-500 hover:text-gray-900">
            Home
          </NuxtLink>
          <NuxtLink to="/products" class="text-base font-medium text-gray-500 hover:text-gray-900">
            Products
          </NuxtLink>
          <button 
            class="text-gray-500 hover:text-gray-900 flex items-center relative"
            @click="cart.toggleCart"
          >
            <ShoppingBagIcon class="h-6 w-6" />
            <span 
              v-if="cart.cartItems.length" 
              class="absolute -top-2 -right-2 bg-coastles-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              {{ cart.cartItems.length }}
            </span>
          </button>
        </div>
      </div>
    </nav>

  </header>
</template>

<script setup>
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
const cart = useCart()
</script>