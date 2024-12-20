export const useCart = () => {
  const cartId = useState<string | null>('cartId', () => null)
  const isCartOpen = useState<boolean>('isCartOpen', () => false)
  const cartItems = useState<any[]>('cartItems', () => [])
  const cartTotal = useState<string>('cartTotal', () => '0.00')

  const createCart = async () => {
    try {
      const { data } = await useAsyncGql('CartCreate')
      cartId.value = data.cartCreate.cart.id
      return cartId.value
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      if (!cartId.value) {
        await createCart()
      }

      const { data } = await useAsyncGql('CartLinesAdd', {
        cartId: cartId.value,
        lines: [{
          merchandiseId: variantId,
          quantity
        }]
      })

      cartItems.value = data.cartLinesAdd.cart.lines.nodes
      cartTotal.value = useFormatPrice(
        data.cartLinesAdd.cart.cost.subtotalAmount.amount,
        data.cartLinesAdd.cart.cost.subtotalAmount.currencyCode
      )
      isCartOpen.value = true
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  return {
    cartId,
    cartItems,
    cartTotal,
    isCartOpen,
    addToCart,
    toggleCart
  }
}
