<template>
  <div class="flex space-x-4">
    <!-- Product Image -->
    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
      <img 
        v-if="item.merchandise.image?.url" 
        :src="item.merchandise.image.url" 
        :alt="item.merchandise.image.altText || item.merchandise.title"
        class="h-full w-full object-cover object-center"
      >
      <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
        No image
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex flex-1 flex-col">
      <div>
        <div class="flex justify-between text-base font-medium text-gray-900">
          <h3>
            <NuxtLink :to="`/products/${item.merchandise.product.handle}`" class="hover:underline">
              {{ item.merchandise.product.title }}
            </NuxtLink>
          </h3>
          <p class="ml-4">{{ formattedPrice }}</p>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ item.merchandise.title }}</p>
      </div>
      <div class="flex flex-1 items-end justify-between text-sm">
        <!-- Quantity Selector -->
        <div class="flex items-center border rounded">
          <button 
            @click="decrementQuantity" 
            class="px-2 py-1 text-gray-600 hover:bg-gray-100"
            :disabled="item.quantity <= 1"
          >
            -
          </button>
          <span class="px-2 py-1">{{ item.quantity }}</span>
          <button 
            @click="incrementQuantity" 
            class="px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <!-- Remove Button -->
        <div class="flex">
          <button 
            @click="removeItem" 
            type="button" 
            class="font-medium text-black hover:text-gray-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove'])

const formattedPrice = computed(() => {
  if (!props.item.cost?.totalAmount) {
    const price = props.item.merchandise.price
    if (price) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currencyCode || 'USD'
      }).format(parseFloat(price.amount) * props.item.quantity)
    }
    return '$0.00'
  }
  
  const { amount, currencyCode } = props.item.cost.totalAmount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD'
  }).format(parseFloat(amount))
})

const incrementQuantity = () => {
  emit('update-quantity', props.item.id, props.item.quantity + 1)
}

const decrementQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}

const removeItem = () => {
  emit('remove', props.item.id)
}
</script>
