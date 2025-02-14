<template>
  <div class="group">
    <NuxtLink :to="`/products/${product.handle}`">
      <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img 
          :src="product.images.nodes[0].url" 
          :alt="product.title" 
          class="h-full w-full object-cover object-center"
        >
      </div>
      <h3 class="mt-4 text-sm font-heading text-gray-700">{{ product.title }}</h3>
      <p class="mt-1 text-lg font-medium">
        {{ formattedPrice }}
      </p>
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const formattedPrice = computed(() => {
  return useFormatPrice(
    props.product.priceRange.minVariantPrice.amount,
    props.product.priceRange.minVariantPrice.currencyCode
  )
})
</script>