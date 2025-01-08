<script setup>
const { cart } = useShopifyCart();
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
const addToCartButtonText = computed(() => (isLoading.value ? 'Adding...' : 'Add to Cart'));

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false;
});
</script>

<template>
  <button
    type="button"
    class="rounded-lg flex font-bold bg-gray-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none"
    :class="{ disabled: disabled }"
    :disabled="disabled || isLoading"
    @click="isLoading = true">
    <span>{{ addToCartButtonText }}</span>
    <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
