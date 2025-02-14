<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <SeoHead
      :title="product?.title"
      :description="stripHtml(product?.descriptionHtml) || `Shop ${product?.title} - Premium streetwear by Coastles. High-quality materials, unique designs, and California-inspired style.`"
      :image="productMedia?.[0]?.image?.url"
      type="product"
      :keywords="`${product?.title}, Coastles clothing, premium streetwear, California style, ${product?.tags?.join(', ')}`"
    />

    <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
      <!-- Test Image
      <div class="lg:col-start-1 lg:col-span-1">
        <img 
          v-if="productMedia?.[0]?.image?.url"
          :src="productMedia[0].image.url"
          :alt="product?.title"
          class="w-full h-full object-cover rounded-lg"
        />
      </div> -->

        <!-- Product Image -->
  <div class="lg:col-start-1 lg:col-span-1">
    <ProductImageSlider :media="productMedia" />
  </div>

      <!-- Product Info -->
      <div class="lg:col-start-2 lg:col-span-1">
        <h1 class="text-4xl font-heading italic font-medium text-gray-900">
          {{ product?.title }}
        </h1>
        
        <!-- Price -->
        <div class="mt-4">
          <p class="text-2xl font-bold text-red-600">
            {{ formattedPrice }} USD
          </p>
        </div>

        <!-- Add this after the price display -->
        <div class="mt-2">
          <p class="text-sm" :class="{
            'text-green-600': selectedVariant?.quantityAvailable > 5,
            'text-orange-600': selectedVariant?.quantityAvailable > 0 && selectedVariant?.quantityAvailable <= 5,
            'text-red-600': !selectedVariant?.quantityAvailable
          }">
            {{ stockStatus }}
          </p>
        </div>

        <!-- Description -->
        <div class="mt-6 prose prose-sm text-gray-700">
          <div v-html="product?.descriptionHtml"></div>
        </div>

        <!-- Size Selector -->
        <div class="mt-8">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">Size</h3>
          </div>
          <select
            v-model="selectedOptions.Size"
            class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-coastles-600 sm:text-sm sm:leading-6"
          >
            <option value="" disabled>Select Size</option>
            <option 
              v-for="variant in variants"
              :key="variant.node.id"
              :value="variant.node.selectedOptions[0].value"
            >
              {{ variant.node.selectedOptions[0].value }}
              {{ getPriceDifference(variant.node) }}
            </option>
          </select>
        </div>

        <!-- Quantity Selector -->
        <div class="mt-8">
          <label for="quantity" class="text-sm font-medium text-gray-900">
            Quantity
            <span v-if="selectedVariant?.quantityAvailable" class="text-sm text-gray-500">
              (Max: {{ selectedVariant.quantityAvailable }})
            </span>
          </label>
          <div class="mt-2 flex rounded-md shadow-sm">
            <button 
              @click="quantity > 1 && quantity--"
              class="relative -mr-px inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              :disabled="!selectedVariant?.quantityAvailable"
            >
              −
            </button>
            <input
              type="number"
              v-model="quantity"
              :max="selectedVariant?.quantityAvailable || 1"
              min="1"
              class="block w-20 border-gray-300 text-center focus:ring-coastles-600 focus:border-coastles-600 sm:text-sm"
              :disabled="!selectedVariant?.quantityAvailable"
            />
            <button 
              @click="quantity < (selectedVariant?.quantityAvailable || 1) && quantity++"
              class="relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              :disabled="!selectedVariant?.quantityAvailable || quantity >= selectedVariant.quantityAvailable"
            >
              +
            </button>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <div class="mt-8">
          <AddToCartButton
            :variant-id="selectedVariant?.id"
            :disabled="!selectedVariant || !selectedVariant.availableForSale"
            :quantity="quantity"
            :available-quantity="selectedVariant?.quantityAvailable || 0"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useProducts } from '~/composables/useProducts'
import ProductImageSlider from '~/components/products/ProductImageSlider.vue'

const route = useRoute()
const config = useRuntimeConfig()
const { getProduct } = useProducts()

// Fetch product data
const { data, pending, error } = await getProduct(`title:${route.params.handle.replace(/-/g, ' ')}`)
// console.log('Raw API response:', data.value)

const product = computed(() => {
  const prod = data.value?.products?.edges?.[0]?.node
  // console.log('Computed product:', prod)
  return prod || null
})

const productMedia = computed(() => {
  const media = product.value?.media?.nodes
  // console.log('Computed media:', media)
  return media || []
})

// Get variants directly from product
const variants = computed(() => product.value?.variants?.edges || [])

// console.log('Product Data:', product.value)
// console.log('Variants:', variants.value)

// Selected options and quantity
const selectedOptions = ref({ Size: '' })
const quantity = ref(1)

// Initialize with first available size
watch(variants, (newVariants) => {
  if (newVariants?.[0]?.node?.selectedOptions?.[0]?.value) {
    selectedOptions.value.Size = newVariants[0].node.selectedOptions[0].value
    // console.log('Setting initial size:', newVariants[0].node.selectedOptions[0].value)
  }
}, { immediate: true })

// Find matching variant based on selected options
const selectedVariant = computed(() => {
  if (!variants.value?.length) return null
  
  const found = variants.value.find(({ node }) => 
    node.selectedOptions[0].value === selectedOptions.value.Size
  )?.node
  // console.log('Selected variant:', found)
  return found
})

const basePrice = computed(() => {
  return variants.value?.[0]?.node?.price?.amount || 0
})

const getPriceDifference = (variant) => {
  const priceDiff = variant.price.amount - basePrice.value
  if (priceDiff === 0) return ''
  return priceDiff > 0 ? ` (+$${priceDiff})` : ` (-$${Math.abs(priceDiff)})`
}

const formattedPrice = computed(() => {
  if (selectedVariant.value?.price?.amount) {
    return `$${parseFloat(selectedVariant.value.price.amount).toFixed(2)}`
  }
  return ''
})

// Debug watches
watch(product, (newProduct) => {
  // console.log('Product changed:', newProduct)
}, { immediate: true })

watch(productMedia, (newMedia) => {
  // console.log('Media changed:', newMedia)
}, { immediate: true })

// Add this new computed property
const stockStatus = computed(() => {
  if (!selectedVariant.value) return 'Select a variant';
  if (!selectedVariant.value.availableForSale) return 'Out of stock';
  if (selectedVariant.value.quantityAvailable <= 0) return 'Out of stock';
  if (selectedVariant.value.quantityAvailable <= 5) return `Low stock: ${selectedVariant.value.quantityAvailable} left`;
  return `In stock: ${selectedVariant.value.quantityAvailable} available`;
})

// Update the quantity watcher to respect stock limits
watch(selectedVariant, (newVariant) => {
  quantity.value = 1;
  
  if (newVariant?.quantityAvailable && quantity.value > newVariant.quantityAvailable) {
    quantity.value = newVariant.quantityAvailable;
  }
  
  // console.log('Variant changed:', {
  //   variant: newVariant?.title,
  //   quantityAvailable: newVariant?.quantityAvailable,
  //   newQuantity: quantity.value
  // });
}, { immediate: true });

// Add this helper function
const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>