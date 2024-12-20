<template>
  <Transition
    enter-active-class="transform transition ease-in-out duration-300"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transform transition ease-in-out duration-300"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div 
      v-if="cart.isCartOpen" 
      class="fixed inset-0 overflow-hidden z-50"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="cart.toggleCart"
      />

      <!-- Flyout panel -->
      <div class="fixed inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl">
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Cart</h2>
              <button 
                @click="cart.toggleCart"
                class="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Cart items -->
            <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div v-if="!cart.cartItems.length" class="text-center">
                <div class="flex flex-col items-center">
                  <ShoppingCartIcon class="h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p class="mt-1 text-sm text-gray-500">Browse our products to get started.</p>
                  <NuxtLink
                    to="/products"
                    class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-coastles-600 hover:bg-coastles-700"
                    @click="cart.toggleCart"
                  >
                    Browse Products
                  </NuxtLink>
                </div>
              </div>

              <div v-else>
                <ul class="-my-6 divide-y divide-gray-200">
                  <li v-for="item in cart.cartItems" :key="item.id" class="py-6 flex">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img 
                        :src="item.merchandise.image.url" 
                        :alt="item.merchandise.product.title"
                        class="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div class="ml-4 flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <h3>{{ item.merchandise.product.title }}</h3>
                          <p class="ml-4">
                            {{ useFormatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode) }}
                          </p>
                        </div>
                      </div>
                      <div class="flex-1 flex items-end justify-between text-sm">
                        <p class="text-gray-500">Qty {{ item.quantity }}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>{{ cart.cartTotal }}</p>
              </div>
              <div class="mt-6">
                <NuxtLink
                  to="/checkout"
                  class="flex items-center justify-center rounded-md border border-transparent bg-coastles-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-coastles-700"
                  @click="cart.toggleCart"
                >
                  Checkout
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
const cart = useCart()
</script>
