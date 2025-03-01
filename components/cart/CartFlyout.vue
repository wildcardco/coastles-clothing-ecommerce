<template>
  <Transition name="fade">
    <div 
      v-if="isCartOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    />
  </Transition>

  <Transition name="slide">
    <div 
      v-if="isCartOpen"
      class="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-medium">Shopping Cart</h2>
          <button
            @click="handleClose"
            class="p-2 -m-2 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Cart Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="!cart?.lines?.nodes?.length" class="text-center py-8">
            <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Cart is empty</h3>
            <p class="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
          </div>

          <div>
            <ul v-if="cart?.lines?.nodes?.length" class="divide-y divide-gray-200">
              <li v-for="item in cart.lines.nodes" :key="item.id" class="py-6">
                <CartItem 
                  :item="item"
                  @update-quantity="updateQuantity"
                  @remove="removeItem"
                />
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{{ formattedSubtotal }}</p>
          </div>
          <p class="mt-0.5 text-sm text-gray-500">Shipping calculated at checkout.</p>
          <div class="mt-6">
            <button
              @click="handleCheckout"
              class="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'opacity-50 cursor-not-allowed': isRedirecting }"
              :disabled="!cart?.lines?.nodes?.length || isRedirecting"
            >
              <span v-if="isRedirecting">Redirecting to checkout...</span>
              <span v-else>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { useShopifyCart } from '#imports'
import CartItem from './CartItem.vue'
import { computed, ref } from 'vue'

const { cart, isCartOpen, toggleCart, removeCartItem, updateCartItem, goToCheckout } = useShopifyCart()
const isRedirecting = ref(false)

const formattedSubtotal = computed(() => {
  if (!cart.value?.lines?.nodes?.length || !cart.value?.cost?.subtotalAmount) {
    return '$0.00'
  }
  return useFormatPrice(
    cart.value.cost.subtotalAmount.amount,
    cart.value.cost.subtotalAmount.currencyCode
  )
})

const handleCheckout = () => {
  isRedirecting.value = true
  console.log('Starting checkout process...')
  goToCheckout()
}

const handleClose = () => {
  toggleCart(false)
}

const updateQuantity = async (lineId, quantity) => {
  try {
    await updateCartItem(lineId, quantity)
  } catch (error) {
    console.error('Failed to update quantity:', error)
  }
}

const removeItem = async (lineId) => {
  try {
    await removeCartItem(lineId)
  } catch (error) {
    console.error('Failed to remove item:', error)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
