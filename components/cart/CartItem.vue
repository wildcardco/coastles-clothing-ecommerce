<template>
  <div class="flex py-4">
    <!-- Product Image -->
    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
      <img
        :src="item.merchandise.image?.url"
        :alt="item.merchandise.product.title"
        class="h-full w-full object-cover object-center"
      >
    </div>

    <!-- Product Details -->
    <div class="ml-4 flex flex-1 flex-col">
      <div>
        <div class="flex justify-between">
          <h3 class="text-base font-medium text-gray-900">
            {{ item.merchandise.product.title }}
          </h3>
          <p class="ml-4 text-base font-medium text-gray-900">
            {{ formattedPrice }}
          </p>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ item.merchandise.title }}</p>
      </div>

      <div class="flex flex-1 items-end justify-between text-sm">
        <div class="flex items-center space-x-2">
          <button 
            @click="updateQuantity(item.quantity - 1)"
            class="text-gray-500 hover:text-gray-700 p-1"
            :disabled="item.quantity <= 1"
          >
            <MinusIcon class="h-4 w-4" />
          </button>
          <span class="text-gray-500">{{ item.quantity }}</span>
          <button 
            @click="updateQuantity(item.quantity + 1)"
            class="text-gray-500 hover:text-gray-700 p-1"
          >
            <PlusIcon class="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          class="font-medium text-gray-500 hover:text-gray-700"
          @click="$emit('remove', item.id)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove'])

const formattedPrice = computed(() => {
  return useFormatPrice(
    props.item.cost.totalAmount.amount,
    props.item.cost.totalAmount.currencyCode
  )
})

const updateQuantity = (newQuantity) => {
  if (newQuantity >= 1) {
    emit('update-quantity', props.item.id, newQuantity)
  }
}
</script>
