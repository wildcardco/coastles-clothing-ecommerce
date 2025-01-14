<script setup>
import { useShopifyCart } from '#imports';
import { ref, computed } from 'vue';

const { cart, addToCart } = useShopifyCart();

const props = defineProps({
  variantId: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
});

const isLoading = ref(false);
const error = ref(null);
const addToCartButtonText = computed(() => {
  if (error.value) return 'Failed to add';
  return isLoading.value ? 'Adding...' : 'Add to Cart';
});

const handleAddToCart = async () => {
  if (!props.variantId || isLoading.value) return;
  
  error.value = null;
  try {
    isLoading.value = true;
    console.log('Adding variant to cart:', {
      variantId: props.variantId,
      quantity: props.quantity
    });
    await addToCart(props.variantId, props.quantity);
  } catch (err) {
    console.error('Failed to add item to cart:', err);
    error.value = err.message;
    // Reset error after 3 seconds
    setTimeout(() => {
      error.value = null;
    }, 3000);
  } finally {
    isLoading.value = false;
  }
};

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false;
});
</script>

<template>
  <button
    type="button"
    class="rounded-lg flex font-bold text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none"
    :class="{
      'bg-gray-800 hover:bg-gray-700': !disabled && !error,
      'bg-gray-400 cursor-not-allowed': disabled,
      'bg-red-600': error
    }"
    :disabled="disabled || isLoading"
    @click="handleAddToCart"
  >
    <span>{{ addToCartButtonText }}</span>
    <div 
      v-if="isLoading" 
      class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
    />
  </button>
</template>

<style lang="postcss" scoped>
button {
  outline: none !important;
  transition: all 150ms ease-in;
}

button.disabled {
  @apply cursor-not-allowed bg-gray-400;
}
</style>
