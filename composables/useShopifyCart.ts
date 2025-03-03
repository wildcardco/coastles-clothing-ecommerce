import { useState, useRouter, onMounted, onUnmounted } from '#imports'

export const useShopifyCart = () => {
  const cart = useState<any>('shopifyCart', () => null)
  const isCartOpen = useState<boolean>('isCartOpen', () => false)
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false)
  const config = useRuntimeConfig().public
  const shopifyDomain = config.shopifyDomain as string
  const shopifyStorefrontToken = config.shopifyStorefrontToken as string

  const toggleCart = (state?: boolean) => {
    isCartOpen.value = state ?? !isCartOpen.value
    
    if (isCartOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const cartFragment = `
    id
    totalQuantity
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 10) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  `

  const createCart = async () => {
    try {
      const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken
        },
        body: JSON.stringify({
          query: `
            mutation CartCreate {
              cartCreate {
                cart {
                  ${cartFragment}
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `
        })
      })

      const { data } = await response.json()
      
      if (data?.cartCreate?.cart?.id) {
        const newCart = data.cartCreate.cart
        cart.value = newCart
        localStorage.setItem('cartId', newCart.id)
        return newCart
      }
      
      if (data?.cartCreate?.userErrors?.length) {
        throw new Error(data.cartCreate.userErrors[0].message)
      }
      
      throw new Error('Failed to create cart: Invalid response from API')
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }

  const fetchCart = async () => {
    try {
      const cartId = localStorage.getItem('cartId')
      
      if (!cartId) {
        return await createCart()
      }

      const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken
        },
        body: JSON.stringify({
          query: `
            query CartRetrieve($cartId: ID!) {
              cart(id: $cartId) {
                ${cartFragment}
              }
            }
          `,
          variables: {
            cartId
          }
        })
      })

      const { data } = await response.json()

      if (data?.cart) {
        cart.value = data.cart
        return data.cart
      } else {
        localStorage.removeItem('cartId')
        return await createCart()
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      localStorage.removeItem('cartId')
      return await createCart()
    }
  }

  const addToCart = async (merchandiseId: string, quantity: number = 1) => {
    try {
      isUpdatingCart.value = true
      
      if (!cart.value?.id) {
        const newCart = await createCart()
        if (!newCart?.id) {
          throw new Error('Failed to create cart')
        }
        cart.value = newCart
      }

      const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken
        },
        body: JSON.stringify({
          query: `
            mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
              cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                  ${cartFragment}
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            cartId: cart.value.id,
            lines: [{
              merchandiseId,
              quantity
            }]
          }
        })
      })

      const { data } = await response.json()

      if (data?.cartLinesAdd?.cart) {
        cart.value = data.cartLinesAdd.cart
        toggleCart(true)
      } else if (data?.cartLinesAdd?.userErrors?.length) {
        throw new Error(data.cartLinesAdd.userErrors[0].message)
      } else {
        throw new Error('Failed to add item to cart')
      }

      return data?.cartLinesAdd?.cart
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      isUpdatingCart.value = false
    }
  }

  const updateCartItem = async (lineId: string, quantity: number) => {
    try {
      isUpdatingCart.value = true
      
      const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken
        },
        body: JSON.stringify({
          query: `
            mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
              cartLinesUpdate(cartId: $cartId, lines: $lines) {
                cart {
                  ${cartFragment}
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            cartId: cart.value.id,
            lines: [{
              id: lineId,
              quantity
            }]
          }
        })
      })

      const { data } = await response.json()
      
      if (data?.cartLinesUpdate?.cart) {
        cart.value = data.cartLinesUpdate.cart
      } else if (data?.cartLinesUpdate?.userErrors?.length) {
        throw new Error(data.cartLinesUpdate.userErrors[0].message)
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    } finally {
      isUpdatingCart.value = false
    }
  }

  const removeCartItem = async (lineId: string) => {
    try {
      isUpdatingCart.value = true
      
      const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken
        },
        body: JSON.stringify({
          query: `
            mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
              cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart {
                  ${cartFragment}
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            cartId: cart.value.id,
            lineIds: [lineId]
          }
        })
      })

      const { data } = await response.json()
      
      if (data?.cartLinesRemove?.cart) {
        cart.value = data.cartLinesRemove.cart
      } else if (data?.cartLinesRemove?.userErrors?.length) {
        throw new Error(data.cartLinesRemove.userErrors[0].message)
      }
    } catch (error) {
      console.error('Error removing cart item:', error)
      throw error
    } finally {
      isUpdatingCart.value = false
    }
  }

  const goToCheckout = () => {
    try {
      if (!cart.value || !cart.value.id) {
        console.error('No cart available for checkout');
        return null;
      }

      // Use the checkoutUrl directly from the cart
      if (cart.value.checkoutUrl) {
        console.log('Redirecting to Shopify checkout:', cart.value.checkoutUrl);
        window.location.href = cart.value.checkoutUrl;
        return cart.value.checkoutUrl;
      }

      console.error('No checkout URL available');
      return null;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      return null;
    }
  };

  // Initialize cart on mount
  onMounted(() => {
    fetchCart()
  })

  return {
    cart,
    isCartOpen,
    isUpdatingCart,
    toggleCart,
    addToCart,
    fetchCart,
    updateCartItem,
    removeCartItem,
    goToCheckout
  }
}
