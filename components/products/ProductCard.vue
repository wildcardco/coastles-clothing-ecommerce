<template>
  <article class="group product-card" itemscope itemtype="http://schema.org/Product">
    <NuxtLink :to="`/products/${product.handle}`" :title="`View ${product.title} details`">
      <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img 
          :src="product.images.nodes[0].url" 
          :alt="product.title"
          :title="product.title"
          class="h-full w-full object-cover object-center"
          itemprop="image"
        >
      </div>
      <div class="mt-4 space-y-2">
        <h3 
          class="text-sm font-heading text-gray-700"
          itemprop="name"
        >
          {{ product.title }}
        </h3>
        <p 
          class="text-xs text-gray-500"
          itemprop="description"
        >
          {{ product.description || `Premium ${product.title} - Coastles Clothing Collection` }}
        </p>
        <div class="flex justify-between items-center">
          <p 
            class="text-lg font-medium"
            itemprop="offers" 
            itemscope 
            itemtype="http://schema.org/Offer"
          >
            <meta itemprop="priceCurrency" :content="product.priceRange.minVariantPrice.currencyCode">
            <span itemprop="price">{{ formattedPrice }}</span>
          </p>
        </div>
      </div>
    </NuxtLink>
  </article>
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

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-4px);
}
</style>