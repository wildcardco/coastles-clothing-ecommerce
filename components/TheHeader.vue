<template>
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20 sm:h-24">
        <div class="flex items-center">
          <UiLogo />
        </div>
        <div class="flex items-center space-x-8">
          <NuxtLink to="/products" class="text-base font-medium text-gray-500 hover:text-gray-900">
            Products
          </NuxtLink>
          <CartTrigger />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
// Components are auto-imported
</script>