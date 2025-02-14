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

  const cartFragment = `
    id
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    checkoutUrl
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
      const response = await fetch('https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '4e299f747bbee0bda43e552b6706e128'
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
      // console.log('Cart create response:', data)
      
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
      // console.log('Fetching cart with ID:', cartId)
      
      if (!cartId) {
        // console.log('No cart ID in localStorage, creating new cart')
        return await createCart()
      }

      const response = await fetch('https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '4e299f747bbee0bda43e552b6706e128'
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
      // console.log('Cart retrieve response:', data)

      if (data?.cart) {
        cart.value = data.cart
        return data.cart
      } else {
        // console.log('Cart not found, creating new cart')
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
        // console.log('No cart exists, creating new cart')
        const newCart = await createCart()
        if (!newCart?.id) {
          throw new Error('Failed to create cart')
        }
        cart.value = newCart
      }

      // console.log('Adding to cart:', {
      //   cartId: cart.value.id,
      //   merchandiseId,
      //   quantity
      // })

      const response = await fetch('https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '4e299f747bbee0bda43e552b6706e128'
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
      // console.log('Cart lines add response:', data)

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
      // console.error('Error adding to cart:', error)
      throw error
    } finally {
      isUpdatingCart.value = false
    }
  }

  const updateCartItem = async (lineId: string, quantity: number) => {
    try {
      isUpdatingCart.value = true
      
      const response = await fetch('https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '4e299f747bbee0bda43e552b6706e128'
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
      // console.error('Error updating cart item:', error)
      throw error
    } finally {
      isUpdatingCart.value = false
    }
  }

  const removeCartItem = async (lineId: string) => {
    try {
      isUpdatingCart.value = true
      
      const response = await fetch('https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '4e299f747bbee0bda43e552b6706e128'
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
    removeCartItem
  }
}
