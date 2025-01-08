import { useState, useRouter, onMounted, onUnmounted } from '#imports'

export const useShopifyCart = () => {
  const cart = useState<any>('shopifyCart', () => null)
  const isCartOpen = useState<boolean>('isCartOpen', () => false)
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false)

  const toggleCart = (state?: boolean) => {
    isCartOpen.value = state ?? !isCartOpen.value
    
    if (isCartOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const createCart = async () => {
    try {
      const { data } = await useAsyncGql('CartCreate')
      if (data?.cartCreate?.cart) {
        cart.value = data.cartCreate.cart
        return data.cartCreate.cart
      }
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }

  const fetchCart = async () => {
    const cartId = localStorage.getItem('cartId')
    if (!cartId) {
      await createCart()
      return
    }

    try {
      const { data } = await useAsyncGql('CartRetrieve', { cartId })
      if (data?.cart) {
        cart.value = data.cart
      } else {
        localStorage.removeItem('cartId')
        await createCart()
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      localStorage.removeItem('cartId')
      await createCart()
    }
  }

  const addToCart = async (merchandiseId: string, quantity: number = 1) => {
    try {
      isUpdatingCart.value = true
      
      // Create cart if it doesn't exist
      if (!cart.value?.id) {
        const newCart = await createCart()
        cart.value = newCart
      }

      const { data } = await useAsyncGql('CartLinesAdd', {
        cartId: cart.value.id,
        lines: [{
          merchandiseId,
          quantity
        }]
      })

      if (data?.cartLinesAdd?.cart) {
        cart.value = data.cartLinesAdd.cart
        toggleCart(true)
      }

      return data?.cartLinesAdd?.cart
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      isUpdatingCart.value = false
    }
  }

  onMounted(() => {
    fetchCart()
  })

  // Clean up on unmount
  onUnmounted(() => {
    isCartOpen.value = false
    document.body.style.overflow = ''
  })

  return {
    cart,
    isCartOpen,
    isUpdatingCart,
    toggleCart,
    createCart,
    fetchCart,
    addToCart
  }
}
