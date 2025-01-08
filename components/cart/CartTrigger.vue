<template>
  <button 
    class="text-gray-500 hover:text-gray-900 flex items-center relative"
    @click="toggleCart"
  >
    <ShoppingBagIcon class="h-6 w-6" />
    <Transition name="popIn">
      <span 
        v-if="cartItemCount > 0" 
        class="absolute -top-2 -right-2 bg-coastles-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
      >
        {{ cartItemCount }}
      </span>
    </Transition>
  </button>
</template>

<script setup>
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { useShopifyCart } from '#imports'
import { computed } from 'vue'

const { cart, toggleCart } = useShopifyCart()

const cartItemCount = computed(() => {
  return cart.value?.lines?.nodes?.reduce((total, item) => total + item.quantity, 0) || 0
})
</script>

<style scoped>
.popIn-enter-active,
.popIn-leave-active {
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
}
</style>
