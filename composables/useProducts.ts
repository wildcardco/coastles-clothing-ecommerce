export const useProducts = () => {
  const getLatestProducts = async () => {
    try {
      const { data, pending, error } = await useAsyncGql({
        operation: 'GetProducts',
        variables: { 
          first: 6,
          variantsFirst: 10
        }
      })
      console.log('Latest Products Response:', {
        data,
        variants: data?.products?.edges?.[0]?.node?.variants?.edges
      })
      return { data, pending, error }
    } catch (error) {
      console.error('Error fetching latest products:', error)
      throw error
    }
  }

  const getAllProducts = async () => {
    try {
      const { data, pending, error } = await useAsyncGql({
        operation: 'GetProducts',
        variables: { 
          first: 50,
          variantsFirst: 10
        }
      })
      console.log('All Products Response:', {
        data,
        productCount: data?.products?.edges?.length,
        firstProductVariants: data?.products?.edges?.[0]?.node?.variants?.edges
      })
      return { data, pending, error }
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }

  const getProduct = async (handle: string) => {
    try {
      const { data, pending, error } = await useAsyncGql({
        operation: 'GetProduct',
        variables: { handle: handle.replace(/-/g, ' ') }
      })
      
      console.log('Raw API Response:', data.value)
      
      return { data, pending, error }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  const getVariantOptions = (product: any) => {
    if (!product?.variants?.edges?.length) return []
    
    const firstVariant = product.variants.edges[0].node
    const optionTypes = firstVariant.selectedOptions.map((opt: any) => opt.name)
    
    return optionTypes.map((optionType: string) => {
      const values = new Set(
        product.variants.edges
          .map((edge: any) => 
            edge.node.selectedOptions.find((opt: any) => opt.name === optionType)?.value
          )
          .filter(Boolean)
      )
      
      return {
        name: optionType,
        values: Array.from(values)
      }
    })
  }

  return {
    getLatestProducts,
    getAllProducts,
    getProduct,
    getVariantOptions
  }
}