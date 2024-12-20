<template>
  <div class="relative h-[70vh] overflow-hidden">
    <!-- Video Background -->
    <video
      autoplay
      loop
      muted
      playsinline
      class="absolute top-0 left-0 w-full h-full object-cover"
    >
      <source src="~/public/videos/come-get-lost.mp4" type="video/mp4">
    </video>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-coastles-900/70 backdrop-filter backdrop-brightness-50"></div>

    <!-- Content -->
    <div class="relative z-10 h-full flex items-center justify-center text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-5xl font-bold tracking-tight text-coastles-50 sm:text-6xl md:text-7xl">
          <span class="block text-coastles-300 font-light tracking-widest text-3xl sm:text-4xl md:text-5xl mt-2">PREMIUM STREETWEAR</span>
        </h1>
        <p class="mt-6 max-w-md mx-auto text-coastles-200 text-lg sm:text-xl md:mt-8 md:text-2xl md:max-w-3xl">
          Discover our collection of premium streetwear designed for those who dare to stand out.
        </p>
        <div class="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
          <div class="rounded-none shadow">
            <NuxtLink
              to="/products"
              class="w-full flex items-center justify-center px-8 py-4 border-2 border-coastles-50 text-base font-medium text-coastles-50 bg-transparent hover:bg-coastles-50 hover:text-coastles-900 transition-all duration-300 md:text-lg md:px-12"
            >
              SHOP NOW
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Optional: Add any reactive logic here
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800&display=swap');
</style>
